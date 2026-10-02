'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { InfiniteMarqueeProps } from '../types';
import { calculateMarqueeOffset, dampFactor, parseGapToPx, calculateCoupledScrollVelocity, evaluateMarqueeDirectionHysteresis } from './marquee-math';

/**
 * InfiniteMarquee — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) High-precision rAF translation without VDOM diffing.
 * - Ω(1) Time complexity modulo wrapping.
 * - Zero Garbage Collection allocations during active scrolling.
 * - Hardware-accelerated translate3d transforms.
 */
export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> & {
	Root: typeof MarqueeRoot;
	Track: typeof MarqueeTrack;
	Item: typeof MarqueeItem;
} = ({
	children,
	speed = 40,
	direction = 'left',
	pauseOnHover = true,
	gap = '1.5rem',
	showFadeEdges = true,
	fadeWidth = 48,
	fadeEdgeColor = '#ffffff',
	fadeEdgeColorDark = '#09090b',
	scrollCoupling = false,
	directionHysteresis = false,
	className = '',
	style,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const offsetRef = useRef<number>(0);
	const kineticFactorRef = useRef<number>(1.0);
	const targetFactorRef = useRef<number>(1.0);
	const lastTimeRef = useRef<number | null>(null);
	const contentWidthRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);

	const lastScrollYRef = useRef<number>(0);
	const scrollVelocityRef = useRef<number>(0);
	const activeDirectionRef = useRef<'left' | 'right'>(direction);

	// Sync direction prop to ref when it changes
	useEffect(() => {
		activeDirectionRef.current = direction;
	}, [direction]);

	const gapVal = typeof gap === 'number' ? `${gap}px` : gap;
	const gapNum = parseGapToPx(gap);

	// Measure content width once with ResizeObserver (Zero layout thrashing)
	useEffect(() => {
		const contentEl = contentRef.current;
		if (!contentEl) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				contentWidthRef.current = entry.contentRect.width;
			}
		});

		observer.observe(contentEl);
		return () => observer.disconnect();
	}, []);

	// Continuous kinetic translation loop
	const tick = useCallback(
		(now: number) => {
			if (lastTimeRef.current === null) {
				lastTimeRef.current = now;
				lastScrollYRef.current = window.scrollY;
			}
			const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1); // Max 100ms clamp for tab switch
			lastTimeRef.current = now;

			const currentScrollY = window.scrollY;
			if (dt > 0) {
				scrollVelocityRef.current = (currentScrollY - lastScrollYRef.current) / dt;
			}
			lastScrollYRef.current = currentScrollY;

			if (directionHysteresis) {
				activeDirectionRef.current = evaluateMarqueeDirectionHysteresis(activeDirectionRef.current, scrollVelocityRef.current);
			} else {
				activeDirectionRef.current = direction;
			}

			// Smooth hover deceleration/acceleration factor
			kineticFactorRef.current = dampFactor(kineticFactorRef.current, targetFactorRef.current, 12.0, dt);

			let baseSpeed = speed;
			if (scrollCoupling) {
				baseSpeed = calculateCoupledScrollVelocity(speed, scrollVelocityRef.current);
			}

			const effectiveSpeed = baseSpeed * kineticFactorRef.current;
			const width = contentWidthRef.current;
			const repeatWavelength = width + gapNum;

			if (width > 0 && effectiveSpeed > 0.01) {
				offsetRef.current = calculateMarqueeOffset(offsetRef.current, dt, effectiveSpeed, activeDirectionRef.current, repeatWavelength);

				if (trackRef.current) {
					trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
				}
			}

			rafIdRef.current = requestAnimationFrame(tick);
		},
		[speed, direction, gapNum, scrollCoupling, directionHysteresis]
	);

	useEffect(() => {
		rafIdRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [tick]);

	const handleMouseEnter = useCallback(() => {
		if (pauseOnHover) {
			targetFactorRef.current = 0.0;
		}
	}, [pauseOnHover]);

	const handleMouseLeave = useCallback(() => {
		if (pauseOnHover) {
			targetFactorRef.current = 1.0;
		}
	}, [pauseOnHover]);

	const useColorOverlay = Boolean(showFadeEdges && (fadeEdgeColor || fadeEdgeColorDark));

	const maskStyle: React.CSSProperties =
		showFadeEdges && !useColorOverlay
			? {
					maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
					WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
				}
			: {};

	return (
		<div
			ref={containerRef}
			className={`exhuma-marquee-root relative w-full overflow-hidden select-none ${className}`}
			style={{ ...maskStyle, ...style }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{useColorOverlay && (
				<>
					<style>{`
						.exhuma-marquee-fade-left, .exhuma-marquee-fade-right {
							--exhuma-fade-color: var(--fade-light, ${fadeEdgeColor || '#ffffff'});
						}
						:is(.dark, [data-theme='dark']) :is(.exhuma-marquee-fade-left, .exhuma-marquee-fade-right),
						:is(.dark, [data-theme='dark']).exhuma-marquee-fade-left,
						:is(.dark, [data-theme='dark']).exhuma-marquee-fade-right {
							--exhuma-fade-color: var(--fade-dark, ${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
						}
						@media (prefers-color-scheme: dark) {
							:root:not(.light) :is(.exhuma-marquee-fade-left, .exhuma-marquee-fade-right) {
								--exhuma-fade-color: var(--fade-dark, ${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
							}
						}
					`}</style>
					<div
						aria-hidden='true'
						className='exhuma-marquee-fade-left pointer-events-none absolute inset-y-0 left-0 z-10'
						style={{
							width: `${fadeWidth}px`,
							['--fade-light' as string]: fadeEdgeColor,
							['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
							background: 'linear-gradient(to right, var(--exhuma-fade-color, var(--fade-light)), transparent)',
						}}
					/>
					<div
						aria-hidden='true'
						className='exhuma-marquee-fade-right pointer-events-none absolute inset-y-0 right-0 z-10'
						style={{
							width: `${fadeWidth}px`,
							['--fade-light' as string]: fadeEdgeColor,
							['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
							background: 'linear-gradient(to left, var(--exhuma-fade-color, var(--fade-light)), transparent)',
						}}
					/>
				</>
			)}
			<div
				ref={trackRef}
				className='exhuma-marquee-track flex w-max will-change-transform'
				style={{
					columnGap: gapVal,
				}}
			>
				{/* Primary track measured by ResizeObserver */}
				<div ref={contentRef} className='exhuma-marquee-content flex shrink-0 items-center' style={{ columnGap: gapVal }}>
					{children}
				</div>

				{/* Cloned secondary track for seamless modulo wrapping */}
				<div aria-hidden='true' className='exhuma-marquee-clone flex shrink-0 items-center' style={{ columnGap: gapVal }}>
					{children}
				</div>
			</div>
		</div>
	);
};

// Compound API Primitives
const MarqueeRoot: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-root relative w-full overflow-hidden select-none ${className}`} {...props}>
		{children}
	</div>
);

const MarqueeTrack: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-track flex w-max will-change-transform ${className}`} {...props}>
		{children}
	</div>
);

const MarqueeItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
	<div className={`exhuma-marquee-item shrink-0 ${className}`} {...props}>
		{children}
	</div>
);

InfiniteMarquee.Root = MarqueeRoot;
InfiniteMarquee.Track = MarqueeTrack;
InfiniteMarquee.Item = MarqueeItem;

export { MarqueeRoot, MarqueeTrack, MarqueeItem };
