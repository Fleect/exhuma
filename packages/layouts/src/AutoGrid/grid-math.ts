/**
 * AutoGrid Fluid Smoothstep & FLIP Shuffle Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) cubic smoothstep gap interpolation.
 * - Exact deterministic 2D slot coordinates and FLIP shuffle inversion vectors.
 */

/**
 * Calculates continuous fluid gap interpolation using cubic smoothstep S(x) = 3x^2 - 2x^3.
 *
 * @param width Current container or viewport width in pixels
 * @param minWidth Lower bound width (default: 320px)
 * @param maxWidth Upper bound width (default: 1440px)
 * @param minGap Gap at or below minWidth (default: 12px)
 * @param maxGap Gap at or above maxWidth (default: 32px)
 */
export function calculateSmoothstepGap(
	width: number,
	minWidth: number = 320,
	maxWidth: number = 1440,
	minGap: number = 12,
	maxGap: number = 32
): number {
	if (maxWidth <= minWidth) return minGap;
	if (width <= minWidth) return minGap;
	if (width >= maxWidth) return maxGap;

	const x = (width - minWidth) / (maxWidth - minWidth);
	const smoothstep = 3 * x * x - 2 * x * x * x;
	const gap = minGap + (maxGap - minGap) * smoothstep;

	return Number(gap.toFixed(2));
}

/**
 * Calculates 2D Cartesian coordinates (x, y) for a grid cell by 0-based index.
 */
export function calculateGridCellCoordinates(
	index: number,
	columns: number,
	colWidth: number,
	rowHeight: number,
	gap: number
): { x: number; y: number } {
	if (index < 0 || columns <= 0) return { x: 0, y: 0 };

	const col = index % columns;
	const row = Math.floor(index / columns);

	return {
		x: Number((col * (colWidth + gap)).toFixed(2)),
		y: Number((row * (rowHeight + gap)).toFixed(2)),
	};
}

/**
 * Calculates FLIP invert displacement delta between two grid slot positions during shuffle/filter.
 * Delta = OldPosition - NewPosition
 */
export function calculateFlipShuffleDelta(
	oldIndex: number,
	newIndex: number,
	columns: number,
	colWidth: number,
	rowHeight: number,
	gap: number
): { dx: number; dy: number } {
	const oldPos = calculateGridCellCoordinates(oldIndex, columns, colWidth, rowHeight, gap);
	const newPos = calculateGridCellCoordinates(newIndex, columns, colWidth, rowHeight, gap);

	return {
		dx: Number((oldPos.x - newPos.x).toFixed(2)),
		dy: Number((oldPos.y - newPos.y).toFixed(2)),
	};
}
