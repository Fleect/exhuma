import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const diamondGridComponent: UniversalComponent = {
	id: 'diamond-grid',
	name: 'Diamond Grid',
	slug: 'diamond-grid',
	category: 'layouts',
	description: 'Rhombic symmetrical diamond column distribution [1, 2, 3, 4, 3, 2, 1] with container-query responsive collapse.',
	version: '1.0.0',
	props: [
		{
			name: 'mode',
			label: 'Grid Mode',
			type: 'select',
			options: [
				{ label: 'Rhombic (Classic Default)', value: 'rhombic' },
				{ label: 'Isometric (45° Diamond)', value: 'isometric' },
			],
			defaultValue: 'rhombic',
			description: 'Visual rendering mode (classic upright cards in rhombic columns vs 45° tilted diamond cards).',
		},
		{
			name: 'gap',
			label: 'Column Gap',
			type: 'number',
			defaultValue: 16,
			min: 4,
			max: 48,
			step: 2,
			description: 'Spacing between diamond columns and elements in pixels.',
		},
		{
			name: 'layout',
			label: 'Layout Topology',
			type: 'select',
			options: [
				{ label: 'Auto (Dynamic)', value: 'auto' },
				{ label: 'Large (7 Columns)', value: 'large' },
				{ label: 'Medium (5 Columns)', value: 'medium' },
				{ label: 'Small (3 Columns)', value: 'small' },
			],
			defaultValue: 'auto',
			description: 'Rhombic column layout topology (large: 7-col [1,2,3,4,3,2,1], medium: 5-col, small: 3-col).',
		},
		{
			name: 'responsive',
			label: 'Responsive Mobile Collapse',
			type: 'boolean',
			defaultValue: false,
			description: 'Enable collapse to compact grid on narrow mobile screens (< 420px). When disabled (default), preserves authentic rhombic diamond structure across all devices.',
		},
	],
	defaultProps: {
		mode: 'rhombic',
		gap: 16,
		layout: 'auto',
		responsive: false,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'diamond-grid',
				name: 'Diamond Grid',
				slug: 'diamond-grid',
				category: 'layouts',
				pascalName: 'DiamondGrid',
				snakeName: 'diamond_grid',
				description: 'Rhombic symmetrical diamond column distribution with container-query responsive collapse.',
				defaultTailwindClass: 'flex items-center justify-center w-full max-w-6xl mx-auto py-12 overflow-hidden',
				compoundParts: [
					{
						name: 'DiamondColumn',
						primitiveExport: 'DiamondColumn',
						defaultClass: 'flex flex-col items-center justify-center',
					},
					{
						name: 'DiamondItem',
						primitiveExport: 'DiamondItem',
						defaultClass: 'exhuma-diamond-item',
					},
				],
			},
			flavor,
			props,
			options
		);
	},
};
