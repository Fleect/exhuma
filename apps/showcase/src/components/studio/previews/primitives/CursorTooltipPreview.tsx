import React from 'react';
import { CursorTooltip } from '@exhuma/core';
import { cn } from '@/lib/utils';
import { ComponentPreviewProps } from '../types';

export function CursorTooltipPreview(props: ComponentPreviewProps & { viewportMode?: string }) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const { viewportMode } = props;

	const isMobile = viewportMode === 'mobile' || (typeof window !== 'undefined' && window.innerWidth < 640);
	const content = String(propValues.content ?? 'Explore Showcase');
	const springDamping = Number(propValues.springDamping ?? 20);
	const direction = (propValues.direction as any) ?? 'bottom-right';
	const offsetX = Number(propValues.offsetX ?? 16);
	const offsetY = Number(propValues.offsetY ?? 16);
	const variant = (propValues.variant as any) ?? 'frosted';
	const collisionPadding = Number(propValues.collisionPadding ?? 12);

	return (
		<div className={cn('flex w-full flex-col items-center justify-center', isMobile ? 'px-2 py-6' : 'px-2 py-6 sm:px-6 md:p-12')}>
			<CursorTooltip
				content={content}
				springDamping={springDamping}
				direction={direction}
				offsetX={offsetX}
				offsetY={offsetY}
				variant={variant}
				collisionPadding={collisionPadding}
				className={cn(
					'border-border/80 bg-card/80 hover:border-foreground/40 group relative w-full max-w-lg cursor-pointer overflow-hidden rounded-2xl border text-center shadow-xl transition-all duration-300',
					isMobile ? 'p-5' : 'p-5 sm:p-8 md:p-12'
				)}
			>
				<div className='bg-radial-gradient from-primary/5 pointer-events-none absolute inset-0 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
				<div className='bg-primary/10 border-primary/20 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium'>
					<span className='bg-primary h-2 w-2 animate-pulse rounded-full' />
					INTERACTIVE KINETIC TARGET
				</div>
				<h4 className={cn('text-foreground font-bold tracking-tight', isMobile ? 'text-lg' : 'text-xl md:text-2xl')}>Exponential Cursor Smoothing</h4>
				<p className={cn('text-muted-foreground mt-2 leading-relaxed', isMobile ? 'text-xs' : 'text-xs md:text-sm')}>
					Move your pointer freely across this sandbox. The tooltip trails your cursor using high-performance exponential decay math with viewport collision clamping.
				</p>
				<div className='border-border/50 text-3xs text-muted-foreground mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4 font-mono'>
					<span>DAMPING: {springDamping}</span>
					<span>DIR: {String(direction).toUpperCase()}</span>
					<span>
						OFFSET: ({offsetX}px, {offsetY}px)
					</span>
					<span>VARIANT: {String(variant).toUpperCase()}</span>
				</div>
			</CursorTooltip>
		</div>
	);
}
