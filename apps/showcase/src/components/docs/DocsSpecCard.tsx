import * as React from 'react';
import type { Icon } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { CornerTicks } from './CornerTicks';

interface DocsSpecCardProps {
	tag?: string;
	icon?: Icon;
	title: React.ReactNode;
	/** A large mono figure between the title and the body, e.g. "Ω(1) Heap". */
	value?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

/** The homepage's guarantee card: corner ticks, hover lift, and a hairline that lights up on hover. */
export function DocsSpecCard({ tag, icon: CardIcon, title, value, children, className }: DocsSpecCardProps) {
	return (
		<div
			className={cn(
				'border-border/80 bg-card/60 hover:border-foreground/40 group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10',
				className
			)}
		>
			<CornerTicks />
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

			{(tag || CardIcon) && (
				<div className='text-3xs text-muted-foreground mb-3 flex items-center gap-2 font-mono'>
					{CardIcon && <CardIcon className='text-foreground h-3.5 w-3.5 shrink-0' />}
					{tag && <span className='font-bold tracking-wider uppercase'>{tag}</span>}
				</div>
			)}

			<h3 className='text-foreground text-sm font-bold tracking-tight'>{title}</h3>
			{value && <div className='text-foreground mt-2 font-mono text-xl font-black tracking-tight'>{value}</div>}
			{children && <div className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>{children}</div>}
		</div>
	);
}

export default DocsSpecCard;
