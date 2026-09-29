import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const morphingTabsComponent: UniversalComponent = {
	id: 'morphing-tabs',
	name: 'Morphing Tabs',
	slug: 'morphing-tabs',
	category: 'navigation',
	description: 'Dynamic active rect geometry tracking with a floating spring indicator and roving focus keyboard navigation.',
	version: '1.0.0',
	props: [
		{
			name: 'springStiffness',
			label: 'Spring Stiffness (omega)',
			type: 'number',
			defaultValue: 26,
			min: 10,
			max: 50,
			step: 2,
			description: 'Natural angular frequency (omega) of the critically damped spring ODE.',
		},
		{
			name: 'variant',
			label: 'Indicator Variant',
			type: 'select',
			options: [
				{ label: 'Pill (Default)', value: 'pill' },
				{ label: 'Minimal Underline', value: 'underline' },
				{ label: 'Neon Glow', value: 'glow' },
			],
			defaultValue: 'pill',
			description: 'Visual style and geometry of the kinetic morphing indicator.',
		},
		{
			name: 'size',
			label: 'Tab Size',
			type: 'select',
			options: [
				{ label: 'Small (sm)', value: 'sm' },
				{ label: 'Medium (md)', value: 'md' },
				{ label: 'Large (lg)', value: 'lg' },
			],
			defaultValue: 'md',
			description: 'Padding and typographic scale of tab trigger buttons.',
		},
		{
			name: 'liquidStretch',
			label: 'Liquid Stretch',
			type: 'boolean',
			defaultValue: false,
			description: 'Volume-preserving liquid pill stretch during transitions.',
		},
	],
	defaultProps: {
		springStiffness: 26,
		variant: 'pill',
		size: 'md',
		liquidStretch: false,
	},
	dependencies: CORE_COMPONENT_DEPENDENCIES,
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
		return generateOuterLayerFiles(
			{
				id: 'morphing-tabs',
				name: 'Morphing Tabs',
				slug: 'morphing-tabs',
				category: 'navigation',
				pascalName: 'MorphingTabs',
				snakeName: 'morphing_tabs',
				description: 'Dynamic active rect geometry tracking with a floating spring indicator and roving focus.',
				defaultTailwindClass: 'relative flex items-center gap-1 rounded-2xl border border-border bg-muted/40 p-1.5 shadow-sm',
				compoundParts: [
					{ name: 'TabsRoot', primitiveExport: 'TabsRoot', defaultClass: 'flex flex-col' },
					{
						name: 'TabsList',
						primitiveExport: 'TabsList',
						defaultClass: 'relative flex items-center gap-1 rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm',
					},
					{ name: 'TabsIndicator', primitiveExport: 'TabsIndicator', defaultClass: 'pointer-events-none absolute top-0 left-0 rounded-xl bg-white shadow-sm dark:bg-neutral-800' },
					{
						name: 'TabsTrigger',
						primitiveExport: 'TabsTrigger',
						defaultClass: 'relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl',
					},
					{ name: 'TabsContent', primitiveExport: 'TabsContent', defaultClass: 'mt-4 focus-visible:outline-none' },
				],
			},
			flavor,
			props,
			options
		);
	},
};
