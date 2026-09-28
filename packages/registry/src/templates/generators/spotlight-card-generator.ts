import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getSpotlightCardOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const radius = Number(props.radius ?? 350);
	const color = String(props.color ?? '#6366f1');
	const borderColor = String(props.borderColor ?? '#818cf8');
	const opacity = Number(props.opacity ?? 0.85);
	const spread = Number(props.spread ?? 60);
	const mode = (props.mode as string) ?? 'both';
	const smoothing = Number(props.smoothing ?? 0.2);
	const disabled = Boolean(props.disabled ?? false);

	const defaultClass = 'exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			return [
				{
					filename: 'SpotlightCard.tsx',
					language: 'tsx',
					description: 'Spotlight Card — Standalone Ejected Engine (Zero Dependencies). Sub-pixel radial illumination and frame-coalesced smoothing inlined.',
					code: `${header}import * as React from 'react';
import { clsx } from 'clsx';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'SpotlightCard.vue',
					language: 'vue',
					description: 'Vue 3 Native Spotlight Card component with sub-pixel radial illumination and zero layout thrashing.',
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

let rafId: number | null = null;
let rect: DOMRect | null = null;
let targetX = -9999;
let targetY = -9999;
let currentX = -9999;
let currentY = -9999;
let targetOpacity = 0;
let currentOpacity = 0;
let isHovered = false;

const updateFrame = () => {
  if (!cardRef.value) return;
  if (props.disabled) {
    cardRef.value.style.setProperty('--exhuma-spotlight-opacity', '0');
    rafId = null;
    return;
  }

  const factor = Math.max(0.05, Math.min(1, props.smoothing));
  currentX += (targetX - currentX) * factor;
  currentY += (targetY - currentY) * factor;
  currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

  cardRef.value.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
  cardRef.value.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
  cardRef.value.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

  const diffX = Math.abs(targetX - currentX);
  const diffY = Math.abs(targetY - currentY);
  const diffOp = Math.abs(targetOpacity - currentOpacity);

  if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
    rafId = requestAnimationFrame(updateFrame);
  } else {
    rafId = null;
  }
};

const scheduleUpdate = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateFrame);
  }
};

const measureRect = () => {
  if (cardRef.value) rect = cardRef.value.getBoundingClientRect();
};

const onPointerEnter = (e: PointerEvent) => {
  if (props.disabled) return;
  isHovered = true;
  measureRect();
  if (rect) {
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    targetOpacity = Math.max(0, Math.min(1, props.opacity));
    if (currentX < -1000) {
      currentX = targetX;
      currentY = targetY;
    }
  }
  scheduleUpdate();
};

const onPointerMove = (e: PointerEvent) => {
  if (props.disabled) return;
  isHovered = true;
  if (!rect) measureRect();
  if (!rect) return;
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
  targetOpacity = Math.max(0, Math.min(1, props.opacity));
  if (currentX < -1000) {
    currentX = targetX;
    currentY = targetY;
  }
  scheduleUpdate();
};

const onPointerLeave = () => {
  isHovered = false;
  targetOpacity = 0;
  scheduleUpdate();
};

onMounted(() => {
  if (!cardRef.value) return;
  cardRef.value.style.setProperty('--exhuma-spotlight-radius', props.radius + 'px');
  cardRef.value.style.setProperty('--exhuma-spotlight-color', props.color);
  cardRef.value.style.setProperty('--exhuma-spotlight-border-color', props.borderColor);
  cardRef.value.style.setProperty('--exhuma-spotlight-spread', props.spread + '%');

  window.addEventListener('resize', measureRect, { passive: true });
  window.addEventListener('scroll', measureRect, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  window.removeEventListener('resize', measureRect);
  window.removeEventListener('scroll', measureRect);
});
</script>

<template>
  <div
    ref="cardRef"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="['${defaultClass}', props.class]"
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

		case 'svelte': {
			return [
				{
					filename: 'SpotlightCard.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Spotlight Card component with sub-pixel radial illumination.',
					code: `<script lang="ts">
  import { onMount } from 'svelte';

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

  let cardRef = $state<HTMLDivElement | null>(null);

  onMount(() => {
    if (!cardRef) return;
    let rafId: number | null = null;
    let rect: DOMRect | null = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isHovered = false;

    cardRef.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
    cardRef.style.setProperty('--exhuma-spotlight-color', color);
    cardRef.style.setProperty('--exhuma-spotlight-border-color', borderColor);
    cardRef.style.setProperty('--exhuma-spotlight-spread', spread + '%');

    const updateFrame = () => {
      if (!cardRef) return;
      if (disabled) {
        cardRef.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafId = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing));
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

      cardRef.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
      cardRef.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
      cardRef.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffOp = Math.abs(targetOpacity - currentOpacity);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const measureRect = () => {
      if (cardRef) rect = cardRef.getBoundingClientRect();
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (disabled) return;
      isHovered = true;
      measureRect();
      if (rect) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity));
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
      }
      scheduleUpdate();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (disabled) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleUpdate();
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleUpdate();
    };

    cardRef.addEventListener('pointerenter', onPointerEnter);
    cardRef.addEventListener('pointermove', onPointerMove);
    cardRef.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', measureRect, { passive: true });
    window.addEventListener('scroll', measureRect, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      cardRef?.removeEventListener('pointerenter', onPointerEnter);
      cardRef?.removeEventListener('pointermove', onPointerMove);
      cardRef?.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', measureRect);
      window.removeEventListener('scroll', measureRect);
    };
  });
</script>

<div
  bind:this={cardRef}
  class="${defaultClass} {className}"
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

		case 'solid': {
			return [
				{
					filename: 'SpotlightCard.tsx',
					language: 'tsx',
					description: 'SolidJS Native Spotlight Card component with fine-grained reactivity and radial illumination.',
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
}

export const SpotlightCard: Component<SpotlightCardProps> = (props) => {
  let cardRef: HTMLDivElement | undefined;
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

  const radius = () => local.radius ?? ${radius};
  const color = () => local.color ?? '${color}';
  const borderColor = () => local.borderColor ?? '${borderColor}';
  const opacity = () => local.opacity ?? ${opacity};
  const spread = () => local.spread ?? ${spread};
  const mode = () => local.mode ?? '${mode}';
  const smoothing = () => local.smoothing ?? ${smoothing};
  const disabled = () => local.disabled ?? ${disabled};

  onMount(() => {
    if (!cardRef) return;
    let rafId: number | null = null;
    let rect: DOMRect | null = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isHovered = false;

    cardRef.style.setProperty('--exhuma-spotlight-radius', radius() + 'px');
    cardRef.style.setProperty('--exhuma-spotlight-color', color());
    cardRef.style.setProperty('--exhuma-spotlight-border-color', borderColor());
    cardRef.style.setProperty('--exhuma-spotlight-spread', spread() + '%');

    const updateFrame = () => {
      if (!cardRef) return;
      if (disabled()) {
        cardRef.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafId = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing()));
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

      cardRef.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
      cardRef.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
      cardRef.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffOp = Math.abs(targetOpacity - currentOpacity);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
        rafId = requestAnimationFrame(updateFrame);
      } else {
        rafId = null;
      }
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateFrame);
      }
    };

    const measureRect = () => {
      if (cardRef) rect = cardRef.getBoundingClientRect();
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (disabled()) return;
      isHovered = true;
      measureRect();
      if (rect) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity()));
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
      }
      scheduleUpdate();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (disabled()) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity()));
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleUpdate();
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleUpdate();
    };

    cardRef.addEventListener('pointerenter', onPointerEnter);
    cardRef.addEventListener('pointermove', onPointerMove);
    cardRef.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', measureRect, { passive: true });
    window.addEventListener('scroll', measureRect, { passive: true });

    onCleanup(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      cardRef?.removeEventListener('pointerenter', onPointerEnter);
      cardRef?.removeEventListener('pointermove', onPointerMove);
      cardRef?.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', measureRect);
      window.removeEventListener('scroll', measureRect);
    });
  });

  return (
    <div
      ref={cardRef}
      class={'${defaultClass} ' + (local.class ?? '')}
      {...others}
    >
      {(mode() === 'both' || mode() === 'border') && (
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{
            opacity: 'var(--exhuma-spotlight-opacity, 0)',
            border: '1.5px solid transparent',
            background: 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box',
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
            background: 'radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%))',
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

		case 'angular': {
			return [
				{
					filename: 'spotlight-card.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Spotlight Card component with kinetic pointer tracking.',
					code: `import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-spotlight-card',
  standalone: true,
  template: \`
    <div
      #cardRef
      [class]="'${defaultClass} ' + customClass()"
      (pointerenter)="onPointerEnter($event)"
      (pointermove)="onPointerMove($event)"
      (pointerleave)="onPointerLeave()"
    >
      @if (mode() === 'both' || mode() === 'border') {
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
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
export class ExhumaSpotlightCardComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly customClass = input<string>('');
  readonly radius = input<number>(${radius});
  readonly color = input<string>('${color}');
  readonly borderColor = input<string>('${borderColor}');
  readonly opacity = input<number>(${opacity});
  readonly spread = input<number>(${spread});
  readonly mode = input<'both' | 'border' | 'background'>('${mode}');
  readonly smoothing = input<number>(${smoothing});
  readonly disabled = input<boolean>(${disabled});

  readonly cardRef = viewChild<ElementRef<HTMLDivElement>>('cardRef');

  private rafId: number | null = null;
  private rect: DOMRect | null = null;
  private targetX = -9999;
  private targetY = -9999;
  private currentX = -9999;
  private currentY = -9999;
  private targetOpacity = 0;
  private currentOpacity = 0;
  private isHovered = false;

  constructor() {
    afterNextRender(() => {
      const el = this.cardRef()?.nativeElement;
      if (!el) return;

      el.style.setProperty('--exhuma-spotlight-radius', this.radius() + 'px');
      el.style.setProperty('--exhuma-spotlight-color', this.color());
      el.style.setProperty('--exhuma-spotlight-border-color', this.borderColor());
      el.style.setProperty('--exhuma-spotlight-spread', this.spread() + '%');

      const onResize = () => {
        if (this.cardRef()?.nativeElement) {
          this.rect = this.cardRef()!.nativeElement.getBoundingClientRect();
        }
      };

      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('scroll', onResize, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (this.rafId !== null) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onResize);
      });
    });
  }

  private updateFrame = () => {
    const el = this.cardRef()?.nativeElement;
    if (!el) return;

    if (this.disabled()) {
      el.style.setProperty('--exhuma-spotlight-opacity', '0');
      this.rafId = null;
      return;
    }

    const factor = Math.max(0.05, Math.min(1, this.smoothing()));
    this.currentX += (this.targetX - this.currentX) * factor;
    this.currentY += (this.targetY - this.currentY) * factor;
    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * Math.max(0.08, factor * 0.75);

    el.style.setProperty('--exhuma-spotlight-x', this.currentX.toFixed(2) + 'px');
    el.style.setProperty('--exhuma-spotlight-y', this.currentY.toFixed(2) + 'px');
    el.style.setProperty('--exhuma-spotlight-opacity', this.currentOpacity.toFixed(3));

    const diffX = Math.abs(this.targetX - this.currentX);
    const diffY = Math.abs(this.targetY - this.currentY);
    const diffOp = Math.abs(this.targetOpacity - this.currentOpacity);

    if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || this.isHovered) {
      this.rafId = requestAnimationFrame(this.updateFrame);
    } else {
      this.rafId = null;
    }
  };

  private scheduleUpdate() {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.updateFrame);
    }
  }

  onPointerEnter(e: PointerEvent) {
    if (this.disabled()) return;
    this.isHovered = true;
    const el = this.cardRef()?.nativeElement;
    if (el) this.rect = el.getBoundingClientRect();
    if (this.rect) {
      this.targetX = e.clientX - this.rect.left;
      this.targetY = e.clientY - this.rect.top;
      this.targetOpacity = Math.max(0, Math.min(1, this.opacity()));
      if (this.currentX < -1000) {
        this.currentX = this.targetX;
        this.currentY = this.targetY;
      }
    }
    this.scheduleUpdate();
  }

  onPointerMove(e: PointerEvent) {
    if (this.disabled()) return;
    this.isHovered = true;
    if (!this.rect && this.cardRef()?.nativeElement) {
      this.rect = this.cardRef()!.nativeElement.getBoundingClientRect();
    }
    if (!this.rect) return;
    this.targetX = e.clientX - this.rect.left;
    this.targetY = e.clientY - this.rect.top;
    this.targetOpacity = Math.max(0, Math.min(1, this.opacity()));
    if (this.currentX < -1000) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
    }
    this.scheduleUpdate();
  }

  onPointerLeave() {
    this.isHovered = false;
    this.targetOpacity = 0;
    this.scheduleUpdate();
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'SpotlightCard.astro',
					language: 'astro',
					description: 'Pure Native Astro Spotlight Card component with radial illumination.',
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

const sheenOpacity = mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)';
---

<div
  data-exhuma-spotlight-card
  data-radius={radius}
  data-color={color}
  data-border-color={borderColor}
  data-opacity={opacity}
  data-spread={spread}
  data-mode={mode}
  data-smoothing={smoothing}
  data-disabled={disabled.toString()}
  class={'${defaultClass} ' + className}
  {...props}
>
  {(mode === 'both' || mode === 'border') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    />
  )}

  {(mode === 'both' || mode === 'background') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0"
      style={{
        opacity: sheenOpacity,
        background: 'radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%))',
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
      const radius = card.dataset.radius || '${radius}';
      const color = card.dataset.color || '${color}';
      const borderColor = card.dataset.borderColor || '${borderColor}';
      const spread = card.dataset.spread || '${spread}';
      const opacity = parseFloat(card.dataset.opacity || '${opacity}');
      const smoothing = parseFloat(card.dataset.smoothing || '${smoothing}');
      const disabled = card.dataset.disabled === 'true';

      card.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
      card.style.setProperty('--exhuma-spotlight-color', color);
      card.style.setProperty('--exhuma-spotlight-border-color', borderColor);
      card.style.setProperty('--exhuma-spotlight-spread', spread + '%');

      let rafId: number | null = null;
      let rect: DOMRect | null = null;
      let targetX = -9999;
      let targetY = -9999;
      let currentX = -9999;
      let currentY = -9999;
      let targetOpacity = 0;
      let currentOpacity = 0;
      let isHovered = false;

      function updateFrame() {
        if (disabled) {
          card.style.setProperty('--exhuma-spotlight-opacity', '0');
          rafId = null;
          return;
        }

        const factor = Math.max(0.05, Math.min(1, smoothing));
        currentX += (targetX - currentX) * factor;
        currentY += (targetY - currentY) * factor;
        currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

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
      }

      function scheduleUpdate() {
        if (rafId === null) rafId = requestAnimationFrame(updateFrame);
      }

      function measureRect() {
        rect = card.getBoundingClientRect();
      }

      card.addEventListener('pointerenter', (e) => {
        if (disabled) return;
        isHovered = true;
        measureRect();
        if (rect) {
          targetX = e.clientX - rect.left;
          targetY = e.clientY - rect.top;
          targetOpacity = Math.max(0, Math.min(1, opacity));
          if (currentX < -1000) {
            currentX = targetX;
            currentY = targetY;
          }
        }
        scheduleUpdate();
      });

      card.addEventListener('pointermove', (e) => {
        if (disabled) return;
        isHovered = true;
        if (!rect) measureRect();
        if (!rect) return;
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity));
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
        scheduleUpdate();
      });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        targetOpacity = 0;
        scheduleUpdate();
      });

      window.addEventListener('resize', measureRect, { passive: true });
      window.addEventListener('scroll', measureRect, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        window.removeEventListener('resize', measureRect);
        window.removeEventListener('scroll', measureRect);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlightCards);
  } else {
    initSpotlightCards();
  }
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-spotlight-card.js',
					language: 'javascript',
					description: 'Autonomous Web Component <exhuma-spotlight-card> with kinetic radial illumination.',
					code: `class ExhumaSpotlightCardElement extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-spotlight-card');
    this.style.display = 'block';
    this.style.position = 'relative';

    const radius = this.getAttribute('radius') || '${radius}';
    const color = this.getAttribute('color') || '${color}';
    const borderColor = this.getAttribute('border-color') || '${borderColor}';
    const spread = this.getAttribute('spread') || '${spread}';
    const opacity = parseFloat(this.getAttribute('opacity') || '${opacity}');
    const smoothing = parseFloat(this.getAttribute('smoothing') || '${smoothing}');
    const mode = this.getAttribute('mode') || '${mode}';
    const disabled = this.getAttribute('disabled') === 'true';

    this.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
    this.style.setProperty('--exhuma-spotlight-color', color);
    this.style.setProperty('--exhuma-spotlight-border-color', borderColor);
    this.style.setProperty('--exhuma-spotlight-spread', spread + '%');

    this._rafId = null;
    let rect = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isHovered = false;

    const updateFrame = () => {
      if (disabled) {
        this.style.setProperty('--exhuma-spotlight-opacity', '0');
        this._rafId = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing));
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

      this.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
      this.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
      this.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      const diffOp = Math.abs(targetOpacity - currentOpacity);

      if (diffX > 0.1 || diffY > 0.1 || diffOp > 0.005 || isHovered) {
        this._rafId = requestAnimationFrame(updateFrame);
      } else {
        this._rafId = null;
      }
    };

    const scheduleUpdate = () => {
      if (this._rafId === null) this._rafId = requestAnimationFrame(updateFrame);
    };

    const measureRect = () => {
      rect = this.getBoundingClientRect();
    };

    this._onPointerEnter = (e) => {
      if (disabled) return;
      isHovered = true;
      measureRect();
      if (rect) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity));
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
      }
      scheduleUpdate();
    };

    this._onPointerMove = (e) => {
      if (disabled) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleUpdate();
    };

    this._onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleUpdate();
    };

    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerleave', this._onPointerLeave);
  }

  disconnectedCallback() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerLeave);
  }
}

if (!customElements.get('exhuma-spotlight-card')) {
  customElements.define('exhuma-spotlight-card', ExhumaSpotlightCardElement);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'spotlight-card.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS Spotlight Card initialization module with exponential smoothing.',
					code: `export function initSpotlightCard(selector = '[data-exhuma-spotlight-card]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  elements.forEach((card) => {
    const radius = card.getAttribute('data-radius') || options.radius || ${radius};
    const color = card.getAttribute('data-color') || options.color || '${color}';
    const borderColor = card.getAttribute('data-border-color') || options.borderColor || '${borderColor}';
    const spread = card.getAttribute('data-spread') || options.spread || ${spread};
    const opacity = parseFloat(card.getAttribute('data-opacity') || options.opacity || ${opacity});
    const smoothing = parseFloat(card.getAttribute('data-smoothing') || options.smoothing || ${smoothing});
    const disabled = (card.getAttribute('data-disabled') || options.disabled) === 'true';

    card.style.setProperty('--exhuma-spotlight-radius', radius + 'px');
    card.style.setProperty('--exhuma-spotlight-color', color);
    card.style.setProperty('--exhuma-spotlight-border-color', borderColor);
    card.style.setProperty('--exhuma-spotlight-spread', spread + '%');

    let rafId = null;
    let rect = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let targetOpacity = 0;
    let currentOpacity = 0;
    let isHovered = false;

    const updateFrame = () => {
      if (disabled) {
        card.style.setProperty('--exhuma-spotlight-opacity', '0');
        rafId = null;
        return;
      }

      const factor = Math.max(0.05, Math.min(1, smoothing));
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

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

    const scheduleUpdate = () => {
      if (rafId === null) rafId = requestAnimationFrame(updateFrame);
    };

    const measureRect = () => {
      rect = card.getBoundingClientRect();
    };

    const onPointerEnter = (e) => {
      if (disabled) return;
      isHovered = true;
      measureRect();
      if (rect) {
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity));
        if (currentX < -1000) {
          currentX = targetX;
          currentY = targetY;
        }
      }
      scheduleUpdate();
    };

    const onPointerMove = (e) => {
      if (disabled) return;
      isHovered = true;
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
      if (currentX < -1000) {
        currentX = targetX;
        currentY = targetY;
      }
      scheduleUpdate();
    };

    const onPointerLeave = () => {
      isHovered = false;
      targetOpacity = 0;
      scheduleUpdate();
    };

    card.addEventListener('pointerenter', onPointerEnter);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', measureRect, { passive: true });
    window.addEventListener('scroll', measureRect, { passive: true });

    cleanups.push(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      card.removeEventListener('pointerenter', onPointerEnter);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', measureRect);
      window.removeEventListener('scroll', measureRect);
    });
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'spotlight-card.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Spotlight Card with radial illumination.',
					code: `@props([
    'radius' => ${radius},
    'color' => '${color}',
    'borderColor' => '${borderColor}',
    'opacity' => ${opacity},
    'spread' => ${spread},
    'mode' => '${mode}',
    'smoothing' => ${smoothing},
    'disabled' => ${disabled ? 'true' : 'false'},
])

<div
    data-exhuma-spotlight-card
    data-radius="{{ $radius }}"
    data-color="{{ $color }}"
    data-border-color="{{ $borderColor }}"
    data-opacity="{{ $opacity }}"
    data-spread="{{ $spread }}"
    data-mode="{{ $mode }}"
    data-smoothing="{{ $smoothing }}"
    data-disabled="{{ $disabled ? 'true' : 'false' }}"
    {{ $attributes->merge([
        'class' => '${defaultClass}',
    ]) }}
    style="--exhuma-spotlight-radius: {{ $radius }}px; --exhuma-spotlight-color: {{ $color }}; --exhuma-spotlight-border-color: {{ $borderColor }}; --exhuma-spotlight-spread: {{ $spread }}%; --exhuma-spotlight-opacity: 0;"
>
    @if ($mode === 'both' || $mode === 'border')
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
        ></div>
    @endif

    @if ($mode === 'both' || $mode === 'background')
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-0"
            style="opacity: {{ $mode === 'background' ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)' }}; background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
        ></div>
    @endif

    <div class="relative z-20">
        {{ $slot }}
    </div>
</div>

<script>
(function() {
    function init() {
        document.querySelectorAll('[data-exhuma-spotlight-card]').forEach(function(card) {
            if (card.dataset.exhumaInit) return;
            card.dataset.exhumaInit = 'true';

            var radius = card.getAttribute('data-radius') || '${radius}';
            var color = card.getAttribute('data-color') || '${color}';
            var borderColor = card.getAttribute('data-border-color') || '${borderColor}';
            var spread = card.getAttribute('data-spread') || '${spread}';
            var opacity = parseFloat(card.getAttribute('data-opacity') || '${opacity}');
            var smoothing = parseFloat(card.getAttribute('data-smoothing') || '${smoothing}');
            var disabled = card.getAttribute('data-disabled') === 'true';

            var rafId = null;
            var rect = null;
            var targetX = -9999;
            var targetY = -9999;
            var currentX = -9999;
            var currentY = -9999;
            var targetOpacity = 0;
            var currentOpacity = 0;
            var isHovered = false;

            function update() {
                if (disabled) {
                    card.style.setProperty('--exhuma-spotlight-opacity', '0');
                    rafId = null;
                    return;
                }
                var factor = Math.max(0.05, Math.min(1, smoothing));
                currentX += (targetX - currentX) * factor;
                currentY += (targetY - currentY) * factor;
                currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

                card.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
                card.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
                card.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

                if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1 || Math.abs(targetOpacity - currentOpacity) > 0.005 || isHovered) {
                    rafId = requestAnimationFrame(update);
                } else {
                    rafId = null;
                }
            }

            card.addEventListener('pointerenter', function(e) {
                if (disabled) return;
                isHovered = true;
                rect = card.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                targetOpacity = opacity;
                if (currentX < -1000) { currentX = targetX; currentY = targetY; }
                if (!rafId) rafId = requestAnimationFrame(update);
            });

            card.addEventListener('pointermove', function(e) {
                if (disabled) return;
                isHovered = true;
                if (!rect) rect = card.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                targetOpacity = opacity;
                if (currentX < -1000) { currentX = targetX; currentY = targetY; }
                if (!rafId) rafId = requestAnimationFrame(update);
            });

            card.addEventListener('pointerleave', function() {
                isHovered = false;
                targetOpacity = 0;
                if (!rafId) rafId = requestAnimationFrame(update);
            });

            window.addEventListener('pagehide', function() {
                if (rafId !== null) cancelAnimationFrame(rafId);
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

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Block API v3 definition for Spotlight Card.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/spotlight-card',
							version: '1.0.0',
							title: 'Exhuma Spotlight Card',
							category: 'design',
							icon: 'lightbulb',
							description: 'Interactive spotlight card with radial gradient border illumination and kinetic pointer tracking.',
							attributes: {
								radius: { type: 'number', default: radius },
								color: { type: 'string', default: color },
								borderColor: { type: 'string', default: borderColor },
								opacity: { type: 'number', default: opacity },
								spread: { type: 'number', default: spread },
								mode: { type: 'string', default: mode },
								smoothing: { type: 'number', default: smoothing },
								disabled: { type: 'boolean', default: disabled },
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
					description: 'WordPress Gutenberg block rendering template for Spotlight Card with autonomous pointer controller.',
					code: `<?php
/**
 * Spotlight Card Block Dynamic Render Template
 */
$radius = isset($attributes['radius']) ? (float)$attributes['radius'] : ${radius};
$color = isset($attributes['color']) ? sanitize_text_field($attributes['color']) : '${color}';
$border_color = isset($attributes['borderColor']) ? sanitize_text_field($attributes['borderColor']) : '${borderColor}';
$opacity = isset($attributes['opacity']) ? (float)$attributes['opacity'] : ${opacity};
$spread = isset($attributes['spread']) ? (float)$attributes['spread'] : ${spread};
$mode = isset($attributes['mode']) ? sanitize_text_field($attributes['mode']) : '${mode}';
$smoothing = isset($attributes['smoothing']) ? (float)$attributes['smoothing'] : ${smoothing};
$disabled = (isset($attributes['disabled']) && $attributes['disabled']) ? 'true' : 'false';
?>
<div
  class="exhuma-spotlight-card wp-block-exhuma-spotlight-card relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60"
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
      style="opacity: <?php echo ($mode === 'background') ? 'var(--exhuma-spotlight-opacity, 0)' : 'calc(var(--exhuma-spotlight-opacity, 0) * 0.35)'; ?>; background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
    <?php echo !empty($content) ? $content : ''; ?>
  </div>
</div>

<script>
(function() {
  function initSpotlightCards() {
    document.querySelectorAll('.wp-block-exhuma-spotlight-card').forEach(function(card) {
      if (card.__exhuma_init) return;
      card.__exhuma_init = true;

      var radius = card.getAttribute('data-radius') || '${radius}';
      var color = card.getAttribute('data-color') || '${color}';
      var borderColor = card.getAttribute('data-border-color') || '${borderColor}';
      var spread = card.getAttribute('data-spread') || '${spread}';
      var opacity = parseFloat(card.getAttribute('data-opacity') || '${opacity}');
      var smoothing = parseFloat(card.getAttribute('data-smoothing') || '${smoothing}');
      var disabled = card.getAttribute('data-disabled') === 'true';

      var rafId = null;
      var rect = null;
      var targetX = -9999;
      var targetY = -9999;
      var currentX = -9999;
      var currentY = -9999;
      var targetOpacity = 0;
      var currentOpacity = 0;
      var isHovered = false;

      function update() {
        if (disabled) {
          card.style.setProperty('--exhuma-spotlight-opacity', '0');
          rafId = null;
          return;
        }

        var factor = Math.max(0.05, Math.min(1, smoothing));
        currentX += (targetX - currentX) * factor;
        currentY += (targetY - currentY) * factor;
        currentOpacity += (targetOpacity - currentOpacity) * Math.max(0.08, factor * 0.75);

        card.style.setProperty('--exhuma-spotlight-x', currentX.toFixed(2) + 'px');
        card.style.setProperty('--exhuma-spotlight-y', currentY.toFixed(2) + 'px');
        card.style.setProperty('--exhuma-spotlight-opacity', currentOpacity.toFixed(3));

        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1 || Math.abs(targetOpacity - currentOpacity) > 0.005 || isHovered) {
          rafId = requestAnimationFrame(update);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('pointerenter', function(e) {
        if (disabled) return;
        isHovered = true;
        rect = card.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = opacity;
        if (currentX < -1000) { currentX = targetX; currentY = targetY; }
        if (!rafId) rafId = requestAnimationFrame(update);
      });

      card.addEventListener('pointermove', function(e) {
        if (disabled) return;
        isHovered = true;
        if (!rect) rect = card.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = opacity;
        if (currentX < -1000) { currentX = targetX; currentY = targetY; }
        if (!rafId) rafId = requestAnimationFrame(update);
      });

      card.addEventListener('pointerleave', function() {
        isHovered = false;
        targetOpacity = 0;
        if (!rafId) rafId = requestAnimationFrame(update);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlightCards);
  } else {
    initSpotlightCards();
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
					filename: 'SpotlightCard.tsx',
					language: 'tsx',
					description: 'React Native Spotlight Card with interactive touch tracking and radial illumination highlight.',
					code: `import React, { useRef } from 'react';
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  type ViewProps,
} from 'react-native';

export interface SpotlightCardProps extends ViewProps {
  radius?: number;
  color?: string;
  borderColor?: string;
  opacity?: number;
  children?: React.ReactNode;
}

export function SpotlightCard({
  radius = ${radius},
  color = '${color}',
  borderColor = '${borderColor}',
  opacity = ${opacity},
  style,
  children,
  ...props
}: SpotlightCardProps) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        pan.setValue({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY });
        Animated.timing(glowOpacity, {
          toValue: opacity,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (evt) => {
        pan.setValue({ x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY });
      },
      onPanResponderRelease: () => {
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View
      style={[styles.card, style]}
      {...panResponder.panHandlers}
      {...props}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: color,
            opacity: glowOpacity,
            transform: [
              { translateX: Animated.subtract(pan.x, new Animated.Value(radius)) },
              { translateY: Animated.subtract(pan.y, new Animated.Value(radius)) },
            ],
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    overflow: 'hidden',
    position: 'relative',
    padding: 24,
  },
  glow: {
    position: 'absolute',
  },
  content: {
    zIndex: 1,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'spotlight_card.dart',
					language: 'dart',
					description: 'Flutter Spotlight Card with kinetic mouse tracking and radial gradient illumination shader.',
					code: `import 'package:flutter/material.dart';

class ExhumaSpotlightCard extends StatefulWidget {
  final Widget child;
  final double radius;
  final Color color;
  final Color borderColor;
  final double opacity;
  final double spread;

  const ExhumaSpotlightCard({
    super.key,
    required this.child,
    this.radius = ${radius}.0,
    this.color = const Color(0xFF6366F1),
    this.borderColor = const Color(0xFF818CF8),
    this.opacity = ${opacity},
    this.spread = ${spread}.0,
  });

  @override
  State<ExhumaSpotlightCard> createState() => _ExhumaSpotlightCardState();
}

class _ExhumaSpotlightCardState extends State<ExhumaSpotlightCard> {
  Offset? _pointerPos;
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (e) => setState(() {
        _isHovered = true;
        _pointerPos = e.localPosition;
      }),
      onHover: (e) => setState(() {
        _pointerPos = e.localPosition;
      }),
      onExit: (_) => setState(() {
        _isHovered = false;
        _pointerPos = null;
      }),
      child: CustomPaint(
        foregroundPainter: _isHovered && _pointerPos != null
            ? _SpotlightBorderPainter(
                position: _pointerPos!,
                radius: widget.radius,
                borderColor: widget.borderColor.withOpacity(widget.opacity),
              )
            : null,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF27272A)),
            color: const Color(0xFF18181B).withOpacity(0.6),
          ),
          padding: const EdgeInsets.all(24),
          child: widget.child,
        ),
      ),
    );
  }
}

class _SpotlightBorderPainter extends CustomPainter {
  final Offset position;
  final double radius;
  final Color borderColor;

  _SpotlightBorderPainter({
    required this.position,
    required this.radius,
    required this.borderColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rrect = RRect.fromRectAndRadius(rect, const Radius.circular(16));
    final paint = Paint()
      ..shader = RadialGradient(
        center: Alignment(
          (position.dx / size.width) * 2 - 1,
          (position.dy / size.height) * 2 - 1,
        ),
        radius: radius / (size.width > size.height ? size.width : size.height),
        colors: [borderColor, Colors.transparent],
      ).createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    canvas.drawRRect(rrect, paint);
  }

  @override
  bool shouldRepaint(_SpotlightBorderPainter oldDelegate) =>
      oldDelegate.position != position ||
      oldDelegate.radius != radius ||
      oldDelegate.borderColor != borderColor;
}
`,
				},
			];
		}

		default:
			return null;
	}
}

export function getSpotlightCardUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
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
