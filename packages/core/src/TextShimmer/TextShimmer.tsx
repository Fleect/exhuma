'use client';

import React, { forwardRef, memo, useEffect, useState, useId } from 'react';
import { calculateHoverDuration, calculateShimmerDuration, calculateShimmerGradient } from './shimmer-text-math';
import { sanitizeDomProps } from '../utils/sanitize-dom-props';

export interface TextShimmerProps {
	children: React.ReactNode;
	spread?: number;              // gradient width % (default: 20)
	duration?: number;            // seconds (default: 2.5)
	shimmerColor?: string;        // default: '#ffffff'
	baseTextColor?: string;       // default: 'rgba(255,255,255,0.3)'
	hoverAccelerate?: boolean;    // speed up on hover (default: false)
	accelerationFactor?: number;  // how much faster on hover (default: 2)
	as?: React.ElementType;       // 'span' | 'p' | 'h1' etc (default: 'span')
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Text Shimmer Component — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - 0% CPU/JS overhead during animation: pure CSS @keyframes.
 * - Zero layout reflow: background-clip:text with GPU-composited gradient.
 * - Ω(1) prop-to-CSS-variable mapping.
 */
export const TextShimmer = memo(
	forwardRef<HTMLElement, TextShimmerProps>(function TextShimmer(
		{
			children,
			spread = 20,
			duration = 2.5,
			shimmerColor = '#ffffff',
			baseTextColor = 'rgba(255,255,255,0.3)',
			hoverAccelerate = false,
			accelerationFactor = 2,
			as: Component = 'span',
			className = '',
			style,
			...props
		},
		forwardedRef
	) {
		const uniqueId = useId().replace(/:/g, '');
		const shimmerClass = `exhuma-text-shimmer-${uniqueId}`;
		const [isReducedMotion, setIsReducedMotion] = useState(false);

		useEffect(() => {
			const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			setIsReducedMotion(prefersReducedMotion);
		}, []);

		const animDuration = calculateShimmerDuration(spread, duration);
		const hoverAnimDuration = hoverAccelerate ? calculateHoverDuration(animDuration, accelerationFactor) : animDuration;
		const gradient = calculateShimmerGradient(shimmerColor, baseTextColor, spread);

		return (
			<>
				<style dangerouslySetInnerHTML={{
					__html: `
						.${shimmerClass} {
							background: ${gradient};
							background-size: 200% auto;
							color: transparent;
							background-clip: text;
							-webkit-background-clip: text;
							animation: exhuma-shimmer-${uniqueId} ${animDuration} linear infinite;
						}
						${hoverAccelerate ? `
						.${shimmerClass}:hover {
							animation-duration: ${hoverAnimDuration};
						}
						` : ''}
						@keyframes exhuma-shimmer-${uniqueId} {
							to {
								background-position: 200% center;
							}
						}
						@media (prefers-reduced-motion: reduce) {
							.${shimmerClass} {
								animation: none !important;
								background-position: 0 0 !important;
							}
						}
					`
				}} />
				<Component
					ref={forwardedRef}
					className={`${shimmerClass} ${className}`}
					style={style}
					{...sanitizeDomProps(props as Record<string, unknown>)}
				>
					{children}
				</Component>
			</>
		);
	})
);

TextShimmer.displayName = 'TextShimmer';
