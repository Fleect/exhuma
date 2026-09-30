import * as React from 'react';
import { DocsToc, type TocItem } from '@/components/layout/DocsToc';
import { getDocsPager } from './docs-nav';
import { DocsPager } from './DocsPager';

import { cn } from '@/lib/utils';

interface DocsPageProps {
	/** This page's route; drives the prev/next pager from the shared nav order. */
	href: string;
	toc?: TocItem[];
	children: React.ReactNode;
	wide?: boolean;
	showToc?: boolean;
}

/**
 * Shell for every docs page: one reading width for guides and component pages
 * alike (so content never shifts sideways between them), the TOC, and the pager.
 */
export function DocsPage({ href, toc, children, wide = false, showToc = true }: DocsPageProps) {
	const { prev, next } = getDocsPager(href);
	const hasToc = showToc && Boolean(toc && toc.length > 0);

	return (
		<div className='flex gap-10'>
			<article className={cn('mx-auto min-w-0 flex-1 space-y-12', wide ? (hasToc ? 'max-w-5xl' : 'w-full max-w-7xl') : 'max-w-3xl')}>
				{children}
				<DocsPager prev={prev} next={next} />
			</article>
			{hasToc && <DocsToc items={toc!} />}
		</div>
	);
}

export default DocsPage;
