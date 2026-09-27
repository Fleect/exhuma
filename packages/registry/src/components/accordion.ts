import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const accordionComponent: UniversalComponent = {
	id: 'accordion',
	name: 'Accordion',
	slug: 'accordion',
	category: 'primitives',
	description: 'Zero-jank dynamic height disclosure using CSS Grid 0fr to 1fr interpolation with morphing plus/minus icon and clean theme elevation.',
	version: '1.0.0',
	props: [
		{
			name: 'mode',
			label: 'Expansion Mode',
			type: 'select',
			defaultValue: 'single',
			options: [
				{ label: 'Single Expand', value: 'single' },
				{ label: 'Multiple Expand', value: 'multiple' },
			],
			description: 'Single auto-collapses previous items; multiple allows independent toggles.',
		},
		{
			name: 'collapsible',
			label: 'Collapsible',
			type: 'boolean',
			defaultValue: true,
			description: 'In single mode, allows closing the currently expanded item.',
		},
		{
			name: 'gap',
			label: 'Item Gap (px)',
			type: 'number',
			defaultValue: 12,
			min: 0,
			max: 32,
			step: 4,
			description: 'Spacing between accordion items. 0 forms a seamless connected panel.',
		},
		{
			name: 'bordered',
			label: 'Bordered',
			type: 'boolean',
			defaultValue: true,
			description: 'Render items with crisp theme borders and active accent rings.',
		},
		{
			name: 'shadow',
			label: 'Shadow Elevation',
			type: 'boolean',
			defaultValue: true,
			description: 'Apply subtle depth shadow and hover elevation.',
		},
		{
			name: 'showNumbers',
			label: 'Index Badges',
			type: 'boolean',
			defaultValue: true,
			description: 'Display leading monospace index numbers (01, 02) before titles.',
		},
		{
			name: 'showIcon',
			label: 'Morphing Icon',
			type: 'boolean',
			defaultValue: true,
			description: 'Signature dual-bar kinetic plus/minus counter-rotating icon.',
		},
		{
			name: 'duration',
			label: 'Duration (ms)',
			type: 'number',
			defaultValue: 300,
			min: 150,
			max: 600,
			step: 50,
			description: 'CSS Grid height and icon rotation transition speed in milliseconds.',
		},
	],
	defaultProps: {
		mode: 'single',
		collapsible: true,
		gap: 12,
		bordered: true,
		shadow: true,
		showNumbers: true,
		showIcon: true,
		duration: 300,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'accordion',
				name: 'Accordion',
				slug: 'accordion',
				category: 'primitives',
				pascalName: 'Accordion',
				snakeName: 'accordion',
				description: 'Zero-jank dynamic height disclosure using CSS Grid 0fr to 1fr interpolation with morphing plus/minus icon.',
				defaultTailwindClass: 'w-full space-y-3',
				compoundParts: [
					{ name: 'Root', primitiveExport: 'AccordionRoot' },
					{ name: 'Item', primitiveExport: 'AccordionItem' },
					{ name: 'Trigger', primitiveExport: 'AccordionTrigger' },
					{ name: 'Icon', primitiveExport: 'AccordionIcon' },
					{ name: 'Content', primitiveExport: 'AccordionContent' },
				],
			},
			flavor,
			props,
			options
		);
	},
};
