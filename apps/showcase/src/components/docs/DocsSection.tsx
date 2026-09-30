import * as React from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';
import { DocsEyebrow } from './DocsEyebrow';

interface DocsSectionProps {
	id: string;
	/** Position in the page's table of contents, shown as `// 01`. */
	index: number;
	label: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	/**
	 * Fade the body in on scroll. Turn off for live demos: the reveal wrapper keeps a
	 * transform, which would trap position:fixed overlays (dialogs, cursor tooltips) inside it.
	 */
	reveal?: boolean;
	children: React.ReactNode;
	className?: string;
}

/**
 * A numbered docs section. Only the body reveals on scroll: the <section> that
 * owns the anchor id never moves, so TOC jumps and active-heading tracking stay
 * pixel-exact.
 */
export function DocsSection({ id, index, label, title, description, actions, reveal = true, children, className }: DocsSectionProps) {
	return (
		<section id={id} className={cn('border-border/70 space-y-6 border-t pt-8', className)}>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
				<div className='min-w-0'>
					<DocsEyebrow index={index} items={[{ label }]} />
					<h2 className='text-foreground mt-3 text-xl font-bold tracking-tight text-balance sm:text-2xl'>{title}</h2>
					{description && <p className='text-muted-foreground mt-2 text-sm leading-relaxed text-pretty'>{description}</p>}
				</div>
				{actions && <div className='shrink-0'>{actions}</div>}
			</div>

			{reveal ? (
				<Reveal threshold={0.05} className='space-y-4'>
					{children}
				</Reveal>
			) : (
				<div className='space-y-4'>{children}</div>
			)}
		</section>
	);
}

/** Body copy for docs sections, sized once so every page reads the same. */
export function DocsProse({ children, className }: { children: React.ReactNode; className?: string }) {
	return <p className={cn('text-muted-foreground text-sm leading-relaxed text-pretty', className)}>{children}</p>;
}

export default DocsSection;
