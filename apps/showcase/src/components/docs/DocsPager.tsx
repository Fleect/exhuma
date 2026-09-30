import * as React from 'react';
import Link from 'next/link';
import { IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import type { DocsPagerLink } from './docs-nav';

/** Prev/next buttons at the end of every docs page, following the sidebar's reading order. */
export function DocsPager({ prev, next }: { prev: DocsPagerLink | null; next: DocsPagerLink | null }) {
	if (!prev && !next) return null;

	return (
		<nav aria-label='Docs pages' className='flex items-center justify-between gap-4'>
			{prev && (
				<Button variant='secondary' size='sm' asChild className='min-w-0'>
					<Link href={prev.href} aria-label={`Previous: ${prev.title}`}>
						<ArrowLeft className='h-3.5 w-3.5 shrink-0' />
						<span className='truncate'>{prev.title}</span>
					</Link>
				</Button>
			)}
			{next && (
				<Button variant='secondary' size='sm' asChild className='ml-auto min-w-0'>
					<Link href={next.href} aria-label={`Next: ${next.title}`}>
						<span className='truncate'>{next.title}</span>
						<ArrowRight className='h-3.5 w-3.5 shrink-0' />
					</Link>
				</Button>
			)}
		</nav>
	);
}

export default DocsPager;
