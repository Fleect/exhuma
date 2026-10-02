import * as React from 'react';
import { ComparisonSlider } from '@fleect/exhuma-cards';
import { ComponentPreviewProps } from '../types';

export default function ComparisonSliderPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const defaultPosition = Number(propValues.defaultPosition ?? 0.5);
	const step = Number(propValues.step ?? 0.05);
	const orientation = (propValues.orientation as 'horizontal' | 'vertical') ?? 'horizontal';

	return (
		<div className='mx-auto w-full max-w-md touch-none py-4'>
			<ComparisonSlider
				aspectRatio='16/10'
				defaultPosition={defaultPosition}
				step={step}
				orientation={orientation}
				before={
					<div className='flex size-full flex-col justify-between bg-linear-to-br from-zinc-950 via-zinc-900 to-black p-6 text-white'>
						<span className='kbd text-3xs self-start border-white/20 bg-white/10 font-mono text-white'>STATIC CANVAS</span>
						<div>
							<h4 className='text-xl font-bold'>Traditional View</h4>
							<p className='text-xs opacity-70'>Unaccelerated layout</p>
						</div>
					</div>
				}
				after={
					<div className='flex size-full flex-col justify-between bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-6 text-white'>
						<span className='kbd text-3xs self-start border-white/30 bg-white/20 font-mono text-white'>EXHUMA KINETIC</span>
						<div>
							<h4 className='text-xl font-bold'>120Hz ProMotion</h4>
							<p className='text-xs opacity-70'>Compositor accelerated</p>
						</div>
					</div>
				}
			/>
		</div>
	);
}
