import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { ParticleField } from '@exhuma/layouts';

export default function ParticleFieldPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="relative w-full h-full bg-zinc-950 rounded-xl overflow-hidden">
			<ParticleField
				style={{ position: 'absolute', inset: 0 }}
				particleCount={props.particleCount as number}
				particleColor={props.particleColor as string}
				particleSize={props.particleSize as number}
				repulsionRadius={props.repulsionRadius as number}
				speed={props.speed as number}
				connectParticles={props.connectParticles as boolean}
			/>
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="bg-zinc-950/70 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
					<h3 className="text-white text-lg font-medium tracking-tight">Particle Field</h3>
					<p className="text-zinc-400 text-sm mt-1">Move pointer to repel particles</p>
				</div>
			</div>
		</div>
	);
}
