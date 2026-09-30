import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IconCompass as Compass, IconArrowRight as ArrowRight, IconHome as Home, IconBook2 as BookOpen, IconStack2 as Layers } from '@tabler/icons-react';
import { COMPONENT_COUNT } from '@/components/docs/docs-stats';

export const metadata: Metadata = {
	title: { absolute: '404: Primitive Not Found — Exhuma' },
	description: 'The requested kinetic component or documentation page could not be located.',
};

const SUGGESTED_COMPONENTS = [
	{ slug: 'tilt-card', name: '3D Tilt Card', category: 'Cards', desc: 'Hardware-accelerated Euler perspective rotation.' },
	{ slug: 'stacking-cards', name: 'Stacking Cards', category: 'Cards', desc: 'Sticky layered cards with progressive scale decay.' },
	{ slug: 'morphing-tabs', name: 'Morphing Tabs', category: 'Navigation', desc: 'Kinetic spring sliding active indicator.' },
	{ slug: 'spotlight-card', name: 'Spotlight Card', category: 'Cards', desc: 'Sub-pixel cursor radial illumination mask.' },
];

export default function NotFound() {
	return (
		<div className='container mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24'>
			{/* Error Code Eyebrow */}
			<div className='border-border bg-muted/60 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs font-semibold'>
				<Compass className='h-3.5 w-3.5 shrink-0' />
				<span>ERR_404 // PRIMITIVE_NOT_FOUND</span>
			</div>

			{/* Main Typography */}
			<h1 className='font-display text-foreground mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl'>Primitive Not Found</h1>
			<p className='text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed sm:text-base'>
				The requested kinetic coordinate or documentation path does not exist, has been decoupled, or has been consolidated into the canonical component registry.
			</p>

			{/* Quick Recovery Action Buttons */}
			<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
				<Link href='/' className='border-border bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-opacity'>
					<Home className='h-3.5 w-3.5' />
					<span>Return Home</span>
				</Link>

				<Link
					href='/docs/components'
					className='border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-colors'
				>
					<Layers className='h-3.5 w-3.5' />
					<span>Component Registry</span>
				</Link>

				<Link href='/docs' className='border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-colors'>
					<BookOpen className='h-3.5 w-3.5' />
					<span>Documentation</span>
				</Link>
			</div>

			{/* Suggested Primitives Grid */}
			<div className='border-border/60 mt-14 w-full border-t pt-10 text-left'>
				<div className='text-muted-foreground flex items-center justify-between pb-4 font-mono text-xs font-semibold tracking-wider uppercase'>
					<span>Suggested Canonical Primitives</span>
					<Link href='/docs/components' className='hover:text-foreground inline-flex items-center gap-1 transition-colors'>
						<span>View all {COMPONENT_COUNT} components</span>
						<ArrowRight className='h-3 w-3' />
					</Link>
				</div>

				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					{SUGGESTED_COMPONENTS.map((item) => (
						<Link
							key={item.slug}
							href={`/docs/components/${item.slug}`}
							className='group border-border bg-card/60 hover:border-foreground/30 hover:bg-card relative flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all'
						>
							<div>
								<div className='flex items-center justify-between'>
									<span className='font-display text-foreground group-hover:text-primary text-sm font-bold tracking-tight transition-colors'>{item.name}</span>
									<span className='border-border text-muted-foreground text-3xs rounded-sm border px-1.5 py-0.5 font-mono font-medium'>{item.category}</span>
								</div>
								<p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>{item.desc}</p>
							</div>

							<div className='text-foreground text-3xs mt-3 inline-flex items-center gap-1 font-mono font-semibold'>
								<span>INSPECT PRIMITIVE</span>
								<ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-0.5' />
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
