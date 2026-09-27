/**
 * Kinetic Proximity Distribution Kernel — Exhuma Kinetic Methodology (EKM)
 * Authentic macOS Dock Magnification Engine
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time O(1) analytical calculation with zero memory allocations in rAF loop.
 * - C1-continuous smooth cosine bell distribution with zero boundary jerk.
 * - Smooth asymptotic lerp decay for graceful entry/exit transitions.
 */

export type DockDirection = 'bottom' | 'top' | 'left' | 'right';
export type DockPanelStyle = 'glass' | 'translucent' | 'minimal';

/**
 * Calculates continuous Cosine Bell magnification multiplier based on distance.
 * C1 continuous with zero derivatives at d=0 and d=influenceRadius (zero boundary pop).
 *
 * @param distance Absolute distance in pixels between pointer and item center |coord - itemCenter|
 * @param influenceRadius Total spread radius where magnification decays to 1.0
 * @param maxMagnification Maximum scale increase factor (e.g. 0.65 for 1.65x max scale)
 */
export function calculateDockScale(distance: number, influenceRadius: number = 85, maxMagnification: number = 0.65): number {
	const absDist = Math.abs(distance);
	if (influenceRadius <= 0 || absDist >= influenceRadius) return 1.0;
	const factor = Math.cos((absDist / influenceRadius) * (Math.PI / 2));
	return 1.0 + maxMagnification * factor * factor;
}

/**
 * Calculates continuous Gaussian magnification multiplier based on distance (backward compatibility).
 */
export function calculateGaussianScale(distance: number, influenceRadius: number = 70, maxMagnification: number = 0.6): number {
	if (influenceRadius <= 0) return 1.0;
	const absDist = Math.abs(distance);
	if (absDist >= influenceRadius * 2.5) return 1.0;
	const exponent = -(absDist * absDist) / (2 * influenceRadius * influenceRadius);
	return 1.0 + maxMagnification * Math.exp(exponent);
}

/**
 * Computes exact item width/height in pixels using the Gaussian proximity curve.
 */
export function calculateDockItemSize(distance: number, baseSize: number = 36, influenceRadius: number = 60, maxMagnification: number = 0.75): number {
	return baseSize * calculateGaussianScale(distance, influenceRadius, maxMagnification);
}

/**
 * Interpolates current scale towards target scale for smooth entry/exit decay.
 */
export function lerpDockScale(current: number, target: number, speed: number = 0.25): number {
	const diff = target - current;
	if (Math.abs(diff) < 0.002) return target;
	return current + diff * speed;
}
