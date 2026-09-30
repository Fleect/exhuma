import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface DocsEyebrowItem {
	label: string;
	href?: string;
}

interface DocsEyebrowProps {
	/** Section number. Without one, the eyebrow leads with "// DOCS" linking back to the docs root. */
	index?: number;
	items: DocsEyebrowItem[];
	className?: string;
}

/** The homepage's `// 02 · KINETICS LAB` mono label, shared by page headers and sections. */
export function DocsEyebrow({ index, items, className }: DocsEyebrowProps) {
	return (
		<div className={cn('text-3xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 font-mono', className)}>
			{index === undefined ? (
				<Link href='/docs' className='text-foreground hover:text-foreground/70 font-bold transition-colors'>
					{'// DOCS'}
				</Link>
			) : (
				<span className='text-foreground font-bold'>{`// ${String(index).padStart(2, '0')}`}</span>
			)}
			{items.map((item) => (
				<React.Fragment key={item.label}>
					<span aria-hidden='true'>·</span>
					{item.href ? (
						<Link href={item.href} className='hover:text-foreground tracking-wider uppercase transition-colors'>
							{item.label}
						</Link>
					) : (
						<span className='tracking-wider uppercase'>{item.label}</span>
					)}
				</React.Fragment>
			))}
		</div>
	);
}

export default DocsEyebrow;
