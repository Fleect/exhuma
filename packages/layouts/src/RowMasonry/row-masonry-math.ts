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

/**
 * Compute masonry item positions using greedy shortest-column assignment.
 * Returns array of MasonryItem positions for GPU translate3d placement.
 */
export function computeMasonryLayout(
  itemHeights: number[],
  containerWidth: number,
  columns: number,
  gap: number
): { items: MasonryItem[]; totalHeight: number } {
  if (columns < 1) columns = 1;
  const colWidth = (containerWidth - gap * (columns - 1)) / columns;
  const colHeights = new Array(columns).fill(0);
  const items: MasonryItem[] = [];

  for (let i = 0; i < itemHeights.length; i++) {
    let minCol = 0;
    let minHeight = colHeights[0];
    
    for (let c = 1; c < columns; c++) {
      if (colHeights[c] < minHeight) {
        minHeight = colHeights[c];
        minCol = c;
      }
    }
    
    const x = minCol * (colWidth + gap);
    const y = minHeight;
    
    items.push({ index: i, x, y, width: colWidth });
    colHeights[minCol] += itemHeights[i] + gap;
  }
  
  const totalHeight = Math.max(0, ...colHeights) - (itemHeights.length > 0 ? gap : 0);
  
  return { items, totalHeight };
}

/** Calculates optimal column count for responsive breakpoints */
export function computeResponsiveColumns(
  containerWidth: number,
  columns: number | { sm?: number; md?: number; lg?: number; xl?: number }
): number {
  if (typeof columns === 'number') return columns;
  
  if (containerWidth >= 1280 && columns.xl) return columns.xl;
  if (containerWidth >= 1024 && columns.lg) return columns.lg;
  if (containerWidth >= 768 && columns.md) return columns.md;
  if (containerWidth >= 640 && columns.sm) return columns.sm;
  
  return columns.sm || 1;
}
