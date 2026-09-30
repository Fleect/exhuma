import * as React from 'react';
import { DocsEyebrow, type DocsEyebrowItem } from './DocsEyebrow';

interface DocsPageHeaderProps {
	id?: string;
	eyebrow: DocsEyebrowItem[];
	title: React.ReactNode;
	description: React.ReactNode;
	/** Mono spec chips under the description, e.g. "Ω(120Hz)" or "13 ecosystems". */
	meta?: string[];
	actions?: React.ReactNode;
}

export function DocsPageHeader({ id, eyebrow, title, description, meta, actions }: DocsPageHeaderProps) {
	return (
		<header id={id} className='space-y-4'>
			<nav aria-label='Breadcrumb'>
				<DocsEyebrow items={eyebrow} />
			</nav>

			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<h1 className='text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl'>
					<span className='from-foreground via-foreground/90 to-foreground/60 bg-linear-to-b bg-clip-text text-transparent'>{title}</span>
				</h1>
				{actions && <div className='shrink-0 sm:pt-2'>{actions}</div>}
			</div>

			<p className='text-muted-foreground max-w-2xl text-sm leading-relaxed text-pretty sm:text-base'>{description}</p>

			{meta && meta.length > 0 && (
				<ul aria-label='Specification' className='flex flex-wrap gap-2 pt-1'>
					{meta.map((item) => (
						<li key={item} className='kbd border-border bg-background text-foreground text-3xs font-semibold'>
							{item}
						</li>
					))}
				</ul>
			)}
		</header>
	);
}

export default DocsPageHeader;
