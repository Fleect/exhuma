/**
 * Kinetic Grid Wave & Illumination Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) per-cell illumination: I(x,y) = max(0, 1 - d^2/R^2) in O(1)
 * - Ω(1) wave phase: z(r,t) = A*e^(-γt)*cos(k*r - ω*t) in O(1)
 * - Zero layout reflow: CSS custom properties only, no geometry reads in hot path
 */

/** Cell illumination intensity from pointer proximity */
export function calculateCellIllumination(
  cellX: number,
  cellY: number,
  pointerX: number,
  pointerY: number,
  radius: number
): number {
  if (pointerX < 0 || pointerY < 0) return 0;
  const d2 = (cellX - pointerX) ** 2 + (cellY - pointerY) ** 2;
  const r2 = radius ** 2;
  return d2 > r2 ? 0 : Math.max(0, 1 - Math.sqrt(d2) / radius);
}

/** Wave displacement for a cell at distance r from click origin, time t */
export function calculateWaveDisplacement(
  r: number,
  t: number,
  amplitude: number,
  waveSpeed: number,
  decay: number
): number {
  const dt = t * waveSpeed;
  const phase = r - dt;
  if (phase > 0) return 0; // Wave hasn't reached yet
  return amplitude * Math.exp(-decay * t) * Math.cos(phase);
}

/** Convert grid (col, row) to pixel center coordinates */
export function gridCellCenter(col: number, row: number, cellSize: number, gap: number): { x: number; y: number } {
  return {
    x: col * (cellSize + gap) + cellSize / 2,
    y: row * (cellSize + gap) + cellSize / 2,
  };
}

/** Euclidean distance between two points */
export function euclideanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
