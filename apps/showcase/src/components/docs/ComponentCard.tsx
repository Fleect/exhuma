'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconCheck as Check, IconArrowUpRight as ArrowUpRight, IconTerminal2 as Terminal } from '@tabler/icons-react';
import { ECOSYSTEM_LABELS } from '@/registry';
import { cn } from '@/lib/utils';

interface ComponentCardProps {
	slug: string;
	name: string;
	category: string;
	description: string;
	className?: string;
}

export function ComponentCard({ slug, name, category, description, className }: ComponentCardProps) {
	const [copied, setCopied] = React.useState(false);
	const ecosystemCount = Object.keys(ECOSYSTEM_LABELS).length;

	const cliCommand = `npx exhuma add ${slug}`;

	const copyCli = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		navigator.clipboard.writeText(cliCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn(
				'border-border/80 bg-card/70 hover:bg-card/95 hover:border-foreground/30 group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10',
				className
			)}
		>
			{/* Precision corner ticks */}
			<div className='text-foreground/20 pointer-events-none absolute top-2 left-2 font-mono text-[9px] select-none'>+</div>
			<div className='text-foreground/20 pointer-events-none absolute top-2 right-2 font-mono text-[9px] select-none'>+</div>

			{/* Subtle top reflection shimmer on hover */}
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

			<div>
				{/* Header: Category Badge & Studio Link */}
				<div className='mb-3.5 flex items-center justify-between gap-2'>
					<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold tracking-wider uppercase'>{category}</span>
					<Link href={`/docs/components/${slug}`} className='text-muted-foreground group-hover:text-foreground text-2xs inline-flex items-center gap-1 font-mono transition-colors'>
						<span>Explore</span>
						<ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
					</Link>
				</div>

				{/* Title & Description */}
				<Link href={`/docs/components/${slug}`} className='block'>
					<h3 className='text-foreground text-base font-bold tracking-tight transition-colors sm:text-lg'>{name}</h3>
					<p className='text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed'>{description}</p>
				</Link>
			</div>

			{/* Bottom: Ecosystem count + Quick CLI Add */}
			<div className='border-border/60 mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs'>
				<span className='text-muted-foreground text-3xs font-mono'>{ecosystemCount} Ecosystems</span>
				<button
					type='button'
					onClick={copyCli}
					className='border-border/80 bg-background text-foreground hover:bg-foreground hover:text-background text-2xs flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono font-medium transition-all active:scale-95'
					title='Copy CLI install command'
				>
					{copied ? (
						<>
							<Check className='h-3 w-3 text-emerald-500' />
							<span className='font-semibold text-emerald-500'>Copied</span>
						</>
					) : (
						<>
							<Terminal className='text-muted-foreground h-3 w-3' />
							<span>add {slug}</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
}

export default ComponentCard;
