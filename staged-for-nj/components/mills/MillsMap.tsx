'use client';

import { useEffect, useRef, useState } from 'react';
import type { AbortionMill } from '@/lib/data/abortion-mills';
import { US_STATE_PATHS } from '@/lib/data/us-map-paths';

// MI-only zoom + pan map with a pin per abortion facility. Projection
// constants are calibrated to the same MI path bbox × MI geographic
// bbox that CitiesMap uses, so pins land in the same spots.

const MI_BBOX_SVG = { x: 852.2, y: 83.7, w: 134.9, h: 140.6 };
const MI_BBOX_GEO = { minLat: 41.7, maxLat: 48.3, minLng: -90.5, maxLng: -82.4 };
const DEFAULT_VIEW = { x: 848, y: 80, w: 143, h: 149 };
const MIN_W = 20;
const MAX_W = 400;

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

export default function MillsMap({ mills }: { mills: AbortionMill[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
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
    const inv = ctm.inverse();
    const p = pt.matrixTransform(inv);
    return { x: p.x, y: p.y };
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const focus = clientToSvg(e.clientX, e.clientY);
      const factor = e.deltaY < 0 ? 0.85 : 1.18;
      zoom(factor, focus || undefined);
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
          aria-label="Map of Michigan with pins marking every abortion facility"
        >
          <path
            d={MI_PATH.d}
            fill="#e5e7eb"
            stroke="#374151"
            strokeWidth={Math.max(0.3, (view.w / DEFAULT_VIEW.w) * 0.6)}
          />

          {mills.map((m) => {
            const { x, y } = project(m.latitude, m.longitude);
            const zoomFactor = view.w / DEFAULT_VIEW.w;
            const r = Math.max(2.6, 4.2 * Math.min(1, zoomFactor));
            // Closed facilities: hollow gray pin, no fill. Still shown so
            // the historical footprint stays visible.
            return (
              <g key={m.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={m.closed ? '#ffffff' : '#dc2626'}
                  stroke={m.closed ? '#6b7280' : '#ffffff'}
                  strokeWidth={Math.max(0.35, (m.closed ? 1.2 : 1) * Math.min(1, zoomFactor))}
                  strokeDasharray={m.closed ? '1 1' : undefined}
                >
                  <title>{`${m.name}${m.closed ? ' (CLOSED)' : ''} — ${m.address}`}</title>
                </circle>
              </g>
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
        Zoom with buttons, scroll wheel, or pinch. Every red pin is a currently-operating Michigan
        abortion facility.
      </p>
    </div>
  );
}
