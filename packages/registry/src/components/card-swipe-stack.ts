import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const cardSwipeStackComponent: UniversalComponent = {
	id: 'card-swipe-stack',
	name: 'Card Swipe Stack',
	slug: 'card-swipe-stack',
	category: 'cards',
	description: 'Velocity-sensitive multi-card swipe stack with Euler angular rotation, circular velocity ring buffer, elastic last-card resistance, and zero external animation libraries.',
	version: '1.0.0',
	props: [
		{
			name: 'thresholdDistance',
			label: 'Swipe Threshold (px)',
			type: 'number',
			defaultValue: 120,
			min: 60,
			max: 240,
			step: 10,
			description: 'Minimum drag distance to trigger a card dismiss.',
		},
		{
			name: 'maxRotation',
			label: 'Max Rotation (deg)',
			type: 'number',
			defaultValue: 20,
			min: 5,
			max: 45,
			step: 1,
			description: 'Maximum angular rotation coupled to horizontal translation.',
		},
		{
			name: 'scaleStep',
			label: 'Scale Step',
			type: 'number',
			defaultValue: 0.05,
			min: 0.02,
			max: 0.1,
			step: 0.01,
			description: 'Scale reduction step between consecutive cards in the stack.',
		},
		{
			name: 'offsetStep',
			label: 'Offset Step (px)',
			type: 'number',
			defaultValue: 14,
			min: 4,
			max: 32,
			step: 2,
			description: 'Vertical offset in pixels between consecutive cards in the stack.',
		},
		{
			name: 'preventLastCardDismiss',
			label: 'Anchor Last Card',
			type: 'boolean',
			defaultValue: true,
			description: 'When enabled, the final card cannot be dismissed. Dragging it applies elastic rubber-band resistance and it snaps back to center on release.',
		},
		{
			name: 'loop',
			label: 'Loop (Infinite Deck)',
			type: 'boolean',
			defaultValue: false,
			description: 'Infinite deck recycling: swiped cards smoothly swoop under the deck back to the bottom of the stack.',
		},
	],
	defaultProps: {
		thresholdDistance: 120,
		maxRotation: 20,
		scaleStep: 0.05,
		offsetStep: 14,
		preventLastCardDismiss: true,
		loop: false,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'card-swipe-stack',
				name: 'Card Swipe Stack',
				slug: 'card-swipe-stack',
				category: 'cards',
				pascalName: 'CardSwipeStack',
				snakeName: 'card_swipe_stack',
				description: 'Velocity-sensitive multi-card swipe stack with Euler angular rotation.',
				defaultTailwindClass: 'relative flex items-center justify-center min-h-[14.5rem] w-full',
			},
			flavor,
			props,
			options
		);
	},
};
