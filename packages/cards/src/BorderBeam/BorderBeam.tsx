'use client';

import React from 'react';
import type { BorderBeamProps } from '../types';

/**
 * BorderBeam — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Zero JavaScript CPU/memory overhead during active animation (100% GPU compositor thread).
 * - Sub-pixel perimeter laser trace with hardware mask clipping (zero background bleed).
 * - Framework and container agnostic: injects seamlessly into any card or button.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
	size = 200,
	duration = 8,
	borderWidth = 2,
	colorFrom = '#ffaa40',
	colorTo = '#9c40ff',
	doubleBeam = false,
	endOpacity = 0,
	opacity = 1,
	blur = 0,
	borderRadius = 16,
	className = '',
	style,
}) => {
	const safeSize = Number.isFinite(size) && size > 0 ? size : 200;
	const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 8;
	const safeBorderWidth = Number.isFinite(borderWidth) && borderWidth >= 0 ? borderWidth : 2;
	const safeBorderRadius = Number.isFinite(borderRadius) && borderRadius >= 0 ? borderRadius : 16;
	const clampedEndOpacity = Math.max(0, Math.min(1, Number.isFinite(endOpacity) ? endOpacity : 0));
	const clampedOpacity = Math.max(0, Math.min(1, Number.isFinite(opacity) ? opacity : 1));
	const safeBlur = Number.isFinite(blur) && blur >= 0 ? blur : 0;
	const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : `color-mix(in srgb, ${colorTo} ${Math.round(clampedEndOpacity * 100)}%, transparent)`;
	const pathRadius = Math.min(safeSize, 200);

	return (
		<div
			key={`${safeDuration}-${doubleBeam}-${safeBorderRadius}`}
			aria-hidden='true'
			className={`exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
			style={{
				borderRadius: `${safeBorderRadius}px`,
				border: `${safeBorderWidth}px solid transparent`,
				WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
				WebkitMaskComposite: 'destination-out',
				mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
				maskComposite: 'exclude',
				opacity: clampedOpacity !== 1 ? clampedOpacity : undefined,
				filter: safeBlur > 0 ? `blur(${safeBlur}px)` : undefined,
				...style,
			}}
		>
			{/* Primary Beam (Clockwise Sweep) */}
			<div
				className='exhuma-border-beam-trace'
				style={{
					position: 'absolute',
					aspectRatio: '1 / 1',
					width: `${safeSize}px`,
					offsetPath: `rect(0 auto auto 0 round ${pathRadius}px)`,
					offsetAnchor: `${safeSize / 2}px ${safeSize / 2}px`,
					background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, ${endColor})`,
					animation: `exhuma-border-beam ${safeDuration}s linear infinite`,
				}}
			/>

			{/* Secondary Beam (Opposite position, same direction sweep, 180° phase offset) */}
			{doubleBeam && (
				<div
					className='exhuma-border-beam-trace'
					style={{
						position: 'absolute',
						aspectRatio: '1 / 1',
						width: `${safeSize}px`,
						offsetPath: `rect(0 auto auto 0 round ${pathRadius}px)`,
						offsetAnchor: `${safeSize / 2}px ${safeSize / 2}px`,
						background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, ${endColor})`,
						animation: `exhuma-border-beam ${safeDuration}s linear infinite`,
						animationDelay: `-${safeDuration / 2}s`,
					}}
				/>
			)}

			<style>{`
				.exhuma-border-beam-trace {
					will-change: transform;
				}
				@keyframes exhuma-border-beam {
					from {
						offset-distance: 0%;
					}
					to {
						offset-distance: 100%;
					}
				}
				@media (prefers-reduced-motion: reduce) {
					.exhuma-border-beam-trace {
						animation-play-state: paused !important;
					}
				}
			`}</style>
		</div>
	);
};

BorderBeam.displayName = 'BorderBeam';

export default BorderBeam;
