import * as React from 'react';
import { TiltCard } from '@exhuma/cards';
import { ComponentPreviewProps } from '../types';

export default function TiltCardPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const maxTilt = Number(propValues.maxTilt ?? 15);
	const perspective = Number(propValues.perspective ?? 1000);
	const scale = Number(propValues.scale ?? 1.02);
	const speed = Number(propValues.speed ?? 0.12);
	const reverse = Boolean(propValues.reverse ?? false);
	const disabled = Boolean(propValues.disabled ?? false);
	const axis = (propValues.axis as 'all' | 'x' | 'y') ?? 'all';

	return (
		<div className='flex items-center justify-center p-2 sm:p-6'>
			<TiltCard
				maxTilt={maxTilt}
				perspective={perspective}
				scale={scale}
				speed={speed}
				reverse={reverse}
				disabled={disabled}
				axis={axis}
				className='bg-card/95 border-border/80 hover:border-foreground/40 w-full max-w-md cursor-pointer border p-5 shadow-2xl transition-colors sm:p-8'
			>
				<div className='mb-4 flex items-center justify-between'>
					<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>3D GYROSCOPE</span>
					<span className='text-muted-foreground font-mono text-xs'>Max: {maxTilt}°</span>
				</div>
				<h4 className='text-foreground text-xl font-black tracking-tight sm:text-2xl'>Tactile 3D Tilt Card</h4>
				<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Move pointer across surface. Calculated with 120 FPS spring lerp and zero layout thrashing.</p>
				<div className='border-border/70 text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
					<span>Perspective: {perspective}px</span>
					<span className='text-foreground/80 font-mono'>Scale: {scale}x</span>
				</div>
			</TiltCard>
		</div>
	);
}
