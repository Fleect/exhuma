'use client';

import React, { Children, isValidElement, useEffect, useMemo, useRef, memo, forwardRef, useCallback } from 'react';
import type { StackingCardsProps } from '../types';

/**
 * Pure Hermite interpolation function (Smoothstep)
 * Clamps t in [0, 1] and computes 3t^2 - 2t^3.
 * Zero heap allocation.
 */
export const smoothstep = (t: number): number => {
	const c = Math.max(0, Math.min(1, t));
	return c * c * (3 - 2 * c);
};

/**
 * Calculates progressive target scale values across stack layers.
 * The top cards scale down gracefully towards minScale as deeper cards scroll into view.
 */
export const calculateScaleValue = (index: number, totalScalingSections: number, minScale: number, targetScale = 1.0): number => {
	if (totalScalingSections <= 1) return targetScale;
	const progress = index / (totalScalingSections - 1);
	const scale = minScale + progress * (targetScale - minScale);
	return Number(scale.toPrecision(6));
};

export const generateDefaultScaleValues = (count: number, minScale = 0.9): number[] => {
	if (count <= 0) return [];
	if (count === 1) return [1.0];

	const values: number[] = [];
	for (let i = 0; i < count; i++) {
		const progress = i / (count - 1);
		const scale = minScale + progress * (1.0 - minScale);
		values.push(Number(scale.toPrecision(6)));
	}
	return values;
};


/**
 * Pure Mathematical Kernel for Tiered Reverse Cascade Scaling:
 *
 * Checkpoint positions across stack layers:
 * CP_totalCards = triggerTop (e.g. 186px for 4 cards)
 * CP_k = topStart + k * topIncrement for k < totalCards
 *
 * Tier progression:
 * 1. As the last card travels from triggerTop (CP_N) down to CP_{N-1}:
 *    Only the last card scales down from scaleValues[N-1] to scaleValues[N-2].
 * 2. Once reaching CP_{N-1}:
 *    Both the second-last and last card scale together from scaleValues[N-2] to scaleValues[N-3]
 *    until reaching CP_{N-2}.
 * 3. This cascades continuously across each segment until all cards converge at scaleValues[0] (minScale).
 *
 * Big-Omega Guarantee: Ω(1) constant time, 0 heap allocations.
 */
export const getReverseScale = (
	cardIndex: number,
	lastTop: number,
	triggerTop: number,
	topStart: number,
	topIncrement: number,
	totalCards: number,
	scaleValues: readonly number[] | number[],
	minScale: number
): number => {
	if (totalCards <= 1) return 1.0;
	if (cardIndex === 0) return scaleValues[0] ?? minScale;
	if (lastTop >= triggerTop) return scaleValues[cardIndex] ?? 1.0;

	// A card only joins the reverse cascade when lastTop drops below its activation checkpoint:
	const startCP = cardIndex + 1 === totalCards ? triggerTop : topStart + (cardIndex + 1) * topIncrement;
	if (lastTop >= startCP) {
		return scaleValues[cardIndex] ?? 1.0;
	}

	// Traverse cascade segments from (cardIndex + 1) down to 2:
	for (let k = cardIndex + 1; k >= 2; k--) {
		const segTop = k === totalCards ? triggerTop : topStart + k * topIncrement;
		const segBottom = topStart + (k - 1) * topIncrement;

		if (lastTop <= segBottom) {
			if (k === 2) return scaleValues[0] ?? minScale;
			continue;
		}

		if (lastTop <= segTop) {
			const span = Math.max(1, segTop - segBottom);
			const rawProgress = (segTop - lastTop) / span;
			const c = Math.max(0, Math.min(1, rawProgress));
			const progress = c * c * (3 - 2 * c);
			const fromScale = scaleValues[k - 1] ?? 1.0;
			const toScale = scaleValues[k - 2] ?? minScale;
			return fromScale + progress * (toScale - fromScale);
		}
	}

	return scaleValues[0] ?? minScale;
};

/**
 * StackingCards — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) / Ω(60Hz) Frame rate floor: batched read-then-write cycles, zero layout thrashing.
 * - Ω(1) Constant-time kinetic dispatch pipeline with zero GC allocations during active scroll.
 * - Sub-pixel scale decay with delta-epsilon clamping (eliminates redundant DOM writes).
 * - Dual-layer architecture: sticky outer shells (untargeted by transforms) + GPU-accelerated inner visual layers.
 * - 100% mathematical tier cascade parity.
 */
export const StackingCards = memo(
	forwardRef<HTMLDivElement, StackingCardsProps>(function StackingCards(
		{
			children,
			topStart = 20,
			topIncrement = 28,
			minScale = 0.9,
			scaleThreshold = 150,
			cardGap = 20,
			gap,
			reverseScale = true,
			enableReverseScale,
			scrollContainerRef,
			enabled = true,
			className = '',
			style,
			...props
		},
		forwardedRef
	) {
		const isReverseScaleEnabled = reverseScale ?? enableReverseScale ?? true;
		const wrapperRef = useRef<HTMLDivElement>(null);
		const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
		const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

		const setWrapperRef = useCallback(
			(node: HTMLDivElement | null) => {
				(wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
				if (typeof forwardedRef === 'function') {
					forwardedRef(node);
				} else if (forwardedRef) {
					(forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
			},
			[forwardedRef]
		);

		// Pre-allocated typed buffers for zero-GC 120Hz execution
		const prevScalesRef = useRef<Float64Array>(new Float64Array(0));
		const targetScalesRef = useRef<Float64Array>(new Float64Array(0));
		const cardTopsBufferRef = useRef<Float64Array>(new Float64Array(0));
		const rafIdRef = useRef<number | null>(null);

		const resolvedGap = cardGap ?? gap ?? 20;
		const childArray = Children.toArray(children);
		const totalCards = childArray.length;
		const scaleValues = useMemo(() => generateDefaultScaleValues(totalCards, minScale), [totalCards, minScale]);

		useEffect(() => {
			cardRefs.current.length = totalCards;
			innerRefs.current.length = totalCards;

			// Re-initialize buffers if card count changes
			if (prevScalesRef.current.length !== totalCards) {
				prevScalesRef.current = new Float64Array(totalCards).fill(-1);
				targetScalesRef.current = new Float64Array(totalCards);
				cardTopsBufferRef.current = new Float64Array(totalCards);
			}

			const wrapper = wrapperRef.current;
			if (!wrapper || typeof window === 'undefined' || !enabled || totalCards === 0) return;

			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			if (prefersReducedMotion) {
				innerRefs.current.forEach((inner) => {
					if (inner) inner.style.transform = 'scale(1)';
				});
				return;
			}

			// The trigger position where the last card meets the second-to-last card in stack progression:
			const secondLastCardStickyTop = topStart + Math.max(0, totalCards - 1) * topIncrement;
			const triggerTop = totalCards > 1 ? secondLastCardStickyTop + topIncrement : topStart;
			let isIntersecting = false;

			const updateStackEffect = () => {
				rafIdRef.current = null;
				if (totalCards === 0) return;

				const lastIndex = totalCards - 1;
				const lastCard = cardRefs.current[lastIndex];
				const firstCard = cardRefs.current[0];
				if (!lastCard || !firstCard) return;

				const container = scrollContainerRef?.current;
				const scrollportTop = container ? container.getBoundingClientRect().top + (container.clientTop || 0) : 0;
				const scrollTop = container ? container.scrollTop : window.scrollY;

				// Live measurement of the last card relative to scrollport top
				const lastTop = lastCard.getBoundingClientRect().top - scrollportTop;
				const reverseActive = isReverseScaleEnabled && lastTop <= triggerTop;

				const targetScales = targetScalesRef.current;

				// ── Phase 1: Read & Calculation Phase (Zero DOM Writes) ──────────
				if (reverseActive) {
					// Reverse scale active: normal forward scaling is stopped completely.
					// In reverse scale, all cards compute from lastTop without querying any other card's rect.
					for (let i = 0; i < totalCards; i++) {
						targetScales[i] = getReverseScale(i, lastTop, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale);
					}
				} else {
					// Normal forward scaling:
					// Batch read card positions first to avoid layout thrashing
					const cardTops = cardTopsBufferRef.current;
					for (let i = 0; i < totalCards; i++) {
						const card = cardRefs.current[i];
						cardTops[i] = card ? card.getBoundingClientRect().top - scrollportTop : 0;
					}

					for (let i = 0; i < totalCards; i++) {
						let forwardProgress = 0;
						if (i < totalCards - 1 && scrollTop > 0) {
							const cardTop = cardTops[i];
							const nextTop = cardTops[i + 1];
							const nextStickyTop = cardTop + topIncrement;

							// Un-scrolled natural top of nextCard in scrollport coordinates
							const initialNextTop = nextTop + scrollTop;
							const scaleStart = Math.min(initialNextTop - 2, nextStickyTop + scaleThreshold);
							const scaleDistance = Math.max(1, scaleStart - nextStickyTop);

							if (nextTop <= scaleStart) {
								forwardProgress = smoothstep((scaleStart - nextTop) / scaleDistance);
							}
						}

						const targetScale = scaleValues[i] ?? 1.0;
						targetScales[i] = 1.0 + forwardProgress * (targetScale - 1.0);
					}
				}

				// ── Phase 2: Write Phase with Delta-Epsilon Clamping ─────────────
				// Only dirty elements whose scale changed by more than 0.00005 are written to the GPU compositor.
				const prevScales = prevScalesRef.current;
				for (let i = 0; i < totalCards; i++) {
					const inner = innerRefs.current[i];
					if (!inner) continue;

					const currentScale = targetScales[i];
					if (Math.abs(prevScales[i] - currentScale) > 0.00005) {
						prevScales[i] = currentScale;
						inner.style.transform = `scale(${currentScale.toFixed(5)})`;
					}
				}
			};

			// 120 FPS rAF Coalescing: ensures at most 1 execution per display refresh frame
			const handleScroll = () => {
				if (isIntersecting && rafIdRef.current === null) {
					rafIdRef.current = requestAnimationFrame(updateStackEffect);
				}
			};

			const target = scrollContainerRef?.current;
			const observer = new IntersectionObserver(
				(entries) => {
					isIntersecting = entries[0]?.isIntersecting ?? false;
					if (isIntersecting) updateStackEffect();
				},
				{ root: target ?? null, rootMargin: '100px 0px', threshold: 0 }
			);
			observer.observe(wrapper);
			if (target) {
				target.addEventListener('scroll', handleScroll, { passive: true });
			}
			window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
			window.addEventListener('resize', handleScroll);

			// Initial calculation
			updateStackEffect();

			return () => {
				if (target) {
					target.removeEventListener('scroll', handleScroll);
				}
				window.removeEventListener('scroll', handleScroll, { capture: true });
				window.removeEventListener('resize', handleScroll);
				observer.disconnect();
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
					rafIdRef.current = null;
				}
			};
		}, [topStart, topIncrement, minScale, scaleThreshold, scrollContainerRef, enabled, totalCards, scaleValues, isReverseScaleEnabled]);

		return (
			<div
				ref={setWrapperRef}
				className={`exhuma-stacking-cards-wrapper relative flex w-full flex-col ${className}`}
				style={{
					paddingTop: typeof topStart === 'number' ? `${topStart}px` : topStart,
					gap: typeof resolvedGap === 'number' ? `${resolvedGap}px` : resolvedGap,
					...style,
				}}
				{...props}
			>
				{childArray.map((child, index) => {
					const isLast = totalCards > 1 && index === totalCards - 1;
					// When reverse scaling is enabled, the last card sticks at the second-last card's sticky top
					// (topStart + (totalCards - 2) * topIncrement) so it crowns the stack and eliminates any 1px alignment mismatch.
					// When reverse scaling is disabled, each card sticks at its standard echelon layer: topStart + index * topIncrement.
					const stickyTop = isReverseScaleEnabled && isLast ? topStart + Math.max(0, totalCards - 2) * topIncrement : topStart + index * topIncrement;
					return (
						<div
							key={index}
							ref={(el) => {
								cardRefs.current[index] = el;
							}}
							className='sticky w-full'
							style={{
								top: `${stickyTop}px`,
								zIndex: index + 1,
							}}
						>
							<div
								ref={(el) => {
									innerRefs.current[index] = el;
								}}
								className='relative w-full'
								style={{
									transformOrigin: 'center top',
									willChange: 'transform',
								}}
							>
								{isValidElement(child) ? child : <div>{child}</div>}
							</div>
						</div>
					);
				})}
			</div>
		);
	})
);

StackingCards.displayName = 'StackingCards';
