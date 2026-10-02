'use client';

import React, { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { SwipeVelocityRingBuffer, calculateCardRotation, evaluateSwipeDecision, calculateStackedCardTransform, calculateFlingDuration, calculateElasticDamping } from './swipe-math';

export interface CardSwipeStackHandle {
	/** Programmatically trigger a fling swipe in the given direction */
	swipe: (direction: 'left' | 'right') => void;
	/** Programmatically undo the last dismissed card from the history buffer */
	undo: () => void;
	/** Whether there is at least one card in the undo buffer */
	canUndo: boolean;
}

export interface CardSwipeStackProps<T> {
	items: T[];
	renderCard: (item: T, index: number) => ReactNode;
	onSwipe?: (item: T, direction: 'left' | 'right') => void;
	onUndo?: (item: T) => void;
	thresholdDistance?: number;
	thresholdVelocity?: number;
	maxRotation?: number;
	scaleStep?: number;
	offsetStep?: number;
	preventLastCardDismiss?: boolean;
	maxVisible?: number;
	className?: string;
	emptyState?: ReactNode;
	loop?: boolean;
	mode?: 'dismiss' | 'recycle';
	ref?: React.Ref<CardSwipeStackHandle>;
}

function getItemKey<T>(item: T, fallbackIndex: number): string | number {
	if (item && typeof item === 'object') {
		if ('id' in item && item.id !== null && item.id !== undefined) return String(item.id);
		if ('key' in item && (item as Record<string, unknown>).key !== null && (item as Record<string, unknown>).key !== undefined) return String((item as Record<string, unknown>).key);
	}
	return `card-${fallbackIndex}`;
}

/**
 * CardSwipeStack — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - VelocityRingBuffer pre-allocated Float64Array circular buffer for O(1) fling velocity tracking.
 * - Single unified card list with stable item-based keys: zero DOM thrashing, zero component remounting,
 *   zero 1-frame reconciliation jumps during card promotions.
 * - Smooth quartic ease-out kinematics for fluid, natural fling and spring return.
 * - Ironclad pointer lifecycle: lostpointercapture + buttons===0 validation + window listeners eliminate stickiness.
 * - Zero external animation libraries (Framer Motion, GSAP, etc.).
 */
export function CardSwipeStack<T>({
	items,
	renderCard,
	onSwipe,
	onUndo,
	thresholdDistance = 120,
	thresholdVelocity = 550,
	maxRotation = 20,
	scaleStep = 0.05,
	offsetStep = 14,
	preventLastCardDismiss = true,
	maxVisible = 3,
	className = '',
	emptyState = null,
	loop = false,
	mode = 'dismiss',
	ref,
}: CardSwipeStackProps<T>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentIndexRef = useRef(currentIndex);
	currentIndexRef.current = currentIndex;

	const historyRef = useRef<{ index: number; direction: 'left' | 'right' }[]>([]);

	// Refs to current rendered card DOM elements (index 0 = top, index 1 = next, ...)
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const isDraggingRef = useRef<boolean>(false);
	const isAnimatingRef = useRef<boolean>(false);
	const isLastCardRef = useRef<boolean>(false);
	const activePointerIdRef = useRef<number | null>(null);
	const activeTargetRef = useRef<HTMLElement | null>(null);
	const dragProgressRef = useRef<number>(0);
	const ringBufferRef = useRef<SwipeVelocityRingBuffer>(new SwipeVelocityRingBuffer());
	const rafIdRef = useRef<number | null>(null);

	const isRecycle = loop || mode === 'recycle';

	const visibleItems: T[] = [];
	for (let i = 0; i < maxVisible; i++) {
		if (isRecycle) {
			if (items.length === 0) break;
			visibleItems.push(items[(currentIndex + i) % items.length]);
		} else {
			if (currentIndex + i >= items.length) break;
			visibleItems.push(items[currentIndex + i]);
		}
	}

	const cancelRaf = useCallback(() => {
		if (rafIdRef.current !== null) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	// Reset card refs array length on render
	cardRefs.current = cardRefs.current.slice(0, visibleItems.length);

	// Apply resting transforms to background cards
	const applyRestingTransforms = useCallback(() => {
		for (let i = 1; i < cardRefs.current.length; i++) {
			const el = cardRefs.current[i];
			if (!el) continue;
			const t = calculateStackedCardTransform(i, 0, scaleStep, offsetStep);
			el.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			el.style.opacity = `${t.opacity.toFixed(2)}`;
			el.style.zIndex = `${30 - i * 10}`;
		}
	}, [scaleStep, offsetStep]);

	// Update DOM during active drag
	const updateDOM = useCallback(() => {
		const topEl = cardRefs.current[0];
		if (!topEl) return;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		// Dampen vertical displacement so gestures feel stable and weighted
		const dy = (currentPosRef.current.y - startPosRef.current.y) * 0.35;

		let dx: number;
		let rot: number;

		if (isLastCardRef.current) {
			dx = calculateElasticDamping(rawDx, 80);
			rot = calculateCardRotation(dx, maxRotation * 0.35, thresholdDistance * 1.5);
		} else {
			dx = rawDx;
			rot = calculateCardRotation(dx, maxRotation, thresholdDistance * 1.5);
		}

		topEl.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

		// Background cards preview forward up to 50% during drag
		const progress = isLastCardRef.current ? 0 : Math.min(0.5, (Math.abs(rawDx) / (thresholdDistance * 2)) * 0.5);
		dragProgressRef.current = progress;

		for (let i = 1; i < cardRefs.current.length; i++) {
			const bgEl = cardRefs.current[i];
			if (!bgEl) continue;
			const t = calculateStackedCardTransform(i, progress, scaleStep, offsetStep);
			bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
			bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
		}
	}, [maxRotation, thresholdDistance, scaleStep, offsetStep]);

	// Spring return animation (release without dismiss)
	const animateReturn = useCallback(() => {
		const topEl = cardRefs.current[0];
		if (!topEl) return;

		cancelRaf();
		isAnimatingRef.current = true;

		const rawDx = currentPosRef.current.x - startPosRef.current.x;
		const rawDy = (currentPosRef.current.y - startPosRef.current.y) * 0.35;
		const startX = isLastCardRef.current ? calculateElasticDamping(rawDx, 80) : rawDx;
		const startY = rawDy;
		const startProgress = dragProgressRef.current;

		const dist = Math.sqrt(startX * startX + startY * startY);
		const duration = Math.max(180, Math.min(260, dist * 0.85));
		let start: number | null = null;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const p = Math.min(1, (timestamp - start) / duration);
			// Quartic ease-out for a crisp, organic settle
			const ease = 1 - Math.pow(1 - p, 4);

			const curX = startX * (1 - ease);
			const curY = startY * (1 - ease);
			const rot = isLastCardRef.current ? calculateCardRotation(curX, maxRotation * 0.35, thresholdDistance * 1.5) : calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);

			topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;

			// Background cards ease back to resting state
			const curProgress = startProgress * (1 - ease);
			for (let i = 1; i < cardRefs.current.length; i++) {
				const bgEl = cardRefs.current[i];
				if (!bgEl) continue;
				const t = calculateStackedCardTransform(i, curProgress, scaleStep, offsetStep);
				bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
				bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
			}

			if (p < 1) {
				rafIdRef.current = requestAnimationFrame(step);
			} else {
				topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
				applyRestingTransforms();
				dragProgressRef.current = 0;
				rafIdRef.current = null;
				isAnimatingRef.current = false;
			}
		};

		rafIdRef.current = requestAnimationFrame(step);
	}, [maxRotation, thresholdDistance, scaleStep, offsetStep, applyRestingTransforms, cancelRaf]);

	// Fling dismiss or recycle animation
	const animateDismiss = useCallback(
		(direction: 'left' | 'right', initialVelocityX: number = 0) => {
			const topEl = cardRefs.current[0];
			if (!topEl) return;

			cancelRaf();
			isAnimatingRef.current = true;

			const isRecycle = Boolean(loop || mode === 'recycle');
			const startX = currentPosRef.current.x - startPosRef.current.x;
			const startY = (currentPosRef.current.y - startPosRef.current.y) * 0.35;
			const startProgress = dragProgressRef.current;

			if (isRecycle) {
				// Infinite Deck Recycling: outward arc -> drop z-index behind deck -> swoop under to bottom layer
				const bottomIdx = Math.max(0, visibleItems.length - 1);
				const bottomT = calculateStackedCardTransform(bottomIdx, 0, scaleStep, offsetStep);
				const targetBottomY = bottomT.translateY;
				const targetBottomScale = bottomT.scale;
				const targetBottomOpacity = bottomT.opacity;

				// Peak outward distance before dropping under the deck
				const outX = direction === 'right' ? 320 : -320;
				const duration = 380;
				let start: number | null = null;
				let droppedBehind = false;

				const step = (timestamp: number) => {
					if (!start) start = timestamp;
					const p = Math.min(1, (timestamp - start) / duration);

					if (p < 0.38) {
						// Phase 1: Fling outward to clear the stack edge
						const u = p / 0.38;
						const ease1 = 1 - Math.pow(1 - u, 3);
						const curX = startX + (outX - startX) * ease1;
						const curY = startY * (1 - ease1) + targetBottomY * 0.3 * ease1;
						const curRot = calculateCardRotation(curX, maxRotation * 1.15, thresholdDistance * 1.5);
						const curScale = 1.0 - 0.04 * ease1;

						topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(3)}) rotate(${curRot.toFixed(2)}deg)`;
						topEl.style.opacity = '1';
						topEl.style.zIndex = '35';
					} else {
						// Phase 2: Card drops behind deck and swoops smoothly into the bottom slot
						if (!droppedBehind) {
							topEl.style.zIndex = '5';
							droppedBehind = true;
						}
						const w = (p - 0.38) / 0.62;
						// Hermite cubic smoothstep for organic settling
						const ease2 = w * w * (3 - 2 * w);
						const curX = outX * (1 - ease2);
						const curY = targetBottomY * 0.3 + (targetBottomY - targetBottomY * 0.3) * ease2;
						const curRot = calculateCardRotation(outX, maxRotation * 1.15, thresholdDistance * 1.5) * (1 - ease2);
						const curScale = 0.96 + (targetBottomScale - 0.96) * ease2;
						const curOpacity = 1.0 + (targetBottomOpacity - 1.0) * ease2;

						topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(3)}) rotate(${curRot.toFixed(2)}deg)`;
						topEl.style.opacity = `${curOpacity.toFixed(2)}`;
					}

					// Background cards promote forward over the first half
					const bgProg = Math.min(1, startProgress + (1 - startProgress) * Math.min(1, p / 0.42));
					const bgEase = bgProg * bgProg * (3 - 2 * bgProg);
					for (let i = 1; i < cardRefs.current.length; i++) {
						const bgEl = cardRefs.current[i];
						if (!bgEl) continue;
						const t = calculateStackedCardTransform(i, bgEase, scaleStep, offsetStep);
						bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
						bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
					}

					if (p < 1) {
						rafIdRef.current = requestAnimationFrame(step);
					} else {
						// Settle complete: card has arrived at the bottom position
						dragProgressRef.current = 0;
						rafIdRef.current = null;
						isAnimatingRef.current = false;

						historyRef.current.push({ index: currentIndexRef.current, direction });
						if (historyRef.current.length > 5) {
							historyRef.current.shift();
						}

						const dismissedItem = items[currentIndexRef.current % items.length];
						if (onSwipe && dismissedItem) {
							onSwipe(dismissedItem, direction);
						}
						setCurrentIndex((prev) => prev + 1);
					}
				};

				rafIdRef.current = requestAnimationFrame(step);
			} else {
				// Standard Dismiss: fling off screen and fade out
				const exitDistance = Math.min(520, Math.max(380, typeof window !== 'undefined' ? window.innerWidth * 0.45 : 440));
				const targetX = direction === 'right' ? exitDistance : -exitDistance;
				const distRemaining = Math.abs(targetX - startX);
				const duration = calculateFlingDuration(distRemaining, initialVelocityX, 190, 280);
				let start: number | null = null;

				const step = (timestamp: number) => {
					if (!start) start = timestamp;
					const p = Math.min(1, (timestamp - start) / duration);
					const ease = 1 - Math.pow(1 - p, 4);

					const curX = startX + (targetX - startX) * ease;
					const curY = startY * (1 - ease);
					const curRot = calculateCardRotation(curX, maxRotation * 1.25, thresholdDistance * 1.5);
					const fadeOut = Math.max(0, 1 - Math.max(0, p - 0.35) / 0.65);

					topEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${curRot.toFixed(2)}deg)`;
					topEl.style.opacity = `${fadeOut.toFixed(2)}`;

					const bgProgress = startProgress + (1 - startProgress) * ease;
					for (let i = 1; i < cardRefs.current.length; i++) {
						const bgEl = cardRefs.current[i];
						if (!bgEl) continue;
						const t = calculateStackedCardTransform(i, bgProgress, scaleStep, offsetStep);
						bgEl.style.transform = `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`;
						bgEl.style.opacity = `${t.opacity.toFixed(2)}`;
					}

					if (p < 1) {
						rafIdRef.current = requestAnimationFrame(step);
					} else {
						topEl.style.opacity = '0';
						dragProgressRef.current = 0;
						rafIdRef.current = null;
						isAnimatingRef.current = false;

						historyRef.current.push({ index: currentIndexRef.current, direction });
						if (historyRef.current.length > 5) {
							historyRef.current.shift();
						}

						const dismissedItem = items[currentIndexRef.current];
						if (onSwipe && dismissedItem) {
							onSwipe(dismissedItem, direction);
						}
						setCurrentIndex((prev) => prev + 1);
					}
				};

				rafIdRef.current = requestAnimationFrame(step);
			}
		},
		[items, maxRotation, onSwipe, thresholdDistance, scaleStep, offsetStep, cancelRaf, loop, mode, visibleItems.length]
	);

	const swipe = useCallback(
		(direction: 'left' | 'right') => {
			if (isAnimatingRef.current || isDraggingRef.current) return;
			if (!isRecycle && currentIndexRef.current >= items.length) return;
			if (!isRecycle && preventLastCardDismiss && currentIndexRef.current >= items.length - 1) return;
			animateDismiss(direction, direction === 'right' ? 600 : -600);
		},
		[isRecycle, items.length, preventLastCardDismiss, animateDismiss]
	);

	const undo = useCallback(() => {
		if (isAnimatingRef.current || isDraggingRef.current) return;
		if (historyRef.current.length === 0) return;
		const lastEntry = historyRef.current.pop();
		if (!lastEntry) return;

		cancelRaf();
		isAnimatingRef.current = true;

		setCurrentIndex((prev) => Math.max(0, prev - 1));

		const restoredIndex = lastEntry.index;
		const restoredItem = items[isRecycle ? restoredIndex % items.length : restoredIndex];
		if (onUndo && restoredItem) {
			onUndo(restoredItem);
		}

		requestAnimationFrame(() => {
			const topEl = cardRefs.current[0];
			if (!topEl) {
				isAnimatingRef.current = false;
				return;
			}

			const startX = lastEntry.direction === 'right' ? 440 : -440;
			const duration = 240;
			let start: number | null = null;

			const step = (timestamp: number) => {
				if (!start) start = timestamp;
				const p = Math.min(1, (timestamp - start) / duration);
				const ease = 1 - Math.pow(1 - p, 4);

				const curX = startX * (1 - ease);
				const curRot = calculateCardRotation(curX, maxRotation, thresholdDistance * 1.5);
				topEl.style.transform = `translate3d(${curX.toFixed(2)}px, 0, 0) rotate(${curRot.toFixed(2)}deg)`;
				topEl.style.opacity = `${ease.toFixed(2)}`;

				if (p < 1) {
					rafIdRef.current = requestAnimationFrame(step);
				} else {
					topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
					topEl.style.opacity = '1';
					applyRestingTransforms();
					rafIdRef.current = null;
					isAnimatingRef.current = false;
				}
			};

			rafIdRef.current = requestAnimationFrame(step);
		});
	}, [isRecycle, items, onUndo, maxRotation, thresholdDistance, applyRestingTransforms, cancelRaf]);

	React.useImperativeHandle(
		ref,
		() => ({
			swipe,
			undo,
			get canUndo() {
				return historyRef.current.length > 0;
			},
		}),
		[swipe, undo]
	);

	// Safe completion of drag gesture
	const finishDrag = useCallback(() => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;

		if (isLastCardRef.current) {
			animateReturn();
			return;
		}

		const dx = currentPosRef.current.x - startPosRef.current.x;
		const velocityX = ringBufferRef.current.computeVelocityX();
		const decision = evaluateSwipeDecision(dx, velocityX, thresholdDistance, thresholdVelocity);

		if (decision.isDismissed && decision.direction) {
			animateDismiss(decision.direction, velocityX);
		} else {
			animateReturn();
		}
	}, [animateReturn, animateDismiss, thresholdDistance, thresholdVelocity]);

	const handleEnd = useCallback(
		(pointerId?: number) => {
			if (!isDraggingRef.current) return;
			if (pointerId !== undefined && activeTargetRef.current) {
				try {
					activeTargetRef.current.releasePointerCapture(pointerId);
				} catch {
					// Ignore if capture was already released
				}
			}
			activePointerIdRef.current = null;
			activeTargetRef.current = null;
			finishDrag();
		},
		[finishDrag]
	);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (isAnimatingRef.current || visibleItems.length === 0) return;
		if (e.pointerType === 'mouse' && e.button !== 0) return;

		isDraggingRef.current = true;
		const isRecycle = loop || mode === 'recycle';
		isLastCardRef.current = !isRecycle && preventLastCardDismiss && currentIndexRef.current >= items.length - 1;
		activePointerIdRef.current = e.pointerId;
		activeTargetRef.current = e.currentTarget;

		try {
			e.currentTarget.setPointerCapture(e.pointerId);
		} catch {
			// Ignore if pointer capture is unavailable
		}

		startPosRef.current = { x: e.clientX, y: e.clientY };
		currentPosRef.current = { x: e.clientX, y: e.clientY };
		ringBufferRef.current.clear();
		ringBufferRef.current.push(e.clientX, e.clientY, performance.now());
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDraggingRef.current) return;

		// Ironclad stickiness guard: If mouse button was released outside, stop dragging immediately
		if (e.pointerType === 'mouse' && e.buttons === 0) {
			handleEnd(e.pointerId);
			return;
		}

		if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;

		currentPosRef.current = { x: e.clientX, y: e.clientY };
		ringBufferRef.current.push(e.clientX, e.clientY, performance.now());

		if (rafIdRef.current === null) {
			rafIdRef.current = requestAnimationFrame(() => {
				updateDOM();
				rafIdRef.current = null;
			});
		}
	};

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		handleEnd(e.pointerId);
	};

	const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
		handleEnd(e.pointerId);
	};

	const handleLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
		handleEnd(e.pointerId);
	};

	// Global window listener: safety net for mouse/pointer released anywhere outside the browser/iframe
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
		};
	}, [handleEnd]);

	// Cleanup rAF on unmount
	useEffect(() => {
		return cancelRaf;
	}, [cancelRaf]);

	// Ensure top card transform is clean on index change
	useEffect(() => {
		const topEl = cardRefs.current[0];
		if (topEl) {
			topEl.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
			topEl.style.opacity = '1';
			topEl.style.zIndex = '30';
		}
		applyRestingTransforms();
	}, [currentIndex, applyRestingTransforms]);

	return (
		<div
			className={`relative select-none ${className}`}
			style={{ minHeight: '14.5rem' }} // 232px — perfectly hugs card height + background peek
		>
			{/* Unified card stack rendering: back-to-front by visual index */}
			{visibleItems.map((item, stackIdx) => {
				const isTop = stackIdx === 0;
				const itemIndex = isRecycle ? (items.length > 0 ? (currentIndex + stackIdx) % items.length : 0) : currentIndex + stackIdx;
				const itemKey = getItemKey(item, itemIndex);
				const t = calculateStackedCardTransform(stackIdx, 0, scaleStep, offsetStep);

				return (
					<div
						key={itemKey}
						ref={(node) => {
							cardRefs.current[stackIdx] = node;
						}}
						onPointerDown={isTop ? handlePointerDown : undefined}
						onPointerMove={isTop ? handlePointerMove : undefined}
						onPointerUp={isTop ? handlePointerUp : undefined}
						onPointerCancel={isTop ? handlePointerCancel : undefined}
						onLostPointerCapture={isTop ? handleLostPointerCapture : undefined}
						className={`absolute inset-x-0 top-0 flex items-start justify-center will-change-transform ${isTop ? 'cursor-grab touch-none active:cursor-grabbing' : 'pointer-events-none'}`}
						style={{
							zIndex: 30 - stackIdx * 10,
							transform: `translate3d(0, ${t.translateY.toFixed(2)}px, 0) scale(${t.scale.toFixed(3)})`,
							opacity: t.opacity.toFixed(2),
							transformOrigin: 'top center',
						}}
					>
						{renderCard(item, itemIndex)}
					</div>
				);
			})}

			{/* Empty state when all cards are dismissed */}
			{visibleItems.length === 0 &&
				(emptyState || <div className='border-border bg-card text-muted-foreground absolute inset-0 flex items-center justify-center rounded-2xl border p-8 text-center text-sm'>No more cards in stack.</div>)}
		</div>
	);
}
