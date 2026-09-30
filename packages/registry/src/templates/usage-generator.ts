import { ComponentFilePayload, EcosystemFlavor, UniversalComponent } from '../schema';
import { getStackingCardsUsage } from './generators/stacking-cards-generator';
import { getHorizontalScrollerUsage } from './generators/horizontal-scroller-generator';
import { getTiltCardUsage } from './generators/tilt-card-generator';
import { getSpotlightCardUsage } from './generators/spotlight-card-generator';
import { getBorderBeamUsage } from './generators/border-beam-generator';
import { getCardSwipeStackUsage } from './generators/card-swipe-stack-generator';
import { getComparisonSliderUsage } from './generators/comparison-slider-generator';
import { getExpandableCardUsage } from './generators/expandable-card-generator';
import { getAutoGridUsage } from './generators/auto-grid-generator';
import { getCssMasonryUsage } from './generators/css-masonry-generator';
import { getRowMasonryUsage } from './generators/row-masonry-generator';
import { getInfiniteMarqueeUsage } from './generators/infinite-marquee-generator';

import { getBentoGridUsage } from './generators/bento-grid-generator';
import { getDiamondGridUsage } from './generators/diamond-grid-generator';
import { getMorphingTabsUsage } from './generators/morphing-tabs-generator';
import { getFloatingDockUsage } from './generators/floating-dock-generator';
import { getAccordionUsage } from './generators/accordion-generator';
import { getNumberTickerUsage } from './generators/number-ticker-generator';
import { getMagneticButtonUsage } from './generators/magnetic-button-generator';
import { getCursorTooltipUsage } from './generators/cursor-tooltip-generator';

/**
 * Generates a complete, production-ready usage example for a component across all 13 supported ecosystems.
 * Dynamically injects the active workbench property values.
 */
export function generateComponentUsage(component: UniversalComponent, flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const slug = component.slug;

	if (slug === 'stacking-cards') {
		return getStackingCardsUsage(flavor, props);
	}

	if (slug === 'horizontal-scroller') {
		return getHorizontalScrollerUsage(flavor, props);
	}

	if (slug === 'infinite-marquee') {
		return getInfiniteMarqueeUsage(flavor, props);
	}

	if (slug === 'tilt-card') {
		return getTiltCardUsage(flavor, props);
	}

	if (slug === 'spotlight-card') {
		return getSpotlightCardUsage(flavor, props);
	}

	if (slug === 'border-beam') {
		return getBorderBeamUsage(flavor, props);
	}

	if (slug === 'card-swipe-stack') {
		return getCardSwipeStackUsage(flavor, props);
	}

	if (slug === 'comparison-slider') {
		return getComparisonSliderUsage(flavor, props);
	}

	if (slug === 'expandable-card') {
		return getExpandableCardUsage(flavor, props);
	}

	if (slug === 'auto-grid') {
		return getAutoGridUsage(flavor, props);
	}

	if (slug === 'css-masonry') {
		return getCssMasonryUsage(flavor, props);
	}

	if (slug === 'row-masonry') {
		return getRowMasonryUsage(flavor, props);
	}

	if (slug === 'bento-grid') {
		return getBentoGridUsage(flavor, props);
	}

	if (slug === 'diamond-grid') {
		return getDiamondGridUsage(flavor, props);
	}

	if (slug === 'morphing-tabs') {
		return getMorphingTabsUsage(flavor, props);
	}

	if (slug === 'floating-dock') {
		return getFloatingDockUsage(flavor, props);
	}

	if (slug === 'accordion') {
		return getAccordionUsage(flavor, props);
	}

	if (slug === 'number-ticker') {
		return getNumberTickerUsage(flavor, props);
	}

	if (slug === 'magnetic-button') {
		return getMagneticButtonUsage(flavor, props);
	}

	if (slug === 'cursor-tooltip') {
		return getCursorTooltipUsage(flavor, props);
	}

	return getGenericComponentUsage(component, flavor, props);
}

function getGenericComponentUsage(component: UniversalComponent, flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const pascalName = component.name.replace(/\s+/g, '');
	const slug = component.slug;

	const propEntries = Object.entries(props)
		.map(([key, val]) => {
			if (typeof val === 'number') return `${key}={${val}}`;
			if (typeof val === 'boolean') return val ? key : `${key}={false}`;
			if (typeof val === 'string') return `${key}="${val}"`;
			return null;
		})
		.filter(Boolean)
		.join(' ');

	const jsxProps = propEntries ? ` ${propEntries}` : '';

	switch (flavor) {
		case 'nextjs':
		case 'react':
			return {
				filename: flavor === 'nextjs' ? 'page.tsx' : 'Example.tsx',
				language: 'tsx',
				description: `${component.name} consumption in React / Next.js.`,
				code: `${flavor === 'nextjs' ? "'use client';\n\n" : ''}import React from 'react';
import { ${pascalName} } from '@/components/ui/${pascalName}';

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <${pascalName}${jsxProps}>
        <div className="p-6 text-foreground">
          <h3 className="text-xl font-bold">${component.name} Content</h3>
          <p className="text-sm text-muted-foreground mt-2">${component.description}</p>
        </div>
      </${pascalName}>
    </div>
  );
}
`,
			};

		case 'vue':
			return {
				filename: 'App.vue',
				language: 'vue',
				description: `${component.name} consumption in Vue 3.`,
				code: `<script setup lang="ts">
import ${pascalName} from '@/components/ui/${pascalName}.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <${pascalName}>
      <div class="p-6 text-foreground">
        <h3 class="text-xl font-bold">${component.name}</h3>
        <p class="text-sm text-muted-foreground mt-2">${component.description}</p>
      </div>
    </${pascalName}>
  </div>
</template>
`,
			};

		case 'svelte':
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: `${component.name} consumption in Svelte 5.`,
				code: `<script lang="ts">
  import ${pascalName} from '$lib/components/${pascalName}.svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <${pascalName}>
    <div class="p-6 text-foreground">
      <h3 class="text-xl font-bold">${component.name}</h3>
      <p class="text-sm text-muted-foreground mt-2">${component.description}</p>
    </div>
  </${pascalName}>
</div>
`,
			};

		default:
			return {
				filename: 'Example.tsx',
				language: 'tsx',
				description: `${component.name} generic usage.`,
				code: `// ${component.name} usage for ${flavor}\nimport { ${pascalName} } from '@/components/ui/${pascalName}';\n`,
			};
	}
}
