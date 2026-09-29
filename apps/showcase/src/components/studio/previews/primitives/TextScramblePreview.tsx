import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { TextScramble } from '@exhuma/core';

export default function TextScramblePreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-950 p-8 rounded-xl">
			<TextScramble
				text={props.text as string}
				speed={props.speed as number}
				duration={props.duration as number}
				trigger={props.trigger as 'hover' | 'mount' | 'inView'}
				className="text-4xl font-bold font-mono tracking-wider text-white"
			/>
		</div>
	);
}
