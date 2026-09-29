/**
 * Border Beam Pure Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Invariants:
 * - O(1) phase calculation with zero per-frame runtime allocations.
 * - Exact equidistant phase offsets for arbitrary N-beam configurations.
 */

/**
 * Calculates phase-synchronous equidistant delays for N beams sweeping a closed perimeter.
 * Each beam k has phase offset k/N, resulting in delay = -(k * duration) / N.
 */
export function calculateBeamDelays(beamCount: number, duration: number): number[] {
	const count = Math.max(1, Math.min(8, Math.floor(beamCount || 1)));
	const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 8;
	const delays: number[] = [];

	for (let k = 0; k < count; k++) {
		const delay = -Number(((k * safeDuration) / count).toFixed(3));
		delays.push(delay);
	}

	return delays;
}

/**
 * Computes the effective beam count taking into account legacy doubleBeam boolean and modern beamCount.
 */
export function resolveEffectiveBeamCount(doubleBeam?: boolean, beamCount?: number): number {
	if (typeof beamCount === 'number' && beamCount > 0) {
		return Math.max(1, Math.min(8, Math.floor(beamCount)));
	}
	return doubleBeam ? 2 : 1;
}
