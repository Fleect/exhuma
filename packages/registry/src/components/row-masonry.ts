import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const rowMasonryComponent: UniversalComponent = {
	id: 'row-masonry',
	name: 'Row Masonry',
	slug: 'row-masonry',
	category: 'layouts',
	description: 'Greedy column balancer using a min-heap O(N log K) assignment with zero-reflow GPU positioning.',
	version: '1.0.0',
	props: [
		{
			name: 'columns',
			label: 'Columns',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 6,
			step: 1,
			description: 'Number of columns for the masonry layout.',
		},
		{
			name: 'gap',
			label: 'Gap',
			type: 'number',
			defaultValue: 16,
			min: 0,
			max: 48,
			step: 4,
			description: 'Gap between items in pixels.',
		},
		{
			name: 'animateTransitions',
			label: 'Animate Transitions',
			type: 'boolean',
			defaultValue: true,
			description: 'Enable spring transitions on resize.',
		},
	],
	defaultProps: {
		columns: 3,
		gap: 16,
		animateTransitions: true,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'row-masonry',
				name: 'Row Masonry',
				slug: 'row-masonry',
				category: 'layouts',
				pascalName: 'RowMasonry',
				snakeName: 'row_masonry',
				description: 'Greedy column balancer using a min-heap O(N log K) assignment with zero-reflow GPU positioning.',
				defaultTailwindClass: 'w-full',
			},
			flavor,
			props,
			options
		);
	},
};
