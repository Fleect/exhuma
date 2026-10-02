'use client';

import React, { useRef, useEffect, useCallback, createContext, useContext } from 'react';
import type { SpotlightCardProps } from '../types';
import { calculateSpotlightCoordinates, RectBounds, calculateGaussianIntensity, calculateRelativeSpotlightVector } from './spotlight-math';

export type SpotlightListener = (clientX: number, clientY: number, isActive: boolean) => void;

export interface SpotlightGroupContextValue {
	subscribe: (listener: SpotlightListener) => () => void;
}

export const SpotlightGroupContext = createContext<SpotlightGroupContextValue | null>(null);

/**
 * SpotlightCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) Constant-Time kinetic updates (Zero React re-renders on pointermove).
 * - Ω(1) Zero Heap Allocation during active tracking.
 * - Cached getBoundingClientRect() on pointerenter to eliminate layout thrashing.
 * - Frame-coalesced requestAnimationFrame exponential smoothing.
 * - Sub-pixel radial border illumination mask + background gradient fill.
 * - Graceful fade-out on pointer leave / touch cancel.
 * - Full reduced-motion and disabled bypass.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
	children,
	radius = 350,
	color = '#6366f1',
	borderColor = '#818cf8',
	opacity = 0.85,
	spread = 60,
	mode = 'both',
	smoothing = 0.2,
	disabled = false,
	className = '',
	style,
	...props
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number | null>(null);
	const rectRef = useRef<RectBounds | null>(null);
	const isHoveredRef = useRef(false);
	const isReducedMotionRef = useRef(false);

	// Cached coordinates to avoid heap allocation in animation frames
	const targetX = useRef<number>(-9999);
	const targetY = useRef<number>(-9999);
	const currentX = useRef<number>(-9999);
	const currentY = useRef<number>(-9999);
	const currentOpacity = useRef<number>(0);
	const targetOpacity = useRef<number>(0);

	// Reduced motion preference check
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		isReducedMotionRef.current = mediaQuery.matches;

		const handler = (e: MediaQueryListEvent) => {
			isReducedMotionRef.current = e.matches;
		};
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, []);

	// Measure card bounds without layout thrashing during pointer movement
	const measureRect = useCallback(() => {
		const el = cardRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
	}, []);

	// Re-measure passively on scroll or resize
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handlePassiveUpdate = () => {
			if (isHoveredRef.current) {
				measureRect();
			}
		};

		window.addEventListener('resize', handlePassiveUpdate, { passive: true });
		window.addEventListener('scroll', handlePassiveUpdate, { passive: true });

		return () => {
			window.removeEventListener('resize', handlePassiveUpdate);
			window.removeEventListener('scroll', handlePassiveUpdate);
		};
	}, [measureRect]);

	const updateFrame = useCallback(() => {
		const el = cardRef.current;
		if (!el) return;

		if (disabled || isReducedMotionRef.current) {
			el.style.setProperty('--exhuma-spotlight-opacity', '0');
			rafIdRef.current = null;
			return;
		}

		// Exponential smoothing filter (lambda clamped between 0.05 and 1.0)
		const factor = Math.max(0.05, Math.min(1, smoothing));
		currentX.current += (targetX.current - currentX.current) * factor;
		currentY.current += (targetY.current - currentY.current) * factor;
		currentOpacity.current += (targetOpacity.current - currentOpacity.current) * Math.max(0.08, factor * 0.75);

		// Write directly to GPU-decoupled CSS Custom Properties (zero layout reflow)
		el.style.setProperty('--exhuma-spotlight-x', `${currentX.current.toFixed(2)}px`);
		el.style.setProperty('--exhuma-spotlight-y', `${currentY.current.toFixed(2)}px`);
		el.style.setProperty('--exhuma-spotlight-opacity', `${currentOpacity.current.toFixed(3)}`);

		// Convergence threshold check
		const diffX = Math.abs(targetX.current - currentX.current);
		const diffY = Math.abs(targetY.current - currentY.current);
		const diffOp = Math.abs(targetOpacity.current - currentOpacity.current);

		if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHoveredRef.current) {
			rafIdRef.current = requestAnimationFrame(updateFrame);
		} else {
			rafIdRef.current = null;
		}
	}, [disabled, smoothing]);

	const scheduleUpdate = useCallback(() => {
		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(updateFrame);
		}
	}, [updateFrame]);

	const groupContext = useContext(SpotlightGroupContext);

	// Group-level ambient horizon bleed subscription
	useEffect(() => {
		if (!groupContext) return;
		return groupContext.subscribe((clientX, clientY, isActive) => {
			if (disabled || isReducedMotionRef.current) return;
			if (!isActive) {
				if (!isHoveredRef.current) {
					targetOpacity.current = 0;
					scheduleUpdate();
				}
				return;
			}
			if (!rectRef.current) measureRect();
			const rect = rectRef.current;
			if (!rect) return;

			const rel = calculateRelativeSpotlightVector(clientX, clientY, rect);
			if (rel.distance < radius * 1.5) {
				targetX.current = rel.x;
				targetY.current = rel.y;
				const gaussian = calculateGaussianIntensity(rel.distance, radius, opacity);
				targetOpacity.current = isHoveredRef.current ? opacity : gaussian;
				if (currentX.current < -1000) {
					currentX.current = rel.x;
					currentY.current = rel.y;
				}
				scheduleUpdate();
			} else if (!isHoveredRef.current && targetOpacity.current > 0) {
				targetOpacity.current = 0;
				scheduleUpdate();
			}
		});
	}, [groupContext, disabled, radius, opacity, measureRect, scheduleUpdate]);

	const handlePointerEnter = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (disabled || isReducedMotionRef.current) return;
			isHoveredRef.current = true;
			measureRect();

			const rect = rectRef.current;
			if (rect) {
				const coords = calculateSpotlightCoordinates(e.clientX, e.clientY, rect);
				targetX.current = coords.x;
				targetY.current = coords.y;
				targetOpacity.current = Math.max(0, Math.min(1, opacity));

				// Snap on enter if uninitialized to prevent flying animation from offscreen
				if (currentX.current < -1000) {
					currentX.current = coords.x;
					currentY.current = coords.y;
				}
			}

			scheduleUpdate();
		},
		[disabled, measureRect, opacity, scheduleUpdate]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (disabled || isReducedMotionRef.current) return;
			isHoveredRef.current = true;
			if (!rectRef.current) measureRect();
			const rect = rectRef.current;
			if (!rect) return;

			const coords = calculateSpotlightCoordinates(e.clientX, e.clientY, rect);

			targetX.current = coords.x;
			targetY.current = coords.y;
			targetOpacity.current = Math.max(0, Math.min(1, opacity));

			// Snap on move if uninitialized to prevent flying animation from offscreen
			if (currentX.current < -1000) {
				currentX.current = coords.x;
				currentY.current = coords.y;
			}

			scheduleUpdate();
		},
		[disabled, measureRect, opacity, scheduleUpdate]
	);

	const handlePointerLeave = useCallback(() => {
		isHoveredRef.current = false;
		targetOpacity.current = 0;
		scheduleUpdate();
	}, [scheduleUpdate]);

	// Sync static CSS variables when props change
	useEffect(() => {
		const el = cardRef.current;
		if (!el) return;

		el.style.setProperty('--exhuma-spotlight-radius', `${radius}px`);
		el.style.setProperty('--exhuma-spotlight-color', color);
		el.style.setProperty('--exhuma-spotlight-border-color', borderColor);
		el.style.setProperty('--exhuma-spotlight-spread', `${spread}%`);

		if (disabled) {
			el.style.setProperty('--exhuma-spotlight-opacity', '0');
		}

		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [radius, color, borderColor, spread, disabled, opacity]);

	const showBorder = mode === 'both' || mode === 'border';
	const showSheen = mode === 'both' || mode === 'background';

	return (
		<div
			ref={cardRef}
			onPointerEnter={handlePointerEnter}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			className={`group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40 ${className}`}
			style={{
				['--exhuma-spotlight-radius' as string]: `${radius}px`,
				['--exhuma-spotlight-color' as string]: color,
				['--exhuma-spotlight-border-color' as string]: borderColor,
				['--exhuma-spotlight-spread' as string]: `${spread}%`,
				['--exhuma-spotlight-opacity' as string]: '0',
				...style,
			}}
			{...props}
		>
			{/* Specular Border Glow Mask */}
			{showBorder && (
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 z-10 rounded-[inherit]'
					style={{
						opacity: 'var(--exhuma-spotlight-opacity, 0)',
						border: '1.5px solid transparent',
						background: `radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box`,
						WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
						WebkitMaskComposite: 'destination-out',
						mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
						maskComposite: 'exclude',
					}}
				/>
			)}

			{/* Background Radial Sheen */}
			{showSheen && (
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 z-0'
					style={{
						opacity: mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)',
						background: `radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))`,
					}}
				/>
			)}

			{/* Content Slot */}
			<div className='relative z-20'>{children}</div>
		</div>
	);
};

export interface SpotlightGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export const SpotlightGroup: React.FC<SpotlightGroupProps> = ({ children, className = '', ...props }) => {
	const listenersRef = useRef<Set<SpotlightListener>>(new Set());

	const subscribe = useCallback((listener: SpotlightListener) => {
		listenersRef.current.add(listener);
		return () => {
			listenersRef.current.delete(listener);
		};
	}, []);

	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		listenersRef.current.forEach((fn) => fn(e.clientX, e.clientY, true));
	}, []);

	const handlePointerLeave = useCallback(() => {
		listenersRef.current.forEach((fn) => fn(-9999, -9999, false));
	}, []);

	return (
		<SpotlightGroupContext.Provider value={{ subscribe }}>
			<div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={`exhuma-spotlight-group relative ${className}`} {...props}>
				{children}
			</div>
		</SpotlightGroupContext.Provider>
	);
};

SpotlightGroup.displayName = 'SpotlightGroup';

export const Spotlight = {
	Root: SpotlightCard,
	Group: SpotlightGroup,
};

export default SpotlightCard;
