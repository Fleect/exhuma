'use client';

import React, { Children, useId, useMemo } from 'react';
import type { DiamondGridProps, DiamondColumnProps, DiamondItemProps } from '../types';
import { getDiamondLayoutConfig, partitionDiamondItems } from './diamond-layout';

export const DiamondColumn = React.forwardRef<HTMLDivElement, DiamondColumnProps>(({ children, columnIndex, gap = 16, className = '', style, ...props }, ref) => {
	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;
	return (
		<div
			ref={ref}
			className={`exhuma-diamond-column flex flex-col items-center justify-center ${className}`}
			style={{
				gridColumn: columnIndex + 1,
				gap: gapVal,
				...style,
			}}
			{...props}
		>
			{children}
		</div>
	);
});
DiamondColumn.displayName = 'DiamondColumn';

export const DiamondItem = React.forwardRef<HTMLDivElement, DiamondItemProps>(({ children, mode = 'rhombic', diamond = false, className = '', ...props }, ref) => {
	const isIsometric = mode === 'isometric' || diamond;
	if (isIsometric) {
		return (
			<div
				ref={ref}
				className={`exhuma-diamond-item exhuma-diamond-isometric group border-border/80 bg-card/80 hover:border-primary hover:shadow-primary/20 relative flex aspect-square rotate-45 items-center justify-center rounded-xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-lg ${className}`}
				{...props}
			>
				<div className='flex -rotate-45 flex-col items-center justify-center'>{children}</div>
			</div>
		);
	}
	return (
		<div ref={ref} className={`exhuma-diamond-item ${className}`} {...props}>
			{children}
		</div>
	);
});
DiamondItem.displayName = 'DiamondItem';

export type DiamondGridComponent = React.ForwardRefExoticComponent<DiamondGridProps & React.RefAttributes<HTMLDivElement>> & {
	Grid: DiamondGridComponent;
	Column: typeof DiamondColumn;
	Item: typeof DiamondItem;
};

/**
 * DiamondGrid — Exhuma Kinetic Methodology (EKM)
 * Rhombic symmetrical topology kernel.
 *
 * Symmetrical rhombic column layout [1, 2, 3, 4, 3, 2, 1] with container-query
 * responsive mobile collapse.
 *
 * Modes:
 * - 'rhombic' (Default): Signature classic upright cards forming rhombic column silhouette.
 * - 'isometric': 45-degree diamond cards with counter-rotated upright contents.
 */
const DiamondGridRoot = React.forwardRef<HTMLDivElement, DiamondGridProps>(({ children, gap = 16, layout = 'auto', mode = 'rhombic', diamondItems = false, responsive = false, className = '', style, ...props }, ref) => {
	const uniqueId = useId().replace(/:/g, '');
	const childrenArray = useMemo(() => Children.toArray(children), [children]);
	const totalItems = childrenArray.length;

	const config = useMemo(() => getDiamondLayoutConfig(totalItems, layout), [totalItems, layout]);
	const columnGroups = useMemo(() => partitionDiamondItems(childrenArray, config), [childrenArray, config]);

	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;

	return (
		<div ref={ref} className={`exhuma-diamond-container-${uniqueId} flex w-full flex-col gap-4 ${className}`} style={{ containerType: responsive ? 'inline-size' : undefined, ...style }} {...props}>
			{responsive && (
				<style>{`
						.exhuma-diamond-container-${uniqueId} {
							container-type: inline-size;
						}
						.exhuma-diamond-mobile-${uniqueId} {
							display: grid;
							grid-template-columns: repeat(2, minmax(0, 1fr));
							gap: 0.75rem;
							width: 100%;
						}
						.exhuma-diamond-desktop-${uniqueId} {
							display: none;
						}
						@container (min-width: 420px) {
							.exhuma-diamond-mobile-${uniqueId} {
								display: none !important;
							}
							.exhuma-diamond-desktop-${uniqueId} {
								display: grid !important;
								grid-template-columns: repeat(${config.columns}, minmax(0, 1fr));
								gap: ${gapVal};
								align-items: center;
								justify-content: center;
								width: 100%;
							}
						}
					`}</style>
			)}

			{/* Mobile layout: standard compact grid (< 420px container width) only when responsive=true */}
			{responsive && (
				<div className={`exhuma-diamond-mobile-${uniqueId}`}>
					{childrenArray.map((item, index) => (
						<div key={`diamond-mobile-${index}`} className='flex items-center justify-center'>
							{mode === 'isometric' || diamondItems ? <DiamondItem mode='isometric'>{item}</DiamondItem> : item}
						</div>
					))}
				</div>
			)}

			{/* Rhombic Diamond pattern: always active when responsive=false; container-managed when responsive=true */}
			<div
				className={responsive ? `exhuma-diamond-desktop-${uniqueId}` : 'w-full'}
				style={{
					display: responsive ? undefined : 'grid',
					gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
					gap: gapVal,
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
				}}
			>
				{columnGroups.map((columnItems, columnIndex) => (
					<DiamondColumn key={`diamond-col-${columnIndex}`} columnIndex={columnIndex} gap={gapVal}>
						{columnItems.map((group) => (
							<DiamondItem key={`item-${group.index}`} mode={mode} diamond={diamondItems}>
								{group.item}
							</DiamondItem>
						))}
					</DiamondColumn>
				))}
			</div>
		</div>
	);
});
DiamondGridRoot.displayName = 'DiamondGrid';

export const DiamondGrid = DiamondGridRoot as unknown as DiamondGridComponent;
DiamondGrid.displayName = 'DiamondGrid';
DiamondGrid.Grid = DiamondGrid;
DiamondGrid.Column = DiamondColumn;
DiamondGrid.Item = DiamondItem;
