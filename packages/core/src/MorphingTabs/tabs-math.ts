/**
 * Morphing Tabs Pure Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) bounds computation and liquid stretch math.
 * - Volume-preserving affine deformation invariant (scaleX * scaleY^2 = 1).
 */

export interface LiquidStretch {
	scaleX: number;
	scaleY: number;
}

/**
 * Calculates volume-preserving liquid stretching during indicator velocity transit.
 * As the capsule elongates horizontally along scaleX, it thins along scaleY.
 *
 * @param velocity Instantaneous velocity of the indicator capsule
 * @param maxVelocity Normalizing velocity ceiling (default: 800 px/s)
 * @param stretchFactor Maximum stretch intensity (default: 0.35)
 */
export function calculateLiquidPillStretch(velocity: number, maxVelocity: number = 800, stretchFactor: number = 0.35): LiquidStretch {
	if (maxVelocity <= 0 || !Number.isFinite(velocity)) {
		return { scaleX: 1, scaleY: 1 };
	}

	const normalizedVelocity = Math.min(1, Math.abs(velocity) / maxVelocity);
	const scaleX = 1 + stretchFactor * normalizedVelocity;
	const scaleY = 1 / Math.sqrt(scaleX);

	return {
		scaleX: Number(scaleX.toFixed(4)),
		scaleY: Number(scaleY.toFixed(4)),
	};
}

/**
 * Computes circular keyboard roving index with modulo wrapping.
 */
export function calculateRovingIndex(currentIndex: number, delta: number, total: number): number {
	if (total <= 0) return 0;
	return (currentIndex + delta + total) % total;
}
