import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { HulyEffect } from '@exhuma/core';

export default function HulyEffectPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center p-8 w-full h-full min-h-[400px] bg-slate-950">
			<HulyEffect
				glowColor={props.glowColor as string}
				ambientRadius={props.ambientRadius as number}
				intensity={props.intensity as number}
				smoothing={props.smoothing as number}
				borderGlow={props.borderGlow as boolean}
				className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
			>
				<div className="flex flex-col gap-3">
					<div className="h-2 w-16 rounded-full bg-white/20" />
					<h3 className="text-xl font-semibold text-white">Huly Ambient Glow</h3>
					<p className="text-sm text-white/50 leading-relaxed">
						Move your cursor over this surface. The radial light source follows at 120 Hz with exponential smoothing — zero layout reflow, GPU-composited via CSS custom properties.
					</p>
					<div className="mt-2 flex gap-2">
						<div className="h-8 w-20 rounded-lg bg-white/10" />
						<div className="h-8 w-16 rounded-lg bg-white/5" />
					</div>
				</div>
			</HulyEffect>
		</div>
	);
}
