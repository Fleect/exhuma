import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { TextShimmer } from '@exhuma/core';

export default function TextShimmerPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-950 p-8 rounded-xl">
			<TextShimmer
				spread={props.spread as number}
				duration={props.duration as number}
				shimmerColor={props.shimmerColor as string}
				baseTextColor={props.baseTextColor as string}
				hoverAccelerate={props.hoverAccelerate as boolean}
				className="text-5xl font-bold tracking-tighter"
			>
				Exhuma Components
			</TextShimmer>
		</div>
	);
}
