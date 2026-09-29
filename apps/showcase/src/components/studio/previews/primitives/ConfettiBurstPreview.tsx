import * as React from 'react';
import { useState } from 'react';
import { ComponentPreviewProps } from '../types';
import { ConfettiBurst } from '@exhuma/core';

export default function ConfettiBurstPreview({ props = {} }: ComponentPreviewProps) {
	const [trigger, setTrigger] = useState(false);

	const fire = () => {
		setTrigger(true);
		setTimeout(() => setTrigger(false), 100);
	};

	return (
		<div className="flex w-full h-full min-h-[400px] items-center justify-center relative overflow-hidden">
			<ConfettiBurst
				particleCount={props.particleCount as number}
				spread={props.spread as number}
				gravity={props.gravity as number}
				trigger={trigger}
				onComplete={() => setTrigger(false)}
				className="absolute inset-0 pointer-events-none"
			/>
			<button
				onClick={fire}
				className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg transition-transform active:scale-95 z-10 relative"
			>
				🎉 Fire Confetti
			</button>
		</div>
	);
}
