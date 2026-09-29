import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getCardSwipeStackOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const thresholdDistance = Number(props.thresholdDistance ?? 120);
	const maxRotation = Number(props.maxRotation ?? 20);
	const scaleStep = Number(props.scaleStep ?? 0.05);
	const offsetStep = Number(props.offsetStep ?? 14);
	const preventLastCardDismiss = Boolean(props.preventLastCardDismiss ?? true);
	const loop = Boolean(props.loop ?? false);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'Card Swipe Stack — Standalone Ejected Engine (Zero Dependencies). Raw velocity ring buffer, Hermite smoothstep layer elevation, and Euler rotation physics inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface CardSwipeStackProps<T = unknown> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  onSwipe?: (item: T, direction: 'left' | 'right') => void;
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * Pre-allocated Float64Array circular ring buffer for O(1) velocity estimation.
 */
class SwipeVelocityRingBuffer {
  private xs = new Float64Array(8);
  private ts = new Float64Array(8);
  private head = 0;
  private count = 0;

  push(x: number, timeMs: number) {
    this.xs[this.head] = x;
    this.ts[this.head] = timeMs;
    this.head = (this.head + 1) % 8;
    if (this.count < 8) this.count++;
  }

  computeVelocityX(): number {
    if (this.count < 2) return 0;
    const latest = (this.head - 1 + 8) % 8;
    const oldest = (this.head - this.count + 8) % 8;
    const dt = (this.ts[latest] - this.ts[oldest]) / 1000;
    if (dt <= 0.001) return 0;
    return (this.xs[latest] - this.xs[oldest]) / dt;
  }

  clear() {
    this.head = 0;
    this.count = 0;
  }
}

export function CardSwipeStack<T>({
  items,
  renderCard,
  onSwipe,
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  scaleStep = ${scaleStep},
  offsetStep = ${offsetStep},
  preventLastCardDismiss = ${preventLastCardDismiss},
  className = '',
}: CardSwipeStackProps<T>) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const startPosRef = React.useRef({ x: 0, y: 0 });
  const currentPosRef = React.useRef({ x: 0, y: 0 });
  const isDraggingRef = React.useRef(false);
  const isAnimatingRef = React.useRef(false);
  const ringBufferRef = React.useRef(new SwipeVelocityRingBuffer());

  const visibleItems = items.slice(currentIndex, currentIndex + 3);

  const applyRestingTransforms = () => {
    for (let i = 1; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const translateY = i * offsetStep;
      const scale = Math.max(0.7, 1 - i * scaleStep);
      const opacity = Math.max(0.4, 1 - i * 0.15);
      el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  };

  React.useEffect(() => {
    applyRestingTransforms();
  }, [currentIndex, scaleStep, offsetStep]);

  const updateDOM = () => {
    const topEl = cardRefs.current[0];
    if (!topEl) return;
    const dx = currentPosRef.current.x - startPosRef.current.x;
    const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;
    const effectiveDx = isLast
      ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
      : dx;
    const rot = Math.max(-maxRotation, Math.min(maxRotation, (effectiveDx / 180) * maxRotation));

    topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / thresholdDistance);
    const smoothProgress = progress * progress * (3 - 2 * progress);
    for (let i = 1; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const targetY = (i - 1) * offsetStep;
      const currentY = i * offsetStep;
      const y = currentY - smoothProgress * (currentY - targetY);

      const targetScale = 1 - (i - 1) * scaleStep;
      const curScale = 1 - i * scaleStep;
      const scale = curScale + smoothProgress * (targetScale - curScale);

      const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
      const curOpacity = Math.max(0.4, 1 - i * 0.15);
      const opacity = curOpacity + smoothProgress * (targetOpacity - curOpacity);

      el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current || e.button !== 0 || currentIndex >= items.length) return;
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    currentPosRef.current = { x: e.clientX, y: e.clientY };
    ringBufferRef.current.clear();
    ringBufferRef.current.push(e.clientX, performance.now());
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    currentPosRef.current = { x: e.clientX, y: e.clientY };
    ringBufferRef.current.push(e.clientX, performance.now());
    updateDOM();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const dx = currentPosRef.current.x - startPosRef.current.x;
    const vx = ringBufferRef.current.computeVelocityX();
    const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;

    const shouldDismiss = !isLast && (Math.abs(dx) > thresholdDistance || Math.abs(vx) > 550);

    if (shouldDismiss) {
      isAnimatingRef.current = true;
      const dir = dx > 0 ? 'right' : 'left';
      const targetX = dir === 'right' ? 500 : -500;
      const topEl = cardRefs.current[0];

      if (topEl) {
        topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
        topEl.style.transform = \`translate3d(\${targetX}px, 0, 0) rotate(\${dir === 'right' ? maxRotation : -maxRotation}deg)\`;
        topEl.style.opacity = '0';
      }

      setTimeout(() => {
        if (topEl) {
          topEl.style.transition = 'none';
          topEl.style.transform = 'none';
          topEl.style.opacity = '1';
        }
        onSwipe?.(items[currentIndex], dir);
        setCurrentIndex((prev) => prev + 1);
        isAnimatingRef.current = false;
      }, 260);
    } else {
      // Snap back
      const topEl = cardRefs.current[0];
      if (topEl) {
        topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => {
          if (topEl) topEl.style.transition = 'none';
        }, 240);
      }
      applyRestingTransforms();
    }
  };

  return (
    <div className={clsx('relative flex items-center justify-center min-h-[14.5rem] w-full select-none', className)}>
      {visibleItems.map((item, idx) => (
        <div
          key={currentIndex + idx}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className={clsx(
            'absolute w-full max-w-sm rounded-2xl will-change-transform',
            idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'
          )}
          onPointerDown={idx === 0 ? handlePointerDown : undefined}
          onPointerMove={idx === 0 ? handlePointerMove : undefined}
          onPointerUp={idx === 0 ? handlePointerUp : undefined}
          onPointerCancel={idx === 0 ? handlePointerUp : undefined}
        >
          {renderCard(item, currentIndex + idx)}
        </div>
      ))}
    </div>
  );
}
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'CardSwipeStack.vue',
					language: 'vue',
					description: 'Vue 3 Native Card Swipe Stack component with multi-card stacked layer elevation and kinetic gesture physics.',
					code: `<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

interface Props {
  items?: any[];
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  loop?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
    { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
    { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
  ],
  thresholdDistance: ${thresholdDistance},
  maxRotation: ${maxRotation},
  scaleStep: ${scaleStep},
  offsetStep: ${offsetStep},
  preventLastCardDismiss: ${preventLastCardDismiss},
  class: '',
});

const emit = defineEmits<{
  (e: 'swipe', item: any, direction: 'left' | 'right'): void;
}>();

const currentIndex = ref(0);
const cardRefs = ref<(HTMLElement | null)[]>([]);
const isDragging = ref(false);
const isAnimating = ref(false);
const startX = ref(0);
const currentX = ref(0);

const visibleItems = computed(() => {
  const list = props.items || [];
  if (list.length === 0) return [null];
  return list.slice(currentIndex.value, currentIndex.value + 3);
});

const applyRestingTransforms = () => {
  for (let i = 1; i < cardRefs.value.length; i++) {
    const el = cardRefs.value[i];
    if (!el) continue;
    const translateY = i * props.offsetStep;
    const scale = Math.max(0.7, 1 - i * props.scaleStep);
    const opacity = Math.max(0.4, 1 - i * 0.15);
    el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
    el.style.opacity = opacity.toFixed(2);
  }
};

watch([currentIndex, () => props.scaleStep, () => props.offsetStep], () => {
  applyRestingTransforms();
});

onMounted(() => {
  applyRestingTransforms();
});

const updateDOM = () => {
  const topEl = cardRefs.value[0];
  if (!topEl) return;
  const dx = currentX.value - startX.value;
  const total = props.items?.length || 1;
  const isLast = props.preventLastCardDismiss && currentIndex.value >= total - 1;
  const effectiveDx = isLast
    ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
    : dx;
  const rot = Math.max(-props.maxRotation, Math.min(props.maxRotation, (effectiveDx / 180) * props.maxRotation));

  topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

  const progress = Math.min(1, Math.abs(effectiveDx) / props.thresholdDistance);
  const smooth = progress * progress * (3 - 2 * progress);
  for (let i = 1; i < cardRefs.value.length; i++) {
    const el = cardRefs.value[i];
    if (!el) continue;
    const targetY = (i - 1) * props.offsetStep;
    const currentY = i * props.offsetStep;
    const y = currentY - smooth * (currentY - targetY);

    const targetScale = 1 - (i - 1) * props.scaleStep;
    const curScale = 1 - i * props.scaleStep;
    const scale = curScale + smooth * (targetScale - curScale);

    const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
    const curOpacity = Math.max(0.4, 1 - i * 0.15);
    const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

    el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
    el.style.opacity = opacity.toFixed(2);
  }
};

const onPointerDown = (e: PointerEvent) => {
  if (isAnimating.value || e.button !== 0 || currentIndex.value >= (props.items?.length || 1)) return;
  isDragging.value = true;
  startX.value = e.clientX;
  currentX.value = e.clientX;
  const target = e.currentTarget as HTMLElement;
  try { target.setPointerCapture(e.pointerId); } catch {}
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  currentX.value = e.clientX;
  updateDOM();
};

const onPointerUp = (e: PointerEvent) => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const target = e.currentTarget as HTMLElement;
  try { if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId); } catch {}

  const dx = currentX.value - startX.value;
  const total = props.items?.length || 1;
  const isLast = props.preventLastCardDismiss && currentIndex.value >= total - 1;
  const shouldDismiss = !isLast && Math.abs(dx) > props.thresholdDistance;

  const topEl = cardRefs.value[0];
  if (shouldDismiss) {
    isAnimating.value = true;
    const dir = dx > 0 ? 'right' : 'left';
    if (topEl) {
      topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
      topEl.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? props.maxRotation : -props.maxRotation}deg)\`;
      topEl.style.opacity = '0';
    }
    setTimeout(() => {
      if (topEl) {
        topEl.style.transition = 'none';
        topEl.style.transform = 'none';
        topEl.style.opacity = '1';
      }
      const item = props.items?.[currentIndex.value];
      emit('swipe', item, dir);
      currentIndex.value++;
      isAnimating.value = false;
      applyRestingTransforms();
    }, 260);
  } else {
    if (topEl) {
      topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
      topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      setTimeout(() => { if (topEl) topEl.style.transition = 'none'; }, 240);
    }
    applyRestingTransforms();
  }
};
</script>

<template>
  <div :class="['relative flex items-center justify-center min-h-[14.5rem] w-full select-none', props.class]">
    <div
      v-for="(item, idx) in visibleItems"
      :key="currentIndex + idx"
      :ref="(el) => { cardRefs[idx] = el as HTMLElement; }"
      :class="[
        'absolute w-full max-w-sm rounded-2xl will-change-transform',
        idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'
      ]"
      @pointerdown="idx === 0 ? onPointerDown($event) : undefined"
      @pointermove="idx === 0 ? onPointerMove($event) : undefined"
      @pointerup="idx === 0 ? onPointerUp($event) : undefined"
      @pointercancel="idx === 0 ? onPointerUp($event) : undefined"
    >
      <slot name="card" :item="item" :index="currentIndex + idx">
        <slot :item="item" :index="currentIndex + idx">
          <div v-if="item" class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
            <span v-if="item.tag" class="text-3xs font-mono font-bold text-primary">{{ item.tag }}</span>
            <h4 class="mt-2 text-lg font-bold text-foreground">{{ item.title }}</h4>
            <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{{ item.desc }}</p>
          </div>
        </slot>
      </slot>
    </div>
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'CardSwipeStack.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Card Swipe Stack with multi-card stacked layer elevation, Runes, and kinetic gesture physics.',
					code: `<script lang="ts">
  interface Props<T = any> {
    items?: T[];
    thresholdDistance?: number;
    maxRotation?: number;
    scaleStep?: number;
    offsetStep?: number;
    preventLastCardDismiss?: boolean;
    loop?: boolean;
    class?: string;
    card?: import('svelte').Snippet<[T, number]>;
    children?: import('svelte').Snippet;
    onSwipe?: (item: T, direction: 'left' | 'right') => void;
  }

  let {
    items = [
      { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
      { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
      { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
    ] as any[],
    thresholdDistance = ${thresholdDistance},
    maxRotation = ${maxRotation},
    scaleStep = ${scaleStep},
    offsetStep = ${offsetStep},
    preventLastCardDismiss = ${preventLastCardDismiss},
    class: className = '',
    card,
    children,
    onSwipe,
  }: Props = $props();

  let currentIndex = $state(0);
  let cardEls: (HTMLDivElement | null)[] = $state([]);
  let isDragging = false;
  let isAnimating = false;
  let startX = 0;
  let currentX = 0;

  let visibleItems = $derived(
    items.length > 0 ? items.slice(currentIndex, currentIndex + 3) : ([null] as any[])
  );

  function applyResting() {
    for (let i = 1; i < cardEls.length; i++) {
      const el = cardEls[i];
      if (!el) continue;
      const translateY = i * offsetStep;
      const scale = Math.max(0.7, 1 - i * scaleStep);
      const opacity = Math.max(0.4, 1 - i * 0.15);
      el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  }

  $effect(() => {
    void currentIndex;
    void scaleStep;
    void offsetStep;
    applyResting();
  });

  function updateDOM() {
    const topEl = cardEls[0];
    if (!topEl) return;
    const dx = currentX - startX;
    const total = items.length || 1;
    const isLast = preventLastCardDismiss && currentIndex >= total - 1;
    const effectiveDx = isLast
      ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
      : dx;
    const rot = Math.max(-maxRotation, Math.min(maxRotation, (effectiveDx / 180) * maxRotation));

    topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / thresholdDistance);
    const smooth = progress * progress * (3 - 2 * progress);
    for (let i = 1; i < cardEls.length; i++) {
      const el = cardEls[i];
      if (!el) continue;
      const targetY = (i - 1) * offsetStep;
      const currentY = i * offsetStep;
      const y = currentY - smooth * (currentY - targetY);

      const targetScale = 1 - (i - 1) * scaleStep;
      const curScale = 1 - i * scaleStep;
      const scale = curScale + smooth * (targetScale - curScale);

      const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
      const curOpacity = Math.max(0.4, 1 - i * 0.15);
      const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

      el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  }

  function handlePointerDown(e: PointerEvent) {
    if (isAnimating || e.button !== 0 || (items.length > 0 && currentIndex >= items.length)) return;
    isDragging = true;
    startX = e.clientX;
    currentX = e.clientX;
    const target = e.currentTarget as HTMLElement;
    try { target.setPointerCapture(e.pointerId); } catch {}
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    currentX = e.clientX;
    updateDOM();
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;
    const target = e.currentTarget as HTMLElement;
    try { if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId); } catch {}

    const dx = currentX - startX;
    const total = items.length || 1;
    const isLast = preventLastCardDismiss && currentIndex >= total - 1;
    const shouldDismiss = !isLast && Math.abs(dx) > thresholdDistance;

    const topEl = cardEls[0];
    if (shouldDismiss) {
      isAnimating = true;
      const dir = dx > 0 ? 'right' : 'left';
      if (topEl) {
        topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
        topEl.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? maxRotation : -maxRotation}deg)\`;
        topEl.style.opacity = '0';
      }
      setTimeout(() => {
        if (topEl) {
          topEl.style.transition = 'none';
          topEl.style.transform = 'none';
          topEl.style.opacity = '1';
        }
        if (items.length > 0) {
          onSwipe?.(items[currentIndex], dir);
        }
        currentIndex++;
        isAnimating = false;
        applyResting();
      }, 260);
    } else {
      if (topEl) {
        topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { if (topEl) topEl.style.transition = 'none'; }, 240);
      }
      applyResting();
    }
  }
</script>

<div class="relative flex items-center justify-center min-h-[14.5rem] w-full select-none {className}">
  {#each visibleItems as item, idx (currentIndex + idx)}
    <div
      bind:this={cardEls[idx]}
      class="absolute w-full max-w-sm rounded-2xl will-change-transform {idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'}"
      onpointerdown={idx === 0 ? handlePointerDown : undefined}
      onpointermove={idx === 0 ? handlePointerMove : undefined}
      onpointerup={idx === 0 ? handlePointerUp : undefined}
      onpointercancel={idx === 0 ? handlePointerUp : undefined}
    >
      {#if card && item !== null}
        {@render card(item, currentIndex + idx)}
      {:else if children}
        {@render children()}
      {:else if item}
        <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
          {#if item.tag}<span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>{/if}
          <h4 class="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
          <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'SolidJS Native Card Swipe Stack component with reactive multi-card stacked layer elevation and Euler rotation.',
					code: `import { Component, JSX, createSignal, createEffect, onMount, For } from 'solid-js';

export interface CardSwipeStackProps<T = any> {
  items?: T[];
  renderCard?: (item: T, index: number) => JSX.Element;
  children?: JSX.Element;
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  loop?: boolean;
  class?: string;
  onSwipe?: (item: T, direction: 'left' | 'right') => void;
}

export const CardSwipeStack: Component<CardSwipeStackProps> = (props) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const cardRefs: (HTMLDivElement | undefined)[] = [];
  let isDragging = false;
  let isAnimating = false;
  let startX = 0;
  let currentX = 0;

  const threshold = () => props.thresholdDistance ?? ${thresholdDistance};
  const maxRot = () => props.maxRotation ?? ${maxRotation};
  const scaleStep = () => props.scaleStep ?? ${scaleStep};
  const offsetStep = () => props.offsetStep ?? ${offsetStep};
  const preventLast = () => props.preventLastCardDismiss ?? ${preventLastCardDismiss};

  const defaultItems = [
    { id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
    { id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Pure AST universal generation targeting 13 ecosystems.' },
    { id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
  ];

  const visibleItems = () => {
    const list = props.items ?? defaultItems;
    if (list.length === 0) return [null];
    return list.slice(currentIndex(), currentIndex() + 3);
  };

  const applyRestingTransforms = () => {
    for (let i = 1; i < cardRefs.length; i++) {
      const el = cardRefs[i];
      if (!el) continue;
      const translateY = i * offsetStep();
      const scale = Math.max(0.7, 1 - i * scaleStep());
      const opacity = Math.max(0.4, 1 - i * 0.15);
      el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  };

  createEffect(() => {
    currentIndex();
    scaleStep();
    offsetStep();
    applyRestingTransforms();
  });

  onMount(() => {
    applyRestingTransforms();
  });

  const updateDOM = () => {
    const topEl = cardRefs[0];
    if (!topEl) return;
    const dx = currentX - startX;
    const totalItems = props.items?.length ?? defaultItems.length;
    const isLast = preventLast() && currentIndex() >= totalItems - 1;
    const effectiveDx = isLast
      ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
      : dx;
    const rot = Math.max(-maxRot(), Math.min(maxRot(), (effectiveDx / 180) * maxRot()));

    topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / threshold());
    const smooth = progress * progress * (3 - 2 * progress);
    for (let i = 1; i < cardRefs.length; i++) {
      const el = cardRefs[i];
      if (!el) continue;
      const targetY = (i - 1) * offsetStep();
      const currentY = i * offsetStep();
      const y = currentY - smooth * (currentY - targetY);

      const targetScale = 1 - (i - 1) * scaleStep();
      const curScale = 1 - i * scaleStep();
      const scale = curScale + smooth * (targetScale - curScale);

      const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
      const curOpacity = Math.max(0.4, 1 - i * 0.15);
      const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

      el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  };

  return (
    <div class={\`relative flex items-center justify-center min-h-[14.5rem] w-full select-none \${props.class ?? ''}\`}>
      <For each={visibleItems()}>
        {(item, idx) => (
          <div
            ref={(el) => { cardRefs[idx()] = el; }}
            class={\`absolute w-full max-w-sm rounded-2xl will-change-transform \${
              idx() === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx() === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'
            }\`}
            onPointerDown={(e) => {
              if (idx() !== 0 || isAnimating || e.button !== 0) return;
              isDragging = true;
              startX = e.clientX;
              currentX = e.clientX;
              try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
            }}
            onPointerMove={(e) => {
              if (idx() !== 0 || !isDragging) return;
              currentX = e.clientX;
              updateDOM();
            }}
            onPointerUp={(e) => {
              if (idx() !== 0 || !isDragging) return;
              isDragging = false;
              try {
                if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
                  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                }
              } catch {}

              const dx = currentX - startX;
              const totalItems = props.items?.length ?? defaultItems.length;
              const isLast = preventLast() && currentIndex() >= totalItems - 1;
              const shouldDismiss = !isLast && Math.abs(dx) > threshold();

              const topEl = cardRefs[0];
              if (shouldDismiss) {
                isAnimating = true;
                const dir = dx > 0 ? 'right' : 'left';
                if (topEl) {
                  topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
                  topEl.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? maxRot() : -maxRot()}deg)\`;
                  topEl.style.opacity = '0';
                }
                setTimeout(() => {
                  if (topEl) {
                    topEl.style.transition = 'none';
                    topEl.style.transform = 'none';
                    topEl.style.opacity = '1';
                  }
                  const list = props.items ?? defaultItems;
                  if (list.length > 0) {
                    props.onSwipe?.(list[currentIndex()], dir);
                  }
                  setCurrentIndex((prev) => prev + 1);
                  isAnimating = false;
                  applyRestingTransforms();
                }, 260);
              } else {
                if (topEl) {
                  topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
                  topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
                  setTimeout(() => { if (topEl) topEl.style.transition = 'none'; }, 240);
                }
                applyRestingTransforms();
              }
            }}
            onPointerCancel={() => {
              if (idx() === 0 && isDragging) {
                isDragging = false;
                applyRestingTransforms();
              }
            }}
          >
            {item && props.renderCard ? props.renderCard(item, currentIndex() + idx()) : (
              props.children ?? (
                item && (
                  <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
                    {(item as any).tag && <span class="text-3xs font-mono font-bold text-primary">{(item as any).tag}</span>}
                    <h4 class="mt-2 text-lg font-bold text-foreground">{(item as any).title}</h4>
                    <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{(item as any).desc}</p>
                  </div>
                )
              )
            )}
          </div>
        )}
      </For>
    </div>
  );
};
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'card-swipe-stack.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Card Swipe Stack component with multi-card stacked layer elevation and kinetic gesture physics.',
					code: `import { Component, input, output, signal, computed, ElementRef, viewChildren, effect, AfterViewInit } from '@angular/core';

@Component({
  selector: 'exhuma-card-swipe-stack',
  standalone: true,
  template: \`
    <div class="relative flex items-center justify-center min-h-[14.5rem] w-full select-none {{ customClass() }}">
      @for (item of visibleItems(); track $index; let idx = $index) {
        <div
          #cardEl
          class="absolute w-full max-w-sm rounded-2xl will-change-transform"
          [class.z-30]="idx === 0"
          [class.cursor-grab]="idx === 0"
          [class.active:cursor-grabbing]="idx === 0"
          [class.z-20]="idx === 1"
          [class.pointer-events-none]="idx > 0"
          [class.z-10]="idx === 2"
          (pointerdown)="idx === 0 ? onPointerDown($event) : null"
          (pointermove)="idx === 0 ? onPointerMove($event) : null"
          (pointerup)="idx === 0 ? onPointerUp($event) : null"
          (pointercancel)="idx === 0 ? onPointerUp($event) : null"
        >
          <ng-content>
            @if (item) {
              <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
                @if (item.tag) {
                  <span class="text-3xs font-mono font-bold text-primary">{{ item.tag }}</span>
                }
                <h4 class="mt-2 text-lg font-bold text-foreground">{{ item.title }}</h4>
                <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{{ item.desc }}</p>
              </div>
            }
          </ng-content>
        </div>
      }
    </div>
  \`,
})
export class ExhumaCardSwipeStackComponent implements AfterViewInit {
  readonly items = input<any[]>([
    { title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: '120Hz frame rate floor.' },
    { title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Targeting 13 ecosystems.' },
    { title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes.' },
  ]);
  readonly thresholdDistance = input<number>(${thresholdDistance});
  readonly maxRotation = input<number>(${maxRotation});
  readonly scaleStep = input<number>(${scaleStep});
  readonly offsetStep = input<number>(${offsetStep});
  readonly preventLastCardDismiss = input<boolean>(${preventLastCardDismiss});
  readonly customClass = input<string>('');
  readonly swipe = output<{ item: any; direction: 'left' | 'right' }>();

  readonly cardEls = viewChildren<ElementRef<HTMLDivElement>>('cardEl');
  readonly currentIndex = signal(0);

  readonly visibleItems = computed(() => {
    const list = this.items();
    const idx = this.currentIndex();
    return list.slice(idx, idx + 3);
  });

  private isDragging = false;
  private isAnimating = false;
  private startX = 0;
  private currentX = 0;

  constructor() {
    effect(() => {
      this.currentIndex();
      this.scaleStep();
      this.offsetStep();
      this.applyRestingTransforms();
    });
  }

  ngAfterViewInit() {
    this.applyRestingTransforms();
  }

  private applyRestingTransforms() {
    const elements = this.cardEls();
    for (let i = 1; i < elements.length; i++) {
      const el = elements[i]?.nativeElement;
      if (!el) continue;
      const translateY = i * this.offsetStep();
      const scale = Math.max(0.7, 1 - i * this.scaleStep());
      const opacity = Math.max(0.4, 1 - i * 0.15);
      el.style.transform = \`translate3d(0, \${translateY.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  }

  private updateDOM() {
    const elements = this.cardEls();
    const topEl = elements[0]?.nativeElement;
    if (!topEl) return;
    const dx = this.currentX - this.startX;
    const isLast = this.preventLastCardDismiss() && this.currentIndex() >= this.items().length - 1;
    const effectiveDx = isLast
      ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
      : dx;
    const maxRot = this.maxRotation();
    const rot = Math.max(-maxRot, Math.min(maxRot, (effectiveDx / 180) * maxRot));

    topEl.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / this.thresholdDistance());
    const smooth = progress * progress * (3 - 2 * progress);
    for (let i = 1; i < elements.length; i++) {
      const el = elements[i]?.nativeElement;
      if (!el) continue;
      const targetY = (i - 1) * this.offsetStep();
      const currentY = i * this.offsetStep();
      const y = currentY - smooth * (currentY - targetY);

      const targetScale = 1 - (i - 1) * this.scaleStep();
      const curScale = 1 - i * this.scaleStep();
      const scale = curScale + smooth * (targetScale - curScale);

      const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
      const curOpacity = Math.max(0.4, 1 - i * 0.15);
      const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

      el.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      el.style.opacity = opacity.toFixed(2);
    }
  }

  onPointerDown(e: PointerEvent) {
    if (this.isAnimating || e.button !== 0 || this.currentIndex() >= this.items().length) return;
    this.isDragging = true;
    this.startX = e.clientX;
    this.currentX = e.clientX;
    const el = this.cardEls()[0]?.nativeElement;
    if (el) try { el.setPointerCapture(e.pointerId); } catch {}
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
    this.updateDOM();
  }

  onPointerUp(e: PointerEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const elements = this.cardEls();
    const topEl = elements[0]?.nativeElement;
    if (topEl) {
      try { if (topEl.hasPointerCapture(e.pointerId)) topEl.releasePointerCapture(e.pointerId); } catch {}
    }

    const dx = this.currentX - this.startX;
    const isLast = this.preventLastCardDismiss() && this.currentIndex() >= this.items().length - 1;
    const shouldDismiss = !isLast && Math.abs(dx) > this.thresholdDistance();

    if (shouldDismiss) {
      this.isAnimating = true;
      const dir = dx > 0 ? 'right' : 'left';
      if (topEl) {
        topEl.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
        topEl.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? this.maxRotation() : -this.maxRotation()}deg)\`;
        topEl.style.opacity = '0';
      }
      setTimeout(() => {
        if (topEl) {
          topEl.style.transition = 'none';
          topEl.style.transform = 'none';
          topEl.style.opacity = '1';
        }
        const dismissedItem = this.items()[this.currentIndex()];
        this.swipe.emit({ item: dismissedItem, direction: dir });
        this.currentIndex.update((v) => v + 1);
        this.isAnimating = false;
        this.applyRestingTransforms();
      }, 260);
    } else {
      if (topEl) {
        topEl.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        topEl.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { if (topEl) topEl.style.transition = 'none'; }, 240);
      }
      this.applyRestingTransforms();
    }
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'CardSwipeStack.astro',
					language: 'astro',
					description: 'Pure Native Astro Card Swipe Stack component with multi-card layer elevation and kinetic gesture physics.',
					code: `---
interface Props {
  items?: Array<{ id?: string | number; title?: string; tag?: string; desc?: string }>;
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  loop?: boolean;
  class?: string;
  className?: string;
}

const {
  items = [
    { title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: '120Hz frame rate floor.' },
    { title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Targeting 13 ecosystems.' },
    { title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes.' },
  ],
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  scaleStep = ${scaleStep},
  offsetStep = ${offsetStep},
  preventLastCardDismiss = ${preventLastCardDismiss},
  class: classProp,
  className,
} = Astro.props;

const appliedClass = classProp || className || '';
---

<div
  class={\`exhuma-swipe-stack relative flex items-center justify-center min-h-[14.5rem] w-full select-none \${appliedClass}\`}
  data-threshold={thresholdDistance}
  data-rotation={maxRotation}
  data-scale-step={scaleStep}
  data-offset-step={offsetStep}
  data-prevent-last={preventLastCardDismiss ? 'true' : 'false'}
>
  {items.map((item, idx) => (
    <div
      class={\`exhuma-swipe-card absolute w-full max-w-sm rounded-2xl will-change-transform \${
        idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'
      }\`}
      data-card-index={idx}
      style={idx > 0 ? \`transform: translate3d(0, \${(idx * offsetStep).toFixed(2)}px, 0) scale(\${(1 - idx * scaleStep).toFixed(3)}); opacity: \${Math.max(0.4, 1 - idx * 0.15).toFixed(2)};\` : ''}
    >
      <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
        {item.tag && <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>}
        <h4 class="mt-2 text-lg font-bold text-foreground">{item.title}</h4>
        <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
      </div>
    </div>
  ))}
  <slot />
</div>

<script>
  function initSwipeStacks() {
    document.querySelectorAll<HTMLElement>('.exhuma-swipe-stack').forEach((stack) => {
      if (stack.dataset.initialized) return;
      stack.dataset.initialized = 'true';

      const threshold = parseFloat(stack.dataset.threshold || '${thresholdDistance}');
      const maxRot = parseFloat(stack.dataset.rotation || '${maxRotation}');
      const scaleStep = parseFloat(stack.dataset.scaleStep || '${scaleStep}');
      const offsetStep = parseFloat(stack.dataset.offsetStep || '${offsetStep}');
      const preventLast = stack.dataset.preventLast !== 'false';

      let cards = Array.from(stack.querySelectorAll<HTMLElement>('.exhuma-swipe-card'));
      let currentIndex = 0;
      let isDragging = false;
      let isAnimating = false;
      let startX = 0;
      let currentX = 0;

      function applyResting() {
        cards.forEach((card, idx) => {
          const relativeIdx = idx - currentIndex;
          if (relativeIdx < 0) {
            card.style.display = 'none';
          } else if (relativeIdx < 3) {
            card.style.display = '';
            card.style.zIndex = relativeIdx === 0 ? '30' : relativeIdx === 1 ? '20' : '10';
            card.style.pointerEvents = relativeIdx === 0 ? 'auto' : 'none';
            card.classList.toggle('cursor-grab', relativeIdx === 0);
            if (relativeIdx > 0) {
              const y = relativeIdx * offsetStep;
              const scale = Math.max(0.7, 1 - relativeIdx * scaleStep);
              const opacity = Math.max(0.4, 1 - relativeIdx * 0.15);
              card.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
              card.style.opacity = opacity.toFixed(2);
            }
          } else {
            card.style.display = 'none';
          }
        });
      }

      function updateDOM() {
        const topCard = cards[currentIndex];
        if (!topCard) return;
        const dx = currentX - startX;
        const isLast = preventLast && currentIndex >= cards.length - 1;
        const effectiveDx = isLast
          ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
          : dx;
        const rot = Math.max(-maxRot, Math.min(maxRot, (effectiveDx / 180) * maxRot));
        topCard.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

        const progress = Math.min(1, Math.abs(effectiveDx) / threshold);
        const smooth = progress * progress * (3 - 2 * progress);

        for (let i = 1; i < 3; i++) {
          const bgCard = cards[currentIndex + i];
          if (!bgCard) continue;
          const targetY = (i - 1) * offsetStep;
          const curY = i * offsetStep;
          const y = curY - smooth * (curY - targetY);

          const targetScale = 1 - (i - 1) * scaleStep;
          const curScale = 1 - i * scaleStep;
          const scale = curScale + smooth * (targetScale - curScale);

          const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
          const curOpacity = Math.max(0.4, 1 - i * 0.15);
          const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

          bgCard.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
          bgCard.style.opacity = opacity.toFixed(2);
        }
      }

      function bindTopCard() {
        const topCard = cards[currentIndex];
        if (!topCard) return;

        topCard.onpointerdown = (e: PointerEvent) => {
          if (isAnimating || e.button !== 0 || currentIndex >= cards.length) return;
          isDragging = true;
          startX = e.clientX;
          currentX = e.clientX;
          try { topCard.setPointerCapture(e.pointerId); } catch {}
        };

        topCard.onpointermove = (e: PointerEvent) => {
          if (!isDragging) return;
          currentX = e.clientX;
          updateDOM();
        };

        const onEnd = (e: PointerEvent) => {
          if (!isDragging) return;
          isDragging = false;
          try { if (topCard.hasPointerCapture(e.pointerId)) topCard.releasePointerCapture(e.pointerId); } catch {}

          const dx = currentX - startX;
          const isLast = preventLast && currentIndex >= cards.length - 1;
          const shouldDismiss = !isLast && Math.abs(dx) > threshold;

          if (shouldDismiss) {
            isAnimating = true;
            const dir = dx > 0 ? 'right' : 'left';
            topCard.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
            topCard.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? maxRot : -maxRot}deg)\`;
            topCard.style.opacity = '0';

            setTimeout(() => {
              topCard.style.transition = 'none';
              topCard.style.transform = 'none';
              topCard.style.display = 'none';
              currentIndex++;
              isAnimating = false;
              applyResting();
              bindTopCard();
            }, 260);
          } else {
            topCard.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
            topCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            setTimeout(() => { topCard.style.transition = 'none'; }, 240);
            applyResting();
          }
        };

        topCard.onpointerup = onEnd;
        topCard.onpointercancel = onEnd;
      }

      applyResting();
      bindTopCard();
    });
  }

  document.addEventListener('DOMContentLoaded', initSwipeStacks);
  initSwipeStacks();
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-card-swipe-stack.js',
					language: 'javascript',
					description: 'Universal Custom Web Component <exhuma-card-swipe-stack> with multi-card stacked layer elevation.',
					code: `/**
 * Exhuma Card Swipe Stack Web Component
 * <exhuma-card-swipe-stack threshold-distance="${thresholdDistance}" max-rotation="${maxRotation}" scale-step="${scaleStep}" offset-step="${offsetStep}" prevent-last-card-dismiss="${preventLastCardDismiss}">
 */
class ExhumaCardSwipeStack extends HTMLElement {
  connectedCallback() {
    this.style.position = 'relative';
    this.style.display = 'flex';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
    this.style.minHeight = '14.5rem';
    this.style.width = '100%';
    this.style.userSelect = 'none';

    const threshold = parseFloat(this.getAttribute('threshold-distance') || this.getAttribute('threshold') || '${thresholdDistance}');
    const maxRot = parseFloat(this.getAttribute('max-rotation') || '${maxRotation}');
    const scaleStep = parseFloat(this.getAttribute('scale-step') || '${scaleStep}');
    const offsetStep = parseFloat(this.getAttribute('offset-step') || '${offsetStep}');
    const preventLast = this.getAttribute('prevent-last-card-dismiss') !== 'false';

    let cards = Array.from(this.children);
    if (cards.length === 0) {
      const defaultItems = [
        { title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: '120Hz frame rate floor.' },
        { title: 'Zero Framework Locks', tag: 'COMPILERS', desc: 'Targeting 13 ecosystems.' },
        { title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes.' },
      ];
      cards = defaultItems.map((item) => {
        const div = document.createElement('div');
        div.className = 'w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl';
        div.innerHTML = \`<span class="text-xs font-mono font-bold text-emerald-400">\${item.tag}</span><h4 class="mt-2 text-lg font-bold text-white">\${item.title}</h4><p class="mt-1 text-xs text-zinc-400">\${item.desc}</p>\`;
        this.appendChild(div);
        return div;
      });
    }

    cards.forEach((card) => {
      card.style.position = 'absolute';
      card.style.width = '100%';
      card.style.maxWidth = '24rem';
      card.style.willChange = 'transform';
    });

    let currentIndex = 0;
    let isDragging = false;
    let isAnimating = false;
    let startX = 0;
    let currentX = 0;

    const applyResting = () => {
      cards.forEach((card, idx) => {
        const relativeIdx = idx - currentIndex;
        if (relativeIdx < 0) {
          card.style.display = 'none';
        } else if (relativeIdx < 3) {
          card.style.display = '';
          card.style.zIndex = relativeIdx === 0 ? '30' : relativeIdx === 1 ? '20' : '10';
          card.style.cursor = relativeIdx === 0 ? 'grab' : 'default';
          card.style.pointerEvents = relativeIdx === 0 ? 'auto' : 'none';
          if (relativeIdx > 0) {
            const y = relativeIdx * offsetStep;
            const scale = Math.max(0.7, 1 - relativeIdx * scaleStep);
            const opacity = Math.max(0.4, 1 - relativeIdx * 0.15);
            card.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
            card.style.opacity = opacity.toFixed(2);
          }
        } else {
          card.style.display = 'none';
        }
      });
    };

    const updateDOM = () => {
      const topCard = cards[currentIndex];
      if (!topCard) return;
      const dx = currentX - startX;
      const isLast = preventLast && currentIndex >= cards.length - 1;
      const effectiveDx = isLast
        ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
        : dx;
      const rot = Math.max(-maxRot, Math.min(maxRot, (effectiveDx / 180) * maxRot));
      topCard.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

      const progress = Math.min(1, Math.abs(effectiveDx) / threshold);
      const smooth = progress * progress * (3 - 2 * progress);

      for (let i = 1; i < 3; i++) {
        const bgCard = cards[currentIndex + i];
        if (!bgCard) continue;
        const targetY = (i - 1) * offsetStep;
        const curY = i * offsetStep;
        const y = curY - smooth * (curY - targetY);

        const targetScale = 1 - (i - 1) * scaleStep;
        const curScale = 1 - i * scaleStep;
        const scale = curScale + smooth * (targetScale - curScale);

        const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
        const curOpacity = Math.max(0.4, 1 - i * 0.15);
        const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

        bgCard.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
        bgCard.style.opacity = opacity.toFixed(2);
      }
    };

    const bindTopCard = () => {
      const topCard = cards[currentIndex];
      if (!topCard) return;

      topCard.onpointerdown = (e) => {
        if (isAnimating || e.button !== 0 || currentIndex >= cards.length) return;
        isDragging = true;
        startX = e.clientX;
        currentX = e.clientX;
        try { topCard.setPointerCapture(e.pointerId); } catch {}
      };

      topCard.onpointermove = (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        updateDOM();
      };

      const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        try { if (topCard.hasPointerCapture(e.pointerId)) topCard.releasePointerCapture(e.pointerId); } catch {}

        const dx = currentX - startX;
        const isLast = preventLast && currentIndex >= cards.length - 1;
        const shouldDismiss = !isLast && Math.abs(dx) > threshold;

        if (shouldDismiss) {
          isAnimating = true;
          const dir = dx > 0 ? 'right' : 'left';
          topCard.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
          topCard.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? maxRot : -maxRot}deg)\`;
          topCard.style.opacity = '0';

          setTimeout(() => {
            topCard.style.transition = 'none';
            topCard.style.transform = 'none';
            topCard.style.display = 'none';
            this.dispatchEvent(new CustomEvent('swipe', { detail: { cardIndex: currentIndex, direction: dir } }));
            currentIndex++;
            isAnimating = false;
            applyResting();
            bindTopCard();
          }, 260);
        } else {
          topCard.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
          topCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
          setTimeout(() => { topCard.style.transition = 'none'; }, 240);
          applyResting();
        }
      };

      topCard.onpointerup = onEnd;
      topCard.onpointercancel = onEnd;
    };

    applyResting();
    bindTopCard();
  }
}

if (!customElements.get('exhuma-card-swipe-stack')) {
  customElements.define('exhuma-card-swipe-stack', ExhumaCardSwipeStack);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'card-swipe-stack.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS Card Swipe Stack controller with multi-card stacked layer elevation and kinetic gesture physics.',
					code: `/**
 * Vanilla JS Card Swipe Stack Controller
 * Multi-card layer elevation, Euler rotation, and Hermite smoothstep kinetics.
 */
export function initCardSwipeStack(containerOrSelector = '[data-swipe-stack]', options = {}) {
  const container = typeof containerOrSelector === 'string'
    ? document.querySelector(containerOrSelector)
    : containerOrSelector;

  if (!container || container.__exhuma_swipe) return;
  container.__exhuma_swipe = true;

  const threshold = options.thresholdDistance ?? parseFloat(container.dataset.thresholdDistance || '${thresholdDistance}');
  const maxRot = options.maxRotation ?? parseFloat(container.dataset.maxRotation || '${maxRotation}');
  const scaleStep = options.scaleStep ?? parseFloat(container.dataset.scaleStep || '${scaleStep}');
  const offsetStep = options.offsetStep ?? parseFloat(container.dataset.offsetStep || '${offsetStep}');
  const preventLast = options.preventLastCardDismiss ?? (container.dataset.preventLastCardDismiss !== 'false');

  let cards = Array.from(container.querySelectorAll('[data-swipe-card], .exhuma-swipe-card'));
  if (cards.length === 0 && Array.isArray(options.items) && options.items.length > 0) {
    cards = options.items.map((item, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'absolute w-full max-w-sm rounded-2xl will-change-transform';
      if (typeof options.renderCard === 'function') {
        cardEl.appendChild(options.renderCard(item, index));
      } else {
        cardEl.innerHTML = \`<div class="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl text-white"><h4 class="font-bold">\${item.title || 'Card ' + (index + 1)}</h4><p class="text-xs text-zinc-400 mt-1">\${item.desc || ''}</p></div>\`;
      }
      container.appendChild(cardEl);
      return cardEl;
    });
  }

  let currentIndex = 0;
  let isDragging = false;
  let isAnimating = false;
  let startX = 0;
  let currentX = 0;

  function applyResting() {
    cards.forEach((card, idx) => {
      const relativeIdx = idx - currentIndex;
      if (relativeIdx < 0) {
        card.style.display = 'none';
      } else if (relativeIdx < 3) {
        card.style.display = '';
        card.style.zIndex = relativeIdx === 0 ? '30' : relativeIdx === 1 ? '20' : '10';
        card.style.cursor = relativeIdx === 0 ? 'grab' : 'default';
        card.style.pointerEvents = relativeIdx === 0 ? 'auto' : 'none';
        if (relativeIdx > 0) {
          const y = relativeIdx * offsetStep;
          const scale = Math.max(0.7, 1 - relativeIdx * scaleStep);
          const opacity = Math.max(0.4, 1 - relativeIdx * 0.15);
          card.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
          card.style.opacity = opacity.toFixed(2);
        }
      } else {
        card.style.display = 'none';
      }
    });
  }

  function updateDOM() {
    const topCard = cards[currentIndex];
    if (!topCard) return;
    const dx = currentX - startX;
    const isLast = preventLast && currentIndex >= cards.length - 1;
    const effectiveDx = isLast
      ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80)
      : dx;
    const rot = Math.max(-maxRot, Math.min(maxRot, (effectiveDx / 180) * maxRot));
    topCard.style.transform = \`translate3d(\${effectiveDx.toFixed(2)}px, 0, 0) rotate(\${rot.toFixed(2)}deg)\`;

    const progress = Math.min(1, Math.abs(effectiveDx) / threshold);
    const smooth = progress * progress * (3 - 2 * progress);

    for (let i = 1; i < 3; i++) {
      const bgCard = cards[currentIndex + i];
      if (!bgCard) continue;
      const targetY = (i - 1) * offsetStep;
      const curY = i * offsetStep;
      const y = curY - smooth * (curY - targetY);

      const targetScale = 1 - (i - 1) * scaleStep;
      const curScale = 1 - i * scaleStep;
      const scale = curScale + smooth * (targetScale - curScale);

      const targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
      const curOpacity = Math.max(0.4, 1 - i * 0.15);
      const opacity = curOpacity + smooth * (targetOpacity - curOpacity);

      bgCard.style.transform = \`translate3d(0, \${y.toFixed(2)}px, 0) scale(\${scale.toFixed(3)})\`;
      bgCard.style.opacity = opacity.toFixed(2);
    }
  }

  function bindTopCard() {
    const topCard = cards[currentIndex];
    if (!topCard) return;

    topCard.onpointerdown = (e) => {
      if (isAnimating || e.button !== 0 || currentIndex >= cards.length) return;
      isDragging = true;
      startX = e.clientX;
      currentX = e.clientX;
      try { topCard.setPointerCapture(e.pointerId); } catch {}
    };

    topCard.onpointermove = (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      updateDOM();
    };

    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { if (topCard.hasPointerCapture(e.pointerId)) topCard.releasePointerCapture(e.pointerId); } catch {}

      const dx = currentX - startX;
      const isLast = preventLast && currentIndex >= cards.length - 1;
      const shouldDismiss = !isLast && Math.abs(dx) > threshold;

      if (shouldDismiss) {
        isAnimating = true;
        const dir = dx > 0 ? 'right' : 'left';
        topCard.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
        topCard.style.transform = \`translate3d(\${dir === 'right' ? 500 : -500}px, 0, 0) rotate(\${dir === 'right' ? maxRot : -maxRot}deg)\`;
        topCard.style.opacity = '0';

        setTimeout(() => {
          topCard.style.transition = 'none';
          topCard.style.transform = 'none';
          topCard.style.display = 'none';
          options.onSwipe?.(options.items ? options.items[currentIndex] : currentIndex, dir);
          currentIndex++;
          isAnimating = false;
          applyResting();
          bindTopCard();
        }, 260);
      } else {
        topCard.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
        topCard.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        setTimeout(() => { topCard.style.transition = 'none'; }, 240);
        applyResting();
      }
    };

    topCard.onpointerup = onEnd;
    topCard.onpointercancel = onEnd;
  }

  applyResting();
  bindTopCard();

  return {
    reset() {
      currentIndex = 0;
      applyResting();
      bindTopCard();
    },
    destroy() {
      cards.forEach((c) => {
        c.onpointerdown = null;
        c.onpointermove = null;
        c.onpointerup = null;
        c.onpointercancel = null;
      });
      delete container.__exhuma_swipe;
    },
  };
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'card-swipe-stack.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Card Swipe Stack with multi-card stacked layer elevation and Alpine.js.',
					code: `@props([
    'items' => [
        ['title' => 'Big-Omega Guarantees', 'tag' => 'MATHEMATICS', 'desc' => '120Hz frame rate floor.'],
        ['title' => 'Zero Framework Locks', 'tag' => 'COMPILERS', 'desc' => 'Targeting 13 ecosystems.'],
        ['title' => 'Direct GPU Pipeline', 'tag' => 'KINETICS', 'desc' => 'Direct translate3d writes.'],
    ],
    'thresholdDistance' => ${thresholdDistance},
    'maxRotation' => ${maxRotation},
    'scaleStep' => ${scaleStep},
    'offsetStep' => ${offsetStep},
    'preventLastCardDismiss' => ${preventLastCardDismiss ? 'true' : 'false'},
])

<div
    x-data="{
        items: {{ json_encode($items) }},
        currentIndex: 0,
        isDragging: false,
        isAnimating: false,
        startX: 0,
        currentX: 0,
        threshold: {{ $thresholdDistance }},
        maxRot: {{ $maxRotation }},
        scaleStep: {{ $scaleStep }},
        offsetStep: {{ $offsetStep }},
        preventLast: {{ $preventLastCardDismiss ? 'true' : 'false' }},
        get dx() { return this.currentX - this.startX; },
        get isLast() { return this.preventLast && this.currentIndex >= this.items.length - 1; },
        get effectiveDx() {
            if (!this.isLast) return this.dx;
            return Math.sign(this.dx) * Math.min(2.2 * Math.pow(Math.abs(this.dx), 0.78), 80);
        },
        get rotation() {
            return Math.max(-this.maxRot, Math.min(this.maxRot, (this.effectiveDx / 180) * this.maxRot));
        },
        get progress() {
            return Math.min(1, Math.abs(this.effectiveDx) / this.threshold);
        },
        get smoothProgress() {
            const p = this.progress;
            return p * p * (3 - 2 * p);
        },
        getCardTransform(relativeIdx) {
            if (relativeIdx === 0) {
                return this.isDragging
                    ? 'translate3d(' + this.effectiveDx.toFixed(2) + 'px, 0, 0) rotate(' + this.rotation.toFixed(2) + 'deg)'
                    : 'translate3d(0, 0, 0) rotate(0deg)';
            }
            const targetY = (relativeIdx - 1) * this.offsetStep;
            const curY = relativeIdx * this.offsetStep;
            const y = this.isDragging ? (curY - this.smoothProgress * (curY - targetY)) : curY;

            const targetScale = 1 - (relativeIdx - 1) * this.scaleStep;
            const curScale = 1 - relativeIdx * this.scaleStep;
            const scale = this.isDragging ? (curScale + this.smoothProgress * (targetScale - curScale)) : curScale;

            return 'translate3d(0, ' + y.toFixed(2) + 'px, 0) scale(' + scale.toFixed(3) + ')';
        },
        getCardOpacity(relativeIdx) {
            if (relativeIdx === 0) return 1;
            const target = Math.max(0.4, 1 - (relativeIdx - 1) * 0.15);
            const cur = Math.max(0.4, 1 - relativeIdx * 0.15);
            return this.isDragging ? (cur + this.smoothProgress * (target - cur)).toFixed(2) : cur.toFixed(2);
        }
    }"
    {{ $attributes->merge([
        'class' => 'relative flex items-center justify-center min-h-[14.5rem] w-full select-none',
    ]) }}
>
    <template x-for="(item, idx) in items.slice(currentIndex, currentIndex + 3)" :key="currentIndex + idx">
        <div
            class="absolute w-full max-w-sm rounded-2xl will-change-transform"
            :class="idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none'"
            :style="'transform: ' + getCardTransform(idx) + '; opacity: ' + getCardOpacity(idx) + ';'"
            @pointerdown="
                if (idx !== 0 || isAnimating || $event.button !== 0 || currentIndex >= items.length) return;
                isDragging = true;
                startX = $event.clientX;
                currentX = $event.clientX;
                try { $el.setPointerCapture($event.pointerId); } catch(e) {}
            "
            @pointermove="if (idx === 0 && isDragging) currentX = $event.clientX"
            @pointerup="
                if (idx !== 0 || !isDragging) return;
                isDragging = false;
                try { if ($el.hasPointerCapture($event.pointerId)) $el.releasePointerCapture($event.pointerId); } catch(e) {}
                if (!isLast && Math.abs(dx) > threshold) {
                    isAnimating = true;
                    const dir = dx > 0 ? 500 : -500;
                    $el.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
                    $el.style.transform = 'translate3d(' + dir + 'px, 0, 0) rotate(' + (dx > 0 ? maxRot : -maxRot) + 'deg)';
                    $el.style.opacity = '0';
                    setTimeout(() => {
                        $el.style.transition = 'none';
                        $el.style.transform = 'none';
                        $el.style.opacity = '1';
                        currentIndex++;
                        isAnimating = false;
                    }, 260);
                } else {
                    $el.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
                    $el.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
                    setTimeout(() => { $el.style.transition = 'none'; }, 240);
                }
            "
            @pointercancel="isDragging = false"
        >
            <div class="w-full rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur-md">
                <template x-if="item.tag">
                    <span class="text-3xs font-mono font-bold text-primary" x-text="item.tag"></span>
                </template>
                <h4 class="mt-2 text-lg font-bold text-foreground" x-text="item.title"></h4>
                <p class="mt-1 text-xs text-muted-foreground leading-relaxed" x-text="item.desc"></p>
            </div>
        </div>
    </template>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Gutenberg block definition for Card Swipe Stack.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/card-swipe-stack",
  "version": "1.0.0",
  "title": "Exhuma Card Swipe Stack",
  "category": "layout",
  "icon": "slides",
  "description": "Velocity-sensitive multi-card swipe stack with Euler angular rotation, layer elevation, and elastic rubber-band resistance.",
  "attributes": {
    "thresholdDistance": { "type": "number", "default": ${thresholdDistance} },
    "maxRotation": { "type": "number", "default": ${maxRotation} },
    "scaleStep": { "type": "number", "default": ${scaleStep} },
    "offsetStep": { "type": "number", "default": ${offsetStep} },
    "preventLastCardDismiss": { "type": "boolean", "default": ${preventLastCardDismiss} }
  },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg block dynamic render template with multi-card stacked layer elevation.',
					code: `<?php
/**
 * Card Swipe Stack Block Template
 */
$threshold = isset($attributes['thresholdDistance']) ? (int)$attributes['thresholdDistance'] : ${thresholdDistance};
$max_rot   = isset($attributes['maxRotation']) ? (int)$attributes['maxRotation'] : ${maxRotation};
$scale_step = isset($attributes['scaleStep']) ? (float)$attributes['scaleStep'] : ${scaleStep};
$offset_step = isset($attributes['offsetStep']) ? (int)$attributes['offsetStep'] : ${offsetStep};
$prevent_last = isset($attributes['preventLastCardDismiss']) ? (bool)$attributes['preventLastCardDismiss'] : ${preventLastCardDismiss ? 'true' : 'false'};

$default_items = [
    ['title' => 'Big-Omega Guarantees', 'tag' => 'MATHEMATICS', 'desc' => '120Hz frame rate floor.'],
    ['title' => 'Zero Framework Locks', 'tag' => 'COMPILERS', 'desc' => 'Targeting 13 ecosystems.'],
    ['title' => 'Direct GPU Pipeline', 'tag' => 'KINETICS', 'desc' => 'Direct translate3d writes.'],
];
?>
<div
    class="wp-block-exhuma-card-swipe-stack exhuma-swipe-stack relative flex items-center justify-center min-h-[14.5rem] w-full select-none"
    data-threshold="<?php echo esc_attr($threshold); ?>"
    data-rotation="<?php echo esc_attr($max_rot); ?>"
    data-scale-step="<?php echo esc_attr($scale_step); ?>"
    data-offset-step="<?php echo esc_attr($offset_step); ?>"
    data-prevent-last="<?php echo $prevent_last ? 'true' : 'false'; ?>"
>
    <?php if (!empty($content)) : ?>
        <div class="exhuma-swipe-card absolute w-full max-w-sm rounded-2xl z-30 cursor-grab active:cursor-grabbing will-change-transform">
            <?php echo $content; ?>
        </div>
    <?php else : ?>
        <?php foreach ($default_items as $idx => $item) :
            $translate_y = $idx * $offset_step;
            $scale = max(0.7, 1 - $idx * $scale_step);
            $opacity = max(0.4, 1 - $idx * 0.15);
            $style = $idx > 0
                ? "transform: translate3d(0, {$translate_y}px, 0) scale({$scale}); opacity: {$opacity};"
                : "";
            $z_class = $idx === 0 ? 'z-30 cursor-grab active:cursor-grabbing' : ($idx === 1 ? 'z-20 pointer-events-none' : 'z-10 pointer-events-none');
        ?>
            <div
                class="exhuma-swipe-card absolute w-full max-w-sm rounded-2xl will-change-transform <?php echo $z_class; ?>"
                style="<?php echo esc_attr($style); ?>"
            >
                <div class="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-white">
                    <span class="text-xs font-mono font-bold text-emerald-400"><?php echo esc_html($item['tag']); ?></span>
                    <h4 class="mt-2 text-lg font-bold"><?php echo esc_html($item['title']); ?></h4>
                    <p class="mt-1 text-xs text-zinc-400"><?php echo esc_html($item['desc']); ?></p>
                </div>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<script>
(function() {
  function initWordPressSwipeStacks() {
    document.querySelectorAll('.wp-block-exhuma-card-swipe-stack').forEach(function(stack) {
      if (stack.__exhuma_init) return;
      stack.__exhuma_init = true;

      var threshold = parseFloat(stack.dataset.threshold || '${thresholdDistance}');
      var maxRot = parseFloat(stack.dataset.rotation || '${maxRotation}');
      var scaleStep = parseFloat(stack.dataset.scaleStep || '${scaleStep}');
      var offsetStep = parseFloat(stack.dataset.offsetStep || '${offsetStep}');
      var preventLast = stack.dataset.preventLast !== 'false';

      var cards = Array.from(stack.querySelectorAll('.exhuma-swipe-card'));
      var currentIndex = 0;
      var isDragging = false;
      var isAnimating = false;
      var startX = 0;
      var currentX = 0;

      function applyResting() {
        cards.forEach(function(card, idx) {
          var rel = idx - currentIndex;
          if (rel < 0) {
            card.style.display = 'none';
          } else if (rel < 3) {
            card.style.display = '';
            card.style.zIndex = rel === 0 ? '30' : rel === 1 ? '20' : '10';
            card.style.pointerEvents = rel === 0 ? 'auto' : 'none';
            if (rel > 0) {
              var y = rel * offsetStep;
              var scale = Math.max(0.7, 1 - rel * scaleStep);
              var opacity = Math.max(0.4, 1 - rel * 0.15);
              card.style.transform = 'translate3d(0, ' + y.toFixed(2) + 'px, 0) scale(' + scale.toFixed(3) + ')';
              card.style.opacity = opacity.toFixed(2);
            }
          } else {
            card.style.display = 'none';
          }
        });
      }

      function updateDOM() {
        var top = cards[currentIndex];
        if (!top) return;
        var dx = currentX - startX;
        var isLast = preventLast && currentIndex >= cards.length - 1;
        var effectiveDx = isLast ? Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80) : dx;
        var rot = Math.max(-maxRot, Math.min(maxRot, (effectiveDx / 180) * maxRot));
        top.style.transform = 'translate3d(' + effectiveDx.toFixed(2) + 'px, 0, 0) rotate(' + rot.toFixed(2) + 'deg)';

        var progress = Math.min(1, Math.abs(effectiveDx) / threshold);
        var smooth = progress * progress * (3 - 2 * progress);
        for (var i = 1; i < 3; i++) {
          var bg = cards[currentIndex + i];
          if (!bg) continue;
          var targetY = (i - 1) * offsetStep;
          var curY = i * offsetStep;
          var y = curY - smooth * (curY - targetY);

          var targetScale = 1 - (i - 1) * scaleStep;
          var curScale = 1 - i * scaleStep;
          var scale = curScale + smooth * (targetScale - curScale);

          var targetOpacity = Math.max(0.4, 1 - (i - 1) * 0.15);
          var curOpacity = Math.max(0.4, 1 - i * 0.15);
          var opacity = curOpacity + smooth * (targetOpacity - curOpacity);

          bg.style.transform = 'translate3d(0, ' + y.toFixed(2) + 'px, 0) scale(' + scale.toFixed(3) + ')';
          bg.style.opacity = opacity.toFixed(2);
        }
      }

      function bindTop() {
        var top = cards[currentIndex];
        if (!top) return;

        top.onpointerdown = function(e) {
          if (isAnimating || e.button !== 0 || currentIndex >= cards.length) return;
          isDragging = true;
          startX = e.clientX;
          currentX = e.clientX;
          try { top.setPointerCapture(e.pointerId); } catch(err) {}
        };

        top.onpointermove = function(e) {
          if (!isDragging) return;
          currentX = e.clientX;
          updateDOM();
        };

        var onEnd = function(e) {
          if (!isDragging) return;
          isDragging = false;
          try { if (top.hasPointerCapture(e.pointerId)) top.releasePointerCapture(e.pointerId); } catch(err) {}

          var dx = currentX - startX;
          var isLast = preventLast && currentIndex >= cards.length - 1;
          var shouldDismiss = !isLast && Math.abs(dx) > threshold;

          if (shouldDismiss) {
            isAnimating = true;
            var dir = dx > 0 ? 'right' : 'left';
            top.style.transition = 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease';
            top.style.transform = 'translate3d(' + (dir === 'right' ? 500 : -500) + 'px, 0, 0) rotate(' + (dir === 'right' ? maxRot : -maxRot) + 'deg)';
            top.style.opacity = '0';
            setTimeout(function() {
              top.style.transition = 'none';
              top.style.transform = 'none';
              top.style.display = 'none';
              currentIndex++;
              isAnimating = false;
              applyResting();
              bindTop();
            }, 260);
          } else {
            top.style.transition = 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)';
            top.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            setTimeout(function() { top.style.transition = 'none'; }, 240);
            applyResting();
          }
        };

        top.onpointerup = onEnd;
        top.onpointercancel = onEnd;
      }

      applyResting();
      bindTop();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordPressSwipeStacks);
  } else {
    initWordPressSwipeStacks();
  }
})();
</script>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'CardSwipeStack.tsx',
					language: 'tsx',
					description: 'React Native Card Swipe Stack with multi-card stacked layer elevation and PanResponder kinetics.',
					code: `import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, PanResponder } from 'react-native';

export interface CardSwipeStackProps<T = unknown> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  thresholdDistance?: number;
  maxRotation?: number;
  scaleStep?: number;
  offsetStep?: number;
  preventLastCardDismiss?: boolean;
  loop?: boolean;
  onSwipe?: (item: T, direction: 'left' | 'right') => void;
}

export function CardSwipeStack<T>({
  items,
  renderCard,
  thresholdDistance = ${thresholdDistance},
  maxRotation = ${maxRotation},
  scaleStep = ${scaleStep},
  offsetStep = ${offsetStep},
  preventLastCardDismiss = ${preventLastCardDismiss},
  onSwipe,
}: CardSwipeStackProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;
  const isAnimating = useRef(false);

  const visibleItems = items.slice(currentIndex, currentIndex + 3);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating.current && currentIndex < items.length,
      onPanResponderMove: (_, gesture) => {
        const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;
        let dx = gesture.dx;
        if (isLast) {
          dx = Math.sign(dx) * Math.min(2.2 * Math.pow(Math.abs(dx), 0.78), 80);
        }
        pan.setValue({ x: dx, y: gesture.dy * 0.2 });
      },
      onPanResponderRelease: (_, gesture) => {
        const isLast = preventLastCardDismiss && currentIndex >= items.length - 1;
        const shouldDismiss = !isLast && Math.abs(gesture.dx) > thresholdDistance;

        if (shouldDismiss) {
          isAnimating.current = true;
          const dir = gesture.dx > 0 ? 'right' : 'left';
          Animated.timing(pan, {
            toValue: { x: dir === 'right' ? 500 : -500, y: gesture.dy * 0.2 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipe?.(items[currentIndex], dir);
            setCurrentIndex((i) => i + 1);
            isAnimating.current = false;
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [\`-\${maxRotation}deg\`, '0deg', \`\${maxRotation}deg\`],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {visibleItems.map((item, idx) => {
        const itemKey = currentIndex + idx;
        if (idx === 0) {
          return (
            <Animated.View
              key={itemKey}
              style={[
                styles.card,
                styles.topCard,
                { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] },
              ]}
              {...panResponder.panHandlers}
            >
              {renderCard(item, itemKey)}
            </Animated.View>
          );
        }

        const bgScale = pan.x.interpolate({
          inputRange: [-thresholdDistance, 0, thresholdDistance],
          outputRange: [1 - (idx - 1) * scaleStep, 1 - idx * scaleStep, 1 - (idx - 1) * scaleStep],
          extrapolate: 'clamp',
        });

        const bgTranslateY = pan.x.interpolate({
          inputRange: [-thresholdDistance, 0, thresholdDistance],
          outputRange: [(idx - 1) * offsetStep, idx * offsetStep, (idx - 1) * offsetStep],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={itemKey}
            style={[
              styles.card,
              {
                zIndex: 30 - idx * 10,
                transform: [{ translateY: bgTranslateY }, { scale: bgScale }],
                opacity: Math.max(0.4, 1 - idx * 0.15),
              },
            ]}
          >
            {renderCard(item, itemKey)}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 232,
    width: '100%',
  },
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
  topCard: {
    zIndex: 30,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'card_swipe_stack.dart',
					language: 'dart',
					description: 'Flutter StatefulWidget Card Swipe Stack with multi-card stacked layer elevation, Hermite smoothstep, and Euler rotation.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaCardSwipeStack extends StatefulWidget {
  final int itemCount;
  final Widget Function(BuildContext context, int index) itemBuilder;
  final double thresholdDistance;
  final double maxRotation;
  final double scaleStep;
  final double offsetStep;
  final bool preventLastCardDismiss;
  final Function(int index, String direction)? onSwipe;

  const ExhumaCardSwipeStack({
    Key? key,
    required this.itemCount,
    required this.itemBuilder,
    this.thresholdDistance = ${thresholdDistance}.0,
    this.maxRotation = ${maxRotation}.0,
    this.scaleStep = ${scaleStep},
    this.offsetStep = ${offsetStep}.0,
    this.preventLastCardDismiss = ${preventLastCardDismiss},
    this.onSwipe,
  }) : super(key: key);

  @override
  State<ExhumaCardSwipeStack> createState() => _ExhumaCardSwipeStackState();
}

class _ExhumaCardSwipeStackState extends State<ExhumaCardSwipeStack> {
  int _currentIndex = 0;
  Offset _offset = Offset.zero;
  bool _isAnimating = false;

  @override
  Widget build(BuildContext context) {
    if (_currentIndex >= widget.itemCount) {
      return const SizedBox(height: 232);
    }

    final maxRad = widget.maxRotation * (math.pi / 180);
    final angle = (_offset.dx / 200).clamp(-1.0, 1.0) * maxRad;
    final progress = (_offset.dx.abs() / widget.thresholdDistance).clamp(0.0, 1.0);
    final smooth = progress * progress * (3.0 - 2.0 * progress);

    List<Widget> stackChildren = [];

    // Background cards (index 2 and 1)
    for (int i = 2; i >= 1; i--) {
      final cardIdx = _currentIndex + i;
      if (cardIdx < widget.itemCount) {
        final targetY = (i - 1) * widget.offsetStep;
        final curY = i * widget.offsetStep;
        final y = curY - smooth * (curY - targetY);

        final targetScale = 1.0 - (i - 1) * widget.scaleStep;
        final curScale = 1.0 - i * widget.scaleStep;
        final scale = curScale + smooth * (targetScale - curScale);

        final targetOpacity = (1.0 - (i - 1) * 0.15).clamp(0.4, 1.0);
        final curOpacity = (1.0 - i * 0.15).clamp(0.4, 1.0);
        final opacity = curOpacity + smooth * (targetOpacity - curOpacity);

        stackChildren.add(
          Transform.translate(
            offset: Offset(0, y),
            child: Transform.scale(
              scale: scale,
              child: Opacity(
                opacity: opacity,
                child: SizedBox(
                  width: 320,
                  child: widget.itemBuilder(context, cardIdx),
                ),
              ),
            ),
          ),
        );
      }
    }

    // Top card (index 0)
    stackChildren.add(
      GestureDetector(
        onPanUpdate: (details) {
          if (_isAnimating || _currentIndex >= widget.itemCount) return;
          final isLast = widget.preventLastCardDismiss && _currentIndex >= widget.itemCount - 1;
          setState(() {
            Offset next = _offset + details.delta;
            if (isLast) {
              final rawDx = next.dx;
              final sign = rawDx >= 0 ? 1.0 : -1.0;
              final dampedDx = sign * math.min(2.2 * math.pow(rawDx.abs(), 0.78), 80.0);
              _offset = Offset(dampedDx, next.dy * 0.2);
            } else {
              _offset = next;
            }
          });
        },
        onPanEnd: (details) {
          if (_isAnimating) return;
          final isLast = widget.preventLastCardDismiss && _currentIndex >= widget.itemCount - 1;
          final shouldDismiss = !isLast && _offset.dx.abs() > widget.thresholdDistance;

          if (shouldDismiss) {
            final dir = _offset.dx > 0 ? 'right' : 'left';
            widget.onSwipe?.call(_currentIndex, dir);
            setState(() {
              _offset = Offset.zero;
              _currentIndex++;
            });
          } else {
            setState(() {
              _offset = Offset.zero;
            });
          }
        },
        child: Transform.translate(
          offset: _offset,
          child: Transform.rotate(
            angle: angle,
            child: SizedBox(
              width: 320,
              child: widget.itemBuilder(context, _currentIndex),
            ),
          ),
        ),
      ),
    );

    return Center(
      child: SizedBox(
        height: 260,
        child: Stack(
          alignment: Alignment.center,
          children: stackChildren,
        ),
      ),
    );
  }
}

/// Compatibility alias
typedef CardSwipeStack = ExhumaCardSwipeStack;
`,
				},
			];
		}

		default:
			return null;
	}
}

export function getCardSwipeStackUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const thresholdDistance = Number(props.thresholdDistance ?? 120);
	const maxRotation = Number(props.maxRotation ?? 20);
	const scaleStep = Number(props.scaleStep ?? 0.05);
	const offsetStep = Number(props.offsetStep ?? 14);
	const preventLastCardDismiss = props.preventLastCardDismiss !== false;
	const loop = Boolean(props.loop ?? false);

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
        loop={${loop}}
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
        loop={${loop}}
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
    loop={${loop}}
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
        loop={${loop}}
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
    loop={${loop}}
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
        [loop]="${loop}"
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
        loop={${loop}}
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
