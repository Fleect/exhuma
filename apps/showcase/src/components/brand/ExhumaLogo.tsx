import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ExhumaLogoProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
	className?: string;
	cursorFill?: string;
}

/**
 * ExhumaLogo — The Official Kinetic Geometric Abstraction Brand Mark (EKP)
 *
 * Geometric Structure:
 * - Interlocking stepped spine with 45° forward kinetic shear terminal cuts.
 * - Pure minimalist black & white monochrome adapting dynamically via currentColor.
 * - Exact aspect ratio bounding (70:85) eliminating phantom whitespace.
 */
export function ExhumaLogo({ size = 24, className, cursorFill, ...props }: ExhumaLogoProps) {
	const numSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 24;
	const computedWidth = Math.round(numSize * (70 / 85));

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={computedWidth}
			height={numSize}
			viewBox='16 14 70 85'
			fill='none'
			className={cn('shrink-0 transition-transform duration-200 select-none group-hover:scale-105', className)}
			{...props}
		>
			<path
				d='M 24 16 H 84 L 72 28 H 48 A 4 4 0 0 0 44 32 V 41 A 4 4 0 0 0 48 45 H 84 L 72 68 H 48 A 4 4 0 0 0 44 72 V 81 A 4 4 0 0 0 48 85 H 84 L 72 97 H 24 A 6 6 0 0 1 18 91 V 73 A 6 6 0 0 1 24 67 H 32 A 5 5 0 0 0 37 62 V 51 A 5 5 0 0 0 32 46 H 24 A 6 6 0 0 1 18 40 V 22 A 6 6 0 0 1 24 16 Z'
				fill='currentColor'
			/>
		</svg>
	);
}

export default ExhumaLogo;
