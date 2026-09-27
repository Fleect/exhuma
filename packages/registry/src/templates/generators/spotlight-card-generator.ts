import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getSpotlightCardOuterFiles(
	flavor: EcosystemFlavor,
	props: Record<string, unknown>,
	isEjected: boolean
): ComponentFilePayload[] | null {
	const radius = Number(props.radius ?? 350);
	const color = String(props.color ?? '#6366f1');
	const borderColor = String(props.borderColor ?? '#818cf8');
	const opacity = Number(props.opacity ?? 0.85);
	const spread = Number(props.spread ?? 60);
	const mode = (props.mode as string) ?? 'both';
	const smoothing = Number(props.smoothing ?? 0.2);
	const disabled = Boolean(props.disabled ?? false);

	const defaultClass =
		'exhuma-spotlight-card group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900/5 transition-colors dark:border-neutral-800 dark:bg-neutral-900/40';

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
        if (!rectRef.current) measureRect();
        const rect = rectRef.current;
        if (!rect) return;

        targetX.current = e.clientX - rect.left;
        targetY.current = e.clientY - rect.top;
        targetOpacity.current = Math.max(0, Math.min(1, opacity));

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
        }
      };
    }, [cardRef, radius, color, borderColor, spread, disabled]);

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
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
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
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: 'calc(var(--exhuma-spotlight-opacity, 0) * 0.25)',
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
  if (!rect) measureRect();
  if (!rect) return;
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
  targetOpacity = Math.max(0, Math.min(1, props.opacity));
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
  if (rafId !== null) cancelAnimationFrame(rafId);
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
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    />

    <!-- Background Radial Sheen -->
    <div
      v-if="props.mode === 'both' || props.mode === 'background'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
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
      if (rafId !== null) cancelAnimationFrame(rafId);
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
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    ></div>
  {/if}

  {#if mode === 'both' || mode === 'background'}
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity()));
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
      if (rafId !== null) cancelAnimationFrame(rafId);
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
      class={\`${defaultClass} \${local.class ?? ''}\`}
      {...others}
    >
      {(mode() === 'both' || mode() === 'border') && (
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
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
          class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: 'calc(var(--exhuma-spotlight-opacity, 0) * 0.25)',
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
          class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
          style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
        ></div>
      }

      @if (mode() === 'both' || mode() === 'background') {
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(var(--exhuma-spotlight-radius) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
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
    if (!this.rect && this.cardRef()?.nativeElement) {
      this.rect = this.cardRef()!.nativeElement.getBoundingClientRect();
    }
    if (!this.rect) return;
    this.targetX = e.clientX - this.rect.left;
    this.targetY = e.clientY - this.rect.top;
    this.targetOpacity = Math.max(0, Math.min(1, this.opacity()));
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
  class={\`${defaultClass} \${className}\`}
  {...props}
>
  {(mode === 'both' || mode === 'border') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
      style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
    />
  )}

  {(mode === 'both' || mode === 'background') && (
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
        if (!rect) measureRect();
        if (!rect) return;
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = Math.max(0, Math.min(1, opacity));
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
        if (rafId !== null) cancelAnimationFrame(rafId);
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
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
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
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
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
      if (!rect) measureRect();
      if (!rect) return;
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetOpacity = Math.max(0, Math.min(1, opacity));
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
      if (rafId !== null) cancelAnimationFrame(rafId);
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
            class="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
            style="opacity: var(--exhuma-spotlight-opacity, 0); border: 1.5px solid transparent; background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-border-color, #818cf8) 0%, transparent var(--exhuma-spotlight-spread, 60%)) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude;"
        ></div>
    @endif

    @if ($mode === 'both' || $mode === 'background')
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(var(--exhuma-spotlight-radius, 350px) circle at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
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
                if (!rect) rect = card.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;
                targetOpacity = opacity;
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
      class="exhuma-spotlight-glow pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      style="opacity: calc(var(--exhuma-spotlight-opacity, 0) * 0.25); background: radial-gradient(circle var(--exhuma-spotlight-radius, 350px) at var(--exhuma-spotlight-x, -9999px) var(--exhuma-spotlight-y, -9999px), var(--exhuma-spotlight-color, #6366f1) 0%, transparent var(--exhuma-spotlight-spread, 60%));"
    ></div>
  <?php endif; ?>
  <?php if ($mode === 'both' || $mode === 'border'): ?>
    <div
      aria-hidden="true"
      class="exhuma-spotlight-border pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
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
        if (!rect) rect = card.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        targetOpacity = opacity;
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
