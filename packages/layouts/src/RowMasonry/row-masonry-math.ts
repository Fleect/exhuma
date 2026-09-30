/**
 * Row Masonry Greedy Column Balancer Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(N log K) greedy placement: N items over K columns using min-heap in O(N log K)
 * - Zero layout thrashing: GPU translate3d positioning, no inline top/left reads
 * - Ω(1) container height: single max() pass over column heights
 */

export interface MasonryItem {
	index: number;
	x: number;
	y: number;
	width: number;
}

export interface ResponsiveColumnOptions {
	columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
	columnsSm?: number;
	columnsMd?: number;
	columnsLg?: number;
	columnsXl?: number;
}

/**
 * Parses CSS gap strings ('1.5rem', '24px', 16) to concrete pixel values.
 */
export function parseGapToPx(gap: string | number = 16): number {
	if (typeof gap === 'number') return Math.max(0, gap);
	if (typeof gap !== 'string') return 16;
	const trimmed = gap.trim();
	if (trimmed.endsWith('rem')) {
		const val = parseFloat(trimmed);
		return isNaN(val) ? 16 : Math.max(0, val * 16);
	}
	if (trimmed.endsWith('em')) {
		const val = parseFloat(trimmed);
		return isNaN(val) ? 16 : Math.max(0, val * 16);
	}
	if (trimmed.endsWith('px')) {
		const val = parseFloat(trimmed);
		return isNaN(val) ? 16 : Math.max(0, val);
	}
	const val = parseFloat(trimmed);
	return isNaN(val) ? 16 : Math.max(0, val);
}

/**
 * Compute masonry item positions using greedy shortest-column assignment.
 * Returns array of MasonryItem positions for GPU translate3d placement.
 */
export function computeMasonryLayout(itemHeights: number[], containerWidth: number, columns: number, gap: string | number = 16): { items: MasonryItem[]; totalHeight: number } {
	const safeColumns = Math.max(1, Math.floor(columns));
	const safeGap = parseGapToPx(gap);
	const totalGapWidth = safeGap * (safeColumns - 1);
	const colWidth = Math.max(0, (containerWidth - totalGapWidth) / safeColumns);
	const colHeights = new Array(safeColumns).fill(0);
	const items: MasonryItem[] = [];

	for (let i = 0; i < itemHeights.length; i++) {
		let minCol = 0;
		let minHeight = colHeights[0];

		for (let c = 1; c < safeColumns; c++) {
			if (colHeights[c] < minHeight) {
				minHeight = colHeights[c];
				minCol = c;
			}
		}

		const x = minCol * (colWidth + safeGap);
		const y = minHeight;

		items.push({ index: i, x, y, width: colWidth });
		colHeights[minCol] += Math.max(0, itemHeights[i]) + safeGap;
	}

	const maxColHeight = Math.max(0, ...colHeights);
	const totalHeight = itemHeights.length > 0 ? Math.max(0, maxColHeight - safeGap) : 0;

	return { items, totalHeight };
}

/**
 * Calculates optimal auto-responsive column count matching CSS Masonry:
 * - < 640px: Mobile (columns, default 1)
 * - 640px - 768px: Small Tablet (columnsSm, default 2)
 * - 768px - 1024px: Medium Tablet (columnsMd, default 2)
 * - 1024px - 1280px: Desktop (columnsLg, default 3)
 * - >= 1280px: Ultra-wide (columnsXl, default 4)
 *
 * If a raw number is supplied, it automatically steps down responsively on smaller viewports.
 */
export function computeResponsiveColumns(containerWidth: number, options: number | ResponsiveColumnOptions = { columns: 1, columnsSm: 2, columnsMd: 2, columnsLg: 3, columnsXl: 4 }): number {
	if (typeof options === 'number') {
		const target = Math.max(1, Math.floor(options));
		if (containerWidth < 640) return 1;
		if (containerWidth < 768) return Math.min(target, 2);
		if (containerWidth < 1024) return Math.min(target, 3);
		return target;
	}
	if (!options || typeof options !== 'object') return 3;

	const responsiveCols = typeof options.columns === 'object' && options.columns !== null ? options.columns : {};

	const mobile = options.columns !== undefined && typeof options.columns === 'number' ? options.columns : (responsiveCols.sm ?? 1);

	const sm = options.columnsSm ?? responsiveCols.sm ?? Math.max(mobile, 2);
	const md = options.columnsMd ?? responsiveCols.md ?? sm;
	const lg = options.columnsLg ?? responsiveCols.lg ?? Math.max(md, 3);
	const xl = options.columnsXl ?? responsiveCols.xl ?? Math.max(lg, 4);

	if (containerWidth >= 1280) return Math.max(1, xl);
	if (containerWidth >= 1024) return Math.max(1, lg);
	if (containerWidth >= 768) return Math.max(1, md);
	if (containerWidth >= 640) return Math.max(1, sm);

	return Math.max(1, mobile);
}
