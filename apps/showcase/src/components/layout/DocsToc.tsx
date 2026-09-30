'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { IconAlignLeft as AlignLeft } from '@tabler/icons-react';

export interface TocItem {
	id: string;
	title: string;
	level?: number;
}

interface DocsTocProps {
	items: TocItem[];
	className?: string;
}

export function DocsToc({ items, className }: DocsTocProps) {
	const [activeId, setActiveId] = React.useState<string>(items[0]?.id || '');
	// The section a TOC link just jumped to. Sections near the end of a page can't
	// scroll up to the landing line, so without this the section above stays lit.
	const jumpTargetRef = React.useRef<string | null>(null);

	React.useEffect(() => {
		// Anchor jumps land on each heading's scroll-margin-top, so that's the line
		// a heading has to cross to count as the current section.
		const landingLine = (heading: HTMLElement) => parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;

		const handleScroll = () => {
			const atPageBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1;

			const jumpTarget = jumpTargetRef.current ? document.getElementById(jumpTargetRef.current) : null;
			if (jumpTarget) {
				const top = jumpTarget.getBoundingClientRect().top;
				const stillAtJumpTarget = Math.abs(top - landingLine(jumpTarget)) <= 1 || (atPageBottom && top >= 0 && top < window.innerHeight);
				if (stillAtJumpTarget) return;
				jumpTargetRef.current = null;
			}

			// Sorted by position on the page rather than TOC order, so a mis-ordered TOC can't break this.
			const headings = items
				.map((item) => document.getElementById(item.id))
				.filter((heading): heading is HTMLElement => heading !== null)
				.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
			const reached = atPageBottom ? headings : headings.filter((heading) => heading.getBoundingClientRect().top <= landingLine(heading) + 1);
			setActiveId(reached[reached.length - 1]?.id ?? items[0]?.id ?? '');
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [items]);

	if (!items || items.length === 0) return null;

	return (
		<div className={cn('hidden w-56 shrink-0 text-xs xl:block', className)}>
			<div className='top-header-offset sticky space-y-3'>
				<div className='text-muted-foreground text-2xs flex items-center gap-1.5 font-mono font-bold tracking-wider uppercase'>
					<AlignLeft className='h-3.5 w-3.5 shrink-0' />
					<span>On This Page</span>
				</div>

				<nav className='border-border space-y-1 border-l pl-3'>
					{items.map((item) => {
						const isActive = activeId === item.id;
						return (
							<a
								key={item.id}
								href={`#${item.id}`}
								onClick={() => {
									jumpTargetRef.current = item.id;
									setActiveId(item.id);
								}}
								className={cn('hover:text-foreground block py-1 transition-colors', isActive ? 'text-primary font-semibold' : 'text-muted-foreground', item.level === 3 ? 'text-2xs pl-2' : '')}
							>
								{item.title}
							</a>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

export default DocsToc;
