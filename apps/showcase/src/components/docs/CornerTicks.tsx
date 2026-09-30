import * as React from 'react';
import { cn } from '@/lib/utils';

function Tick({ className }: { className: string }) {
	return (
		<svg aria-hidden='true' viewBox='0 0 8 8' className={cn('text-foreground/25 pointer-events-none absolute size-2', className)}>
			<path d='M4 0v8M0 4h8' stroke='currentColor' strokeWidth='1' />
		</svg>
	);
}

/**
 * The precision "+" crosshairs the homepage puts on its cards. Drawn as SVG
 * rather than a "+" glyph so they stay decorative to assistive tech and
 * contrast checkers.
 */
export function CornerTicks({ bottom = false }: { bottom?: boolean }) {
	return (
		<>
			<Tick className='top-2 left-2' />
			<Tick className='top-2 right-2' />
			{bottom && (
				<>
					<Tick className='bottom-2 left-2' />
					<Tick className='right-2 bottom-2' />
				</>
			)}
		</>
	);
}

export default CornerTicks;
