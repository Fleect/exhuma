'use client';

import * as React from 'react';
import { IconSparkles as Sparkles, IconActivity as Activity, IconCpu as Cpu } from '@tabler/icons-react';
import { TiltCard, SpotlightCard } from '@exhuma/cards';
import { MagneticButton } from '@exhuma/core';

function Stage({ label, hint, badge, formula, children }: { label: string; hint: string; badge?: string; formula?: string; children: React.ReactNode }) {
	return (
		<div className='flex min-w-0 grow basis-64 flex-col'>
			<div className='border-border/80 bg-dot-grid group hover:border-foreground/30 relative flex min-h-72 flex-1 items-center justify-center rounded-2xl border p-6 shadow-inner transition-all'>
				{/* Precision corner crosshair indicators */}
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>
				<div className='text-foreground/20 text-4xs pointer-events-none absolute bottom-2 left-2 font-mono select-none'>+</div>
				<div className='text-foreground/20 text-4xs pointer-events-none absolute right-2 bottom-2 font-mono select-none'>+</div>

				{badge && (
					<div className='absolute top-3.5 right-3.5'>
						<span className='kbd border-border bg-background/90 text-foreground text-4xs font-mono font-bold tracking-wider uppercase backdrop-blur-xs'>{badge}</span>
					</div>
				)}
				{children}
			</div>
			<div className='mt-3.5 px-1'>
				<div className='flex items-center justify-between'>
					<div className='text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight'>
						<span>{label}</span>
					</div>
					{formula && <span className='text-foreground/50 text-3xs font-mono tracking-tight'>{formula}</span>}
				</div>
				<div className='text-muted-foreground text-2xs mt-0.5'>{hint}</div>
			</div>
		</div>
	);
}

/**
 * The hero proof block: real, interactive primitives at full size running
 * directly on compositor threads with zero external animation dependencies.
 */
export function LiveShowcase() {
	return (
		<div className='border-border/80 bg-card/75 hover:border-foreground/30 relative w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl transition-colors duration-500'>
			{/* Top simulated hairline highlight */}
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

			{/* Studio Window Chrome Header */}
			<div className='border-border/60 bg-muted/40 flex items-center justify-between border-b px-5 py-3 text-xs'>
				<div className='flex items-center gap-2.5'>
					<div className='flex gap-1.5 opacity-60'>
						<div className='bg-foreground/40 h-2.5 w-2.5 rounded-full' />
						<div className='bg-foreground/30 h-2.5 w-2.5 rounded-full' />
						<div className='bg-foreground/20 h-2.5 w-2.5 rounded-full' />
					</div>
					<span className='text-muted-foreground text-2xs ml-1.5 font-mono font-medium'>exhuma-kinetic-lab.tsx</span>
				</div>

				<div className='hidden items-center gap-3 sm:flex'>
					<span className='text-3xs text-muted-foreground inline-flex items-center gap-1.5 font-mono'>
						<span>RAF:</span>
						<span className='text-foreground font-semibold'>120Hz SYNC</span>
					</span>
					<span className='border-border bg-background/90 text-foreground text-3xs inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-semibold shadow-xs'>
						<span className='bg-foreground h-1.5 w-1.5 animate-pulse rounded-full' />
						COMPOSITOR ACTIVE
					</span>
				</div>
			</div>

			{/* 3 Interactive Stages */}
			<div className='p-6 sm:p-8'>
				<div className='flex flex-wrap gap-6'>
					{/* Left: Tilt Card */}
					<Stage label='Tilt Card' hint='3D gyroscopic tracking · harmonic spring reset' badge='60-120 FPS' formula='F = -kx - cẋ'>
						<TiltCard
							maxTilt={18}
							perspective={1000}
							className='bg-card/95 border-border/80 hover:border-foreground/40 w-full max-w-64 cursor-pointer rounded-2xl border p-6 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl'
						>
							<div className='flex items-center justify-between'>
								<span className='kbd border-border bg-background text-foreground text-3xs font-bold'>INTERACTIVE 3D</span>
								<Activity className='text-foreground/70 h-3.5 w-3.5' />
							</div>
							<div className='text-foreground mt-3 text-lg font-bold tracking-tight'>Move cursor</div>
							<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>Sub-pixel gyroscopic perspective driven by harmonic spring math.</p>
						</TiltCard>
					</Stage>

					{/* Middle: Magnetic Button (High-Contrast Tactile Centerpiece with Field Visualization) */}
					<Stage label='Magnetic Button' hint='Gaussian proximity field · physics attractor' badge='Spring RAF' formula='U(r) = -U₀ e^(-r²/2σ²)'>
						<div className='relative flex items-center justify-center py-6'>
							{/* Magnetic attraction radius visualization rings */}
							<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
								<div className='border-foreground/10 h-48 w-48 animate-[spin_60s_linear_infinite] rounded-full border border-dashed' />
								<div className='border-foreground/15 absolute h-36 w-36 rounded-full border border-dotted' />
								<div className='border-foreground/10 absolute h-24 w-24 rounded-full border' />
							</div>

							{/* Ambient attraction halo */}
							<div className='bg-foreground/5 pointer-events-none absolute -inset-6 rounded-full blur-xl' />

							<MagneticButton
								strength={0.5}
								radius={140}
								className='group bg-foreground text-background z-10 cursor-pointer rounded-2xl px-8 py-3.5 text-xs font-black shadow-xl transition-all hover:scale-105 active:scale-95'
							>
								<span className='flex items-center gap-2'>
									<Sparkles className='h-4 w-4 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-12' />
									<span>Pull me</span>
								</span>
							</MagneticButton>
						</div>
					</Stage>

					{/* Right: Spotlight Card */}
					<Stage label='Spotlight Card' hint='Radial border illumination · zero re-renders' badge='0 Re-renders' formula='I(r) = max(0, 1 - r/R)'>
						<SpotlightCard radius={220} className='bg-card/95 border-border/80 hover:border-foreground/40 w-full max-w-64 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all'>
							<div className='flex items-center justify-between'>
								<span className='kbd border-border bg-background text-foreground text-3xs font-bold'>POINTER GLOW</span>
								<Cpu className='text-foreground/70 h-3.5 w-3.5' />
							</div>
							<div className='text-foreground mt-3 text-lg font-bold tracking-tight'>Hover anywhere</div>
							<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>Radial border illumination running directly on the compositor thread.</p>
						</SpotlightCard>
					</Stage>
				</div>
			</div>

			{/* Bottom Status Ticker */}
			<div className='border-border/60 bg-muted/20 text-2xs flex flex-wrap justify-between gap-1 border-t px-6 py-3'>
				<div className='text-muted-foreground text-3xs block font-mono'>
					<span className='text-foreground mr-1 font-bold'>Ω BIG-OMEGA:</span>
					<span>ZERO RUNTIME LIBS · STRICT MEMORY TEARDOWN GUARANTEED</span>
				</div>
				<div className='text-muted-foreground/80 text-3xs font-mono'>REACT · NEXT.JS · VUE · SVELTE · ANGULAR · SOLID</div>
			</div>
		</div>
	);
}

export default LiveShowcase;
