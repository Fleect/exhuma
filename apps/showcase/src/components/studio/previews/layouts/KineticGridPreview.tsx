import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { KineticGrid } from '@exhuma/layouts';

export default function KineticGridPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex w-full h-full items-center justify-center bg-zinc-950 overflow-hidden relative rounded-xl">
			<KineticGrid
				columns={props.columns as number}
				rows={props.rows as number}
				cellSize={props.cellSize as number}
				glowColor={props.glowColor as string}
				waveOnClick={props.waveOnClick as boolean}
				proximityGlow={props.proximityGlow as boolean}
				glowRadius={props.glowRadius as number}
				style={{ width: '100%', height: '100%' }}
			/>
			<div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
				<span className="text-white/40 text-xs font-medium tracking-widest uppercase">
					Hover &amp; Click to interact
				</span>
			</div>
		</div>
	);
}
