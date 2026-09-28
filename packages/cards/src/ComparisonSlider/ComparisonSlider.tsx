'use client';

import React, { useRef, useState, useCallback, useEffect, memo, type ReactNode } from 'react';
import { calculateSplitPosition, calculateVerticalSplitPosition, generateClipPath, generateVerticalClipPath, stepSliderPosition } from './slider-math';

export interface ComparisonSliderProps {
	before: ReactNode;
	after: ReactNode;
	defaultPosition?: number;
	step?: number;
	orientation?: 'horizontal' | 'vertical';
	disabled?: boolean;
	className?: string;
	handleClassName?: string;
	aspectRatio?: string;
	onPositionChange?: (position: number) => void;
}

/**
 * ComparisonSlider — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Sub-pixel clip-path polygon rendering directly on the GPU compositor.
 * - Zero layout thrashing: bounding geometry cached on pointerdown, eliminating continuous getBoundingClientRect().
 * - Ironclad pointer lifecycle: buttons===0 validation + lostpointercapture + window listeners eliminate stickiness.
 * - Zero external animation libraries (Zero Framer Motion).
 * - Full WAI-ARIA slider accessibility contract with keyboard step navigation.
 */
export const ComparisonSlider = memo<ComparisonSliderProps>(
	({ before, after, defaultPosition = 0.5, step = 0.05, orientation = 'horizontal', disabled = false, className = '', handleClassName = '', aspectRatio = '16/9', onPositionChange }) => {
		const [position, setPosition] = useState<number>(defaultPosition);
		const positionRef = useRef<number>(defaultPosition);
		positionRef.current = position;

		const containerRef = useRef<HTMLDivElement>(null);
		const beforeLayerRef = useRef<HTMLDivElement>(null);
		const handleRef = useRef<HTMLDivElement>(null);

		const isDraggingRef = useRef<boolean>(false);
		const activePointerIdRef = useRef<number | null>(null);
		const activeTargetRef = useRef<HTMLElement | null>(null);
		const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
		const rafIdRef = useRef<number | null>(null);

		const isVertical = orientation === 'vertical';

		const measureRect = useCallback(() => {
			const container = containerRef.current;
			if (!container) return;
			const r = container.getBoundingClientRect();
			rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
		}, []);

		// Direct GPU transform & clip-path updater
		const applyStyles = useCallback(
			(pos: number) => {
				const percentage = (pos * 100).toFixed(3);
				if (beforeLayerRef.current) {
					beforeLayerRef.current.style.clipPath = isVertical ? generateVerticalClipPath(pos) : generateClipPath(pos);
				}
				if (handleRef.current) {
					if (isVertical) {
						handleRef.current.style.top = `${percentage}%`;
					} else {
						handleRef.current.style.left = `${percentage}%`;
					}
				}
			},
			[isVertical]
		);

		const updatePosition = useCallback(
			(newPos: number) => {
				const clamped = Math.max(0, Math.min(1, newPos));
				positionRef.current = clamped;
				applyStyles(clamped);
				setPosition(clamped);
				onPositionChange?.(clamped);
			},
			[applyStyles, onPositionChange]
		);

		const handleEnd = useCallback((pointerId?: number) => {
			if (!isDraggingRef.current) return;
			isDraggingRef.current = false;

			if (pointerId !== undefined && activeTargetRef.current) {
				try {
					activeTargetRef.current.releasePointerCapture(pointerId);
				} catch {
					// Ignore if capture was already released
				}
			}
			activePointerIdRef.current = null;
			activeTargetRef.current = null;
			rectRef.current = null;
		}, []);

		const handlePointerDown = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (disabled) return;
				if (e.pointerType === 'mouse' && e.button !== 0) return;

				isDraggingRef.current = true;
				activePointerIdRef.current = e.pointerId;
				activeTargetRef.current = e.currentTarget;

				try {
					e.currentTarget.setPointerCapture(e.pointerId);
				} catch {
					// Ignore
				}

				measureRect();
				const rect = rectRef.current;
				if (!rect) return;

				const newPos = isVertical ? calculateVerticalSplitPosition(e.clientY, rect.top, rect.height) : calculateSplitPosition(e.clientX, rect.left, rect.width);
				updatePosition(newPos);
			},
			[disabled, isVertical, measureRect, updatePosition]
		);

		const handlePointerMove = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (!isDraggingRef.current) return;

				// Ironclad stickiness guard: if mouse button was released outside, terminate drag immediately
				if (e.pointerType === 'mouse' && e.buttons === 0) {
					handleEnd(e.pointerId);
					return;
				}

				if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;

				if (!rectRef.current) measureRect();
				const rect = rectRef.current;
				if (!rect) return;

				const newPos = isVertical ? calculateVerticalSplitPosition(e.clientY, rect.top, rect.height) : calculateSplitPosition(e.clientX, rect.left, rect.width);

				if (rafIdRef.current === null) {
					rafIdRef.current = requestAnimationFrame(() => {
						updatePosition(newPos);
						rafIdRef.current = null;
					});
				}
			},
			[isVertical, measureRect, updatePosition, handleEnd]
		);

		const handlePointerUp = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				handleEnd(e.pointerId);
			},
			[handleEnd]
		);

		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (disabled) return;
				let delta = 0;
				if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
					delta = -step;
				} else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
					delta = step;
				} else if (e.key === 'Home') {
					updatePosition(0);
					e.preventDefault();
					return;
				} else if (e.key === 'End') {
					updatePosition(1);
					e.preventDefault();
					return;
				}

				if (delta !== 0) {
					e.preventDefault();
					updatePosition(stepSliderPosition(positionRef.current, delta));
				}
			},
			[disabled, step, updatePosition]
		);

		// Global safety net for pointer releases outside window/viewport
		useEffect(() => {
			const onGlobalPointerUp = (e: PointerEvent) => {
				if (isDraggingRef.current) {
					handleEnd(e.pointerId);
				}
			};
			window.addEventListener('pointerup', onGlobalPointerUp);
			window.addEventListener('pointercancel', onGlobalPointerUp);
			return () => {
				window.removeEventListener('pointerup', onGlobalPointerUp);
				window.removeEventListener('pointercancel', onGlobalPointerUp);
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
				}
			};
		}, [handleEnd]);

		// Update cached geometry on window scroll or resize while dragging
		useEffect(() => {
			const onScrollOrResize = () => {
				if (isDraggingRef.current) {
					measureRect();
				}
			};
			window.addEventListener('scroll', onScrollOrResize, { passive: true });
			window.addEventListener('resize', onScrollOrResize, { passive: true });
			return () => {
				window.removeEventListener('scroll', onScrollOrResize);
				window.removeEventListener('resize', onScrollOrResize);
			};
		}, [measureRect]);

		// Sync when defaultPosition prop changes from outside
		useEffect(() => {
			updatePosition(defaultPosition);
		}, [defaultPosition, updatePosition]);

		const clipPathStyle = isVertical ? generateVerticalClipPath(position) : generateClipPath(position);
		const handlePercentage = (position * 100).toFixed(2);

		return (
			<div
				ref={containerRef}
				role='slider'
				tabIndex={disabled ? -1 : 0}
				aria-label='Media comparison slider'
				aria-orientation={orientation}
				aria-valuenow={Math.round(position * 100)}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-disabled={disabled}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
				onLostPointerCapture={handlePointerUp}
				onKeyDown={handleKeyDown}
				className={`border-border focus-visible:ring-primary relative overflow-hidden rounded-2xl border select-none touch-none focus:outline-none focus-visible:ring-2 ${
					disabled ? 'cursor-not-allowed opacity-60' : isVertical ? 'cursor-ns-resize' : 'cursor-ew-resize'
				} ${className}`}
				style={{ aspectRatio }}
			>
				{/* After Layer (Background - full container) */}
				<div className='pointer-events-none absolute inset-0 size-full'>{after}</div>

				{/* Before Layer (Foreground - sub-pixel clipped polygon) */}
				<div ref={beforeLayerRef} className='pointer-events-none absolute inset-0 size-full will-change-[clip-path]' style={{ clipPath: clipPathStyle }}>
					{before}
				</div>

				{/* Divider Line & Handle */}
				<div
					ref={handleRef}
					className={`pointer-events-none absolute z-10 flex items-center justify-center will-change-[left,top] ${
						isVertical ? 'right-0 left-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'
					}`}
					style={isVertical ? { top: `${handlePercentage}%` } : { left: `${handlePercentage}%` }}
				>
					{/* Divider Rail */}
					<div className={`${isVertical ? 'h-0.5 w-full' : 'h-full w-0.5'} bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />

					{/* Center Handle Button */}
					<div className={`border-border bg-background text-muted-foreground absolute flex h-8 w-8 items-center justify-center rounded-full border shadow-lg ${handleClassName}`}>
						{isVertical ? (
							<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
								<path d='m18 9-6-6-6 6' />
								<path d='m6 15 6 6 6-6' />
							</svg>
						) : (
							<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
								<path d='m9 18-6-6 6-6' />
								<path d='m15 6 6 6-6 6' />
							</svg>
						)}
					</div>
				</div>
			</div>
		);
	}
);

ComparisonSlider.displayName = 'ComparisonSlider';
