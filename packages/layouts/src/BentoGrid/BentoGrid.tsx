'use client';

import React, { useRef, useCallback } from 'react';
import type { BentoGridProps, BentoCardProps } from '../types';

export interface BentoGridComponent extends React.ForwardRefExoticComponent<BentoGridProps & React.RefAttributes<HTMLDivElement>> {
	Grid: BentoGridComponent;
	Card: typeof BentoCard;
	Header: typeof BentoHeader;
	Content: typeof BentoContent;
	Visual: typeof BentoVisual;
}

/**
 * BentoGrid — Exhuma Kinetic Methodology (EKM)
 *
 * Modern responsive dense auto-flow grid with asymmetric spans and subtle
 * kinetic border sheen on hover. Zero layout shifts.
 */
const BentoGridRoot = React.forwardRef<HTMLDivElement, BentoGridProps>(({ children, cols = 3, gap = '1.5rem', rowHeight, className = '', style, ...props }, ref) => {
	const colsVal = typeof cols === 'number' ? cols : (cols.lg ?? cols.md ?? 3);
	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;
	const autoRowsVal = rowHeight ? (typeof rowHeight === 'number' ? `minmax(${rowHeight}px, auto)` : rowHeight) : undefined;

	return (
		<div
			ref={ref}
			className={`exhuma-bento-grid grid w-full grid-flow-dense ${className}`}
			style={{
				gridTemplateColumns: `repeat(${colsVal}, minmax(0, 1fr))`,
				gap: gapVal,
				...(autoRowsVal ? { gridAutoRows: autoRowsVal } : {}),
				...style,
			}}
			{...props}
		>
			{children}
		</div>
	);
});
BentoGridRoot.displayName = 'BentoGrid';
export const BentoGrid = BentoGridRoot as unknown as BentoGridComponent;

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
	({ children, colSpan = 1, rowSpan = 1, enableGlow = true, glowColor = 'rgba(99, 102, 241, 0.08)', className = '', style, ...props }, forwardedRef) => {
		const internalRef = useRef<HTMLDivElement>(null);
		const rectRef = useRef<{ left: number; top: number } | null>(null);

		// Big-Omega Ω(1) Geometry Caching: measure bounds on enter, zero DOM thrash during move
		const handlePointerEnter = useCallback(() => {
			const el = internalRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			rectRef.current = { left: rect.left, top: rect.top };
		}, []);

		// Kinetic pointer sheen (Zero re-renders, zero heap allocations, zero forced reflows)
		const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
			const el = internalRef.current;
			if (!el) return;
			if (!rectRef.current) {
				const rect = el.getBoundingClientRect();
				rectRef.current = { left: rect.left, top: rect.top };
			}
			const x = e.clientX - rectRef.current.left;
			const y = e.clientY - rectRef.current.top;
			el.style.setProperty('--bento-x', `${x.toFixed(1)}px`);
			el.style.setProperty('--bento-y', `${y.toFixed(1)}px`);
		}, []);

		// Clear cached geometry and reset coordinates to eliminate stale gradient flashes
		const handlePointerLeave = useCallback(() => {
			rectRef.current = null;
			const el = internalRef.current;
			if (!el) return;
			el.style.setProperty('--bento-x', '-999px');
			el.style.setProperty('--bento-y', '-999px');
		}, []);

		const setRefs = useCallback(
			(node: HTMLDivElement | null) => {
				internalRef.current = node;
				if (typeof forwardedRef === 'function') {
					forwardedRef(node);
				} else if (forwardedRef && 'current' in forwardedRef) {
					(forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
			},
			[forwardedRef]
		);

		return (
			<div
				ref={setRefs}
				onPointerEnter={handlePointerEnter}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				onPointerCancel={handlePointerLeave}
				className={`exhuma-bento-card group border-border bg-card/60 hover:border-primary/40 focus-within:border-primary/40 focus-within:ring-primary/30 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 focus-within:ring-1 hover:shadow-xl ${className}`}
				style={{
					gridColumn: `span ${Math.max(1, colSpan)}`,
					gridRow: `span ${Math.max(1, rowSpan)}`,
					...style,
				}}
				{...props}
			>
				{/* Subtle kinetic radial sheen */}
				{enableGlow && (
					<div
						className='pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100'
						style={{
							background: `radial-gradient(400px circle at var(--bento-x, -999px) var(--bento-y, -999px), ${glowColor}, transparent 80%)`,
						}}
					/>
				)}
				<div className='relative z-10 flex h-full flex-col justify-between'>{children}</div>
			</div>
		);
	}
);
BentoCard.displayName = 'BentoCard';

export const BentoHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => (
	<div ref={ref} className={`exhuma-bento-header space-y-2 ${className}`} {...props}>
		{children}
	</div>
));
BentoHeader.displayName = 'BentoHeader';

export const BentoContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => (
	<div ref={ref} className={`exhuma-bento-content text-muted-foreground text-sm ${className}`} {...props}>
		{children}
	</div>
));
BentoContent.displayName = 'BentoContent';

export const BentoVisual = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => (
	<div ref={ref} className={`exhuma-bento-visual my-auto flex items-center justify-center overflow-hidden py-4 ${className}`} {...props}>
		{children}
	</div>
));
BentoVisual.displayName = 'BentoVisual';

BentoGrid.Grid = BentoGrid;
BentoGrid.Card = BentoCard;
BentoGrid.Header = BentoHeader;
BentoGrid.Content = BentoContent;
BentoGrid.Visual = BentoVisual;
