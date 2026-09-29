import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const textScrambleComponent: UniversalComponent = {
	id: 'text-scramble',
	name: 'Text Scramble',
	slug: 'text-scramble',
	category: 'typography',
	description: 'Cyberpunk-style text decryption effect with tabular-nums zero-CLS guarantees.',
	version: '1.0.0',
	props: [
		{
			name: 'text',
			label: 'Text',
			type: 'string',
			defaultValue: 'Exhuma Studio',
			description: 'The text to animate.',
		},
		{
			name: 'speed',
			label: 'Speed (chars/sec)',
			type: 'number',
			defaultValue: 15,
			min: 5,
			max: 40,
			step: 1,
			description: 'Number of random characters cycled per second.',
		},
		{
			name: 'duration',
			label: 'Duration (ms)',
			type: 'number',
			defaultValue: 1200,
			min: 400,
			max: 3000,
			step: 100,
			description: 'Total time in milliseconds to complete the reveal.',
		},
		{
			name: 'trigger',
			label: 'Trigger',
			type: 'select',
			options: [
				{ label: 'On Mount', value: 'mount' },
				{ label: 'On Hover', value: 'hover' },
				{ label: 'In Viewport', value: 'inView' },
			],
			defaultValue: 'mount',
			description: 'When the animation should start.',
		},
	],
	defaultProps: {
		text: 'Exhuma Studio',
		speed: 15,
		duration: 1200,
		trigger: 'mount',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'text-scramble',
				name: 'Text Scramble',
				slug: 'text-scramble',
				category: 'typography',
				pascalName: 'TextScramble',
				snakeName: 'text_scramble',
				description: 'Cyberpunk-style text decryption effect with tabular-nums zero-CLS guarantees.',
				defaultTailwindClass: 'inline-block font-mono tracking-tight text-foreground',
			},
			flavor,
			props,
			options
		);
	},
};
