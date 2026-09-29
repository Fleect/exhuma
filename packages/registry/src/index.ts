import { UniversalComponent } from './schema';
import { stackingCardsComponent } from './components/stacking-cards';
import { horizontalScrollerComponent } from './components/horizontal-scroller';
import { cssMasonryComponent } from './components/css-masonry';
import { autoGridComponent } from './components/auto-grid';
import { tiltCardComponent } from './components/tilt-card';
import { spotlightCardComponent } from './components/spotlight-card';
import { morphingTabsComponent } from './components/morphing-tabs';
import { accordionComponent } from './components/accordion';
import { infiniteMarqueeComponent } from './components/infinite-marquee';
import { bentoGridComponent } from './components/bento-grid';
import { diamondGridComponent } from './components/diamond-grid';
import { borderBeamComponent } from './components/border-beam';
import { floatingDockComponent } from './components/floating-dock';
import { numberTickerComponent } from './components/number-ticker';
import { magneticButtonComponent } from './components/magnetic-button';
import { cardSwipeStackComponent } from './components/card-swipe-stack';
import { comparisonSliderComponent } from './components/comparison-slider';
import { expandableCardComponent } from './components/expandable-card';
import { cursorTooltipComponent } from './components/cursor-tooltip';
import { shimmerButtonComponent } from './components/shimmer-button';
import { clickEffectsComponent } from './components/click-effects';
import { textScrambleComponent } from './components/text-scramble';
import { textShimmerComponent } from './components/text-shimmer';
import { confettiBurstComponent } from './components/confetti-burst';
import { drawerComponent } from './components/drawer';
import { hulyEffectComponent } from './components/huly-effect';
import { scratchCardComponent } from './components/scratch-card';
import { kineticGridComponent } from './components/kinetic-grid';
import { rowMasonryComponent } from './components/row-masonry';
import { particleFieldComponent } from './components/particle-field';

export * from './schema';
export { generateComponentUsage } from './templates/usage-generator';

export {
	stackingCardsComponent,
	horizontalScrollerComponent,
	cssMasonryComponent,
	autoGridComponent,
	tiltCardComponent,
	spotlightCardComponent,
	morphingTabsComponent,
	accordionComponent,
	infiniteMarqueeComponent,
	bentoGridComponent,
	diamondGridComponent,
	borderBeamComponent,
	floatingDockComponent,
	numberTickerComponent,
	magneticButtonComponent,
	cardSwipeStackComponent,
	comparisonSliderComponent,
	expandableCardComponent,
	cursorTooltipComponent,
	shimmerButtonComponent,
	clickEffectsComponent,
	textScrambleComponent,
	textShimmerComponent,
	confettiBurstComponent,
	drawerComponent,
	hulyEffectComponent,
	scratchCardComponent,
	kineticGridComponent,
	rowMasonryComponent,
	particleFieldComponent,
};

export const COMPONENT_REGISTRY: Record<string, UniversalComponent> = {
	'stacking-cards': stackingCardsComponent,
	'horizontal-scroller': horizontalScrollerComponent,
	'css-masonry': cssMasonryComponent,
	'auto-grid': autoGridComponent,
	'tilt-card': tiltCardComponent,
	'spotlight-card': spotlightCardComponent,
	'morphing-tabs': morphingTabsComponent,
	accordion: accordionComponent,
	'infinite-marquee': infiniteMarqueeComponent,
	'bento-grid': bentoGridComponent,
	'diamond-grid': diamondGridComponent,
	'border-beam': borderBeamComponent,
	'floating-dock': floatingDockComponent,
	'number-ticker': numberTickerComponent,
	'magnetic-button': magneticButtonComponent,
	'card-swipe-stack': cardSwipeStackComponent,
	'comparison-slider': comparisonSliderComponent,
	'expandable-card': expandableCardComponent,
	'cursor-tooltip': cursorTooltipComponent,
	'shimmer-button': shimmerButtonComponent,
	'click-effects': clickEffectsComponent,
	'text-scramble': textScrambleComponent,
	'text-shimmer': textShimmerComponent,
	'confetti-burst': confettiBurstComponent,
	drawer: drawerComponent,
	'huly-effect': hulyEffectComponent,
	'scratch-card': scratchCardComponent,
	'kinetic-grid': kineticGridComponent,
	'row-masonry': rowMasonryComponent,
	'particle-field': particleFieldComponent,
};

export const ALL_COMPONENTS: UniversalComponent[] = Object.values(COMPONENT_REGISTRY);
export const COMPONENT_COUNT = ALL_COMPONENTS.length;

export function getComponentBySlug(slug: string): UniversalComponent | undefined {
	return COMPONENT_REGISTRY[slug];
}

export function getComponentsByCategory(category: UniversalComponent['category']): UniversalComponent[] {
	return ALL_COMPONENTS.filter((c) => c.category === category);
}

export interface RegistryCategory {
	id: string;
	label: string;
	count: number;
}

export const CATEGORY_METADATA: Record<string, { label: string; order: number }> = {
	cards: { label: 'Tactile Cards & Interactions', order: 1 },
	layouts: { label: 'Responsive Layout Engines', order: 2 },
	navigation: { label: 'Navigation & Rails', order: 3 },
	primitives: { label: 'Kinetic Primitives & Disclosures', order: 4 },
	typography: { label: 'Wave A Typography Primitives', order: 5 },
};

/**
 * Dynamically computes categories and their live counts based on registered components.
 * Automatically synchronizes category counts without manual hardcoding.
 */
export function computeCategories(components: UniversalComponent[] = ALL_COMPONENTS): RegistryCategory[] {
	const definedCategories = Object.entries(CATEGORY_METADATA);
	const activeCategoryIds = new Set(components.map((comp) => comp.category));

	const categories: RegistryCategory[] = definedCategories.map(([id, meta]) => ({
		id,
		label: meta.label,
		count: components.filter((comp) => comp.category === id).length,
	}));

	for (const catId of activeCategoryIds) {
		if (!definedCategories.some(([id]) => id === catId)) {
			categories.push({
				id: catId,
				label: catId.charAt(0).toUpperCase() + catId.slice(1),
				count: components.filter((comp) => comp.category === catId).length,
			});
		}
	}

	return categories;
}

export const CATEGORIES: RegistryCategory[] = computeCategories();

/**
 * Helper to derive or extract dynamic categories from registry manifest index.json.
 */
export function getCategoriesFromManifest(manifest: { categories?: RegistryCategory[]; components?: Array<{ category: string }> }): RegistryCategory[] {
	if (manifest.categories && Array.isArray(manifest.categories)) {
		return manifest.categories;
	}
	if (manifest.components && Array.isArray(manifest.components)) {
		const counts: Record<string, number> = {};
		for (const comp of manifest.components) {
			counts[comp.category] = (counts[comp.category] ?? 0) + 1;
		}
		return Object.entries(counts).map(([id, count]) => ({
			id,
			label: CATEGORY_METADATA[id]?.label ?? id.charAt(0).toUpperCase() + id.slice(1),
			count,
		}));
	}
	return CATEGORIES;
}
