import React from 'react';
import type { AutoGridProps, AutoGridItemProps } from '../types';

export const AutoGridItem: React.FC<AutoGridItemProps> = ({ children, colSpan, rowSpan, className = '', style }) => {
	const itemStyle: React.CSSProperties = {
		gridColumn: colSpan === 'full' ? '1 / -1' : typeof colSpan === 'number' ? `span ${colSpan}` : undefined,
		gridRow: typeof rowSpan === 'number' ? `span ${rowSpan}` : undefined,
		...style,
	};

	return (
		<div className={`exhuma-auto-grid-item ${className}`} style={itemStyle}>
			{children}
		</div>
	);
};

export const AutoGrid: React.FC<AutoGridProps> = ({ children, minItemWidth = 280, gap = '1.5rem', mode = 'auto-fit', maxColumns, alignItems, className = '', style }) => {
	const minWidthVal = typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth;
	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;
	const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
	const minTrack = `min(100%, ${minWidthVal})`;

	const gridStyle: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns:
			maxColumns && maxColumns > 0 ? `repeat(${repeatTrack}, minmax(max(${minTrack}, calc((100% - ${maxColumns - 1} * ${gapVal}) / ${maxColumns})), 1fr))` : `repeat(${repeatTrack}, minmax(${minTrack}, 1fr))`,
		gap: gapVal,
		alignItems,
		...style,
	};

	return (
		<div className={`exhuma-auto-grid w-full ${className}`} style={gridStyle}>
			{children}
		</div>
	);
};
