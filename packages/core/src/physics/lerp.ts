/**
 * Exhuma Kinetic Methodology (EKM) — Mathematical Interpolation Kernel
 * Closed-form linear and exponential smoothing routines with O(1) bounds.
 */

/**
 * Clamps a numerical value within [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Standard linear interpolation between a and b by factor t.
 */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/**
 * Frame-rate independent exponential smoothing filter:
 * L_t = L_target - (L_target - L_current) * exp(-decay * dt)
 */
export function exponentialSmoothing(current: number, target: number, decay: number, dt: number): number {
	return target - (target - current) * Math.exp(-decay * dt);
}

export const damp = exponentialSmoothing;

/**
 * Normalizes a pointer coordinate relative to a bounding box dimension.
 * Returns a value in [0, 1] (or beyond if unbounded).
 */
export function normalizeCoordinate(pointerPos: number, boxStart: number, boxDimension: number): number {
	if (boxDimension <= 0) return 0;
	return (pointerPos - boxStart) / boxDimension;
}
