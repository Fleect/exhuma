import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const textShimmerComponent: UniversalComponent = {
	id: 'text-shimmer',
	name: 'Text Shimmer',
	slug: 'text-shimmer',
	category: 'typography',
	description: 'High-performance GPU-composited text luminance sweep.',
	version: '1.0.0',
	props: [
		{
			name: 'children',
			label: 'Text',
			type: 'string',
			defaultValue: 'Exhuma Components',
			description: 'The text content to apply the shimmer effect to.',
		},
		{
			name: 'spread',
			label: 'Spread (%)',
			type: 'number',
			defaultValue: 20,
			min: 5,
			max: 60,
			step: 5,
			description: 'Width of the shimmer gradient band as a percentage.',
		},
		{
			name: 'duration',
			label: 'Duration (s)',
			type: 'number',
			defaultValue: 2.5,
			min: 0.5,
			max: 8.0,
			step: 0.5,
			description: 'Time in seconds to complete one shimmer sweep.',
		},
		{
			name: 'shimmerColor',
			label: 'Shimmer Color',
			type: 'color',
			defaultValue: '#ffffff',
			description: 'The bright color of the sweeping band.',
		},
		{
			name: 'baseTextColor',
			label: 'Base Color',
			type: 'color',
			defaultValue: '#4a4a6a',
			description: 'The base color of the text.',
		},
		{
			name: 'hoverAccelerate',
			label: 'Hover Accelerate',
			type: 'boolean',
			defaultValue: false,
			description: 'Whether to speed up the animation when hovered.',
		},
	],
	defaultProps: {
		children: 'Exhuma Components',
		spread: 20,
		duration: 2.5,
		shimmerColor: '#ffffff',
		baseTextColor: '#4a4a6a',
		hoverAccelerate: false,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'text-shimmer',
				name: 'Text Shimmer',
				slug: 'text-shimmer',
				category: 'typography',
				pascalName: 'TextShimmer',
				snakeName: 'text_shimmer',
				description: 'High-performance GPU-composited text luminance sweep.',
				defaultTailwindClass: 'inline-block font-medium tracking-tight',
			},
			flavor,
			props,
			options
		);
	},
};
