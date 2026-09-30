import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { DiamondGrid } from '@exhuma/layouts';

export default function DiamondGridPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const gap = typeof propValues.gap === 'number' ? propValues.gap : Number(propValues.gap ?? 16);
	const layout = (propValues.layout as any) || 'auto';
	const mode = (propValues.mode as any) || 'rhombic';
	const responsive = Boolean(propValues.responsive ?? false);
	const isIsometric = mode === 'isometric';

	return (
		<div className='mx-auto flex w-full max-w-4xl items-center justify-center p-4 sm:p-8'>
			<DiamondGrid gap={gap} layout={layout} mode={mode} responsive={responsive} className='w-full max-w-3xl'>
				{Array.from({ length: 16 }).map((_, idx) =>
					isIsometric ? (
						<div
							key={idx}
							className='group border-border/80 bg-card/80 hover:border-primary hover:shadow-primary/20 relative flex aspect-square w-10 rotate-45 items-center justify-center rounded-xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-lg sm:w-14'
						>
							<div className='flex -rotate-45 flex-col items-center justify-center'>
								<span className='text-foreground text-3xs font-mono font-bold'>#{idx + 1}</span>
							</div>
						</div>
					) : (
						<div
							key={idx}
							className='border-border/80 bg-card/80 hover:border-foreground/50 flex aspect-square w-12 flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 sm:w-16'
						>
							<span className='text-foreground text-3xs font-mono font-bold'>#{idx + 1}</span>
						</div>
					)
				)}
			</DiamondGrid>
		</div>
	);
}
