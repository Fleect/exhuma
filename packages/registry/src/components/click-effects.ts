import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const clickEffectsComponent: UniversalComponent = {
	id: 'click-effects',
	name: 'Click Effects',
	slug: 'click-effects',
	category: 'interactive',
	description: 'GPU-composited kinetic micro-interaction wrapper. Layers radial shockwaves, water ripples, spark bursts, or elastic spring compression on click — with zero GC allocation in the hot path.',
	version: '1.0.0',
	props: [
		{
			name: 'mode',
			label: 'Effect Mode',
			type: 'select',
			defaultValue: 'shockwave',
			options: [
				{ label: 'Shockwave Ring', value: 'shockwave' },
				{ label: 'Water Ripple', value: 'ripple' },
				{ label: 'Spark Burst', value: 'sparks' },
				{ label: 'Elastic Scale', value: 'elastic' },
			],
			description: 'The kinetic micro-physics mode on click.',
		},
		{
			name: 'color',
			label: 'Effect Color',
			type: 'color',
			defaultValue: '#6366f1',
			description: 'Primary color of the click effect.',
		},
		{
			name: 'duration',
			label: 'Duration (ms)',
			type: 'number',
			defaultValue: 600,
			min: 200,
			max: 1500,
			step: 100,
			description: 'Duration in milliseconds for the full effect lifecycle.',
		},
		{
			name: 'sparkCount',
			label: 'Spark Count',
			type: 'number',
			defaultValue: 12,
			min: 4,
			max: 24,
			step: 2,
			description: 'Number of particles emitted in sparks mode.',
		},
	],
	defaultProps: {
		mode: 'shockwave',
		color: '#6366f1',
		duration: 600,
		sparkCount: 12,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'click-effects',
				name: 'Click Effects',
				slug: 'click-effects',
				category: 'interactive',
				pascalName: 'ClickEffects',
				snakeName: 'click_effects',
				description: 'GPU-composited kinetic micro-interaction wrapper with zero GC allocation.',
				defaultTailwindClass: 'relative inline-block',
			},
			flavor,
			props,
			options
		);
	},
};
