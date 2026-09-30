import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@exhuma/registry';
import { requiresCoreDependency } from '../../packages/cli/src/commands/add';

const expectedFiles: Record<
	EcosystemFlavor,
	{
		horizontal: string[];
		stacking: string[];
		tilt: string[];
		spotlight: string[];
		slider: string[];
		expandable: string[];
		swipe: string[];
	}
> = {
	react: {
		horizontal: ['HorizontalScroller.tsx'],
		stacking: ['StackingCards.tsx'],
		tilt: ['TiltCard.tsx'],
		spotlight: ['SpotlightCard.tsx'],
		slider: ['ComparisonSlider.tsx'],
		expandable: ['ExpandableCard.tsx'],
		swipe: ['CardSwipeStack.tsx'],
	},
	nextjs: {
		horizontal: ['HorizontalScroller.tsx'],
		stacking: ['StackingCards.tsx'],
		tilt: ['TiltCard.tsx'],
		spotlight: ['SpotlightCard.tsx'],
		slider: ['ComparisonSlider.tsx'],
		expandable: ['ExpandableCard.tsx'],
		swipe: ['CardSwipeStack.tsx'],
	},
	vue: {
		horizontal: ['HorizontalScroller.vue'],
		stacking: ['StackingCards.vue'],
		tilt: ['TiltCard.vue'],
		spotlight: ['SpotlightCard.vue'],
		slider: ['ComparisonSlider.vue'],
		expandable: ['ExpandableCard.vue'],
		swipe: ['CardSwipeStack.vue'],
	},
	svelte: {
		horizontal: ['HorizontalScroller.svelte'],
		stacking: ['StackingCards.svelte'],
		tilt: ['TiltCard.svelte'],
		spotlight: ['SpotlightCard.svelte'],
		slider: ['ComparisonSlider.svelte'],
		expandable: ['ExpandableCard.svelte'],
		swipe: ['CardSwipeStack.svelte'],
	},
	angular: {
		horizontal: ['horizontal-scroller.component.ts'],
		stacking: ['stacking-cards.component.ts'],
		tilt: ['tilt-card.component.ts'],
		spotlight: ['spotlight-card.component.ts'],
		slider: ['comparison-slider.component.ts'],
		expandable: ['expandable-card.component.ts'],
		swipe: ['card-swipe-stack.component.ts'],
	},
	solid: {
		horizontal: ['HorizontalScroller.tsx'],
		stacking: ['StackingCards.tsx'],
		tilt: ['TiltCard.tsx'],
		spotlight: ['SpotlightCard.tsx'],
		slider: ['ComparisonSlider.tsx'],
		expandable: ['ExpandableCard.tsx'],
		swipe: ['CardSwipeStack.tsx'],
	},
	astro: {
		horizontal: ['HorizontalScroller.astro'],
		stacking: ['StackingCards.astro'],
		tilt: ['TiltCard.astro'],
		spotlight: ['SpotlightCard.astro'],
		slider: ['ComparisonSlider.astro'],
		expandable: ['ExpandableCard.astro'],
		swipe: ['CardSwipeStack.astro'],
	},
	blade: {
		horizontal: ['horizontal-scroller.blade.php'],
		stacking: ['stacking-cards.blade.php'],
		tilt: ['tilt-card.blade.php'],
		spotlight: ['spotlight-card.blade.php'],
		slider: ['comparison-slider.blade.php'],
		expandable: ['expandable-card.blade.php'],
		swipe: ['card-swipe-stack.blade.php'],
	},
	vanilla: {
		horizontal: ['horizontal-scroller.vanilla.js'],
		stacking: ['stacking-cards.vanilla.js'],
		tilt: ['tilt-card.vanilla.js'],
		spotlight: ['spotlight-card.vanilla.js'],
		slider: ['comparison-slider.vanilla.js'],
		expandable: ['expandable-card.vanilla.js'],
		swipe: ['card-swipe-stack.vanilla.js'],
	},
	wordpress: {
		horizontal: ['block.json', 'render.php'],
		stacking: ['block.json', 'render.php'],
		tilt: ['block.json', 'render.php'],
		spotlight: ['block.json', 'render.php'],
		slider: ['block.json', 'render.php'],
		expandable: ['block.json', 'render.php'],
		swipe: ['block.json', 'render.php'],
	},
	webcomponent: {
		horizontal: ['exhuma-horizontal-scroller.js'],
		stacking: ['exhuma-stacking-cards.js'],
		tilt: ['exhuma-tilt-card.js'],
		spotlight: ['exhuma-spotlight-card.js'],
		slider: ['exhuma-comparison-slider.js'],
		expandable: ['exhuma-expandable-card.js'],
		swipe: ['exhuma-card-swipe-stack.js'],
	},
	'react-native': {
		horizontal: ['HorizontalScroller.tsx'],
		stacking: ['StackingCards.tsx'],
		tilt: ['TiltCard.tsx'],
		spotlight: ['SpotlightCard.tsx'],
		slider: ['ComparisonSlider.tsx'],
		expandable: ['ExpandableCard.tsx'],
		swipe: ['CardSwipeStack.tsx'],
	},
	flutter: {
		horizontal: ['horizontal_scroller.dart'],
		stacking: ['stacking_cards.dart'],
		tilt: ['tilt_card.dart'],
		spotlight: ['spotlight_card.dart'],
		slider: ['comparison_slider.dart'],
		expandable: ['expandable_card.dart'],
		swipe: ['card_swipe_stack.dart'],
	},
};

describe('kinetic cards ecosystem parity', () => {
	const horizontalScrollerComponent = getComponentBySlug('horizontal-scroller');
	const stackingCardsComponent = getComponentBySlug('stacking-cards');
	const tiltCardComponent = getComponentBySlug('tilt-card');
	const spotlightCardComponent = getComponentBySlug('spotlight-card');
	const comparisonSliderComponent = getComponentBySlug('comparison-slider');
	const expandableCardComponent = getComponentBySlug('expandable-card');
	const cardSwipeStackComponent = getComponentBySlug('card-swipe-stack');

	if (
		!horizontalScrollerComponent ||
		!stackingCardsComponent ||
		!tiltCardComponent ||
		!spotlightCardComponent ||
		!comparisonSliderComponent ||
		!expandableCardComponent ||
		!cardSwipeStackComponent
	) {
		throw new Error('Kinetic card components must be registered');
	}

	for (const flavor of SUPPORTED_ECOSYSTEMS) {
		it(`generates the expected source payloads for ${flavor}`, () => {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true });
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true });
			const tilt = tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps, { eject: true });
			const spotlight = spotlightCardComponent.generateCode(flavor, spotlightCardComponent.defaultProps, { eject: true });
			const slider = comparisonSliderComponent.generateCode(flavor, comparisonSliderComponent.defaultProps, { eject: true });
			const expandable = expandableCardComponent.generateCode(flavor, expandableCardComponent.defaultProps, { eject: true });
			const swipe = cardSwipeStackComponent.generateCode(flavor, cardSwipeStackComponent.defaultProps, { eject: true });

			expect(horizontal.map((file) => file.filename)).toEqual(expectedFiles[flavor].horizontal);
			expect(stacking.map((file) => file.filename)).toEqual(expectedFiles[flavor].stacking);
			expect(tilt.map((file) => file.filename)).toEqual(expectedFiles[flavor].tilt);
			expect(spotlight.map((file) => file.filename)).toEqual(expectedFiles[flavor].spotlight);
			expect(slider.map((file) => file.filename)).toEqual(expectedFiles[flavor].slider);
			expect(expandable.map((file) => file.filename)).toEqual(expectedFiles[flavor].expandable);
			expect(swipe.map((file) => file.filename)).toEqual(expectedFiles[flavor].swipe);

			for (const file of [...horizontal, ...stacking, ...tilt, ...spotlight, ...slider, ...expandable, ...swipe]) {
				expect(file.code.trim().length).toBeGreaterThan(100);
			}
		});
	}

	it('keeps the kinetic browser engines frame-coalesced and lifecycle-safe', () => {
		for (const flavor of ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'webcomponent'] as const) {
			const horizontal = horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const stacking = stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const tilt = tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const spotlight = spotlightCardComponent.generateCode(flavor, spotlightCardComponent.defaultProps, { eject: true })[0]?.code ?? '';
			const slider = comparisonSliderComponent.generateCode(flavor, comparisonSliderComponent.defaultProps, { eject: true })[0]?.code ?? '';

			expect(horizontal).toMatch(/requestAnimationFrame/);
			expect(horizontal).toMatch(/cancelAnimationFrame/);
			expect(stacking).toMatch(/requestAnimationFrame/);
			expect(stacking).toMatch(/cancelAnimationFrame/);
			expect(tilt).toMatch(/requestAnimationFrame/);
			expect(tilt).toMatch(/cancelAnimationFrame/);
			expect(spotlight).toMatch(/requestAnimationFrame/);
			expect(spotlight).toMatch(/cancelAnimationFrame/);
			expect(slider).toMatch(/clipPath|clip-path/i);
		}
	});

	it('keeps non-React framework sources independent from @exhuma/core', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((candidate) => candidate !== 'react' && candidate !== 'nextjs')) {
			const files = [
				...horizontalScrollerComponent.generateCode(flavor, horizontalScrollerComponent.defaultProps),
				...stackingCardsComponent.generateCode(flavor, stackingCardsComponent.defaultProps),
				...tiltCardComponent.generateCode(flavor, tiltCardComponent.defaultProps),
				...spotlightCardComponent.generateCode(flavor, spotlightCardComponent.defaultProps),
				...comparisonSliderComponent.generateCode(flavor, comparisonSliderComponent.defaultProps),
				...expandableCardComponent.generateCode(flavor, expandableCardComponent.defaultProps),
				...cardSwipeStackComponent.generateCode(flavor, cardSwipeStackComponent.defaultProps),
			];
			for (const file of files) expect(file.code).not.toContain('@exhuma/core');
			expect(horizontalScrollerComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(stackingCardsComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(tiltCardComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(spotlightCardComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(comparisonSliderComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(expandableCardComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
			expect(cardSwipeStackComponent.dependencies?.[flavor] ?? []).not.toContain('@exhuma/core');
		}
	});

	it('keeps published kinetic registry artifacts synchronized with source generation', () => {
		for (const component of [
			horizontalScrollerComponent,
			stackingCardsComponent,
			tiltCardComponent,
			spotlightCardComponent,
			comparisonSliderComponent,
			expandableCardComponent,
			cardSwipeStackComponent,
		]) {
			const artifactPath = resolve(process.cwd(), 'apps/showcase/public/registry', `${component.slug}.json`);
			const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as { flavors: Record<EcosystemFlavor, Array<{ filename: string; code: string }>> };
			for (const flavor of SUPPORTED_ECOSYSTEMS) {
				expect(artifact.flavors[flavor]).toEqual(component.generateCode(flavor, component.defaultProps));
			}
		}
	});

	it('installs @exhuma/core only for React-based web flavors', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(requiresCoreDependency(flavor)).toBe(flavor === 'react' || flavor === 'nextjs');
		}
	});
});
