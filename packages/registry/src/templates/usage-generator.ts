import { ComponentFilePayload, EcosystemFlavor, UniversalComponent } from '../schema';
import { getAutoGridUsage } from './generators/auto-grid-generator';
import { getCssMasonryUsage } from './generators/css-masonry-generator';
import { getInfiniteMarqueeUsage } from './generators/infinite-marquee-generator';
import { getBentoGridUsage } from './generators/bento-grid-generator';
import { getDiamondGridUsage } from './generators/diamond-grid-generator';
import { getMorphingTabsUsage } from './generators/morphing-tabs-generator';

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

	if (slug === 'bento-grid') {
		return getBentoGridUsage(flavor, props);
	}

	if (slug === 'diamond-grid') {
		return getDiamondGridUsage(flavor, props);
	}

	if (slug === 'morphing-tabs') {
		return getMorphingTabsUsage(flavor, props);
	}

	return getGenericComponentUsage(component, flavor, props);
}

function getStackingCardsUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const topStart = Number(props.topStart ?? 20);
	const topIncrement = Number(props.topIncrement ?? 28);
	const cardGap = Number(props.cardGap ?? 20);
	const scaleThreshold = Number(props.scaleThreshold ?? 150);
	const minScale = Number(props.minScale ?? 0.9);
	const reverseScale = props.reverseScale !== false;

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) features page with StackingCards.',
				code: `'use client';

import React from 'react';
import { StackingCards } from '@/components/ui/StackingCards';

const CARDS = [
  {
    tag: '01 / ARCHITECTURE',
    title: 'Kinetic Performance Engine',
    desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync refresh with zero layout thrashing.',
    badge: '120 FPS',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/30',
  },
  {
    tag: '02 / MEMORY',
    title: 'Zero-Allocation Pipeline',
    desc: 'Persistent Float64Array typed buffers eliminating garbage collection pauses during scroll.',
    badge: 'Ω(1) HEAP',
    gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    border: 'border-blue-500/30',
  },
  {
    tag: '03 / ACCELERATION',
    title: 'Sub-Pixel Delta Clamping',
    desc: 'Hardware compositor layer promotion with deadband skipping for static cards.',
    badge: 'GPU ACCEL',
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    border: 'border-purple-500/30',
  },
  {
    tag: '04 / MOTION',
    title: 'Tiered Reverse Cascade',
    desc: 'Continuous C1 Hermite smoothstep cascade scaling as the stack crowns the viewport.',
    badge: 'HERMITE C1',
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    border: 'border-amber-500/30',
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-[200vh] py-24 px-4 bg-background text-foreground">
      <div className="max-w-2xl mx-auto mb-16 text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-emerald-500 uppercase">
          Tactile Physics
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mt-2 sm:text-5xl">
          Kinetic Stacking Cards
        </h1>
        <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto leading-relaxed">
          Scroll down to experience the calibrated 3D depth decay, sticky echelon progression, and reverse scaling exit cascade.
        </p>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        className="max-w-2xl mx-auto"
      >
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            className={\`rounded-2xl border \${card.border} bg-card/90 p-8 shadow-lg backdrop-blur-md bg-gradient-to-b \${card.gradient} min-h-[220px] flex flex-col justify-between\`}
          >
            <div>
              <span className="font-mono text-xs font-semibold text-muted-foreground tracking-wider">
                {card.tag}
              </span>
              <h2 className="text-2xl font-bold mt-2">{card.title}</h2>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>EXHUMA EKM</span>
              <span className="font-bold text-emerald-500">{card.badge}</span>
            </div>
          </div>
        ))}
      </StackingCards>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'FeaturesSection.tsx',
				language: 'tsx',
				description: 'React component rendering StackingCards with custom feature cards.',
				code: `import React from 'react';
import { StackingCards } from '@/components/ui/StackingCards';

const CARDS = [
  {
    tag: '01 / ARCHITECTURE',
    title: 'Kinetic Performance Engine',
    desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync refresh with zero layout thrashing.',
    badge: '120 FPS',
  },
  {
    tag: '02 / MEMORY',
    title: 'Zero-Allocation Pipeline',
    desc: 'Persistent Float64Array typed buffers eliminating garbage collection pauses during scroll.',
    badge: 'Ω(1) HEAP',
  },
  {
    tag: '03 / ACCELERATION',
    title: 'Sub-Pixel Delta Clamping',
    desc: 'Hardware compositor layer promotion with deadband skipping for static cards.',
    badge: 'GPU ACCEL',
  },
  {
    tag: '04 / MOTION',
    title: 'Tiered Reverse Cascade',
    desc: 'Continuous C1 Hermite smoothstep cascade scaling as the stack crowns the viewport.',
    badge: 'HERMITE C1',
  },
];

export function FeaturesSection() {
  return (
    <section className="min-h-[180vh] py-20 px-4 bg-background text-foreground">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-bold">Kinetic Stacking Architecture</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Scroll down to experience depth decay scaling and reverse exit mechanics.
        </p>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        className="max-w-2xl mx-auto"
      >
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg backdrop-blur-md min-h-[220px] flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {card.tag}
              </span>
              <h3 className="text-2xl font-bold mt-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>EXHUMA EKM</span>
              <span className="font-bold text-emerald-500">{card.badge}</span>
            </div>
          </div>
        ))}
      </StackingCards>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'App.vue',
				language: 'vue',
				description: 'Vue 3 SFC using StackingCards template with v-for loop.',
				code: `<script setup lang="ts">
import StackingCards from '@/components/ui/StackingCards.vue';

const cards = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];
</script>

<template>
  <main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
    <div class="max-w-2xl mx-auto mb-12 text-center">
      <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
      <p class="text-muted-foreground text-sm mt-2">Scroll to experience the 3D depth decay.</p>
    </div>

    <StackingCards
      :top-start="${topStart}"
      :top-increment="${topIncrement}"
      :card-gap="${cardGap}"
      :scale-threshold="${scaleThreshold}"
      :min-scale="${minScale}"
      :reverse-scale="${reverseScale}"
      class="max-w-2xl mx-auto"
    >
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between"
      >
        <div>
          <span class="font-mono text-xs text-muted-foreground">{{ card.tag }}</span>
          <h2 class="text-2xl font-bold mt-2">{{ card.title }}</h2>
          <p class="text-muted-foreground text-sm mt-2">{{ card.desc }}</p>
        </div>
        <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
          <span>EXHUMA EKM</span>
          <span class="text-emerald-500 font-bold">{{ card.badge }}</span>
        </div>
      </div>
    </StackingCards>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: 'Svelte 5 Runes template with StackingCards snippet.',
				code: `<script lang="ts">
  import StackingCards from '$lib/components/StackingCards.svelte';

  const cards = [
    { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
    { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
    { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
    { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
  ];
</script>

<main class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h1 class="text-3xl font-bold">Kinetic Stacking Architecture</h1>
    <p class="text-muted-foreground text-sm mt-2">Scroll to experience the 3D depth decay.</p>
  </div>

  <StackingCards
    topStart={${topStart}}
    topIncrement={${topIncrement}}
    cardGap={${cardGap}}
    scaleThreshold={${scaleThreshold}}
    minScale={${minScale}}
    reverseScale={${reverseScale}}
    class="max-w-2xl mx-auto"
  >
    {#each cards as card}
      <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
        <div>
          <span class="font-mono text-xs text-muted-foreground">{card.tag}</span>
          <h2 class="text-2xl font-bold mt-2">{card.title}</h2>
          <p class="text-muted-foreground text-sm mt-2">{card.desc}</p>
        </div>
        <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
          <span>EXHUMA EKM</span>
          <span class="text-emerald-500 font-bold">{card.badge}</span>
        </div>
      </div>
    {/each}
  </StackingCards>
</main>
`,
			};
		}

		case 'astro': {
			return {
				filename: 'index.astro',
				language: 'astro',
				description: 'Astro component using StackingCards with native SSR and scoped kinetic script.',
				code: `---
import StackingCards from '@/components/ui/StackingCards.astro';

const cards = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];
---

<section class="min-h-[180vh] py-20 px-4 bg-neutral-950 text-white">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h2 class="text-3xl font-bold">Kinetic Stacking Architecture</h2>
    <p class="text-neutral-400 text-sm mt-2">Scroll down to experience depth decay scaling.</p>
  </div>

  <StackingCards
    topStart={${topStart}}
    topIncrement={${topIncrement}}
    cardGap={${cardGap}}
    scaleThreshold={${scaleThreshold}}
    minScale={${minScale}}
    reverseScale={${reverseScale}}
    class="max-w-2xl mx-auto"
  >
    {cards.map((card) => (
      <div class="rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-md p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
        <div>
          <span class="font-mono text-xs text-emerald-400">{card.tag}</span>
          <h3 class="text-2xl font-bold mt-2">{card.title}</h3>
          <p class="text-neutral-400 text-sm mt-2">{card.desc}</p>
        </div>
        <div class="pt-6 border-t border-white/10 flex justify-between text-xs font-mono text-neutral-400">
          <span>HARDWARE ACCELERATED</span>
          <span class="text-white font-bold">{card.badge}</span>
        </div>
      </div>
    ))}
  </StackingCards>
</section>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'Features.tsx',
				language: 'tsx',
				description: 'SolidJS component implementing kinetic StackingCards.',
				code: `import { For } from 'solid-js';
import { StackingCards } from '@/components/ui/StackingCards';

const cards = [
  { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
  { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
  { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
  { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
];

export default function Features() {
  return (
    <section class="min-h-[180vh] py-20 px-4 bg-neutral-950 text-white">
      <div class="max-w-2xl mx-auto mb-12 text-center">
        <h2 class="text-3xl font-bold">Kinetic Stacking Architecture</h2>
        <p class="text-neutral-400 text-sm mt-2">Scroll down to experience depth decay scaling.</p>
      </div>

      <StackingCards
        topStart={${topStart}}
        topIncrement={${topIncrement}}
        cardGap={${cardGap}}
        scaleThreshold={${scaleThreshold}}
        minScale={${minScale}}
        reverseScale={${reverseScale}}
        class="max-w-2xl mx-auto"
      >
        <For each={cards}>
          {(card) => (
            <div class="rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-md p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
              <div>
                <span class="font-mono text-xs text-emerald-400">{card.tag}</span>
                <h3 class="text-2xl font-bold mt-2">{card.title}</h3>
                <p class="text-neutral-400 text-sm mt-2">{card.desc}</p>
              </div>
              <div class="pt-6 border-t border-white/10 flex justify-between text-xs font-mono text-neutral-400">
                <span>HARDWARE ACCELERATED</span>
                <span class="text-white font-bold">{card.badge}</span>
              </div>
            </div>
          )}
        </For>
      </StackingCards>
    </section>
  );
}
`,
			};
		}

		case 'angular': {
			return {
				filename: 'features.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Standalone component template consuming StackingCards.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaStackingCardsComponent } from './components/stacking-cards.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, ExhumaStackingCardsComponent],
  template: \`
    <section class="min-h-[180vh] py-20 px-4 bg-neutral-950 text-white">
      <div class="max-w-2xl mx-auto mb-12 text-center">
        <h2 class="text-3xl font-bold">Kinetic Stacking Architecture</h2>
        <p class="text-neutral-400 text-sm mt-2">Scroll down to experience depth decay scaling.</p>
      </div>

      <exhuma-stacking-cards
        [topStart]="${topStart}"
        [topIncrement]="${topIncrement}"
        [cardGap]="${cardGap}"
        [scaleThreshold]="${scaleThreshold}"
        [minScale]="${minScale}"
        [reverseScale]="${reverseScale}"
        customClass="max-w-2xl mx-auto"
      >
        <div *ngFor="let card of cards" class="rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-md p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
          <div>
            <span class="font-mono text-xs text-emerald-400">{{ card.tag }}</span>
            <h3 class="text-2xl font-bold mt-2">{{ card.title }}</h3>
            <p class="text-neutral-400 text-sm mt-2">{{ card.desc }}</p>
          </div>
          <div class="pt-6 border-t border-white/10 flex justify-between text-xs font-mono text-neutral-400">
            <span>HARDWARE ACCELERATED</span>
            <span class="text-white font-bold">{{ card.badge }}</span>
          </div>
        </div>
      </exhuma-stacking-cards>
    </section>
  \`,
})
export class FeaturesComponent {
  cards = [
    { tag: '01 / ARCHITECTURE', title: 'Kinetic Performance Engine', desc: 'Batched read-write cycles guaranteeing 120Hz V-Sync.', badge: '120 FPS' },
    { tag: '02 / MEMORY', title: 'Zero-Allocation Pipeline', desc: 'Persistent Float64Array typed buffers eliminating GC pauses.', badge: 'Ω(1) HEAP' },
    { tag: '03 / ACCELERATION', title: 'Sub-Pixel Delta Clamping', desc: 'Hardware compositor promotion with deadband skipping.', badge: 'GPU ACCEL' },
    { tag: '04 / MOTION', title: 'Tiered Reverse Cascade', desc: 'Continuous C1 Hermite smoothstep cascade scaling.', badge: 'HERMITE C1' },
  ];
}
`,
			};
		}

		case 'blade': {
			return {
				filename: 'features.blade.php',
				language: 'php',
				description: 'Laravel Blade component template consuming StackingCards.',
				code: `<section class="min-h-[180vh] py-20 px-4 bg-background text-foreground">
  <div class="max-w-2xl mx-auto mb-12 text-center">
    <h2 class="text-3xl font-bold">Kinetic Stacking Architecture</h2>
    <p class="text-muted-foreground text-sm mt-2">Scroll down to experience depth decay scaling.</p>
  </div>

  <x-stacking-cards
    :top-start="${topStart}"
    :top-increment="${topIncrement}"
    :card-gap="${cardGap}"
    :scale-threshold="${scaleThreshold}"
    :min-scale="${minScale}"
    :reverse-scale="${reverseScale ? 'true' : 'false'}"
    class="max-w-2xl mx-auto"
  >
    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">01 / ARCHITECTURE</span>
        <h3 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h3>
        <p class="text-muted-foreground text-sm mt-2">Batched read-write cycles guaranteeing 120Hz V-Sync.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">120 FPS</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">02 / MEMORY</span>
        <h3 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h3>
        <p class="text-muted-foreground text-sm mt-2">Persistent Float64Array typed buffers eliminating GC pauses.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">Ω(1) HEAP</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">03 / ACCELERATION</span>
        <h3 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h3>
        <p class="text-muted-foreground text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">GPU ACCEL</span>
      </div>
    </div>

    <div class="rounded-2xl border border-border/80 bg-card/95 p-8 shadow-lg min-h-[220px] flex flex-col justify-between">
      <div>
        <span class="font-mono text-xs text-muted-foreground">04 / MOTION</span>
        <h3 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h3>
        <p class="text-muted-foreground text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
      </div>
      <div class="pt-6 border-t border-border/40 flex justify-between text-xs font-mono text-muted-foreground">
        <span>EXHUMA EKM</span>
        <span class="text-emerald-500 font-bold">HERMITE C1</span>
      </div>
    </div>
  </x-stacking-cards>
</section>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML5 markup with data attributes and ESM initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Stacking Cards — Exhuma</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-[200vh]">
  <div class="max-w-2xl mx-auto py-20 px-4">
    <h1 class="text-3xl font-bold text-center mb-12">Kinetic Stacking Architecture</h1>

    <!-- StackingCards Container -->
    <div
      data-exhuma-stacking-cards
      data-top-start="${topStart}"
      data-top-increment="${topIncrement}"
      data-card-gap="${cardGap}"
      data-scale-threshold="${scaleThreshold}"
      data-min-scale="${minScale}"
      data-reverse-scale="${reverseScale}"
      class="flex flex-col w-full"
    >
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">01 / ARCHITECTURE</span>
        <h2 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h2>
        <p class="text-slate-400 text-sm mt-2">Batched read-write cycles guaranteeing 120Hz V-Sync.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">02 / MEMORY</span>
        <h2 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h2>
        <p class="text-slate-400 text-sm mt-2">Persistent Float64Array buffers eliminating GC pauses.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">03 / ACCELERATION</span>
        <h2 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h2>
        <p class="text-slate-400 text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg min-h-[220px] mb-4">
        <span class="font-mono text-xs text-slate-400">04 / MOTION</span>
        <h2 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h2>
        <p class="text-slate-400 text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
      </div>
    </div>
  </div>

  <script type="module">
    import { initStackingCards } from './stacking-cards.vanilla.js';

    // Auto-discover and hydrate all [data-exhuma-stacking-cards] on the page
    initStackingCards();
  </script>
</body>
</html>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Custom Element <exhuma-stacking-cards> standard usage.',
				code: `<!-- Custom Element <exhuma-stacking-cards> -->
<exhuma-stacking-cards
  top-start="${topStart}"
  top-increment="${topIncrement}"
  card-gap="${cardGap}"
  scale-threshold="${scaleThreshold}"
  min-scale="${minScale}"
  reverse-scale="${reverseScale}"
  class="max-w-2xl mx-auto"
>
  <article class="rounded-2xl border border-border bg-card p-8 shadow-lg min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">01 / ARCHITECTURE</span>
    <h2 class="text-2xl font-bold mt-2">Kinetic Performance Engine</h2>
    <p class="text-muted-foreground text-sm mt-2">120Hz V-Sync unblocked scrolling.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-lg min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">02 / MEMORY</span>
    <h2 class="text-2xl font-bold mt-2">Zero-Allocation Pipeline</h2>
    <p class="text-muted-foreground text-sm mt-2">Zero GC overhead during interaction.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-lg min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">03 / ACCELERATION</span>
    <h2 class="text-2xl font-bold mt-2">Sub-Pixel Delta Clamping</h2>
    <p class="text-muted-foreground text-sm mt-2">Hardware compositor promotion with deadband skipping.</p>
  </article>

  <article class="rounded-2xl border border-border bg-card p-8 shadow-lg min-h-[200px] mb-4">
    <span class="font-mono text-xs text-muted-foreground">04 / MOTION</span>
    <h2 class="text-2xl font-bold mt-2">Tiered Reverse Cascade</h2>
    <p class="text-muted-foreground text-sm mt-2">Continuous C1 Hermite smoothstep cascade scaling.</p>
  </article>
</exhuma-stacking-cards>

<!-- Load Universal Web Component Definition -->
<script type="module" src="./exhuma-stacking-cards.js"></script>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg Block dynamic server-side render template.',
				code: `<?php
/**
 * Dynamic Render Template for exhuma/stacking-cards Block.
 */
$top_start = $attributes['topStart'] ?? ${topStart};
$top_increment = $attributes['topIncrement'] ?? ${topIncrement};
$card_gap = $attributes['cardGap'] ?? ${cardGap};
$scale_threshold = $attributes['scaleThreshold'] ?? ${scaleThreshold};
$min_scale = $attributes['minScale'] ?? ${minScale};
$reverse_scale = $attributes['reverseScale'] ?? ${reverseScale ? 'true' : 'false'};
?>

<div
  class="exhuma-stacking-cards-block max-w-2xl mx-auto"
  data-exhuma-stacking-cards
  data-top-start="<?php echo esc_attr($top_start); ?>"
  data-top-increment="<?php echo esc_attr($top_increment); ?>"
  data-card-gap="<?php echo esc_attr($card_gap); ?>"
  data-scale-threshold="<?php echo esc_attr($scale_threshold); ?>"
  data-min-scale="<?php echo esc_attr($min_scale); ?>"
  data-reverse-scale="<?php echo esc_attr($reverse_scale ? 'true' : 'false'); ?>"
>
  <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen using StackingCards mobile primitive.',
				code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StackingCards } from './components/StackingCards';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Kinetic Stacking</Text>
        <StackingCards
          topStart={${topStart}}
          topIncrement={${topIncrement}}
          cardGap={${cardGap}}
          scaleThreshold={${scaleThreshold}}
          minScale={${minScale}}
          reverseScale={${reverseScale}}
        >
          <View style={styles.card}>
            <Text style={styles.tag}>01 / ARCHITECTURE</Text>
            <Text style={styles.title}>Kinetic Performance</Text>
            <Text style={styles.desc}>Smooth 120Hz V-Sync depth decay.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>02 / MEMORY</Text>
            <Text style={styles.title}>Zero-Allocation</Text>
            <Text style={styles.desc}>Persistent buffer architecture.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>03 / ACCELERATION</Text>
            <Text style={styles.title}>Sub-Pixel Clamping</Text>
            <Text style={styles.desc}>Hardware compositor layer promotion.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.tag}>04 / MOTION</Text>
            <Text style={styles.title}>Tiered Reverse Cascade</Text>
            <Text style={styles.desc}>Continuous C1 Hermite smoothstep exit.</Text>
          </View>
        </StackingCards>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  scroll: { padding: 20, minHeight: 1200 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  card: { padding: 24, borderRadius: 20, backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', minHeight: 180, marginBottom: 16 },
  tag: { fontSize: 11, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  desc: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'features_screen.dart',
				language: 'dart',
				description: 'Flutter Dart screen implementing ExhumaStackingCards widget.',
				code: `import 'package:flutter/material.dart';
import 'stacking_cards.dart';

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 60.0),
          child: Column(
            children: [
              const Text(
                'Kinetic Stacking',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 32),
              ExhumaStackingCards(
                topStart: ${topStart},
                topIncrement: ${topIncrement},
                cardGap: ${cardGap},
                scaleThreshold: ${scaleThreshold},
                minScale: ${minScale},
                reverseScale: ${reverseScale},
                children: [
                  _buildCard('01 / ARCHITECTURE', 'Kinetic Performance Engine', '120 FPS'),
                  _buildCard('02 / MEMORY', 'Zero-Allocation Pipeline', 'Ω(1) HEAP'),
                  _buildCard('03 / ACCELERATION', 'Sub-Pixel Delta Clamping', 'GPU ACCEL'),
                  _buildCard('04 / MOTION', 'Tiered Reverse Cascade', 'HERMITE C1'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(String tag, String title, String badge) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16.0),
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF131C2E),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFF223252)),
        boxShadow: const [BoxShadow(blurRadius: 16, color: Colors.black45, offset: Offset(0, 8))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(tag, style: const TextStyle(fontSize: 11, color: Color(0xFF60A5FA), fontWeight: FontWeight.bold)),
              Text(badge, style: const TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'Standard usage snippet.',
				code: `import { StackingCards } from '@/components/ui/StackingCards';\n\nexport default function Example() {\n  return (\n    <StackingCards>\n      <div>Card 1</div>\n      <div>Card 2</div>\n    </StackingCards>\n  );\n}`,
			};
		}
	}
}

function getHorizontalScrollerUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const speed = Number(props.speed ?? 1);
	const itemGap = Number(props.itemGap ?? 28);
	const cardWidth = typeof props.cardWidth === 'number' ? props.cardWidth : Number(props.cardWidth ?? 320);
	const showProgress = props.showProgress !== false;
	const showFadeEdges = props.showFadeEdges !== false;
	const fadeWidth = Number(props.fadeWidth ?? 48);
	const fadeEdgeColor = String(props.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(props.fadeEdgeColorDark || '#09090b');
	const mobileMode = String(props.mobileMode ?? 'scroll');

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) features page with Brix-style HorizontalScroller.',
				code: `'use client';

import React from 'react';
import { HorizontalScroller } from '@/components/ui/HorizontalScroller';

const SERVICES = [
  { num: '01', category: 'DESIGN', title: 'Web Design & UI', desc: 'High-conversion visual interfaces engineered to command attention.', cta: 'Explore', tag: 'STAGE // 01' },
  { num: '02', category: 'DEV', title: 'Kinetic Engineering', desc: '120 FPS transitions, zero layout thrashing, and sub-pixel compositing.', cta: 'Explore', tag: 'STAGE // 02' },
  { num: '03', category: 'BRAND', title: 'Brand Strategy', desc: 'Distinct typography and positioning frameworks that scale.', cta: 'Explore', tag: 'STAGE // 03' },
  { num: '04', category: 'SCALE', title: 'Conversion Scale', desc: 'Data-driven landing pages and behavioral experimentation.', cta: 'Explore', tag: 'STAGE // 04' },
  { num: '05', category: 'AI', title: 'AI Workflows', desc: 'Intelligent automation pipelines built for high leverage.', cta: 'Explore', tag: 'STAGE // 05' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-[220vh] bg-background text-foreground py-20">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <span className="font-mono text-xs font-bold tracking-widest text-emerald-500 uppercase">
          Brix-Engineered Rail
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">
          Specialized Digital Services
        </h1>
        <p className="text-muted-foreground text-base mt-3 max-w-xl">
          Scroll vertically to glide through our full suite of digital product capabilities.
        </p>
      </div>

      <HorizontalScroller
        speed={${speed}}
        itemGap={${itemGap}}
        cardWidth={${cardWidth}}
        showProgress={${showProgress}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
        mobileMode="${mobileMode}"
        className="w-full"
      >
        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="group flex flex-col justify-between h-[210px] rounded-2xl border border-border/80 bg-card/95 p-5 backdrop-blur-md hover:border-foreground/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-500">{service.num}</span>
                  <span className="font-mono text-3xs text-muted-foreground uppercase tracking-wider">{service.category}</span>
                </div>
                <span className="font-mono text-3xs rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">{service.tag}</span>
              </div>
              <h4 className="mt-3 text-base font-bold tracking-tight text-foreground">{service.title}</h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{service.desc}</p>
            </div>
            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground group-hover:text-emerald-400 transition-colors cursor-pointer">
                {service.cta} &rarr;
              </span>
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        ))}
      </HorizontalScroller>

      {/* Subsequent Section (Unpinned Normal Flow) */}
      <section className="border-t border-border/60 bg-muted/20 px-6 py-16 sm:px-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-3xs font-bold uppercase tracking-widest text-emerald-500">
              Traversal Complete &bull; Normal Scroll Resumed
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Next Milestone: Delivery &amp; Scale
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Once horizontal card translation reaches 100%, the pinned camera seamlessly releases and natural vertical scrolling resumes.
          </p>
        </div>
      </section>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'Vite / React 18+ application demonstrating HorizontalScroller.',
				code: `import React from 'react';
import { HorizontalScroller } from './components/ui/HorizontalScroller';

const SERVICES = [
  { num: '01', category: 'DESIGN', title: 'Web Design & Concept', desc: 'Crafting intuitive digital experiences that convert.', cta: 'Explore web design', badge: 'PROTOTYPING' },
  { num: '02', category: 'ENGINEERING', title: 'Development & Motion', desc: '120 FPS kinetic transitions and zero layout thrash.', cta: 'Explore development', badge: '120 FPS' },
  { num: '03', category: 'IDENTITY', title: 'Brand Strategy', desc: 'Distinct typography and strategic positioning.', cta: 'Explore branding', badge: 'STRATEGY' },
  { num: '04', category: 'GROWTH', title: 'Conversion Optimization', desc: 'Data-driven landing pages and experimentation.', cta: 'Explore growth', badge: 'ANALYTICS' },
];

export default function App() {
  return (
    <div className="min-h-[200vh] bg-background text-foreground py-20">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h1 className="text-4xl font-bold">Featured Capabilities</h1>
      </div>

      <HorizontalScroller
        speed={${speed}}
        itemGap={${itemGap}}
        cardWidth={${cardWidth}}
        showProgress={${showProgress}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
        mobileMode="${mobileMode}"
      >
        {SERVICES.map((s, idx) => (
          <div key={idx} className="flex flex-col md:flex-row h-full rounded-2xl border border-border bg-card p-6 min-h-[360px]">
            <div className="flex-1 flex flex-col justify-between pr-4">
              <div>
                <span className="font-mono text-xs text-emerald-500 font-bold">{s.num} / {s.category}</span>
                <h3 className="text-2xl font-bold mt-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{s.desc}</p>
              </div>
              <span className="text-xs font-semibold mt-4 text-foreground hover:text-emerald-400 cursor-pointer">{s.cta} &rarr;</span>
            </div>
            <div className="w-full md:w-1/2 bg-muted/20 rounded-xl p-4 flex items-center justify-center font-mono text-xs text-muted-foreground">
              {s.badge} // EKM RAIL
            </div>
          </div>
        ))}
      </HorizontalScroller>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'App.vue',
				language: 'vue',
				description: 'Vue 3 SFC using HorizontalScroller component.',
				code: `<script setup lang="ts">
import HorizontalScroller from '@/components/ui/HorizontalScroller.vue';

const services = [
  { num: '01', category: 'DESIGN', title: 'Web Design & Direction', desc: 'Transforming visions into high-conversion interfaces.', cta: 'Explore web design' },
  { num: '02', category: 'DEV', title: 'Kinetic Development', desc: '120 FPS kinetic transitions and zero layout thrash.', cta: 'Explore dev' },
  { num: '03', category: 'BRAND', title: 'Brand Identity', desc: 'Distinct typography and strategic positioning.', cta: 'Explore branding' },
  { num: '04', category: 'GROWTH', title: 'Growth Optimization', desc: 'Data-driven landing pages and experimentation.', cta: 'Explore growth' },
];
</script>

<template>
  <main class="min-h-[220vh] py-20 bg-background text-foreground">
    <div class="max-w-5xl mx-auto px-6 mb-12">
      <h1 class="text-3xl font-bold">Services Rail</h1>
    </div>

    <HorizontalScroller
      :speed="${speed}"
      :item-gap="${itemGap}"
      :card-width="${cardWidth}"
      :show-progress="${showProgress}"
      :show-fade-edges="${showFadeEdges}"
      :fade-width="${fadeWidth}"
      fade-edge-color="${fadeEdgeColor}"
      fade-edge-color-dark="${fadeEdgeColorDark}"
      mobile-mode="${mobileMode}"
    >
      <div
        v-for="(service, idx) in services"
        :key="idx"
        class="flex flex-col md:flex-row h-full rounded-2xl border border-border bg-card p-6 min-h-[360px]"
      >
        <div class="flex-1 flex flex-col justify-between pr-4">
          <div>
            <span class="font-mono text-xs text-emerald-500 font-bold">{{ service.num }} / {{ service.category }}</span>
            <h3 class="text-2xl font-bold mt-2">{{ service.title }}</h3>
            <p class="text-muted-foreground text-sm mt-2">{{ service.desc }}</p>
          </div>
          <span class="text-xs font-semibold mt-4 text-foreground">{{ service.cta }} &rarr;</span>
        </div>
        <div class="w-full md:w-1/2 bg-muted/20 rounded-xl p-4 flex items-center justify-center font-mono text-xs text-muted-foreground">
          EKM RAIL // VUE 3
        </div>
      </div>
    </HorizontalScroller>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: 'Svelte 5 component with HorizontalScroller.',
				code: `<script lang="ts">
  import HorizontalScroller from '$lib/components/HorizontalScroller.svelte';

  const services = [
    { num: '01', category: 'DESIGN', title: 'Web Design & Direction', desc: 'High-conversion visual interfaces.' },
    { num: '02', category: 'DEV', title: 'Kinetic Development', desc: '120 FPS transitions, zero layout thrash.' },
    { num: '03', category: 'BRAND', title: 'Brand Identity', desc: 'Distinct typography and strategic positioning.' },
    { num: '04', category: 'GROWTH', title: 'Growth Optimization', desc: 'Data-driven landing pages and experimentation.' }
  ];
</script>

<main class="min-h-[220vh] py-20 bg-background text-foreground">
  <HorizontalScroller
    speed={${speed}}
    itemGap={${itemGap}}
    cardWidth={${cardWidth}}
    showProgress={${showProgress}}
    showFadeEdges={${showFadeEdges}}
    fadeWidth={${fadeWidth}}
    fadeEdgeColor="${fadeEdgeColor}"
    fadeEdgeColorDark="${fadeEdgeColorDark}"
    mobileMode="${mobileMode}"
  >
    {#each services as service, idx}
      <div class="flex flex-col md:flex-row h-full rounded-2xl border border-border bg-card p-6 min-h-[360px]">
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <span class="font-mono text-xs text-emerald-500 font-bold">{service.num}</span>
            <h3 class="text-2xl font-bold mt-2">{service.title}</h3>
            <p class="text-muted-foreground text-sm mt-2">{service.desc}</p>
          </div>
        </div>
        <div class="w-full md:w-1/2 bg-muted/20 rounded-xl p-4 flex items-center justify-center font-mono text-xs">
          EKM RAIL // SVELTE 5
        </div>
      </div>
    {/each}
  </HorizontalScroller>
</main>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'horizontal-scroller-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component with HorizontalScroller.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaHorizontalScrollerComponent } from './horizontal-scroller.component';

@Component({
  selector: 'app-horizontal-scroller-demo',
  standalone: true,
  imports: [CommonModule, ExhumaHorizontalScrollerComponent],
  template: \`
    <div class="services-container">
      <exhuma-horizontal-scroller
        [speed]="${speed}"
        [itemGap]="${itemGap}"
        [cardWidth]="${cardWidth}"
        [showProgress]="${showProgress}"
        [showFadeEdges]="${showFadeEdges}"
        [fadeWidth]="${fadeWidth}"
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
        mobileMode="${mobileMode}"
      >
        <div *ngFor="let s of services; let idx = index" class="service-card">
          <div class="content">
            <span class="num">{{ s.num }} // {{ s.category }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
          <div class="preview">EKM RAIL // ANGULAR</div>
        </div>
      </exhuma-horizontal-scroller>
    </div>
  \`,
  styles: [\`
    .services-container { min-height: 220vh; padding: 5rem 1rem; background: #0a0a0a; color: #fff; }
    .service-card { display: flex; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; background: #141414; padding: 1.5rem; min-height: 360px; }
    .content { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .num { font-family: monospace; font-size: 0.75rem; color: #10b981; }
    .preview { width: 45%; background: rgba(255,255,255,0.04); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 0.75rem; }
  \`]
})
export class HorizontalScrollerDemoComponent {
  services = [
    { num: '01', category: 'DESIGN', title: 'Web Design & Direction', desc: 'High-conversion visual interfaces.' },
    { num: '02', category: 'DEV', title: 'Kinetic Development', desc: '120 FPS transitions, zero layout thrash.' },
    { num: '03', category: 'BRAND', title: 'Brand Identity', desc: 'Distinct typography and strategic positioning.' },
    { num: '04', category: 'GROWTH', title: 'Growth Optimization', desc: 'Data-driven landing pages and experimentation.' },
  ];
}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'SolidJS component with HorizontalScroller.',
				code: `import { For } from 'solid-js';
import { HorizontalScroller } from './components/HorizontalScroller';

const SERVICES = [
  { num: '01', category: 'DESIGN', title: 'Web Design & Direction', desc: 'High-conversion visual interfaces.' },
  { num: '02', category: 'DEV', title: 'Kinetic Development', desc: '120 FPS transitions, zero layout thrash.' },
  { num: '03', category: 'BRAND', title: 'Brand Identity', desc: 'Distinct typography and strategic positioning.' },
  { num: '04', category: 'GROWTH', title: 'Growth Optimization', desc: 'Data-driven landing pages and experimentation.' },
];

export default function App() {
  return (
    <main class="min-h-[220vh] py-20 bg-background text-foreground">
      <HorizontalScroller
        speed={${speed}}
        itemGap={${itemGap}}
        cardWidth={${cardWidth}}
        showProgress={${showProgress}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
        mobileMode="${mobileMode}"
      >
        <For each={SERVICES}>
          {(service) => (
            <div class="flex flex-col md:flex-row h-full rounded-2xl border border-border bg-card p-6 min-h-[360px]">
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <span class="font-mono text-xs text-emerald-500 font-bold">{service.num}</span>
                  <h3 class="text-2xl font-bold mt-2">{service.title}</h3>
                  <p class="text-muted-foreground text-sm mt-2">{service.desc}</p>
                </div>
              </div>
              <div class="w-full md:w-1/2 bg-muted/20 rounded-xl p-4 flex items-center justify-center font-mono text-xs">
                EKM RAIL // SOLID
              </div>
            </div>
          )}
        </For>
      </HorizontalScroller>
    </main>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'index.astro',
				language: 'astro',
				description: 'Astro page using the native HorizontalScroller component.',
				code: `---
import HorizontalScroller from '@/components/ui/HorizontalScroller.astro';

const services = [
  { num: '01', title: 'Web Design', desc: 'Intuitive digital experiences.' },
  { num: '02', title: 'Development', desc: '120 FPS kinetic transitions.' },
  { num: '03', title: 'Branding', desc: 'Distinct typography and strategy.' },
  { num: '04', title: 'Growth', desc: 'Data-driven experimentation.' },
];
---

<html lang="en">
  <body class="bg-black text-white min-h-[220vh] py-20">
    <HorizontalScroller
      speed={${speed}}
      itemGap={${itemGap}}
      cardWidth={${cardWidth}}
      showProgress={${showProgress}}
      showFadeEdges={${showFadeEdges}}
      fadeWidth={${fadeWidth}}
      fadeEdgeColor="${fadeEdgeColor}"
      fadeEdgeColorDark="${fadeEdgeColorDark}"
      mobileMode="${mobileMode}"
    >
      {services.map((s, idx) => (
        <div class="flex rounded-2xl border border-white/10 bg-neutral-900 p-8 min-h-[360px]">
          <div class="flex-1 flex flex-col justify-between">
            <span class="text-xs font-mono text-emerald-400 font-bold">0{idx + 1}</span>
            <h3 class="text-2xl font-bold">{s.title}</h3>
            <p class="text-neutral-400 text-sm">{s.desc}</p>
          </div>
        </div>
      ))}
    </HorizontalScroller>
  </body>
</html>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'services.blade.php',
				language: 'php',
				description: 'Laravel Blade template using HorizontalScroller component.',
				code: `@php
  $services = [
    ['num' => '01', 'title' => 'Web Design', 'desc' => 'Intuitive digital experiences.'],
    ['num' => '02', 'title' => 'Development', 'desc' => '120 FPS kinetic transitions.'],
    ['num' => '03', 'title' => 'Branding', 'desc' => 'Distinct typography and strategy.'],
    ['num' => '04', 'title' => 'Growth', 'desc' => 'Data-driven experimentation.'],
  ];
@endphp

<div class="min-h-[220vh] py-20 bg-neutral-950 text-white">
  <x-horizontal-scroller
    :speed="${speed}"
    :item-gap="${itemGap}"
    :card-width="${cardWidth}"
    :show-progress="${showProgress ? 'true' : 'false'}"
    :show-fade-edges="${showFadeEdges ? 'true' : 'false'}"
    :fade-width="${fadeWidth}"
    fade-edge-color="${fadeEdgeColor}"
    fade-edge-color-dark="${fadeEdgeColorDark}"
    mobile-mode="${mobileMode}"
  >
    @foreach($services as $service)
      <div class="flex flex-col md:flex-row h-full rounded-2xl border border-white/10 bg-neutral-900 p-6 min-h-[360px]">
        <div class="flex-1 flex flex-col justify-between">
          <span class="font-mono text-xs text-emerald-400 font-bold">{{ $service['num'] }}</span>
          <h3 class="text-2xl font-bold mt-2">{{ $service['title'] }}</h3>
          <p class="text-neutral-400 text-sm mt-2">{{ $service['desc'] }}</p>
        </div>
        <div class="w-full md:w-1/2 bg-white/5 rounded-xl p-4 flex items-center justify-center font-mono text-xs">
          EKM RAIL // BLADE
        </div>
      </div>
    @endforeach
  </x-horizontal-scroller>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML5 and JavaScript with HorizontalScroller engine.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Horizontal Scroller</title>
  <style>
    body { margin: 0; background: #0a0a0a; color: #fff; font-family: sans-serif; min-height: 250vh; }
    .exhuma-hs-outer { position: relative; width: 100%; min-height: 150vh; }
    .exhuma-hs-camera { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
    .exhuma-hs-track { display: flex; align-items: stretch; will-change: transform; gap: ${itemGap}px; padding: 0 max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); }
    .service-card { flex-shrink: 0; width: ${cardWidth}px; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; background: #141414; padding: 1.5rem; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; min-height: 220px; }
    .progress-bar-container { position: absolute; bottom: 2rem; left: 2rem; right: 2rem; height: 4px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden; }
    .exhuma-hs-progress { height: 100%; width: 0%; background: #10b981; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="exhuma-hs-outer" data-exhuma-horizontal-scroller data-speed="${speed}" data-item-gap="${itemGap}" data-card-width="${cardWidth}">
    <div class="exhuma-hs-camera">
      <div class="exhuma-hs-track">
        <div class="service-card"><span>01 / DESIGN</span><h3>Web Design &amp; UI</h3><p>High-conversion interfaces.</p></div>
        <div class="service-card"><span>02 / DEV</span><h3>Kinetic Engineering</h3><p>120 FPS transitions.</p></div>
        <div class="service-card"><span>03 / BRAND</span><h3>Brand Strategy</h3><p>Distinct typography.</p></div>
        <div class="service-card"><span>04 / SCALE</span><h3>Conversion Scale</h3><p>Data-driven pages.</p></div>
      </div>
      <div class="progress-bar-container"><div class="exhuma-hs-progress"></div></div>
    </div>
  </div>

  <script type="module">
    import { initHorizontalScroller } from './horizontal-scroller.vanilla.js';
    initHorizontalScroller();
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg block render template.',
				code: `<?php
/**
 * Dynamic Block Render: Exhuma Horizontal Scroller
 */
$speed = ${speed};
$item_gap = ${itemGap};
$card_width = ${cardWidth};
?>
<div class="wp-block-exhuma-horizontal-scroller" data-speed="<?php echo esc_attr($speed); ?>" data-gap="<?php echo esc_attr($item_gap); ?>">
  <div class="exhuma-hs-camera">
    <div class="exhuma-hs-track">
      <?php echo $content; ?>
    </div>
  </div>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Custom Web Component <exhuma-horizontal-scroller>.',
				code: `<!-- Custom Web Component <exhuma-horizontal-scroller> -->
<exhuma-horizontal-scroller
  speed="${speed}"
  item-gap="${itemGap}"
  card-width="${cardWidth}"
  show-progress="${showProgress}"
  show-fade-edges="${showFadeEdges}"
  fade-width="${fadeWidth}"
  fade-edge-color="${fadeEdgeColor}"
  fade-edge-color-dark="${fadeEdgeColorDark}"
  mobile-mode="${mobileMode}"
>
  <div class="card"><h3>01 / Web Design</h3><p>Intuitive digital experiences.</p></div>
  <div class="card"><h3>02 / Development</h3><p>120 FPS kinetic transitions.</p></div>
  <div class="card"><h3>03 / Brand Identity</h3><p>Distinct typography and strategy.</p></div>
  <div class="card"><h3>04 / Growth</h3><p>Data-driven experimentation.</p></div>
</exhuma-horizontal-scroller>

<!-- Load Universal Web Component Definition -->
<script type="module" src="./exhuma-horizontal-scroller.js"></script>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'HorizontalScrollerScreen.tsx',
				language: 'tsx',
				description: 'React Native horizontal scroller screen.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HorizontalScroller } from './components/HorizontalScroller';

const SERVICES = [
  { num: '01', title: 'Web Design', desc: 'Intuitive digital experiences.' },
  { num: '02', title: 'Development', desc: '120 FPS kinetic transitions.' },
  { num: '03', title: 'Brand Identity', desc: 'Strategic positioning.' },
  { num: '04', title: 'Growth', desc: 'Data-driven experimentation.' },
];

export default function HorizontalScrollerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Services</Text>
      <HorizontalScroller
        itemGap={${itemGap}}
        cardWidth={${cardWidth}}
        data={SERVICES}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.num}>{item.num}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', paddingVertical: 60 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginLeft: 20, marginBottom: 24 },
  card: { backgroundColor: '#131c2e', borderRadius: 20, borderWidth: 1, borderColor: '#223252', padding: 24, height: 320, justifyContent: 'space-between' },
  num: { color: '#10b981', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  desc: { color: '#94a3b8', fontSize: 14, marginTop: 8 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'horizontal_scroller_screen.dart',
				language: 'dart',
				description: 'Flutter Dart screen implementing horizontal card rail.',
				code: `import 'package:flutter/material.dart';
import 'horizontal_scroller.dart';

class HorizontalScrollerScreen extends StatelessWidget {
  const HorizontalScrollerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(24.0),
              child: Text(
                'Featured Services',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            ExhumaHorizontalScroller(
              itemGap: ${itemGap}.0,
              cardWidth: ${cardWidth}.0,
              children: [
                _buildCard('01', 'Web Design', 'Intuitive digital experiences.'),
                _buildCard('02', 'Development', '120 FPS kinetic transitions.'),
                _buildCard('03', 'Brand Identity', 'Strategic positioning.'),
                _buildCard('04', 'Growth', 'Data-driven experimentation.'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(String num, String title, String desc) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF131C2E),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF223252)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(num, style: const TextStyle(color: Color(0xFF10B981), fontFamily: 'monospace')),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(desc, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'Standard usage snippet.',
				code: `import { HorizontalScroller } from '@/components/ui/HorizontalScroller';\n\nexport default function Example() {\n  return (\n    <HorizontalScroller speed={${speed}} itemGap={${itemGap}} cardWidth="${cardWidth}">\n      <div>Service 1</div>\n      <div>Service 2</div>\n    </HorizontalScroller>\n  );\n}`,
			};
		}
	}
}

function getTiltCardUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const maxTilt = Number(props.maxTilt ?? 15);
	const perspective = Number(props.perspective ?? 1000);
	const scale = Number(props.scale ?? 1.02);
	const speed = Number(props.speed ?? 0.12);
	const reverse = Boolean(props.reverse ?? false);
	const disabled = Boolean(props.disabled ?? false);
	const axis = (props.axis as string) ?? 'all';

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) features page with Tactile 3D TiltCard.',
				code: `'use client';

import React from 'react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <TiltCard
          maxTilt={${maxTilt}}
          perspective={${perspective}}
          scale={${scale}}
          speed={${speed}}
          reverse={${reverse}}
          disabled={${disabled}}
          axis="${axis}"
          className="border border-border bg-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
              3D PERSPECTIVE
            </span>
            <span className="text-xs text-muted-foreground font-mono">Max: ${maxTilt}°</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">Kinetic 3D Card</h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Move cursor over this surface to experience hardware-accelerated 120 FPS spring lerp tilt physics.
          </p>
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Perspective: ${perspective}px</span>
            <span className="text-emerald-500 font-semibold">Ω(1) Latency</span>
          </div>
        </TiltCard>
      </div>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React interactive tactile cards showcase with TiltCard.',
				code: `import React from 'react';
import { TiltCard } from '@/components/ui/TiltCard';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <TiltCard
        maxTilt={${maxTilt}}
        perspective={${perspective}}
        scale={${scale}}
        speed={${speed}}
        reverse={${reverse}}
        disabled={${disabled}}
        axis="${axis}"
        className="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <span className="font-mono text-xs font-bold text-emerald-500 uppercase">
          TACTILE GYROSCOPE
        </span>
        <h3 className="text-2xl font-black tracking-tight mt-2">Tactile 3D Tilt Card</h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Zero layout thrashing with cached bounding geometry and direct rAF transform updates.
        </p>
      </TiltCard>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'TiltCardDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component featuring TiltCard with tactile 3D perspective.',
				code: `<script setup lang="ts">
import TiltCard from '@/components/ui/TiltCard.vue';
</script>

<template>
  <main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
    <TiltCard
      :max-tilt="${maxTilt}"
      :perspective="${perspective}"
      :scale="${scale}"
      :speed="${speed}"
      :reverse="${reverse}"
      :disabled="${disabled}"
      axis="${axis}"
      class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="font-mono text-xs font-bold text-emerald-500 uppercase">VUE 3 NATIVE</span>
        <span class="text-xs text-muted-foreground font-mono">120 FPS</span>
      </div>
      <h3 class="text-2xl font-black tracking-tight">Tactile 3D Card</h3>
      <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
        Interactive 3D mouse tracking with Hermite spring dampening and zero layout thrashing.
      </p>
    </TiltCard>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: '+page.svelte',
				language: 'svelte',
				description: 'Svelte 5 page implementing native TiltCard physics.',
				code: `<script lang="ts">
  import TiltCard from '$lib/components/TiltCard.svelte';
</script>

<main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
  <TiltCard
    maxTilt={${maxTilt}}
    perspective={${perspective}}
    scale={${scale}}
    speed={${speed}}
    reverse={${reverse}}
    disabled={${disabled}}
    axis="${axis}"
    class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-xs font-bold text-emerald-500 uppercase">SVELTE 5 RUNES</span>
      <span class="text-xs text-muted-foreground font-mono">${maxTilt}° MAX</span>
    </div>
    <h3 class="text-2xl font-black tracking-tight">Tactile 3D Card</h3>
    <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
      Svelte 5 native reactive tilt with zero layout thrashing and smooth rAF matrix interpolation.
    </p>
  </TiltCard>
</main>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'SolidJS high-performance fine-grained reactive TiltCard demo.',
				code: `import { TiltCard } from './components/TiltCard';

export default function App() {
  return (
    <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <TiltCard
        maxTilt={${maxTilt}}
        perspective={${perspective}}
        scale={${scale}}
        speed={${speed}}
        reverse={${reverse}}
        disabled={${disabled}}
        axis="${axis}"
        class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <span class="font-mono text-xs font-bold text-emerald-500 uppercase">SOLID FINE-GRAINED</span>
        <h3 class="text-2xl font-black tracking-tight mt-2">Tactile 3D Card</h3>
        <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
          Zero VDOM overhead with fine-grained DOM tracking and 120 FPS spring transitions.
        </p>
      </TiltCard>
    </div>
  );
}
`,
			};
		}

		case 'angular': {
			return {
				filename: 'tilt-card-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component integrating ExhumaTiltCardComponent.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaTiltCardComponent } from './components/tilt-card.component';

@Component({
  selector: 'app-tilt-card-demo',
  standalone: true,
  imports: [CommonModule, ExhumaTiltCardComponent],
  template: \`
    <main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <exhuma-tilt-card
        [maxTilt]="${maxTilt}"
        [perspective]="${perspective}"
        [scale]="${scale}"
        [speed]="${speed}"
        [reverse]="${reverse}"
        [disabled]="${disabled}"
        axis="${axis}"
        class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="font-mono text-xs font-bold text-emerald-500 uppercase">ANGULAR 18+</span>
          <span class="text-xs text-muted-foreground font-mono">STANDALONE</span>
        </div>
        <h3 class="text-2xl font-black tracking-tight">Tactile 3D Card</h3>
        <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
          Angular standalone component with out-of-zone rAF animation avoiding change detection ticks.
        </p>
      </exhuma-tilt-card>
    </main>
  \`
})
export class TiltCardDemoComponent {}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'index.astro',
				language: 'astro',
				description: 'Astro page using zero-JS baseline TiltCard with client hydration.',
				code: `---
import TiltCard from '@/components/ui/TiltCard.astro';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Astro 3D Tilt Card</title>
  </head>
  <body class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
    <TiltCard
      maxTilt={${maxTilt}}
      perspective={${perspective}}
      scale={${scale}}
      speed={${speed}}
      reverse={${reverse}}
      disabled={${disabled}}
      axis="${axis}"
      class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
    >
      <span class="font-mono text-xs font-bold text-emerald-500 uppercase">ASTRO ISLAND</span>
      <h3 class="text-2xl font-black tracking-tight mt-2">Tactile 3D Card</h3>
      <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
        Zero unnecessary framework runtime. Lightweight client-side script hydrates interactive tilt.
      </p>
    </TiltCard>
  </body>
</html>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'tilt-card-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade template with kinetic Tilt Card component.',
				code: `<div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
  <x-tilt-card
    :max-tilt="${maxTilt}"
    :perspective="${perspective}"
    :scale="${scale}"
    :speed="${speed}"
    :reverse="${reverse ? 'true' : 'false'}"
    :disabled="${disabled ? 'true' : 'false'}"
    axis="${axis}"
    class="max-w-md w-full border border-slate-800 bg-slate-900 p-8 rounded-2xl shadow-2xl"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-xs font-bold text-emerald-400 uppercase">LARAVEL BLADE</span>
      <span class="text-xs text-slate-400 font-mono">120 FPS</span>
    </div>
    <h3 class="text-2xl font-black tracking-tight">Tactile 3D Tilt Card</h3>
    <p class="text-sm text-slate-400 mt-3 leading-relaxed">
      Server-rendered Blade component with pure Vanilla JS requestAnimationFrame tilt engine.
    </p>
  </x-tilt-card>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JS & HTML5 tactile tilt card with zero runtime overhead.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tactile Tilt Card</title>
  <style>
    body { margin: 0; background: #090d16; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
    .tilt-card { position: relative; width: 380px; padding: 32px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; cursor: pointer; will-change: transform; }
    .tag { font-family: monospace; font-size: 11px; font-weight: bold; color: #10b981; text-transform: uppercase; }
    h3 { margin: 12px 0 8px; font-size: 24px; font-weight: 900; }
    p { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <div
    class="tilt-card"
    data-exhuma-tilt-card
    data-max-tilt="${maxTilt}"
    data-perspective="${perspective}"
    data-scale="${scale}"
    data-speed="${speed}"
    data-reverse="${reverse}"
    data-disabled="${disabled}"
    data-axis="${axis}"
  >
    <div class="tag">VANILLA JS // 120 FPS</div>
    <h3>Tactile 3D Tilt Card</h3>
    <p>Zero dependencies, zero layout thrashing, and high-frequency spring lerp Euler rotations.</p>
  </div>

  <script type="module">
    import { initTiltCard } from './tilt-card.vanilla.js';
    initTiltCard('.tilt-card', {
      maxTilt: ${maxTilt},
      perspective: ${perspective},
      scale: ${scale},
      speed: ${speed},
      reverse: ${reverse},
      disabled: ${disabled},
      axis: '${axis}',
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg block rendering dynamic 3D tilt card.',
				code: `<?php
/**
 * TiltCard Block Render Template
 */
$max_tilt = $attributes['maxTilt'] ?? ${maxTilt};
$perspective = $attributes['perspective'] ?? ${perspective};
$scale = $attributes['scale'] ?? ${scale};
$speed = $attributes['speed'] ?? ${speed};
$reverse = ($attributes['reverse'] ?? ${reverse}) ? 'true' : 'false';
$disabled = ($attributes['disabled'] ?? ${disabled}) ? 'true' : 'false';
$axis = $attributes['axis'] ?? '${axis}';
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-tilt-card',
    'data-exhuma-tilt-card' => '',
    'data-max-tilt' => $max_tilt,
    'data-perspective' => $perspective,
    'data-scale' => $scale,
    'data-speed' => $speed,
    'data-reverse' => $reverse,
    'data-disabled' => $disabled,
    'data-axis' => $axis,
]);
?>
<div <?php echo $wrapper_attributes; ?>>
  <div class="exhuma-tilt-card-content">
    <?php echo $content; ?>
  </div>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Framework-agnostic HTML implementing <exhuma-tilt-card> custom element.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Universal Web Component: TiltCard</title>
  <script type="module" src="./exhuma-tilt-card.js"></script>
  <style>
    body { margin: 0; background: #090d16; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
    exhuma-tilt-card { display: block; width: 380px; padding: 32px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); cursor: pointer; }
    .tag { font-family: monospace; font-size: 11px; font-weight: bold; color: #10b981; text-transform: uppercase; }
    h3 { margin: 12px 0 8px; font-size: 24px; font-weight: 900; }
    p { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <exhuma-tilt-card
    max-tilt="${maxTilt}"
    perspective="${perspective}"
    scale="${scale}"
    speed="${speed}"
    reverse="${reverse}"
    disabled="${disabled}"
    axis="${axis}"
  >
    <div class="tag">WEB COMPONENT // STANDALONE</div>
    <h3>Tactile 3D Tilt Card</h3>
    <p>Works everywhere: React, Vue, Svelte, Angular, PHP, or plain static HTML pages.</p>
  </exhuma-tilt-card>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen with hardware-accelerated 3D tilt gesture physics.',
				code: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { TiltCard } from './components/TiltCard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TiltCard
        maxTilt={${maxTilt}}
        perspective={${perspective}}
        scale={${scale}}
        speed={${speed}}
        reverse={${reverse}}
        disabled={${disabled}}
        axis="${axis}"
      >
        <View style={styles.card}>
          <Text style={styles.tag}>REACT NATIVE // EXPO</Text>
          <Text style={styles.title}>Tactile 3D Tilt Card</Text>
          <Text style={styles.desc}>
            Smooth 3D Euler matrix rotation driven by Animated responder physics.
          </Text>
        </View>
      </TiltCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { padding: 28, borderRadius: 20, backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', width: 340 },
  tag: { fontSize: 11, fontFamily: 'monospace', color: '#10b981', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  desc: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'tilt_card_screen.dart',
				language: 'dart',
				description: 'Flutter screen utilizing ExhumaTiltCard 3D perspective widget.',
				code: `import 'package:flutter/material.dart';
import 'tilt_card.dart';

class TiltCardScreen extends StatelessWidget {
  const TiltCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: ExhumaTiltCard(
            maxTilt: ${maxTilt}.0,
            perspective: ${perspective}.0,
            scale: ${scale},
            speed: ${speed},
            reverse: ${reverse},
            disabled: ${disabled},
            axis: '${axis}',
            child: Container(
              width: 360,
              padding: const EdgeInsets.all(32.0),
              decoration: BoxDecoration(
                color: const Color(0xFF131C2E),
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(color: const Color(0xFF223252)),
                boxShadow: const [
                  BoxShadow(blurRadius: 24, color: Colors.black54, offset: Offset(0, 12))
                ],
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'FLUTTER // 120 FPS',
                    style: TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Tactile 3D Tilt Card',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Interactive Matrix4 3D perspective transform with smooth spring damping.',
                    style: TextStyle(fontSize: 14, color: Color(0xFF94A3B8), height: 1.5),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'Standard usage snippet.',
				code: `import { TiltCard } from '@/components/ui/TiltCard';\n\nexport default function Example() {\n  return (\n    <TiltCard maxTilt={${maxTilt}} perspective={${perspective}}>\n      <div>Tilt Card Content</div>\n    </TiltCard>\n  );\n}`,
			};
		}
	}
}

function getSpotlightCardUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const radius = Number(props.radius ?? 350);
	const color = String(props.color ?? '#6366f1');
	const borderColor = String(props.borderColor ?? '#818cf8');
	const opacity = Number(props.opacity ?? 0.85);
	const spread = Number(props.spread ?? 60);
	const mode = (props.mode as string) ?? 'both';
	const smoothing = Number(props.smoothing ?? 0.2);
	const disabled = Boolean(props.disabled ?? false);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) features page with SpotlightCard.',
				code: `'use client';

import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <SpotlightCard
          radius={${radius}}
          color="${color}"
          borderColor="${borderColor}"
          opacity={${opacity}}
          spread={${spread}}
          mode="${mode}"
          smoothing={${smoothing}}
          disabled={${disabled}}
          className="border border-border bg-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
              HARDWARE ACCELERATED
            </span>
            <span className="text-xs text-muted-foreground font-mono">Radius: ${radius}px</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">Spotlight Card</h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Move cursor over this surface to experience hardware-accelerated 120 FPS sub-pixel radial illumination.
          </p>
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Falloff: ${spread}%</span>
            <span className="text-emerald-500 font-semibold">120Hz rAF</span>
          </div>
        </SpotlightCard>
      </div>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React interactive showcase with SpotlightCard.',
				code: `import React from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <SpotlightCard
        radius={${radius}}
        color="${color}"
        borderColor="${borderColor}"
        opacity={${opacity}}
        spread={${spread}}
        mode="${mode}"
        smoothing={${smoothing}}
        disabled={${disabled}}
        className="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <span className="font-mono text-xs font-bold text-primary uppercase">
          RADIAL MASK
        </span>
        <h3 className="text-2xl font-black tracking-tight mt-2">Spotlight Primitive</h3>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          Zero layout thrashing with cached bounding geometry and direct rAF CSS custom property injection.
        </p>
      </SpotlightCard>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'SpotlightCardDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component featuring SpotlightCard with radial illumination.',
				code: `<script setup lang="ts">
import SpotlightCard from '@/components/ui/SpotlightCard.vue';
</script>

<template>
  <main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
    <SpotlightCard
      :radius="${radius}"
      color="${color}"
      border-color="${borderColor}"
      :opacity="${opacity}"
      :spread="${spread}"
      mode="${mode}"
      :smoothing="${smoothing}"
      :disabled="${disabled}"
      class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="font-mono text-xs font-bold text-primary uppercase">VUE 3 NATIVE</span>
        <span class="text-xs text-muted-foreground font-mono">120 FPS</span>
      </div>
      <h3 class="text-2xl font-black tracking-tight">Kinetic Spotlight Card</h3>
      <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
        Interactive 2D cursor tracking with specular radial border mask and smooth exponential smoothing.
      </p>
    </SpotlightCard>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: '+page.svelte',
				language: 'svelte',
				description: 'Svelte 5 page implementing native SpotlightCard physics.',
				code: `<script lang="ts">
  import SpotlightCard from '$lib/components/SpotlightCard.svelte';
</script>

<main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
  <SpotlightCard
    radius={${radius}}
    color="${color}"
    borderColor="${borderColor}"
    opacity={${opacity}}
    spread={${spread}}
    mode="${mode}"
    smoothing={${smoothing}}
    disabled={${disabled}}
    class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-xs font-bold text-primary uppercase">SVELTE 5 RUNES</span>
      <span class="text-xs text-muted-foreground font-mono">${radius}px RADIUS</span>
    </div>
    <h3 class="text-2xl font-black tracking-tight">Kinetic Spotlight Card</h3>
    <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
      Svelte 5 native reactive spotlight with zero layout thrashing and direct GPU custom property injection.
    </p>
  </SpotlightCard>
</main>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'SolidJS high-performance fine-grained reactive SpotlightCard demo.',
				code: `import { SpotlightCard } from './components/SpotlightCard';

export default function App() {
  return (
    <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <SpotlightCard
        radius={${radius}}
        color="${color}"
        borderColor="${borderColor}"
        opacity={${opacity}}
        spread={${spread}}
        mode="${mode}"
        smoothing={${smoothing}}
        disabled={${disabled}}
        class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <span class="font-mono text-xs font-bold text-primary uppercase">SOLID FINE-GRAINED</span>
        <h3 class="text-2xl font-black tracking-tight mt-2">Kinetic Spotlight Card</h3>
        <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
          Zero VDOM overhead with fine-grained DOM tracking and 120 FPS sub-pixel illumination.
        </p>
      </SpotlightCard>
    </div>
  );
}
`,
			};
		}

		case 'angular': {
			return {
				filename: 'spotlight-card-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component integrating ExhumaSpotlightCardComponent.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaSpotlightCardComponent } from './components/spotlight-card.component';

@Component({
  selector: 'app-spotlight-card-demo',
  standalone: true,
  imports: [CommonModule, ExhumaSpotlightCardComponent],
  template: \`
    <main class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <exhuma-spotlight-card
        [radius]="${radius}"
        color="${color}"
        borderColor="${borderColor}"
        [opacity]="${opacity}"
        [spread]="${spread}"
        mode="${mode}"
        [smoothing]="${smoothing}"
        [disabled]="${disabled}"
        class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="font-mono text-xs font-bold text-primary uppercase">ANGULAR 18+</span>
          <span class="text-xs text-muted-foreground font-mono">STANDALONE</span>
        </div>
        <h3 class="text-2xl font-black tracking-tight">Kinetic Spotlight Card</h3>
        <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
          Angular standalone component with out-of-zone rAF animation avoiding change detection ticks.
        </p>
      </exhuma-spotlight-card>
    </main>
  \`
})
export class SpotlightCardDemoComponent {}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'index.astro',
				language: 'astro',
				description: 'Astro page using zero-JS baseline SpotlightCard with client hydration.',
				code: `---
import SpotlightCard from '@/components/ui/SpotlightCard.astro';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Astro Spotlight Card</title>
  </head>
  <body class="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
    <SpotlightCard
      radius={${radius}}
      color="${color}"
      borderColor="${borderColor}"
      opacity={${opacity}}
      spread={${spread}}
      mode="${mode}"
      smoothing={${smoothing}}
      disabled={${disabled}}
      class="max-w-md w-full border border-border bg-card p-8 rounded-2xl shadow-2xl"
    >
      <span class="font-mono text-xs font-bold text-primary uppercase">ASTRO ISLAND</span>
      <h3 class="text-2xl font-black tracking-tight mt-2">Kinetic Spotlight Card</h3>
      <p class="text-sm text-muted-foreground mt-3 leading-relaxed">
        Zero framework runtime overhead. Scoped client-side script coordinates 120 FPS cursor tracking.
      </p>
    </SpotlightCard>
  </body>
</html>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'spotlight-card-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade template with kinetic Spotlight Card component.',
				code: `<div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
  <x-spotlight-card
    :radius="${radius}"
    color="${color}"
    border-color="${borderColor}"
    :opacity="${opacity}"
    :spread="${spread}"
    mode="${mode}"
    :smoothing="${smoothing}"
    :disabled="${disabled ? 'true' : 'false'}"
    class="max-w-md w-full border border-slate-800 bg-slate-900 p-8 rounded-2xl shadow-2xl"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="font-mono text-xs font-bold text-indigo-400 uppercase">LARAVEL BLADE</span>
      <span class="text-xs text-slate-400 font-mono">120 FPS</span>
    </div>
    <h3 class="text-2xl font-black tracking-tight">Kinetic Spotlight Card</h3>
    <p class="text-sm text-slate-400 mt-3 leading-relaxed">
      Server-rendered Blade component with pure Vanilla JS requestAnimationFrame spotlight engine.
    </p>
  </x-spotlight-card>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JS & HTML5 tactile spotlight card with zero runtime overhead.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kinetic Spotlight Card</title>
  <style>
    body { margin: 0; background: #090d16; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
    .spotlight-card { position: relative; width: 380px; padding: 32px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; cursor: pointer; }
    .tag { font-family: monospace; font-size: 11px; font-weight: bold; color: #6366f1; text-transform: uppercase; }
    h3 { margin: 12px 0 8px; font-size: 24px; font-weight: 900; }
    p { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <div
    class="spotlight-card"
    data-exhuma-spotlight-card
    data-radius="${radius}"
    data-color="${color}"
    data-border-color="${borderColor}"
    data-opacity="${opacity}"
    data-spread="${spread}"
    data-mode="${mode}"
    data-smoothing="${smoothing}"
    data-disabled="${disabled}"
  >
    <div class="tag">VANILLA JS // 120 FPS</div>
    <h3>Kinetic Spotlight Card</h3>
    <p>Zero dependencies, zero layout thrashing, and sub-pixel composite radial border mask.</p>
  </div>

  <script type="module">
    import { initSpotlightCard } from './spotlight-card.vanilla.js';
    initSpotlightCard('.spotlight-card', {
      radius: ${radius},
      color: '${color}',
      borderColor: '${borderColor}',
      opacity: ${opacity},
      spread: ${spread},
      mode: '${mode}',
      smoothing: ${smoothing},
      disabled: ${disabled},
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg block rendering dynamic spotlight card.',
				code: `<?php
/**
 * SpotlightCard Block Render Template
 */
$radius = $attributes['radius'] ?? ${radius};
$color = $attributes['color'] ?? '${color}';
$border_color = $attributes['borderColor'] ?? '${borderColor}';
$opacity = $attributes['opacity'] ?? ${opacity};
$spread = $attributes['spread'] ?? ${spread};
$mode = $attributes['mode'] ?? '${mode}';
$smoothing = $attributes['smoothing'] ?? ${smoothing};
$disabled = ($attributes['disabled'] ?? ${disabled}) ? 'true' : 'false';
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-spotlight-card',
    'data-exhuma-spotlight-card' => '',
    'data-radius' => $radius,
    'data-color' => $color,
    'data-border-color' => $border_color,
    'data-opacity' => $opacity,
    'data-spread' => $spread,
    'data-mode' => $mode,
    'data-smoothing' => $smoothing,
    'data-disabled' => $disabled,
]);
?>
<div <?php echo $wrapper_attributes; ?>>
  <div class="exhuma-spotlight-card-content">
    <?php echo $content; ?>
  </div>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Framework-agnostic HTML implementing <exhuma-spotlight-card> custom element.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Universal Web Component: SpotlightCard</title>
  <script type="module" src="./exhuma-spotlight-card.js"></script>
  <style>
    body { margin: 0; background: #090d16; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; }
    exhuma-spotlight-card { display: block; width: 380px; padding: 32px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); cursor: pointer; }
    .tag { font-family: monospace; font-size: 11px; font-weight: bold; color: #6366f1; text-transform: uppercase; }
    h3 { margin: 12px 0 8px; font-size: 24px; font-weight: 900; }
    p { margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <exhuma-spotlight-card
    radius="${radius}"
    color="${color}"
    border-color="${borderColor}"
    opacity="${opacity}"
    spread="${spread}"
    mode="${mode}"
    smoothing="${smoothing}"
  >
    <div class="tag">WEB COMPONENT // STANDALONE</div>
    <h3>Kinetic Spotlight Card</h3>
    <p>Works everywhere: React, Vue, Svelte, Angular, PHP, or plain static HTML pages.</p>
  </exhuma-spotlight-card>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen with hardware-accelerated spotlight gesture physics.',
				code: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { SpotlightCard } from './components/SpotlightCard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SpotlightCard
        radius={${radius}}
        color="${color}"
        borderColor="${borderColor}"
        opacity={${opacity}}
        spread={${spread}}
        mode="${mode}"
        smoothing={${smoothing}}
        disabled={${disabled}}
      >
        <View style={styles.card}>
          <Text style={styles.tag}>REACT NATIVE // EXPO</Text>
          <Text style={styles.title}>Kinetic Spotlight Card</Text>
          <Text style={styles.desc}>
            Smooth pointer tracking and radial illumination driven by native gesture responder physics.
          </Text>
        </View>
      </SpotlightCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { padding: 28, borderRadius: 20, backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', width: 340 },
  tag: { fontSize: 11, fontFamily: 'monospace', color: '#6366f1', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  desc: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'spotlight_card_screen.dart',
				language: 'dart',
				description: 'Flutter screen utilizing ExhumaSpotlightCard radial shader widget.',
				code: `import 'package:flutter/material.dart';
import 'spotlight_card.dart';

class SpotlightCardScreen extends StatelessWidget {
  const SpotlightCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: ExhumaSpotlightCard(
            radius: ${radius}.0,
            color: const Color(0x406366F1),
            borderColor: const Color(0x80818CF8),
            opacity: ${opacity},
            spread: ${spread}.0,
            child: Container(
              width: 360,
              padding: const EdgeInsets.all(28.0),
              decoration: BoxDecoration(
                color: const Color(0xFF131C2E),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF223252)),
                boxShadow: const [
                  BoxShadow(blurRadius: 24, color: Colors.black54, offset: Offset(0, 12))
                ],
              ),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'FLUTTER // 120 FPS',
                    style: TextStyle(fontSize: 11, color: Color(0xFF6366F1), fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Kinetic Spotlight Card',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Sub-pixel radial illumination shader painted in real-time on hardware canvas.',
                    style: TextStyle(fontSize: 14, color: Color(0xFF94A3B8), height: 1.5),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				code: `import { SpotlightCard } from '@/components/ui/SpotlightCard';\n\nexport default function Example() {\n  return (\n    <SpotlightCard radius={${radius}} color="${color}">\n      <div>Spotlight Card Content</div>\n    </SpotlightCard>\n  );\n}`,
			};
		}
	}
}

function getBorderBeamUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const size = Number(props.size ?? 200);
	const duration = Number(props.duration ?? 8);
	const borderWidth = Number(props.borderWidth ?? 2);
	const colorFrom = String(props.colorFrom ?? '#ffaa40');
	const colorTo = String(props.colorTo ?? '#9c40ff');
	const doubleBeam = Boolean(props.doubleBeam ?? false);
	const endOpacity = Number(props.endOpacity ?? 0);
	const opacity = Number(props.opacity ?? 1);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'BorderBeamDemo.tsx',
				language: 'tsx',
				description: 'Next.js App Router client component with hardware-accelerated BorderBeam.',
				code: `'use client';

import React from 'react';
import { BorderBeam } from '@/components/ui/BorderBeam';

export default function BorderBeamDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
            ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
          </span>
          <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <h3 className="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
        </p>

        <BorderBeam
          size={${size}}
          duration={${duration}}
          borderWidth={${borderWidth}}
          colorFrom="${colorFrom}"
          colorTo="${colorTo}"
          doubleBeam={${doubleBeam}}
          endOpacity={${endOpacity}}
          opacity={${opacity}}
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'BorderBeamDemo.tsx',
				language: 'tsx',
				description: 'React component showcasing perimeter laser trace overlay.',
				code: `import React from 'react';
import { BorderBeam } from '@/components/ui/BorderBeam';

export default function BorderBeamDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
            ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
          </span>
          <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <h3 className="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
        </p>

        <BorderBeam
          size={${size}}
          duration={${duration}}
          borderWidth={${borderWidth}}
          colorFrom="${colorFrom}"
          colorTo="${colorTo}"
          doubleBeam={${doubleBeam}}
          endOpacity={${endOpacity}}
          opacity={${opacity}}
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'BorderBeamDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component utilizing native BorderBeam.',
				code: `<script setup lang="ts">
import BorderBeam from '@/components/ui/BorderBeam.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
    <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
      <div class="flex items-center justify-between">
        <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
          ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
        </span>
        <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">
        Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
      </p>

      <BorderBeam
        :size="${size}"
        :duration="${duration}"
        :border-width="${borderWidth}"
        color-from="${colorFrom}"
        color-to="${colorTo}"
        :double-beam="${doubleBeam}"
        :end-opacity="${endOpacity}"
        :opacity="${opacity}"
      />
    </div>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'BorderBeamDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component embedding BorderBeam.',
				code: `<script lang="ts">
  import BorderBeam from '$lib/components/BorderBeam.svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
  <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
        ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
      </span>
      <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
    </div>
    <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
    <p class="mt-2 text-sm leading-relaxed text-slate-400">
      Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
    </p>

    <BorderBeam
      size={${size}}
      duration={${duration}}
      borderWidth={${borderWidth}}
      colorFrom="${colorFrom}"
      colorTo="${colorTo}"
      doubleBeam={${doubleBeam}}
      endOpacity={${endOpacity}}
      opacity={${opacity}}
    />
  </div>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'BorderBeamDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactive BorderBeam.',
				code: `import { Component } from 'solid-js';
import { BorderBeam } from '@/components/ui/BorderBeam';

export const BorderBeamDemo: Component = () => {
  return (
    <div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
            ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
          </span>
          <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-400">
          Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
        </p>

        <BorderBeam
          size={${size}}
          duration={${duration}}
          borderWidth={${borderWidth}}
          colorFrom="${colorFrom}"
          colorTo="${colorTo}"
          doubleBeam={${doubleBeam}}
          endOpacity={${endOpacity}}
          opacity={${opacity}}
        />
      </div>
    </div>
  );
};

export default BorderBeamDemo;
`,
			};
		}

		case 'angular': {
			return {
				filename: 'border-beam-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component importing ExhumaBorderBeamComponent.',
				code: `import { Component } from '@angular/core';
import { ExhumaBorderBeamComponent } from './components/BorderBeam.component';

@Component({
  selector: 'app-border-beam-demo',
  standalone: true,
  imports: [ExhumaBorderBeamComponent],
  template: \`
    <div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
            ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
          </span>
          <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-400">
          Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
        </p>

        <exhuma-border-beam
          [size]="${size}"
          [duration]="${duration}"
          [borderWidth]="${borderWidth}"
          colorFrom="${colorFrom}"
          colorTo="${colorTo}"
          [doubleBeam]="${doubleBeam}"
          [endOpacity]="${endOpacity}"
          [opacity]="${opacity}"
        />
      </div>
    </div>
  \`,
})
export class BorderBeamDemoComponent {}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'BorderBeamDemo.astro',
				language: 'astro',
				description: 'Zero-JS Astro component leveraging pure CSS border beam trace.',
				code: `---
import BorderBeam from '@/components/ui/BorderBeam.astro';
---

<div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
  <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
        ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
      </span>
      <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
    </div>
    <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
    <p class="mt-2 text-sm leading-relaxed text-slate-400">
      Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
    </p>

    <BorderBeam
      size={${size}}
      duration={${duration}}
      borderWidth={${borderWidth}}
      colorFrom="${colorFrom}"
      colorTo="${colorTo}"
      doubleBeam={${doubleBeam}}
      endOpacity={${endOpacity}}
      opacity={${opacity}}
    />
  </div>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'border-beam-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade component embedding x-border-beam.',
				code: `<div class="flex min-h-screen items-center justify-center p-8 bg-[#090d16]">
  <div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
        ${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}
      </span>
      <span class="inline-flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
    </div>
    <h3 class="mt-3 text-xl font-bold text-white">Quantum Border Beam</h3>
    <p class="mt-2 text-sm leading-relaxed text-slate-400">
      Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel composite.
    </p>

    <x-border-beam
      :size="${size}"
      :duration="${duration}"
      :borderWidth="${borderWidth}"
      colorFrom="${colorFrom}"
      colorTo="${colorTo}"
      :doubleBeam="${doubleBeam ? 'true' : 'false'}"
      :endOpacity="${endOpacity}"
      :opacity="${opacity}"
    />
  </div>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JavaScript and CSS border beam initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exhuma Border Beam — Vanilla JS</title>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .beam-card { position: relative; width: 380px; padding: 28px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
    .tag { font-size: 11px; font-family: monospace; color: #f59e0b; font-weight: bold; text-transform: uppercase; }
    h3 { color: #fff; margin: 12px 0 8px; font-size: 20px; }
    p { color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0; }
  </style>
</head>
<body>
  <div class="beam-card" data-exhuma-border-beam>
    <div class="tag">${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}</div>
    <h3>Quantum Border Beam</h3>
    <p>Zero-runtime GPU perimeter laser trace with hardware mask clipping.</p>
  </div>

  <script type="module">
    import { initBorderBeam } from './border-beam.vanilla.js';
    initBorderBeam('[data-exhuma-border-beam]', {
      size: ${size},
      duration: ${duration},
      borderWidth: ${borderWidth},
      colorFrom: '${colorFrom}',
      colorTo: '${colorTo}',
      doubleBeam: ${doubleBeam},
      endOpacity: ${endOpacity},
      opacity: ${opacity},
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg block render script.',
				code: `<?php
/**
 * Exhuma Border Beam Block Render Template
 */
$size = $attributes['size'] ?? ${size};
$duration = $attributes['duration'] ?? ${duration};
$borderWidth = $attributes['borderWidth'] ?? ${borderWidth};
$colorFrom = $attributes['colorFrom'] ?? '${colorFrom}';
$colorTo = $attributes['colorTo'] ?? '${colorTo}';
$doubleBeam = !empty($attributes['doubleBeam']);
$endOpacity = $attributes['endOpacity'] ?? ${endOpacity};
$opacity = $attributes['opacity'] ?? ${opacity};
?>

<div class="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#223252] bg-[#131c2e] p-6 shadow-2xl">
  <div class="font-mono text-xs font-bold uppercase tracking-wider text-amber-500">
    <?php echo $doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'; ?>
  </div>
  <h3 class="mt-3 text-xl font-bold text-white"><?php echo esc_html($attributes['title'] ?? 'Quantum Border Beam'); ?></h3>
  <p class="mt-2 text-sm leading-relaxed text-slate-400"><?php echo esc_html($attributes['description'] ?? 'Hardware-accelerated perimeter laser trace.'); ?></p>

  <?php $pathRadius = min((int)$size, 200); ?>
  <div
    class="exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]"
    style="border: <?php echo esc_attr($borderWidth); ?>px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
  >
    <div
      class="exhuma-border-beam-trace"
      style="position: absolute; aspect-ratio: 1 / 1; width: <?php echo esc_attr($size); ?>px; offset-path: rect(0 auto auto 0 round <?php echo esc_attr($pathRadius); ?>px); offset-anchor: <?php echo esc_attr($size / 2); ?>px <?php echo esc_attr($size / 2); ?>px; background: linear-gradient(to left, <?php echo esc_attr($colorFrom); ?>, <?php echo esc_attr($colorTo); ?>, transparent); animation: exhuma-border-beam <?php echo esc_attr($duration); ?>s linear infinite;"
    ></div>
  </div>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Framework-agnostic HTML implementing <exhuma-border-beam> custom element.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exhuma Border Beam — Web Component</title>
  <script type="module" src="./exhuma-border-beam.js"></script>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { position: relative; width: 380px; padding: 28px; background: #131c2e; border: 1px solid #223252; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); overflow: hidden; }
    .tag { font-size: 11px; font-family: monospace; color: #f59e0b; font-weight: bold; text-transform: uppercase; }
    h3 { color: #fff; margin: 12px 0 8px; font-size: 20px; }
    p { color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">${doubleBeam ? 'Dual Laser // 120 FPS' : 'Perimeter Trace // 120 FPS'}</div>
    <h3>Quantum Border Beam</h3>
    <p>Web Component perimeter trace compatible across all frameworks.</p>

    <exhuma-border-beam
      size="${size}"
      duration="${duration}"
      border-width="${borderWidth}"
      color-from="${colorFrom}"
      color-to="${colorTo}"
      ${doubleBeam ? 'double-beam' : ''}
      end-opacity="${endOpacity}"
      opacity="${opacity}"
    ></exhuma-border-beam>
  </div>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen with BorderBeam.',
				code: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { BorderBeam } from './components/BorderBeam';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.tag}>${doubleBeam ? 'DUAL LASER // 120 FPS' : 'PERIMETER TRACE // 120 FPS'}</Text>
        <Text style={styles.title}>Quantum Border Beam</Text>
        <Text style={styles.desc}>
          Hardware-accelerated perimeter laser trace running on native compositor.
        </Text>
        <BorderBeam
          size={${size}}
          duration={${duration}}
          borderWidth={${borderWidth}}
          colorFrom="${colorFrom}"
          colorTo="${colorTo}"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { position: 'relative', overflow: 'hidden', padding: 28, borderRadius: 20, backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', width: 340 },
  tag: { fontSize: 11, fontFamily: 'monospace', color: '#f59e0b', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  desc: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 20 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'border_beam_screen.dart',
				language: 'dart',
				description: 'Flutter screen with ExhumaBorderBeam widget.',
				code: `import 'package:flutter/material.dart';
import 'border_beam.dart';

class BorderBeamScreen extends StatelessWidget {
  const BorderBeamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            width: 360,
            decoration: BoxDecoration(
              color: const Color(0xFF131C2E),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF223252)),
              boxShadow: const [
                BoxShadow(blurRadius: 24, color: Colors.black54, offset: Offset(0, 12))
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Stack(
                children: [
                  const Padding(
                    padding: EdgeInsets.all(28.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${doubleBeam ? 'DUAL LASER // 120 FPS' : 'PERIMETER TRACE // 120 FPS'}',
                          style: TextStyle(fontSize: 11, color: Color(0xFFF59E0B), fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Quantum Border Beam',
                          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Hardware-composited perimeter laser sweep with sub-pixel canvas masking.',
                          style: TextStyle(fontSize: 14, color: Color(0xFF94A3B8), height: 1.5),
                        ),
                      ],
                    ),
                  ),
                  Positioned.fill(
                    child: ExhumaBorderBeam(
                      size: ${size}.0,
                      duration: ${duration}.0,
                      borderWidth: ${borderWidth},
                      colorFrom: const Color(0xFFFFAA40),
                      colorTo: const Color(0xFF9C40FF),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				code: `import { BorderBeam } from '@/components/ui/BorderBeam';\n\nexport default function Example() {\n  return (\n    <div className="relative overflow-hidden rounded-2xl border p-6">\n      <BorderBeam size={${size}} duration={${duration}} />\n    </div>\n  );\n}`,
			};
		}
	}
}

function getCardSwipeStackUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const thresholdDistance = Number(props.thresholdDistance ?? 120);
	const maxRotation = Number(props.maxRotation ?? 20);
	const scaleStep = Number(props.scaleStep ?? 0.05);
	const offsetStep = Number(props.offsetStep ?? 14);
	const preventLastCardDismiss = props.preventLastCardDismiss !== false;

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'SwipeStackDemo.tsx',
				language: 'tsx',
				description: 'Next.js App Router client component featuring velocity-sensitive CardSwipeStack with elastic resistance.',
				code: `'use client';

import React from 'react';
import { CardSwipeStack } from '@/components/ui/CardSwipeStack';

const ITEMS = [
  { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz with zero GC stutter.' },
  { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 production ecosystems.' },
  { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d transform writes bypassing virtual DOM layout thrashing.' },
];

export default function SwipeStackDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <CardSwipeStack
        thresholdDistance={${thresholdDistance}}
        maxRotation={${maxRotation}}
        scaleStep={${scaleStep}}
        offsetStep={${offsetStep}}
        preventLastCardDismiss={${preventLastCardDismiss}}
        className="w-full max-w-sm"
        items={ITEMS}
        onSwipe={(item, dir) => console.log('Swiped:', item.title, dir)}
        renderCard={(item) => (
          <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <span className="text-3xs font-mono font-bold text-primary">{item.tag}</span>
            <h4 className="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-3xs text-muted-foreground">
              <span>← SWIPE LEFT</span>
              <span>SWIPE RIGHT →</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'SwipeStackDemo.tsx',
				language: 'tsx',
				description: 'React component showcasing velocity-sensitive gesture swipe stack.',
				code: `import React from 'react';
import { CardSwipeStack } from '@/components/ui/CardSwipeStack';

const ITEMS = [
  { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz with zero GC stutter.' },
  { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 production ecosystems.' },
  { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d transform writes bypassing virtual DOM layout thrashing.' },
];

export default function SwipeStackDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <CardSwipeStack
        thresholdDistance={${thresholdDistance}}
        maxRotation={${maxRotation}}
        scaleStep={${scaleStep}}
        offsetStep={${offsetStep}}
        preventLastCardDismiss={${preventLastCardDismiss}}
        className="w-full max-w-sm"
        items={ITEMS}
        onSwipe={(item, dir) => console.log('Swiped:', item.title, dir)}
        renderCard={(item) => (
          <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <span className="text-3xs font-mono font-bold text-primary">{item.tag}</span>
            <h4 className="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-3xs text-muted-foreground">
              <span>← SWIPE LEFT</span>
              <span>SWIPE RIGHT →</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'SwipeStackDemo.vue',
				language: 'vue',
				description: 'Vue 3 SFC using native CardSwipeStack.',
				code: `<script setup lang="ts">
import CardSwipeStack from '@/components/ui/CardSwipeStack.vue';

const items = [
  { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
  { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
  { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
];
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <CardSwipeStack
      :threshold-distance="${thresholdDistance}"
      :max-rotation="${maxRotation}"
      :scale-step="${scaleStep}"
      :offset-step="${offsetStep}"
      :prevent-last-card-dismiss="${preventLastCardDismiss}"
      :items="items"
      class="w-full max-w-sm"
    >
      <template #card="{ item }">
        <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
          <span class="text-3xs font-mono font-bold text-primary">{{ item.tag }}</span>
          <h4 class="mt-2 text-lg font-bold text-foreground">{{ item.title }}</h4>
          <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{{ item.desc }}</p>
        </div>
      </template>
    </CardSwipeStack>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'SwipeStackDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component using CardSwipeStack.',
				code: `<script lang="ts">
  import CardSwipeStack from '$lib/components/CardSwipeStack.svelte';

  const items = [
    { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
    { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
    { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
  ];
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <CardSwipeStack
    thresholdDistance={${thresholdDistance}}
    maxRotation={${maxRotation}}
    scaleStep={${scaleStep}}
    offsetStep={${offsetStep}}
    preventLastCardDismiss={${preventLastCardDismiss}}
    {items}
    class="w-full max-w-sm"
  >
    {#snippet card(item)}
      <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
        <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>
        <h4 class="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
        <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
      </div>
    {/snippet}
  </CardSwipeStack>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'SwipeStackDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactivity.',
				code: `import { CardSwipeStack } from '@/components/ui/CardSwipeStack';

const ITEMS = [
  { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
  { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
  { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
];

export default function SwipeStackDemo() {
  return (
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <CardSwipeStack
        thresholdDistance={${thresholdDistance}}
        maxRotation={${maxRotation}}
        scaleStep={${scaleStep}}
        offsetStep={${offsetStep}}
        preventLastCardDismiss={${preventLastCardDismiss}}
        class="w-full max-w-sm"
        items={ITEMS}
        renderCard={(item) => (
          <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>
            <h4 class="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
            <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        )}
      />
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'SwipeStackDemo.astro',
				language: 'astro',
				description: 'Astro island with client hydration.',
				code: `---
import { CardSwipeStack } from '@/components/ui/CardSwipeStack';

const items = [
  { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
  { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
  { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
];
---

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <CardSwipeStack
    client:load
    thresholdDistance={${thresholdDistance}}
    maxRotation={${maxRotation}}
    scaleStep={${scaleStep}}
    offsetStep={${offsetStep}}
    preventLastCardDismiss={${preventLastCardDismiss}}
    items={items}
    className="w-full max-w-sm"
  />
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'swipe-stack-demo.component.ts',
				language: 'typescript',
				description: 'Angular standalone component using CardSwipeStack.',
				code: `import { Component } from '@angular/core';
import { CardSwipeStackComponent } from '@/components/ui/card-swipe-stack.component';

@Component({
  selector: 'app-swipe-stack-demo',
  standalone: true,
  imports: [CardSwipeStackComponent],
  template: \`
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <exhuma-card-swipe-stack
        [thresholdDistance]="${thresholdDistance}"
        [maxRotation]="${maxRotation}"
        [scaleStep]="${scaleStep}"
        [offsetStep]="${offsetStep}"
        [preventLastCardDismiss]="${preventLastCardDismiss}"
        class="w-full max-w-sm"
      />
    </div>
  \`
})
export class SwipeStackDemoComponent {}
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Standard Custom Element usage.',
				code: `<script type="module" src="./exhuma-card-swipe-stack.js"></script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <exhuma-card-swipe-stack
    threshold-distance="${thresholdDistance}"
    max-rotation="${maxRotation}"
    scale-step="${scaleStep}"
    offset-step="${offsetStep}"
    prevent-last-card-dismiss="${preventLastCardDismiss}"
    class="w-full max-w-sm"
  ></exhuma-card-swipe-stack>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'main.js',
				language: 'javascript',
				description: 'Vanilla JavaScript kinetic swipe stack initialization.',
				code: `import { initCardSwipeStack } from './card-swipe-stack.vanilla.js';

const container = document.getElementById('card-stack');

initCardSwipeStack(container, {
  thresholdDistance: ${thresholdDistance},
  maxRotation: ${maxRotation},
  scaleStep: ${scaleStep},
  offsetStep: ${offsetStep},
  preventLastCardDismiss: ${preventLastCardDismiss},
  items: [
    { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: '120Hz frame rate floor.' },
    { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Targeting 13 ecosystems.' },
  ],
});
`,
			};
		}

		case 'blade': {
			return {
				filename: 'swipe-stack-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade directive integration.',
				code: `<div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <x-exhuma.card-swipe-stack
        :threshold-distance="${thresholdDistance}"
        :max-rotation="${maxRotation}"
        :scale-step="${scaleStep}"
        :offset-step="${offsetStep}"
        :prevent-last-card-dismiss="${preventLastCardDismiss ? 'true' : 'false'}"
        class="w-full max-w-sm"
    />
</div>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg Block render template.',
				code: `<?php
/**
 * Exhuma Card Swipe Stack Block
 */
$threshold_distance = $attributes['thresholdDistance'] ?? ${thresholdDistance};
$max_rotation       = $attributes['maxRotation'] ?? ${maxRotation};
$scale_step         = $attributes['scaleStep'] ?? ${scaleStep};
$offset_step        = $attributes['offsetStep'] ?? ${offsetStep};
?>
<div class="exhuma-card-swipe-stack-block w-full max-w-sm"
     data-threshold-distance="<?php echo esc_attr($threshold_distance); ?>"
     data-max-rotation="<?php echo esc_attr($max_rotation); ?>">
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'SwipeStackDemo.native.tsx',
				language: 'tsx',
				description: 'React Native / Expo gesture swipe stack implementation.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardSwipeStack } from '@/components/ui/CardSwipeStack';

const ITEMS = [
  { id: 1, title: 'Big-Omega Guarantees', desc: '120 FPS hardware acceleration.' },
  { id: 2, title: 'Zero Framework Locks', desc: 'Direct AST generation.' },
];

export default function SwipeStackDemo() {
  return (
    <View style={styles.container}>
      <CardSwipeStack
        thresholdDistance={${thresholdDistance}}
        maxRotation={${maxRotation}}
        scaleStep={${scaleStep}}
        offsetStep={${offsetStep}}
        preventLastCardDismiss={${preventLastCardDismiss}}
        items={ITEMS}
        renderCard={(item) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { padding: 24, borderRadius: 16, backgroundColor: '#1e293b' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  desc: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'swipe_stack_demo.dart',
				language: 'dart',
				description: 'Flutter tactile swipe stack widget.',
				code: `import 'package:flutter/material.dart';
import 'package:exhuma/components/card_swipe_stack.dart';

class SwipeStackDemo extends StatelessWidget {
  const SwipeStackDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Center(
        child: SizedBox(
          width: 340,
          child: ExhumaCardSwipeStack(
            thresholdDistance: ${thresholdDistance}.0,
            maxRotation: ${maxRotation}.0,
            scaleStep: ${scaleStep},
            offsetStep: ${offsetStep}.0,
            preventLastCardDismiss: ${preventLastCardDismiss},
            itemCount: 3,
            itemBuilder: (context, index) {
              return Card(
                color: const Color(0xFF1E293B),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Text('Card \${index + 1}', style: const TextStyle(color: Colors.white, fontSize: 18)),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'CardSwipeStack universal usage.',
				code: `import { CardSwipeStack } from '@/components/ui/CardSwipeStack';\n\nexport default function Example() {\n  return <CardSwipeStack thresholdDistance={${thresholdDistance}} />;\n}`,
			};
		}
	}
}

function getComparisonSliderUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const defaultPosition = Number(props.defaultPosition ?? 0.5);
	const step = Number(props.step ?? 0.05);
	const orientation = String(props.orientation ?? 'horizontal');

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'ComparisonDemo.tsx',
				language: 'tsx',
				description: 'Next.js App Router client component showcasing sub-pixel ComparisonSlider.',
				code: `'use client';

import React from 'react';
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';

export default function ComparisonDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl">
        <ComparisonSlider
          aspectRatio="16/10"
          defaultPosition={${defaultPosition}}
          step={${step}}
          orientation="${orientation}"
          before={
            <div className="flex size-full flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
                Legacy Pipeline
              </span>
              <div>
                <h4 className="text-2xl font-bold">Unaccelerated Canvas</h4>
                <p className="mt-1 text-sm text-purple-200/70">Standard 60Hz DOM repainting</p>
              </div>
            </div>
          }
          after={
            <div className="flex size-full flex-col justify-between bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 text-white">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                Exhuma Kinetic Engine
              </span>
              <div>
                <h4 className="text-2xl font-bold">120Hz ProMotion</h4>
                <p className="mt-1 text-sm text-emerald-200/70">Sub-pixel polygon GPU clipping</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'ComparisonDemo.tsx',
				language: 'tsx',
				description: 'React component with sub-pixel clip-path media comparison slider.',
				code: `import React from 'react';
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';

export default function ComparisonDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl">
        <ComparisonSlider
          aspectRatio="16/10"
          defaultPosition={${defaultPosition}}
          step={${step}}
          orientation="${orientation}"
          before={
            <div className="flex size-full flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">
                Legacy Pipeline
              </span>
              <div>
                <h4 className="text-2xl font-bold">Unaccelerated Canvas</h4>
                <p className="mt-1 text-sm text-purple-200/70">Standard 60Hz DOM repainting</p>
              </div>
            </div>
          }
          after={
            <div className="flex size-full flex-col justify-between bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 text-white">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                Exhuma Kinetic Engine
              </span>
              <div>
                <h4 className="text-2xl font-bold">120Hz ProMotion</h4>
                <p className="mt-1 text-sm text-emerald-200/70">Sub-pixel polygon GPU clipping</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'ComparisonDemo.vue',
				language: 'vue',
				description: 'Vue 3 SFC using ComparisonSlider with before and after slots.',
				code: `<script setup lang="ts">
import ComparisonSlider from '@/components/ui/ComparisonSlider.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <div class="w-full max-w-2xl">
      <ComparisonSlider
        aspect-ratio="16/10"
        :default-position="${defaultPosition}"
        :step="${step}"
        orientation="${orientation}"
      >
        <template #before>
          <div class="flex size-full flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white">
            <span class="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">Original View</span>
            <h4 class="text-2xl font-bold">Static Canvas</h4>
          </div>
        </template>
        <template #after>
          <div class="flex size-full flex-col justify-between bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 text-white">
            <span class="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">Kinetic Mode</span>
            <h4 class="text-2xl font-bold">120Hz ProMotion</h4>
          </div>
        </template>
      </ComparisonSlider>
    </div>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'ComparisonDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component using ComparisonSlider.',
				code: `<script lang="ts">
  import ComparisonSlider from '$lib/components/ComparisonSlider.svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <div class="w-full max-w-2xl">
    <ComparisonSlider
      aspectRatio="16/10"
      defaultPosition={${defaultPosition}}
      step={${step}}
      orientation="${orientation}"
    >
      {#snippet before()}
        <div class="flex size-full flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white">
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">Original View</span>
          <h4 class="text-2xl font-bold">Static Canvas</h4>
        </div>
      {/snippet}
      {#snippet after()}
        <div class="flex size-full flex-col justify-between bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 text-white">
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">Kinetic Mode</span>
          <h4 class="text-2xl font-bold">120Hz ProMotion</h4>
        </div>
      {/snippet}
    </ComparisonSlider>
  </div>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'ComparisonDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactivity.',
				code: `import { ComparisonSlider } from '@/components/ui/ComparisonSlider';

export default function ComparisonDemo() {
  return (
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <div class="w-full max-w-2xl">
        <ComparisonSlider
          aspectRatio="16/10"
          defaultPosition={${defaultPosition}}
          step={${step}}
          orientation="${orientation}"
          before={
            <div class="flex size-full flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-8 text-white">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-purple-300">Original View</span>
              <h4 class="text-2xl font-bold">Static Canvas</h4>
            </div>
          }
          after={
            <div class="flex size-full flex-col justify-between bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-8 text-white">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">Kinetic Mode</span>
              <h4 class="text-2xl font-bold">120Hz ProMotion</h4>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'ComparisonDemo.astro',
				language: 'astro',
				description: 'Astro island with client hydration.',
				code: `---
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';
---

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <div class="w-full max-w-2xl">
    <ComparisonSlider
      client:load
      aspectRatio="16/10"
      defaultPosition={${defaultPosition}}
      step={${step}}
      orientation="${orientation}"
    />
  </div>
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'comparison-demo.component.ts',
				language: 'typescript',
				description: 'Angular standalone component using ComparisonSlider.',
				code: `import { Component } from '@angular/core';
import { ComparisonSliderComponent } from '@/components/ui/comparison-slider.component';

@Component({
  selector: 'app-comparison-demo',
  standalone: true,
  imports: [ComparisonSliderComponent],
  template: \`
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <exhuma-comparison-slider
        [defaultPosition]="${defaultPosition}"
        [step]="${step}"
        orientation="${orientation}"
        class="w-full max-w-2xl"
      />
    </div>
  \`
})
export class ComparisonDemoComponent {}
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Standard Custom Element usage.',
				code: `<script type="module" src="./exhuma-comparison-slider.js"></script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <exhuma-comparison-slider
    default-position="${defaultPosition}"
    step="${step}"
    orientation="${orientation}"
    class="w-full max-w-2xl"
  ></exhuma-comparison-slider>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'main.js',
				language: 'javascript',
				description: 'Vanilla JavaScript kinetic comparison slider initialization.',
				code: `import { initComparisonSlider } from './comparison-slider.vanilla.js';

const container = document.getElementById('comparison-slider');

initComparisonSlider(container, {
  defaultPosition: ${defaultPosition},
  step: ${step},
  orientation: '${orientation}',
});
`,
			};
		}

		case 'blade': {
			return {
				filename: 'comparison-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade directive integration.',
				code: `<div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <x-exhuma.comparison-slider
        :default-position="${defaultPosition}"
        :step="${step}"
        orientation="${orientation}"
        class="w-full max-w-2xl"
    />
</div>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg Block render template.',
				code: `<?php
/**
 * Exhuma Comparison Slider Block
 */
$default_position = $attributes['defaultPosition'] ?? ${defaultPosition};
$orientation      = $attributes['orientation'] ?? '${orientation}';
?>
<div class="exhuma-comparison-slider-block w-full max-w-2xl"
     data-default-position="<?php echo esc_attr($default_position); ?>"
     data-orientation="<?php echo esc_attr($orientation); ?>">
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'ComparisonDemo.native.tsx',
				language: 'tsx',
				description: 'React Native / Expo comparison slider.',
				code: `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';

export default function ComparisonDemo() {
  return (
    <View style={styles.container}>
      <ComparisonSlider
        defaultPosition={${defaultPosition}}
        orientation="${orientation}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'comparison_demo.dart',
				language: 'dart',
				description: 'Flutter comparison slider widget.',
				code: `import 'package:flutter/material.dart';
import 'package:exhuma/components/comparison_slider.dart';

class ComparisonDemo extends StatelessWidget {
  const ComparisonDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Center(
        child: SizedBox(
          width: 500,
          child: ExhumaComparisonSlider(
            defaultPosition: ${defaultPosition},
            orientation: '${orientation}',
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'ComparisonSlider universal usage.',
				code: `import { ComparisonSlider } from '@/components/ui/ComparisonSlider';\n\nexport default function Example() {\n  return <ComparisonSlider defaultPosition={${defaultPosition}} />;\n}`,
			};
		}
	}
}

function getExpandableCardUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const duration = Number(props.duration ?? 360);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'ExpandableDemo.tsx',
				language: 'tsx',
				description: 'Next.js App Router client component featuring FLIP morphing ExpandableCard with reverse collapse.',
				code: `'use client';

import React from 'react';
import { ExpandableCard } from '@/components/ui/ExpandableCard';

export default function ExpandableDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-sm">
        <ExpandableCard
          duration={${duration}}
          cardContent={
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/50">
              <span className="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
              <h4 className="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Hardware-accelerated layout morphing with zero Framer Motion dependencies.
              </p>
            </div>
          }
          expandedContent={
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-primary">EXPANDED MODAL DIALOG</span>
              <h3 className="text-2xl font-black text-foreground">Analytical FLIP Kinetics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The card measures its initial trigger geometry and smoothly morphs into a centered dialog before reversing seamlessly upon dismissal.
              </p>
              <div className="rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground">
                Press ESC or click the backdrop to close
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'ExpandableDemo.tsx',
				language: 'tsx',
				description: 'React component featuring FLIP morphing ExpandableCard.',
				code: `import React from 'react';
import { ExpandableCard } from '@/components/ui/ExpandableCard';

export default function ExpandableDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-sm">
        <ExpandableCard
          duration={${duration}}
          cardContent={
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all hover:border-primary/50">
              <span className="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
              <h4 className="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Hardware-accelerated layout morphing with zero Framer Motion dependencies.
              </p>
            </div>
          }
          expandedContent={
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-primary">EXPANDED MODAL DIALOG</span>
              <h3 className="text-2xl font-black text-foreground">Analytical FLIP Kinetics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The card measures its initial trigger geometry and smoothly morphs into a centered dialog before reversing seamlessly upon dismissal.
              </p>
              <div className="rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs text-muted-foreground">
                Press ESC or click the backdrop to close
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'ExpandableDemo.vue',
				language: 'vue',
				description: 'Vue 3 SFC using ExpandableCard.',
				code: `<script setup lang="ts">
import ExpandableCard from '@/components/ui/ExpandableCard.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <div class="w-full max-w-sm">
      <ExpandableCard :duration="${duration}">
        <template #trigger>
          <div class="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
            <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
            <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Architecture</h4>
            <p class="mt-1 text-xs text-muted-foreground leading-relaxed">Pure CSS matrix morphing.</p>
          </div>
        </template>
        <template #expanded>
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
            <p class="text-sm text-muted-foreground">Morphing completed without layout shifts.</p>
          </div>
        </template>
      </ExpandableCard>
    </div>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'ExpandableDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component using ExpandableCard.',
				code: `<script lang="ts">
  import ExpandableCard from '$lib/components/ExpandableCard.svelte';
</script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <div class="w-full max-w-sm">
    <ExpandableCard duration={${duration}}>
      {#snippet trigger()}
        <div class="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
          <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
          <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
          <p class="mt-1 text-xs text-muted-foreground leading-relaxed">Pure CSS matrix morphing.</p>
        </div>
      {/snippet}
      {#snippet expanded()}
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
          <p class="text-sm text-muted-foreground">Morphing completed without layout shifts.</p>
        </div>
      {/snippet}
    </ExpandableCard>
  </div>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'ExpandableDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactivity.',
				code: `import { ExpandableCard } from '@/components/ui/ExpandableCard';

export default function ExpandableDemo() {
  return (
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <div class="w-full max-w-sm">
        <ExpandableCard
          duration={${duration}}
          trigger={
            <div class="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
              <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
              <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
            </div>
          }
          expanded={
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
            </div>
          }
        />
      </div>
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'ExpandableDemo.astro',
				language: 'astro',
				description: 'Astro native component using ExpandableCard.',
				code: `---
import ExpandableCard from '@/components/ui/ExpandableCard.astro';
---

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <div class="w-full max-w-sm">
    <ExpandableCard duration={${duration}}>
      <div slot="trigger" class="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
        <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
        <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
        <p class="mt-1 text-xs text-muted-foreground leading-relaxed">Pure CSS matrix morphing.</p>
      </div>
      <div slot="expanded" class="space-y-4">
        <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
        <p class="text-sm text-muted-foreground">Morphing completed without layout shifts.</p>
      </div>
    </ExpandableCard>
  </div>
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'expandable-demo.component.ts',
				language: 'typescript',
				description: 'Angular standalone component using ExpandableCard.',
				code: `import { Component } from '@angular/core';
import { ExhumaExpandableCardComponent } from '@/components/ui/expandable-card.component';

@Component({
  selector: 'app-expandable-demo',
  standalone: true,
  imports: [ExhumaExpandableCardComponent],
  template: \`
    <div class="flex min-h-screen items-center justify-center p-8 bg-background">
      <exhuma-expandable-card
        [duration]="${duration}"
        class="w-full max-w-sm"
      >
        <div slot="trigger" class="rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
          <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
          <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
        </div>
        <div slot="expanded" class="space-y-4">
          <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
          <p class="text-sm text-muted-foreground">Morphing completed without layout shifts.</p>
        </div>
      </exhuma-expandable-card>
    </div>
  \`
})
export class ExpandableDemoComponent {}
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Standard Custom Element usage.',
				code: `<script type="module" src="./exhuma-expandable-card.js"></script>

<div class="flex min-h-screen items-center justify-center p-8 bg-background">
  <exhuma-expandable-card duration="${duration}" class="w-full max-w-sm">
    <div slot="trigger">
      <span style="font-family:monospace;font-size:0.75rem;font-weight:bold;color:#6366f1;">CLICK TO EXPAND</span>
      <h4 style="margin-top:0.5rem;font-size:1.125rem;font-weight:bold;color:#fff;">FLIP Morphing Card</h4>
    </div>
    <div slot="expanded">
      <h3 style="font-size:1.5rem;font-weight:bold;color:#fff;">Modal Dialog</h3>
      <p style="font-size:0.875rem;color:#a1a1aa;">Morphing completed without layout shifts.</p>
    </div>
  </exhuma-expandable-card>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JavaScript kinetic expandable card initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./style.css">
</head>
<body class="flex min-h-screen items-center justify-center p-8 bg-background">
  <div class="w-full max-w-sm">
    <div
      data-expandable-card
      data-duration="${duration}"
      class="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:shadow-md cursor-pointer select-none"
    >
      <span class="font-mono text-xs font-bold text-indigo-400">CLICK TO EXPAND</span>
      <h4 class="mt-2 text-lg font-bold text-white">FLIP Morphing Card</h4>
      <p class="mt-1 text-xs text-zinc-400 leading-relaxed">Pure CSS matrix morphing.</p>

      <div data-expanded-content class="hidden space-y-4">
        <h3 class="text-2xl font-bold text-white">Modal Dialog</h3>
        <p class="text-sm text-zinc-400">Morphing completed without layout shifts.</p>
      </div>
    </div>
  </div>

  <script type="module">
    import { initExpandableCard } from './expandable-card.vanilla.js';
    initExpandableCard('[data-expandable-card]');
  </script>
</body>
</html>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'expandable-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade directive integration.',
				code: `<div class="flex min-h-screen items-center justify-center p-8 bg-background">
    <x-exhuma.expandable-card :duration="${duration}" class="w-full max-w-sm">
        <x-slot:trigger>
            <span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span>
            <h4 class="mt-2 text-lg font-bold text-foreground">FLIP Morphing Card</h4>
            <p class="mt-1 text-xs text-muted-foreground leading-relaxed">Pure CSS matrix morphing.</p>
        </x-slot:trigger>

        <x-slot:expanded>
            <div class="space-y-4">
                <h3 class="text-2xl font-bold text-foreground">Modal Dialog</h3>
                <p class="text-sm text-muted-foreground">Morphing completed without layout shifts.</p>
            </div>
        </x-slot:expanded>
    </x-exhuma.expandable-card>
</div>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg Block render template.',
				code: `<?php
/**
 * Exhuma Expandable Card Block
 */
$duration = $attributes['duration'] ?? ${duration};
?>
<div class="exhuma-expandable-card-block w-full max-w-sm" data-duration="<?php echo esc_attr($duration); ?>">
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'ExpandableDemo.native.tsx',
				language: 'tsx',
				description: 'React Native / Expo expandable card modal.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExpandableCard } from '@/components/ui/ExpandableCard';

export default function ExpandableDemo() {
  return (
    <View style={styles.container}>
      <ExpandableCard
        duration={${duration}}
        cardContent={
          <View>
            <Text style={styles.tag}>CLICK TO EXPAND</Text>
            <Text style={styles.title}>FLIP Morphing Card</Text>
            <Text style={styles.desc}>Pure matrix morphing.</Text>
          </View>
        }
        expandedContent={
          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>Modal Dialog</Text>
            <Text style={styles.desc}>Hardware-accelerated layout transition.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#09090b' },
  tag: { fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold', color: '#6366f1' },
  title: { marginTop: 8, fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  desc: { marginTop: 4, fontSize: 14, color: '#a1a1aa' },
  expandedContent: { gap: 12 },
  expandedTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'expandable_demo.dart',
				language: 'dart',
				description: 'Flutter expandable card modal.',
				code: `import 'package:flutter/material.dart';
import 'expandable_card.dart';

class ExpandableDemo extends StatelessWidget {
  const ExpandableDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: Center(
        child: SizedBox(
          width: 380,
          child: ExpandableCard(
            duration: ${duration},
            cardContent: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text('CLICK TO EXPAND', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold, fontSize: 12)),
                SizedBox(height: 8),
                Text('FLIP Morphing Card', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                SizedBox(height: 4),
                Text('Pure matrix morphing.', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
              ],
            ),
            expandedContent: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text('Modal Dialog', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 22)),
                SizedBox(height: 8),
                Text('Hardware-accelerated layout transition.', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'usage.tsx',
				language: 'tsx',
				description: 'ExpandableCard universal usage.',
				code: `import { ExpandableCard } from '@/components/ui/ExpandableCard';\n\nexport default function Example() {\n  return <ExpandableCard duration={${duration}} />;\n}`,
			};
		}
	}
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
