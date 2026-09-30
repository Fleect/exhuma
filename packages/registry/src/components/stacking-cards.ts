import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const stackingCardsComponent: UniversalComponent = {
	id: 'stacking-cards',
	name: 'Stacking Cards',
	slug: 'stacking-cards',
	category: 'cards',
	description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay and reverse scaling exit mechanics.',
	version: '1.0.0',
	props: [
		{
			name: 'topStart',
			label: 'Top Start (px)',
			type: 'number',
			defaultValue: 20,
			min: 0,
			max: 200,
			step: 4,
			description: 'Offset in pixels from top of viewport for the first sticky card.',
		},
		{
			name: 'topIncrement',
			label: 'Top Increment (px)',
			type: 'number',
			defaultValue: 28,
			min: 8,
			max: 64,
			step: 4,
			description: 'Vertical stacking offset in pixels for each subsequent card.',
		},
		{
			name: 'cardGap',
			label: 'Card Gap (px)',
			type: 'number',
			defaultValue: 20,
			min: 0,
			max: 160,
			step: 4,
			description: 'Vertical gap in pixels between cards in normal flow before they stack.',
		},
		{
			name: 'scaleThreshold',
			label: 'Scale Threshold (px)',
			type: 'number',
			defaultValue: 150,
			min: 50,
			max: 400,
			step: 10,
			description: 'Scroll distance threshold over which progressive scaling activates.',
		},
		{
			name: 'minScale',
			label: 'Minimum Scale',
			type: 'number',
			defaultValue: 0.9,
			min: 0.75,
			max: 0.99,
			step: 0.01,
			description: 'Minimum scale applied to the base card in the stack.',
		},
		{
			name: 'reverseScale',
			label: 'Reverse Scale',
			type: 'boolean',
			defaultValue: true,
			description: 'Enable or disable reverse scaling exit cascade mechanics.',
		},
	],
	defaultProps: {
		topStart: 20,
		topIncrement: 28,
		cardGap: 20,
		scaleThreshold: 150,
		minScale: 0.9,
		reverseScale: true,
	},
	dependencies: {
		...CORE_COMPONENT_DEPENDENCIES,
		vue: [],
		svelte: [],
		solid: [],
	},
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'stacking-cards',
				name: 'Stacking Cards',
				slug: 'stacking-cards',
				category: 'cards',
				pascalName: 'StackingCards',
				snakeName: 'stacking_cards',
				description: 'Layered 3D sticky stack cards with progressive scroll depth scale decay.',
				defaultTailwindClass: 'relative flex flex-col w-full max-w-2xl mx-auto',
			},
			flavor,
			props,
			options
		);
	},
};
