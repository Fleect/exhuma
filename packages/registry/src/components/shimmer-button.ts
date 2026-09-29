import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const shimmerButtonComponent: UniversalComponent = {
	id: 'shimmer-button',
	name: 'Shimmer Button',
	slug: 'shimmer-button',
	category: 'buttons',
	description: 'High-converting CTA button with a rotating conic perimeter laser glow and tactile spring press physics — composited via CSS custom properties at Ω(120Hz) with zero layout reflow.',
	version: '1.0.0',
	props: [
		{
			name: 'shimmerColor',
			label: 'Shimmer Color',
			type: 'color',
			defaultValue: '#ffffff',
			description: 'Color of the rotating perimeter glow arc.',
		},
		{
			name: 'shimmerSize',
			label: 'Glow Arc Width (°)',
			type: 'number',
			defaultValue: 20,
			min: 5,
			max: 90,
			step: 5,
			description: 'Angular width of the shimmer arc in degrees.',
		},
		{
			name: 'shimmerSpeed',
			label: 'Rotation Speed (RPM)',
			type: 'number',
			defaultValue: 30,
			min: 5,
			max: 120,
			step: 5,
			description: 'Rotations per minute of the perimeter glow.',
		},
		{
			name: 'backgroundColor',
			label: 'Button Background',
			type: 'color',
			defaultValue: '#000000',
			description: 'Solid fill color of the inner button surface.',
		},
		{
			name: 'borderRadius',
			label: 'Border Radius',
			type: 'string',
			defaultValue: '8px',
			description: 'CSS border-radius of the button (e.g. "8px", "100px").',
		},
		{
			name: 'borderWidth',
			label: 'Border Width (px)',
			type: 'number',
			defaultValue: 1,
			min: 1,
			max: 4,
			step: 1,
			description: 'Pixel width of the glowing perimeter border.',
		},
		{
			name: 'tactilePress',
			label: 'Tactile Press',
			type: 'boolean',
			defaultValue: true,
			description: 'Apply spring scale compression on pointer press.',
		},
	],
	defaultProps: {
		shimmerColor: '#ffffff',
		shimmerSize: 20,
		shimmerSpeed: 30,
		backgroundColor: '#000000',
		borderRadius: '8px',
		borderWidth: 1,
		tactilePress: true,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'shimmer-button',
				name: 'Shimmer Button',
				slug: 'shimmer-button',
				category: 'buttons',
				pascalName: 'ShimmerButton',
				snakeName: 'shimmer_button',
				description: 'Rotating conic perimeter laser glow button with tactile press physics.',
				defaultTailwindClass: 'px-6 py-2.5 text-sm font-semibold text-white',
			},
			flavor,
			props,
			options
		);
	},
};
