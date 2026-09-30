import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { AutoGrid, AutoGridItem } from '@exhuma/layouts';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function AutoGridPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const minItemWidth = Number(propValues.minItemWidth ?? 280);
	const gap = Number(propValues.gap ?? 24);
	const mode = (propValues.mode as 'auto-fit' | 'auto-fill') ?? 'auto-fit';
	const maxColumns = Number(propValues.maxColumns ?? 4);
	const alignItems = (propValues.alignItems as 'stretch' | 'start' | 'center' | 'end') ?? 'stretch';

	const gridItems = [
		{
			id: '01',
			title: 'High-Throughput Kinetic Pipeline',
			desc: 'Automated repeat tracks expanding fluidly to consume available viewport space with zero layout thrash.',
			tag: 'PIPELINE',
			metric: '0.14ms Frame',
			colSpan: 1,
		},
		{
			id: '02',
			title: 'Dynamic MinMax Constraint Engine',
			desc: `Evaluates minmax(min(100%, ${minItemWidth}px), 1fr) to guarantee zero mobile horizontal scroll overflow.`,
			tag: 'COMPLIANCE',
			metric: `${minItemWidth}px Floor`,
			colSpan: 1,
		},
		{
			id: '03',
			title: 'Sub-Pixel Layout Stability',
			desc: 'Fractional unit distribution across browser render passes preventing cumulative layout shift (CLS = 0.00).',
			tag: 'VITALS',
			metric: 'CLS: 0.00',
			colSpan: 1,
		},
		{
			id: '04',
			title: 'Hermite Damped Track Transition',
			desc: 'Column wrapping transitions with fluid visual hierarchy and balanced element distribution.',
			tag: 'PHYSICS',
			metric: 'Hermite Smooth',
			colSpan: 1,
		},
		{
			id: '05',
			title: 'Cross-Ecosystem Universal Grid',
			desc: 'Zero-runtime pure CSS grid templates compiled for Vue, Svelte, Angular, Solid, and modern web frameworks.',
			tag: 'UNIVERSAL',
			metric: `${ECOSYSTEM_COUNT} Flavors`,
			colSpan: 1,
		},
		{
			id: '06',
			title: 'Zero Memory Leak Architecture',
			desc: 'Stateless declarative container avoiding persistent listener references or uncollected DOM observers.',
			tag: 'AUDIT',
			metric: '0 Heap Leaks',
			colSpan: 1,
		},
	];

	return (
		<div className='w-full p-2 sm:p-6'>
			<AutoGrid minItemWidth={minItemWidth} gap={gap} mode={mode} maxColumns={maxColumns} alignItems={alignItems} className='w-full'>
				{gridItems.map((item) => (
					<AutoGridItem key={item.id} colSpan={item.colSpan as any} className='group'>
						<div className='border-border/80 bg-card/90 hover:border-primary/50 relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
							<div className='from-primary/10 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-30 transition-opacity group-hover:opacity-60' />
							<div className='relative z-10'>
								<div className='mb-3 flex items-center justify-between'>
									<span className='border-primary/20 bg-primary/10 text-primary text-3xs inline-flex items-center rounded-md border px-2 py-0.5 font-mono font-semibold tracking-wider uppercase'>
										{item.tag}
									</span>
									<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>GRID #{item.id}</span>
								</div>
								<h4 className='text-foreground group-hover:text-primary text-sm font-bold tracking-tight transition-colors'>{item.title}</h4>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{item.desc}</p>
							</div>
							<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-5 flex items-center justify-between border-t pt-3 font-mono'>
								<span>Mode: {mode}</span>
								<span className='font-semibold text-emerald-400'>{item.metric}</span>
							</div>
						</div>
					</AutoGridItem>
				))}
			</AutoGrid>
		</div>
	);
}
