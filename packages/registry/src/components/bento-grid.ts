import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const bentoGridComponent: UniversalComponent = {
	id: 'bento-grid',
	name: 'Bento Grid',
	slug: 'bento-grid',
	category: 'layouts',
	description: 'Fluid responsive layout engine with dense auto-flow, asymmetric card spans, and subtle kinetic hover glow.',
	version: '1.0.0',
	props: [
		{
			name: 'cols',
			label: 'Columns',
			type: 'number',
			defaultValue: 3,
			min: 1,
			max: 6,
			step: 1,
			description: 'Maximum column count for desktop screens.',
		},
		{
			name: 'gap',
			label: 'Grid Gap (px)',
			type: 'number',
			defaultValue: 20,
			min: 8,
			max: 64,
			step: 4,
			description: 'Spacing between bento tiles.',
		},
		{
			name: 'rowHeight',
			label: 'Row Height (px)',
			type: 'number',
			defaultValue: 180,
			min: 100,
			max: 320,
			step: 10,
			description: 'Base auto-rows track height for vertical spans.',
		},
	],
	defaultProps: {
		cols: 3,
		gap: 20,
		rowHeight: 180,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'bento-grid',
				name: 'Bento Grid',
				slug: 'bento-grid',
				category: 'layouts',
				pascalName: 'BentoGrid',
				snakeName: 'bento_grid',
				description: 'Fluid responsive layout engine with dense auto-flow and asymmetric spans.',
				defaultTailwindClass: 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[22rem] max-w-7xl mx-auto w-full',
				compoundParts: [
					{ name: 'BentoCard', primitiveExport: 'BentoCard', defaultClass: '' },
					{ name: 'BentoHeader', primitiveExport: 'BentoHeader', defaultClass: '' },
					{ name: 'BentoContent', primitiveExport: 'BentoContent', defaultClass: '' },
					{ name: 'BentoVisual', primitiveExport: 'BentoVisual', defaultClass: '' },
				],
			},
			flavor,
			props,
			options
		);
	},
};
