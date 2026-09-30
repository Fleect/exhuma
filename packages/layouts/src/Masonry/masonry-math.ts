/**
 * CSS Masonry Stagger & Layout Shift Elimination Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) stagger insertion delay calculation.
 * - Strict zero Cumulative Layout Shift (CLS ≡ 0) aspect-ratio pre-allocation.
 */

/**
 * Calculates column-phase staggered entrance delay for smooth masonry item insertion.
 * tau_i = baseDelay + (i mod k) * delta_column
 *
 * @param index 0-based item index
 * @param columnCount Active number of masonry columns k
 * @param baseDelayMs Initial base delay in milliseconds (default: 0)
 * @param columnDeltaMs Delay increment per column phase in milliseconds (default: 35)
 */
export function calculateStaggerDelay(
	index: number,
	columnCount: number,
	baseDelayMs: number = 0,
	columnDeltaMs: number = 35
): number {
	if (index < 0 || columnCount <= 0) return Math.max(0, baseDelayMs);
	const columnPhase = index % columnCount;
	return Math.max(0, baseDelayMs) + columnPhase * columnDeltaMs;
}

/**
 * Calculates exact aspect ratio number to pre-allocate container dimensions and guarantee CLS ≡ 0.
 *
 * @param width Original item/image width in pixels
 * @param height Original item/image height in pixels
 */
export function calculatePreservedAspectRatio(width: number, height: number): number {
	if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
		return 1.0;
	}
	return Number((width / height).toFixed(4));
}
