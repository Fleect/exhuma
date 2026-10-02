'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';
import type { TiltCardProps } from '../types';
import { calculateTilt, generateTiltTransform, calculateGlare, generateGlareStyle, calculateParallaxOffset, generateParallaxTransform, lerp } from './tilt-math';

/**
 * TiltCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) Time: Zero layout thrashing during pointer move via bounding-box caching.
 * - Ω(1) Memory: Zero per-frame React state allocations during cursor tracking.
 * - Ω(120Hz) Fluidity: Direct DOM transform writes driven by rAF spring lerp.
 * - Accessibility: WCAG 2.2 AA prefers-reduced-motion fallback.
 */
export const TiltCard = memo<TiltCardProps>(
	({ children, maxTilt = 15, perspective = 1000, scale = 1.02, speed = 0.12, reverse = false, disabled = false, axis = 'all', glare = false, maxGlareOpacity = 0.25, className = '', style, ...props }) => {
		const cardRef = useRef<HTMLDivElement>(null);
		const glareRef = useRef<HTMLDivElement>(null);
		const rafIdRef = useRef<number | null>(null);
		const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
		const depthItemsRef = useRef<Array<{ el: HTMLElement; depth: number }>>([]);

		// Target values set from pointer events (no re-renders)
		const targetRotX = useRef(0);
		const targetRotY = useRef(0);
		const targetScale = useRef(1);
		const targetGlareX = useRef(50);
		const targetGlareY = useRef(50);
		const targetGlareOpacity = useRef(0);

		// Current animated values
		const currentRotX = useRef(0);
		const currentRotY = useRef(0);
		const currentScale = useRef(1);
		const currentGlareX = useRef(50);
		const currentGlareY = useRef(50);
		const currentGlareOpacity = useRef(0);

		const isHoveredRef = useRef(false);
		const isReducedMotionRef = useRef(false);

		useEffect(() => {
			isReducedMotionRef.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}, []);

		const updateFrame = useCallback(() => {
			const card = cardRef.current;
			if (!card) return;

			if (disabled || isReducedMotionRef.current) {
				card.style.transform = '';
				rafIdRef.current = null;
				return;
			}

			const lerpFactor = Math.max(0.01, Math.min(1, speed));

			currentRotX.current = lerp(currentRotX.current, targetRotX.current, lerpFactor);
			currentRotY.current = lerp(currentRotY.current, targetRotY.current, lerpFactor);
			currentScale.current = lerp(currentScale.current, targetScale.current, lerpFactor);

			card.style.transform = generateTiltTransform(perspective, currentRotX.current, currentRotY.current, currentScale.current);

			if (glare && glareRef.current) {
				currentGlareX.current = lerp(currentGlareX.current, targetGlareX.current, lerpFactor);
				currentGlareY.current = lerp(currentGlareY.current, targetGlareY.current, lerpFactor);
				currentGlareOpacity.current = lerp(currentGlareOpacity.current, targetGlareOpacity.current, lerpFactor);
				const gStyle = generateGlareStyle(currentGlareX.current, currentGlareY.current, currentGlareOpacity.current);
				glareRef.current.style.opacity = gStyle.opacity;
				glareRef.current.style.background = gStyle.background;
			}

			if (depthItemsRef.current.length > 0) {
				const items = depthItemsRef.current;
				for (let i = 0; i < items.length; i++) {
					const offset = calculateParallaxOffset(currentRotX.current, currentRotY.current, maxTilt, items[i].depth);
					items[i].el.style.transform = generateParallaxTransform(offset.x, offset.y);
				}
			}

			// Check convergence
			const diffRotX = Math.abs(targetRotX.current - currentRotX.current);
			const diffRotY = Math.abs(targetRotY.current - currentRotY.current);
			const diffScale = Math.abs(targetScale.current - currentScale.current);
			const diffGlare = glare ? Math.abs(targetGlareOpacity.current - currentGlareOpacity.current) : 0;

			if (diffRotX > 0.01 || diffRotY > 0.01 || diffScale > 0.001 || diffGlare > 0.01 || isHoveredRef.current) {
				rafIdRef.current = requestAnimationFrame(updateFrame);
			} else {
				if (depthItemsRef.current.length > 0 && !isHoveredRef.current) {
					const items = depthItemsRef.current;
					for (let i = 0; i < items.length; i++) {
						items[i].el.style.transform = '';
					}
					depthItemsRef.current = [];
				}
				rafIdRef.current = null;
			}
		}, [perspective, speed, disabled, glare, maxTilt]);

		const scheduleRaf = useCallback(() => {
			if (rafIdRef.current === null) {
				rafIdRef.current = requestAnimationFrame(updateFrame);
			}
		}, [updateFrame]);

		const measureRect = useCallback(() => {
			const card = cardRef.current;
			if (!card) return;
			const r = card.getBoundingClientRect();
			rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
		}, []);

		const handlePointerMove = useCallback(
			(e: React.PointerEvent<HTMLDivElement>) => {
				if (disabled || isReducedMotionRef.current) return;
				if (!rectRef.current) measureRect();
				const rect = rectRef.current;
				if (!rect) return;

				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const tilt = calculateTilt(x, y, rect.width, rect.height, maxTilt, reverse, axis);
				targetRotX.current = tilt.rotX;
				targetRotY.current = tilt.rotY;

				if (glare) {
					const glareCoord = calculateGlare(x, y, rect.width, rect.height, maxGlareOpacity);
					targetGlareX.current = glareCoord.glareX;
					targetGlareY.current = glareCoord.glareY;
					targetGlareOpacity.current = glareCoord.glareOpacity;
				}

				scheduleRaf();
			},
			[disabled, maxTilt, reverse, axis, glare, maxGlareOpacity, measureRect, scheduleRaf]
		);

		const handlePointerEnter = useCallback(() => {
			if (disabled || isReducedMotionRef.current) return;
			isHoveredRef.current = true;
			targetScale.current = scale;
			measureRect();

			// Cache diorama depth child elements on enter (zero per-frame DOM queries)
			if (cardRef.current) {
				const depthEls = cardRef.current.querySelectorAll<HTMLElement>('[data-depth]');
				depthItemsRef.current = Array.from(depthEls)
					.map((el) => ({ el, depth: parseFloat(el.getAttribute('data-depth') || '0') }))
					.filter((item) => !isNaN(item.depth) && item.depth !== 0);
			}

			scheduleRaf();
		}, [disabled, scale, measureRect, scheduleRaf]);

		const handlePointerLeave = useCallback(() => {
			isHoveredRef.current = false;
			rectRef.current = null;
			targetRotX.current = 0;
			targetRotY.current = 0;
			targetScale.current = 1.0;
			if (glare) {
				targetGlareOpacity.current = 0;
			}
			scheduleRaf();
		}, [glare, scheduleRaf]);

		// Handle scroll or resize during hover to keep bounds accurate without per-move thrashing
		useEffect(() => {
			const onScrollOrResize = () => {
				if (isHoveredRef.current) {
					measureRect();
				}
			};
			window.addEventListener('scroll', onScrollOrResize, { passive: true });
			window.addEventListener('resize', onScrollOrResize, { passive: true });
			return () => {
				window.removeEventListener('scroll', onScrollOrResize);
				window.removeEventListener('resize', onScrollOrResize);
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
				}
			};
		}, [measureRect]);

		return (
			<div
				ref={cardRef}
				onPointerEnter={handlePointerEnter}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className={`exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform ${className}`}
				style={style}
				{...props}
			>
				{children}
				{glare && <div ref={glareRef} aria-hidden='true' className='pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-150' style={{ opacity: 0 }} />}
			</div>
		);
	}
);

TiltCard.displayName = 'TiltCard';
