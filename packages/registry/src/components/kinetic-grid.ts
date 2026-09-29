import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const kineticGridComponent: UniversalComponent = {
	id: 'kinetic-grid',
	name: 'Kinetic Grid',
	slug: 'kinetic-grid',
	category: 'layouts',
	description: 'GPU-accelerated grid layout with fluid wave propagation and proximity illumination.',
	version: '1.0.0',
	props: [
		{
			name: 'columns',
			label: 'Columns',
			type: 'number',
			defaultValue: 20,
			min: 5,
			max: 40,
			step: 1,
			description: 'Number of grid columns.',
		},
		{
			name: 'rows',
			label: 'Rows',
			type: 'number',
			defaultValue: 12,
			min: 3,
			max: 30,
			step: 1,
			description: 'Number of grid rows.',
		},
		{
			name: 'cellSize',
			label: 'Cell Size',
			type: 'number',
			defaultValue: 40,
			min: 10,
			max: 80,
			step: 5,
			description: 'Size of each cell in pixels.',
		},
		{
			name: 'glowColor',
			label: 'Glow Color',
			type: 'color',
			defaultValue: '#6366f1',
			description: 'Color of the cell illumination and wave effect.',
		},
		{
			name: 'waveOnClick',
			label: 'Wave On Click',
			type: 'boolean',
			defaultValue: true,
			description: 'Enable wave propagation on click.',
		},
		{
			name: 'proximityGlow',
			label: 'Proximity Glow',
			type: 'boolean',
			defaultValue: true,
			description: 'Illuminate cells near the pointer.',
		},
		{
			name: 'glowRadius',
			label: 'Glow Radius',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 8,
			step: 1,
			description: 'Influence radius in cells for pointer proximity glow.',
		},
	],
	defaultProps: {
		columns: 20,
		rows: 12,
		cellSize: 40,
		glowColor: '#6366f1',
		waveOnClick: true,
		proximityGlow: true,
		glowRadius: 3,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'kinetic-grid',
				name: 'Kinetic Grid',
				slug: 'kinetic-grid',
				category: 'layouts',
				pascalName: 'KineticGrid',
				snakeName: 'kinetic_grid',
				description: 'GPU-accelerated grid layout with fluid wave propagation and proximity illumination.',
				defaultTailwindClass: 'relative',
			},
			flavor,
			props,
			options
		);
	},
};
