import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoVisual } from '@exhuma/layouts';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function BentoGridPreview(props: ComponentPreviewProps & { viewportMode?: string }) {
	const propValues = props;
	const { viewportMode } = props;

	const rawCols = Number(propValues.cols ?? 3);
	const effectiveCols = viewportMode === 'mobile' ? 1 : viewportMode === 'tablet' ? Math.min(rawCols, 2) : rawCols;
	const gap = propValues.gap !== undefined ? (typeof propValues.gap === 'number' ? propValues.gap : Number(String(propValues.gap).replace('px', '')) || 20) : 20;
	const rowHeight = propValues.rowHeight !== undefined ? (typeof propValues.rowHeight === 'number' ? propValues.rowHeight : Number(String(propValues.rowHeight).replace('px', '')) || 180) : 180;

	return (
		<div className='mx-auto w-full max-w-5xl p-2 sm:p-4'>
			<BentoGrid cols={effectiveCols} gap={gap} rowHeight={rowHeight}>
				{/* 01. Hero Analytical Kinetics Card */}
				<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 3 ? 2 : 2} rowSpan={effectiveCols >= 3 ? 2 : 1}>
					<BentoHeader>
						<div className='flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-primary text-3xs font-mono font-bold uppercase'>ANALYTICAL KINETICS</span>
							<span className='text-3xs text-muted-foreground font-mono'>#01</span>
						</div>
						<h4 className='text-foreground text-lg font-bold tracking-tight'>Continuous Math Engine</h4>
					</BentoHeader>
					<BentoVisual>
						<div className='border-primary/20 bg-background/60 w-full rounded-xl border p-3 shadow-2xs backdrop-blur-xs'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Live Compositor Telemetry</span>
								<span className='size-2 animate-pulse rounded-full bg-emerald-500' />
							</div>
							<svg className='text-primary fill-primary/10 h-16 w-full stroke-current' viewBox='0 0 300 60'>
								<path d='M0,45 Q50,10 100,35 T200,20 T300,30 L300,60 L0,60 Z' />
								<path d='M0,45 Q50,10 100,35 T200,20 T300,30' fill='none' strokeWidth='2' />
							</svg>
						</div>
					</BentoVisual>
					<BentoContent>Hardware-accelerated CSS custom properties driven directly by zero-allocation requestAnimationFrame loops.</BentoContent>
				</BentoCard>

				{/* 02. Big-Omega Lower Bound Metric */}
				<BentoCard colSpan={1} rowSpan={1}>
					<BentoHeader>
						<div className='flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-emerald-500 uppercase'>BIG-OMEGA</span>
							<span className='text-3xs text-muted-foreground font-mono'>#02</span>
						</div>
						<h4 className='text-foreground text-base font-bold'>Ω(120Hz)</h4>
					</BentoHeader>
					<BentoVisual>
						<div className='flex items-baseline gap-1 font-mono text-2xl font-black text-emerald-500'>
							120<span className='text-muted-foreground text-xs font-normal'>FPS</span>
						</div>
					</BentoVisual>
					<BentoContent>Guaranteed lower-bound execution with zero layout thrashing via cached bounding geometry.</BentoContent>
				</BentoCard>

				{/* 03. GPU Isolated Latency */}
				<BentoCard colSpan={1} rowSpan={1}>
					<BentoHeader>
						<div className='flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-indigo-400 uppercase'>COMPOSITOR</span>
							<span className='text-3xs text-muted-foreground font-mono'>#03</span>
						</div>
						<h4 className='text-foreground text-base font-bold'>&lt; 0.04ms</h4>
					</BentoHeader>
					<BentoVisual>
						<div className='flex items-baseline gap-1 font-mono text-2xl font-black text-indigo-400'>
							0.038<span className='text-muted-foreground text-xs font-normal'>ms</span>
						</div>
					</BentoVisual>
					<BentoContent>Sub-pixel compositor translation without main-thread jank or garbage collector pauses.</BentoContent>
				</BentoCard>

				{/* 04. Dense Auto-Flow Feature */}
				<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 3 ? 2 : 1} rowSpan={1}>
					<BentoHeader>
						<div className='flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-violet-400 uppercase'>AUTO-PACKING</span>
							<span className='text-3xs text-muted-foreground font-mono'>#04</span>
						</div>
						<h4 className='text-foreground text-base font-bold'>Dense Flow Backfill</h4>
					</BentoHeader>
					<BentoVisual>
						<div className='grid max-w-[180px] grid-cols-4 gap-1.5'>
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className={`h-4.5 rounded-sm ${i < 6 ? 'border border-violet-500/60 bg-violet-500/30' : 'border-border/60 bg-muted/40 border'}`} />
							))}
						</div>
					</BentoVisual>
					<BentoContent>CSS Grid automatically backfills empty track pockets, eliminating layout voids.</BentoContent>
				</BentoCard>

				{/* 05. Universal Ecosystems */}
				<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 4 ? 2 : effectiveCols === 3 ? 1 : 1} rowSpan={1}>
					<BentoHeader>
						<div className='flex items-center justify-between'>
							<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-amber-500 uppercase'>UNIVERSAL</span>
							<span className='text-3xs text-muted-foreground font-mono'>#05</span>
						</div>
						<h4 className='text-foreground text-base font-bold'>{ECOSYSTEM_COUNT} Ecosystems</h4>
					</BentoHeader>
					<BentoVisual>
						<div className='flex flex-wrap justify-center gap-1.5'>
							{['React', 'Vue', 'Svelte', 'Solid', 'Flutter'].map((f) => (
								<span key={f} className='border-border/60 bg-background/60 text-foreground text-4xs rounded-sm border px-1.5 py-0.5 font-mono font-semibold'>
									{f}
								</span>
							))}
						</div>
					</BentoVisual>
					<BentoContent>Native zero-dependency implementations compiled for all tier-1 web frameworks.</BentoContent>
				</BentoCard>

				{/* 06. Telemetry & Zero Leak Guarantee */}
				{effectiveCols >= 4 && (
					<BentoCard colSpan={2} rowSpan={1}>
						<BentoHeader>
							<div className='flex items-center justify-between'>
								<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-cyan-400 uppercase'>AUDITED</span>
								<span className='text-3xs text-muted-foreground font-mono'>#06</span>
							</div>
							<h4 className='text-foreground text-base font-bold'>Zero Memory Leaks</h4>
						</BentoHeader>
						<BentoVisual>
							<div className='flex items-center gap-2 font-mono text-xs text-emerald-400'>
								<span className='size-2 rounded-full bg-emerald-500' />
								<span>0 Persistent Event Retainers</span>
							</div>
						</BentoVisual>
						<BentoContent>Verified through Chrome DevTools Heap Snapshots and Memlab heap retention audits.</BentoContent>
					</BentoCard>
				)}
			</BentoGrid>
		</div>
	);
}
