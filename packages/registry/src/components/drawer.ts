import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const drawerComponent: UniversalComponent = {
	id: 'drawer',
	name: 'Drawer',
	slug: 'drawer',
	category: 'interactive',
	description: 'A kinetic drawer component with O(1) rubber-banding and flick dismiss physics. Uses EKM to bypass React layout for ultra-smooth 120hz interaction.',
	version: '1.0.0',
	props: [
		{
			name: 'backdropOpacity',
			label: 'Backdrop Opacity',
			type: 'number',
			defaultValue: 0.5,
			min: 0,
			max: 1,
			step: 0.1,
			description: 'Maximum opacity of the backdrop overlay.',
		},
		{
			name: 'backdropBlur',
			label: 'Backdrop Blur',
			type: 'boolean',
			defaultValue: false,
			description: 'Whether to apply a blur effect to the backdrop.',
		},
		{
			name: 'dismissThreshold',
			label: 'Dismiss Threshold (px/s)',
			type: 'number',
			defaultValue: 400,
			min: 100,
			max: 1000,
			step: 50,
			description: 'Flick velocity required to dismiss the drawer.',
		},
	],
	defaultProps: {
		backdropOpacity: 0.5,
		backdropBlur: false,
		dismissThreshold: 400,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'drawer',
				name: 'Drawer',
				slug: 'drawer',
				category: 'interactive',
				pascalName: 'Drawer',
				snakeName: 'drawer',
				description: 'Kinetic drawer component with O(1) rubber-banding and flick physics.',
				defaultTailwindClass: 'w-full max-h-[90vh]',
			},
			flavor,
			props,
			options
		);
	},
};
