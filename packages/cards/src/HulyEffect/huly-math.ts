/**
 * Huly Ambient Luminance Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) exponential smoothing: x_t = x_{t-1} + λ(target - x_{t-1}) in O(1)
 * - Zero layout reflow: CSS custom properties --huly-x, --huly-y only
 * - Zero GC: pure number arithmetic, no object creation
 */

/** Exponential low-pass filter step for smooth cursor following */
export function exponentialSmooth(current: number, target: number, lambda: number): number {
  if (Math.abs(target - current) < 0.001) return target;
  return current + lambda * (target - current);
}

/** Converts pointer event coordinates to element-relative percentage (0..100) */
export function toRelativePercent(pointerPos: number, elementStart: number, elementSize: number): number {
  if (elementSize === 0) return 50;
  const percent = ((pointerPos - elementStart) / elementSize) * 100;
  return Math.max(0, Math.min(100, percent));
}

/** Calculates CSS radial-gradient string for the ambient glow */
export function buildHulyGradient(
  xPercent: number,
  yPercent: number,
  glowColor: string,
  radius: number,
  intensity: number
): string {
  const innerAlpha = Math.round(Math.max(0, Math.min(1, intensity)) * 100);
  return `radial-gradient(${radius}% circle at var(--huly-x, ${xPercent}%) var(--huly-y, ${yPercent}%), color-mix(in srgb, ${glowColor} ${innerAlpha}%, transparent), transparent 100%)`;
}
