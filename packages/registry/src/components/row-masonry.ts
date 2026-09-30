import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const rowMasonryComponent: UniversalComponent = {
	id: 'row-masonry',
	name: 'Row Masonry',
	slug: 'row-masonry',
	category: 'layouts',
	description: 'Greedy dynamic row-by-row masonry balancer placing items into the shortest column with GPU translate3d positioning.',
	version: '1.0.0',
	props: [
		{
			name: 'columns',
			label: 'Mobile Columns (<640px)',
			type: 'number',
			defaultValue: 1,
			min: 1,
			max: 6,
			step: 1,
			description: 'Base column count on mobile viewports (<640px).',
		},
		{
			name: 'columnsSm',
			label: 'Tablet Columns (640-768px)',
			type: 'number',
			defaultValue: 2,
			min: 1,
			max: 4,
			step: 1,
			description: 'Number of columns on small tablet viewports (≥640px).',
		},
		{
			name: 'columnsMd',
			label: 'Medium Tablet Columns (768-1024px)',
			type: 'number',
			defaultValue: 2,
			min: 1,
			max: 6,
			step: 1,
			description: 'Number of columns on medium tablet viewports (≥768px).',
		},
		{
			name: 'columnsLg',
			label: 'Desktop Columns (1024-1280px)',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 8,
			step: 1,
			description: 'Number of columns on desktop viewports (≥1024px).',
		},
		{
			name: 'columnsXl',
			label: 'Ultra-wide Columns (≥1280px)',
			type: 'number',
			defaultValue: 4,
			min: 1,
			max: 10,
			step: 1,
			description: 'Number of columns on large screens (≥1280px).',
		},
		{
			name: 'gap',
			label: 'Gap (px)',
			type: 'number',
			defaultValue: 16,
			min: 4,
			max: 64,
			step: 4,
			description: 'Spacing between masonry columns and items.',
		},
	],
	defaultProps: {
		columns: 1,
		columnsSm: 2,
		columnsMd: 2,
		columnsLg: 3,
		columnsXl: 4,
		gap: 16,
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
				description: 'Greedy dynamic row-by-row masonry balancer placing items into the shortest column with GPU translate3d positioning.',
				defaultTailwindClass: 'w-full relative',
				compoundParts: [
					{
						name: 'RowMasonryItem',
						primitiveExport: 'RowMasonryItem',
						defaultClass: 'w-full',
					},
				],
			},
			flavor,
			props,
			options
		);
	},
};
