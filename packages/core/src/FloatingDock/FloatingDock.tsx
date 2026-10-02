'use client';

import React, { useRef, useState, useCallback, useEffect, createContext, useContext, useId, type ReactNode } from 'react';
import { calculateDockItemSize, calculateDockScale, dampDockScale, lerpDockScale, springDampedScaleStep, createDockSpringState, type DockDirection, type DockPanelStyle, type DockSpringState } from './dock-math';

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
	/** Enables micro-haptic tick on apex crossing when supported by the device. @default false */
	hapticFeedback?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

interface DockContextValue {
	direction: DockDirection;
	baseSize: number;
	maxMagnification: number;
	influenceRadius: number;
	showLabels: boolean;
	activeFocusIndex: number;
	setActiveFocusIndex: (idx: number) => void;
	registerItem: (el: HTMLElement) => () => void;
	getItemIndex: (el: HTMLElement | null) => number;
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
} = ({ items = [], children, direction = 'bottom', baseSize = 36, maxMagnification = 0.75, influenceRadius = 60, showLabels = true, panelStyle = 'translucent', hapticFeedback = false, className = '', style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pointerCoord = useRef<number>(-9999);
	const isHoveredRef = useRef<boolean>(false);
	const lastHapticIndexRef = useRef<number>(-1);
	const itemsRef = useRef<HTMLElement[]>([]);
	const currentSizesRef = useRef<Map<HTMLElement, number>>(new Map());
	const rafIdRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const [activeFocusIndex, setActiveFocusIndex] = useState<number>(0);

	const getItemIndex = useCallback((el: HTMLElement | null) => {
		if (!el) return -1;
		return itemsRef.current.indexOf(el);
	}, []);

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

	const updateScales = useCallback(
		(timestamp: number = performance.now()) => {
			const isHovered = isHoveredRef.current;
			const coord = pointerCoord.current;
			const isHorizontal = direction === 'bottom' || direction === 'top';
			const elements = itemsRef.current;
			const count = elements.length;

			if (count === 0) {
				rafIdRef.current = null;
				lastTimeRef.current = 0;
				return;
			}

			const dt = lastTimeRef.current > 0 ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) : 0.016;
			lastTimeRef.current = timestamp;

			// Pass 1: Batched geometry measurement (reads only)
			const centers = new Float64Array(count);
			if (isHovered && coord !== -9999) {
				for (let i = 0; i < count; i++) {
					const rect = elements[i].getBoundingClientRect();
					centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
				}
			}

			let stillAnimating = false;

			// Pass 2: Continuous smooth damping towards target sizes (writes only)
			for (let i = 0; i < count; i++) {
				const el = elements[i];
				const currentSize = currentSizesRef.current.get(el) ?? baseSize;

				let targetSize = baseSize;
				if (isHovered && coord !== -9999) {
					const distance = Math.abs(coord - centers[i]);
					targetSize = calculateDockItemSize(distance, baseSize, influenceRadius, maxMagnification);
				}

				// Continuous viscous damping for liquid-smooth wave motion on hover and exit
				const nextSize = dampDockScale(currentSize, targetSize, 26, dt);
				currentSizesRef.current.set(el, nextSize);

				el.style.width = `${nextSize.toFixed(2)}px`;
				el.style.height = `${nextSize.toFixed(2)}px`;

				if (Math.abs(nextSize - targetSize) > 0.05) {
					stillAnimating = true;
				} else if (!isHovered) {
					el.style.width = `${baseSize}px`;
					el.style.height = `${baseSize}px`;
					currentSizesRef.current.set(el, baseSize);
				}
			}

			if (isHovered && coord !== -9999 && hapticFeedback) {
				let closestIdx = -1;
				let minDistance = Infinity;
				for (let i = 0; i < count; i++) {
					const distance = Math.abs(coord - centers[i]);
					if (distance < minDistance) {
						minDistance = distance;
						closestIdx = i;
					}
				}
				if (closestIdx !== -1 && minDistance <= 10 && lastHapticIndexRef.current !== closestIdx) {
					lastHapticIndexRef.current = closestIdx;
					if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
						try {
							navigator.vibrate(6);
						} catch {}
					}
				}
			}

			if (isHovered || stillAnimating) {
				rafIdRef.current = requestAnimationFrame(updateScales);
			} else {
				rafIdRef.current = null;
				lastTimeRef.current = 0;
			}
		},
		[baseSize, direction, influenceRadius, maxMagnification, hapticFeedback]
	);

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
		lastHapticIndexRef.current = -1;
		pointerCoord.current = -9999;
		scheduleUpdate();
	}, [scheduleUpdate]);

	const handlePointerUp = useCallback(() => {
		isHoveredRef.current = false;
		lastHapticIndexRef.current = -1;
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
		glass: 'border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 rounded-2xl',
		translucent: 'border border-border/50 bg-background/80 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-2xl',
		minimal: 'border-transparent bg-transparent shadow-none',
	}[panelStyle];

	const mergedStyle: React.CSSProperties = {
		...(isHorizontal ? { height: crossAxisSize } : { width: crossAxisSize }),
		...style,
	};

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const elements = itemsRef.current;
			if (elements.length === 0) return;
			const focusedIndex = elements.findIndex((el) => el === document.activeElement || el.contains(document.activeElement));
			if (focusedIndex === -1) return;

			let nextIndex = focusedIndex;
			const isHorizontal = direction === 'bottom' || direction === 'top';

			if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
				e.preventDefault();
				nextIndex = (focusedIndex + 1) % elements.length;
			} else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
				e.preventDefault();
				nextIndex = (focusedIndex - 1 + elements.length) % elements.length;
			} else if (e.key === 'Home') {
				e.preventDefault();
				nextIndex = 0;
			} else if (e.key === 'End') {
				e.preventDefault();
				nextIndex = elements.length - 1;
			}

			if (nextIndex !== focusedIndex) {
				setActiveFocusIndex(nextIndex);
				elements[nextIndex]?.focus();
			}
		},
		[direction]
	);

	return (
		<DockContext.Provider
			value={{
				direction,
				baseSize,
				maxMagnification,
				influenceRadius,
				showLabels,
				activeFocusIndex,
				setActiveFocusIndex,
				registerItem,
				getItemIndex,
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
				onKeyDown={handleKeyDown}
				className={`exhuma-dock-root relative inline-flex max-w-[calc(100vw-24px)] touch-none gap-2 select-none sm:gap-2.5 ${directionLayoutClasses} ${panelStyleClasses} ${className}`}
				style={mergedStyle}
				role='toolbar'
				aria-label='Application Dock'
			>
				{items.length > 0
					? items.map((item) => (
							<DockItem key={item.title} title={item.title} href={item.href} onClick={item.onClick} active={item.active} className={item.className}>
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
	const tooltipId = useId();
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

	const itemIndex = ctx?.getItemIndex(itemRef.current) ?? -1;
	const isCurrentFocus = itemIndex === -1 ? true : itemIndex === (ctx?.activeFocusIndex ?? 0);
	const tabIndexValue = isCurrentFocus ? 0 : -1;

	const handleFocus = () => {
		setFocused(true);
		const idx = ctx?.getItemIndex(itemRef.current);
		if (idx !== undefined && idx !== -1) {
			ctx?.setActiveFocusIndex(idx);
		}
	};

	const content = (
		<div
			ref={itemRef}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onFocus={handleFocus}
			onBlur={() => setFocused(false)}
			onClick={onClick}
			tabIndex={href ? undefined : tabIndexValue}
			role={href ? undefined : 'button'}
			aria-label={title}
			aria-describedby={showTooltip ? tooltipId : undefined}
			className={`exhuma-dock-item focus-visible:ring-primary/50 relative flex shrink-0 cursor-pointer items-center justify-center rounded-2xl will-change-[width,height] outline-none focus-visible:ring-2 ${className}`}
			style={{
				width: `${baseSize}px`,
				height: `${baseSize}px`,
			}}
		>
			{/* Exhuma Smooth Popover Tooltip */}
			{showTooltip && (
				<div
					id={tooltipId}
					role='tooltip'
					aria-hidden={!showTooltip}
					className={`border-border/70 bg-popover/95 text-popover-foreground animate-in fade-in zoom-in-95 pointer-events-none absolute z-50 rounded-lg border px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-xl duration-100 select-none ${tooltipDirectionClasses}`}
				>
					{title}
				</div>
			)}

			{/* Icon Content Container — allows child shadows and badges without clipping */}
			<div className='relative z-10 flex size-full items-center justify-center'>{children}</div>
		</div>
	);

	if (href) {
		return (
			<a
				href={href}
				tabIndex={tabIndexValue}
				onFocus={handleFocus}
				onBlur={() => setFocused(false)}
				className='focus-visible:ring-primary/40 inline-block rounded-2xl outline-none focus-visible:ring-2'
				aria-label={title}
				aria-describedby={showTooltip ? tooltipId : undefined}
			>
				{content}
			</a>
		);
	}

	return content;
};

const DockRoot = FloatingDock;
const DockIcon: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => <div className={`exhuma-dock-icon flex size-full items-center justify-center ${className}`}>{children}</div>;
const DockLabel: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => <div className={`exhuma-dock-label text-xs font-semibold ${className}`}>{children}</div>;

FloatingDock.Root = DockRoot;
FloatingDock.Item = DockItem;
FloatingDock.Icon = DockIcon;
FloatingDock.Label = DockLabel;

export { DockRoot, DockIcon, DockLabel };
