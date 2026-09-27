import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const magneticButtonComponent: UniversalComponent = {
	id: 'magnetic-button',
	name: 'Magnetic Button',
	slug: 'magnetic-button',
	category: 'primitives',
	description: 'Inverted spring pull field button that magnetically attracts cursor proximity with critically damped release snaps.',
	version: '1.0.0',
	props: [
		{
			name: 'strength',
			label: 'Pull Strength',
			type: 'number',
			defaultValue: 0.35,
			min: 0.1,
			max: 0.8,
			step: 0.05,
			description: 'Displacement factor relative to cursor distance.',
		},
		{
			name: 'radius',
			label: 'Magnetic Radius (px)',
			type: 'number',
			defaultValue: 120,
			min: 50,
			max: 250,
			step: 10,
			description: 'Influence radius threshold in pixels.',
		},
		{
			name: 'springDamping',
			label: 'Spring Damping',
			type: 'number',
			defaultValue: 18,
			min: 5,
			max: 35,
			step: 1,
			description: 'Exponential decay rate for critically damped snaps.',
		},
		{
			name: 'maxDisplacement',
			label: 'Max Displacement (px)',
			type: 'number',
			defaultValue: 36,
			min: 10,
			max: 80,
			step: 2,
			description: 'Maximum absolute cursor attraction displacement cap in pixels.',
		},
		{
			name: 'text',
			label: 'Button Label',
			type: 'string',
			defaultValue: 'Magnetic Attraction',
			description: 'Inner label text for the button.',
		},
	],
	defaultProps: {
		strength: 0.35,
		radius: 120,
		springDamping: 18,
		maxDisplacement: 36,
		text: 'Magnetic Attraction',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'magnetic-button',
				name: 'Magnetic Button',
				slug: 'magnetic-button',
				category: 'primitives',
				pascalName: 'MagneticButton',
				snakeName: 'magnetic_button',
				description: 'Inverted spring pull field button that magnetically attracts cursor proximity.',
				defaultTailwindClass:
					'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none',
			},
			flavor,
			props,
			options
		);
	},
};
