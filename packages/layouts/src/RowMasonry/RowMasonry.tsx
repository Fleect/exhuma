import * as React from 'react';
import { sanitizeDomProps } from '../utils/sanitize-dom-props';
import { computeMasonryLayout, computeResponsiveColumns, MasonryItem } from './row-masonry-math';
import type { RowMasonryProps, RowMasonryItemProps } from '../types';

export const RowMasonryItem: React.FC<RowMasonryItemProps> = ({ children, className = '', style, ...props }) => {
	return (
		<div className={`exhuma-row-masonry-item w-full ${className}`} style={style} {...props}>
			{children}
		</div>
	);
};
RowMasonryItem.displayName = 'RowMasonryItem';

export const RowMasonry = React.forwardRef<HTMLDivElement, RowMasonryProps>(({ columns = 1, columnsSm = 2, columnsMd = 2, columnsLg = 3, columnsXl = 4, gap = 16, children, className = '', style, ...props }, ref) => {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const itemRefs = React.useRef<Map<number, HTMLElement>>(new Map());
	const [totalHeight, setTotalHeight] = React.useState<number>(0);
	const [isMounted, setIsMounted] = React.useState<boolean>(false);
	const rafIdRef = React.useRef<number | null>(null);

	React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

	const executeLayout = React.useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const containerWidth = container.clientWidth;
		if (containerWidth === 0) return;

		const cols = computeResponsiveColumns(containerWidth, {
			columns,
			columnsSm,
			columnsMd,
			columnsLg,
			columnsXl,
		});
		const childrenArray = React.Children.toArray(children);

		// Batch Read Phase: collect all item heights simultaneously (zero reflow cascades)
		const heights = childrenArray.map((_, i) => {
			const el = itemRefs.current.get(i);
			return el ? el.offsetHeight : 0;
		});

		// Pure Calculation Phase: greedy shortest-column placement
		const { items, totalHeight: newHeight } = computeMasonryLayout(heights, containerWidth, cols, gap);

		// Batch Write Phase: apply instant GPU translate3d positioning (zero layout thrashing)
		items.forEach((item) => {
			const el = itemRefs.current.get(item.index);
			if (el) {
				el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
				el.style.width = `${item.width}px`;
			}
		});

		setTotalHeight(newHeight);
		setIsMounted(true);
	}, [children, columns, columnsSm, columnsMd, columnsLg, columnsXl, gap]);

	const scheduleLayout = React.useCallback(() => {
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
		}
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null;
			executeLayout();
		});
	}, [executeLayout]);

	React.useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		scheduleLayout();

		const ro = new ResizeObserver(() => {
			scheduleLayout();
		});

		ro.observe(container);
		itemRefs.current.forEach((el) => {
			ro.observe(el);
		});

		// Asynchronous image & media load listener (capture phase)
		container.addEventListener('load', scheduleLayout, true);

		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			ro.disconnect();
			container.removeEventListener('load', scheduleLayout, true);
		};
	}, [scheduleLayout, children]);

	return (
		<div
			ref={containerRef}
			className={`relative w-full ${className}`}
			style={{
				...style,
				minHeight: totalHeight > 0 ? totalHeight : undefined,
				height: totalHeight > 0 ? totalHeight : undefined,
			}}
			{...sanitizeDomProps(props as Record<string, unknown>)}
		>
			{React.Children.map(children, (child, index) => {
				if (!React.isValidElement(child)) return null;
				return (
					<div
						key={index}
						ref={(el) => {
							if (el) itemRefs.current.set(index, el);
							else itemRefs.current.delete(index);
						}}
						className='absolute top-0 left-0 w-full'
						style={{
							opacity: isMounted ? 1 : 0.001,
							transition: isMounted ? 'opacity 150ms ease-out' : 'none',
							willChange: 'transform, width',
						}}
					>
						{child}
					</div>
				);
			})}
		</div>
	);
});

RowMasonry.displayName = 'RowMasonry';
export type { RowMasonryProps, RowMasonryItemProps };
