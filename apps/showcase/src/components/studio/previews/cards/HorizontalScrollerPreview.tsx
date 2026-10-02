import * as React from 'react';
import { HorizontalScroller } from '@fleect/exhuma-cards';
import { ComponentPreviewProps } from '../types';

export default function HorizontalScrollerPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const horizontalScrollRef = React.useRef<HTMLDivElement>(null);

	const speed = Number(propValues.speed ?? propValues.scrollSpeed ?? 1.0);
	const itemGap = Number(propValues.itemGap ?? propValues.gap ?? 28);
	const cardWidth = propValues.cardWidth !== undefined ? Number(propValues.cardWidth) : 320;
	const showProgress = propValues.showProgress !== false;
	const showFadeEdges = propValues.showFadeEdges !== false;
	const fadeWidth = Number(propValues.fadeWidth ?? 48);
	const fadeEdgeColor = String(propValues.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(propValues.fadeEdgeColorDark || '#09090b');
	const mobileMode = (propValues.mobileMode as 'scroll' | 'stack' | 'pinned') ?? 'scroll';

	const SERVICES = [
		{ num: '01', category: 'DESIGN', title: 'Web Design & UI', desc: 'High-conversion visual interfaces engineered to command attention.', cta: 'Explore', tag: 'STAGE // 01' },
		{ num: '02', category: 'DEV', title: 'Kinetic Engineering', desc: '120 FPS transitions, zero layout thrashing, and sub-pixel compositing.', cta: 'Explore', tag: 'STAGE // 02' },
		{ num: '03', category: 'BRAND', title: 'Brand Strategy', desc: 'Distinct typography and positioning frameworks that scale.', cta: 'Explore', tag: 'STAGE // 03' },
		{ num: '04', category: 'SCALE', title: 'Conversion Scale', desc: 'Data-driven landing pages and behavioral experimentation.', cta: 'Explore', tag: 'STAGE // 04' },
		{ num: '05', category: 'AI', title: 'AI Workflows', desc: 'Intelligent automation pipelines built for high leverage.', cta: 'Explore', tag: 'STAGE // 05' },
	];

	return (
		<div
			ref={horizontalScrollRef}
			tabIndex={0}
			role='region'
			aria-label={`HorizontalScroller scroll demo`}
			className='border-border/80 bg-background/50 no-scrollbar focus-visible:ring-foreground/50 relative h-[36rem] w-full overflow-y-auto rounded-2xl border shadow-inner outline-none focus-visible:ring-1'
		>
			<div className='text-muted-foreground text-2xs pointer-events-none absolute top-3 right-4 z-30 flex items-center gap-2 font-mono'>
				<span className='kbd border-border/80 bg-card/90 text-foreground text-3xs font-mono font-bold shadow-xs'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
				<span>↓</span>
			</div>
			<HorizontalScroller
				speed={speed}
				itemGap={itemGap}
				cardWidth={cardWidth}
				showProgress={showProgress}
				showFadeEdges={showFadeEdges}
				fadeWidth={fadeWidth}
				fadeEdgeColor={fadeEdgeColor}
				fadeEdgeColorDark={fadeEdgeColorDark}
				mobileMode={mobileMode}
				scrollContainerRef={horizontalScrollRef}
				header={
					<div className='border-border/40 mb-4 flex items-center justify-between border-b pb-3'>
						<div>
							<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Brix-Engineered Rail</span>
							<h3 className='text-foreground text-lg font-bold tracking-tight sm:text-xl'>Digital Solutions Suite</h3>
						</div>
						<span className='text-muted-foreground hidden font-mono text-xs sm:inline'>120 FPS Pinned Camera</span>
					</div>
				}
			>
				{SERVICES.map((s, idx) => (
					<div
						key={idx}
						className='group border-border/80 bg-card/95 hover:border-foreground/40 flex h-[210px] flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300'
					>
						<div>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span className='font-mono text-xs font-bold text-emerald-500'>{s.num}</span>
									<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>{s.category}</span>
								</div>
								<span className='text-3xs border-border bg-background/60 text-muted-foreground rounded-full border px-2 py-0.5 font-mono'>{s.tag}</span>
							</div>
							<h4 className='text-foreground mt-3 text-base font-bold tracking-tight'>{s.title}</h4>
							<p className='text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed'>{s.desc}</p>
						</div>
						<div className='border-border/40 flex items-center justify-between border-t pt-3'>
							<span className='text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors group-hover:text-emerald-400'>
								{s.cta}
								<span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
							</span>
							<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
						</div>
					</div>
				))}
			</HorizontalScroller>

			{/* Subsequent Section (Unpinned Normal Flow) */}
			<div className='border-border/60 bg-muted/20 border-t px-6 py-12 sm:px-10'>
				<div className='max-w-xl'>
					<div className='flex items-center gap-2'>
						<span className='size-2 rounded-full bg-emerald-500' />
						<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Traversal Complete &bull; Normal Scroll Resumed</span>
					</div>
					<h4 className='text-foreground mt-2 text-xl font-bold tracking-tight sm:text-2xl'>Next Milestone: Product Delivery &amp; Scale</h4>
					<p className='text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm'>
						Once horizontal card translation reaches 100%, the pinned camera seamlessly releases and natural vertical scrolling resumes.
					</p>
				</div>

				<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
					<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
						<span className='text-3xs text-muted-foreground font-mono uppercase'>Performance</span>
						<div className='text-foreground mt-1 font-mono text-lg font-bold'>120 FPS</div>
						<p className='text-muted-foreground text-2xs mt-0.5'>Zero layout thrashing</p>
					</div>
					<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
						<span className='text-3xs text-muted-foreground font-mono uppercase'>Compositor</span>
						<div className='text-foreground mt-1 font-mono text-lg font-bold'>GPU Rail</div>
						<p className='text-muted-foreground text-2xs mt-0.5'>Hardware acceleration</p>
					</div>
					<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
						<span className='text-3xs text-muted-foreground font-mono uppercase'>Exit Behavior</span>
						<div className='text-foreground mt-1 font-mono text-lg font-bold'>Seamless</div>
						<p className='text-muted-foreground text-2xs mt-0.5'>Natural scroll unpin</p>
					</div>
				</div>
			</div>
		</div>
	);
}
