'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CityConfig } from '@/lib/data/cities';
import {
  project,
  DEFAULT_VIEW,
  MIN_W,
  MAX_W,
  NJ_PATH,
  outlineStrokeWidth,
} from '@/lib/nj-map-projection';

/**
 * Interactive map of New Jersey with a pin per covered city.
 *
 * Two things differ from the Michigan map this was forked from, both forced by
 * the geography rather than by taste:
 *
 * 1. **Scale.** Michigan occupies ~135 units of this atlas; New Jersey ~24. Every
 *    radius, font size and stroke width from the original is therefore about
 *    five times too large, so none of them were carried over. The projection
 *    itself is shared with MillsMap — see lib/nj-map-projection.ts.
 *
 * 2. **Density.** Michigan's covered cities are spread across a large state. New
 *    Jersey's are not: Jersey City, Bayonne, Hoboken, Union City, North Bergen
 *    and West New York sit within a few miles of each other in Hudson County,
 *    and at the default zoom their pins nearly coincide. A rank number baked
 *    into every pin would be illegible mush there, so numbers fade in only once
 *    the view is zoomed enough to hold them. Every pin keeps a <title>, and the
 *    numbered legend below is always available — the number is never the only
 *    way to identify a pin.
 */

// Below this zoom factor a two-digit number cannot fit inside a pin.
const LABEL_ZOOM_THRESHOLD = 0.55;

export default function CitiesMap({ cities }: { cities: CityConfig[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const ranked = [...cities].sort((a, b) => b.population - a.population);
  const [view, setView] = useState(DEFAULT_VIEW);

  function zoom(factor: number, focusSvg?: { x: number; y: number }) {
    setView((v) => {
      const newW = Math.min(MAX_W, Math.max(MIN_W, v.w * factor));
      const newH = (newW / v.w) * v.h;
      const cx = focusSvg ? focusSvg.x : v.x + v.w / 2;
      const cy = focusSvg ? focusSvg.y : v.y + v.h / 2;
      const newX = cx - (cx - v.x) * (newW / v.w);
      const newY = cy - (cy - v.y) * (newH / v.h);
      return { x: newX, y: newY, w: newW, h: newH };
    });
  }

  function reset() {
    setView(DEFAULT_VIEW);
  }

  function clientToSvg(clientX: number, clientY: number): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const focus = clientToSvg(e.clientX, e.clientY);
      zoom(e.deltaY < 0 ? 0.85 : 1.18, focus || undefined);
    }
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDist = useRef<number | null>(null);
  const lastPan = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onPointerDown(e: PointerEvent) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 1) lastPan.current = { x: e.clientX, y: e.clientY };
    }
    function onPointerMove(e: PointerEvent) {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const pts = [...pointers.current.values()];
      if (pts.length === 2) {
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (lastPinchDist.current != null) zoom(lastPinchDist.current / dist);
        lastPinchDist.current = dist;
        lastPan.current = null;
        e.preventDefault();
      } else if (pts.length === 1 && lastPan.current) {
        const dx = e.clientX - lastPan.current.x;
        const dy = e.clientY - lastPan.current.y;
        const svgEl = svgRef.current;
        if (!svgEl) return;
        const rect = svgEl.getBoundingClientRect();
        setView((v) => ({
          x: v.x - dx * (v.w / rect.width),
          y: v.y - dy * (v.h / rect.height),
          w: v.w,
          h: v.h,
        }));
        lastPan.current = { x: e.clientX, y: e.clientY };
      }
    }
    function onPointerUp(e: PointerEvent) {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) lastPinchDist.current = null;
      if (pointers.current.size === 0) lastPan.current = null;
    }
    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointercancel', onPointerUp);
    return () => {
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerup', onPointerUp);
      svg.removeEventListener('pointercancel', onPointerUp);
    };
  }, [view.w, view.h]);

  if (!NJ_PATH) return null;

  const zoomFactor = view.w / DEFAULT_VIEW.w;
  const showLabels = zoomFactor <= LABEL_ZOOM_THRESHOLD;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-hidden">
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          className="w-full h-auto max-h-[600px] touch-none select-none cursor-grab active:cursor-grabbing"
          role="img"
          aria-label={`Map of New Jersey with pins marking the ${ranked.length} cities Garden State Abolitionists covers`}
        >
          <path
            d={NJ_PATH.d}
            fill="#e5e7eb"
            stroke="#374151"
            strokeWidth={outlineStrokeWidth(view.w)}
          />

          {ranked.map((c, i) => {
            const { x, y } = project(c.latitude, c.longitude);
            // Population nudges the radius a little so the big cities read as
            // big, but the range is deliberately narrow — Newark is 7x
            // Hillsborough and a radius ratio that large would swallow its
            // neighbours whole.
            const baseR = 0.75 + Math.sqrt(c.population) / 1400;
            const r = Math.max(0.5, baseR * Math.min(1, zoomFactor));
            const fontSize = 1.15 * Math.min(1, zoomFactor);
            return (
              <a key={c.slug} href={`/cities/${c.slug}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="#15803d"
                  stroke="#ffffff"
                  strokeWidth={Math.max(0.06, 0.18 * Math.min(1, zoomFactor))}
                >
                  <title>{`${i + 1}. ${c.formalName} — ${c.populationLabel}`}</title>
                </circle>
                {showLabels && (
                  <text
                    x={x}
                    y={y + fontSize * 0.35}
                    fontSize={fontSize}
                    fontWeight={700}
                    fill="#ffffff"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {i + 1}
                  </text>
                )}
              </a>
            );
          })}
        </svg>

        <div className="absolute top-2 right-2 flex flex-col gap-1 bg-white/90 rounded shadow border border-gray-200 p-1">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoom(0.72)}
            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 rounded"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoom(1.4)}
            className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 rounded"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={reset}
            className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-100 rounded"
            title="Reset view"
          >
            ⤾
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Zoom with the buttons, scroll wheel, or pinch. Pins are numbered by population,
        largest first &mdash; zoom in to see the numbers on the map, or use the list below.
      </p>

      <ol className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-sm max-h-[400px] overflow-y-auto">
        {ranked.map((c, i) => (
          <li key={c.slug} className="flex items-baseline gap-2">
            <span className="inline-flex items-center justify-center w-6 h-5 rounded-full bg-green-700 text-white text-[10px] font-bold flex-shrink-0 tabular-nums">
              {i + 1}
            </span>
            <Link
              href={`/cities/${c.slug}`}
              className="text-gray-800 hover:text-green-800 hover:underline truncate"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
