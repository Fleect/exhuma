'use client';

import React, { useRef, useState, useCallback, useEffect, createContext, useContext, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { damp } from '../physics/lerp';
import {
	calculateElementCenter,
	calculateTargetPosition,
	clampTooltipToViewport,
	type CursorTooltipVariant,
	type CursorTooltipDirection,
} from './cursor-math';

export type { CursorTooltipVariant, CursorTooltipDirection };

interface CursorTooltipContextValue {
	isVisible: boolean;
	show: (e: React.MouseEvent<HTMLElement>) => void;
	hide: () => void;
	update: (e: React.MouseEvent<HTMLElement>) => void;
	contentNode: ReactNode;
	setContentNode: (node: ReactNode) => void;
	offset: { x: number; y: number };
	springDamping: number;
	variant: CursorTooltipVariant;
	direction: CursorTooltipDirection;
	collisionPadding: number;
}

const CursorTooltipContext = createContext<CursorTooltipContextValue | null>(null);

export interface CursorTooltipProps {
	children: ReactNode;
	content?: ReactNode;
	springDamping?: number;
	direction?: CursorTooltipDirection;
	offsetX?: number;
	offsetY?: number;
	offset?: { x: number; y: number };
	variant?: CursorTooltipVariant;
	collisionPadding?: number;
	className?: string;
	contentClassName?: string;
}

const VARIANT_CLASSES: Record<CursorTooltipVariant, string> = {
	frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
	accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
	dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
	minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
	glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
};

/**
 * CursorTooltip — Exhuma Kinetic Methodology (EKM)
 * High-Performance Kinetic Floating Cursor Tooltip
 *
 * Big-Omega (Ω) Guarantees:
 * - 120Hz rAF continuous transform writes directly to element style.
 * - Zero Framer Motion / GSAP dependencies.
 * - Viewport boundary collision avoidance with customizable padding.
 * - Zero React re-renders during cursor tracking.
 * - Multi-variant tokenized visual design.
 */
export const CursorTooltip: React.FC<CursorTooltipProps> & {
	Content: typeof TooltipFloatingContent;
} = ({
	children,
	content,
	springDamping = 20,
	direction = 'bottom-right',
	offsetX,
	offsetY,
	offset,
	variant = 'frosted',
	collisionPadding = 12,
	className = '',
	contentClassName = '',
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [contentNode, setContentNode] = useState<ReactNode>(content);
	const mousePosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
	const targetPosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
	const tooltipElRef = useRef<HTMLDivElement | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const [mounted, setMounted] = useState(false);

	const effectiveOffset = {
		x: offsetX ?? offset?.x ?? 16,
		y: offsetY ?? offset?.y ?? 16,
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (content !== undefined) {
			setContentNode(content);
		}
	}, [content]);

	const updateRafLoop = useCallback(
		(timestamp: number) => {
			if (!lastTimeRef.current) lastTimeRef.current = timestamp;
			const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
			lastTimeRef.current = timestamp;

			const cur = currentPosRef.current;

			if (tooltipElRef.current && mousePosRef.current.x >= 0) {
				const el = tooltipElRef.current;
				const rect = el.getBoundingClientRect();
				const target = calculateTargetPosition(
					mousePosRef.current.x,
					mousePosRef.current.y,
					effectiveOffset.x,
					effectiveOffset.y,
					direction,
					rect.width,
					rect.height
				);
				targetPosRef.current = target;
			}

			const target = targetPosRef.current;

			const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			if (isReducedMotion) {
				cur.x = target.x;
				cur.y = target.y;
			} else {
				cur.x = damp(cur.x, target.x, springDamping, dt);
				cur.y = damp(cur.y, target.y, springDamping, dt);
			}

			if (tooltipElRef.current) {
				const el = tooltipElRef.current;
				const rect = el.getBoundingClientRect();
				const clamped = clampTooltipToViewport(cur.x, cur.y, rect.width, rect.height, window.innerWidth, window.innerHeight, collisionPadding);
				el.style.transform = `translate3d(${clamped.x.toFixed(2)}px, ${clamped.y.toFixed(2)}px, 0)`;
			}

			const dist = Math.hypot(target.x - cur.x, target.y - cur.y);
			if (dist > 0.2 && isVisible) {
				rafIdRef.current = requestAnimationFrame(updateRafLoop);
			} else {
				rafIdRef.current = null;
				lastTimeRef.current = 0;
			}
		},
		[springDamping, direction, effectiveOffset.x, effectiveOffset.y, collisionPadding, isVisible]
	);

	const startRafIfNeeded = useCallback(() => {
		if (!rafIdRef.current) {
			lastTimeRef.current = 0;
			rafIdRef.current = requestAnimationFrame(updateRafLoop);
		}
	}, [updateRafLoop]);

	const show = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
			const rect = tooltipElRef.current?.getBoundingClientRect();
			const target = calculateTargetPosition(
				e.clientX,
				e.clientY,
				effectiveOffset.x,
				effectiveOffset.y,
				direction,
				rect?.width ?? 0,
				rect?.height ?? 0
			);

			// Initialize position at element center if first appearance
			if (currentPosRef.current.x < 0) {
				const center = calculateElementCenter(e.currentTarget.getBoundingClientRect());
				currentPosRef.current = { x: center.x, y: center.y };
			}

			targetPosRef.current = target;
			setIsVisible(true);
			startRafIfNeeded();
		},
		[effectiveOffset.x, effectiveOffset.y, direction, startRafIfNeeded]
	);

	const hide = useCallback(() => {
		setIsVisible(false);
		mousePosRef.current = { x: -9999, y: -9999 };
		currentPosRef.current = { x: -9999, y: -9999 };
		targetPosRef.current = { x: -9999, y: -9999 };
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	const update = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
			const rect = tooltipElRef.current?.getBoundingClientRect();
			const target = calculateTargetPosition(
				e.clientX,
				e.clientY,
				effectiveOffset.x,
				effectiveOffset.y,
				direction,
				rect?.width ?? 0,
				rect?.height ?? 0
			);
			targetPosRef.current = target;
			startRafIfNeeded();
		},
		[effectiveOffset.x, effectiveOffset.y, direction, startRafIfNeeded]
	);

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, []);

	return (
		<CursorTooltipContext.Provider
			value={{
				isVisible,
				show,
				hide,
				update,
				contentNode,
				setContentNode,
				offset: effectiveOffset,
				springDamping,
				variant,
				direction,
				collisionPadding,
			}}
		>
			<div onMouseEnter={show} onMouseMove={update} onMouseLeave={hide} className={`inline-block ${className}`}>
				{children}
			</div>

			{mounted &&
				isVisible &&
				createPortal(
					<div
						ref={(node) => {
							tooltipElRef.current = node;
						}}
						className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-150 will-change-transform ${contentClassName}`}
						style={{
							transform: `translate3d(${targetPosRef.current.x}px, ${targetPosRef.current.y}px, 0)`,
						}}
					>
						<TooltipFloatingContent variant={variant}>{contentNode}</TooltipFloatingContent>
					</div>,
					document.body
				)}
		</CursorTooltipContext.Provider>
	);
};

export const TooltipFloatingContent = memo<{
	children: ReactNode;
	className?: string;
	variant?: CursorTooltipVariant;
}>(({ children, className = '', variant = 'frosted' }) => {
	const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.frosted;
	return <div className={`px-3 py-1.5 text-xs font-semibold select-none ${variantClass} ${className}`}>{children}</div>;
});
TooltipFloatingContent.displayName = 'TooltipFloatingContent';

CursorTooltip.Content = TooltipFloatingContent;

export { TooltipFloatingContent as CursorTooltipContent };
