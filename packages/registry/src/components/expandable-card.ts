import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const expandableCardComponent: UniversalComponent = {
	id: 'expandable-card',
	name: 'Expandable Card',
	slug: 'expandable-card',
	category: 'cards',
	description: 'Mathematical FLIP morphing card dialog with zero Framer Motion dependencies, zero layout shifts, and accessible dialog semantics.',
	version: '1.0.0',
	props: [
		{
			name: 'duration',
			label: 'Morph Duration (ms)',
			type: 'number',
			defaultValue: 360,
			min: 150,
			max: 600,
			step: 20,
			description: 'FLIP transition timing in milliseconds.',
		},
	],
	defaultProps: {
		duration: 360,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'expandable-card',
				name: 'Expandable Card',
				slug: 'expandable-card',
				category: 'cards',
				pascalName: 'ExpandableCard',
				snakeName: 'expandable_card',
				description: 'Mathematical FLIP morphing card dialog with zero layout shifts.',
				defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer',
				compoundParts: [
					{ name: 'ExpandableRoot', primitiveExport: 'Root' },
					{ name: 'ExpandableTrigger', primitiveExport: 'Trigger' },
					{ name: 'ExpandableContent', primitiveExport: 'Content' },
					{ name: 'ExpandableClose', primitiveExport: 'Close' },
				],
			},
			flavor,
			props,
			options
		);
	},
};
