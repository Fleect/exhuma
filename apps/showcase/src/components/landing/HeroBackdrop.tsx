'use client';

import * as React from 'react';

/**
 * Modern grayscale architectural atmosphere:
 * - Precision engineering grid with coordinate crosshairs (+)
 * - Subtle concentric kinetic orbit rings
 * - Volumetric overhead light cone
 * - Pure grayscale: pristine in light mode, deep and luminous in dark mode.
 */
export function HeroBackdrop() {
	return (
		<div aria-hidden='true' className='pointer-events-none absolute inset-0 overflow-hidden'>
			{/* Architectural Grid with Crosshairs (+) */}
			<svg className='stroke-foreground/8 dark:stroke-foreground/10 absolute inset-0 size-full mask-[radial-gradient(ellipse_75%_65%_at_50%_0%,#000_50%,transparent_100%)]' width='100%' height='100%'>
				<defs>
					<pattern id='arch-grid' width='48' height='48' patternUnits='userSpaceOnUse' x='-1' y='-1'>
						{/* Grid Lines */}
						<path d='M.5 48V.5H48' fill='none' strokeWidth='0.75' />
						{/* Subtle Crosshair Ticks at Intersections */}
						<path d='M24 21v6M21 24h6' fill='none' strokeWidth='0.75' className='opacity-40' />
					</pattern>
				</defs>
				<rect width='100%' height='100%' fill='url(#arch-grid)' />
			</svg>

			{/* Concentric Kinetic Orbit Rings with hairline radius notches */}
			<div className='border-foreground/[0.04] dark:border-foreground/[0.06] absolute -top-44 left-1/2 h-[48rem] w-[74rem] -translate-x-1/2 rounded-full border' />
			<div className='border-foreground/[0.06] dark:border-foreground/[0.08] absolute -top-32 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full border border-dashed' />
			<div className='border-foreground/[0.08] dark:border-foreground/[0.12] absolute -top-20 left-1/2 h-[24rem] w-[38rem] -translate-x-1/2 rounded-full border' />

			{/* Overhead Volumetric Light Cone */}
			<div className='animate-pulse-glow from-foreground/10 via-foreground/5 absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl dark:from-white/15 dark:via-white/5' />

			{/* Precision Horizon Line */}
			<div className='via-border absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent to-transparent' />
		</div>
	);
}

export default HeroBackdrop;
