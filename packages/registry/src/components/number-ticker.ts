import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const numberTickerComponent: UniversalComponent = {
	id: 'number-ticker',
	name: 'Number Ticker',
	slug: 'number-ticker',
	category: 'primitives',
	description: 'Analytical easeOutExpo numerical counter with direct DOM textContent manipulation and zero external animation libraries.',
	version: '1.0.0',
	props: [
		{
			name: 'value',
			label: 'Target Value',
			type: 'number',
			defaultValue: 1250,
			description: 'The target numerical value to count towards.',
		},
		{
			name: 'initialValue',
			label: 'Initial Value',
			type: 'number',
			defaultValue: 0,
			description: 'Starting number at inception.',
		},
		{
			name: 'duration',
			label: 'Duration (s)',
			type: 'number',
			defaultValue: 1.5,
			min: 0.5,
			max: 5.0,
			step: 0.25,
			description: 'Time in seconds to reach the target number.',
		},
		{
			name: 'decimalPlaces',
			label: 'Decimals',
			type: 'number',
			defaultValue: 0,
			min: 0,
			max: 3,
			step: 1,
			description: 'Decimal precision to format.',
		},
		{
			name: 'prefix',
			label: 'Prefix',
			type: 'string',
			defaultValue: '',
			description: 'Leading currency or symbol (e.g. "$", "+", "€").',
		},
		{
			name: 'suffix',
			label: 'Suffix',
			type: 'string',
			defaultValue: '',
			description: 'Trailing unit identifier (e.g. "%", "ms", "k", "M").',
		},
	],
	defaultProps: {
		value: 1250,
		initialValue: 0,
		duration: 1.5,
		decimalPlaces: 0,
		prefix: '',
		suffix: '',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'number-ticker',
				name: 'Number Ticker',
				slug: 'number-ticker',
				category: 'primitives',
				pascalName: 'NumberTicker',
				snakeName: 'number_ticker',
				description: 'Analytical easeOutExpo numerical counter with direct DOM manipulation.',
				defaultTailwindClass: 'inline-block tabular-nums font-bold tracking-tight text-foreground',
			},
			flavor,
			props,
			options
		);
	},
};
