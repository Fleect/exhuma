import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const tiltCardComponent: UniversalComponent = {
	id: 'tilt-card',
	name: 'Tilt Card',
	slug: 'tilt-card',
	category: 'cards',
	description: 'Interactive 3D mouse-tracking card tilt with smooth gyroscopic physics, spring damping, and reverse mode.',
	version: '1.0.0',
	props: [
		{
			name: 'maxTilt',
			label: 'Max Tilt (deg)',
			type: 'number',
			defaultValue: 15,
			min: 5,
			max: 45,
			step: 1,
			description: 'Maximum 3D tilt rotation in degrees at card boundary edges.',
		},
		{
			name: 'perspective',
			label: 'Perspective (px)',
			type: 'number',
			defaultValue: 1000,
			min: 500,
			max: 2000,
			step: 100,
			description: '3D perspective projection depth in pixels (lower = stronger foreshortening).',
		},
		{
			name: 'scale',
			label: 'Hover Scale',
			type: 'number',
			defaultValue: 1.02,
			min: 1.0,
			max: 1.15,
			step: 0.01,
			description: 'Card scale multiplier applied on pointer hover.',
		},
		{
			name: 'speed',
			label: 'Damping Speed',
			type: 'number',
			defaultValue: 0.12,
			min: 0.05,
			max: 0.3,
			step: 0.01,
			description: 'Kinetic spring lerp damping factor (higher = snappier, lower = smoother glide).',
		},
		{
			name: 'reverse',
			label: 'Reverse Tilt',
			type: 'boolean',
			defaultValue: false,
			description: 'Invert tilt direction (tilts towards cursor instead of sinking away).',
		},
		{
			name: 'disabled',
			label: 'Disabled',
			type: 'boolean',
			defaultValue: false,
			description: 'Programmatically disable 3D tilt tracking.',
		},
		{
			name: 'axis',
			label: 'Tilt Axis',
			type: 'select',
			defaultValue: 'all',
			options: [
				{ label: 'Full 3D Tilt (all)', value: 'all' },
				{ label: 'Pitch Only / X-Axis (x)', value: 'x' },
				{ label: 'Yaw Only / Y-Axis (y)', value: 'y' },
			],
			description: 'Constrain tilt rotation axis (all = 3D pitch+yaw, x = pitch only, y = yaw only).',
		},
	],
	defaultProps: {
		maxTilt: 15,
		perspective: 1000,
		scale: 1.02,
		speed: 0.12,
		reverse: false,
		disabled: false,
		axis: 'all',
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'tilt-card',
				name: 'Tilt Card',
				slug: 'tilt-card',
				category: 'cards',
				pascalName: 'TiltCard',
				snakeName: 'tilt_card',
				description: 'Interactive 3D mouse-tracking card tilt with smooth gyroscopic physics, spring damping, and reverse mode.',
				defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md will-change-transform',
			},
			flavor,
			props,
			options
		);
	},
};
