import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { HulyEffect } from '@exhuma/cards';

export default function HulyEffectPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center p-8 w-full h-full min-h-[400px]">
			<HulyEffect
				glowColor={props.glowColor as string}
				ambientRadius={props.ambientRadius as number}
				intensity={props.intensity as number}
				borderGlow={props.borderGlow as boolean}
				className="w-full max-w-sm aspect-[4/3] flex flex-col items-center justify-center p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
			>
				<h3 className="text-xl font-semibold mb-2">Huly Hover</h3>
				<p className="text-sm text-neutral-500 text-center">Move your cursor to experience the ambient kinetic luminance.</p>
			</HulyEffect>
		</div>
	);
}
