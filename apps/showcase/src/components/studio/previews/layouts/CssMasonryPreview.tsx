import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { CssMasonry, CssMasonryItem } from '@exhuma/layouts';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function CssMasonryPreview(props: ComponentPreviewProps & { viewportMode?: string }) {
	const propValues = props;
	const { viewportMode } = props;

	const columns = Number(propValues.columns ?? 3);
	const columnsSm = Number(propValues.columnsSm ?? 1);
	const columnsMd = Number(propValues.columnsMd ?? 2);
	const columnsLg = Number(propValues.columnsLg ?? 3);
	const columnsXl = Number(propValues.columnsXl ?? 4);
	const gap = Number(propValues.gap ?? 16);
	const columnFill = (propValues.columnFill as 'balance' | 'auto') ?? 'balance';
	const height = Number(propValues.height ?? 0);

	// Studio canvas alternative view:
	// mobile (375x667) -> 'columns' (default 1)
	// tablet (640x800) -> 'columnsSm' (default 2)
	// fluid            -> 'columnsLg' (default 3)
	const studioColumns = viewportMode === 'mobile' ? Number(propValues.columns ?? 1) : viewportMode === 'tablet' ? Number(propValues.columnsSm ?? 2) : Number(propValues.columnsLg ?? 3);

	const studioHeight = columnFill === 'auto' ? (viewportMode === 'mobile' ? undefined : height || 620) : undefined;

	return (
		<div key={`${viewportMode}-${studioColumns}`} className='w-full p-2 sm:p-6'>
			<CssMasonry
				columns={studioColumns}
				columnsSm={studioColumns}
				columnsMd={studioColumns}
				columnsLg={studioColumns}
				columnsXl={studioColumns}
				gap={gap}
				columnFill={columnFill}
				height={studioHeight}
				className='w-full'
				style={{ columnCount: studioColumns }}
			>
				{/* 01. Micro Status Card (130px) - Emerald */}
				<CssMasonryItem key='01' className='group'>
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
							<h4 className='text-foreground text-xs font-bold tracking-tight'>Zero Layout Shift</h4>
							<p className='text-muted-foreground text-3xs mt-0.5 font-mono'>Deterministic layout calculation</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Compositor Thread</span>
							<span className='font-semibold text-emerald-400'>0.02ms</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 02. Deep Kinetic Feature Tile (210px) - Blue */}
				<CssMasonryItem key='02' className='group'>
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
							<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Hermite Spline Acceleration</h4>
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Nonlinear velocity curves preserving fluid frame timing during continuous inertial scrolling.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Hermite Cubic</span>
							<span className='font-semibold text-blue-400'>3t² - 2t³</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 03. Elegant Pull Quote Tile (145px) - Purple */}
				<CssMasonryItem key='03' className='group'>
					<div
						className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md'
						style={{ minHeight: '145px' }}
					>
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
							<div className='absolute inset-0 bg-linear-to-b from-purple-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
						</div>
						<div className='relative z-10'>
							<span className='font-serif text-xl leading-none text-purple-400/90'>“</span>
							<p className='text-foreground/90 text-2xs mt-1 leading-relaxed italic'>CSS multi-column executes directly on the compositor thread with zero JavaScript runtime overhead.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span className='font-semibold text-purple-400'>Architecture Core</span>
							<span>#03</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 04. Telemetry Metric Block (255px) - Amber */}
				<CssMasonryItem key='04' className='group'>
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
									PHYSICS
								</span>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#04</span>
							</div>
							<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Runge-Kutta 4th Order</h4>
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Micro-interaction spring simulation with RK4 numerical integration.</p>
							<div className='text-3xs mt-2.5 grid grid-cols-2 gap-2 font-mono'>
								<div className='border-border/60 bg-background/60 rounded-md border p-2'>
									<span className='text-muted-foreground text-3xs block'>Stiffness</span>
									<span className='text-foreground font-semibold'>170 k</span>
								</div>
								<div className='border-border/60 bg-background/60 rounded-md border p-2'>
									<span className='text-muted-foreground text-3xs block'>Damping</span>
									<span className='text-foreground font-semibold'>26 c</span>
								</div>
							</div>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>RK4 Solver</span>
							<span className='font-semibold text-amber-400'>0.016ms Step</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 05. Framework Chips Tile (145px) - Pink */}
				<CssMasonryItem key='05' className='group'>
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
				</CssMasonryItem>

				{/* 06. Syntax Code Window (180px) - Cyan */}
				<CssMasonryItem key='06' className='group'>
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
									<span className='text-muted-foreground text-3xs ml-1 font-mono'>masonry.css</span>
								</div>
								<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#06</span>
							</div>
							<pre className='border-border/50 bg-background/80 text-muted-foreground text-3xs no-scrollbar overflow-x-auto rounded-lg border p-2 font-mono leading-relaxed'>
								<code>{`column-count: ${columns};\nbreak-inside: avoid;\ncolumn-fill: ${columnFill};`}</code>
							</pre>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>CSS Multi-Column</span>
							<span className='font-semibold text-cyan-400'>Zero Script</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 07. Big Stat Metric Tile (130px) - Indigo */}
				<CssMasonryItem key='07' className='group'>
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
				</CssMasonryItem>

				{/* 08. Void Elimination Tile (220px) - Violet */}
				<CssMasonryItem key='08' className='group'>
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
							<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Staggered elements interlock fluidly to eliminate vertical blank gaps across varying column heights.</p>
						</div>
						<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
							<span>Sub-Pixel Grid</span>
							<span className='font-semibold text-violet-400'>Auto Balanced</span>
						</div>
					</div>
				</CssMasonryItem>

				{/* 09. Micro WCAG A11y Ping (135px) - Emerald */}
				<CssMasonryItem key='09' className='group'>
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
				</CssMasonryItem>
			</CssMasonry>
		</div>
	);
}
