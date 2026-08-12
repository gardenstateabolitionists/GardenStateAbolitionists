import { US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * Shared New Jersey map projection.
 *
 * Both `MillsMap` and `CitiesMap` draw the same state outline and must put a
 * given lat/lng on the same pixel, so the transform lives in one place. It was
 * previously inlined in MillsMap with a comment saying CitiesMap used the same
 * numbers — which was a promise the type system could not keep.
 *
 * A naive linear lat/lng -> bbox mapping does NOT work here. The atlas is drawn
 * in an Albers-style projection, which rotates states away from the central
 * meridian; New Jersey is far enough east that the rotation is obvious — its
 * leftmost point in SVG space sits at a NORTHERN latitude, not in the
 * south-west where its westernmost longitude actually is. A bbox-to-bbox map
 * cannot represent that, and it left pins hanging off the top of the state.
 *
 * These coefficients are an affine transform fitted by iterative closest point
 * against New Jersey's real boundary (GeoJSON) matched to this SVG outline.
 * Worst boundary residual 1.17 SVG units, mean 0.24, on a state 23.6 units
 * wide. The cross terms are the rotation.
 *
 * If the underlying atlas paths are ever regenerated, refit — do not hand-tune.
 */
export const PROJ = {
  ax: 16.368367, ay: -5.139948, ac: 2554.7293,
  bx: -4.235538, by: -21.445051, bc: 770.0035,
};

export function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: PROJ.ax * lng + PROJ.ay * lat + PROJ.ac,
    y: PROJ.bx * lng + PROJ.by * lat + PROJ.bc,
  };
}

export const DEFAULT_VIEW = { x: 1110.2, y: 194.0, w: 32, h: 64 };

/** NJ is ~24 SVG units wide. Michigan's old limits (20/400) were meaningless here. */
export const MIN_W = 4;
export const MAX_W = 80;

export const NJ_PATH = US_STATE_PATHS.find((s) => s.id === 'NJ');

/**
 * Everything on this map is sized against a state ~24 units across, where
 * Michigan's was ~135. Constants tuned for Michigan are roughly 5x too large
 * here, which is why they are derived rather than copied.
 */
export function outlineStrokeWidth(viewW: number): number {
  return Math.max(0.07, (viewW / DEFAULT_VIEW.w) * 0.14);
}
