import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const particleFieldComponent: UniversalComponent = {
	id: 'particle-field',
	name: 'Particle Field',
	slug: 'particle-field',
	category: 'layouts',
	description: 'High-performance interactive particle system using a Float32Array zero-GC hot path.',
	version: '1.0.0',
	props: [
		{
			name: 'particleCount',
			label: 'Particle Count',
			type: 'number',
			defaultValue: 60,
			min: 10,
			max: 200,
			step: 10,
			description: 'Number of particles to render.',
		},
		{
			name: 'particleColor',
			label: 'Particle Color',
			type: 'color',
			defaultValue: '#6366f1',
			description: 'Color of the particles and connections.',
		},
		{
			name: 'particleSize',
			label: 'Particle Size',
			type: 'number',
			defaultValue: 2,
			min: 1,
			max: 8,
			step: 1,
			description: 'Radius of each particle in pixels.',
		},
		{
			name: 'repulsionRadius',
			label: 'Repulsion Radius',
			type: 'number',
			defaultValue: 80,
			min: 20,
			max: 200,
			step: 10,
			description: 'Pointer repulsion radius in pixels.',
		},
		{
			name: 'speed',
			label: 'Speed',
			type: 'number',
			defaultValue: 1.0,
			min: 0.1,
			max: 3.0,
			step: 0.1,
			description: 'Drift speed multiplier.',
		},
		{
			name: 'connectParticles',
			label: 'Connect Particles',
			type: 'boolean',
			defaultValue: false,
			description: 'Draw lines between nearby particles.',
		},
	],
	defaultProps: {
		particleCount: 60,
		particleColor: '#6366f1',
		particleSize: 2,
		repulsionRadius: 80,
		speed: 1.0,
		connectParticles: false,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'particle-field',
				name: 'Particle Field',
				slug: 'particle-field',
				category: 'layouts',
				pascalName: 'ParticleField',
				snakeName: 'particle_field',
				description: 'High-performance interactive particle system using a Float32Array zero-GC hot path.',
				defaultTailwindClass: 'relative overflow-hidden',
			},
			flavor,
			props,
			options
		);
	},
};
