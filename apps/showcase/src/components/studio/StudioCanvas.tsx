'use client';

import * as React from 'react';
import { IconDeviceDesktop as Monitor, IconDeviceTablet as Tablet, IconDeviceMobile as Smartphone } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export interface StudioCanvasProps {
	viewportMode: 'fluid' | 'tablet' | 'mobile';
	setViewportMode: (mode: 'fluid' | 'tablet' | 'mobile') => void;
	zoomScale: number;
	setZoomScale: React.Dispatch<React.SetStateAction<number>>;
	children: React.ReactNode;
	isExpanded?: boolean;
}

export function StudioCanvas({ viewportMode, setViewportMode, zoomScale, setZoomScale, children, isExpanded = false }: StudioCanvasProps) {
	return (
		<div
			className={cn('border-border/80 bg-card/75 relative flex flex-col overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl transition-all duration-300', isExpanded ? 'xl:col-span-12' : 'xl:col-span-8')}
		>
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

			{/* Device Switcher & Dimension Indicator Toolbar */}
			<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2 text-xs sm:px-4'>
				<div className='flex items-center gap-2'>
					<span className='text-foreground/80 text-2xs font-mono font-bold tracking-wider uppercase'>Viewport</span>
				</div>

				{/* 3 Real Responsive Device Modes */}
				<div className='border-border/70 bg-background/80 flex items-center gap-0.5 rounded-lg border p-0.5'>
					<button
						type='button'
						onClick={() => setViewportMode('fluid')}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
							viewportMode === 'fluid' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
						)}
						title='Fluid (100% Canvas Width)'
					>
						<Monitor className='h-3.5 w-3.5' />
						<span className='hidden sm:inline'>Fluid</span>
					</button>
					<button
						type='button'
						onClick={() => setViewportMode('tablet')}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
							viewportMode === 'tablet' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
						)}
						title='Tablet Viewport (640px)'
					>
						<Tablet className='h-3.5 w-3.5' />
						<span className='hidden sm:inline'>Tablet</span>
					</button>
					<button
						type='button'
						onClick={() => setViewportMode('mobile')}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all sm:px-2.5',
							viewportMode === 'mobile' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
						)}
						title='Mobile Viewport (375px)'
					>
						<Smartphone className='h-3.5 w-3.5' />
						<span className='hidden sm:inline'>Mobile</span>
					</button>
				</div>

				{/* Dimension Tag */}
				<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold'>
					{viewportMode === 'mobile' ? '375 × 667 px' : viewportMode === 'tablet' ? '640 × 800 px' : 'Fluid 100%'}
				</span>
			</div>

			{/* Live Canvas Viewport with High-Contrast Studio Backdrop */}
			<div className='bg-dot-grid-studio relative flex min-h-[20rem] items-center justify-center overflow-x-auto p-2.5 transition-colors sm:min-h-[31.25rem] sm:p-6 lg:p-10'>
				<div
					className={cn(
						'border-border/80 bg-background/95 ring-border/50 mx-auto flex items-center justify-center border-2 shadow-2xl ring-1 transition-all duration-300',
						viewportMode === 'mobile' ? 'w-[375px] max-w-full rounded-3xl p-3 sm:p-4' : viewportMode === 'tablet' ? 'w-[640px] max-w-full rounded-2xl p-4 sm:p-6' : 'w-full rounded-2xl p-3 sm:p-6 lg:p-10'
					)}
					style={{
						transform: `scale(${zoomScale / 100})`,
						transformOrigin: 'top center',
					}}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
