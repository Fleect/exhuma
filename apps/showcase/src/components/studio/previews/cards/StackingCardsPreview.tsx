import * as React from 'react';
import { StackingCards } from '@exhuma/cards';
import { ComponentPreviewProps } from '../types';

export default function StackingCardsPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const stackingScrollRef = React.useRef<HTMLDivElement>(null);

	const rawTopStart = Number(propValues.topStart ?? 20);
	const rawTopIncrement = Number(propValues.topIncrement ?? propValues.stackOffset ?? 28);
	const rawCardGap = Number(propValues.cardGap ?? propValues.gap ?? 20);
	const rawScaleThreshold = Number(propValues.scaleThreshold ?? 150);
	const rawMinScale = Number(propValues.minScale ?? 0.9);
	const reverseScale = propValues.reverseScale !== undefined ? Boolean(propValues.reverseScale) : true;

	const topStart = Number.isFinite(rawTopStart) && rawTopStart >= 0 ? rawTopStart : 20;
	const topIncrement = Number.isFinite(rawTopIncrement) && rawTopIncrement > 0 ? rawTopIncrement : 28;
	const cardGap = Number.isFinite(rawCardGap) && rawCardGap >= 0 ? rawCardGap : 20;
	const scaleThreshold = Number.isFinite(rawScaleThreshold) && rawScaleThreshold > 0 ? rawScaleThreshold : 150;
	const minScale = Number.isFinite(rawMinScale) && rawMinScale > 0 && rawMinScale < 1 ? rawMinScale : 0.9;

	return (
		<div
			ref={stackingScrollRef}
			tabIndex={0}
			role='region'
			aria-label={`StackingCards scroll demo`}
			className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative mx-auto h-[31.25rem] w-full max-w-xl overflow-y-auto rounded-2xl border p-3 shadow-inner outline-none focus-visible:ring-1 sm:p-6'
		>
			<div className='text-muted-foreground text-2xs mb-6 flex items-center justify-center gap-2 text-center font-mono'>
				<span className='kbd border-border bg-card/80 text-foreground text-3xs font-mono font-bold uppercase'>SCROLL DOWN TO ENGAGE MOMENTUM</span>
				<span>↓</span>
			</div>
			<StackingCards topStart={topStart} topIncrement={topIncrement} cardGap={cardGap} minScale={minScale} scaleThreshold={scaleThreshold} reverseScale={reverseScale} scrollContainerRef={stackingScrollRef}>
				{Array.from({ length: 4 }).map((_, idx) => (
					<div key={idx} className='border-border/80 bg-card/95 relative rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-colors sm:p-6'>
						<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
						<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

						<div className='text-muted-foreground mb-3 flex items-center justify-between font-mono text-xs'>
							<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>LAYER // 0{idx + 1}</span>
							<span className='text-muted-foreground text-2xs font-mono'>120 FPS rAF</span>
						</div>
						<h4 className='text-foreground text-lg font-bold tracking-tight sm:text-xl'>Autonomous Stacking Card</h4>
						<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.</p>
						<div className='border-border/60 text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 font-mono text-xs sm:mt-6 sm:pt-4'>
							<span>topStart: {topStart}px</span>
							<span>topIncrement: {topIncrement}px</span>
							<span>cardGap: {cardGap}px</span>
							<span>minScale: {minScale}</span>
							<span>reverseScale: {reverseScale ? 'true' : 'false'}</span>
						</div>
					</div>
				))}
			</StackingCards>
			<div className='text-muted-foreground flex h-[17.5rem] items-center justify-center font-mono text-xs'>Terminal scroll reached — reverse scaling applied</div>
		</div>
	);
}
