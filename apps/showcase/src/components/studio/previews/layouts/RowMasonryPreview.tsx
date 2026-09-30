import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { RowMasonry, RowMasonryItem } from '@exhuma/layouts';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function RowMasonryPreview(props: ComponentPreviewProps & { viewportMode?: string }) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const { viewportMode } = props;

	const columns = Number(propValues.columns ?? 1);
	const columnsSm = Number(propValues.columnsSm ?? 2);
	const columnsMd = Number(propValues.columnsMd ?? 2);
	const columnsLg = Number(propValues.columnsLg ?? 3);
	const columnsXl = Number(propValues.columnsXl ?? 4);
	const gap = Number(propValues.gap ?? 16);

	const studioColumns = viewportMode === 'mobile' ? columns : viewportMode === 'tablet' ? columnsSm : columnsLg;

	return (
		<div key={`${viewportMode}-${studioColumns}`} className='w-full p-2 sm:p-6'>
			<RowMasonry columns={studioColumns} columnsSm={columnsSm} columnsMd={columnsMd} columnsLg={columnsLg} columnsXl={columnsXl} gap={gap} className='w-full'>
				{/* 01. Micro Status Card (130px) - Emerald */}
				<RowMasonryItem key='01' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md'
						style={{ minHeight: '130px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-emerald-500/10 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10 flex items-center justify-between'>
							<span className='text-3xs inline-flex items-center gap-1.5 font-mono font-semibold text-emerald-400'>
								<span className='relative flex size-2'>
									<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75' />
									<span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
								</span>
								120 FPS NATIVE
							</span>
							<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#01</span>
						</div>
						<div className='relative z-10 my-auto py-1.5'>
							<h4 className='text-foreground text-xs font-bold tracking-tight'>Greedy Column Balancer</h4>
							<p className='text-muted-foreground text-3xs mt-0.5 font-mono'>Dynamic shortest-column placement</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Compositor Thread</span>
							<span className='font-semibold text-emerald-400'>0.02ms</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 02. Deep Kinetic Feature Tile (210px) - Blue */}
				<RowMasonryItem key='02' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md'
						style={{ minHeight: '210px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-blue-500/15 via-indigo-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-3xs inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-blue-400 uppercase'>
									KINEMATICS
								</span>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#02</span>
							</div>
							<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>GPU Translate3D Flow</h4>
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Hardware-composited smooth transforms on resize without layout thrashing or inline top/left DOM recalculations.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Placement Engine</span>
							<span className='font-semibold text-blue-400'>O(N log K)</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 03. Elegant Pull Quote Tile (145px) - Purple */}
				<RowMasonryItem key='03' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md'
						style={{ minHeight: '145px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-purple-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<span className='font-serif text-xl leading-none text-purple-400/90'>“</span>
							<p className='text-foreground/90 text-2xs mt-1 leading-relaxed italic'>Row-order bin-packing guarantees authentic left-to-right reading flow with zero cumulative layout shift.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span className='font-semibold text-purple-400'>Architecture Core</span>
							<span>#03</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 04. Telemetry Metric Block (255px) - Amber */}
				<RowMasonryItem key='04' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md'
						style={{ minHeight: '255px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-amber-500/15 via-orange-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-3xs inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-amber-400 uppercase'>
									BALANCING
								</span>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#04</span>
							</div>
							<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Greedy Column Bin-Packing</h4>
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Batched DOM height reads in a single animation frame to eliminate layout recalculation cascades.</p>
							<div className='text-3xs mt-2.5 grid grid-cols-2 gap-2 font-mono'>
								<div className='border-border/60 bg-background/60 rounded-md border p-2'>
									<span className='text-muted-foreground text-3xs block'>Reflow Batch</span>
									<span className='text-foreground font-semibold'>1 frame</span>
								</div>
								<div className='border-border/60 bg-background/60 rounded-md border p-2'>
									<span className='text-muted-foreground text-3xs block'>Compositor</span>
									<span className='text-foreground font-semibold'>GPU Native</span>
								</div>
							</div>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Column Gap</span>
							<span className='font-semibold text-amber-400'>{gap}px Concrete</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 05. Framework Chips Tile (145px) - Pink */}
				<RowMasonryItem key='05' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:shadow-md'
						style={{ minHeight: '145px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-pink-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-muted-foreground text-3xs font-mono font-bold uppercase'>Universal Native</span>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#05</span>
							</div>
							<div className='flex flex-wrap gap-1.5'>
								{['React', 'Vue', 'Svelte', 'Astro', 'Solid'].map((fw) => (
									<span key={fw} className='border-border/60 bg-background/80 text-foreground text-3xs rounded-md border px-2 py-0.5 font-mono font-medium'>
										{fw}
									</span>
								))}
							</div>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span className='font-semibold text-pink-400'>{ECOSYSTEM_COUNT} Ecosystems</span>
							<span className='truncate'>Universal Native</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 06. Syntax Code Window (180px) - Cyan */}
				<RowMasonryItem key='06' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-md'
						style={{ minHeight: '180px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-cyan-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<div className='mb-2 flex items-center justify-between'>
								<div className='flex items-center gap-1.5'>
									<span className='size-2 rounded-full bg-red-500/80' />
									<span className='size-2 rounded-full bg-yellow-500/80' />
									<span className='size-2 rounded-full bg-green-500/80' />
									<span className='text-muted-foreground text-3xs ml-1 font-mono'>row-masonry.tsx</span>
								</div>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#06</span>
							</div>
							<pre className='border-border/50 bg-background/80 text-muted-foreground text-3xs no-scrollbar overflow-x-auto rounded-lg border p-2 font-mono leading-relaxed'>
								<code>{`<RowMasonry\n  columns={${studioColumns}}\n  gap={${gap}}\n/>`}</code>
							</pre>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Kinetic Engine</span>
							<span className='font-semibold text-cyan-400'>Zero Jank</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 07. Big Stat Metric Tile (130px) - Indigo */}
				<RowMasonryItem key='07' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md'
						style={{ minHeight: '130px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-indigo-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10 flex items-center justify-between'>
							<span className='text-muted-foreground text-3xs font-mono font-semibold uppercase'>Compositor Latency</span>
							<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#07</span>
						</div>
						<div className='relative z-10 my-auto py-1'>
							<span className='text-foreground font-mono text-2xl font-black tracking-tight'>&lt; 0.04ms</span>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>GPU Isolated</span>
							<span className='font-semibold text-indigo-400'>Zero Jitter</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 08. Void Elimination Tile (220px) - Violet */}
				<RowMasonryItem key='08' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-md'
						style={{ minHeight: '220px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-violet-500/15 via-purple-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-3xs inline-flex items-center rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-violet-400 uppercase'>
									RENDER PASS
								</span>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#08</span>
							</div>
							<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Spatial Void Elimination</h4>
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Items continually pack into the shortest column height, maintaining balance even as item content resizes dynamically.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Sub-Pixel Grid</span>
							<span className='font-semibold text-violet-400'>Auto Balanced</span>
						</div>
					</div>
				</RowMasonryItem>

				{/* 09. Micro WCAG A11y Ping (135px) - Emerald */}
				<RowMasonryItem key='09' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md'
						style={{ minHeight: '135px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-emerald-500/10 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10 flex items-center justify-between'>
							<span className='text-3xs font-mono font-bold text-emerald-400'>WCAG AAA COMPLIANT</span>
							<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#09</span>
						</div>
						<div className='relative z-10 my-auto py-1.5'>
							<h4 className='text-foreground text-xs font-bold tracking-tight'>DOM Order Flow Integrity</h4>
							<p className='text-muted-foreground text-3xs mt-0.5 font-mono'>Keyboard tab sequence preserved</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Screen Reader OK</span>
							<span className='font-semibold text-emerald-400'>A11y Validated</span>
						</div>
					</div>
				</RowMasonryItem>
			</RowMasonry>
		</div>
	);
}
