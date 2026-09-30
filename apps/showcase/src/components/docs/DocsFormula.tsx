import * as React from 'react';
import { CornerTicks } from './CornerTicks';

interface DocsFormulaProps {
	label: string;
	caption?: React.ReactNode;
	children: React.ReactNode;
}

/** A closed-form equation set in mono on the dot grid, like the formula captions in the homepage lab. */
export function DocsFormula({ label, caption, children }: DocsFormulaProps) {
	return (
		<figure className='border-border/80 bg-card/60 relative overflow-hidden rounded-2xl border shadow-xs'>
			<CornerTicks />
			<div className='bg-dot-grid px-5 py-8 text-center'>
				<div className='text-foreground font-mono text-sm leading-relaxed text-balance wrap-break-word sm:text-base'>{children}</div>
			</div>
			<figcaption className='border-border/60 text-3xs text-muted-foreground flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-5 py-2.5 font-mono'>
				<span className='text-foreground font-bold'>{label}</span>
				{caption && <span>{caption}</span>}
			</figcaption>
		</figure>
	);
}

export default DocsFormula;
