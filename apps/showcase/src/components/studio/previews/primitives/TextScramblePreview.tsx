import React from 'react';
import { TextScramble } from '@exhuma/core';

export default function TextScramblePreview(props: any) {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-[300px] bg-slate-950 text-white p-8 rounded-xl">
			<TextScramble
				{...props}
				className="text-4xl font-bold font-mono tracking-wider"
			/>
		</div>
	);
}
