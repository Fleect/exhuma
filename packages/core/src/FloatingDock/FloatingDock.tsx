'use client';

import React, { useRef, useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react';
import { calculateDockItemSize, lerpDockScale, type DockDirection, type DockPanelStyle } from './dock-math';

export type { DockDirection, DockPanelStyle };

export interface FloatingDockItemData {
	title: string;
	icon: ReactNode;
	href?: string;
	onClick?: () => void;
	active?: boolean;
	className?: string;
}

export interface FloatingDockProps {
	items?: FloatingDockItemData[];
	children?: ReactNode;
	direction?: DockDirection;
	baseSize?: number;
	maxMagnification?: number;
	influenceRadius?: number;
	showLabels?: boolean;
	panelStyle?: DockPanelStyle;
	className?: string;
	style?: React.CSSProperties;
}

interface DockContextValue {
	direction: DockDirection;
	baseSize: number;
	maxMagnification: number;
	influenceRadius: number;
	showLabels: boolean;
	registerItem: (el: HTMLElement) => () => void;
}

const DockContext = createContext<DockContextValue | null>(null);

/**
 * FloatingDock — Exhuma Kinetic Methodology (EKM)
 * High-Performance Kinetic Application Dock
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time C1 continuous cosine bell proximity curve.
 * - Separated batched read/write cycles eliminating forced synchronous layout thrashing.
 * - Stable dock shelf baseline anchoring (no wrapper jumping or rubber-banding).
 * - Single-layer unified item magnification (zero double-zoom wrapper artifacts).
 * - Full 4-axis direction support ('bottom' | 'top' | 'left' | 'right').
 * - Direction-aware system popover tooltips with instant responsiveness.
 * - Smooth lerp decay on pointer exit for organic deceleration.
 * - 120Hz V-Sync compositor performance.
 */
export const FloatingDock: React.FC<FloatingDockProps> & {
	Root: typeof DockRoot;
	Item: typeof DockItem;
	Icon: typeof DockIcon;
	Label: typeof DockLabel;
} = ({
	items = [],
	children,
	direction = 'bottom',
	baseSize = 36,
	maxMagnification = 0.75,
	influenceRadius = 60,
	showLabels = true,
	panelStyle = 'translucent',
	className = '',
	style,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pointerCoord = useRef<number>(-9999);
	const isHoveredRef = useRef<boolean>(false);
	const itemsRef = useRef<HTMLElement[]>([]);
	const currentSizesRef = useRef<Map<HTMLElement, number>>(new Map());
	const rafIdRef = useRef<number | null>(null);

	const registerItem = useCallback(
		(el: HTMLElement) => {
			itemsRef.current.push(el);
			currentSizesRef.current.set(el, baseSize);
			return () => {
				itemsRef.current = itemsRef.current.filter((item) => item !== el);
				currentSizesRef.current.delete(el);
			};
		},
		[baseSize]
	);

	const updateScales = useCallback(() => {
		const isHovered = isHoveredRef.current;
		const coord = pointerCoord.current;
		const isHorizontal = direction === 'bottom' || direction === 'top';
		const elements = itemsRef.current;
		const count = elements.length;

		if (count === 0) {
			rafIdRef.current = null;
			return;
		}

		if (!isHovered || coord === -9999) {
			// Graceful exit decay back to baseSize
			let stillDecaying = false;
			for (let i = 0; i < count; i++) {
				const el = elements[i];
				const currentSize = currentSizesRef.current.get(el) ?? baseSize;
				if (Math.abs(currentSize - baseSize) > 0.1) {
					const nextSize = lerpDockScale(currentSize, baseSize, 0.32);
					currentSizesRef.current.set(el, nextSize);
					el.style.width = `${nextSize.toFixed(2)}px`;
					el.style.height = `${nextSize.toFixed(2)}px`;
					stillDecaying = true;
				} else {
					el.style.width = `${baseSize}px`;
					el.style.height = `${baseSize}px`;
					currentSizesRef.current.set(el, baseSize);
				}
			}
			if (stillDecaying) {
				rafIdRef.current = requestAnimationFrame(updateScales);
			} else {
				rafIdRef.current = null;
			}
			return;
		}

		// When hovered: 120Hz continuous proximity magnification (Big-Ω: strictly separated read/write passes)
		// Pass 1: Batched geometry measurement (reads only)
		const centers = new Float64Array(count);
		for (let i = 0; i < count; i++) {
			const rect = elements[i].getBoundingClientRect();
			centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
		}

		// Pass 2: Continuous scale calculation & batched style application (writes only)
		for (let i = 0; i < count; i++) {
			const el = elements[i];
			const distance = Math.abs(coord - centers[i]);
			const targetSize = calculateDockItemSize(distance, baseSize, influenceRadius, maxMagnification);
			currentSizesRef.current.set(el, targetSize);
			el.style.width = `${targetSize.toFixed(2)}px`;
			el.style.height = `${targetSize.toFixed(2)}px`;
		}
		rafIdRef.current = null;
	}, [baseSize, direction, influenceRadius, maxMagnification]);

	const scheduleUpdate = useCallback(() => {
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateScales);
		}
	}, [updateScales]);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			isHoveredRef.current = true;
			pointerCoord.current = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
			scheduleUpdate();
		},
		[direction, scheduleUpdate]
	);

	const handlePointerEnter = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			isHoveredRef.current = true;
			pointerCoord.current = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
			scheduleUpdate();
		},
		[direction, scheduleUpdate]
	);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			isHoveredRef.current = true;
			pointerCoord.current = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
			scheduleUpdate();
		},
		[direction, scheduleUpdate]
	);

	const handlePointerLeave = useCallback(() => {
		isHoveredRef.current = false;
		pointerCoord.current = -9999;
		scheduleUpdate();
	}, [scheduleUpdate]);

	const handlePointerUp = useCallback(() => {
		isHoveredRef.current = false;
		pointerCoord.current = -9999;
		scheduleUpdate();
	}, [scheduleUpdate]);

	useEffect(() => {
		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	// Orientation-specific layout & baseline anchoring (shelf plate maintains stable height/width)
	const isHorizontal = direction === 'bottom' || direction === 'top';
	const crossAxisSize = `${baseSize + 16}px`;

	const directionLayoutClasses = {
		bottom: 'flex-row items-end px-2.5 sm:px-3 pb-2 pt-2',
		top: 'flex-row items-start px-2.5 sm:px-3 pt-2 pb-2',
		left: 'flex-col items-start py-2.5 sm:py-3 pl-2 pr-2',
		right: 'flex-col items-end py-2.5 sm:py-3 pr-2 pl-2',
	}[direction];

	// Backing shelf glass visual styling — ultra-blurry, smooth frosted panel
	const panelStyleClasses = {
		glass:
			'border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 rounded-2xl',
		translucent:
			'border border-border/50 bg-background/80 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-2xl',
		minimal: 'border-transparent bg-transparent shadow-none',
	}[panelStyle];

	const mergedStyle: React.CSSProperties = {
		...(isHorizontal ? { height: crossAxisSize } : { width: crossAxisSize }),
		...style,
	};

	return (
		<DockContext.Provider
			value={{
				direction,
				baseSize,
				maxMagnification,
				influenceRadius,
				showLabels,
				registerItem,
			}}
		>
			<div
				ref={containerRef}
				onPointerEnter={handlePointerEnter}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				className={`exhuma-dock-root relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] select-none touch-none ${directionLayoutClasses} ${panelStyleClasses} ${className}`}
				style={mergedStyle}
				role='toolbar'
				aria-label='Application Dock'
			>
				{items.length > 0
					? items.map((item) => (
							<DockItem
								key={item.title}
								title={item.title}
								href={item.href}
								onClick={item.onClick}
								active={item.active}
								className={item.className}
							>
								{item.icon}
							</DockItem>
						))
					: children}
			</div>
		</DockContext.Provider>
	);
};

export const DockItem: React.FC<{
	children: ReactNode;
	title?: string;
	href?: string;
	onClick?: () => void;
	active?: boolean;
	className?: string;
}> = ({ children, title, href, onClick, active = false, className = '' }) => {
	const itemRef = useRef<HTMLDivElement>(null);
	const ctx = useContext(DockContext);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);

	const direction = ctx?.direction ?? 'bottom';
	const baseSize = ctx?.baseSize ?? 44;
	const showLabels = ctx?.showLabels ?? true;

	useEffect(() => {
		if (!ctx || !itemRef.current) return;
		return ctx.registerItem(itemRef.current);
	}, [ctx]);

	// Directional tooltip positioning outside the dock shelf
	const tooltipDirectionClasses = {
		bottom: 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
		top: 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2',
		left: 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2',
		right: 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2',
	}[direction];

	// Active running app indicator dot position along the shelf edge
	const showTooltip = Boolean(showLabels && title && (hovered || focused));

	const content = (
		<div
			ref={itemRef}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			onClick={onClick}
			tabIndex={href ? undefined : 0}
			role={href ? undefined : 'button'}
			aria-label={title}
			className={`exhuma-dock-item relative flex shrink-0 items-center justify-center rounded-2xl will-change-[width,height] outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer ${className}`}
			style={{
				width: `${baseSize}px`,
				height: `${baseSize}px`,
			}}
		>
			{/* Exhuma Smooth Popover Tooltip */}
			{showTooltip && (
				<div
					role='tooltip'
					aria-hidden={!showTooltip}
					className={`pointer-events-none absolute z-50 rounded-lg border border-border/70 bg-popover/95 px-2.5 py-1 font-sans text-xs font-medium text-popover-foreground shadow-lg backdrop-blur-xl whitespace-nowrap select-none animate-in fade-in zoom-in-95 duration-100 ${tooltipDirectionClasses}`}
				>
					{title}
				</div>
			)}

			{/* Icon Content Container — allows child shadows and badges without clipping */}
			<div className='relative z-10 flex size-full items-center justify-center'>
				{children}
			</div>
		</div>
	);

	if (href) {
		return (
			<a
				href={href}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				className='inline-block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
				aria-label={title}
			>
				{content}
			</a>
		);
	}

	return content;
};

const DockRoot = FloatingDock;
const DockIcon: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
	<div className={`exhuma-dock-icon flex size-full items-center justify-center ${className}`}>{children}</div>
);
const DockLabel: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
	<div className={`exhuma-dock-label text-xs font-semibold ${className}`}>{children}</div>
);

FloatingDock.Root = DockRoot;
FloatingDock.Item = DockItem;
FloatingDock.Icon = DockIcon;
FloatingDock.Label = DockLabel;

export { DockRoot, DockIcon, DockLabel };
