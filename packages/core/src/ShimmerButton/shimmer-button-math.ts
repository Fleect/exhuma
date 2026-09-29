/**
 * Shimmer Button Conic Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) angle calculation: θ(t) = (ω·t) mod 360 in O(1)
 * - Zero layout reflow: conic-gradient via CSS custom property --shimmer-angle
 * - Zero GC: all maths use primitive number operations, no object allocation
 */

/** Calculates shimmer angle at time t in degrees */
export function calculateShimmerAngle(elapsedMs: number, rpm: number): number {
	const rotationsPerMs = rpm / 60000;
	return (elapsedMs * rotationsPerMs * 360) % 360;
}

/** Calculates spring-compressed scale on pointer press */
export function calculatePressScale(isPressed: boolean, pressDepth: number = 0.96): number {
	return isPressed ? pressDepth : 1.0;
}

/** Calculates CSS conic-gradient string for the perimeter glow */
export function buildConicGradient(
	angle: number,
	shimmerColor: string,
	backgroundColor: string,
	shimmerSize: number
): string {
	const halfSize = shimmerSize / 2;
	return `conic-gradient(from ${angle}deg, ${backgroundColor} 0deg, ${shimmerColor} ${halfSize}deg, ${backgroundColor} ${shimmerSize}deg)`;
}
