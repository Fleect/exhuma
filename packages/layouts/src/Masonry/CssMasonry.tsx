import React, { Children, useId } from 'react';
import type { CssMasonryProps, CssMasonryItemProps } from '../types';

export const CssMasonryItem: React.FC<CssMasonryItemProps> = ({ children, breakInside = 'avoid', className = '', style }) => {
	return (
		<div
			className={`exhuma-masonry-item inline-block w-full ${className}`}
			style={{
				breakInside: (breakInside === 'avoid' ? 'avoid-column' : breakInside) as any,
				pageBreakInside: 'avoid',
				display: 'inline-block',
				width: '100%',
				...style,
			}}
		>
			{children}
		</div>
	);
};
CssMasonryItem.displayName = 'CssMasonryItem';

export const CssMasonry: React.FC<CssMasonryProps> = ({ children, columns = 3, columnsSm, columnsMd, columnsLg, columnsXl, gap = '1.5rem', columnFill = 'balance', height, className = '', style }) => {
	const uniqueId = useId().replace(/:/g, '');
	const gapValue = typeof gap === 'number' ? `${gap}px` : gap;

	const numCols = typeof columns === 'number' ? columns : 3;
	const responsiveCols = typeof columns === 'object' && columns !== null ? columns : {};

	const sm = columnsSm ?? responsiveCols.sm ?? Math.min(numCols, 1);
	const md = columnsMd ?? responsiveCols.md ?? Math.min(numCols, 2);
	const lg = columnsLg ?? responsiveCols.lg ?? numCols;
	const xl = columnsXl ?? responsiveCols.xl ?? Math.max(numCols, lg);

	// CSS multi-column requires a definite height for column-fill: auto to activate in WebKit/Blink.
	const resolvedHeight = height !== undefined && height !== 0 && height !== '0' ? (typeof height === 'number' ? `${height}px` : height) : columnFill === 'auto' ? '620px' : undefined;

	return (
		<div className={`exhuma-masonry-container-${uniqueId} w-full`} style={{ containerType: 'inline-size' }}>
			<style>{`
				.exhuma-masonry-container-${uniqueId} {
					container-type: inline-size;
				}
				.exhuma-masonry-${uniqueId} {
					column-count: ${sm};
					column-gap: ${gapValue};
					column-fill: ${columnFill};
					-webkit-column-fill: ${columnFill};
					${sm > 1 && resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
				}
				@container (min-width: 640px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${sm >= 2 ? sm : Math.min(md, 2)};
						${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
					}
				}
				@container (min-width: 768px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${md};
						${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
					}
				}
				@container (min-width: 1024px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${lg};
						${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
					}
				}
				@container (min-width: 1280px) {
					.exhuma-masonry-${uniqueId} {
						column-count: ${xl};
						${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
					}
				}
				@supports not (container-type: inline-size) {
					@media (min-width: 640px) {
						.exhuma-masonry-${uniqueId} {
							column-count: ${sm >= 2 ? sm : Math.min(md, 2)};
							${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
						}
					}
					@media (min-width: 768px) {
						.exhuma-masonry-${uniqueId} {
							column-count: ${md};
							${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
						}
					}
					@media (min-width: 1024px) {
						.exhuma-masonry-${uniqueId} {
							column-count: ${lg};
							${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
						}
					}
					@media (min-width: 1280px) {
						.exhuma-masonry-${uniqueId} {
							column-count: ${xl};
							${resolvedHeight ? `height: ${resolvedHeight}; overflow-x: auto;` : ''}
						}
					}
				}
				.exhuma-masonry-${uniqueId} > * {
					break-inside: avoid;
					break-inside: avoid-column;
					-webkit-column-break-inside: avoid;
					page-break-inside: avoid;
					margin-bottom: ${gapValue};
					display: inline-block;
					width: 100%;
					vertical-align: top;
				}
			`}</style>
			<div className={`exhuma-css-masonry exhuma-masonry-${uniqueId} w-full ${className}`} style={style}>
				{Children.map(children, (child, idx) => {
					if (!React.isValidElement(child)) return child;
					const isItem =
						(child.type as any)?.displayName === 'CssMasonryItem' ||
						child.type === CssMasonryItem ||
						(typeof (child.props as any)?.className === 'string' && (child.props as any).className.includes('exhuma-masonry-item'));

					if (isItem) {
						return child;
					}

					return (
						<div key={idx} className='exhuma-masonry-item inline-block w-full align-top'>
							{child}
						</div>
					);
				})}
			</div>
		</div>
	);
};
