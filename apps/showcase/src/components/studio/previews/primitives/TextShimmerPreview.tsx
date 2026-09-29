import React from 'react';
import { TextShimmer } from '@exhuma/core';

export default function TextShimmerPreview(props: any) {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-950 p-8 rounded-xl">
			<TextShimmer
				{...props}
				className="text-5xl font-bold tracking-tighter"
			/>
		</div>
	);
}
