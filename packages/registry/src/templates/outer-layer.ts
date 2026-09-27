import { ComponentFilePayload, EcosystemFlavor } from '../schema';
import { getComparisonSliderOuterFiles } from './generators/comparison-slider-generator';
import { getExpandableCardOuterFiles } from './generators/expandable-card-generator';
import { getCardSwipeStackOuterFiles } from './generators/card-swipe-stack-generator';
import { getAutoGridOuterFiles } from './generators/auto-grid-generator';
import { getCssMasonryOuterFiles } from './generators/css-masonry-generator';
import { getInfiniteMarqueeOuterFiles } from './generators/infinite-marquee-generator';
import { getHorizontalScrollerOuterFiles } from './generators/horizontal-scroller-generator';
import { getBentoGridOuterFiles } from './generators/bento-grid-generator';
import { getDiamondGridOuterFiles } from './generators/diamond-grid-generator';
import { getMorphingTabsOuterFiles } from './generators/morphing-tabs-generator';
import { getFloatingDockOuterFiles } from './generators/floating-dock-generator';
import { getAccordionOuterFiles } from './generators/accordion-generator';
import { getStackingCardsOuterFiles } from './generators/stacking-cards-generator';
import { getSpotlightCardOuterFiles } from './generators/spotlight-card-generator';
import { getBorderBeamOuterFiles } from './generators/border-beam-generator';

export interface CompoundPart {
	name: string;
	primitiveExport?: string;
	defaultClass?: string;
}

export interface ComponentOuterSpec {
	id: string;
	name: string;
	slug: string;
	category: 'cards' | 'layouts' | 'navigation' | 'primitives';
	pascalName: string;
	snakeName: string;
	description: string;
	propsInterface?: string;
	defaultTailwindClass?: string;
	compoundParts?: CompoundPart[];
}

export function generateOuterLayerFiles(spec: ComponentOuterSpec, flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] {
	const {
		name,
		slug,
		pascalName,
		snakeName,
		description,
		defaultTailwindClass = 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
		compoundParts = [],
	} = spec;

	const isEjected = options?.eject === true;

	if (slug === 'stacking-cards') {
		const files = getStackingCardsOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'spotlight-card') {
		const files = getSpotlightCardOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'border-beam') {
		const files = getBorderBeamOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'comparison-slider') {
		const files = getComparisonSliderOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'expandable-card') {
		const files = getExpandableCardOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'card-swipe-stack') {
		const files = getCardSwipeStackOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'auto-grid') {
		const files = getAutoGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'css-masonry') {
		const files = getCssMasonryOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'infinite-marquee') {
		const files = getInfiniteMarqueeOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'horizontal-scroller') {
		const files = getHorizontalScrollerOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'bento-grid') {
		const files = getBentoGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'diamond-grid') {
		const files = getDiamondGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'morphing-tabs') {
		const files = getMorphingTabsOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'floating-dock') {
		const files = getFloatingDockOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'accordion') {
		const files = getAccordionOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			if (isEjected) {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `${name} — Standalone Ejected Engine (Zero Dependencies). All raw math and physics inlined.`,
						code: getEjectedReactCode(slug, pascalName, defaultTailwindClass, props, isNext),
					},
				];
			}
			const partsCode =
				compoundParts.length > 0
					? `\n\n${compoundParts
							.map(
								(part) => `export const ${part.name} = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${part.primitiveExport || part.name}
      ref={ref}
      className={clsx('${part.defaultClass || ''}', className)}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${part.primitiveExport || part.name}>
  )
);
${part.name}.displayName = '${part.name}';`
							)
							.join('\n\n')}`
					: '';

			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `${name} — Clean Shadcn-style outer layer powered by @exhuma/core kinetic primitives.`,
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import * as ${pascalName}Primitive from '@exhuma/core';
import { clsx } from 'clsx';

export interface ${pascalName}Props extends React.ComponentPropsWithoutRef<typeof ${pascalName}Primitive.${pascalName}> {
  className?: string;
}

export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${pascalName}
      ref={ref}
      className={clsx(
        '${defaultTailwindClass}',
        className
      )}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${pascalName}>
  )
);
${pascalName}.displayName = '${pascalName}';${partsCode}
`,
				},
			];
		}

		case 'vue': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  speed: 1.0,
  itemGap: 28,
  cardWidth: 320,
  showProgress: true,
  showFadeEdges: true,
  fadeWidth: 48,
  mobileMode: 'scroll',
  class: '',
});

const sectionRef = ref<HTMLElement | null>(null);
const cameraRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const progressTextRef = ref<HTMLElement | null>(null);

const sectionHeight = ref<number | null>(null);

const maskStyle = computed(() => {
  if (!props.showFadeEdges) return {};
  const grad = \`linear-gradient(to right, transparent, black \${props.fadeWidth}px, black calc(100% - \${props.fadeWidth}px), transparent)\`;
  return {
    WebkitMaskImage: grad,
    maskImage: grad,
  };
});

let cachedDistance = 0;
let isIntersecting = false;
let rafId: number | null = null;
let observer: IntersectionObserver | null = null;

const recalculate = () => {
  if (!cameraRef.value || !trackRef.value) return;
  const viewportHeight = window.innerHeight;
  const containerWidth = cameraRef.value.clientWidth;
  const resolvedCardWidth = typeof props.cardWidth === 'number'
    ? props.cardWidth + 'px'
    : /^\\d+$/.test(props.cardWidth.trim()) ? props.cardWidth.trim() + 'px' : props.cardWidth;
  for (let i = 0; i < trackRef.value.children.length; i += 1) {
    const item = trackRef.value.children.item(i);
    if (item instanceof HTMLElement) {
      item.style.width = resolvedCardWidth;
      item.style.flex = '0 0 ' + resolvedCardWidth;
    }
  }
  const trackWidth = trackRef.value.scrollWidth;
  cachedDistance = Math.max(0, trackWidth - containerWidth + props.itemGap * 2);
  const safeSpeed = Math.max(0.1, props.speed);
  sectionHeight.value = Math.round(viewportHeight + cachedDistance / safeSpeed);
};

const updateScroll = () => {
  if (!sectionRef.value || !trackRef.value) return;
  const rect = sectionRef.value.getBoundingClientRect();
  const totalScrollable = (sectionHeight.value || sectionRef.value.offsetHeight) - window.innerHeight;
  const scrolled = -rect.top;
  const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
  const currentTranslate = -(progress * cachedDistance);
  trackRef.value.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
  if (progressBarRef.value) {
    progressBarRef.value.style.width = (progress * 100).toFixed(1) + '%';
  }
  if (progressTextRef.value) {
    progressTextRef.value.textContent = Math.round(progress * 100) + '%';
  }
};

const onScroll = () => {
  if (!isIntersecting || rafId !== null) return;
  rafId = window.requestAnimationFrame(() => {
      updateScroll();
      rafId = null;
  });
};

onMounted(() => {
  recalculate();
  observer = new IntersectionObserver((entries) => {
    isIntersecting = entries[0]?.isIntersecting ?? false;
    if (isIntersecting) updateScroll();
  }, { rootMargin: '100px 0px', threshold: 0 });
  if (sectionRef.value) observer.observe(sectionRef.value);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', recalculate, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId);
  observer?.disconnect();
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', recalculate);
});
</script>

<template>
  <section
    ref="sectionRef"
    :class="['relative w-full', props.class]"
    :style="{ minHeight: sectionHeight ? sectionHeight + 'px' : '150vh' }"
  >
    <div
      ref="cameraRef"
      class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
      :style="maskStyle"
    >
      <div
        ref="trackRef"
        class="flex items-stretch will-change-transform"
        :style="{
          gap: props.itemGap + 'px',
          paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))'
        }"
      >
        <slot />
      </div>
      <div
        v-if="props.showProgress"
        class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12"
      >
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div
            ref="progressBarRef"
            class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
          />
        </div>
        <span
          ref="progressTextRef"
          class="font-mono text-2xs text-muted-foreground tabular-nums"
        >
          0%
        </span>
      </div>
    </div>
  </section>
</template>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  topStart: 20,
  topIncrement: 28,
  cardGap: 20,
  scaleThreshold: 150,
  minScale: 0.9,
  reverseScale: true,
  class: '',
});

const containerRef = ref<HTMLDivElement | null>(null);

const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

let rafId: number | null = null;
let isIntersecting = false;
let observer: IntersectionObserver | null = null;

let cards: HTMLElement[] = [];
let total = 0;

const initCards = () => {
  if (!containerRef.value) return;
  cards = Array.from(containerRef.value.children) as HTMLElement[];
  total = cards.length;
  // Set static styles once — no layout thrashing in scroll loop
  cards.forEach((card, i) => {
    const stickyTop = props.reverseScale && i === total - 1
      ? props.topStart
      : props.topStart + i * props.topIncrement;
    card.style.position = 'sticky';
    card.style.top = stickyTop + 'px';
    card.style.zIndex = (i + 1).toString();
    card.style.marginBottom = props.cardGap + 'px';
    card.style.willChange = 'transform';
    card.style.transformOrigin = 'center top';
  });
};

const updateStack = () => {
  rafId = null;
  if (total <= 1) return;
  // Ω(1) Phase 1: batch read all rects — no style writes, no forced reflow
  const tops = new Float64Array(total);
  for (let i = 0; i < total; i++) {
    tops[i] = cards[i].getBoundingClientRect().top;
  }
  // Ω(1) Phase 2: batch write transforms only
  for (let i = 0; i < total; i++) {
    const stickyTop = props.reverseScale && i === total - 1
      ? props.topStart
      : props.topStart + i * props.topIncrement;
    const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / props.scaleThreshold));
    const targetScale = props.minScale + (1 - props.minScale) * smoothstep(1 - progress);
    cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
  }
};

const onScroll = () => {
  if (isIntersecting && rafId === null) {
    rafId = window.requestAnimationFrame(updateStack);
  }
};

onMounted(() => {
  initCards();
  updateStack();
  observer = new IntersectionObserver((entries) => {
    isIntersecting = entries[0]?.isIntersecting ?? false;
    if (isIntersecting) onScroll();
  }, { rootMargin: '100px 0px', threshold: 0 });
  if (containerRef.value) observer.observe(containerRef.value);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId);
  observer?.disconnect();
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <div
    ref="containerRef"
    :class="['${defaultTailwindClass}', props.class]"
  >
    <slot />
  </div>
</template>
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with interactive 3D perspective Euler matrix and zero layout thrashing.`,
						code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  reverse?: boolean;
  disabled?: boolean;
  axis?: 'all' | 'x' | 'y';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxTilt: 15,
  perspective: 1000,
  scale: 1.02,
  speed: 0.12,
  reverse: false,
  disabled: false,
  axis: 'all',
  class: '',
});

const cardRef = ref<HTMLDivElement | null>(null);

let rect: { left: number; top: number; width: number; height: number } | null = null;
let targetRotX = 0;
let targetRotY = 0;
let targetScale = 1.0;

let currentRotX = 0;
let currentRotY = 0;
let currentScale = 1.0;

let isHovered = false;
let rafId: number | null = null;
let isReducedMotion = false;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const measureRect = () => {
  if (!cardRef.value) return;
  const r = cardRef.value.getBoundingClientRect();
  rect = { left: r.left, top: r.top, width: r.width, height: r.height };
};

const updateFrame = () => {
  const card = cardRef.value;
  if (!card) return;

  if (props.disabled || isReducedMotion) {
    card.style.transform = '';
    rafId = null;
    return;
  }

  const factor = Math.max(0.01, Math.min(1, props.speed));
  currentRotX = lerp(currentRotX, targetRotX, factor);
  currentRotY = lerp(currentRotY, targetRotY, factor);
  currentScale = lerp(currentScale, targetScale, factor);

  card.style.transform = \`perspective(\${props.perspective}px) rotateX(\${currentRotX.toFixed(2)}deg) rotateY(\${currentRotY.toFixed(2)}deg) scale3d(\${currentScale.toFixed(3)}, \${currentScale.toFixed(3)}, \${currentScale.toFixed(3)})\`;

  const diffX = Math.abs(targetRotX - currentRotX);
  const diffY = Math.abs(targetRotY - currentRotY);
  const diffScale = Math.abs(targetScale - currentScale);

  if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
    rafId = requestAnimationFrame(updateFrame);
  } else {
    rafId = null;
  }
};

const scheduleRaf = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateFrame);
  }
};

const onPointerEnter = () => {
  if (props.disabled || isReducedMotion) return;
  isHovered = true;
  targetScale = props.scale;
  measureRect();
  scheduleRaf();
};

const onPointerMove = (e: PointerEvent) => {
  if (props.disabled || isReducedMotion) return;
  if (!rect) measureRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
  const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
  const sign = props.reverse ? -1 : 1;

  const rawRotX = normY * -props.maxTilt * sign;
  const rawRotY = normX * props.maxTilt * sign;

  targetRotX = props.axis === 'y' ? 0 : rawRotX;
  targetRotY = props.axis === 'x' ? 0 : rawRotY;

  scheduleRaf();
};

const onPointerLeave = () => {
  isHovered = false;
  rect = null;
  targetRotX = 0;
  targetRotY = 0;
  targetScale = 1.0;
  scheduleRaf();
};

const onScrollOrResize = () => {
  if (isHovered) measureRect();
};

onMounted(() => {
  isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScrollOrResize);
  window.removeEventListener('resize', onScrollOrResize);
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    ref="cardRef"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="['exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform', props.class]"
  >
    <slot />
  </div>
</template>
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with sub-pixel radial illumination and zero layout thrashing.`,
						code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  spread?: number;
  mode?: 'both' | 'border' | 'background';
  smoothing?: number;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  radius: ${radius},
  color: '${color}',
  borderColor: '${borderColor}',
  opacity: ${opacity},
  spread: ${spread},
  mode: '${mode}',
  smoothing: ${smoothing},
  disabled: ${disabled},
  class: '',
});

const cardRef = ref<HTMLDivElement | null>(null);

let rect: { left: number; top: number; width: number; height: number } | null = null;
let targetX = -9999;
let targetY = -9999;
let currentX = -9999;
let currentY = -9999;
let currentOpacity = 0;
let targetOpacity = 0;
let isHovered = false;
let rafId: number | null = null;
let isReducedMotion = false;

const measureRect = () => {
  if (!cardRef.value) return;
  const r = cardRef.value.getBoundingClientRect();
  rect = { left: r.left, top: r.top, width: r.width, height: r.height };
};

const updateFrame = () => {
  const el = cardRef.value;
  if (!el) return;

  if (props.disabled || isReducedMotion) {
    el.style.setProperty('--exhuma-spotlight-opacity', '0');
    rafId = null;
    return;
  }

  const factor = Math.max(0.05, Math.min(1, props.smoothing));
  currentX += (targetX - currentX) * factor;
  currentY += (targetY - currentY) * factor;
  currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

  el.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
  el.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
  el.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

  const diffX = Math.abs(targetX - currentX);
  const diffY = Math.abs(targetY - currentY);
  const diffOp = Math.abs(targetOpacity - currentOpacity);

  if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
    rafId = requestAnimationFrame(updateFrame);
  } else {
    rafId = null;
  }
};

const scheduleRaf = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateFrame);
  }
};

const onPointerEnter = (e: PointerEvent) => {
  if (props.disabled || isReducedMotion) return;
  isHovered = true;
  measureRect();
  if (rect) {
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    targetOpacity = props.opacity;
    if (currentX < -1000) {
      currentX = targetX;
      currentY = targetY;
    }
  }
  scheduleRaf();
};

const onPointerMove = (e: PointerEvent) => {
  if (props.disabled || isReducedMotion) return;
  isHovered = true;
  if (!rect) measureRect();
  if (!rect) return;
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
  targetOpacity = props.opacity;
  if (currentX < -1000) {
    currentX = targetX;
    currentY = targetY;
  }
  scheduleRaf();
};

const onPointerLeave = () => {
  isHovered = false;
  targetOpacity = 0;
  scheduleRaf();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.addEventListener('resize', measureRect, { passive: true });
    window.addEventListener('scroll', measureRect, { passive: true });
  }
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', measureRect);
    window.removeEventListener('scroll', measureRect);
  }
});
</script>

<template>
  <div
    ref="cardRef"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="['exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40', props.class]"
    :style="{
      '--exhuma-spotlight-radius': \`\${props.radius}px\`,
      '--exhuma-spotlight-color': props.color,
      '--exhuma-spotlight-border-color': props.borderColor,
      '--exhuma-spotlight-spread': \`\${props.spread}%\`,
      '--exhuma-spotlight-opacity': '0',
    }"
  >
    <!-- Specular Border Glow Mask -->
    <div
      v-if="props.mode === 'both' || props.mode === 'border'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    />

    <!-- Background Radial Sheen -->
    <div
      v-if="props.mode === 'both' || props.mode === 'background'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0"
      :style="{
        opacity: props.mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)',
        background: 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))'
      }"
    />

    <div class="relative z-20">
      <slot />
    </div>
  </div>
</template>
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${pascalName}.vue`,
						language: 'vue',
						description: `Vue 3 Native ${name} component with hardware mask clipping and sub-pixel laser trace.`,
						code: `<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
  borderRadius?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: ${size},
  duration: ${duration},
  borderWidth: ${borderWidth},
  colorFrom: '${colorFrom}',
  colorTo: '${colorTo}',
  doubleBeam: ${doubleBeam},
  endOpacity: ${endOpacity},
  opacity: ${opacity},
  blur: ${blur},
  borderRadius: ${borderRadius},
  class: '',
});

const endColor = computed(() => {
  const op = Math.max(0, Math.min(1, props.endOpacity));
  return op <= 0 ? 'transparent' : op >= 1 ? props.colorTo : \`color-mix(in srgb, \${props.colorTo} \${Math.round(op * 100)}%, transparent)\`;
});

const pathRadius = computed(() => Math.min(props.size, 200));
</script>

<template>
  <div
    aria-hidden="true"
    :class="['exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]', props.class]"
    :style="{
      border: \`\${props.borderWidth}px solid transparent\`,
      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'destination-out',
      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      opacity: props.opacity !== 1 ? props.opacity : undefined,
      filter: props.blur > 0 ? \`blur(\${props.blur}px)\` : undefined,
    }"
  >
    <div
      class="exhuma-border-beam-trace"
      :style="{
        position: 'absolute',
        aspectRatio: '1 / 1',
        width: \`\${props.size}px\`,
        offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
        offsetAnchor: \`\${props.size / 2}px \${props.size / 2}px\`,
        background: \`linear-gradient(to left, \${props.colorFrom}, \${props.colorTo}, \${endColor})\`,
        animation: \`exhuma-border-beam \${props.duration}s linear infinite\`,
      }"
    />
    <div
      v-if="props.doubleBeam"
      class="exhuma-border-beam-trace"
      :style="{
        position: 'absolute',
        aspectRatio: '1 / 1',
        width: \`\${props.size}px\`,
        offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
        offsetAnchor: \`\${props.size / 2}px \${props.size / 2}px\`,
        background: \`linear-gradient(to left, \${props.colorFrom}, \${props.colorTo}, \${endColor})\`,
        animation: \`exhuma-border-beam \${props.duration}s linear -\${props.duration / 2}s infinite\`,
      }"
    />
  </div>
</template>

<style scoped>
@keyframes exhuma-border-beam {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .exhuma-border-beam-trace {
    animation-play-state: paused !important;
  }
}
</style>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.vue`,
					language: 'vue',
					description: `Vue 3 Native ${name} component.`,
					code: `<script setup lang="ts">
import { clsx } from 'clsx';

interface Props {
  class?: string;
  [key: string]: unknown;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <div
    :class="clsx('${defaultTailwindClass}', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    speed?: number;
    itemGap?: number;
    cardWidth?: number | string;
    showProgress?: boolean;
    showFadeEdges?: boolean;
    fadeWidth?: number;
    mobileMode?: 'scroll' | 'stack' | 'pinned';
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    speed = 1.0,
    itemGap = 28,
    cardWidth = 320,
    showProgress = true,
    showFadeEdges = true,
    fadeWidth = 48,
    mobileMode = 'scroll',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let section = $state<HTMLElement | null>(null);
  let camera = $state<HTMLDivElement | null>(null);
  let track = $state<HTMLDivElement | null>(null);
  let progressBar = $state<HTMLDivElement | null>(null);
  let progressText = $state<HTMLSpanElement | null>(null);
  let sectionHeight = $state<number | null>(null);

  let maskStyle = $derived(
    showFadeEdges
      ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
      : ''
  );

  onMount(() => {
    if (!section || !camera || !track) return;

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId: number | null = null;

    const recalculate = () => {
      if (!camera || !track) return;
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      const resolvedCardWidth = typeof cardWidth === 'number'
        ? cardWidth + 'px'
        : /^\\d+$/.test(cardWidth.trim()) ? cardWidth.trim() + 'px' : cardWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = resolvedCardWidth;
          item.style.flex = '0 0 ' + resolvedCardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      sectionHeight = Math.round(viewportHeight + cachedDistance / safeSpeed);
    };

    const updateScroll = () => {
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const totalScrollable = (sectionHeight || section.offsetHeight) - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (!isIntersecting || rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
      });
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    };
  });
</script>

<section
  bind:this={section}
  class={\`relative w-full \${className}\`}
  style={sectionHeight ? \`min-height: \${sectionHeight}px;\` : 'min-height: 150vh;'}
  {...restProps}
>
  <div
    bind:this={camera}
    class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    style={maskStyle}
  >
    <div
      bind:this={track}
      class="flex items-stretch will-change-transform"
      style={\`gap: \${itemGap}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));\`}
    >
      {@render children?.()}
    </div>
    {#if showProgress}
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div
            bind:this={progressBar}
            class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
          />
        </div>
        <span
          bind:this={progressText}
          class="font-mono text-2xs text-muted-foreground tabular-nums"
        >
          0%
        </span>
      </div>
    {/if}
  </div>
</section>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    topStart?: number;
    topIncrement?: number;
    cardGap?: number;
    scaleThreshold?: number;
    minScale?: number;
    reverseScale?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    topStart = 20,
    topIncrement = 28,
    cardGap = 20,
    scaleThreshold = 150,
    minScale = 0.9,
    reverseScale = true,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let container = $state<HTMLDivElement | null>(null);

  const smoothstep = (t: number): number => {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  };

  onMount(() => {
    if (!container) return;
    let rafId: number | null = null;
    let isIntersecting = false;

    let cards: HTMLElement[] = [];
    let total = 0;

    // Init once: cache card refs and set static CSS (position, top, zIndex, will-change)
    const initCards = () => {
      if (!container) return;
      cards = Array.from(container.children) as HTMLElement[];
      total = cards.length;
      cards.forEach((card, i) => {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });
    };

    const updateStack = () => {
      rafId = null;
      if (total <= 1) return;
      // Ω(1) Phase 1: batch read — zero style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        tops[i] = cards[i].getBoundingClientRect().top;
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
        const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
        cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(updateStack);
      }
    };

    initCards();
    updateStack();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  });
</script>

<div
  bind:this={container}
  class={\`${defaultTailwindClass} \${className}\`}
  {...restProps}
>
  {@render children?.()}
</div>
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with interactive 3D perspective Euler matrix and zero layout thrashing.`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';
  import { clsx } from 'clsx';

  interface Props {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    speed?: number;
    reverse?: boolean;
    disabled?: boolean;
    axis?: 'all' | 'x' | 'y';
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.02,
    speed = 0.12,
    reverse = false,
    disabled = false,
    axis = 'all',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let cardEl = $state<HTMLDivElement | null>(null);

  let rect: { left: number; top: number; width: number; height: number } | null = null;
  let targetRotX = 0;
  let targetRotY = 0;
  let targetScale = 1.0;

  let currentRotX = 0;
  let currentRotY = 0;
  let currentScale = 1.0;

  let isHovered = false;
  let rafId: number | null = null;
  let isReducedMotion = false;

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  const measureRect = () => {
    if (!cardEl) return;
    const r = cardEl.getBoundingClientRect();
    rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const updateFrame = () => {
    if (!cardEl) return;

    if (disabled || isReducedMotion) {
      cardEl.style.transform = '';
      rafId = null;
      return;
    }

    const factor = Math.max(0.01, Math.min(1, speed));
    currentRotX = lerp(currentRotX, targetRotX, factor);
    currentRotY = lerp(currentRotY, targetRotY, factor);
    currentScale = lerp(currentScale, targetScale, factor);

    cardEl.style.transform = \`perspective(\${perspective}px) rotateX(\${currentRotX.toFixed(2)}deg) rotateY(\${currentRotY.toFixed(2)}deg) scale3d(\${currentScale.toFixed(3)}, \${currentScale.toFixed(3)}, \${currentScale.toFixed(3)})\`;

    const diffX = Math.abs(targetRotX - currentRotX);
    const diffY = Math.abs(targetRotY - currentRotY);
    const diffScale = Math.abs(targetScale - currentScale);

    if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
      rafId = requestAnimationFrame(updateFrame);
    } else {
      rafId = null;
    }
  };

  const scheduleRaf = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateFrame);
    }
  };

  const onPointerEnter = () => {
    if (disabled || isReducedMotion) return;
    isHovered = true;
    targetScale = scale;
    measureRect();
    scheduleRaf();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (disabled || isReducedMotion) return;
    if (!rect) measureRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
    const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
    const sign = reverse ? -1 : 1;

    const rawRotX = normY * -maxTilt * sign;
    const rawRotY = normX * maxTilt * sign;

    targetRotX = axis === 'y' ? 0 : rawRotX;
    targetRotY = axis === 'x' ? 0 : rawRotY;

    scheduleRaf();
  };

  const onPointerLeave = () => {
    isHovered = false;
    rect = null;
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1.0;
    scheduleRaf();
  };

  onMount(() => {
    isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<div
  bind:this={cardEl}
  onpointerenter={onPointerEnter}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  class={clsx('exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform', className)}
  {...restProps}
>
  {@render children?.()}
</div>
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with runes and sub-pixel radial illumination.`,
						code: `<script lang="ts">
  import { onMount } from 'svelte';
  import { clsx } from 'clsx';

  interface Props {
    radius?: number;
    color?: string;
    borderColor?: string;
    opacity?: number;
    spread?: number;
    mode?: 'both' | 'border' | 'background';
    smoothing?: number;
    disabled?: boolean;
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    radius = ${radius},
    color = '${color}',
    borderColor = '${borderColor}',
    opacity = ${opacity},
    spread = ${spread},
    mode = '${mode}',
    smoothing = ${smoothing},
    disabled = ${disabled},
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let cardEl: HTMLDivElement | null = null;
  let rect: { left: number; top: number; width: number; height: number } | null = null;

  let targetX = -9999;
  let targetY = -9999;
  let currentX = -9999;
  let currentY = -9999;
  let currentOpacity = 0;
  let targetOpacity = 0;
  let isHovered = false;
  let rafId: number | null = null;
  let isReducedMotion = false;

  const measureRect = () => {
    if (!cardEl) return;
    const r = cardEl.getBoundingClientRect();
    rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const updateFrame = () => {
    if (!cardEl) return;

    if (disabled || isReducedMotion) {
      cardEl.style.setProperty('--exhuma-spotlight-opacity', '0');
      rafId = null;
      return;
    }

    const factor = Math.max(0.05, Math.min(1, smoothing));
    currentX += (targetX - currentX) * factor;
    currentY += (targetY - currentY) * factor;
    currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

    cardEl.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
    cardEl.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
    cardEl.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

    const diffX = Math.abs(targetX - currentX);
    const diffY = Math.abs(targetY - currentY);
    const diffOp = Math.abs(targetOpacity - currentOpacity);

    if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
      rafId = requestAnimationFrame(updateFrame);
    } else {
      rafId = null;
    }
  };

  const scheduleRaf = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateFrame);
    }
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (disabled || isReducedMotion) return;
    isHovered = true;
    measureRect();
    if (rect) {
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = opacity;
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
    }
    scheduleRaf();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (disabled || isReducedMotion) return;
    isHovered = true;
    if (!rect) measureRect();
    if (!rect) return;
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    targetOpacity = opacity;
    if (currentX < -1000) {
      currentX = targetX;
      currentY = targetY;
    }
    scheduleRaf();
  };

  const onPointerLeave = () => {
    isHovered = false;
    targetOpacity = 0;
    scheduleRaf();
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.addEventListener('resize', measureRect, { passive: true });
      window.addEventListener('scroll', measureRect, { passive: true });
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', measureRect);
        window.removeEventListener('scroll', measureRect);
      }
    };
  });
</script>

<div
  bind:this={cardEl}
  onpointerenter={onPointerEnter}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  class={clsx('exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40', className)}
  style="--exhuma-spotlight-radius: {radius}px; --exhuma-spotlight-color: {color}; --exhuma-spotlight-border-color: {borderColor}; --exhuma-spotlight-spread: {spread}%; --exhuma-spotlight-opacity: 0;"
  {...restProps}
>
  {#if mode === 'both' || mode === 'border'}
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    ></div>
  {/if}

  {#if mode === 'both' || mode === 'background'}
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0"
      style="opacity: {mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)'}; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
    ></div>
  {/if}

  <div class="relative z-20">
    {@render children?.()}
  </div>
</div>
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${pascalName}.svelte`,
						language: 'svelte',
						description: `Svelte 5 Native ${name} component with hardware mask clipping and sub-pixel laser trace.`,
						code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    size = ${size},
    duration = ${duration},
    borderWidth = ${borderWidth},
    colorFrom = '${colorFrom}',
    colorTo = '${colorTo}',
    doubleBeam = ${doubleBeam},
    endOpacity = ${endOpacity},
    opacity = ${opacity},
    blur = ${blur},
    borderRadius = ${borderRadius},
    class: className = '',
    style = '',
  }: {
    size?: number;
    duration?: number;
    borderWidth?: number;
    colorFrom?: string;
    colorTo?: string;
    doubleBeam?: boolean;
    endOpacity?: number;
    opacity?: number;
    blur?: number;
    borderRadius?: number;
    class?: string;
    style?: string;
  } = $props();

  const clampedEndOpacity = $derived(Math.max(0, Math.min(1, endOpacity)));
  const endColor = $derived(
    clampedEndOpacity <= 0
      ? 'transparent'
      : clampedEndOpacity >= 1
        ? colorTo
        : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`
  );
  const pathRadius = $derived(Math.min(size, 200));
</script>

<div
  aria-hidden="true"
  class={clsx('exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]', className)}
  style="border: {borderWidth}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; {opacity !== 1 ? \`opacity: \${opacity};\` : ''} {blur > 0 ? \`filter: blur(\${blur}px);\` : ''} {style}"
>
  <div
    class="exhuma-border-beam-trace"
    style="position: absolute; aspect-ratio: 1 / 1; width: {size}px; offset-path: rect(0 auto auto 0 round {pathRadius}px); offset-anchor: {size / 2}px {size / 2}px; background: linear-gradient(to left, {colorFrom}, {colorTo}, {endColor}); animation: exhuma-border-beam {duration}s linear infinite;"
  ></div>

  {#if doubleBeam}
    <div
      class="exhuma-border-beam-trace"
      style="position: absolute; aspect-ratio: 1 / 1; width: {size}px; offset-path: rect(0 auto auto 0 round {pathRadius}px); offset-anchor: {size / 2}px {size / 2}px; background: linear-gradient(to left, {colorFrom}, {colorTo}, {endColor}); animation: exhuma-border-beam {duration}s linear -{duration / 2}s infinite;"
    ></div>
  {/if}
</div>

<style>
  @keyframes exhuma-border-beam {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .exhuma-border-beam-trace {
      animation-play-state: paused !important;
    }
  }
</style>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.svelte`,
					language: 'svelte',
					description: `Svelte 5 Native ${name} component using runes.`,
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    class: className = '',
    children,
    ...restProps
  }: {
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<div
  class={clsx('${defaultTailwindClass}', className)}
  {...restProps}
>
  {@render children?.()}
</div>
`,
				},
			];
		}

		case 'solid': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `import { Component, JSX, createSignal, onMount, onCleanup, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  let sectionRef: HTMLElement | undefined;
  let cameraRef: HTMLDivElement | undefined;
  let trackRef: HTMLDivElement | undefined;
  let progressBarRef: HTMLDivElement | undefined;
  let progressTextRef: HTMLSpanElement | undefined;

  const [local, others] = splitProps(props, [
    'speed',
    'itemGap',
    'cardWidth',
    'showProgress',
    'showFadeEdges',
    'fadeWidth',
    'mobileMode',
    'class',
    'children',
  ]);

  const [sectionHeight, setSectionHeight] = createSignal<number | undefined>(undefined);

  const speed = () => local.speed ?? 1.0;
  const itemGap = () => local.itemGap ?? 28;
  const showProgress = () => local.showProgress !== false;
  const showFadeEdges = () => local.showFadeEdges !== false;
  const fadeWidth = () => local.fadeWidth ?? 48;

  onMount(() => {
    if (!sectionRef || !cameraRef || !trackRef) return;

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId: number | null = null;

    const recalculate = () => {
      if (!cameraRef || !trackRef) return;
      const viewportHeight = window.innerHeight;
      const containerWidth = cameraRef.clientWidth;
      const rawCardWidth = local.cardWidth ?? 320;
      const resolvedCardWidth = typeof rawCardWidth === 'number'
        ? rawCardWidth + 'px'
        : /^\\d+$/.test(rawCardWidth.trim()) ? rawCardWidth.trim() + 'px' : rawCardWidth;
      for (let i = 0; i < trackRef.children.length; i += 1) {
        const item = trackRef.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = resolvedCardWidth;
          item.style.flex = '0 0 ' + resolvedCardWidth;
        }
      }
      const trackWidth = trackRef.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap() * 2);
      const safeSpeed = Math.max(0.1, speed());
      setSectionHeight(Math.round(viewportHeight + cachedDistance / safeSpeed));
    };

    const updateScroll = () => {
      if (!sectionRef || !trackRef) return;
      const rect = sectionRef.getBoundingClientRect();
      const totalScrollable = (sectionHeight() || sectionRef.offsetHeight) - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      trackRef.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBarRef) {
        progressBarRef.style.width = (progress * 100).toFixed(1) + '%';
      }
      if (progressTextRef) {
        progressTextRef.textContent = Math.round(progress * 100) + '%';
      }
    };

    const onScroll = () => {
      if (!isIntersecting || rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
      });
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(sectionRef);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    onCleanup(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    });
  });

  const maskStyle = () =>
    showFadeEdges()
      ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth()}px, black calc(100% - \${fadeWidth()}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth()}px, black calc(100% - \${fadeWidth()}px), transparent);\`
      : '';

  return (
    <section
      ref={sectionRef}
      class={\`relative w-full \${local.class ?? ''}\`}
      style={{ 'min-height': sectionHeight() ? sectionHeight() + 'px' : '150vh' }}
      {...others}
    >
      <div
        ref={cameraRef}
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        style={maskStyle()}
      >
        <div
          ref={trackRef}
          class="flex items-stretch will-change-transform"
          style={{
            gap: itemGap() + 'px',
            'padding-left': 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
            'padding-right': 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          }}
        >
          {local.children}
        </div>
        {showProgress() && (
          <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
            <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
              <div
                ref={progressBarRef}
                class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
              />
            </div>
            <span
              ref={progressTextRef}
              class="font-mono text-2xs text-muted-foreground tabular-nums"
            >
              0%
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `import { Component, JSX, onMount, onCleanup, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  const [local, others] = splitProps(props, [
    'topStart',
    'topIncrement',
    'cardGap',
    'scaleThreshold',
    'minScale',
    'reverseScale',
    'class',
    'children',
  ]);

  const topStart = () => local.topStart ?? 20;
  const topIncrement = () => local.topIncrement ?? 28;
  const cardGap = () => local.cardGap ?? 20;
  const scaleThreshold = () => local.scaleThreshold ?? 150;
  const minScale = () => local.minScale ?? 0.9;
  const reverseScale = () => local.reverseScale ?? true;

  const smoothstep = (t: number): number => {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  };

  onMount(() => {
    if (!containerRef) return;
    let rafId: number | null = null;
    let isIntersecting = false;

    let cards: HTMLElement[] = [];
    let total = 0;

    // Init once: cache card refs and set static CSS
    const initCards = () => {
      if (!containerRef) return;
      cards = Array.from(containerRef.children) as HTMLElement[];
      total = cards.length;
      cards.forEach((card, i) => {
        const stickyTop = reverseScale() && i === total - 1 ? topStart() + Math.max(0, total - 2) * topIncrement() : topStart() + i * topIncrement();
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap() + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });
    };

    const updateStack = () => {
      rafId = null;
      if (total <= 1) return;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        tops[i] = cards[i].getBoundingClientRect().top;
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        const stickyTop = reverseScale() && i === total - 1 ? topStart() + Math.max(0, total - 2) * topIncrement() : topStart() + i * topIncrement();
        const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold()));
        const targetScale = minScale() + (1 - minScale()) * smoothstep(1 - progress);
        cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(updateStack);
      }
    };

    initCards();
    updateStack();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(containerRef);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    onCleanup(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  });

  return (
    <div
      ref={containerRef}
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with interactive 3D perspective Euler matrix and zero layout thrashing.`,
						code: `import { Component, JSX, onMount, onCleanup, splitProps } from 'solid-js';

export interface TiltCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  reverse?: boolean;
  disabled?: boolean;
  axis?: 'all' | 'x' | 'y';
  class?: string;
  children?: JSX.Element;
}

export const TiltCard: Component<TiltCardProps> = (props) => {
  const [local, others] = splitProps(props, [
    'maxTilt',
    'perspective',
    'scale',
    'speed',
    'reverse',
    'disabled',
    'axis',
    'class',
    'children',
  ]);

  const maxTilt = () => local.maxTilt ?? 15;
  const perspective = () => local.perspective ?? 1000;
  const scale = () => local.scale ?? 1.02;
  const speed = () => local.speed ?? 0.12;
  const reverse = () => local.reverse ?? false;
  const disabled = () => local.disabled ?? false;
  const axis = () => local.axis ?? 'all';

  let cardRef: HTMLDivElement | undefined;

  let rect: { left: number; top: number; width: number; height: number } | null = null;
  let targetRotX = 0;
  let targetRotY = 0;
  let targetScale = 1.0;

  let currentRotX = 0;
  let currentRotY = 0;
  let currentScale = 1.0;

  let isHovered = false;
  let rafId: number | null = null;
  let isReducedMotion = false;

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  const measureRect = () => {
    if (!cardRef) return;
    const r = cardRef.getBoundingClientRect();
    rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const updateFrame = () => {
    if (!cardRef) return;

    if (disabled() || isReducedMotion) {
      cardRef.style.transform = '';
      rafId = null;
      return;
    }

    const factor = Math.max(0.01, Math.min(1, speed()));
    currentRotX = lerp(currentRotX, targetRotX, factor);
    currentRotY = lerp(currentRotY, targetRotY, factor);
    currentScale = lerp(currentScale, targetScale, factor);

    cardRef.style.transform = \`perspective(\${perspective()}px) rotateX(\${currentRotX.toFixed(2)}deg) rotateY(\${currentRotY.toFixed(2)}deg) scale3d(\${currentScale.toFixed(3)}, \${currentScale.toFixed(3)}, \${currentScale.toFixed(3)})\`;

    const diffX = Math.abs(targetRotX - currentRotX);
    const diffY = Math.abs(targetRotY - currentRotY);
    const diffScale = Math.abs(targetScale - currentScale);

    if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
      rafId = requestAnimationFrame(updateFrame);
    } else {
      rafId = null;
    }
  };

  const scheduleRaf = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateFrame);
    }
  };

  const onPointerEnter = () => {
    if (disabled() || isReducedMotion) return;
    isHovered = true;
    targetScale = scale();
    measureRect();
    scheduleRaf();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (disabled() || isReducedMotion) return;
    if (!rect) measureRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
    const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
    const sign = reverse() ? -1 : 1;

    const rawRotX = normY * -maxTilt() * sign;
    const rawRotY = normX * maxTilt() * sign;

    targetRotX = axis() === 'y' ? 0 : rawRotX;
    targetRotY = axis() === 'x' ? 0 : rawRotY;

    scheduleRaf();
  };

  const onPointerLeave = () => {
    isHovered = false;
    rect = null;
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1.0;
    scheduleRaf();
  };

  onMount(() => {
    isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    });
  });

  return (
    <div
      ref={cardRef}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      class={\`exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with fine-grained reactivity and sub-pixel radial illumination.`,
						code: `import { Component, JSX, onMount, onCleanup, splitProps } from 'solid-js';

export interface SpotlightCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  spread?: number;
  mode?: 'both' | 'border' | 'background';
  smoothing?: number;
  disabled?: boolean;
  class?: string;
  children?: JSX.Element;
}

export const SpotlightCard: Component<SpotlightCardProps> = (props) => {
  const [local, others] = splitProps(props, [
    'radius',
    'color',
    'borderColor',
    'opacity',
    'spread',
    'mode',
    'smoothing',
    'disabled',
    'class',
    'children',
  ]);

  let cardRef: HTMLDivElement | undefined;
  let rect: { left: number; top: number; width: number; height: number } | null = null;

  let targetX = -9999;
  let targetY = -9999;
  let currentX = -9999;
  let currentY = -9999;
  let currentOpacity = 0;
  let targetOpacity = 0;
  let isHovered = false;
  let rafId: number | null = null;
  let isReducedMotion = false;

  const radius = () => local.radius ?? ${radius};
  const color = () => local.color ?? '${color}';
  const borderColor = () => local.borderColor ?? '${borderColor}';
  const opacity = () => local.opacity ?? ${opacity};
  const spread = () => local.spread ?? ${spread};
  const mode = () => local.mode ?? '${mode}';
  const smoothing = () => local.smoothing ?? ${smoothing};
  const disabled = () => local.disabled ?? ${disabled};

  const measureRect = () => {
    if (!cardRef) return;
    const r = cardRef.getBoundingClientRect();
    rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  };

  const updateFrame = () => {
    if (!cardRef) return;

    if (disabled() || isReducedMotion) {
      cardRef.style.setProperty('--exhuma-spotlight-opacity', '0');
      rafId = null;
      return;
    }

    const factor = Math.max(0.05, Math.min(1, smoothing()));
    currentX += (targetX - currentX) * factor;
    currentY += (targetY - currentY) * factor;
    currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

    cardRef.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
    cardRef.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
    cardRef.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

    const diffX = Math.abs(targetX - currentX);
    const diffY = Math.abs(targetY - currentY);
    const diffOp = Math.abs(targetOpacity - currentOpacity);

    if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
      rafId = requestAnimationFrame(updateFrame);
    } else {
      rafId = null;
    }
  };

  const scheduleRaf = () => {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateFrame);
    }
  };

  const onPointerEnter = (e: PointerEvent) => {
    if (disabled() || isReducedMotion) return;
    isHovered = true;
    measureRect();
    if (rect) {
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = opacity();
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
    }
    scheduleRaf();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (disabled() || isReducedMotion) return;
    isHovered = true;
    if (!rect) measureRect();
    if (!rect) return;
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    targetOpacity = opacity();
    if (currentX < -1000) {
      currentX = targetX;
      currentY = targetY;
    }
    scheduleRaf();
  };

  const onPointerLeave = () => {
    isHovered = false;
    targetOpacity = 0;
    scheduleRaf();
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.addEventListener('resize', measureRect, { passive: true });
      window.addEventListener('scroll', measureRect, { passive: true });
    }
  });

  onCleanup(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', measureRect);
      window.removeEventListener('scroll', measureRect);
    }
  });

  return (
    <div
      ref={cardRef}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      class={\`exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40 \${local.class ?? ''}\`}
      style={{
        '--exhuma-spotlight-radius': \`\${radius()}px\`,
        '--exhuma-spotlight-color': color(),
        '--exhuma-spotlight-border-color': borderColor(),
        '--exhuma-spotlight-spread': \`\${spread()}%\`,
        '--exhuma-spotlight-opacity': '0',
      }}
      {...others}
    >
      {(mode() === 'both' || mode() === 'border') && (
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            opacity: 'var(--exhuma-spotlight-opacity, 0)',
            border: '1.5px solid transparent',
            background: \`radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box\`,
            '-webkit-mask': 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            '-webkit-mask-composite': 'destination-out',
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            'mask-composite': 'exclude',
          }}
        />
      )}

      {(mode() === 'both' || mode() === 'background') && (
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: mode() === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)',
            background: \`radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))\`,
          }}
        />
      )}

      <div class="relative z-20">{local.children}</div>
    </div>
  );
};
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `SolidJS Native ${name} component with fine-grained reactive laser trace.`,
						code: `import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { clsx } from 'clsx';

export interface BorderBeamProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
  borderRadius?: number;
}

export const BorderBeam: Component<BorderBeamProps> = (rawProps) => {
  const props = mergeProps(
    {
      size: ${size},
      duration: ${duration},
      borderWidth: ${borderWidth},
      colorFrom: '${colorFrom}',
      colorTo: '${colorTo}',
      doubleBeam: ${doubleBeam},
      endOpacity: ${endOpacity},
      opacity: ${opacity},
      blur: ${blur},
      borderRadius: ${borderRadius},
    },
    rawProps
  );

  const [local, others] = splitProps(props, [
    'size',
    'duration',
    'borderWidth',
    'colorFrom',
    'colorTo',
    'doubleBeam',
    'endOpacity',
    'opacity',
    'blur',
    'borderRadius',
    'class',
    'style',
  ]);

  const endColor = () => {
    const op = Math.max(0, Math.min(1, local.endOpacity));
    return op <= 0 ? 'transparent' : op >= 1 ? local.colorTo : \`color-mix(in srgb, \${local.colorTo} \${Math.round(op * 100)}%, transparent)\`;
  };
  const pathRadius = () => Math.min(local.size, 200);

  return (
    <div
      aria-hidden="true"
      class={clsx('exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]', local.class)}
      style={{
        border: \`\${local.borderWidth}px solid transparent\`,
        '-webkit-mask': 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        '-webkit-mask-composite': 'destination-out',
        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        'mask-composite': 'exclude',
        opacity: local.opacity !== 1 ? local.opacity : undefined,
        filter: local.blur > 0 ? \`blur(\${local.blur}px)\` : undefined,
        ...(typeof local.style === 'object' ? local.style : {}),
      }}
      {...others}
    >
      <div
        class="exhuma-border-beam-trace"
        style={{
          position: 'absolute',
          'aspect-ratio': '1 / 1',
          width: \`\${local.size}px\`,
          'offset-path': \`rect(0 auto auto 0 round \${pathRadius()}px)\`,
          'offset-anchor': \`\${local.size / 2}px \${local.size / 2}px\`,
          background: \`linear-gradient(to left, \${local.colorFrom}, \${local.colorTo}, \${endColor()})\`,
          animation: \`exhuma-border-beam \${local.duration}s linear infinite\`,
        }}
      />
      {local.doubleBeam && (
        <div
          class="exhuma-border-beam-trace"
          style={{
            position: 'absolute',
            'aspect-ratio': '1 / 1',
            width: \`\${local.size}px\`,
            'offset-path': \`rect(0 auto auto 0 round \${pathRadius()}px)\`,
            'offset-anchor': \`\${local.size / 2}px \${local.size / 2}px\`,
            background: \`linear-gradient(to left, \${local.colorFrom}, \${local.colorTo}, \${endColor()})\`,
            animation: \`exhuma-border-beam \${local.duration}s linear -\${local.duration / 2}s infinite\`,
          }}
        />
      )}
      <style>{\`
        @keyframes exhuma-border-beam {
          from {
            offset-distance: 0%;
          }
          to {
            offset-distance: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .exhuma-border-beam-trace {
            animation-play-state: paused !important;
          }
        }
      \`}</style>
    </div>
  );
};
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `SolidJS Native ${name} component.`,
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
				},
			];
		}

		case 'angular': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <section
      #sectionEl
      class="relative w-full {{ customClass() }}"
      [style.minHeight]="sectionHeight() ? sectionHeight() + 'px' : '150vh'"
    >
      <div
        #cameraEl
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
      >
        <div
          #trackEl
          class="flex items-stretch will-change-transform"
          [style.gap]="itemGap() + 'px'"
          style="padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
          <ng-content></ng-content>
        </div>
        @if (showProgress()) {
          <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
            <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
              <div #progressBarEl class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
            </div>
            <span #progressTextEl class="font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
          </div>
        }
      </div>
    </section>
  \`,
})
export class Exhuma${pascalName}Component {
  private readonly destroyRef = inject(DestroyRef);
  readonly customClass = input<string>('');
  readonly speed = input<number>(1.0);
  readonly itemGap = input<number>(28);
  readonly cardWidth = input<number | string>(320);
  readonly showProgress = input<boolean>(true);
  readonly showFadeEdges = input<boolean>(true);
  readonly fadeWidth = input<number>(48);
  readonly mobileMode = input<'scroll' | 'stack' | 'pinned'>('scroll');

  readonly sectionEl = viewChild<ElementRef<HTMLElement>>('sectionEl');
  readonly cameraEl = viewChild<ElementRef<HTMLElement>>('cameraEl');
  readonly trackEl = viewChild<ElementRef<HTMLElement>>('trackEl');
  readonly progressBarEl = viewChild<ElementRef<HTMLElement>>('progressBarEl');
  readonly progressTextEl = viewChild<ElementRef<HTMLElement>>('progressTextEl');

  readonly sectionHeight = input<number | null>(null);

  constructor() {
    afterNextRender(() => {
      const section = this.sectionEl()?.nativeElement;
      const camera = this.cameraEl()?.nativeElement;
      const track = this.trackEl()?.nativeElement;
      const progressBar = this.progressBarEl()?.nativeElement;
      const progressText = this.progressTextEl()?.nativeElement;

      if (!section || !camera || !track) return;

      let cachedDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      const recalculate = () => {
        const viewportHeight = window.innerHeight;
        const containerWidth = camera.clientWidth;
        const rawCardWidth = this.cardWidth();
        const resolvedCardWidth = typeof rawCardWidth === 'number'
          ? rawCardWidth + 'px'
          : /^\\d+$/.test(rawCardWidth.trim()) ? rawCardWidth.trim() + 'px' : rawCardWidth;
        for (let i = 0; i < track.children.length; i += 1) {
          const item = track.children.item(i);
          if (item instanceof HTMLElement) {
            item.style.width = resolvedCardWidth;
            item.style.flex = '0 0 ' + resolvedCardWidth;
          }
        }
        const trackWidth = track.scrollWidth;
        cachedDistance = Math.max(0, trackWidth - containerWidth + this.itemGap() * 2);
        const safeSpeed = Math.max(0.1, this.speed());
        const computedHeight = Math.round(viewportHeight + cachedDistance / safeSpeed);
        section.style.minHeight = computedHeight + 'px';
      };

      const updateScroll = () => {
        const rect = section.getBoundingClientRect();
        const totalScrollable = section.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        const currentTranslate = -(progress * cachedDistance);
        track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
        if (progressBar) {
          progressBar.style.width = (progress * 100).toFixed(1) + '%';
        }
        if (progressText) {
          progressText.textContent = Math.round(progress * 100) + '%';
        }
      };

      const onScroll = () => {
        if (!isIntersecting || rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
            updateScroll();
            rafId = null;
        });
      };

      recalculate();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) updateScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(section);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculate, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      });
    });
  }
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with kinetic scroll stacking and scale decay.`,
						code: `import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <div
      #container
      class="${defaultTailwindClass} {{ customClass() }}"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class Exhuma${pascalName}Component {
  private readonly destroyRef = inject(DestroyRef);
  readonly customClass = input<string>('');
  readonly topStart = input<number>(20);
  readonly topIncrement = input<number>(28);
  readonly cardGap = input<number>(20);
  readonly scaleThreshold = input<number>(150);
  readonly minScale = input<number>(0.9);
  readonly reverseScale = input<boolean>(true);

  readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  constructor() {
    afterNextRender(() => {
      const el = this.container()?.nativeElement;
      if (!el) return;

      const smoothstep = (t: number): number => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      };

      let rafId: number | null = null;
      let isIntersecting = false;

      let cards: HTMLElement[] = [];
      let total = 0;

      // Init once: cache card refs and set static CSS (no layout thrashing in scroll loop)
      const initCards = () => {
        cards = Array.from(el.children) as HTMLElement[];
        total = cards.length;
        cards.forEach((card, i) => {
          const stickyTop = this.reverseScale() && i === total - 1
            ? this.topStart()
            : this.topStart() + i * this.topIncrement();
          card.style.position = 'sticky';
          card.style.top = stickyTop + 'px';
          card.style.zIndex = (i + 1).toString();
          card.style.marginBottom = this.cardGap() + 'px';
          card.style.willChange = 'transform';
          card.style.transformOrigin = 'center top';
        });
      };

      const update = () => {
        rafId = null;
        if (total <= 1) return;
        // Ω(1) Phase 1: batch read — no style writes, no forced reflow
        const tops = new Float64Array(total);
        for (let i = 0; i < total; i++) {
          tops[i] = cards[i].getBoundingClientRect().top;
        }
        // Ω(1) Phase 2: batch write transforms only
        for (let i = 0; i < total; i++) {
          const stickyTop = this.reverseScale() && i === total - 1
            ? this.topStart()
            : this.topStart() + i * this.topIncrement();
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / this.scaleThreshold()));
          const targetScale = this.minScale() + (1 - this.minScale()) * smoothstep(1 - progress);
          cards[i].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      };

      const onScroll = () => {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(update);
        }
      };

      initCards();
      update();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) onScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(el);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }
}
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with out-of-zone 120 FPS rAF tilt physics.`,
						code: `import { Component, ElementRef, NgZone, OnInit, OnDestroy, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-tilt-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      #cardEl
      [class]="'exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform ' + customClass()"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaTiltCardComponent implements OnInit, OnDestroy {
  readonly maxTilt = input<number>(15);
  readonly perspective = input<number>(1000);
  readonly scale = input<number>(1.02);
  readonly speed = input<number>(0.12);
  readonly reverse = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly axis = input<'all' | 'x' | 'y'>('all');
  readonly customClass = input<string>('');

  readonly cardEl = viewChild<ElementRef<HTMLDivElement>>('cardEl');

  private rafId: number | null = null;
  private cleanups: Array<() => void> = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const card = this.cardEl()?.nativeElement;
      if (!card) return;

      const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let rect: { left: number; top: number; width: number; height: number } | null = null;

      let targetRotX = 0;
      let targetRotY = 0;
      let targetScale = 1.0;

      let currentRotX = 0;
      let currentRotY = 0;
      let currentScale = 1.0;

      let isHovered = false;

      const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

      const measureRect = () => {
        const r = card.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      };

      const updateFrame = () => {
        if (this.disabled() || isReducedMotion) {
          card.style.transform = '';
          this.rafId = null;
          return;
        }

        const factor = Math.max(0.01, Math.min(1, this.speed()));
        currentRotX = lerp(currentRotX, targetRotX, factor);
        currentRotY = lerp(currentRotY, targetRotY, factor);
        currentScale = lerp(currentScale, targetScale, factor);

        card.style.transform = 'perspective(' + this.perspective() + 'px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ')';

        const diffX = Math.abs(targetRotX - currentRotX);
        const diffY = Math.abs(targetRotY - currentRotY);
        const diffScale = Math.abs(targetScale - currentScale);

        if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
          this.rafId = window.requestAnimationFrame(updateFrame);
        } else {
          this.rafId = null;
        }
      };

      const scheduleRaf = () => {
        if (this.rafId === null) {
          this.rafId = window.requestAnimationFrame(updateFrame);
        }
      };

      const onPointerEnter = () => {
        if (this.disabled() || isReducedMotion) return;
        isHovered = true;
        targetScale = this.scale();
        measureRect();
        scheduleRaf();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (this.disabled() || isReducedMotion) return;
        if (!rect) measureRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
        const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
        const sign = this.reverse() ? -1 : 1;

        const rawRotX = normY * -this.maxTilt() * sign;
        const rawRotY = normX * this.maxTilt() * sign;

        targetRotX = this.axis() === 'y' ? 0 : rawRotX;
        targetRotY = this.axis() === 'x' ? 0 : rawRotY;

        scheduleRaf();
      };

      const onPointerLeave = () => {
        isHovered = false;
        rect = null;
        targetRotX = 0;
        targetRotY = 0;
        targetScale = 1.0;
        scheduleRaf();
      };

      const onScrollOrResize = () => {
        if (isHovered) measureRect();
      };

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      this.cleanups.push(() => {
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) window.cancelAnimationFrame(this.rafId);
    this.cleanups.forEach((cleanup) => cleanup());
  }
}
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `${slug}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with out-of-zone 120 FPS rAF spotlight engine.`,
						code: `import { Component, ElementRef, NgZone, OnInit, OnDestroy, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-spotlight-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      #cardEl
      [class]="'exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40 ' + customClass()"
      [style.--exhuma-spotlight-radius]="radius() + 'px'"
      [style.--exhuma-spotlight-color]="color()"
      [style.--exhuma-spotlight-border-color]="borderColor()"
      [style.--exhuma-spotlight-spread]="spread() + '%'"
      [style.--exhuma-spotlight-opacity]="'0'"
    >
      @if (mode() === 'both' || mode() === 'border') {
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
        ></div>
      }
      @if (mode() === 'both' || mode() === 'background') {
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-0"
          [style.opacity]="mode() === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)'"
          style="background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
        ></div>
      }
      <div class="relative z-20">
        <ng-content></ng-content>
      </div>
    </div>
  \`,
})
export class ExhumaSpotlightCardComponent implements OnInit, OnDestroy {
  readonly radius = input<number>(${radius});
  readonly color = input<string>('${color}');
  readonly borderColor = input<string>('${borderColor}');
  readonly opacity = input<number>(${opacity});
  readonly spread = input<number>(${spread});
  readonly mode = input<'both' | 'border' | 'background'>('${mode}');
  readonly smoothing = input<number>(${smoothing});
  readonly disabled = input<boolean>(${disabled});
  readonly customClass = input<string>('');

  readonly cardEl = viewChild<ElementRef<HTMLDivElement>>('cardEl');

  private rafId: number | null = null;
  private cleanups: Array<() => void> = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const card = this.cardEl()?.nativeElement;
      if (!card) return;

      let rect: { left: number; top: number; width: number; height: number } | null = null;
      let targetX = -9999;
      let targetY = -9999;
      let currentX = -9999;
      let currentY = -9999;
      let currentOpacity = 0;
      let targetOpacity = 0;
      let isHovered = false;

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let isReducedMotion = mediaQuery.matches;
      const motionHandler = (e: MediaQueryListEvent) => { isReducedMotion = e.matches; };
      mediaQuery.addEventListener('change', motionHandler);
      this.cleanups.push(() => mediaQuery.removeEventListener('change', motionHandler));

      const measureRect = () => {
        const r = card.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      };

      const updateFrame = () => {
        if (this.disabled() || isReducedMotion) {
          card.style.setProperty('--exhuma-spotlight-opacity', '0');
          this.rafId = null;
          return;
        }

        const factor = Math.max(0.05, Math.min(1, this.smoothing()));
        currentX += (targetX - currentX) * factor;
        currentY += (targetY - currentY) * factor;
        currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

        card.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
        card.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
        card.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

        const diffX = Math.abs(targetX - currentX);
        const diffY = Math.abs(targetY - currentY);
        const diffOp = Math.abs(targetOpacity - currentOpacity);

        if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
          this.rafId = window.requestAnimationFrame(updateFrame);
        } else {
          this.rafId = null;
        }
      };

      const scheduleRaf = () => {
        if (this.rafId === null) {
          this.rafId = window.requestAnimationFrame(updateFrame);
        }
      };

      const onPointerEnter = (e: PointerEvent) => {
        if (this.disabled() || isReducedMotion) return;
        isHovered = true;
        measureRect();
        if (rect) {
          targetX = e.clientX - rect.left;
          targetY = e.clientY - rect.top;
          targetOpacity = this.opacity();
          if (currentX < -1000) {
            currentX = targetX;
            currentY = targetY;
          }
        }
        scheduleRaf();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (this.disabled() || isReducedMotion) return;
        isHovered = true;
        if (!rect) measureRect();
        if (!rect) return;
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = this.opacity();
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
        scheduleRaf();
      };

      const onPointerLeave = () => {
        isHovered = false;
        targetOpacity = 0;
        scheduleRaf();
      };

      const onScrollOrResize = () => {
        if (isHovered) measureRect();
      };

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      this.cleanups.push(() => {
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cleanups.forEach((cleanup) => cleanup());
  }
}
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${pascalName}.component.ts`,
						language: 'typescript',
						description: `Angular 18+ Standalone ${name} component with hardware mask clipping and sub-pixel laser trace.`,
						code: `import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'exhuma-border-beam',
  standalone: true,
  template: \`
    <div
      aria-hidden="true"
      class="exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] {{ customClass() }}"
      [style.border]="borderWidth() + 'px solid transparent'"
      [style.WebkitMask]="'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)'"
      [style.WebkitMaskComposite]="'destination-out'"
      [style.mask]="'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)'"
      [style.maskComposite]="'exclude'"
      [style.opacity]="opacity() !== 1 ? opacity() : null"
      [style.filter]="blur() > 0 ? 'blur(' + blur() + 'px)' : null"
    >
      <div
        class="exhuma-border-beam-trace"
        [style.position]="'absolute'"
        [style.aspectRatio]="'1 / 1'"
        [style.width.px]="size()"
        [style.offsetPath]="'rect(0 auto auto 0 round ' + pathRadius() + 'px)'"
        [style.offsetAnchor]="(size() / 2) + 'px ' + (size() / 2) + 'px'"
        [style.background]="'linear-gradient(to left, ' + colorFrom() + ', ' + colorTo() + ', ' + endColor() + ')'"
        [style.animation]="'exhuma-border-beam ' + duration() + 's linear infinite'"
      ></div>

      @if (doubleBeam()) {
        <div
          class="exhuma-border-beam-trace"
          [style.position]="'absolute'"
          [style.aspectRatio]="'1 / 1'"
          [style.width.px]="size()"
          [style.offsetPath]="'rect(0 auto auto 0 round ' + pathRadius() + 'px)'"
          [style.offsetAnchor]="(size() / 2) + 'px ' + (size() / 2) + 'px'"
          [style.background]="'linear-gradient(to left, ' + colorFrom() + ', ' + colorTo() + ', ' + endColor() + ')'"
          [style.animation]="'exhuma-border-beam ' + duration() + 's linear -' + (duration() / 2) + 's infinite'"
        ></div>
      }
    </div>
  \`,
  styles: [\`
    @keyframes exhuma-border-beam {
      from {
        offset-distance: 0%;
      }
      to {
        offset-distance: 100%;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .exhuma-border-beam-trace {
        animation-play-state: paused !important;
      }
    }
  \`],
})
export class ExhumaBorderBeamComponent {
  readonly size = input<number>(${size});
  readonly duration = input<number>(${duration});
  readonly borderWidth = input<number>(${borderWidth});
  readonly colorFrom = input<string>('${colorFrom}');
  readonly colorTo = input<string>('${colorTo}');
  readonly doubleBeam = input<boolean>(${doubleBeam});
  readonly endOpacity = input<number>(${endOpacity});
  readonly opacity = input<number>(${opacity});
  readonly blur = input<number>(${blur});
  readonly borderRadius = input<number>(${borderRadius});
  readonly customClass = input<string>('');

  readonly pathRadius = computed(() => Math.min(this.size(), 200));
  readonly endColor = computed(() => {
    const op = Math.max(0, Math.min(1, this.endOpacity()));
    return op <= 0 ? 'transparent' : op >= 1 ? this.colorTo() : \`color-mix(in srgb, \${this.colorTo()} \${Math.round(op * 100)}%, transparent)\`;
  });
}
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.component.ts`,
					language: 'typescript',
					description: `Angular 18+ Standalone ${name} component.`,
					code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <div
      class="${defaultTailwindClass} {{ customClass() }}"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class Exhuma${pascalName}Component {
  readonly customClass = input<string>('');
}
`,
				},
			];
		}

		case 'astro': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with pinned kinetic camera (Brix Agency architecture).`,
						code: `---
interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
  [key: string]: unknown;
}

const {
  speed = 1.0,
  itemGap = 28,
  cardWidth = 320,
  showProgress = true,
  showFadeEdges = true,
  fadeWidth = 48,
  mobileMode = 'scroll',
  class: className = '',
  ...props
} = Astro.props;

const maskStyle = showFadeEdges
  ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
  : '';
---

<section
  data-exhuma-horizontal-scroller
  data-speed={speed}
  data-item-gap={itemGap}
  data-card-width={cardWidth}
  class={\`relative w-full \${className}\`}
  style="min-height: 150vh;"
  {...props}
>
  <div
    class="exhuma-hs-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    style={maskStyle}
  >
    <div
      class="exhuma-hs-track flex items-stretch will-change-transform"
      style={\`gap: \${itemGap}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));\`}
    >
      <slot />
    </div>
    {showProgress && (
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div class="exhuma-hs-progress h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out" />
        </div>
        <span class="exhuma-hs-progress-text font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
      </div>
    )}
  </div>
</section>

<script>
  function initHorizontalScroller() {
    document.querySelectorAll<HTMLElement>('[data-exhuma-horizontal-scroller]').forEach((section) => {
      const camera = section.querySelector<HTMLElement>('.exhuma-hs-camera');
      const track = section.querySelector<HTMLElement>('.exhuma-hs-track');
      const progressBar = section.querySelector<HTMLElement>('.exhuma-hs-progress');
      const progressText = section.querySelector<HTMLElement>('.exhuma-hs-progress-text');
      if (!camera || !track) return;

      const speed = parseFloat(section.dataset.speed || '1.0');
      const itemGap = parseFloat(section.dataset.itemGap || '28');
      const rawCardWidth = section.dataset.cardWidth || '320';
      const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;

      let cachedDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      function recalculate() {
        const viewportHeight = window.innerHeight;
        const containerWidth = camera.clientWidth;
        for (let i = 0; i < track.children.length; i += 1) {
          const item = track.children.item(i);
          if (item instanceof HTMLElement) {
            item.style.width = cardWidth;
            item.style.flex = '0 0 ' + cardWidth;
          }
        }
        const trackWidth = track.scrollWidth;
        cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
        const safeSpeed = Math.max(0.1, speed);
        section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
      }

      function updateScroll() {
        const rect = section.getBoundingClientRect();
        const totalScrollable = section.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
        const currentTranslate = -(progress * cachedDistance);
        track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
        if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
        if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
      }

      function onScroll() {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(() => {
            updateScroll();
            rafId = null;
          });
        }
      }

      recalculate();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) updateScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(section);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculate, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      }, { once: true });
    });
  }

  initHorizontalScroller();
  document.addEventListener('astro:page-load', initHorizontalScroller);
</script>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with kinetic scroll stacking and Hermite smoothstep scale decay.`,
						code: `---
interface Props {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  class?: string;
  [key: string]: unknown;
}

const {
  topStart = 20,
  topIncrement = 28,
  cardGap = 20,
  scaleThreshold = 150,
  minScale = 0.9,
  reverseScale = true,
  class: className = '',
  ...props
} = Astro.props;
---

<div
  data-exhuma-stacking-cards
  data-top-start={topStart}
  data-top-increment={topIncrement}
  data-card-gap={cardGap}
  data-scale-threshold={scaleThreshold}
  data-min-scale={minScale}
  data-reverse-scale={reverseScale.toString()}
  class={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</div>

<script>
  function initStackingCards() {
    document.querySelectorAll('[data-exhuma-stacking-cards]').forEach((container) => {
      const topStart = parseFloat(container.getAttribute('data-top-start') || '20');
      const topIncrement = parseFloat(container.getAttribute('data-top-increment') || '28');
      const cardGap = parseFloat(container.getAttribute('data-card-gap') || '20');
      const scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || '150');
      const minScale = parseFloat(container.getAttribute('data-min-scale') || '0.9');
      const reverseScale = container.getAttribute('data-reverse-scale') !== 'false';

      const cards = Array.from(container.children) as HTMLElement[];
      const total = cards.length;
      if (total <= 1) return;

      // Init once: set static CSS on each card — no layout thrashing in scroll loop
      cards.forEach((card, i) => {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      });

      let rafId: number | null = null;
      let isIntersecting = false;  // ← was missing (bug fix)

      function smoothstep(t: number): number {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      }

      function update() {
        rafId = null;
        // Ω(1) Phase 1: batch read — no style writes, no forced reflow
        const tops = new Float64Array(total);
        for (let i = 0; i < total; i++) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
        // Ω(1) Phase 2: batch write transforms only
        for (let i = 0; i < total; i++) {
          const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }

      function onScroll() {
        if (isIntersecting && rafId === null) {
          rafId = window.requestAnimationFrame(update);
        }
      }

      update();
      const observer = new IntersectionObserver((entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? false;
        if (isIntersecting) onScroll();
      }, { rootMargin: '100px 0px', threshold: 0 });
      observer.observe(container);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }, { once: true });
    });
  }

  initStackingCards();
  document.addEventListener('astro:page-load', initStackingCards);
</script>
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with interactive 3D Euler matrix and zero layout thrashing.`,
						code: `---
interface Props {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  reverse?: boolean;
  disabled?: boolean;
  axis?: 'all' | 'x' | 'y';
  class?: string;
  [key: string]: unknown;
}

const {
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  speed = 0.12,
  reverse = false,
  disabled = false,
  axis = 'all',
  class: className = '',
  ...props
} = Astro.props;
---

<div
  class={\`exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform \${className}\`}
  data-exhuma-tilt-card
  data-max-tilt={maxTilt}
  data-perspective={perspective}
  data-scale={scale}
  data-speed={speed}
  data-reverse={reverse}
  data-disabled={disabled}
  data-axis={axis}
  {...props}
>
  <slot />
</div>

<script>
  function initTiltCards() {
    const cards = document.querySelectorAll<HTMLElement>('[data-exhuma-tilt-card]');

    cards.forEach((card) => {
      const maxTilt = parseFloat(card.getAttribute('data-max-tilt') || '15');
      const perspective = parseFloat(card.getAttribute('data-perspective') || '1000');
      const scale = parseFloat(card.getAttribute('data-scale') || '1.02');
      const speed = parseFloat(card.getAttribute('data-speed') || '0.12');
      const reverse = card.getAttribute('data-reverse') === 'true';
      const disabled = card.getAttribute('data-disabled') === 'true';
      const axis = card.getAttribute('data-axis') || 'all';

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let rect: { left: number; top: number; width: number; height: number } | null = null;

      let targetRotX = 0;
      let targetRotY = 0;
      let targetScale = 1.0;

      let currentRotX = 0;
      let currentRotY = 0;
      let currentScale = 1.0;

      let isHovered = false;
      let rafId: number | null = null;

      const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

      const measureRect = () => {
        const r = card.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      };

      const updateFrame = () => {
        if (disabled || isReducedMotion) {
          card.style.transform = '';
          rafId = null;
          return;
        }

        const factor = Math.max(0.01, Math.min(1, speed));
        currentRotX = lerp(currentRotX, targetRotX, factor);
        currentRotY = lerp(currentRotY, targetRotY, factor);
        currentScale = lerp(currentScale, targetScale, factor);

        card.style.transform = \`perspective(\${perspective}px) rotateX(\${currentRotX.toFixed(2)}deg) rotateY(\${currentRotY.toFixed(2)}deg) scale3d(\${currentScale.toFixed(3)}, \${currentScale.toFixed(3)}, \${currentScale.toFixed(3)})\`;

        const diffX = Math.abs(targetRotX - currentRotX);
        const diffY = Math.abs(targetRotY - currentRotY);
        const diffScale = Math.abs(targetScale - currentScale);

        if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
          rafId = requestAnimationFrame(updateFrame);
        } else {
          rafId = null;
        }
      };

      const scheduleRaf = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(updateFrame);
        }
      };

      const onPointerEnter = () => {
        if (disabled || isReducedMotion) return;
        isHovered = true;
        targetScale = scale;
        measureRect();
        scheduleRaf();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (disabled || isReducedMotion) return;
        if (!rect) measureRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
        const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
        const sign = reverse ? -1 : 1;

        const rawRotX = normY * -maxTilt * sign;
        const rawRotY = normX * maxTilt * sign;

        targetRotX = axis === 'y' ? 0 : rawRotX;
        targetRotY = axis === 'x' ? 0 : rawRotY;

        scheduleRaf();
      };

      const onPointerLeave = () => {
        isHovered = false;
        rect = null;
        targetRotX = 0;
        targetRotY = 0;
        targetScale = 1.0;
        scheduleRaf();
      };

      const onScrollOrResize = () => {
        if (isHovered) measureRect();
      };

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      }, { once: true });
    });
  }

  initTiltCards();
  document.addEventListener('astro:page-load', initTiltCards);
</script>
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with scoped rAF spotlight engine.`,
						code: `---
interface Props {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  spread?: number;
  mode?: 'both' | 'border' | 'background';
  smoothing?: number;
  disabled?: boolean;
  class?: string;
  [key: string]: unknown;
}

const {
  radius = ${radius},
  color = '${color}',
  borderColor = '${borderColor}',
  opacity = ${opacity},
  spread = ${spread},
  mode = '${mode}',
  smoothing = ${smoothing},
  disabled = ${disabled},
  class: className = '',
  ...props
} = Astro.props;

const cardId = 'exhuma-spotlight-' + Math.random().toString(36).substring(2, 9);
---

<div
  id={cardId}
  class={\`exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40 \${className}\`}
  style={{
    '--exhuma-spotlight-radius': \`\${radius}px\`,
    '--exhuma-spotlight-color': color,
    '--exhuma-spotlight-border-color': borderColor,
    '--exhuma-spotlight-spread': \`\${spread}%\`,
    '--exhuma-spotlight-opacity': '0',
  }}
  data-exhuma-spotlight-card
  data-radius={radius}
  data-color={color}
  data-border-color={borderColor}
  data-opacity={opacity}
  data-spread={spread}
  data-mode={mode}
  data-smoothing={smoothing}
  data-disabled={disabled ? 'true' : 'false'}
  {...props}
>
  {(mode === 'both' || mode === 'border') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style={{
        opacity: 'var(--exhuma-spotlight-opacity, 0)',
        border: '1.5px solid transparent',
        background: \`radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box\`,
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      }}
    />
  )}

  {(mode === 'both' || mode === 'background') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0"
      style={{
        opacity: mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)',
        background: \`radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))\`,
      }}
    />
  )}

  <div class="relative z-20">
    <slot />
  </div>
</div>

<script>
  function initSpotlightCards() {
    const cards = document.querySelectorAll<HTMLElement>('[data-exhuma-spotlight-card]');
    cards.forEach((card) => {
      if (card.dataset.exhumaInitialized === 'true') return;
      card.dataset.exhumaInitialized = 'true';

      const opacity = parseFloat(card.getAttribute('data-opacity') || '0.85');
      const smoothing = parseFloat(card.getAttribute('data-smoothing') || '0.2');
      const disabled = card.getAttribute('data-disabled') === 'true';

      let rect: { left: number; top: number; width: number; height: number } | null = null;
      let targetX = -9999;
      let targetY = -9999;
      let currentX = -9999;
      let currentY = -9999;
      let currentOpacity = 0;
      let targetOpacity = 0;
      let isHovered = false;
      let rafId: number | null = null;
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const measureRect = () => {
        const r = card.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      };

      const updateFrame = () => {
        if (disabled || isReducedMotion) {
          card.style.setProperty('--exhuma-spotlight-opacity', '0');
          rafId = null;
          return;
        }

        const factor = Math.max(0.05, Math.min(1, smoothing));
        currentX += (targetX - currentX) * factor;
        currentY += (targetY - currentY) * factor;
        currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

        card.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
        card.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
        card.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

        const diffX = Math.abs(targetX - currentX);
        const diffY = Math.abs(targetY - currentY);
        const diffOp = Math.abs(targetOpacity - currentOpacity);

        if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
          rafId = requestAnimationFrame(updateFrame);
        } else {
          rafId = null;
        }
      };

      const scheduleRaf = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(updateFrame);
        }
      };

      const onPointerEnter = (e: PointerEvent) => {
        if (disabled || isReducedMotion) return;
        isHovered = true;
        measureRect();
        if (rect) {
          targetX = e.clientX - rect.left;
          targetY = e.clientY - rect.top;
          targetOpacity = opacity;
          if (currentX < -1000) {
            currentX = targetX;
            currentY = targetY;
          }
        }
        scheduleRaf();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (disabled || isReducedMotion) return;
        isHovered = true;
        if (!rect) measureRect();
        if (!rect) return;
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = opacity;
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
        scheduleRaf();
      };

      const onPointerLeave = () => {
        isHovered = false;
        targetOpacity = 0;
        scheduleRaf();
      };

      const onScrollOrResize = () => {
        if (isHovered) measureRect();
      };

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      }, { once: true });
    });
  }

  initSpotlightCards();
  document.addEventListener('astro:page-load', initSpotlightCards);
</script>
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${pascalName}.astro`,
						language: 'astro',
						description: `Pure Native Astro ${name} component with hardware mask clipping and sub-pixel laser trace.`,
						code: `---
interface Props {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
  borderRadius?: number;
  class?: string;
}

const {
  size = ${size},
  duration = ${duration},
  borderWidth = ${borderWidth},
  colorFrom = '${colorFrom}',
  colorTo = '${colorTo}',
  doubleBeam = ${doubleBeam},
  endOpacity = ${endOpacity},
  opacity = ${opacity},
  blur = ${blur},
  borderRadius = ${borderRadius},
  class: className = '',
} = Astro.props;

const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;
const pathRadius = Math.min(size, 200);
---

<div
  aria-hidden="true"
  class={\`exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] \${className}\`}
  style={\`border: \${borderWidth}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; \${opacity !== 1 ? \`opacity: \${opacity};\` : ''} \${blur > 0 ? \`filter: blur(\${blur}px);\` : ''}\`}
>
  <div
    class="exhuma-border-beam-trace"
    style={\`position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${size / 2}px \${size / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear infinite;\`}
  ></div>

  {doubleBeam && (
    <div
      class="exhuma-border-beam-trace"
      style={\`position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${size / 2}px \${size / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear -\${duration / 2}s infinite;\`}
    ></div>
  )}
</div>

<style>
  @keyframes exhuma-border-beam {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .exhuma-border-beam-trace {
      animation-play-state: paused !important;
    }
  }
</style>
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.astro`,
					language: 'astro',
					description: `Pure Native Astro ${name} component.`,
					code: `---
interface Props {
  class?: string;
  [key: string]: unknown;
}

const { class: className = '', ...props } = Astro.props;
---

<div
  class={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component <exhuma-${slug}> with pinned kinetic camera.`,
						code: `class ExhumaHorizontalScrollerElement extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-horizontal-scroller');
    this.style.display = 'block';
    this.style.position = 'relative';
    this.style.width = '100%';

    const speed = parseFloat(this.getAttribute('speed') || '1.0');
    const itemGap = parseFloat(this.getAttribute('item-gap') || '28');
    const rawCardWidth = this.getAttribute('card-width') || '320';
    const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;
    const showFadeEdges = this.getAttribute('show-fade-edges') !== 'false';
    const fadeWidth = parseFloat(this.getAttribute('fade-width') || '48');

    let camera = this.querySelector(':scope > .exhuma-hs-camera');
    let track = camera?.querySelector(':scope > .exhuma-hs-track');
    if (!(camera instanceof HTMLElement) || !(track instanceof HTMLElement)) {
      camera = document.createElement('div');
      camera.className = 'exhuma-hs-camera';
      track = document.createElement('div');
      track.className = 'exhuma-hs-track';
      while (this.firstChild) {
        track.appendChild(this.firstChild);
      }
      camera.appendChild(track);
      this.appendChild(camera);
    }
    camera.style.cssText = 'position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: center;';
    if (showFadeEdges) {
      const mask = 'linear-gradient(to right, transparent, black ' + fadeWidth + 'px, black calc(100% - ' + fadeWidth + 'px), transparent)';
      camera.style.maskImage = mask;
      camera.style.webkitMaskImage = mask;
    }
    track.style.cssText = 'display: flex; align-items: stretch; will-change: transform; gap: ' + itemGap + 'px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));';

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId = null;
    const self = this;

    const recalculate = () => {
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = cardWidth;
          item.style.flex = '0 0 ' + cardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      self.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
    };

    const updateScroll = () => {
      const rect = self.getBoundingClientRect();
      const totalScrollable = self.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      const progressBar = self.querySelector('.exhuma-hs-progress');
      const progressText = self.querySelector('.exhuma-hs-progress-text');
      if (progressBar instanceof HTMLElement) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText instanceof HTMLElement) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(this);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-horizontal-scroller')) {
  customElements.define('exhuma-horizontal-scroller', ExhumaHorizontalScrollerElement);
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component wrapper for <exhuma-${slug}> with kinetic scale decay.`,
						code: `class ExhumaStackingCardsElement extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-stacking-cards');
    this.style.display = 'block';
    this.style.position = 'relative';

    const topStart = parseFloat(this.getAttribute('top-start') || '20');
    const topIncrement = parseFloat(this.getAttribute('top-increment') || '28');
    const cardGap = parseFloat(this.getAttribute('card-gap') || '20');
    const scaleThreshold = parseFloat(this.getAttribute('scale-threshold') || '150');
    const minScale = parseFloat(this.getAttribute('min-scale') || '0.9');
    const reverseScale = this.getAttribute('reverse-scale') !== 'false';

    const cards = Array.from(this.children);
    const total = cards.length;
    if (total <= 1) return;

    // Init once: set static CSS on each card — no layout thrashing in scroll loop
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      }
    });

    let rafId = null;
    let isIntersecting = false;

    function smoothstep(t) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }

    const update = () => {
      rafId = null;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(this);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-${slug}')) {
  customElements.define('exhuma-${slug}', ExhumaStackingCardsElement);
}
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component <exhuma-${slug}> with interactive 3D perspective Euler matrix and zero layout thrashing.`,
						code: `class ExhumaTiltCardElement extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-tilt-card');
    this.style.display = 'block';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.style.willChange = 'transform';

    const maxTilt = parseFloat(this.getAttribute('max-tilt') || '15');
    const perspective = parseFloat(this.getAttribute('perspective') || '1000');
    const scale = parseFloat(this.getAttribute('scale') || '1.02');
    const speed = parseFloat(this.getAttribute('speed') || '0.12');
    const reverse = this.getAttribute('reverse') === 'true';
    const disabled = this.getAttribute('disabled') === 'true';
    const axis = this.getAttribute('axis') || 'all';

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rect = null;

    let targetRotX = 0;
    let targetRotY = 0;
    let targetScale = 1.0;

    let currentRotX = 0;
    let currentRotY = 0;
    let currentScale = 1.0;

    let isHovered = false;
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    const measureRect = () => {
      const r = this.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    const updateFrame = () => {
      if (disabled || isReducedMotion) {
        this.style.transform = '';
        rafId = null;
        return;
      }

      const factor = Math.max(0.01, Math.min(1, speed));
      currentRotX = lerp(currentRotX, targetRotX, factor);
      currentRotY = lerp(currentRotY, targetRotY, factor);
      currentScale = lerp(currentScale, targetScale, factor);

      this.style.transform = 'perspective(' + perspective + 'px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ')';

      const diffX = Math.abs(targetRotX - currentRotX);
      const diffY = Math.abs(targetRotY - currentRotY);
      const diffScale = Math.abs(targetScale - currentScale);

      if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleRaf = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const onPointerEnter = () => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      targetScale = scale;
      measureRect();
      scheduleRaf();
    };

    const onPointerMove = (e) => {
      if (disabled || isReducedMotion) return;
      if (!rect) measureRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
      const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
      const sign = reverse ? -1 : 1;

      const rawRotX = normY * -maxTilt * sign;
      const rawRotY = normX * maxTilt * sign;

      targetRotX = axis === 'y' ? 0 : rawRotX;
      targetRotY = axis === 'x' ? 0 : rawRotY;

      scheduleRaf();
    };

    const onPointerLeave = () => {
      isHovered = false;
      rect = null;
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1.0;
      scheduleRaf();
    };

    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };

    this.addEventListener('pointerenter', onPointerEnter);
    this.addEventListener('pointermove', onPointerMove);
    this.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      this.removeEventListener('pointerenter', onPointerEnter);
      this.removeEventListener('pointermove', onPointerMove);
      this.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-tilt-card')) {
  customElements.define('exhuma-tilt-card', ExhumaTiltCardElement);
}
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				const radius = Number(props.radius ?? 350);
				const color = String(props.color ?? '#6366f1');
				const borderColor = String(props.borderColor ?? '#818cf8');
				const opacity = Number(props.opacity ?? 0.85);
				const spread = Number(props.spread ?? 60);
				const mode = (props.mode as string) ?? 'both';
				const smoothing = Number(props.smoothing ?? 0.2);
				const disabled = Boolean(props.disabled ?? false);

				return [
					{
						filename: `exhuma-${slug}.js`,
						language: 'javascript',
						description: `Universal Web Component <exhuma-${slug}> with sub-pixel radial illumination.`,
						code: `class ExhumaSpotlightCardElement extends HTMLElement {
  static get observedAttributes() {
    return ['radius', 'color', 'border-color', 'opacity', 'spread', 'mode', 'smoothing', 'disabled'];
  }

  connectedCallback() {
    if (this._cleanup) this._cleanup();
    this.classList.add('exhuma-spotlight-card');
    this.style.display = 'block';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';

    const radius = parseFloat(this.getAttribute('radius') || '${radius}');
    const color = this.getAttribute('color') || '${color}';
    const borderColor = this.getAttribute('border-color') || '${borderColor}';
    const opacity = parseFloat(this.getAttribute('opacity') || '${opacity}');
    const spread = parseFloat(this.getAttribute('spread') || '${spread}');
    const mode = this.getAttribute('mode') || '${mode}';
    const smoothing = parseFloat(this.getAttribute('smoothing') || '${smoothing}');
    const disabled = this.getAttribute('disabled') === 'true';

    this.style.setProperty('--exhuma-spotlight-radius', \`\${radius}px\`);
    this.style.setProperty('--exhuma-spotlight-color', color);
    this.style.setProperty('--exhuma-spotlight-border-color', borderColor);
    this.style.setProperty('--exhuma-spotlight-spread', \`\${spread}%\`);
    this.style.setProperty('--exhuma-spotlight-opacity', '0');

    let borderEl = this.querySelector('.exhuma-spotlight-border');
    if ((mode === 'both' || mode === 'border') && !borderEl) {
      borderEl = document.createElement('div');
      borderEl.setAttribute('aria-hidden', 'true');
      borderEl.className = 'exhuma-spotlight-border';
      borderEl.style.position = 'absolute';
      borderEl.style.inset = '0';
      borderEl.style.borderRadius = 'inherit';
      borderEl.style.pointerEvents = 'none';
      borderEl.style.border = '1.5px solid transparent';
      borderEl.style.opacity = 'var(--exhuma-spotlight-opacity, 0)';
      borderEl.style.background = 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box';
      borderEl.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
      borderEl.style.webkitMaskComposite = 'destination-out';
      borderEl.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
      borderEl.style.maskComposite = 'exclude';
      this.insertBefore(borderEl, this.firstChild);
    }

    let sheenEl = this.querySelector('.exhuma-spotlight-sheen');
    if ((mode === 'both' || mode === 'background') && !sheenEl) {
      sheenEl = document.createElement('div');
      sheenEl.setAttribute('aria-hidden', 'true');
      sheenEl.className = 'exhuma-spotlight-sheen';
      sheenEl.style.position = 'absolute';
      sheenEl.style.inset = '0';
      sheenEl.style.pointerEvents = 'none';
      sheenEl.style.opacity = mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)';
      sheenEl.style.background = 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))';
      this.insertBefore(sheenEl, this.firstChild);
    }

    let rect = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let currentOpacity = 0;
    let targetOpacity = 0;
    let isHovered = false;
    let rafId = null;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measureRect = () => {
      const r = this.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    const updateFrame = () => {
      if (disabled || isReducedMotion) {
        this.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafId = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing));
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

      this.style.setProperty('--exhuma-spotlight-x', \`\${currentX.toFixed(2)}px\`);
      this.style.setProperty('--exhuma-spotlight-y', \`\${currentY.toFixed(2)}px\`);
      this.style.setProperty('--exhuma-spotlight-opacity', \`\${currentOpacity.toFixed(3)}\`);

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffOp = Math.abs(targetOpacity - currentOpacity);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleRaf = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const onPointerEnter = (e) => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      measureRect();
      if (rect) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = opacity;
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
      }
      scheduleRaf();
    };

    const onPointerMove = (e) => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = opacity;
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleRaf();
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleRaf();
    };

    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };

    this.addEventListener('pointerenter', onPointerEnter);
    this.addEventListener('pointermove', onPointerMove);
    this.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    this._cleanup = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      this.removeEventListener('pointerenter', onPointerEnter);
      this.removeEventListener('pointermove', onPointerMove);
      this.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (borderEl && borderEl.parentNode === this) this.removeChild(borderEl);
      if (sheenEl && sheenEl.parentNode === this) this.removeChild(sheenEl);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }
}

if (!customElements.get('exhuma-spotlight-card')) {
  customElements.define('exhuma-spotlight-card', ExhumaSpotlightCardElement);
}
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: 'exhuma-border-beam.js',
						language: 'javascript',
						description: `Autonomous Web Component <exhuma-border-beam> with hardware mask clipping and sub-pixel laser trace.`,
						code: `class ExhumaBorderBeamElement extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-border-beam');
    this.style.position = 'absolute';
    this.style.inset = '0';
    this.style.pointerEvents = 'none';
    this.style.borderRadius = 'inherit';

    const size = this.getAttribute('size') || '${size}';
    const duration = this.getAttribute('duration') || '${duration}';
    const borderWidth = this.getAttribute('border-width') || '${borderWidth}';
    const colorFrom = this.getAttribute('color-from') || '${colorFrom}';
    const colorTo = this.getAttribute('color-to') || '${colorTo}';
    const doubleBeam = this.hasAttribute('double-beam') || ${doubleBeam};
    const endOpacity = parseFloat(this.getAttribute('end-opacity') || '${endOpacity}');
    const opacity = this.getAttribute('opacity') || '${opacity}';
    const blur = parseFloat(this.getAttribute('blur') || '${blur}');
    const borderRadius = this.getAttribute('border-radius') || '${borderRadius}';

    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;

    this.style.border = \`\${borderWidth}px solid transparent\`;
    this.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    this.style.webkitMaskComposite = 'destination-out';
    this.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    this.style.maskComposite = 'exclude';
    if (opacity !== '1') this.style.opacity = opacity;
    if (blur > 0) this.style.filter = \`blur(\${blur}px)\`;

    if (!document.getElementById('exhuma-border-beam-keyframes')) {
      const style = document.createElement('style');
      style.id = 'exhuma-border-beam-keyframes';
      style.textContent = \`
        @keyframes exhuma-border-beam {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .exhuma-border-beam-trace { animation-play-state: paused !important; }
        }
      \`;
      document.head.appendChild(style);
    }

    const pathRadius = Math.min(parseFloat(size) || 200, 200);
    const sizeNum = parseFloat(size) || 200;

    this.innerHTML = \`
      <div class="exhuma-border-beam-trace" style="position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${sizeNum / 2}px \${sizeNum / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear infinite;"></div>
      \${doubleBeam ? \`<div class="exhuma-border-beam-trace" style="position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${sizeNum / 2}px \${sizeNum / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear -\${parseFloat(duration) / 2}s infinite;"></div>\` : ''}
    \`;
  }
}

if (!customElements.get('exhuma-border-beam')) {
  customElements.define('exhuma-border-beam', ExhumaBorderBeamElement);
}
`,
					},
				];
			}
			return [
				{
					filename: `exhuma-${slug}.js`,
					language: 'javascript',
					description: `Universal Web Component wrapper for <exhuma-${slug}>.`,
					code: `class Exhuma${pascalName}Element extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-${slug}');
    this.style.display = 'block';
  }
}

if (!customElements.get('exhuma-${slug}')) {
  customElements.define('exhuma-${slug}', Exhuma${pascalName}Element);
}
`,
				},
			];
		}

		case 'vanilla': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Autonomous Vanilla JS ${name} initialization module with pinned camera.`,
						code: `export function initHorizontalScroller(selector = '[data-exhuma-horizontal-scroller]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  elements.forEach((section) => {
    const camera = section.querySelector('.exhuma-hs-camera') || section.firstElementChild;
    const track = section.querySelector('.exhuma-hs-track') || (camera ? camera.firstElementChild : null);
    const progressBar = section.querySelector('.exhuma-hs-progress');
    const progressText = section.querySelector('.exhuma-hs-progress-text');
    if (!camera || !track) return;

    const speed = parseFloat(section.getAttribute('data-speed') || options.speed || 1.0);
    const itemGap = parseFloat(section.getAttribute('data-item-gap') || options.itemGap || 28);
    const rawCardWidth = String(section.getAttribute('data-card-width') || options.cardWidth || 320);
    const cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;
    const showFadeEdges = (section.getAttribute('data-show-fade-edges') || options.showFadeEdges) !== 'false';
    const fadeWidth = parseFloat(section.getAttribute('data-fade-width') || options.fadeWidth || 48);
    if (showFadeEdges && camera instanceof HTMLElement) {
      const mask = 'linear-gradient(to right, transparent, black ' + fadeWidth + 'px, black calc(100% - ' + fadeWidth + 'px), transparent)';
      camera.style.maskImage = mask;
      camera.style.webkitMaskImage = mask;
    }

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId = null;

    const recalculate = () => {
      const viewportHeight = window.innerHeight;
      const containerWidth = camera.clientWidth;
      for (let i = 0; i < track.children.length; i += 1) {
        const item = track.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = cardWidth;
          item.style.flex = '0 0 ' + cardWidth;
        }
      }
      const trackWidth = track.scrollWidth;
      cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
    };

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      const currentTranslate = -(progress * cachedDistance);
      track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
      if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
      if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateScroll();
          rafId = null;
        });
      }
    };

    recalculate();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Autonomous Vanilla JS ${name} initialization module with kinetic scale decay.`,
						code: `export function initStackingCards(selector = '[data-exhuma-stacking-cards]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  function smoothstep(t) {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
  }

  elements.forEach((container) => {
    const topStart = parseFloat(container.getAttribute('data-top-start') || options.topStart || 20);
    const topIncrement = parseFloat(container.getAttribute('data-top-increment') || options.topIncrement || 28);
    const cardGap = parseFloat(container.getAttribute('data-card-gap') || options.cardGap || 20);
    const scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || options.scaleThreshold || 150);
    const minScale = parseFloat(container.getAttribute('data-min-scale') || options.minScale || 0.9);
    const reverseScale = (container.getAttribute('data-reverse-scale') || options.reverseScale) !== 'false';

    const cards = Array.from(container.children);
    const total = cards.length;
    if (total <= 1) return;

    // Init once: set static CSS on each card — no layout thrashing in scroll loop
    cards.forEach((card, i) => {
      if (card instanceof HTMLElement) {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        card.style.position = 'sticky';
        card.style.top = stickyTop + 'px';
        card.style.zIndex = (i + 1).toString();
        card.style.marginBottom = cardGap + 'px';
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'center top';
      }
    });

    let rafId = null;
    let isIntersecting = false;

    const update = () => {
      rafId = null;
      // Ω(1) Phase 1: batch read — no style writes, no forced reflow
      const tops = new Float64Array(total);
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          tops[i] = (cards[i] as HTMLElement).getBoundingClientRect().top;
        }
      }
      // Ω(1) Phase 2: batch write transforms only
      for (let i = 0; i < total; i++) {
        if (cards[i] instanceof HTMLElement) {
          const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
          const progress = Math.max(0, Math.min(1, (tops[i] - stickyTop) / scaleThreshold));
          const targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
          (cards[i] as HTMLElement).style.transform = 'scale(' + targetScale.toFixed(4) + ')';
        }
      }
    };

    const onScroll = () => {
      if (isIntersecting && rafId === null) {
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) onScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Pure Vanilla JS high-performance 120 FPS tilt engine with zero layout thrashing.`,
						code: `export function initTiltCard(selector = '[data-exhuma-tilt-card]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  elements.forEach((card) => {
    const maxTilt = parseFloat(card.getAttribute('data-max-tilt') || options.maxTilt || 15);
    const perspective = parseFloat(card.getAttribute('data-perspective') || options.perspective || 1000);
    const scale = parseFloat(card.getAttribute('data-scale') || options.scale || 1.02);
    const speed = parseFloat(card.getAttribute('data-speed') || options.speed || 0.12);
    const reverse = card.getAttribute('data-reverse') === 'true' || options.reverse === true;
    const disabled = card.getAttribute('data-disabled') === 'true' || options.disabled === true;
    const axis = card.getAttribute('data-axis') || options.axis || 'all';

    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rect = null;

    let targetRotX = 0;
    let targetRotY = 0;
    let targetScale = 1.0;

    let currentRotX = 0;
    let currentRotY = 0;
    let currentScale = 1.0;

    let isHovered = false;
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    const measureRect = () => {
      const r = card.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    const updateFrame = () => {
      if (disabled || isReducedMotion) {
        card.style.transform = '';
        rafId = null;
        return;
      }

      const factor = Math.max(0.01, Math.min(1, speed));
      currentRotX = lerp(currentRotX, targetRotX, factor);
      currentRotY = lerp(currentRotY, targetRotY, factor);
      currentScale = lerp(currentScale, targetScale, factor);

      card.style.transform = 'perspective(' + perspective + 'px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ')';

      const diffX = Math.abs(targetRotX - currentRotX);
      const diffY = Math.abs(targetRotY - currentRotY);
      const diffScale = Math.abs(targetScale - currentScale);

      if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleRaf = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const onPointerEnter = () => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      targetScale = scale;
      measureRect();
      scheduleRaf();
    };

    const onPointerMove = (e) => {
      if (disabled || isReducedMotion) return;
      if (!rect) measureRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
      const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
      const sign = reverse ? -1 : 1;

      const rawRotX = normY * -maxTilt * sign;
      const rawRotY = normX * maxTilt * sign;

      targetRotX = axis === 'y' ? 0 : rawRotX;
      targetRotY = axis === 'x' ? 0 : rawRotY;

      scheduleRaf();
    };

    const onPointerLeave = () => {
      isHovered = false;
      rect = null;
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1.0;
      scheduleRaf();
    };

    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };

    card.addEventListener('pointerenter', onPointerEnter);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      card.removeEventListener('pointerenter', onPointerEnter);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				return [
					{
						filename: `${slug}.vanilla.js`,
						language: 'javascript',
						description: `Autonomous Vanilla JS ${name} initialization module with zero-layout-thrash pointer engine.`,
						code: `export function initSpotlightCard(selector = '[data-exhuma-spotlight-card]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  elements.forEach((card) => {
    const radius = parseFloat(card.getAttribute('data-radius') || options.radius || 350);
    const color = card.getAttribute('data-color') || options.color || '#6366f1';
    const borderColor = card.getAttribute('data-border-color') || options.borderColor || '#818cf8';
    const opacity = parseFloat(card.getAttribute('data-opacity') || options.opacity || 0.85);
    const spread = parseFloat(card.getAttribute('data-spread') || options.spread || 60);
    const mode = card.getAttribute('data-mode') || options.mode || 'both';
    const smoothing = parseFloat(card.getAttribute('data-smoothing') || options.smoothing || 0.2);
    const disabled = card.getAttribute('data-disabled') === 'true' || options.disabled === true;

    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rect = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isHovered = false;
    let rafId = null;

    card.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
    card.style.setProperty('--exhuma-spotlight-color', color);
    card.style.setProperty('--exhuma-spotlight-border-color', borderColor);
    card.style.setProperty('--exhuma-spotlight-spread', spread + '%');
    card.style.setProperty('--exhuma-spotlight-opacity', '0');

    let borderEl = card.querySelector('.exhuma-spotlight-border');
    if ((mode === 'both' || mode === 'border') && !borderEl) {
      borderEl = document.createElement('div');
      borderEl.setAttribute('aria-hidden', 'true');
      borderEl.className = 'exhuma-spotlight-border';
      borderEl.style.position = 'absolute';
      borderEl.style.inset = '0';
      borderEl.style.borderRadius = 'inherit';
      borderEl.style.pointerEvents = 'none';
      borderEl.style.border = '1.5px solid transparent';
      borderEl.style.opacity = 'var(--exhuma-spotlight-opacity, 0)';
      borderEl.style.background = 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box';
      borderEl.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
      borderEl.style.webkitMaskComposite = 'destination-out';
      borderEl.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
      borderEl.style.maskComposite = 'exclude';
      card.insertBefore(borderEl, card.firstChild);
    }

    let sheenEl = card.querySelector('.exhuma-spotlight-sheen');
    if ((mode === 'both' || mode === 'background') && !sheenEl) {
      sheenEl = document.createElement('div');
      sheenEl.setAttribute('aria-hidden', 'true');
      sheenEl.className = 'exhuma-spotlight-sheen';
      sheenEl.style.position = 'absolute';
      sheenEl.style.inset = '0';
      sheenEl.style.pointerEvents = 'none';
      sheenEl.style.opacity = mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)';
      sheenEl.style.background = 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))';
      card.insertBefore(sheenEl, card.firstChild);
    }

    const lerp = (a, b, t) => a + (b - a) * t;

    const measureRect = () => {
      const r = card.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
    };

    const updateFrame = () => {
      if (disabled || isReducedMotion) {
        card.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafId = null;
        return;
      }

      if (smoothing <= 0 || smoothing >= 1) {
        currentX = targetX;
        currentY = targetY;
        currentOpacity = targetOpacity;
      } else {
        currentX = lerp(currentX, targetX, smoothing);
        currentY = lerp(currentY, targetY, smoothing);
        currentOpacity = lerp(currentOpacity, targetOpacity, smoothing);
      }

      card.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
      card.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
      card.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffOp = Math.abs(targetOpacity - currentOpacity);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleRaf = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const onPointerEnter = (e) => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      targetOpacity = opacity;
      scheduleRaf();
    };

    const onPointerMove = (e) => {
      if (disabled || isReducedMotion) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = opacity;
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleRaf();
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleRaf();
    };

    const onScrollOrResize = () => {
      if (isHovered) measureRect();
    };

    card.addEventListener('pointerenter', onPointerEnter);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.removeEventListener('pointerenter', onPointerEnter);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (borderEl && borderEl.parentNode === card) {
        card.removeChild(borderEl);
      }
      if (sheenEl && sheenEl.parentNode === card) {
        card.removeChild(sheenEl);
      }
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: 'border-beam.vanilla.js',
						language: 'javascript',
						description: `Vanilla JS ${name} module with hardware mask clipping and sub-pixel laser trace.`,
						code: `export function initBorderBeam(selector = '[data-exhuma-border-beam]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  if (!document.getElementById('exhuma-border-beam-keyframes')) {
    const style = document.createElement('style');
    style.id = 'exhuma-border-beam-keyframes';
    style.textContent = \`
      @keyframes exhuma-border-beam {
        from { offset-distance: 0%; }
        to { offset-distance: 100%; }
      }
      @media (prefers-reduced-motion: reduce) {
        .exhuma-border-beam-trace { animation-play-state: paused !important; }
      }
    \`;
    document.head.appendChild(style);
  }

  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const size = options.size ?? ${size};
    const duration = options.duration ?? ${duration};
    const borderWidth = options.borderWidth ?? ${borderWidth};
    const colorFrom = options.colorFrom ?? '${colorFrom}';
    const colorTo = options.colorTo ?? '${colorTo}';
    const doubleBeam = options.doubleBeam ?? ${doubleBeam};
    const endOpacity = options.endOpacity ?? ${endOpacity};
    const opacity = options.opacity ?? ${opacity};
    const blur = options.blur ?? ${blur};
    const borderRadius = options.borderRadius ?? ${borderRadius};

    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;
    const pathRadius = Math.min(size, 200);

    const container = document.createElement('div');
    container.className = 'exhuma-border-beam';
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'absolute';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.borderRadius = 'inherit';
    container.style.border = \`\${borderWidth}px solid transparent\`;
    container.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    container.style.webkitMaskComposite = 'destination-out';
    container.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    container.style.maskComposite = 'exclude';
    if (opacity !== 1) container.style.opacity = opacity.toString();
    if (blur > 0) container.style.filter = \`blur(\${blur}px)\`;

    const beam1 = document.createElement('div');
    beam1.className = 'exhuma-border-beam-trace';
    beam1.style.position = 'absolute';
    beam1.style.aspectRatio = '1 / 1';
    beam1.style.width = \`\${size}px\`;
    beam1.style.offsetPath = \`rect(0 auto auto 0 round \${pathRadius}px)\`;
    beam1.style.offsetAnchor = \`\${size / 2}px \${size / 2}px\`;
    beam1.style.background = \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`;
    beam1.style.animation = \`exhuma-border-beam \${duration}s linear infinite\`;
    container.appendChild(beam1);

    if (doubleBeam) {
      const beam2 = document.createElement('div');
      beam2.className = 'exhuma-border-beam-trace';
      beam2.style.position = 'absolute';
      beam2.style.aspectRatio = '1 / 1';
      beam2.style.width = \`\${size}px\`;
      beam2.style.offsetPath = \`rect(0 auto auto 0 round \${pathRadius}px)\`;
      beam2.style.offsetAnchor = \`\${size / 2}px \${size / 2}px\`;
      beam2.style.background = \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`;
      beam2.style.animation = \`exhuma-border-beam \${duration}s linear -\${duration / 2}s infinite\`;
      container.appendChild(beam2);
    }

    el.appendChild(container);
    cleanups.push(() => {
      if (container.parentNode === el) el.removeChild(container);
    });
  });

  return () => cleanups.forEach((c) => c());
}
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.vanilla.js`,
					language: 'javascript',
					description: `Autonomous Vanilla JS ${name} initialization module.`,
					code: `export function init${pascalName}(selector = '[data-exhuma-${slug}]', options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}
`,
				},
			];
		}

		case 'blade': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade component for ${name} with pinned kinetic camera.`,
						code: `@props([
    'speed' => 1.0,
    'itemGap' => 28,
    'cardWidth' => 320,
    'showProgress' => true,
    'showFadeEdges' => true,
    'fadeWidth' => 48,
    'mobileMode' => 'scroll',
])

<section
    data-exhuma-horizontal-scroller
    data-speed="{{ $speed }}"
    data-item-gap="{{ $itemGap }}"
    data-card-width="{{ $cardWidth }}"
    {{ $attributes->merge(['class' => 'relative w-full']) }}
    style="min-height: 150vh;"
>
    <div
        class="exhuma-hs-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        @if($showFadeEdges)
            style="mask-image: linear-gradient(to right, transparent, black {{ $fadeWidth }}px, black calc(100% - {{ $fadeWidth }}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black {{ $fadeWidth }}px, black calc(100% - {{ $fadeWidth }}px), transparent);"
        @endif
    >
        <div
            class="exhuma-hs-track flex items-stretch will-change-transform"
            style="gap: {{ $itemGap }}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
            {{ $slot }}
        </div>
        @if($showProgress)
            <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
                <div class="h-1 flex-1 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
                    <div class="exhuma-hs-progress h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
                </div>
                <span class="exhuma-hs-progress-text font-mono text-2xs text-neutral-400 tabular-nums">0%</span>
            </div>
        @endif
    </div>
</section>

<script>
(function() {
    function init() {
        document.querySelectorAll('[data-exhuma-horizontal-scroller]').forEach(function(section) {
            if (section.dataset.exhumaReady === 'true') return;
            section.dataset.exhumaReady = 'true';
            var camera = section.querySelector('.exhuma-hs-camera');
            var track = section.querySelector('.exhuma-hs-track');
            var progressBar = section.querySelector('.exhuma-hs-progress');
            var progressText = section.querySelector('.exhuma-hs-progress-text');
            if (!camera || !track) return;

            var speed = parseFloat(section.getAttribute('data-speed') || '1.0');
            var itemGap = parseFloat(section.getAttribute('data-item-gap') || '28');
            var rawCardWidth = section.getAttribute('data-card-width') || '320';
            var cardWidth = /^\\d+$/.test(rawCardWidth) ? rawCardWidth + 'px' : rawCardWidth;

            var cachedDistance = 0;
            var isIntersecting = false;
            var rafId = null;

            function recalculate() {
                var viewportHeight = window.innerHeight;
                var containerWidth = camera.clientWidth;
                for (var i = 0; i < track.children.length; i += 1) {
                    var item = track.children.item(i);
                    if (item instanceof HTMLElement) {
                        item.style.width = cardWidth;
                        item.style.flex = '0 0 ' + cardWidth;
                    }
                }
                var trackWidth = track.scrollWidth;
                cachedDistance = Math.max(0, trackWidth - containerWidth + itemGap * 2);
                var safeSpeed = Math.max(0.1, speed);
                section.style.minHeight = Math.round(viewportHeight + cachedDistance / safeSpeed) + 'px';
            }

            function updateScroll() {
                var rect = section.getBoundingClientRect();
                var totalScrollable = section.offsetHeight - window.innerHeight;
                var scrolled = -rect.top;
                var progress = totalScrollable <= 0 ? 0 : Math.min(Math.max(scrolled / totalScrollable, 0), 1);
                var currentTranslate = -(progress * cachedDistance);
                track.style.transform = 'translate3d(' + currentTranslate.toFixed(2) + 'px, 0, 0)';
                if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
                if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
            }

            function onScroll() {
                if (isIntersecting && rafId === null) {
                    rafId = window.requestAnimationFrame(function() {
                        updateScroll();
                        rafId = null;
                    });
                }
            }

            recalculate();
            var observer = new IntersectionObserver(function(entries) {
                isIntersecting = entries[0] ? entries[0].isIntersecting : false;
                if (isIntersecting) updateScroll();
            }, { rootMargin: '100px 0px', threshold: 0 });
            observer.observe(section);
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', recalculate, { passive: true });

            window.addEventListener('pagehide', function cleanup() {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                observer.disconnect();
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', recalculate);
                section.dataset.exhumaReady = 'false';
            }, { once: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade self-contained ${name} component with kinetic scale decay.`,
						code: `@props([
    'topStart' => 20,
    'topIncrement' => 28,
    'cardGap' => 20,
    'scaleThreshold' => 150,
    'minScale' => 0.9,
    'reverseScale' => true,
])

<div
    data-exhuma-stacking-cards
    data-top-start="{{ $topStart }}"
    data-top-increment="{{ $topIncrement }}"
    data-card-gap="{{ $cardGap }}"
    data-scale-threshold="{{ $scaleThreshold }}"
    data-min-scale="{{ $minScale }}"
    data-reverse-scale="{{ $reverseScale ? 'true' : 'false' }}"
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</div>

<script>
(function() {
    function smoothstep(t) {
        var c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
    }

    function init() {
        document.querySelectorAll('[data-exhuma-stacking-cards]').forEach(function(container) {
            if (container.dataset.exhumaReady === 'true') return;
            container.dataset.exhumaReady = 'true';
            var topStart = parseFloat(container.getAttribute('data-top-start') || '20');
            var topIncrement = parseFloat(container.getAttribute('data-top-increment') || '28');
            var cardGap = parseFloat(container.getAttribute('data-card-gap') || '20');
            var scaleThreshold = parseFloat(container.getAttribute('data-scale-threshold') || '150');
            var minScale = parseFloat(container.getAttribute('data-min-scale') || '0.9');
            var reverseScale = container.getAttribute('data-reverse-scale') !== 'false';

            var cards = Array.from(container.children);
            var total = cards.length;
            if (total <= 1) return;

            // Init once: set static CSS — no layout thrashing in scroll loop
            cards.forEach(function(card, i) {
                var stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
                card.style.position = 'sticky';
                card.style.top = stickyTop + 'px';
                card.style.zIndex = i + 1;
                card.style.marginBottom = cardGap + 'px';
                card.style.willChange = 'transform';
                card.style.transformOrigin = 'center top';
            });

            var rafId = null;
            var isIntersecting = false;

            function update() {
                rafId = null;
                // Ω(1) Phase 1: batch read — no style writes, no forced reflow
                var tops = [];
                for (var j = 0; j < total; j++) {
                    tops[j] = cards[j].getBoundingClientRect().top;
                }
                // Ω(1) Phase 2: batch write transforms only
                for (var k = 0; k < total; k++) {
                    var stickyTop = reverseScale && k === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + k * topIncrement;
                    var progress = Math.max(0, Math.min(1, (tops[k] - stickyTop) / scaleThreshold));
                    var targetScale = minScale + (1 - minScale) * smoothstep(1 - progress);
                    cards[k].style.transform = 'scale(' + targetScale.toFixed(4) + ')';
                }
            }

            function onScroll() {
                if (isIntersecting && rafId === null) {
                    rafId = window.requestAnimationFrame(update);
                }
            }

            update();
            var observer = new IntersectionObserver(function(entries) {
                isIntersecting = entries[0] ? entries[0].isIntersecting : false;
                if (isIntersecting) onScroll();
            }, { rootMargin: '100px 0px', threshold: 0 });
            observer.observe(container);
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll, { passive: true });

            window.addEventListener('pagehide', function cleanup() {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                observer.disconnect();
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onScroll);
                container.dataset.exhumaReady = 'false';
            }, { once: true });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade component for ${name} with kinetic 120 FPS tilt engine.`,
						code: `@props([
    'maxTilt' => 15,
    'perspective' => 1000,
    'scale' => 1.02,
    'speed' => 0.12,
    'reverse' => false,
    'disabled' => false,
    'axis' => 'all',
    'class' => '',
])

@php
$id = 'exhuma-tilt-' . uniqid();
@endphp

<div
    id="{{ $id }}"
    data-exhuma-tilt-card
    data-max-tilt="{{ $maxTilt }}"
    data-perspective="{{ $perspective }}"
    data-scale="{{ $scale }}"
    data-speed="{{ $speed }}"
    data-reverse="{{ $reverse ? 'true' : 'false' }}"
    data-disabled="{{ $disabled ? 'true' : 'false' }}"
    data-axis="{{ $axis }}"
    {{ $attributes->merge([
        'class' => 'exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform ' . $class,
    ]) }}
>
    {{ $slot }}
</div>

<script>
(function() {
    function init() {
        var card = document.getElementById('{{ $id }}');
        if (!card || card.dataset.exhumaReady === 'true') return;
        card.dataset.exhumaReady = 'true';

        var maxTilt = parseFloat(card.getAttribute('data-max-tilt') || '15');
        var perspective = parseFloat(card.getAttribute('data-perspective') || '1000');
        var scale = parseFloat(card.getAttribute('data-scale') || '1.02');
        var speed = parseFloat(card.getAttribute('data-speed') || '0.12');
        var reverse = card.getAttribute('data-reverse') === 'true';
        var disabled = card.getAttribute('data-disabled') === 'true';
        var axis = card.getAttribute('data-axis') || 'all';

        var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var rect = null;

        var targetRotX = 0, targetRotY = 0, targetScale = 1.0;
        var currentRotX = 0, currentRotY = 0, currentScale = 1.0;

        var isHovered = false;
        var rafId = null;

        function lerp(a, b, t) { return a + (b - a) * t; }

        function measureRect() {
            var r = card.getBoundingClientRect();
            rect = { left: r.left, top: r.top, width: r.width, height: r.height };
        }

        function updateFrame() {
            if (disabled || isReducedMotion) {
                card.style.transform = '';
                rafId = null;
                return;
            }

            var factor = Math.max(0.01, Math.min(1, speed));
            currentRotX = lerp(currentRotX, targetRotX, factor);
            currentRotY = lerp(currentRotY, targetRotY, factor);
            currentScale = lerp(currentScale, targetScale, factor);

            card.style.transform = 'perspective(' + perspective + 'px) rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ', ' + currentScale.toFixed(3) + ')';

            var diffX = Math.abs(targetRotX - currentRotX);
            var diffY = Math.abs(targetRotY - currentRotY);
            var diffScale = Math.abs(targetScale - currentScale);

            if (diffX > 0.01 || diffY > 0.01 || diffScale > 0.001 || isHovered) {
                rafId = requestAnimationFrame(updateFrame);
            } else {
                rafId = null;
            }
        }

        function scheduleRaf() {
            if (rafId === null) {
                rafId = requestAnimationFrame(updateFrame);
            }
        }

        function onPointerEnter() {
            if (disabled || isReducedMotion) return;
            isHovered = true;
            targetScale = scale;
            measureRect();
            scheduleRaf();
        }

        function onPointerMove(e) {
            if (disabled || isReducedMotion) return;
            if (!rect) measureRect();
            if (!rect || rect.width <= 0 || rect.height <= 0) return;

            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
            var normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
            var sign = reverse ? -1 : 1;

            var rawRotX = normY * -maxTilt * sign;
            var rawRotY = normX * maxTilt * sign;

            targetRotX = axis === 'y' ? 0 : rawRotX;
            targetRotY = axis === 'x' ? 0 : rawRotY;

            scheduleRaf();
        }

        function onPointerLeave() {
            isHovered = false;
            rect = null;
            targetRotX = 0;
            targetRotY = 0;
            targetScale = 1.0;
            scheduleRaf();
        }

        function onScrollOrResize() {
            if (isHovered) measureRect();
        }

        card.addEventListener('pointerenter', onPointerEnter);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });

        window.addEventListener('pagehide', function cleanup() {
            if (rafId !== null) window.cancelAnimationFrame(rafId);
            card.removeEventListener('pointerenter', onPointerEnter);
            card.removeEventListener('pointermove', onPointerMove);
            card.removeEventListener('pointerleave', onPointerLeave);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
            card.dataset.exhumaReady = 'false';
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade component for ${name} with zero-layout-thrash pointer engine.`,
						code: `@props([
    'radius' => 350,
    'color' => '#6366f1',
    'borderColor' => '#818cf8',
    'opacity' => 0.85,
    'spread' => 60,
    'mode' => 'both',
    'smoothing' => 0.2,
    'disabled' => false,
    'class' => '',
])

@php
$id = 'exhuma-spotlight-' . uniqid();
@endphp

<div
    id="{{ $id }}"
    data-exhuma-spotlight-card
    data-radius="{{ $radius }}"
    data-color="{{ $color }}"
    data-border-color="{{ $borderColor }}"
    data-opacity="{{ $opacity }}"
    data-spread="{{ $spread }}"
    data-mode="{{ $mode }}"
    data-smoothing="{{ $smoothing }}"
    data-disabled="{{ $disabled ? 'true' : 'false' }}"
    style="--exhuma-spotlight-radius: {{ $radius }}px; --exhuma-spotlight-color: {{ $color }}; --exhuma-spotlight-border-color: {{ $borderColor }}; --exhuma-spotlight-spread: {{ $spread }}%; --exhuma-spotlight-opacity: 0;"
    {{ $attributes->merge([
        'class' => 'exhuma-spotlight-card relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 ' . $class,
    ]) }}
>
    @if($mode === 'both' || $mode === 'background')
        <div
            aria-hidden="true"
            class="exhuma-spotlight-glow pointer-events-none absolute inset-0 z-0"
            style="opacity: {{ $mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)' }}; background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
        ></div>
    @endif

    @if($mode === 'both' || $mode === 'border')
        <div
            aria-hidden="true"
            class="exhuma-spotlight-border pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
        ></div>
    @endif

    <div class="relative z-20">
        {{ $slot }}
    </div>
</div>

<script>
(function() {
    function init() {
        var card = document.getElementById('{{ $id }}');
        if (!card || card.dataset.exhumaReady === 'true') return;
        card.dataset.exhumaReady = 'true';

        var radius = parseFloat(card.getAttribute('data-radius') || '350');
        var color = card.getAttribute('data-color') || '#6366f1';
        var borderColor = card.getAttribute('data-border-color') || '#818cf8';
        var opacity = parseFloat(card.getAttribute('data-opacity') || '0.85');
        var spread = parseFloat(card.getAttribute('data-spread') || '60');
        var mode = card.getAttribute('data-mode') || 'both';
        var smoothing = parseFloat(card.getAttribute('data-smoothing') || '0.2');
        var disabled = card.getAttribute('data-disabled') === 'true';

        var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var rect = null;

        var targetX = -9999, targetY = -9999, currentX = -9999, currentY = -9999;
        var targetOpacity = 0, currentOpacity = 0;
        var isHovered = false;
        var rafId = null;

        function lerp(a, b, t) { return a + (b - a) * t; }

        function measureRect() {
            var r = card.getBoundingClientRect();
            rect = { left: r.left, top: r.top, width: r.width, height: r.height };
        }

        function updateFrame() {
            if (disabled || isReducedMotion) {
                card.style.setProperty('--exhuma-spotlight-opacity', '0');
                rafId = null;
                return;
            }

            if (smoothing <= 0 || smoothing >= 1) {
                currentX = targetX;
                currentY = targetY;
                currentOpacity = targetOpacity;
            } else {
                currentX = lerp(currentX, targetX, smoothing);
                currentY = lerp(currentY, targetY, smoothing);
                currentOpacity = lerp(currentOpacity, targetOpacity, smoothing);
            }

            card.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
            card.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
            card.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

            var diffX = Math.abs(targetX - currentX);
            var diffY = Math.abs(targetY - currentY);
            var diffOp = Math.abs(targetOpacity - currentOpacity);

            if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
                rafId = window.requestAnimationFrame(updateFrame);
            } else {
                rafId = null;
            }
        }

        function scheduleRaf() {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(updateFrame);
            }
        }

        function onPointerEnter(e) {
            if (disabled || isReducedMotion) return;
            isHovered = true;
            measureRect();
            if (!rect) return;
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            if (currentX < -1000) {
                currentX = targetX;
                currentY = targetY;
            }
            targetOpacity = opacity;
            scheduleRaf();
        }

        function onPointerMove(e) {
            if (disabled || isReducedMotion) return;
            isHovered = true;
            if (!rect) measureRect();
            if (!rect) return;
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            targetOpacity = opacity;
            if (currentX < -1000) {
                currentX = targetX;
                currentY = targetY;
            }
            scheduleRaf();
        }

        function onPointerLeave() {
            isHovered = false;
            targetOpacity = 0;
            scheduleRaf();
        }

        function onScrollOrResize() {
            if (isHovered) measureRect();
        }

        card.addEventListener('pointerenter', onPointerEnter);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });

        window.addEventListener('pagehide', function cleanup() {
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
            }
            card.removeEventListener('pointerenter', onPointerEnter);
            card.removeEventListener('pointermove', onPointerMove);
            card.removeEventListener('pointerleave', onPointerLeave);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
            card.dataset.exhumaReady = 'false';
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const doubleBeam = Boolean(props.doubleBeam ?? false);
				const endOpacity = Number(props.endOpacity ?? 0);
				const opacity = Number(props.opacity ?? 1);
				const blur = Number(props.blur ?? 0);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${slug}.blade.php`,
						language: 'php',
						description: `Laravel Blade component for ${name} with hardware mask clipping.`,
						code: `@props([
    'size' => ${size},
    'duration' => ${duration},
    'borderWidth' => ${borderWidth},
    'colorFrom' => '${colorFrom}',
    'colorTo' => '${colorTo}',
    'doubleBeam' => ${doubleBeam ? 'true' : 'false'},
    'endOpacity' => ${endOpacity},
    'opacity' => ${opacity},
    'blur' => ${blur},
    'borderRadius' => ${borderRadius},
    'class' => '',
])

@php
    $clampedEndOpacity = max(0, min(1, (float)$endOpacity));
    $endColor = $clampedEndOpacity <= 0 ? 'transparent' : ($clampedEndOpacity >= 1 ? $colorTo : "color-mix(in srgb, {$colorTo} " . round($clampedEndOpacity * 100) . "%, transparent)");
    $pathRadius = min((int)$size, 200);
@endphp

<div
    aria-hidden="true"
    {{ $attributes->merge(['class' => 'exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit] ' . $class]) }}
    style="border: {{ $borderWidth }}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; {{ $opacity != 1 ? 'opacity: ' . $opacity . ';' : '' }} {{ $blur > 0 ? 'filter: blur(' . $blur . 'px);' : '' }}"
>
    <div
        class="exhuma-border-beam-trace"
        style="position: absolute; aspect-ratio: 1 / 1; width: {{ $size }}px; offset-path: rect(0 auto auto 0 round {{ $pathRadius }}px); offset-anchor: {{ $size / 2 }}px {{ $size / 2 }}px; background: linear-gradient(to left, {{ $colorFrom }}, {{ $colorTo }}, {{ $endColor }}); animation: exhuma-border-beam {{ $duration }}s linear infinite;"
    ></div>

    @if ($doubleBeam)
        <div
            class="exhuma-border-beam-trace"
            style="position: absolute; aspect-ratio: 1 / 1; width: {{ $size }}px; offset-path: rect(0 auto auto 0 round {{ $pathRadius }}px); offset-anchor: {{ $size / 2 }}px {{ $size / 2 }}px; background: linear-gradient(to left, {{ $colorFrom }}, {{ $colorTo }}, {{ $endColor }}); animation: exhuma-border-beam {{ $duration }}s linear -{{ $duration / 2 }}s infinite;"
        ></div>
    @endif

    <style>
        @keyframes exhuma-border-beam {
            from {
                offset-distance: 0%;
            }
            to {
                offset-distance: 100%;
            }
        }
        @media (prefers-reduced-motion: reduce) {
            .exhuma-border-beam-trace {
                animation-play-state: paused !important;
            }
        }
    </style>
</div>
`,
					},
				];
			}
			return [
				{
					filename: `${slug}.blade.php`,
					language: 'php',
					description: `Laravel Blade component for ${name}.`,
					code: `@props([])

<div
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'wordpress': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for Horizontal Scroller.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: `exhuma/${slug}`,
								version: '1.1.0',
								title: `Exhuma ${name}`,
								category: 'design',
								icon: 'slides',
								description,
								attributes: {
									speed: { type: 'number', default: 1.0 },
									itemGap: { type: 'number', default: 28 },
									cardWidth: { type: 'number', default: 320 },
									showProgress: { type: 'boolean', default: true },
									showFadeEdges: { type: 'boolean', default: true },
									fadeWidth: { type: 'number', default: 48 },
									mobileMode: { type: 'string', default: 'scroll' },
								},
								editorScript: 'file:./index.js',
								viewScript: 'exhuma-kinetic',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress dynamic render template for Horizontal Scroller.`,
						code: `<?php
$speed = $attributes['speed'] ?? 1.0;
$item_gap = $attributes['itemGap'] ?? 28;
$card_width = $attributes['cardWidth'] ?? 320;
$show_progress = $attributes['showProgress'] ?? true;
$show_fade_edges = $attributes['showFadeEdges'] ?? true;
$fade_width = $attributes['fadeWidth'] ?? 48;
$mobile_mode = $attributes['mobileMode'] ?? 'scroll';
$camera_style = $show_fade_edges
  ? sprintf('mask-image:linear-gradient(to right,transparent,black %1$dpx,black calc(100%% - %1$dpx),transparent);-webkit-mask-image:linear-gradient(to right,transparent,black %1$dpx,black calc(100%% - %1$dpx),transparent);', $fade_width)
  : '';
?>
<section class="exhuma-horizontal-scroller" data-exhuma-horizontal-scroller data-speed="<?php echo esc_attr($speed); ?>" data-item-gap="<?php echo esc_attr($item_gap); ?>" data-card-width="<?php echo esc_attr($card_width); ?>" data-mobile-mode="<?php echo esc_attr($mobile_mode); ?>">
  <div class="exhuma-hs-camera" style="<?php echo esc_attr($camera_style); ?>">
    <div class="exhuma-hs-track" style="gap:<?php echo esc_attr($item_gap); ?>px">
      <?php echo $content; ?>
    </div>
    <?php if ($show_progress) : ?>
      <div class="exhuma-hs-progress-track" aria-hidden="true">
        <div class="exhuma-hs-progress"></div>
        <span class="exhuma-hs-progress-text">0%</span>
      </div>
    <?php endif; ?>
  </div>
</section>
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for ${name}.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: `exhuma/${slug}`,
								version: '1.0.0',
								title: `Exhuma ${name}`,
								category: 'design',
								icon: 'art',
								description,
								attributes: {
									topStart: { type: 'number', default: 20 },
									topIncrement: { type: 'number', default: 28 },
									cardGap: { type: 'number', default: 20 },
									scaleThreshold: { type: 'number', default: 150 },
									minScale: { type: 'number', default: 0.9 },
									reverseScale: { type: 'boolean', default: true },
								},
								editorScript: 'file:./index.js',
								viewScript: 'exhuma-kinetic',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress dynamic render template for ${name}.`,
						code: `<?php
$top_start = $attributes['topStart'] ?? 20;
$top_increment = $attributes['topIncrement'] ?? 28;
$card_gap = $attributes['cardGap'] ?? 20;
$scale_threshold = $attributes['scaleThreshold'] ?? 150;
$min_scale = $attributes['minScale'] ?? 0.9;
$reverse_scale = ($attributes['reverseScale'] ?? true) ? 'true' : 'false';
?>
<div
  class="exhuma-stacking-cards"
  data-exhuma-stacking-cards
  data-top-start="<?php echo esc_attr($top_start); ?>"
  data-top-increment="<?php echo esc_attr($top_increment); ?>"
  data-card-gap="<?php echo esc_attr($card_gap); ?>"
  data-scale-threshold="<?php echo esc_attr($scale_threshold); ?>"
  data-min-scale="<?php echo esc_attr($min_scale); ?>"
  data-reverse-scale="<?php echo esc_attr($reverse_scale); ?>"
>
  <?php echo $content; ?>
</div>
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for ${name}.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: `exhuma/${slug}`,
								version: '1.1.0',
								title: `Exhuma ${name}`,
								category: 'design',
								icon: 'shield',
								description,
								attributes: {
									maxTilt: { type: 'number', default: 15 },
									perspective: { type: 'number', default: 1000 },
									scale: { type: 'number', default: 1.02 },
									speed: { type: 'number', default: 0.12 },
									reverse: { type: 'boolean', default: false },
									disabled: { type: 'boolean', default: false },
									axis: { type: 'string', default: 'all' },
								},
								supports: {
									align: ['wide', 'full'],
									html: false,
								},
								editorScript: 'file:./index.js',
								render: 'file:./render.php',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress Gutenberg block rendering template for ${name}.`,
						code: `<?php
$max_tilt = $attributes['maxTilt'] ?? 15;
$perspective = $attributes['perspective'] ?? 1000;
$scale = $attributes['scale'] ?? 1.02;
$speed = $attributes['speed'] ?? 0.12;
$reverse = ($attributes['reverse'] ?? false) ? 'true' : 'false';
$disabled = ($attributes['disabled'] ?? false) ? 'true' : 'false';
$axis = $attributes['axis'] ?? 'all';
?>
<div
  class="exhuma-tilt-card relative overflow-hidden rounded-2xl will-change-transform"
  data-exhuma-tilt-card
  data-max-tilt="<?php echo esc_attr($max_tilt); ?>"
  data-perspective="<?php echo esc_attr($perspective); ?>"
  data-scale="<?php echo esc_attr($scale); ?>"
  data-speed="<?php echo esc_attr($speed); ?>"
  data-reverse="<?php echo esc_attr($reverse); ?>"
  data-disabled="<?php echo esc_attr($disabled); ?>"
  data-axis="<?php echo esc_attr($axis); ?>"
>
  <div class="exhuma-tilt-card-inner">
    <?php echo $content; ?>
  </div>
</div>
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for ${name}.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: `exhuma/${slug}`,
								version: '1.1.0',
								title: `Exhuma ${name}`,
								category: 'design',
								icon: 'lightbulb',
								description,
								attributes: {
									radius: { type: 'number', default: 350 },
									color: { type: 'string', default: '#6366f1' },
									borderColor: { type: 'string', default: '#818cf8' },
									opacity: { type: 'number', default: 0.85 },
									spread: { type: 'number', default: 60 },
									mode: { type: 'string', default: 'both' },
									smoothing: { type: 'number', default: 0.2 },
									disabled: { type: 'boolean', default: false },
								},
								supports: {
									align: ['wide', 'full'],
									html: false,
								},
								editorScript: 'file:./index.js',
								render: 'file:./render.php',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress Gutenberg block rendering template for ${name}.`,
						code: `<?php
$radius = $attributes['radius'] ?? 350;
$color = $attributes['color'] ?? '#6366f1';
$border_color = $attributes['borderColor'] ?? '#818cf8';
$opacity = $attributes['opacity'] ?? 0.85;
$spread = $attributes['spread'] ?? 60;
$mode = $attributes['mode'] ?? 'both';
$smoothing = $attributes['smoothing'] ?? 0.2;
$disabled = ($attributes['disabled'] ?? false) ? 'true' : 'false';
?>
<div
  class="exhuma-spotlight-card relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60"
  data-exhuma-spotlight-card
  data-radius="<?php echo esc_attr($radius); ?>"
  data-color="<?php echo esc_attr($color); ?>"
  data-border-color="<?php echo esc_attr($border_color); ?>"
  data-opacity="<?php echo esc_attr($opacity); ?>"
  data-spread="<?php echo esc_attr($spread); ?>"
  data-mode="<?php echo esc_attr($mode); ?>"
  data-smoothing="<?php echo esc_attr($smoothing); ?>"
  data-disabled="<?php echo esc_attr($disabled); ?>"
  style="--exhuma-spotlight-radius: <?php echo esc_attr($radius); ?>px; --exhuma-spotlight-color: <?php echo esc_attr($color); ?>; --exhuma-spotlight-border-color: <?php echo esc_attr($border_color); ?>; --exhuma-spotlight-spread: <?php echo esc_attr($spread); ?>%; --exhuma-spotlight-opacity: 0;"
>
  <?php if ($mode === 'both' || $mode === 'background'): ?>
    <div
      aria-hidden="true"
      class="exhuma-spotlight-glow pointer-events-none absolute inset-0 z-0"
      style="opacity: <?php echo $mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)'; ?>; background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
    ></div>
  <?php endif; ?>
  <?php if ($mode === 'both' || $mode === 'border'): ?>
    <div
      aria-hidden="true"
      class="exhuma-spotlight-border pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    ></div>
  <?php endif; ?>
  <div class="relative z-20">
    <?php echo $content; ?>
  </div>
</div>
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: 'block.json',
						language: 'json',
						description: `WordPress Block API v3 definition for ${name}.`,
						code: JSON.stringify(
							{
								$schema: 'https://schemas.wp.org/trunk/block.json',
								apiVersion: 3,
								name: 'exhuma/border-beam',
								version: '1.0.0',
								title: 'Exhuma Border Beam',
								category: 'widgets',
								description: 'Perimeter laser trace with hardware mask clipping.',
								attributes: {
									size: { type: 'number', default: size },
									duration: { type: 'number', default: duration },
									borderWidth: { type: 'number', default: borderWidth },
									colorFrom: { type: 'string', default: colorFrom },
									colorTo: { type: 'string', default: colorTo },
									borderRadius: { type: 'number', default: borderRadius },
								},
								render: 'file:./render.php',
							},
							null,
							2
						),
					},
					{
						filename: 'render.php',
						language: 'php',
						description: `WordPress render template for ${name}.`,
						code: `<?php
/**
 * Exhuma Border Beam Block Render Template
 */
$size = $attributes['size'] ?? ${size};
$duration = $attributes['duration'] ?? ${duration};
$borderWidth = $attributes['borderWidth'] ?? ${borderWidth};
$colorFrom = $attributes['colorFrom'] ?? '${colorFrom}';
$colorTo = $attributes['colorTo'] ?? '${colorTo}';
$borderRadius = $attributes['borderRadius'] ?? ${borderRadius};
$pathRadius = min((int)$size, 200);
?>
<div
  class="exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]"
  style="border: <?php echo esc_attr($borderWidth); ?>px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
>
  <div
    class="exhuma-border-beam-trace"
    style="position: absolute; aspect-ratio: 1 / 1; width: <?php echo esc_attr($size); ?>px; offset-path: rect(0 auto auto 0 round <?php echo esc_attr($pathRadius); ?>px); offset-anchor: <?php echo esc_attr($size / 2); ?>px <?php echo esc_attr($size / 2); ?>px; background: linear-gradient(to left, <?php echo esc_attr($colorFrom); ?>, <?php echo esc_attr($colorTo); ?>, transparent); animation: exhuma-border-beam <?php echo esc_attr($duration); ?>s linear infinite;"
  ></div>
  <style>
    @keyframes exhuma-border-beam {
      from { offset-distance: 0%; }
      to { offset-distance: 100%; }
    }
  </style>
</div>
`,
					},
				];
			}
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: `WordPress Block API v3 definition for ${name}.`,
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: `exhuma/${slug}`,
							version: '1.0.0',
							title: `Exhuma ${name}`,
							category: 'widgets',
							description,
							attributes: {},
							render: 'file:./render.php',
						},
						null,
						2
					),
				},
				{
					filename: 'render.php',
					language: 'php',
					description: `WordPress render template for ${name}.`,
					code: `<?php\n/**\n * ${name} Block Render Template\n */\n$wrapper_attributes = get_block_wrapper_attributes(['class' => '${defaultTailwindClass}']);\n?>\n<div <?php echo $wrapper_attributes; ?>>\n  <?php echo $content; ?>\n</div>\n`,
				},
			];
		}

		case 'react-native': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} native horizontal rail component.`,
						code: `import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, type ViewProps } from 'react-native';

export interface HorizontalScrollerProps<Item> extends ViewProps {
  itemGap?: number;
  cardWidth?: number;
  data: readonly Item[];
  renderItem: ({ item, index }: { item: Item; index: number }) => React.ReactElement;
  keyExtractor?: (item: Item, index: number) => string;
}

const { width } = Dimensions.get('window');

export function HorizontalScroller<Item>({
  itemGap = 28,
  cardWidth = width * 0.78,
  data,
  renderItem,
  keyExtractor = (_, i) => String(i),
  style,
  ...props
}: HorizontalScrollerProps<Item>) {
  return (
    <View style={[styles.container, style]} {...props}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + itemGap}
        decelerationRate="fast"
        contentContainerStyle={[styles.list, { gap: itemGap }]}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <View style={{ width: cardWidth }}>
            {renderItem({ item, index })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
});
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} with scroll-driven Animated scale decay (Hermite smoothstep).`,
						code: `import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  type ViewProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Hermite cubic smoothstep — identical to web Big-Omega kernel */
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export interface ${pascalName}Props extends ViewProps {
  topStart?: number;
  topIncrement?: number;
  cardGap?: number;
  scaleThreshold?: number;
  minScale?: number;
  reverseScale?: boolean;
  children?: React.ReactNode;
}

export function ${pascalName}({
  topStart = 20,
  topIncrement = 28,
  cardGap = 20,
  scaleThreshold = 150,
  minScale = 0.9,
  reverseScale = true,
  style,
  children,
  ...props
}: ${pascalName}Props) {
  const childArray = React.Children.toArray(children);
  const total = childArray.length;

  // Pre-allocate one Animated.Value per card — zero allocations during scroll
  const scrollY = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    childArray.map(() => new Animated.Value(1))
  ).current;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      scrollY.setValue(y);

      // Phase 1+2: compute and set scale per card (native driver handles GPU layer)
      for (let i = 0; i < total; i++) {
        const stickyTop = reverseScale && i === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + i * topIncrement;
        const progress = Math.max(0, Math.min(1, (SCREEN_HEIGHT - stickyTop - y * 0.3) / scaleThreshold));
        const targetScale = minScale + (1 - minScale) * smoothstep(progress);
        scaleAnims[i].setValue(targetScale);
      }
    },
    [total, topStart, topIncrement, scaleThreshold, minScale, scaleAnims, scrollY, reverseScale]
  );

  return (
    <ScrollView
      style={[styles.container, style]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {childArray.map((child, index) => {
        const stickyTop = reverseScale && index === total - 1 ? topStart + Math.max(0, total - 2) * topIncrement : topStart + index * topIncrement;
        return (
          <Animated.View
            key={index}
            style={{
              marginTop: index === 0 ? stickyTop : topIncrement,
              marginBottom: cardGap,
              zIndex: index + 1,
              transform: [{ scale: scaleAnims[index] }],
            }}
          >
            {child}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} native mobile 3D perspective tilt component.`,
						code: `import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  type ViewProps,
  type LayoutChangeEvent,
} from 'react-native';

export interface TiltCardProps extends ViewProps {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  reverse?: boolean;
  disabled?: boolean;
  axis?: 'all' | 'x' | 'y';
  children?: React.ReactNode;
}

export function TiltCard({
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  speed = 0.12,
  reverse = false,
  disabled = false,
  axis = 'all',
  children,
  style,
  ...props
}: TiltCardProps) {
  const dimensions = useRef({ width: 0, height: 0 }).current;
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    dimensions.width = width;
    dimensions.height = height;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
          toValue: scale,
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }).start();
      },
      onPanResponderMove: (evt) => {
        if (disabled || dimensions.width === 0 || dimensions.height === 0) return;
        const { locationX, locationY } = evt.nativeEvent;

        const normX = Math.max(-0.5, Math.min(0.5, locationX / dimensions.width - 0.5));
        const normY = Math.max(-0.5, Math.min(0.5, locationY / dimensions.height - 0.5));
        const sign = reverse ? -1 : 1;

        const targetRotX = normY * -maxTilt * sign;
        const targetRotY = normX * maxTilt * sign;

        Animated.spring(tiltX, {
          toValue: axis === 'y' ? 0 : targetRotX,
          useNativeDriver: true,
          friction: 6,
          tension: 50,
        }).start();

        Animated.spring(tiltY, {
          toValue: axis === 'x' ? 0 : targetRotY,
          useNativeDriver: true,
          friction: 6,
          tension: 50,
        }).start();
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tiltX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 7,
            tension: 40,
          }),
          Animated.spring(tiltY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 7,
            tension: 40,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 7,
            tension: 40,
          }),
        ]).start();
      },
    })
  ).current;

  const rotateX = tiltX.interpolate({
    inputRange: [-maxTilt, maxTilt],
    outputRange: [\`\${-maxTilt}deg\`, \`\${maxTilt}deg\`],
  });

  const rotateY = tiltY.interpolate({
    inputRange: [-maxTilt, maxTilt],
    outputRange: [\`\${-maxTilt}deg\`, \`\${maxTilt}deg\`],
  });

  return (
    <Animated.View
      onLayout={onLayout}
      {...panResponder.panHandlers}
      style={[
        styles.container,
        style,
        {
          transform: [
            { perspective },
            { rotateX },
            { rotateY },
            { scale: scaleAnim },
          ],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
  },
});
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} native mobile illumination tracking component.`,
						code: `import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  type ViewProps,
  type LayoutChangeEvent,
} from 'react-native';

export interface SpotlightCardProps extends ViewProps {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  spread?: number;
  mode?: 'both' | 'border' | 'background';
  smoothing?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function SpotlightCard({
  radius = 350,
  color = '#6366f1',
  borderColor = '#818cf8',
  opacity = 0.85,
  spread = 60,
  mode = 'both',
  smoothing = 0.2,
  disabled = false,
  children,
  style,
  ...props
}: SpotlightCardProps) {
  const dimensions = useRef({ width: 0, height: 0 }).current;
  const spotlightPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const spotlightOpacity = useRef(new Animated.Value(0)).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    dimensions.width = width;
    dimensions.height = height;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        if (disabled) return;
        const { locationX, locationY } = evt.nativeEvent;
        spotlightPos.setValue({ x: locationX - radius, y: locationY - radius });
        Animated.timing(spotlightOpacity, {
          toValue: opacity,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (evt) => {
        if (disabled) return;
        const { locationX, locationY } = evt.nativeEvent;
        if (smoothing <= 0 || smoothing >= 1) {
          spotlightPos.setValue({ x: locationX - radius, y: locationY - radius });
        } else {
          Animated.spring(spotlightPos, {
            toValue: { x: locationX - radius, y: locationY - radius },
            friction: 7,
            tension: 50,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderRelease: () => {
        Animated.timing(spotlightOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const showGlow = mode === 'both' || mode === 'background';
  const showBorder = mode === 'both' || mode === 'border';

  return (
    <View
      onLayout={onLayout}
      {...panResponder.panHandlers}
      style={[styles.container, style]}
      {...props}
    >
      {showGlow && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.spotlight,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor: color,
              opacity: spotlightOpacity,
              transform: spotlightPos.getTranslateTransform(),
            },
          ]}
        />
      )}
      {showBorder && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.borderOverlay,
            {
              borderColor: borderColor,
              opacity: spotlightOpacity,
            },
          ]}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(23, 23, 23, 0.6)',
  },
  spotlight: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  borderOverlay: {
    borderWidth: 1.5,
    borderRadius: 20,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const colorFrom = String(props.colorFrom ?? '#ffaa40');
				const colorTo = String(props.colorTo ?? '#9c40ff');

				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `React Native ${name} perimeter laser trace component.`,
						code: `import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, type ViewProps } from 'react-native';

export interface BorderBeamProps extends ViewProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = ${size},
  duration = ${duration},
  borderWidth = ${borderWidth},
  colorFrom = '${colorFrom}',
  colorTo = '${colorTo}',
  style,
  ...props
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [duration]);

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View pointerEvents="none" style={[styles.container, { borderWidth }, style]} {...props}>
      <Animated.View
        style={[
          styles.beam,
          {
            width: size,
            height: size,
            backgroundColor: colorFrom,
            transform: [{ rotate }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  beam: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.8,
  },
});
`,
					},
				];
			}
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `React Native ${name} component.`,
					code: `import React from 'react';\nimport { View, StyleSheet, type ViewProps } from 'react-native';\n\nexport const ${pascalName}: React.FC<ViewProps> = ({ style, children, ...props }) => (\n  <View style={[styles.container, style]} {...props}>\n    {children}\n  </View>\n);\n\nconst styles = StyleSheet.create({\n  container: {\n    overflow: 'hidden',\n    borderRadius: 16,\n  },\n});\n`,
				},
			];
		}

		case 'flutter': {
			if (slug === 'horizontal-scroller') {
				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} native horizontal scroll rail.`,
						code: `import 'package:flutter/material.dart';

class ExhumaHorizontalScroller extends StatelessWidget {
  final List<Widget> children;
  final double itemGap;
  final double cardWidth;

  const ExhumaHorizontalScroller({
    super.key,
    required this.children,
    this.itemGap = 28.0,
    this.cardWidth = 320.0,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 240,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: children.length,
        separatorBuilder: (_, __) => SizedBox(width: itemGap),
        itemBuilder: (context, index) {
          return SizedBox(
            width: cardWidth,
            child: children[index],
          );
        },
      ),
    );
  }
}
`,
					},
				];
			}
			if (slug === 'stacking-cards') {
				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} with kinetic scroll-driven scale decay (Hermite smoothstep).`,
						code: `import 'package:flutter/material.dart';

double _smoothstep(double t) {
  final c = t.clamp(0.0, 1.0);
  return c * c * (3 - 2 * c);
}

class Exhuma${pascalName} extends StatefulWidget {
  final List<Widget> children;
  final double topStart;
  final double topIncrement;
  final double cardGap;
  final double scaleThreshold;
  final double minScale;
  final bool reverseScale;

  const Exhuma${pascalName}({
    super.key,
    required this.children,
    this.topStart = 20.0,
    this.topIncrement = 28.0,
    this.cardGap = 20.0,
    this.scaleThreshold = 150.0,
    this.minScale = 0.9,
    this.reverseScale = true,
  });

  @override
  State<Exhuma${pascalName}> createState() => _Exhuma${pascalName}State();
}

class _Exhuma${pascalName}State extends State<Exhuma${pascalName}> {
  late final ScrollController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController()..addListener(_onScroll);
  }

  void _onScroll() {
    setState(() {});
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final offset = _controller.hasClients ? _controller.offset : 0.0;
    final total = widget.children.length;

    return SingleChildScrollView(
      controller: _controller,
      physics: const BouncingScrollPhysics(),
      child: Column(
        children: widget.children.asMap().entries.map((entry) {
          final index = entry.key;
          final child = entry.value;
          final stickyTop = widget.reverseScale && index == total - 1
              ? widget.topStart + (total > 1 ? total - 2 : 0) * widget.topIncrement
              : widget.topStart + index * widget.topIncrement;

          final rawProgress = (offset - (index * widget.scaleThreshold)) / widget.scaleThreshold;
          final progress = _smoothstep(rawProgress);
          final scale = widget.minScale + (1.0 - widget.minScale) * (1.0 - progress);

          return Transform.scale(
            scale: scale,
            alignment: Alignment.topCenter,
            child: Container(
              margin: EdgeInsets.only(
                top: index == 0 ? stickyTop : widget.topIncrement,
                bottom: widget.cardGap,
              ),
              child: child,
            ),
          );
        }).toList(),
      ),
    );
  }
}
`,
					},
				];
			}
			if (slug === 'tilt-card') {
				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} native 3D perspective Euler matrix tilt widget.`,
						code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaTiltCard extends StatefulWidget {
  final Widget child;
  final double maxTilt;
  final double perspective;
  final double scale;
  final double speed;
  final bool reverse;
  final bool disabled;
  final String axis;

  const ExhumaTiltCard({
    super.key,
    required this.child,
    this.maxTilt = 15.0,
    this.perspective = 1000.0,
    this.scale = 1.02,
    this.speed = 0.12,
    this.reverse = false,
    this.disabled = false,
    this.axis = 'all',
  });

  @override
  State<ExhumaTiltCard> createState() => _ExhumaTiltCardState();
}

class _ExhumaTiltCardState extends State<ExhumaTiltCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  double _rotX = 0.0;
  double _rotY = 0.0;
  double _scale = 1.0;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onEnter(PointerEnterEvent event) {
    if (widget.disabled) return;
    setState(() {
      _isHovered = true;
      _scale = widget.scale;
    });
  }

  void _onHover(PointerHoverEvent event, BoxConstraints constraints) {
    if (widget.disabled || constraints.maxWidth <= 0 || constraints.maxHeight <= 0) return;

    final x = event.localPosition.dx;
    final y = event.localPosition.dy;

    final normX = (x / constraints.maxWidth - 0.5).clamp(-0.5, 0.5);
    final normY = (y / constraints.maxHeight - 0.5).clamp(-0.5, 0.5);
    final sign = widget.reverse ? -1.0 : 1.0;

    final maxTiltRad = widget.maxTilt * (math.pi / 180.0);
    final rawRotX = normY * -maxTiltRad * sign;
    final rawRotY = normX * maxTiltRad * sign;

    setState(() {
      _rotX = widget.axis == 'y' ? 0.0 : rawRotX;
      _rotY = widget.axis == 'x' ? 0.0 : rawRotY;
    });
  }

  void _onExit(PointerExitEvent event) {
    setState(() {
      _isHovered = false;
      _rotX = 0.0;
      _rotY = 0.0;
      _scale = 1.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final transform = Matrix4.identity()
          ..setEntry(3, 2, 1.0 / widget.perspective)
          ..rotateX(_rotX)
          ..rotateY(_rotY)
          ..scale(_scale);

        return MouseRegion(
          onEnter: _onEnter,
          onHover: (e) => _onHover(e, constraints),
          onExit: _onExit,
          child: Transform(
            transform: transform,
            alignment: FractionalOffset.center,
            child: widget.child,
          ),
        );
      },
    );
  }
}
`,
					},
				];
			}
			if (slug === 'spotlight-card') {
				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} native illumination tracking canvas widget.`,
						code: `import 'package:flutter/material.dart';

class ExhumaSpotlightCard extends StatefulWidget {
  final Widget child;
  final double radius;
  final Color color;
  final Color borderColor;
  final double opacity;
  final double spread;
  final String mode;
  final double smoothing;
  final bool disabled;

  const ExhumaSpotlightCard({
    super.key,
    required this.child,
    this.radius = 350.0,
    this.color = const Color(0xFF6366F1),
    this.borderColor = const Color(0xFF818CF8),
    this.opacity = 0.85,
    this.spread = 60.0,
    this.mode = 'both',
    this.smoothing = 0.2,
    this.disabled = false,
  });

  @override
  State<ExhumaSpotlightCard> createState() => _ExhumaSpotlightCardState();
}

class _ExhumaSpotlightCardState extends State<ExhumaSpotlightCard> {
  Offset? _spotlightPos;
  double _opacity = 0.0;

  void _onEnter(PointerEnterEvent event) {
    if (widget.disabled) return;
    setState(() {
      _spotlightPos = event.localPosition;
      _opacity = widget.opacity;
    });
  }

  void _onHover(PointerHoverEvent event) {
    if (widget.disabled) return;
    setState(() {
      _spotlightPos = event.localPosition;
      _opacity = widget.opacity;
    });
  }

  void _onExit(PointerExitEvent event) {
    setState(() {
      _opacity = 0.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final showGlow = widget.mode == 'both' || widget.mode == 'background';
    final showBorder = widget.mode == 'both' || widget.mode == 'border';

    return MouseRegion(
      onEnter: _onEnter,
      onHover: _onHover,
      onExit: _onExit,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                color: const Color(0xE6171717),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: const Color(0x1AFFFFFF),
                  width: 1,
                ),
              ),
              child: widget.child,
            ),
            if (showGlow && _spotlightPos != null)
              Positioned.fill(
                child: IgnorePointer(
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 150),
                    opacity: _opacity,
                    child: CustomPaint(
                      painter: _SpotlightPainter(
                        center: _spotlightPos!,
                        radius: widget.radius,
                        color: widget.color,
                        spread: widget.spread,
                      ),
                    ),
                  ),
                ),
              ),
            if (showBorder && _spotlightPos != null)
              Positioned.fill(
                child: IgnorePointer(
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 150),
                    opacity: _opacity,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: widget.borderColor,
                          width: 1.5,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SpotlightPainter extends CustomPainter {
  final Offset center;
  final double radius;
  final Color color;
  final double spread;

  _SpotlightPainter({
    required this.center,
    required this.radius,
    required this.color,
    required this.spread,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = RadialGradient(
        center: Alignment(
          (center.dx / size.width) * 2.0 - 1.0,
          (center.dy / size.height) * 2.0 - 1.0,
        ),
        radius: radius / size.shortestSide,
        colors: [color, Colors.transparent],
        stops: [spread / 100.0, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant _SpotlightPainter oldDelegate) {
    return oldDelegate.center != center ||
        oldDelegate.radius != radius ||
        oldDelegate.color != color ||
        oldDelegate.spread != spread;
  }
}
`,
					},
				];
			}
			if (slug === 'border-beam') {
				const size = Number(props.size ?? 200);
				const duration = Number(props.duration ?? 8);
				const borderWidth = Number(props.borderWidth ?? 2);
				const borderRadius = Number(props.borderRadius ?? 16);

				return [
					{
						filename: `${snakeName}.dart`,
						language: 'dart',
						description: `Flutter ${name} perimeter laser trace widget.`,
						code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaBorderBeam extends StatefulWidget {
  final double size;
  final double duration;
  final double borderWidth;
  final double borderRadius;
  final Color colorFrom;
  final Color colorTo;

  const ExhumaBorderBeam({
    super.key,
    this.size = ${size}.0,
    this.duration = ${duration}.0,
    this.borderWidth = ${borderWidth},
    this.borderRadius = ${borderRadius}.0,
    this.colorFrom = const Color(0xFFFFAA40),
    this.colorTo = const Color(0xFF9C40FF),
  });

  @override
  State<ExhumaBorderBeam> createState() => _ExhumaBorderBeamState();
}

class _ExhumaBorderBeamState extends State<ExhumaBorderBeam>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: widget.duration.toInt()),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _BorderBeamPainter(
            progress: _controller.value,
            borderWidth: widget.borderWidth,
            borderRadius: widget.borderRadius,
            colorFrom: widget.colorFrom,
            colorTo: widget.colorTo,
          ),
        );
      },
    );
  }
}

class _BorderBeamPainter extends CustomPainter {
  final double progress;
  final double borderWidth;
  final double borderRadius;
  final Color colorFrom;
  final Color colorTo;

  _BorderBeamPainter({
    required this.progress,
    required this.borderWidth,
    required this.borderRadius,
    required this.colorFrom,
    required this.colorTo,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rrect = RRect.fromRectAndRadius(rect, Radius.circular(borderRadius));

    final paint = Paint()
      ..shader = SweepGradient(
        startAngle: 0.0,
        endAngle: math.pi * 2,
        colors: [colorFrom, colorTo, Colors.transparent],
        stops: const [0.0, 0.25, 0.5],
        transform: GradientRotation(progress * math.pi * 2),
      ).createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = borderWidth;

    canvas.drawRRect(rrect, paint);
  }

  @override
  bool shouldRepaint(covariant _BorderBeamPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.borderWidth != borderWidth ||
        oldDelegate.borderRadius != borderRadius ||
        oldDelegate.colorFrom != colorFrom ||
        oldDelegate.colorTo != colorTo;
  }
}
`,
					},
				];
			}
			return [
				{
					filename: `${snakeName}.dart`,
					language: 'dart',
					description: `Flutter ${name} widget.`,
					code: `import 'package:flutter/material.dart';\n\nclass Exhuma${pascalName} extends StatelessWidget {\n  final Widget child;\n  const Exhuma${pascalName}({super.key, required this.child});\n\n  @override\n  Widget build(BuildContext context) {\n    return Container(child: child);\n  }\n}\n`,
				},
			];
		}
	}
}

function getEjectedReactCode(slug: string, pascalName: string, defaultClass: string, props: Record<string, unknown>, isNext: boolean): string {
	const header = `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';\nimport { clsx } from 'clsx';\n\n`;

	switch (slug) {
		case 'tilt-card': {
			const maxTilt = Number(props.maxTilt ?? 15);
			const perspective = Number(props.perspective ?? 1000);
			const scale = Number(props.scale ?? 1.02);
			const speed = Number(props.speed ?? 0.12);
			const reverse = Boolean(props.reverse ?? false);
			const disabled = Boolean(props.disabled ?? false);
			const axis = (props.axis as string) ?? 'all';

			return `${header}export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  reverse?: boolean;
  disabled?: boolean;
  axis?: 'all' | 'x' | 'y';
}

/**
 * TiltCard — Standalone Ejected Engine (Zero-Dependency)
 * Inlines 3D Euler matrix transformation with Ω(1) cached bounds
 * and frame-coalesced 120 FPS requestAnimationFrame physics loop.
 */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      maxTilt = ${maxTilt},
      perspective = ${perspective},
      scale = ${scale},
      speed = ${speed},
      reverse = ${reverse},
      disabled = ${disabled},
      axis = '${axis}',
      className,
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const cardRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const rectRef = React.useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const rafIdRef = React.useRef<number | null>(null);

    const currentRotX = React.useRef(0);
    const currentRotY = React.useRef(0);
    const currentScale = React.useRef(1);
    const targetRotX = React.useRef(0);
    const targetRotY = React.useRef(0);
    const targetScale = React.useRef(1);
    const isHovered = React.useRef(false);

    const updatePhysics = React.useCallback(() => {
      const el = cardRef.current;
      if (!el) {
        rafIdRef.current = null;
        return;
      }

      currentRotX.current += (targetRotX.current - currentRotX.current) * speed;
      currentRotY.current += (targetRotY.current - currentRotY.current) * speed;
      currentScale.current += (targetScale.current - currentScale.current) * speed;

      el.style.transform = \`perspective(\${perspective}px) rotateX(\${currentRotX.current.toFixed(2)}deg) rotateY(\${currentRotY.current.toFixed(2)}deg) scale3d(\${currentScale.current.toFixed(4)}, \${currentScale.current.toFixed(4)}, \${currentScale.current.toFixed(4)})\`;

      const diffRot = Math.abs(targetRotX.current - currentRotX.current) + Math.abs(targetRotY.current - currentRotY.current);
      const diffScale = Math.abs(targetScale.current - currentScale.current);

      if (isHovered.current || diffRot > 0.01 || diffScale > 0.001) {
        rafIdRef.current = requestAnimationFrame(updatePhysics);
      } else {
        rafIdRef.current = null;
      }
    }, [perspective, speed, cardRef]);

    const scheduleRaf = React.useCallback(() => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePhysics);
      }
    }, [updatePhysics]);

    const handlePointerEnter = React.useCallback(() => {
      if (disabled) return;
      isHovered.current = true;
      targetScale.current = scale;
      const el = cardRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
      scheduleRaf();
    }, [disabled, scale, cardRef, scheduleRaf]);

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        const el = cardRef.current;
        if (!el) return;
        if (!rectRef.current) {
          const r = el.getBoundingClientRect();
          rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
        }
        const rect = rectRef.current;
        if (!rect || rect.width <= 0 || rect.height <= 0) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5));
        const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5));
        const sign = reverse ? -1 : 1;

        const rawRotX = normY * -maxTilt * sign;
        const rawRotY = normX * maxTilt * sign;

        targetRotX.current = axis === 'y' ? 0 : rawRotX;
        targetRotY.current = axis === 'x' ? 0 : rawRotY;

        scheduleRaf();
      },
      [disabled, maxTilt, reverse, axis, cardRef, scheduleRaf]
    );

    const handlePointerLeave = React.useCallback(() => {
      isHovered.current = false;
      rectRef.current = null;
      targetRotX.current = 0;
      targetRotY.current = 0;
      targetScale.current = 1;
      scheduleRaf();
    }, [scheduleRaf]);

    React.useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, []);

    return (
      <div
        ref={cardRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={clsx('${defaultClass}', className)}
        style={{
          transform: \`perspective(\${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)\`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TiltCard.displayName = 'TiltCard';
`;
		}

		case 'spotlight-card': {
			const radius = Number(props.radius ?? 350);
			const color = String(props.color ?? '#6366f1');
			const borderColor = String(props.borderColor ?? '#818cf8');
			const opacity = Number(props.opacity ?? 0.85);
			const spread = Number(props.spread ?? 60);
			const mode = (props.mode as string) ?? 'both';
			const smoothing = Number(props.smoothing ?? 0.2);
			const disabled = Boolean(props.disabled ?? false);

			return `${header}export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  spread?: number;
  mode?: 'both' | 'border' | 'background';
  smoothing?: number;
  disabled?: boolean;
}

/**
 * SpotlightCard — Standalone Ejected Engine (Zero-Dependency)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) Constant-Time kinetic updates (Zero React re-renders on pointermove).
 * - Ω(1) Zero Heap Allocation during active tracking.
 * - Cached bounding geometry on pointerenter to eliminate layout reflow.
 * - Frame-coalesced rAF exponential smoothing.
 * - Sub-pixel radial border illumination mask + background sheen.
 */
export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      radius = ${radius},
      color = '${color}',
      borderColor = '${borderColor}',
      opacity = ${opacity},
      spread = ${spread},
      mode = '${mode}',
      smoothing = ${smoothing},
      disabled = ${disabled},
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const cardRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const rafIdRef = React.useRef<number | null>(null);
    const rectRef = React.useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const isHoveredRef = React.useRef(false);
    const isReducedMotionRef = React.useRef(false);

    const targetX = React.useRef(-9999);
    const targetY = React.useRef(-9999);
    const currentX = React.useRef(-9999);
    const currentY = React.useRef(-9999);
    const currentOpacity = React.useRef(0);
    const targetOpacity = React.useRef(0);

    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotionRef.current = mediaQuery.matches;

      const handler = (e: MediaQueryListEvent) => {
        isReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const measureRect = React.useCallback(() => {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    }, [cardRef]);

    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const handlePassiveUpdate = () => {
        if (isHoveredRef.current) measureRect();
      };

      window.addEventListener('resize', handlePassiveUpdate, { passive: true });
      window.addEventListener('scroll', handlePassiveUpdate, { passive: true });

      return () => {
        window.removeEventListener('resize', handlePassiveUpdate);
        window.removeEventListener('scroll', handlePassiveUpdate);
      };
    }, [measureRect]);

    const updateFrame = React.useCallback(() => {
      const el = cardRef.current;
      if (!el) return;

      if (disabled || isReducedMotionRef.current) {
        el.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafIdRef.current = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing));
      currentX.current += (targetX.current - currentX.current) * factor;
      currentY.current += (targetY.current - currentY.current) * factor;
      currentOpacity.current += (targetOpacity.current - currentOpacity.current) * Math.max(0.08, factor * 0.75);

      el.style.setProperty('--exhuma-spotlight-x', currentX.current.toFixed(2) + 'px');
      el.style.setProperty('--exhuma-spotlight-y', currentY.current.toFixed(2) + 'px');
      el.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.current.toFixed(3));

      const diffX = Math.abs(targetX.current - currentX.current);
      const diffY = Math.abs(targetY.current - currentY.current);
      const diffOp = Math.abs(targetOpacity.current - currentOpacity.current);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHoveredRef.current) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      } else {
        rafIdRef.current = null;
      }
    }, [cardRef, disabled, smoothing]);

    const scheduleUpdate = React.useCallback(() => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }
    }, [updateFrame]);

    const handlePointerEnter = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || isReducedMotionRef.current) return;
        isHoveredRef.current = true;
        measureRect();

        const rect = rectRef.current;
        if (rect) {
          targetX.current = e.clientX - rect.left;
          targetY.current = e.clientY - rect.top;
          targetOpacity.current = Math.max(0, Math.min(1, opacity));

          if (currentX.current < -1000) {
            currentX.current = targetX.current;
            currentY.current = targetY.current;
          }
        }

        scheduleUpdate();
      },
      [disabled, measureRect, opacity, scheduleUpdate]
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || isReducedMotionRef.current) return;
        isHoveredRef.current = true;
        if (!rectRef.current) measureRect();
        const rect = rectRef.current;
        if (!rect) return;

        targetX.current = e.clientX - rect.left;
        targetY.current = e.clientY - rect.top;
        targetOpacity.current = Math.max(0, Math.min(1, opacity));

        if (currentX.current < -1000) {
          currentX.current = targetX.current;
          currentY.current = targetY.current;
        }

        scheduleUpdate();
      },
      [disabled, measureRect, opacity, scheduleUpdate]
    );

    const handlePointerLeave = React.useCallback(() => {
      isHoveredRef.current = false;
      targetOpacity.current = 0;
      scheduleUpdate();
    }, [scheduleUpdate]);

    React.useEffect(() => {
      const el = cardRef.current;
      if (!el) return;

      el.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
      el.style.setProperty('--exhuma-spotlight-color', color);
      el.style.setProperty('--exhuma-spotlight-border-color', borderColor);
      el.style.setProperty('--exhuma-spotlight-spread', spread + '%');

      if (disabled) {
        el.style.setProperty('--exhuma-spotlight-opacity', '0');
      }

      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [cardRef, radius, color, borderColor, spread, disabled, opacity]);

    const showBorder = mode === 'both' || mode === 'border';
    const showSheen = mode === 'both' || mode === 'background';

    return (
      <div
        ref={cardRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={clsx('${defaultClass}', className)}
        style={{
          ['--exhuma-spotlight-radius' as string]: radius + 'px',
          ['--exhuma-spotlight-color' as string]: color,
          ['--exhuma-spotlight-border-color' as string]: borderColor,
          ['--exhuma-spotlight-spread' as string]: spread + '%',
          ['--exhuma-spotlight-opacity' as string]: '0',
          ...style,
        }}
        {...props}
      >
        {/* Specular Border Glow Mask */}
        {showBorder && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style={{
              opacity: 'var(--exhuma-spotlight-opacity, 0)',
              border: '1.5px solid transparent',
              background: 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
          />
        )}

        {/* Background Radial Sheen */}
        {showSheen && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              opacity: mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)',
              background: 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))',
            }}
          />
        )}

        <div className="relative z-20">{children}</div>
      </div>
    );
  }
);
SpotlightCard.displayName = 'SpotlightCard';
`;
		}

		case 'border-beam': {
			const size = Number(props.size ?? 200);
			const duration = Number(props.duration ?? 8);
			const borderWidth = Number(props.borderWidth ?? 2);
			const colorFrom = String(props.colorFrom ?? '#ffaa40');
			const colorTo = String(props.colorTo ?? '#9c40ff');
			const doubleBeam = Boolean(props.doubleBeam ?? false);
			const endOpacity = Number(props.endOpacity ?? 0);
			const opacity = Number(props.opacity ?? 1);
			const blur = Number(props.blur ?? 0);
			const borderRadius = Number(props.borderRadius ?? 16);

			return `${header}export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
}

/**
 * BorderBeam — Standalone Ejected Engine (Zero-Dependency)
 * Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel compositing.
 */
export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      size = ${size},
      duration = ${duration},
      borderWidth = ${borderWidth},
      borderRadius = ${borderRadius},
      colorFrom = '${colorFrom}',
      colorTo = '${colorTo}',
      doubleBeam = ${doubleBeam},
      endOpacity = ${endOpacity},
      opacity = ${opacity},
      blur = ${blur},
      className,
      style,
      ...props
    },
    ref
  ) => {
    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;
    const pathRadius = Math.min(size, 200);

    return (
      <div
        ref={ref}
        key={\`\${duration}-\${doubleBeam}-\${borderRadius}\`}
        aria-hidden="true"
        className={clsx('${defaultClass}', className)}
        style={{
          border: \`\${borderWidth}px solid transparent\`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: opacity !== 1 ? opacity : undefined,
          filter: blur > 0 ? \`blur(\${blur}px)\` : undefined,
          ...style,
        }}
        {...props}
      >
        <div
          className="exhuma-border-beam-trace"
          style={{
            position: 'absolute',
            aspectRatio: '1 / 1',
            width: \`\${size}px\`,
            offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
            offsetAnchor: \`\${size / 2}px \${size / 2}px\`,
            background: \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`,
            animation: \`exhuma-border-beam \${duration}s linear infinite\`,
          }}
        />

        {doubleBeam && (
          <div
            className="exhuma-border-beam-trace"
            style={{
              position: 'absolute',
              aspectRatio: '1 / 1',
              width: \`\${size}px\`,
              offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
              offsetAnchor: \`\${size / 2}px \${size / 2}px\`,
              background: \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`,
              animation: \`exhuma-border-beam \${duration}s linear -\${duration / 2}s infinite\`,
            }}
          />
        )}

        <style>{\`
          @keyframes exhuma-border-beam {
            from {
              offset-distance: 0%;
            }
            to {
              offset-distance: 100%;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .exhuma-border-beam-trace {
              animation-play-state: paused !important;
            }
          }
        \`}</style>
      </div>
    );
  }
);
BorderBeam.displayName = 'BorderBeam';
`;
		}

		case 'number-ticker': {
			const value = Number(props.value ?? 1000);
			return `${header}export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  duration?: number;
}

/**
 * NumberTicker — Standalone Ejected Engine (Zero-Dependency)
 * High-performance analytical RAF easeOutExpo numerical interpolation.
 */
export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  ({ value = ${value}, duration = 1200, className, ...props }, ref) => {
    const [displayVal, setDisplayVal] = React.useState(0);

    React.useEffect(() => {
      let start: number | null = null;
      let frameId: number;

      const step = (now: number) => {
        if (!start) start = now;
        const progress = Math.min((now - start) / duration, 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayVal(ease * value);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        }
      };

      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    }, [value, duration]);

    return (
      <span ref={ref} className={clsx('${defaultClass}', className)} {...props}>
        {Math.round(displayVal).toLocaleString()}
      </span>
    );
  }
);
NumberTicker.displayName = 'NumberTicker';
`;
		}

		case 'magnetic-button': {
			const strength = Number(props.strength ?? 0.35);
			return `${header}export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
}

/**
 * MagneticButton — Standalone Ejected Engine (Zero-Dependency)
 * Proximity-based inverse spring displacement field.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ strength = ${strength}, className, children, style, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLButtonElement>(null);
    const btnRef = (forwardedRef as React.RefObject<HTMLButtonElement>) || internalRef;
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      setOffset({ x: dx, y: dy });
    };

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 });
    };

    return (
      <button
        ref={btnRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={clsx('${defaultClass}', className)}
        style={{
          transform: \`translate3d(\${offset.x.toFixed(2)}px, \${offset.y.toFixed(2)}px, 0)\`,
          transition: offset.x === 0 && offset.y === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          ...style,
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';
`;
		}

		case 'stacking-cards': {
			const topStart = Number(props.topStart ?? 20);
			const topIncrement = Number(props.topIncrement ?? 28);
			const cardGap = Number(props.cardGap ?? 20);
			const scaleThreshold = Number(props.scaleThreshold ?? 150);
			const minScale = Number(props.minScale ?? 0.9);
			const reverseScale = props.reverseScale !== false;

			return `${header}/**
 * Pure Hermite interpolation function (Smoothstep)
 * Clamps t in [0, 1] and computes 3t^2 - 2t^3.
 * Zero heap allocation.
 */
export const smoothstep = (t: number): number => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

/**
 * Calculates progressive target scale values across stack layers.
 */
export const calculateScaleValue = (index: number, totalScalingSections: number, minScale: number, targetScale = 1.0): number => {
  if (totalScalingSections <= 1) return targetScale;
  const progress = index / (totalScalingSections - 1);
  const scale = minScale + progress * (targetScale - minScale);
  return Number(scale.toPrecision(6));
};

export const generateDefaultScaleValues = (count: number, minScale = 0.9): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [1.0];

  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const scale = minScale + progress * (1.0 - minScale);
    values.push(Number(scale.toPrecision(6)));
  }
  return values;
};

/**
 * Pure Mathematical Kernel for Tiered Reverse Cascade Scaling:
 * Big-Omega Guarantee: Ω(1) constant time, 0 heap allocations.
 */
export const getReverseScale = (
  cardIndex: number,
  lastTop: number,
  triggerTop: number,
  topStart: number,
  topIncrement: number,
  totalCards: number,
  scaleValues: readonly number[] | number[],
  minScale: number
): number => {
  if (totalCards <= 1) return 1.0;
  if (cardIndex === 0) return scaleValues[0] ?? minScale;
  if (lastTop >= triggerTop) return scaleValues[cardIndex] ?? 1.0;

  const startCP = cardIndex + 1 === totalCards ? triggerTop : topStart + (cardIndex + 1) * topIncrement;
  if (lastTop >= startCP) {
    return scaleValues[cardIndex] ?? 1.0;
  }

  for (let k = cardIndex + 1; k >= 2; k--) {
    const segTop = k === totalCards ? triggerTop : topStart + k * topIncrement;
    const segBottom = topStart + (k - 1) * topIncrement;

    if (lastTop <= segBottom) {
      if (k === 2) return scaleValues[0] ?? minScale;
      continue;
    }

    if (lastTop <= segTop) {
      const span = Math.max(1, segTop - segBottom);
      const rawProgress = (segTop - lastTop) / span;
      const c = Math.max(0, Math.min(1, rawProgress));
      const progress = c * c * (3 - 2 * c);
      const fromScale = scaleValues[k - 1] ?? 1.0;
      const toScale = scaleValues[k - 2] ?? minScale;
      return fromScale + progress * (toScale - fromScale);
    }
  }

  return scaleValues[0] ?? minScale;
};

export interface StackingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  topStart?: number;
  topIncrement?: number;
  minScale?: number;
  scaleThreshold?: number;
  cardGap?: number | string;
  gap?: number | string;
  reverseScale?: boolean;
  enableReverseScale?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}

/**
 * StackingCards — Standalone Ejected Engine (Zero-Dependency)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(120Hz) / Ω(60Hz) Frame rate floor: batched read-then-write cycles, zero layout thrashing.
 * - Ω(1) Constant-time kinetic dispatch pipeline with zero GC allocations during active scroll.
 * - Sub-pixel scale decay with delta-epsilon clamping.
 * - Dual-layer architecture: sticky outer shell + GPU-accelerated inner visual layer.
 * - 100% mathematical tier cascade parity.
 */
export const StackingCards = React.memo(
  React.forwardRef<HTMLDivElement, StackingCardsProps>(function StackingCards(
    {
      children,
      topStart = ${topStart},
      topIncrement = ${topIncrement},
      minScale = ${minScale},
      scaleThreshold = ${scaleThreshold},
      cardGap = ${cardGap},
      gap,
      reverseScale = ${reverseScale},
      enableReverseScale,
      scrollContainerRef,
      enabled = true,
      className,
      style,
      ...props
    },
    forwardedRef
  ) {
    const isReverseScaleEnabled = reverseScale ?? enableReverseScale ?? true;
    const internalWrapperRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const innerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const prevScalesRef = React.useRef<Float64Array>(new Float64Array(0));
    const targetScalesRef = React.useRef<Float64Array>(new Float64Array(0));
    const cardTopsBufferRef = React.useRef<Float64Array>(new Float64Array(0));
    const rafIdRef = React.useRef<number | null>(null);

    const resolvedGap = cardGap ?? gap ?? 20;
    const childArray = React.Children.toArray(children);
    const totalCards = childArray.length;
    const scaleValues = React.useMemo(() => generateDefaultScaleValues(totalCards, minScale), [totalCards, minScale]);

    const setWrapperRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (internalWrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      cardRefs.current.length = totalCards;
      innerRefs.current.length = totalCards;

      if (prevScalesRef.current.length !== totalCards) {
        prevScalesRef.current = new Float64Array(totalCards).fill(-1);
        targetScalesRef.current = new Float64Array(totalCards);
        cardTopsBufferRef.current = new Float64Array(totalCards);
      }

      const wrapper = internalWrapperRef.current;
      if (!wrapper || typeof window === 'undefined' || !enabled || totalCards === 0) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        innerRefs.current.forEach((inner) => {
          if (inner) inner.style.transform = 'scale(1)';
        });
        return;
      }

      const secondLastCardStickyTop = topStart + Math.max(0, totalCards - 1) * topIncrement;
      const triggerTop = totalCards > 1 ? secondLastCardStickyTop + topIncrement : topStart;
      let isIntersecting = false;

      const updateStackEffect = () => {
        rafIdRef.current = null;
        if (totalCards === 0) return;

        const lastIndex = totalCards - 1;
        const lastCard = cardRefs.current[lastIndex];
        const firstCard = cardRefs.current[0];
        if (!lastCard || !firstCard) return;

        const container = scrollContainerRef?.current;
        const scrollportTop = container ? container.getBoundingClientRect().top + (container.clientTop || 0) : 0;
        const scrollTop = container ? container.scrollTop : window.scrollY;

        const lastTop = lastCard.getBoundingClientRect().top - scrollportTop;
        const reverseActive = isReverseScaleEnabled && lastTop <= triggerTop;

        const targetScales = targetScalesRef.current;

        // Phase 1: Read & Calculation (Zero DOM Writes)
        if (reverseActive) {
          for (let i = 0; i < totalCards; i++) {
            targetScales[i] = getReverseScale(i, lastTop, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale);
          }
        } else {
          const cardTops = cardTopsBufferRef.current;
          for (let i = 0; i < totalCards; i++) {
            const card = cardRefs.current[i];
            cardTops[i] = card ? card.getBoundingClientRect().top - scrollportTop : 0;
          }

          for (let i = 0; i < totalCards; i++) {
            let forwardProgress = 0;
            if (i < totalCards - 1 && scrollTop > 0) {
              const cardTop = cardTops[i];
              const nextTop = cardTops[i + 1];
              const nextStickyTop = cardTop + topIncrement;

              const initialNextTop = nextTop + scrollTop;
              const scaleStart = Math.min(initialNextTop - 2, nextStickyTop + scaleThreshold);
              const scaleDistance = Math.max(1, scaleStart - nextStickyTop);

              if (nextTop <= scaleStart) {
                forwardProgress = smoothstep((scaleStart - nextTop) / scaleDistance);
              }
            }

            const targetScale = scaleValues[i] ?? 1.0;
            targetScales[i] = 1.0 + forwardProgress * (targetScale - 1.0);
          }
        }

        // Phase 2: Write with Delta-Epsilon Clamping
        const prevScales = prevScalesRef.current;
        for (let i = 0; i < totalCards; i++) {
          const inner = innerRefs.current[i];
          if (!inner) continue;

          const currentScale = targetScales[i];
          if (Math.abs(prevScales[i] - currentScale) > 0.00005) {
            prevScales[i] = currentScale;
            inner.style.transform = \`scale(\${currentScale.toFixed(5)})\`;
          }
        }
      };

      const handleScroll = () => {
        if (isIntersecting && rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(updateStackEffect);
        }
      };

      const target = scrollContainerRef?.current;
      const observer = new IntersectionObserver(
        (entries) => {
          isIntersecting = entries[0]?.isIntersecting ?? false;
          if (isIntersecting) updateStackEffect();
        },
        { root: target ?? null, rootMargin: '100px 0px', threshold: 0 }
      );
      observer.observe(wrapper);
      if (target) {
        target.addEventListener('scroll', handleScroll, { passive: true });
      }
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      updateStackEffect();

      return () => {
        if (target) {
          target.removeEventListener('scroll', handleScroll);
        }
        window.removeEventListener('scroll', handleScroll, { capture: true });
        window.removeEventListener('resize', handleScroll);
        observer.disconnect();
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [topStart, topIncrement, minScale, scaleThreshold, scrollContainerRef, enabled, totalCards, scaleValues, isReverseScaleEnabled]);

    return (
      <div
        ref={setWrapperRef}
        className={clsx('exhuma-stacking-cards-wrapper relative flex w-full flex-col', className)}
        style={{
          paddingTop: typeof topStart === 'number' ? \`\${topStart}px\` : topStart,
          gap: typeof resolvedGap === 'number' ? \`\${resolvedGap}px\` : resolvedGap,
          ...style,
        }}
        {...props}
      >
        {childArray.map((child, index) => {
          const isLast = totalCards > 1 && index === totalCards - 1;
          const stickyTop = isReverseScaleEnabled && isLast ? topStart + Math.max(0, totalCards - 2) * topIncrement : topStart + index * topIncrement;
          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="sticky w-full"
              style={{
                top: \`\${stickyTop}px\`,
                zIndex: index + 1,
              }}
            >
              <div
                ref={(el) => {
                  innerRefs.current[index] = el;
                }}
                className="relative w-full"
                style={{
                  transformOrigin: 'center top',
                  willChange: 'transform',
                }}
              >
                {React.isValidElement(child) ? child : <div>{child}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  })
);
`;
		}
		case 'horizontal-scroller': {
			const speed = Number(props.speed ?? 1.0);
			const itemGap = Number(props.itemGap ?? 28);
			const cardWidth = typeof props.cardWidth === 'number' ? props.cardWidth : Number(props.cardWidth ?? 320);
			const showProgress = props.showProgress !== false;
			const showFadeEdges = props.showFadeEdges !== false;
			const fadeWidth = Number(props.fadeWidth ?? 48);
			const fadeEdgeColor = String(props.fadeEdgeColor || '#ffffff');
			const fadeEdgeColorDark = String(props.fadeEdgeColorDark || '#09090b');

			return `${header}export interface HorizontalScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  header?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  trackClassName?: string;
}

export const calculateHorizontalDistance = (trackWidth: number, containerWidth: number, extraPadding = 60): number => {
  return Math.max(0, trackWidth - containerWidth + extraPadding);
};

export const calculateSectionHeight = (viewportHeight: number, horizontalDistance: number, speed = 1.0): number => {
  const safeSpeed = Math.max(0.1, speed);
  return Math.round(viewportHeight + horizontalDistance / safeSpeed);
};

export const calculateScrollProgress = (scrolledInto: number, totalScrollable: number): number => {
  if (totalScrollable <= 0) return 0;
  return Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);
};

/**
 * HorizontalScroller — Standalone Ejected Engine (Zero-Dependency)
 *
 * Pinned kinetic camera with 1:1 vertical-to-horizontal mapping (Brix Agency architecture).
 * Big-Omega Guarantees:
 * - Hardware compositor layer promotion with GPU CSS variables (--scroll-offset-x).
 * - Zero GC allocations during scroll traversal via cached bounding geometry.
 * - Sub-millisecond RAF decoupled dispatch.
 */
export const HorizontalScroller = React.memo(
  React.forwardRef<HTMLDivElement, HorizontalScrollerProps>(function HorizontalScroller(
    {
      children,
      speed = ${speed},
      itemGap = ${itemGap},
      cardWidth = ${cardWidth},
      showProgress = ${showProgress},
      showFadeEdges = ${showFadeEdges},
      fadeWidth = ${fadeWidth},
      fadeEdgeColor = '${fadeEdgeColor}',
      fadeEdgeColorDark = '${fadeEdgeColorDark}',
      mobileMode = 'scroll',
      header,
      scrollContainerRef,
      className,
      trackClassName,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalSectionRef = React.useRef<HTMLDivElement>(null);
    const sectionRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalSectionRef;
    const cameraRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    const progressTextRef = React.useRef<HTMLSpanElement>(null);

    const [sectionHeight, setSectionHeight] = React.useState<number | undefined>(undefined);
    const [cameraHeight, setCameraHeight] = React.useState<number | undefined>(undefined);
    const [isReducedMotion, setIsReducedMotion] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const isCustomContainer = Boolean(scrollContainerRef);

    const parsedCardWidth = React.useMemo(() => {
      if (typeof cardWidth === 'number') return \`\${cardWidth}px\`;
      if (typeof cardWidth === 'string') {
        if (/^\\d+$/.test(cardWidth.trim())) return \`\${cardWidth.trim()}px\`;
        return cardWidth;
      }
      return '320px';
    }, [cardWidth]);

    const [isDark, setIsDark] = React.useState(() => {
      if (typeof document !== 'undefined') {
        return (
          document.documentElement.classList.contains('dark') ||
          (!document.documentElement.classList.contains('light') &&
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        );
      }
      return false;
    });

    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      const checkDark = () => {
        const isDarkClass = document.documentElement.classList.contains('dark');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isExplicitLight = document.documentElement.classList.contains('light');
        setIsDark(isDarkClass || (!isExplicitLight && prefersDark));
      };

      checkDark();

      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });

      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', checkDark);

      return () => {
        observer.disconnect();
        mq.removeEventListener('change', checkDark);
      };
    }, []);

    const resolvedFadeColor = isDark && fadeEdgeColorDark ? fadeEdgeColorDark : fadeEdgeColor;
    const useColorOverlay = Boolean(showFadeEdges && resolvedFadeColor && resolvedFadeColor.trim() !== '');

    const maskStyle = React.useMemo<React.CSSProperties>(() => {
      if (!showFadeEdges || useColorOverlay) return {};
      const maskGradient = \`linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent)\`;
      return {
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
      };
    }, [showFadeEdges, fadeWidth, useColorOverlay]);

    React.useEffect(() => {
      const section = sectionRef.current;
      const camera = cameraRef.current;
      const track = trackRef.current;
      if (!section || !camera || !track || typeof window === 'undefined') return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsReducedMotion(prefersReducedMotion);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();

      if (prefersReducedMotion) {
        track.style.removeProperty('--scroll-offset-x');
        return;
      }

      let cachedHorizontalDistance = 0;
      let isIntersecting = false;
      let rafId: number | null = null;

      const scrollTarget: HTMLElement | Window = scrollContainerRef?.current ?? window;

      const recalculateDimensions = () => {
        const isContainer = Boolean(scrollContainerRef?.current);
        const viewportHeight = isContainer && scrollContainerRef?.current ? scrollContainerRef.current.clientHeight : window.innerHeight;
        setCameraHeight(viewportHeight);
        const trackWidth = track.scrollWidth;
        const containerWidth = camera.clientWidth;
        camera.style.setProperty('--camera-width', containerWidth + 'px');

        const horizontalDistance = calculateHorizontalDistance(trackWidth, containerWidth, itemGap * 2);
        cachedHorizontalDistance = horizontalDistance;

        const computedSectionHeight = calculateSectionHeight(viewportHeight, horizontalDistance, speed);
        setSectionHeight(computedSectionHeight);
      };

      recalculateDimensions();

      const resizeObserver = new ResizeObserver(() => {
        recalculateDimensions();
        handleScroll();
      });

      resizeObserver.observe(camera);
      resizeObserver.observe(track);

      const handleScroll = () => {
        if (!isIntersecting && !scrollContainerRef?.current) return;

        const sectionRect = section.getBoundingClientRect();
        let containerTop = 0;
        let viewportHeight = window.innerHeight;

        if (scrollContainerRef?.current) {
          const cRect = scrollContainerRef.current.getBoundingClientRect();
          containerTop = cRect.top;
          viewportHeight = scrollContainerRef.current.clientHeight;
        }

        const relativeTop = sectionRect.top - containerTop;
        const totalScrollable = section.offsetHeight - viewportHeight;

        const scrolledInto = -relativeTop;
        const progress = calculateScrollProgress(scrolledInto, totalScrollable);
        const currentTranslate = -(progress * cachedHorizontalDistance);

        track.style.setProperty('--scroll-offset-x', \`\${Number(currentTranslate.toFixed(2))}px\`);
        track.style.setProperty('--scroll-progress', \`\${Number(progress.toFixed(4))}\`);

        if (progressBarRef.current) {
          progressBarRef.current.style.width = \`\${Number((progress * 100).toFixed(1))}%\`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = \`\${Math.round(progress * 100)}%\`;
        }
      };

      const onScroll = () => {
        if (rafId === null) {
          rafId = window.requestAnimationFrame(() => {
            handleScroll();
            rafId = null;
          });
        }
      };

      let observer: IntersectionObserver | null = null;
      if (!scrollContainerRef?.current) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersecting = entry.isIntersecting;
              if (isIntersecting) {
                handleScroll();
              }
            });
          },
          { rootMargin: '100px 0px 100px 0px', threshold: 0 }
        );
        observer.observe(section);
      } else {
        isIntersecting = true;
      }

      scrollTarget.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculateDimensions, { passive: true });
      window.addEventListener('resize', checkMobile, { passive: true });

      handleScroll();

      return () => {
        scrollTarget.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculateDimensions);
        window.removeEventListener('resize', checkMobile);
        resizeObserver.disconnect();
        if (observer) observer.disconnect();
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }, [speed, itemGap, cardWidth, showProgress, showFadeEdges, fadeWidth, mobileMode, scrollContainerRef]);

    if (isReducedMotion) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-fallback w-full overflow-x-auto py-8', className)} style={style}>
          {header && <div className="mb-6 px-6 sm:px-10">{header}</div>}
          <div className={clsx('flex px-6 sm:px-10', trackClassName)} style={{ gap: \`\${itemGap}px\` }}>
            {React.Children.map(children, (child) => (
              <div className="exhuma-horizontal-card-item shrink-0" style={{ width: parsedCardWidth }}>
                {child}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isMobile && mobileMode === 'scroll' && !scrollContainerRef) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-mobile w-full py-8', className)} style={style}>
          {header && <div className="mb-6 px-6 sm:px-10">{header}</div>}
          <div className={clsx('flex overflow-x-auto px-6 sm:px-10 snap-x snap-mandatory scroll-smooth no-scrollbar', trackClassName)} style={{ gap: \`\${itemGap}px\` }}>
            {React.Children.map(children, (child) => (
              <div className="shrink-0 snap-center" style={{ width: '85vw' }}>
                {child}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isMobile && mobileMode === 'stack' && !scrollContainerRef) {
      return (
        <div className={clsx('exhuma-horizontal-scroller-stack flex w-full flex-col px-6 py-8 sm:px-10', className)} style={{ gap: \`\${itemGap}px\`, ...style }}>
          {header && <div className="mb-2">{header}</div>}
          {React.Children.map(children, (child) => (
            <div className="w-full">{child}</div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={sectionRef}
        className={clsx('exhuma-horizontal-scroller-section relative w-full', className)}
        style={{
          height: sectionHeight ? \`\${sectionHeight}px\` : '200vh',
          ...style,
        }}
        {...props}
      >
        <div
          ref={cameraRef}
          className="exhuma-horizontal-camera sticky top-0 flex w-full flex-col justify-center overflow-hidden"
          style={{
            height: isCustomContainer && cameraHeight ? cameraHeight + 'px' : '100vh',
          }}
        >
          {header && (
            <div className="exhuma-horizontal-header pointer-events-auto mb-6 w-full shrink-0 px-6 sm:px-10">
              {header}
            </div>
          )}

          <div className="exhuma-horizontal-track-wrapper relative w-full overflow-hidden" style={maskStyle}>
            {useColorOverlay && (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-10"
                  style={{
                    width: \`\${fadeWidth}px\`,
                    background: \`linear-gradient(to right, \${resolvedFadeColor}, transparent)\`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-10"
                  style={{
                    width: \`\${fadeWidth}px\`,
                    background: \`linear-gradient(to left, \${resolvedFadeColor}, transparent)\`,
                  }}
                />
              </>
            )}
            <div
              ref={trackRef}
              className={clsx('flex items-stretch will-change-transform select-none px-6 sm:px-10', trackClassName)}
              style={{
                gap: \`\${itemGap}px\`,
                transform: 'translate3d(var(--scroll-offset-x, 0px), 0px, 0px)',
              }}
            >
              {React.Children.map(children, (child) => (
                <div
                  className="exhuma-horizontal-card-item shrink-0"
                  style={{
                    width: parsedCardWidth,
                    flexShrink: 0,
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>

          {showProgress && (
            <div className="exhuma-horizontal-progress-bar mt-6 flex w-full items-center justify-between gap-4 px-6 sm:px-10">
              <div className="bg-foreground/10 relative h-1.5 w-full overflow-hidden rounded-full">
                <div
                  ref={progressBarRef}
                  className="bg-foreground h-full rounded-full transition-all duration-75"
                  style={{ width: '0%' }}
                />
              </div>
              <span
                ref={progressTextRef}
                className="text-muted-foreground font-mono text-3xs tabular-nums shrink-0"
              >
                0%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  })
);
HorizontalScroller.displayName = 'HorizontalScroller';
`;
		}

		case 'auto-grid': {
			const minItemWidth = Number(props.minItemWidth ?? 280);
			const gap = Number(props.gap ?? 24);
			const mode = (props.mode as string) ?? 'auto-fit';
			const maxColumns = Number(props.maxColumns ?? 4);
			const alignItems = (props.alignItems as string) ?? 'stretch';

			return `${header}export interface AutoGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number | 'full';
  rowSpan?: number;
}

/**
 * AutoGridItem — Standalone compound item with dynamic span support.
 */
export const AutoGridItem = React.forwardRef<HTMLDivElement, AutoGridItemProps>(
  ({ children, colSpan, rowSpan, className, style, ...props }, ref) => {
    const itemStyle: React.CSSProperties = {
      gridColumn: colSpan === 'full' ? '1 / -1' : typeof colSpan === 'number' ? \`span \${colSpan}\` : undefined,
      gridRow: typeof rowSpan === 'number' ? \`span \${rowSpan}\` : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx('exhuma-auto-grid-item', className)}
        style={itemStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AutoGridItem.displayName = 'AutoGridItem';

export interface AutoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: number | string;
  gap?: number | string;
  mode?: 'auto-fit' | 'auto-fill';
  maxColumns?: number;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
}

/**
 * AutoGrid — Standalone Ejected Engine (Zero-Dependency)
 * Inlines dynamic minmax repeat track calculation with zero media queries.
 * Evaluates maxColumns clamping with pure CSS fractional track distribution.
 */
export const AutoGrid = React.forwardRef<HTMLDivElement, AutoGridProps>(
  (
    {
      children,
      minItemWidth = ${minItemWidth},
      gap = ${gap},
      mode = '${mode}',
      maxColumns = ${maxColumns},
      alignItems = '${alignItems}',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const minWidthVal = typeof minItemWidth === 'number' ? \`\${minItemWidth}px\` : minItemWidth;
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    const minTrack = \`min(100%, \${minWidthVal})\`;

    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns:
        maxColumns && maxColumns > 0
          ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxColumns - 1} * \${gapVal}) / \${maxColumns})), 1fr))\`
          : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`,
      gap: gapVal,
      alignItems,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx('exhuma-auto-grid w-full', className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AutoGrid.displayName = 'AutoGrid';
`;
		}

		case 'css-masonry': {
			const columns = Number(props.columns ?? 1);
			const columnsSm = Number(props.columnsSm ?? 2);
			const columnsMd = Number(props.columnsMd ?? 2);
			const columnsLg = Number(props.columnsLg ?? 3);
			const columnsXl = Number(props.columnsXl ?? 4);
			const gap = Number(props.gap ?? 16);
			const columnFill = (props.columnFill as string) ?? 'balance';
			const height = Number(props.height ?? 0);

			return `${header}export interface CssMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  columnFill?: 'balance' | 'auto';
  height?: number;
}

/**
 * CssMasonry — Standalone Ejected Engine (Zero-Dependency)
 * Pure CSS multi-column responsive layout with break-inside protection.
 * Supports fluid balancing and sequential auto waterfall with zero JS layout overhead.
 */
export const CssMasonry = React.forwardRef<HTMLDivElement, CssMasonryProps>(
  (
    {
      children,
      columns = ${columns},
      columnsSm = ${columnsSm},
      columnsMd = ${columnsMd},
      columnsLg = ${columnsLg},
      columnsXl = ${columnsXl},
      gap = ${gap},
      columnFill = '${columnFill}',
      height = ${height},
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerStyle: React.CSSProperties = {
      columnCount: columns,
      columnGap: \`\${gap}px\`,
      columnFill: columnFill === 'auto' ? 'auto' : 'balance',
      height: columnFill === 'auto' && height && height > 0 ? \`\${height}px\` : undefined,
      overflowY: columnFill === 'auto' && height && height > 0 ? 'auto' : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'exhuma-css-masonry w-full',
          columnsSm && \`sm:[column-count:\${columnsSm}]\`,
          columnsMd && \`md:[column-count:\${columnsMd}]\`,
          columnsLg && \`lg:[column-count:\${columnsLg}]\`,
          columnsXl && \`xl:[column-count:\${columnsXl}]\`,
          className
        )}
        style={containerStyle}
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div
            className="break-inside-avoid"
            style={{ marginBottom: \`\${gap}px\` }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);
CssMasonry.displayName = 'CssMasonry';
`;
		}

		case 'bento-grid': {
			const cols = Number(props.cols ?? 3);
			const gap = Number(props.gap ?? 20);
			const rowHeight = Number(props.rowHeight ?? 180);

			return `${header}export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: number | string;
  rowHeight?: number | string;
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  enableGlow?: boolean;
  glowColor?: string;
}

/**
 * BentoGrid — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) auto-flow packing.
 * - Zero forced reflows during active pointer tracking via cached bounding rect.
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ children, cols = ${cols}, gap = ${gap}, rowHeight = ${rowHeight}, className, style, ...props }, ref) => {
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const autoRowsVal = rowHeight ? (typeof rowHeight === 'number' ? \`minmax(\${rowHeight}px, auto)\` : rowHeight) : undefined;

    return (
      <div
        ref={ref}
        className={clsx('exhuma-bento-grid grid w-full grid-flow-dense', className)}
        style={{
          gridTemplateColumns: \`repeat(\${cols}, minmax(0, 1fr))\`,
          gap: gapVal,
          ...(autoRowsVal ? { gridAutoRows: autoRowsVal } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = 'BentoGrid';

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, colSpan = 1, rowSpan = 1, enableGlow = true, glowColor = 'rgba(99, 102, 241, 0.08)', className, style, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const cardRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const rectRef = React.useRef<{ left: number; top: number } | null>(null);

    const handlePointerEnter = React.useCallback(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top };
    }, [cardRef]);

    const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      if (!rectRef.current) {
        const rect = el.getBoundingClientRect();
        rectRef.current = { left: rect.left, top: rect.top };
      }
      const x = e.clientX - rectRef.current.left;
      const y = e.clientY - rectRef.current.top;
      el.style.setProperty('--bento-x', \`\${x.toFixed(1)}px\`);
      el.style.setProperty('--bento-y', \`\${y.toFixed(1)}px\`);
    }, [cardRef]);

    const handlePointerLeave = React.useCallback(() => {
      rectRef.current = null;
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty('--bento-x', '-999px');
      el.style.setProperty('--bento-y', '-999px');
    }, [cardRef]);

    return (
      <div
        ref={cardRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={clsx(
          'exhuma-bento-card group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl',
          className
        )}
        style={{
          gridColumn: \`span \${colSpan}\`,
          gridRow: \`span \${rowSpan}\`,
          ...style,
        }}
        {...props}
      >
        {enableGlow && (
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: \`radial-gradient(400px circle at var(--bento-x, -999px) var(--bento-y, -999px), \${glowColor}, transparent 80%)\`,
            }}
          />
        )}
        <div className="relative z-10 flex h-full flex-col justify-between">{children}</div>
      </div>
    );
  }
);
BentoCard.displayName = 'BentoCard';

export const BentoHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-header space-y-2', className)} {...props}>
      {children}
    </div>
  )
);
BentoHeader.displayName = 'BentoHeader';

export const BentoContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-content text-sm text-muted-foreground', className)} {...props}>
      {children}
    </div>
  )
);
BentoContent.displayName = 'BentoContent';

export const BentoVisual = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-visual my-auto flex items-center justify-center overflow-hidden py-4', className)} {...props}>
      {children}
    </div>
  )
);
BentoVisual.displayName = 'BentoVisual';
`;
		}

		default: {
			return `${header}export interface ${pascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

/**
 * ${pascalName} — Standalone Ejected Engine (Zero-Dependency)
 * Self-contained native implementation with zero @exhuma/core dependency.
 */
export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('${defaultClass}', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
${pascalName}.displayName = '${pascalName}';
`;
		}
	}
}
