import * as React from 'react';

interface DocsTableProps {
	/** Accessible name for the scroll region, e.g. "exhuma init flags". */
	label: string;
	children: React.ReactNode;
}

/**
 * Wide tables scroll sideways on phones. A scrollable region has to be
 * keyboard-reachable, so the frame is focusable and named.
 */
export function DocsTable({ label, children }: DocsTableProps) {
	return (
		<div role='region' aria-label={label} tabIndex={0} className='border-border/80 bg-card/60 focus-visible:ring-ring overflow-x-auto rounded-2xl border shadow-xs outline-none focus-visible:ring-2'>
			<table className='w-full text-left text-xs'>{children}</table>
		</div>
	);
}

export const docsTableHeadClass = 'bg-muted/50 text-muted-foreground border-border text-3xs border-b font-mono tracking-wider uppercase';

export default DocsTable;
