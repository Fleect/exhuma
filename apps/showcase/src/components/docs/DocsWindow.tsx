import * as React from 'react';
import { cn } from '@/lib/utils';

/** The monochrome traffic lights from the homepage's Kinetics Lab window. */
export function WindowDots() {
	return (
		<div aria-hidden='true' className='flex shrink-0 gap-1.5 opacity-60'>
			<div className='bg-foreground/40 h-2.5 w-2.5 rounded-full' />
			<div className='bg-foreground/30 h-2.5 w-2.5 rounded-full' />
			<div className='bg-foreground/20 h-2.5 w-2.5 rounded-full' />
		</div>
	);
}

interface DocsWindowProps {
	filename: string;
	/** Pulsing status pill in the title bar, e.g. "COMPOSITOR ACTIVE". */
	status?: string;
	children: React.ReactNode;
	className?: string;
}

/** A window frame for non-code specs (state machines, diagrams), matching the homepage lab. */
export function DocsWindow({ filename, status, children, className }: DocsWindowProps) {
	return (
		<div className={cn('border-border/80 bg-card/75 relative overflow-hidden rounded-2xl border shadow-sm', className)}>
			<div className='border-border/60 bg-muted/40 flex items-center justify-between gap-3 border-b px-4 py-2.5'>
				<div className='flex min-w-0 items-center gap-2.5'>
					<WindowDots />
					<span className='text-muted-foreground text-2xs truncate font-mono font-medium'>{filename}</span>
				</div>
				{status && (
					<span className='border-border bg-background/90 text-foreground text-3xs inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-semibold'>
						<span className='bg-foreground h-1.5 w-1.5 shrink-0 animate-pulse rounded-full motion-reduce:animate-none' />
						{status}
					</span>
				)}
			</div>
			<div className='bg-dot-grid p-5'>{children}</div>
		</div>
	);
}

export default DocsWindow;
