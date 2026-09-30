import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const autoGridComponent: UniversalComponent = {
	id: 'auto-grid',
	name: 'Auto Grid',
	slug: 'auto-grid',
	category: 'layouts',
	description: 'Responsive CSS Grid with auto-fit / auto-fill minmax repeat tracks with zero media queries.',
	version: '1.0.0',
	props: [
		{
			name: 'minItemWidth',
			label: 'Min Width (px)',
			type: 'number',
			defaultValue: 280,
			min: 120,
			max: 480,
			step: 10,
			description: 'Minimum width of each grid column before wrapping to the next line.',
		},
		{
			name: 'gap',
			label: 'Grid Gap (px)',
			type: 'number',
			defaultValue: 24,
			min: 4,
			max: 64,
			step: 4,
			description: 'Gap between grid items.',
		},
		{
			name: 'mode',
			label: 'Track Mode',
			type: 'select',
			defaultValue: 'auto-fit',
			options: [
				{ label: 'Auto-Fit (Expand to Fill Row)', value: 'auto-fit' },
				{ label: 'Auto-Fill (Preserve Track Widths)', value: 'auto-fill' },
			],
			description: 'Determines whether tracks collapse to stretch items or stay fixed.',
		},
		{
			name: 'maxColumns',
			label: 'Max Columns',
			type: 'number',
			defaultValue: 4,
			min: 1,
			max: 12,
			step: 1,
			description: 'Upper constraint on maximum columns allowed.',
		},
		{
			name: 'alignItems',
			label: 'Item Alignment',
			type: 'select',
			defaultValue: 'stretch',
			options: [
				{ label: 'Stretch (Equal Height)', value: 'stretch' },
				{ label: 'Start (Top)', value: 'start' },
				{ label: 'Center (Middle)', value: 'center' },
				{ label: 'End (Bottom)', value: 'end' },
			],
			description: 'Cross-axis vertical alignment for items within grid rows.',
		},
	],
	defaultProps: {
		minItemWidth: 280,
		gap: 24,
		mode: 'auto-fit',
		maxColumns: 4,
		alignItems: 'stretch',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'auto-grid',
				name: 'Auto Grid',
				slug: 'auto-grid',
				category: 'layouts',
				pascalName: 'AutoGrid',
				snakeName: 'auto_grid',
				description: 'Responsive CSS Grid with auto-fit / auto-fill minmax repeat tracks.',
				defaultTailwindClass: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6 w-full',
				compoundParts: [
					{
						name: 'AutoGridItem',
						primitiveExport: 'AutoGridItem',
						defaultClass: '',
					},
				],
			},
			flavor,
			props,
			options
		);
	},
};
