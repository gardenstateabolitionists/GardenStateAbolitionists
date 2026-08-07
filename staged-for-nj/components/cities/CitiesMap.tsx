'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CityConfig } from '@/lib/data/cities';
import { US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * Interactive SVG map of Michigan with pinned cities.
 *
 * - Pins and legend are sorted by population descending, so pin #1 is
 *   always the largest covered city (Detroit).
 * - Zoom: buttons (+ / − / reset), mouse wheel, and pinch-to-zoom on
 *   touch devices. The map's viewBox is mutated in-place; the SVG
 *   itself scales via width/height, so no CSS transform math.
 * - Projection: calibrated against MI path bbox × MI's geographic
 *   bbox — pins land on the right part of the shape.
 */

const MI_BBOX_SVG = { x: 852.2, y: 83.7, w: 134.9, h: 140.6 };
const MI_BBOX_GEO = { minLat: 41.7, maxLat: 48.3, minLng: -90.5, maxLng: -82.4 };
const DEFAULT_VIEW = { x: 848, y: 80, w: 143, h: 149 };

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    MI_BBOX_SVG.x +
    ((lng - MI_BBOX_GEO.minLng) / (MI_BBOX_GEO.maxLng - MI_BBOX_GEO.minLng)) * MI_BBOX_SVG.w;
  const y =
    MI_BBOX_SVG.y +
    ((MI_BBOX_GEO.maxLat - lat) / (MI_BBOX_GEO.maxLat - MI_BBOX_GEO.minLat)) * MI_BBOX_SVG.h;
  return { x, y };
}

const MI_PATH = US_STATE_PATHS.find((s) => s.id === 'MI');

// Clamp the viewBox so zoom + pan can't fly the map off-screen.
const MIN_W = 20;
const MAX_W = 400;

export default function CitiesMap({ cities }: { cities: CityConfig[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Sort largest first — pin numbers reflect population rank.
  const ranked = [...cities].sort((a, b) => b.population - a.population);
  const [view, setView] = useState(DEFAULT_VIEW);

  // Zoom: multiplier > 1 zooms out (larger viewBox); < 1 zooms in.
  function zoom(factor: number, focusSvg?: { x: number; y: number }) {
    setView((v) => {
      const newW = Math.min(MAX_W, Math.max(MIN_W, v.w * factor));
      const newH = (newW / v.w) * v.h;
      // Zoom toward the focus point (mouse position or center)
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

  // Convert client (pixel) coordinates to SVG-space using the SVG's
  // current CTM. Used for wheel-zoom's focus point.
  function clientToSvg(clientX: number, clientY: number): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const inv = ctm.inverse();
    const p = pt.matrixTransform(inv);
    return { x: p.x, y: p.y };
  }

  // Mouse wheel: zoom into the pointer's SVG position.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const focus = clientToSvg(e.clientX, e.clientY);
      // Scroll up = zoom in (smaller viewBox); down = zoom out.
      const factor = e.deltaY < 0 ? 0.85 : 1.18;
      zoom(factor, focus || undefined);
    }
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  // Pinch-to-zoom + drag-to-pan on touch devices.
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
        const dx = pts[0].x - pts[1].x;
        const dy = pts[0].y - pts[1].y;
        const dist = Math.hypot(dx, dy);
        if (lastPinchDist.current != null) {
          const factor = lastPinchDist.current / dist;
          zoom(factor);
        }
        lastPinchDist.current = dist;
        lastPan.current = null;
        e.preventDefault();
      } else if (pts.length === 1 && lastPan.current) {
        const dx = e.clientX - lastPan.current.x;
        const dy = e.clientY - lastPan.current.y;
        const svgEl = svgRef.current;
        if (!svgEl) return;
        const rect = svgEl.getBoundingClientRect();
        const scaleX = view.w / rect.width;
        const scaleY = view.h / rect.height;
        setView((v) => ({ x: v.x - dx * scaleX, y: v.y - dy * scaleY, w: v.w, h: v.h }));
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

  if (!MI_PATH) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-hidden">
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          className="w-full h-auto max-h-[600px] touch-none select-none cursor-grab active:cursor-grabbing"
          role="img"
          aria-label="Map of Michigan with pins marking cities Abolish Abortion Michigan covers"
        >
          <path
            d={MI_PATH.d}
            fill="#e5e7eb"
            stroke="#374151"
            strokeWidth={Math.max(0.3, view.w / DEFAULT_VIEW.w * 0.6)}
          />

          {ranked.map((c, i) => {
            const { x, y } = project(c.latitude, c.longitude);
            const zoomFactor = view.w / DEFAULT_VIEW.w;
            // Larger min radius so 2-3 digit numbers fit inside the
            // circle without overhanging. Font shrinks slightly for
            // 3-digit numbers (100+).
            const digits = String(i + 1).length;
            const baseR = 4.2 + Math.sqrt(c.population) / 280 + (digits - 1) * 0.7;
            const r = Math.max(4, Math.min(9, baseR * Math.min(1, zoomFactor)));
            const fontSize = Math.max(2.5, (digits >= 3 ? 3.2 : 3.8) * Math.min(1, zoomFactor));
            return (
              <a key={c.slug} href={`/cities/${c.slug}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth={Math.max(0.4, 1.1 * Math.min(1, zoomFactor))}
                >
                  <title>{`${i + 1}. ${c.name} — ${c.populationLabel}`}</title>
                </circle>
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
              </a>
            );
          })}
        </svg>

        {/* Zoom controls — top-right overlay */}
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
        Zoom with buttons, scroll wheel, or pinch. Pins are numbered by population rank (largest first).
      </p>

      {/* Numbered legend, in same population-desc order as the pins */}
      <ol className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-sm max-h-[400px] overflow-y-auto">
        {ranked.map((c, i) => (
          <li key={c.slug} className="flex items-baseline gap-2">
            <span className="inline-flex items-center justify-center w-6 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex-shrink-0 tabular-nums">
              {i + 1}
            </span>
            <Link
              href={`/cities/${c.slug}`}
              className="text-gray-800 hover:text-red-700 hover:underline truncate"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
