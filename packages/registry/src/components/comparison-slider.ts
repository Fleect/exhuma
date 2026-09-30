import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const comparisonSliderComponent: UniversalComponent = {
	id: 'comparison-slider',
	name: 'Comparison Slider',
	slug: 'comparison-slider',
	category: 'cards',
	description: 'Interactive before/after media comparison slider with sub-pixel clip-path polygon slicing and WAI-ARIA keyboard navigation.',
	version: '1.0.0',
	props: [
		{
			name: 'defaultPosition',
			label: 'Default Position',
			type: 'number',
			defaultValue: 0.5,
			min: 0.1,
			max: 0.9,
			step: 0.05,
			description: 'Initial divider split ratio between 0 and 1.',
		},
		{
			name: 'step',
			label: 'Keyboard Step',
			type: 'number',
			defaultValue: 0.05,
			min: 0.01,
			max: 0.2,
			step: 0.01,
			description: 'Position delta when stepping with arrow keys.',
		},
		{
			name: 'orientation',
			label: 'Orientation',
			type: 'select',
			defaultValue: 'horizontal',
			options: [
				{ label: 'Horizontal', value: 'horizontal' },
				{ label: 'Vertical', value: 'vertical' },
			],
			description: 'Slider split direction (horizontal or vertical).',
		},
	],
	defaultProps: {
		defaultPosition: 0.5,
		step: 0.05,
		orientation: 'horizontal',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'comparison-slider',
				name: 'Comparison Slider',
				slug: 'comparison-slider',
				category: 'cards',
				pascalName: 'ComparisonSlider',
				snakeName: 'comparison_slider',
				description: 'Interactive before/after media comparison slider with sub-pixel clip-path polygon slicing.',
				defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto',
			},
			flavor,
			props,
			options
		);
	},
};
