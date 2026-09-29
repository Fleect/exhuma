import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const confettiBurstComponent: UniversalComponent = {
	id: 'confetti-burst',
	name: 'Confetti Burst',
	slug: 'confetti-burst',
	category: 'interactive',
	description: 'GPU-accelerated ballistic confetti particle system. Uses Verlet integration and zero-GC typed arrays to render hundreds of particles at 120fps.',
	version: '1.0.0',
	props: [
		{
			name: 'particleCount',
			label: 'Particle Count',
			type: 'number',
			defaultValue: 80,
			min: 20,
			max: 200,
			step: 10,
			description: 'Number of confetti particles emitted per burst.',
		},
		{
			name: 'spread',
			label: 'Spread (degrees)',
			type: 'number',
			defaultValue: 160,
			min: 30,
			max: 360,
			step: 10,
			description: 'The launch angle spread in degrees.',
		},
		{
			name: 'gravity',
			label: 'Gravity',
			type: 'number',
			defaultValue: 800,
			min: 200,
			max: 2000,
			step: 100,
			description: 'Downward acceleration (px/s²).',
		},
	],
	defaultProps: {
		particleCount: 80,
		spread: 160,
		gravity: 800,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'confetti-burst',
				name: 'Confetti Burst',
				slug: 'confetti-burst',
				category: 'interactive',
				pascalName: 'ConfettiBurst',
				snakeName: 'confetti_burst',
				description: 'GPU-accelerated ballistic confetti particle system with zero GC allocation.',
				defaultTailwindClass: 'relative block w-full h-full pointer-events-none',
			},
			flavor,
			props,
			options
		);
	},
};
