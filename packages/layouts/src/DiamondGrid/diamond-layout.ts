/**
 * Diamond Grid Partitioning Algorithm — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Deterministic rhombic distribution in O(N) linear time
 * - Zero memory leaks or recursive call stacks
 */

export interface DiamondLayoutConfig {
	maxItems: number;
	columns: number;
	pattern: number[];
}

export const DIAMOND_LAYOUT_CONFIGS: Record<'large' | 'medium' | 'small', DiamondLayoutConfig> = {
	large: { maxItems: 16, columns: 7, pattern: [1, 2, 3, 4, 3, 2, 1] },
	medium: { maxItems: 9, columns: 5, pattern: [1, 2, 3, 2, 1] },
	small: { maxItems: 4, columns: 3, pattern: [1, 2, 1] },
};

export type DiamondLayoutVariant = 'large' | 'medium' | 'small' | 'auto';

/**
 * Determines layout configuration based on total available item count or manual layout override.
 */
export function getDiamondLayoutConfig(totalItems: number, layout: DiamondLayoutVariant = 'auto'): DiamondLayoutConfig {
	if (layout === 'large') return DIAMOND_LAYOUT_CONFIGS.large;
	if (layout === 'medium') return DIAMOND_LAYOUT_CONFIGS.medium;
	if (layout === 'small') return DIAMOND_LAYOUT_CONFIGS.small;

	if (totalItems >= 16) return DIAMOND_LAYOUT_CONFIGS.large;
	if (totalItems >= 9) return DIAMOND_LAYOUT_CONFIGS.medium;
	if (totalItems >= 4) return DIAMOND_LAYOUT_CONFIGS.small;
	return {
		maxItems: totalItems,
		columns: Math.max(1, Math.min(totalItems, 3)),
		pattern: [],
	};
}

export interface DiamondGroup<T> {
	item: T;
	index: number;
}

/**
 * Partitions a list of items into rhombic column groups.
 */
export function partitionDiamondItems<T>(items: T[], config: DiamondLayoutConfig): DiamondGroup<T>[][] {
	const columns: DiamondGroup<T>[][] = Array.from({ length: config.columns }, () => []);
	const displayedItems = items.slice(0, config.maxItems);
	let itemIndex = 0;

	if (config.pattern.length === 0) {
		for (let col = 0; col < config.columns && itemIndex < displayedItems.length; col++) {
			columns[col].push({ item: displayedItems[itemIndex], index: itemIndex });
			itemIndex++;
		}
		return columns;
	}

	for (let columnIndex = 0; columnIndex < config.pattern.length && itemIndex < displayedItems.length; columnIndex++) {
		const itemsInColumn = config.pattern[columnIndex];
		for (let i = 0; i < itemsInColumn && itemIndex < displayedItems.length; i++) {
			columns[columnIndex].push({ item: displayedItems[itemIndex], index: itemIndex });
			itemIndex++;
		}
	}

	return columns;
}

/**
 * Calculates 2D concentric elevation wave across isometric grid.
 * z_{r, c}(t) = A_0 * exp(-d^2 / (2 * sigma^2)) * sin(omega * t - k * d) * exp(-lambda * t)
 *
 * @param row Grid cell row index
 * @param col Grid cell column index
 * @param centerRow Wave epicenter row index
 * @param centerCol Wave epicenter column index
 * @param t Elapsed time in seconds
 * @param amplitude Initial wave peak amplitude in pixels (default: 16)
 * @param sigma Spatial dispersion radius (default: 2.5)
 * @param omega Temporal oscillation frequency in rad/s (default: 8)
 * @param k Spatial wavenumber (default: 1.2)
 * @param decay Exponential temporal attenuation (default: 2.0)
 */
export function calculateConcentricRipple(
	row: number,
	col: number,
	centerRow: number,
	centerCol: number,
	t: number,
	amplitude: number = 16,
	sigma: number = 2.5,
	omega: number = 8,
	k: number = 1.2,
	decay: number = 2.0
): number {
	if (t <= 0 || amplitude <= 0) return 0;

	const dr = row - centerRow;
	const dc = col - centerCol;
	const dist = Math.sqrt(dr * dr + dc * dc);

	const spatialEnvelope = Math.exp(-(dist * dist) / (2 * sigma * sigma));
	const temporalDecay = Math.exp(-decay * t);
	const phase = omega * t - k * dist;
	const z = amplitude * spatialEnvelope * Math.sin(phase) * temporalDecay;

	return Number(z.toFixed(2));
}

/**
 * Calculates cursor proximity elevation lift along isometric Z-axis.
 * Delta z = Z_max / (1 + ||p - p_tile||^2 / R^2)
 *
 * @param cursorX Cursor X coordinate in container
 * @param cursorY Cursor Y coordinate in container
 * @param tileCenterX Tile center X in container
 * @param tileCenterY Tile center Y in container
 * @param maxLift Maximum elevation in pixels (default: 18)
 * @param radius Influence radius in pixels (default: 90)
 */
export function calculateIsometricLift(cursorX: number, cursorY: number, tileCenterX: number, tileCenterY: number, maxLift: number = 18, radius: number = 90): number {
	if (radius <= 0 || maxLift <= 0) return 0;
	const dx = cursorX - tileCenterX;
	const dy = cursorY - tileCenterY;
	const distSq = dx * dx + dy * dy;

	const lift = maxLift / (1 + distSq / (radius * radius));
	return Number(lift.toFixed(2));
}
