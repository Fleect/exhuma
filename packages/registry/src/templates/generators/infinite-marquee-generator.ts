import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getInfiniteMarqueeOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const speed = Number(props.speed ?? 40);
	const direction = (props.direction as string) ?? 'left';
	const pauseOnHover = props.pauseOnHover !== false;
	const gap = typeof props.gap === 'number' ? props.gap : 24;
	const showFadeEdges = props.showFadeEdges !== false;
	const fadeWidth = Number(props.fadeWidth ?? 48);
	const fadeEdgeColor = String(props.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(props.fadeEdgeColorDark || '#09090b');
	const scrollCoupling = props.scrollCoupling === true;
	const directionHysteresis = props.directionHysteresis === true;

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'InfiniteMarquee.tsx',
					language: 'tsx',
					description: 'Infinite Marquee — Standalone Ejected Engine (Zero Dependencies). Pure rAF continuous translation loop with seamless modulo wrapping and hardware compositing.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface InfiniteMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string | number;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  scrollCoupling?: boolean;
  directionHysteresis?: boolean;
}

/**
 * Normalizes any CSS gap input (number, px, rem, em) into exact pixel values.
 */
export function parseGapToPx(gap: string | number | undefined): number {
  if (typeof gap === 'number') {
    return Number.isFinite(gap) ? Math.max(0, gap) : 24;
  }
  if (!gap || typeof gap !== 'string') return 24;

  const trimmed = gap.trim();
  const pxMatch = trimmed.match(/^([0-9.]+)\\s*px$/i);
  if (pxMatch) return Math.max(0, parseFloat(pxMatch[1]));

  const remMatch = trimmed.match(/^([0-9.]+)\\s*rem$/i);
  if (remMatch) return Math.max(0, parseFloat(remMatch[1]) * 16);

  const emMatch = trimmed.match(/^([0-9.]+)\\s*em$/i);
  if (emMatch) return Math.max(0, parseFloat(emMatch[1]) * 16);

  const parsed = parseFloat(trimmed);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 24;
}

/**
 * Exponential dampening factor for hover transitions.
 */
export function dampFactor(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt);
}

/**
 * Computes the continuous modulo translation offset.
 */
export function calculateMarqueeOffset(
  currentOffset: number,
  dt: number,
  speed: number,
  direction: 'left' | 'right',
  repeatWavelength: number
): number {
  if (repeatWavelength <= 0) return 0;

  const delta = speed * dt;
  let next = direction === 'left' ? currentOffset - delta : currentOffset + delta;

  if (direction === 'left') {
    if (next <= -repeatWavelength) {
      next = next % repeatWavelength;
    }
  } else {
    if (next >= 0) {
      next = (next % repeatWavelength) - repeatWavelength;
    }
  }

  return next;
}

/**
 * InfiniteMarquee — Standalone Ejected Engine (Zero Dependencies)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) modulo wrap calculations.
 * - 120Hz smooth rAF sub-pixel animation without layout thrashing.
 * - Hardware-accelerated translate3d transforms.
 * - Reactive dark mode edge gradients with prefers-reduced-motion safety.
 */
export const InfiniteMarquee = React.forwardRef<HTMLDivElement, InfiniteMarqueeProps>(
  (
    {
      children,
      speed = ${speed},
      direction = '${direction}',
      pauseOnHover = ${pauseOnHover},
      gap = ${gap},
      showFadeEdges = ${showFadeEdges},
      fadeWidth = ${fadeWidth},
      fadeEdgeColor = '${fadeEdgeColor}',
      fadeEdgeColorDark = '${fadeEdgeColorDark}',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const offsetRef = React.useRef<number>(direction === 'right' ? -1000 : 0);
    const kineticFactorRef = React.useRef<number>(1.0);
    const targetFactorRef = React.useRef<number>(1.0);
    const lastTimeRef = React.useRef<number | null>(null);
    const contentWidthRef = React.useRef<number>(0);
    const rafIdRef = React.useRef<number | null>(null);

    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const gapNum = parseGapToPx(gap);

    const useColorOverlay = Boolean(showFadeEdges && (fadeEdgeColor || fadeEdgeColorDark));

    // Zero-thrashing ResizeObserver
    React.useEffect(() => {
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          contentWidthRef.current = entry.contentRect.width;
          if (direction === 'right' && offsetRef.current === -1000) {
            offsetRef.current = -(entry.contentRect.width + gapNum);
          }
        }
      });

      observer.observe(contentEl);
      return () => observer.disconnect();
    }, [direction, gapNum]);

    // Continuous rAF Loop
    const tick = React.useCallback(
      (now: number) => {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = now;
        }
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = now;

        kineticFactorRef.current = dampFactor(kineticFactorRef.current, targetFactorRef.current, 12.0, dt);
        const effectiveSpeed = speed * kineticFactorRef.current;
        const width = contentWidthRef.current;
        const repeatWavelength = width + gapNum;

        if (width > 0 && effectiveSpeed > 0.01) {
          offsetRef.current = calculateMarqueeOffset(offsetRef.current, dt, effectiveSpeed, direction, repeatWavelength);

          if (trackRef.current) {
            trackRef.current.style.transform = \`translate3d(\${offsetRef.current.toFixed(2)}px, 0, 0)\`;
          }
        }

        rafIdRef.current = requestAnimationFrame(tick);
      },
      [speed, direction, gapNum]
    );

    React.useEffect(() => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [tick]);

    const handleMouseEnter = () => {
      if (pauseOnHover) targetFactorRef.current = 0.0;
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) targetFactorRef.current = 1.0;
    };

    const maskStyle: React.CSSProperties = showFadeEdges && !useColorOverlay
      ? {
          maskImage: \`linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent)\`,
          WebkitMaskImage: \`linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent)\`,
        }
      : {};

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={clsx('exhuma-marquee-root relative w-full overflow-hidden select-none py-4', className)}
        style={{ ...maskStyle, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {useColorOverlay && (
          <>
            <style>{\`
              .exhuma-marquee-fade-left, .exhuma-marquee-fade-right {
                --exhuma-fade-color: var(--fade-light, \${fadeEdgeColor || '#ffffff'});
              }
              :is(.dark, [data-theme='dark']) :is(.exhuma-marquee-fade-left, .exhuma-marquee-fade-right),
              :is(.dark, [data-theme='dark']).exhuma-marquee-fade-left,
              :is(.dark, [data-theme='dark']).exhuma-marquee-fade-right {
                --exhuma-fade-color: var(--fade-dark, \${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
              }
              @media (prefers-color-scheme: dark) {
                :root:not(.light) :is(.exhuma-marquee-fade-left, .exhuma-marquee-fade-right) {
                  --exhuma-fade-color: var(--fade-dark, \${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
                }
              }
            \`}</style>
            <div
              aria-hidden='true'
              className='exhuma-marquee-fade-left pointer-events-none absolute inset-y-0 left-0 z-10'
              style={{
                width: \`\${fadeWidth}px\`,
                ['--fade-light' as string]: fadeEdgeColor,
                ['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
                background: 'linear-gradient(to right, var(--exhuma-fade-color, var(--fade-light)), transparent)',
              }}
            />
            <div
              aria-hidden='true'
              className='exhuma-marquee-fade-right pointer-events-none absolute inset-y-0 right-0 z-10'
              style={{
                width: \`\${fadeWidth}px\`,
                ['--fade-light' as string]: fadeEdgeColor,
                ['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
                background: 'linear-gradient(to left, var(--exhuma-fade-color, var(--fade-light)), transparent)',
              }}
            />
          </>
        )}
        <div
          ref={trackRef}
          className='exhuma-marquee-track flex w-max will-change-transform'
          style={{ columnGap: gapVal }}
        >
          <div ref={contentRef} className='exhuma-marquee-content flex shrink-0 items-center' style={{ columnGap: gapVal }}>
            {children}
          </div>
          <div aria-hidden='true' className='exhuma-marquee-clone flex shrink-0 items-center' style={{ columnGap: gapVal }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);
InfiniteMarquee.displayName = 'InfiniteMarquee';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'InfiniteMarquee.vue',
					language: 'vue',
					description: 'Vue 3 Native Infinite Marquee continuous rAF translation loop.',
					code: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string | number;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  scrollCoupling?: boolean;
  directionHysteresis?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  speed: ${speed},
  direction: '${direction}',
  pauseOnHover: ${pauseOnHover},
  gap: ${gap},
  showFadeEdges: ${showFadeEdges},
  fadeWidth: ${fadeWidth},
  fadeEdgeColor: '${fadeEdgeColor}',
  fadeEdgeColorDark: '${fadeEdgeColorDark}',
  class: '',
});

const containerRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

const isDark = ref(false);
let offset = props.direction === 'right' ? -1000 : 0;
let kineticFactor = 1.0;
let targetFactor = 1.0;
let lastTime: number | null = null;
let contentWidth = 0;
let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

const parsedGapPx = computed(() => {
  if (typeof props.gap === 'number') return props.gap;
  const parsed = parseFloat(String(props.gap));
  return Number.isFinite(parsed) ? parsed : 24;
});

const gapVal = computed(() => {
  return typeof props.gap === 'number' ? \`\${props.gap}px\` : String(props.gap);
});

const resolvedColor = computed(() => {
  return isDark.value && props.fadeEdgeColorDark ? props.fadeEdgeColorDark : props.fadeEdgeColor;
});

const useColorOverlay = computed(() => {
  return props.showFadeEdges && Boolean(resolvedColor.value && resolvedColor.value.trim() !== '');
});

const maskStyle = computed(() => {
  if (!props.showFadeEdges || useColorOverlay.value) return {};
  const gradient = \`linear-gradient(to right, transparent, black \${props.fadeWidth}px, black calc(100% - \${props.fadeWidth}px), transparent)\`;
  return {
    WebkitMaskImage: gradient,
    maskImage: gradient,
  };
});

function checkDark() {
  if (typeof document === 'undefined') return;
  const hasDark = document.documentElement.classList.contains('dark');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const hasLight = document.documentElement.classList.contains('light');
  isDark.value = hasDark || (!hasLight && prefersDark);
}

function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt);
}

function tick(now: number) {
  if (lastTime === null) lastTime = now;
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  kineticFactor = damp(kineticFactor, targetFactor, 12.0, dt);
  const effectiveSpeed = props.speed * kineticFactor;
  const repeatWavelength = contentWidth + parsedGapPx.value;

  if (contentWidth > 0 && effectiveSpeed > 0.01) {
    const delta = effectiveSpeed * dt;
    if (props.direction === 'left') {
      offset -= delta;
      if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
    } else {
      offset += delta;
      if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
    }

    if (trackRef.value) {
      trackRef.value.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
    }
  }

  rafId = requestAnimationFrame(tick);
}

onMounted(() => {
  checkDark();
  mutationObserver = new MutationObserver(checkDark);
  mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

  if (contentRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        contentWidth = entry.contentRect.width;
        if (props.direction === 'right' && offset === -1000) {
          offset = -(contentWidth + parsedGapPx.value);
        }
      }
    });
    resizeObserver.observe(contentRef.value);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rafId = requestAnimationFrame(tick);
  }
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
});

const onMouseEnter = () => { if (props.pauseOnHover) targetFactor = 0.0; };
const onMouseLeave = () => { if (props.pauseOnHover) targetFactor = 1.0; };
</script>

<template>
  <div
    ref="containerRef"
    :class="['exhuma-marquee-root relative w-full overflow-hidden select-none py-4', props.class]"
    :style="maskStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      v-if="useColorOverlay"
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-0 z-10"
      :style="{
        width: \`\${props.fadeWidth}px\`,
        background: \`linear-gradient(to right, \${resolvedColor}, transparent)\`,
      }"
    />
    <div
      v-if="useColorOverlay"
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 right-0 z-10"
      :style="{
        width: \`\${props.fadeWidth}px\`,
        background: \`linear-gradient(to left, \${resolvedColor}, transparent)\`,
      }"
    />
    <div
      ref="trackRef"
      class="exhuma-marquee-track flex w-max will-change-transform"
      :style="{ columnGap: gapVal }"
    >
      <div ref="contentRef" class="exhuma-marquee-content flex shrink-0 items-center" :style="{ columnGap: gapVal }">
        <slot />
      </div>
      <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" :style="{ columnGap: gapVal }">
        <slot />
      </div>
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
					filename: 'InfiniteMarquee.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Infinite Marquee component using Runes ($state, $effect, $derived).',
					code: `<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    speed?: number;
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
    gap?: string | number;
    showFadeEdges?: boolean;
    fadeWidth?: number;
    fadeEdgeColor?: string;
    fadeEdgeColorDark?: string;
  scrollCoupling?: boolean;
  directionHysteresis?: boolean;
    class?: string;
  }

  let {
    children,
    speed = ${speed},
    direction = '${direction}',
    pauseOnHover = ${pauseOnHover},
    gap = ${gap},
    showFadeEdges = ${showFadeEdges},
    fadeWidth = ${fadeWidth},
    fadeEdgeColor = '${fadeEdgeColor}',
    fadeEdgeColorDark = '${fadeEdgeColorDark}',
    class: className = '',
  }: Props = $props();

  let trackEl = $state<HTMLDivElement | null>(null);
  let contentEl = $state<HTMLDivElement | null>(null);
  let isDark = $state(false);

  let offset = direction === 'right' ? -1000 : 0;
  let kineticFactor = 1.0;
  let targetFactor = 1.0;
  let lastTime: number | null = null;
  let contentWidth = 0;
  let rafId: number | null = null;

  const gapPx = $derived(typeof gap === 'number' ? gap : parseFloat(String(gap)) || 24);
  const gapVal = $derived(typeof gap === 'number' ? \`\${gap}px\` : String(gap));
  const resolvedColor = $derived(isDark && fadeEdgeColorDark ? fadeEdgeColorDark : fadeEdgeColor);
  const useColorOverlay = $derived(showFadeEdges && Boolean(resolvedColor && resolvedColor.trim() !== ''));

  function checkDark() {
    if (typeof document === 'undefined') return;
    const hasDark = document.documentElement.classList.contains('dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = hasDark || (!document.documentElement.classList.contains('light') && prefersDark);
  }

  $effect(() => {
    checkDark();
    const obs = new MutationObserver(checkDark);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => obs.disconnect();
  });

  $effect(() => {
    if (!contentEl) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        contentWidth = entry.contentRect.width;
        if (direction === 'right' && offset === -1000) {
          offset = -(contentWidth + gapPx);
        }
      }
    });
    observer.observe(contentEl);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    function tick(now: number) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      kineticFactor = targetFactor + (kineticFactor - targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = speed * kineticFactor;
      const repeatWavelength = contentWidth + gapPx;

      if (contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (direction === 'left') {
          offset -= delta;
          if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
        } else {
          offset += delta;
          if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
        }

        if (trackEl) {
          trackEl.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<div
  role="region"
  aria-label="Continuous kinetic marquee"
  class="exhuma-marquee-root relative w-full overflow-hidden select-none py-4 {className}"
  style={showFadeEdges && !useColorOverlay
    ? \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
    : ''}
  onmouseenter={() => { if (pauseOnHover) targetFactor = 0.0; }}
  onmouseleave={() => { if (pauseOnHover) targetFactor = 1.0; }}
>
  {#if useColorOverlay}
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-0 z-10"
      style="width: {fadeWidth}px; background: linear-gradient(to right, {resolvedColor}, transparent);"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 right-0 z-10"
      style="width: {fadeWidth}px; background: linear-gradient(to left, {resolvedColor}, transparent);"
    ></div>
  {/if}

  <div
    bind:this={trackEl}
    class="exhuma-marquee-track flex w-max will-change-transform"
    style="column-gap: {gapVal};"
  >
    <div bind:this={contentEl} class="exhuma-marquee-content flex shrink-0 items-center" style="column-gap: {gapVal};">
      {@render children?.()}
    </div>
    <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style="column-gap: {gapVal};">
      {@render children?.()}
    </div>
  </div>
</div>
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'infinite-marquee.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Infinite Marquee component with Signals and rAF loop.',
					code: `import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-infinite-marquee',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div
      #containerRef
      class="exhuma-marquee-root relative w-full overflow-hidden select-none py-4"
      [ngClass]="class"
      [ngStyle]="maskStyles()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
    >
      @if (useColorOverlay()) {
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 left-0 z-10"
          [style.width.px]="fadeWidth"
          [style.background]="'linear-gradient(to right, ' + resolvedColor() + ', transparent)'"
        ></div>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 right-0 z-10"
          [style.width.px]="fadeWidth"
          [style.background]="'linear-gradient(to left, ' + resolvedColor() + ', transparent)'"
        ></div>
      }

      <div
        #trackRef
        class="exhuma-marquee-track flex w-max will-change-transform"
        [style.columnGap]="gapVal()"
      >
        <div #contentRef class="exhuma-marquee-content flex shrink-0 items-center" [style.columnGap]="gapVal()">
          <ng-content></ng-content>
        </div>
        <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" [style.columnGap]="gapVal()">
          <ng-content select="[clone]"></ng-content>
        </div>
      </div>
    </div>
  \`,
})
export class ExhumaInfiniteMarqueeComponent implements AfterViewInit, OnDestroy {
  @Input() speed = ${speed};
  @Input() direction: 'left' | 'right' = '${direction}';
  @Input() pauseOnHover = ${pauseOnHover};
  @Input() gap: string | number = ${gap};
  @Input() showFadeEdges = ${showFadeEdges};
  @Input() fadeWidth = ${fadeWidth};
  @Input() fadeEdgeColor = '${fadeEdgeColor}';
  @Input() fadeEdgeColorDark = '${fadeEdgeColorDark}';
  @Input() class = '';

  @ViewChild('trackRef') trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  readonly isDark = signal(false);

  readonly gapVal = computed(() => (typeof this.gap === 'number' ? \`\${this.gap}px\` : String(this.gap)));
  readonly resolvedColor = computed(() =>
    this.isDark() && this.fadeEdgeColorDark ? this.fadeEdgeColorDark : this.fadeEdgeColor
  );
  readonly useColorOverlay = computed(
    () => this.showFadeEdges && Boolean(this.resolvedColor() && this.resolvedColor().trim() !== '')
  );

  readonly maskStyles = computed(() => {
    if (!this.showFadeEdges || this.useColorOverlay()) return {};
    const grad = \`linear-gradient(to right, transparent, black \${this.fadeWidth}px, black calc(100% - \${this.fadeWidth}px), transparent)\`;
    return {
      '-webkit-mask-image': grad,
      'mask-image': grad,
    };
  });

  private offset = 0;
  private kineticFactor = 1.0;
  private targetFactor = 1.0;
  private lastTime: number | null = null;
  private contentWidth = 0;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.checkDark();
      this.mutationObserver = new MutationObserver(() => this.checkDark());
      this.mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    if (this.contentRef?.nativeElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.contentWidth = entry.contentRect.width;
        }
      });
      this.resizeObserver.observe(this.contentRef.nativeElement);
    }

    this.startLoop();
  }

  private checkDark(): void {
    const hasDark = document.documentElement.classList.contains('dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark.set(hasDark || (!document.documentElement.classList.contains('light') && prefersDark));
  }

  private startLoop(): void {
    const tick = (now: number) => {
      if (this.lastTime === null) this.lastTime = now;
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.kineticFactor = this.targetFactor + (this.kineticFactor - this.targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = this.speed * this.kineticFactor;
      const gapNum = typeof this.gap === 'number' ? this.gap : parseFloat(String(this.gap)) || 24;
      const repeatWavelength = this.contentWidth + gapNum;

      if (this.contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (this.direction === 'left') {
          this.offset -= delta;
          if (this.offset <= -repeatWavelength) this.offset = this.offset % repeatWavelength;
        } else {
          this.offset += delta;
          if (this.offset >= 0) this.offset = (this.offset % repeatWavelength) - repeatWavelength;
        }

        if (this.trackRef?.nativeElement) {
          this.trackRef.nativeElement.style.transform = \`translate3d(\${this.offset.toFixed(2)}px, 0, 0)\`;
        }
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  onMouseEnter(): void {
    if (this.pauseOnHover) this.targetFactor = 0.0;
  }

  onMouseLeave(): void {
    if (this.pauseOnHover) this.targetFactor = 1.0;
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mutationObserver) this.mutationObserver.disconnect();
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'InfiniteMarquee.tsx',
					language: 'tsx',
					description: 'SolidJS Native Infinite Marquee fine-grained reactive component.',
					code: `import { createSignal, createMemo, onMount, onCleanup, type ParentComponent } from 'solid-js';

export interface InfiniteMarqueeProps {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string | number;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  scrollCoupling?: boolean;
  directionHysteresis?: boolean;
  class?: string;
}

export const InfiniteMarquee: ParentComponent<InfiniteMarqueeProps> = (props) => {
  let trackRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const [isDark, setIsDark] = createSignal(false);
  const speed = () => props.speed ?? ${speed};
  const direction = () => props.direction ?? '${direction}';
  const pauseOnHover = () => props.pauseOnHover !== false;
  const gap = () => props.gap ?? ${gap};
  const showFadeEdges = () => props.showFadeEdges !== false;
  const fadeWidth = () => props.fadeWidth ?? ${fadeWidth};
  const fadeEdgeColor = () => props.fadeEdgeColor ?? '${fadeEdgeColor}';
  const fadeEdgeColorDark = () => props.fadeEdgeColorDark ?? '${fadeEdgeColorDark}';

  const gapVal = createMemo(() => (typeof gap() === 'number' ? \`\${gap()}px\` : String(gap())));
  const resolvedColor = createMemo(() => (isDark() && fadeEdgeColorDark() ? fadeEdgeColorDark() : fadeEdgeColor()));
  const useColorOverlay = createMemo(() => showFadeEdges() && Boolean(resolvedColor() && resolvedColor().trim() !== ''));

  let offset = direction() === 'right' ? -1000 : 0;
  let kineticFactor = 1.0;
  let targetFactor = 1.0;
  let lastTime: number | null = null;
  let contentWidth = 0;
  let rafId: number | null = null;

  onMount(() => {
    const checkDark = () => {
      const hasDark = document.documentElement.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(hasDark || (!document.documentElement.classList.contains('light') && prefersDark));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    if (contentRef) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) contentWidth = entry.contentRect.width;
      });
      ro.observe(contentRef);
      onCleanup(() => ro.disconnect());
    }

    function tick(now: number) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      kineticFactor = targetFactor + (kineticFactor - targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = speed() * kineticFactor;
      const gapPx = typeof gap() === 'number' ? Number(gap()) : parseFloat(String(gap())) || 24;
      const repeatWavelength = contentWidth + gapPx;

      if (contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (direction() === 'left') {
          offset -= delta;
          if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
        } else {
          offset += delta;
          if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
        }

        if (trackRef) {
          trackRef.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    onCleanup(() => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    });
  });

  return (
    <div
      class={\`exhuma-marquee-root relative w-full overflow-hidden select-none py-4 \${props.class ?? ''}\`}
      onMouseEnter={() => { if (pauseOnHover()) targetFactor = 0.0; }}
      onMouseLeave={() => { if (pauseOnHover()) targetFactor = 1.0; }}
    >
      {useColorOverlay() && (
        <>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 left-0 z-10"
            style={{ width: \`\${fadeWidth()}px\`, background: \`linear-gradient(to right, \${resolvedColor()}, transparent)\` }}
          />
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 right-0 z-10"
            style={{ width: \`\${fadeWidth()}px\`, background: \`linear-gradient(to left, \${resolvedColor()}, transparent)\` }}
          />
        </>
      )}
      <div ref={trackRef} class="exhuma-marquee-track flex w-max will-change-transform" style={{ 'column-gap': gapVal() }}>
        <div ref={contentRef} class="exhuma-marquee-content flex shrink-0 items-center" style={{ 'column-gap': gapVal() }}>
          {props.children}
        </div>
        <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style={{ 'column-gap': gapVal() }}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'InfiniteMarquee.astro',
					language: 'astro',
					description: 'Astro Native Infinite Marquee component with client hydration.',
					code: `---
interface Props {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string | number;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  scrollCoupling?: boolean;
  directionHysteresis?: boolean;
  class?: string;
}

const {
  speed = ${speed},
  direction = '${direction}',
  pauseOnHover = ${pauseOnHover},
  gap = ${gap},
  showFadeEdges = ${showFadeEdges},
  fadeWidth = ${fadeWidth},
  fadeEdgeColor = '${fadeEdgeColor}',
  fadeEdgeColorDark = '${fadeEdgeColorDark}',
  class: className = '',
} = Astro.props;

const gapVal = typeof gap === 'number' ? \`\${gap}px\` : String(gap);
---

<div
  class:list={['exhuma-marquee-root relative w-full overflow-hidden select-none py-4', className]}
  data-exhuma-marquee
  data-speed={speed}
  data-direction={direction}
  data-pause-on-hover={pauseOnHover}
  data-gap={gap}
  data-show-fade-edges={showFadeEdges}
  data-fade-width={fadeWidth}
  data-fade-color={fadeEdgeColor}
  data-fade-color-dark={fadeEdgeColorDark}
>
  <div class="exhuma-marquee-track flex w-max will-change-transform" style={{ columnGap: gapVal }}>
    <div class="exhuma-marquee-content flex shrink-0 items-center" style={{ columnGap: gapVal }}>
      <slot />
    </div>
    <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style={{ columnGap: gapVal }}>
      <slot />
    </div>
  </div>
</div>

<script>
  document.querySelectorAll<HTMLElement>('[data-exhuma-marquee]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('.exhuma-marquee-track');
    const content = root.querySelector<HTMLElement>('.exhuma-marquee-content');
    if (!track || !content) return;

    const speed = parseFloat(root.dataset.speed || '40');
    const direction = root.dataset.direction || 'left';
    const pauseOnHover = root.dataset.pauseOnHover !== 'false';
    const gap = parseFloat(root.dataset.gap || '24') || 24;

    let offset = direction === 'right' ? -1000 : 0;
    let targetFactor = 1.0;
    let kineticFactor = 1.0;
    let lastTime: number | null = null;
    let contentWidth = content.scrollWidth;

    new ResizeObserver((entries) => {
      for (const entry of entries) contentWidth = entry.contentRect.width;
    }).observe(content);

    if (pauseOnHover) {
      root.addEventListener('mouseenter', () => (targetFactor = 0.0));
      root.addEventListener('mouseleave', () => (targetFactor = 1.0));
    }

    function tick(now: number) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      kineticFactor = targetFactor + (kineticFactor - targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = speed * kineticFactor;
      const repeatWavelength = contentWidth + gap;

      if (contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (direction === 'left') {
          offset -= delta;
          if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
        } else {
          offset += delta;
          if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
        }
        track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'infinite-marquee.blade.php',
					language: 'php',
					description: 'Laravel Blade Infinite Marquee component with kinetic script.',
					code: `@props([
    'speed' => ${speed},
    'direction' => '${direction}',
    'pauseOnHover' => ${pauseOnHover ? 'true' : 'false'},
    'gap' => ${gap},
    'showFadeEdges' => ${showFadeEdges ? 'true' : 'false'},
    'fadeWidth' => ${fadeWidth},
    'fadeEdgeColor' => '${fadeEdgeColor}',
    'fadeEdgeColorDark' => '${fadeEdgeColorDark}',
])

<div
  {{ $attributes->merge(['class' => 'exhuma-marquee-root relative w-full overflow-hidden select-none py-4']) }}
  data-exhuma-marquee
  data-speed="{{ $speed }}"
  data-direction="{{ $direction }}"
  data-pause-on-hover="{{ $pauseOnHover ? 'true' : 'false' }}"
  data-gap="{{ $gap }}"
  data-show-fade-edges="{{ $showFadeEdges ? 'true' : 'false' }}"
  data-fade-width="{{ $fadeWidth }}"
  data-fade-color="{{ $fadeEdgeColor }}"
  data-fade-color-dark="{{ $fadeEdgeColorDark }}"
>
  <div class="exhuma-marquee-track flex w-max will-change-transform" style="column-gap: {{ is_numeric($gap) ? $gap . 'px' : $gap }};">
    <div class="exhuma-marquee-content flex shrink-0 items-center" style="column-gap: {{ is_numeric($gap) ? $gap . 'px' : $gap }};">
      {{ $slot }}
    </div>
    <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style="column-gap: {{ is_numeric($gap) ? $gap . 'px' : $gap }};">
      {{ $slot }}
    </div>
  </div>
</div>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'infinite-marquee.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS Zero-Dependency Infinite Marquee translation loop driver.',
					code: `/**
 * Initializes continuous kinetic translation for all matching marquee containers.
 */
export function initInfiniteMarquee(selector = '[data-exhuma-marquee]', options = {}) {
  const containers = document.querySelectorAll(selector);

  containers.forEach((root) => {
    const track = root.querySelector('.exhuma-marquee-track');
    const content = root.querySelector('.exhuma-marquee-content');
    if (!track || !content) return;

    const speed = Number(options.speed ?? root.getAttribute('data-speed') ?? ${speed});
    const direction = options.direction ?? root.getAttribute('data-direction') ?? '${direction}';
    const pauseOnHover = options.pauseOnHover ?? root.getAttribute('data-pause-on-hover') !== 'false';
    const gap = parseFloat(options.gap ?? root.getAttribute('data-gap') ?? '${gap}') || 24;

    let offset = direction === 'right' ? -1000 : 0;
    let targetFactor = 1.0;
    let kineticFactor = 1.0;
    let lastTime = null;
    let contentWidth = content.scrollWidth;

    new ResizeObserver((entries) => {
      for (const entry of entries) contentWidth = entry.contentRect.width;
    }).observe(content);

    if (pauseOnHover) {
      root.addEventListener('mouseenter', () => (targetFactor = 0.0));
      root.addEventListener('mouseleave', () => (targetFactor = 1.0));
    }

    function tick(now) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      kineticFactor = targetFactor + (kineticFactor - targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = speed * kineticFactor;
      const repeatWavelength = contentWidth + gap;

      if (contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (direction === 'left') {
          offset -= delta;
          if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
        } else {
          offset += delta;
          if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
        }
        track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Gutenberg block metadata for Infinite Marquee.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/infinite-marquee',
							version: '1.0.0',
							title: 'Infinite Marquee',
							category: 'layout',
							icon: 'leftright',
							description: 'High-performance kinetic continuous translation loop.',
							attributes: {
								speed: { type: 'number', default: speed },
								direction: { type: 'string', default: direction },
								pauseOnHover: { type: 'boolean', default: pauseOnHover },
								gap: { type: 'number', default: gap },
								showFadeEdges: { type: 'boolean', default: showFadeEdges },
								fadeWidth: { type: 'number', default: fadeWidth },
								fadeEdgeColor: { type: 'string', default: fadeEdgeColor },
								fadeEdgeColorDark: { type: 'string', default: fadeEdgeColorDark },
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
					description: 'WordPress Gutenberg block render template for Infinite Marquee.',
					code: `<?php
/**
 * Infinite Marquee Block Render Template
 */
$speed = $attributes['speed'] ?? ${speed};
$direction = $attributes['direction'] ?? '${direction}';
$gap = $attributes['gap'] ?? ${gap};
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-marquee-root relative w-full overflow-hidden select-none py-4',
    'data-exhuma-marquee' => '',
    'data-speed' => esc_attr($speed),
    'data-direction' => esc_attr($direction),
    'data-gap' => esc_attr($gap),
]);
?>
<div <?php echo $wrapper_attributes; ?>>
  <div class="exhuma-marquee-track flex w-max will-change-transform" style="column-gap: <?php echo esc_attr($gap); ?>px;">
    <div class="exhuma-marquee-content flex shrink-0 items-center" style="column-gap: <?php echo esc_attr($gap); ?>px;">
      <?php echo $content; ?>
    </div>
    <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style="column-gap: <?php echo esc_attr($gap); ?>px;">
      <?php echo $content; ?>
    </div>
  </div>
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-infinite-marquee.js',
					language: 'javascript',
					description: 'Universal Custom Element <exhuma-infinite-marquee>.',
					code: `export class ExhumaInfiniteMarqueeElement extends HTMLElement {
  connectedCallback() {
    const speed = parseFloat(this.getAttribute('speed') || '${speed}');
    const direction = this.getAttribute('direction') || '${direction}';
    const pauseOnHover = this.getAttribute('pause-on-hover') !== 'false';
    const gap = parseFloat(this.getAttribute('gap') || '${gap}') || 24;

    this.classList.add('exhuma-marquee-root', 'relative', 'w-full', 'overflow-hidden', 'select-none', 'py-4', 'block');

    const inner = this.innerHTML;
    this.innerHTML = \`
      <div class="exhuma-marquee-track flex w-max will-change-transform" style="column-gap: \${gap}px;">
        <div class="exhuma-marquee-content flex shrink-0 items-center" style="column-gap: \${gap}px;">\${inner}</div>
        <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style="column-gap: \${gap}px;">\${inner}</div>
      </div>
    \`;

    const track = this.querySelector('.exhuma-marquee-track');
    const content = this.querySelector('.exhuma-marquee-content');
    if (!track || !content) return;

    let offset = direction === 'right' ? -1000 : 0;
    let targetFactor = 1.0;
    let kineticFactor = 1.0;
    let lastTime = null;
    let contentWidth = content.scrollWidth;

    new ResizeObserver((entries) => {
      for (const entry of entries) contentWidth = entry.contentRect.width;
    }).observe(content);

    if (pauseOnHover) {
      this.addEventListener('mouseenter', () => (targetFactor = 0.0));
      this.addEventListener('mouseleave', () => (targetFactor = 1.0));
    }

    const tick = (now) => {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      kineticFactor = targetFactor + (kineticFactor - targetFactor) * Math.exp(-12.0 * dt);
      const effectiveSpeed = speed * kineticFactor;
      const repeatWavelength = contentWidth + gap;

      if (contentWidth > 0 && effectiveSpeed > 0.01) {
        const delta = effectiveSpeed * dt;
        if (direction === 'left') {
          offset -= delta;
          if (offset <= -repeatWavelength) offset = offset % repeatWavelength;
        } else {
          offset += delta;
          if (offset >= 0) offset = (offset % repeatWavelength) - repeatWavelength;
        }
        track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
      }

      this._rafId = requestAnimationFrame(tick);
    };

    this._rafId = requestAnimationFrame(tick);
  }

  disconnectedCallback() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
}

if (!customElements.get('exhuma-infinite-marquee')) {
  customElements.define('exhuma-infinite-marquee', ExhumaInfiniteMarqueeElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'InfiniteMarquee.tsx',
					language: 'tsx',
					description: 'React Native Infinite Marquee translation loop.',
					code: `import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, type ViewProps } from 'react-native';

export interface InfiniteMarqueeProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  direction?: 'left' | 'right';
  gap?: number;
}

export function InfiniteMarquee({
  children,
  duration = 10000,
  direction = 'left',
  gap = ${gap},
  style,
  ...props
}: InfiniteMarqueeProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: direction === 'left' ? -1 : 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [duration, direction, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-400, 0, 400],
  });

  return (
    <View style={[styles.container, style]} {...props}>
      <Animated.View style={[styles.track, { columnGap: gap, transform: [{ translateX }] }]}>
        <View style={[styles.content, { columnGap: gap }]}>{children}</View>
        <View style={[styles.content, { columnGap: gap }]}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
    paddingVertical: 12,
  },
  track: {
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'infinite_marquee.dart',
					language: 'dart',
					description: 'Flutter Native continuous translation Infinite Marquee widget.',
					code: `import 'package:flutter/material.dart';

class ExhumaInfiniteMarquee extends StatefulWidget {
  final Widget child;
  final double speed;
  final double gap;

  const ExhumaInfiniteMarquee({
    super.key,
    required this.child,
    this.speed = ${speed}.0,
    this.gap = ${gap}.0,
  });

  @override
  State<ExhumaInfiniteMarquee> createState() => _ExhumaInfiniteMarqueeState();
}

class _ExhumaInfiniteMarqueeState extends State<ExhumaInfiniteMarquee>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const NeverScrollableScrollPhysics(),
            child: Row(
              children: [
                widget.child,
                SizedBox(width: widget.gap),
                widget.child,
              ],
            ),
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

		default:
			return null;
	}
}

export function getInfiniteMarqueeUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const speed = Number(props.speed ?? 40);
	const direction = (props.direction as string) ?? 'left';
	const pauseOnHover = props.pauseOnHover !== false;
	const gap = typeof props.gap === 'number' ? props.gap : 24;
	const showFadeEdges = props.showFadeEdges !== false;
	const fadeWidth = Number(props.fadeWidth ?? 48);
	const fadeEdgeColor = String(props.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(props.fadeEdgeColorDark || '#09090b');
	const scrollCoupling = props.scrollCoupling === true;
	const directionHysteresis = props.directionHysteresis === true;

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 (App Router) continuous translation marquee header.',
				code: `'use client';

import React from 'react';
import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee';

const TECH_STACK = [
  { label: '120Hz ProMotion', tag: 'Kinetic', status: 'Active' },
  { label: 'Sub-pixel Translation', tag: 'Hardware', status: 'GPU' },
  { label: 'Modulo Wrap Seam', tag: 'Math', status: 'Ω(1)' },
  { label: 'Zero Runtime Deps', tag: 'Pure', status: 'Locked' },
  { label: '13 Target Ecosystems', tag: 'Universal', status: '13/13' },
];

export default function MarqueeDemoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
        <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">Continuous Translation</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Hardware-Accelerated Marquee</h1>
      </div>

      <InfiniteMarquee
        speed={${speed}}
        direction="${direction}"
        pauseOnHover={${pauseOnHover}}
        gap={${gap}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
      >
        {TECH_STACK.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-5 py-3 text-xs font-semibold shadow-xs backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <span className="h-2 w-2 rounded-full bg-primary ring-2 ring-primary/20" />
            <span className="font-mono font-medium text-foreground">{item.label}</span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{item.tag}</span>
            <span className="font-mono text-[10px] font-bold text-primary">{item.status}</span>
          </div>
        ))}
      </InfiniteMarquee>
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
				description: 'Vite / React 18+ application demonstrating InfiniteMarquee.',
				code: `import React from 'react';
import { InfiniteMarquee } from './components/ui/InfiniteMarquee';

const TECH_STACK = [
  { label: '120Hz ProMotion', tag: 'Kinetic', status: 'Active' },
  { label: 'Sub-pixel Translation', tag: 'Hardware', status: 'GPU' },
  { label: 'Modulo Wrap Seam', tag: 'Math', status: 'Ω(1)' },
  { label: 'Zero Runtime Deps', tag: 'Pure', status: 'Locked' },
  { label: '13 Target Ecosystems', tag: 'Universal', status: '13/13' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
        <h1 className="text-3xl font-bold">Infinite Kinetic Rail</h1>
      </div>

      <InfiniteMarquee
        speed={${speed}}
        direction="${direction}"
        pauseOnHover={${pauseOnHover}}
        gap={${gap}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
      >
        {TECH_STACK.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-5 py-3 text-xs font-semibold shadow-xs"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-mono font-medium">{item.label}</span>
            <span className="text-muted-foreground font-mono text-[10px]">{item.tag}</span>
          </div>
        ))}
      </InfiniteMarquee>
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
				description: 'Vue 3 SFC using InfiniteMarquee component.',
				code: `<script setup lang="ts">
import InfiniteMarquee from '@/components/ui/InfiniteMarquee.vue';

const items = [
  { label: '120Hz ProMotion', tag: 'Kinetic' },
  { label: 'Sub-pixel Translation', tag: 'GPU' },
  { label: 'Modulo Wrap Seam', tag: 'Ω(1)' },
  { label: 'Zero Runtime Deps', tag: 'Pure' },
  { label: '13 Target Ecosystems', tag: 'Universal' },
];
</script>

<template>
  <main class="min-h-screen py-16 bg-background text-foreground">
    <div class="max-w-4xl mx-auto px-6 mb-8 text-center">
      <h1 class="text-3xl font-bold">Continuous Marquee</h1>
    </div>

    <InfiniteMarquee
      :speed="${speed}"
      direction="${direction}"
      :pause-on-hover="${pauseOnHover}"
      :gap="${gap}"
      :show-fade-edges="${showFadeEdges}"
      :fade-width="${fadeWidth}"
      fade-edge-color="${fadeEdgeColor}"
      fade-edge-color-dark="${fadeEdgeColorDark}"
    >
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-xs font-semibold shadow-xs"
      >
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span class="font-mono">{{ item.label }}</span>
        <span class="text-muted-foreground font-mono text-[10px]">{{ item.tag }}</span>
      </div>
    </InfiniteMarquee>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'App.svelte',
				language: 'svelte',
				description: 'Svelte 5 component with InfiniteMarquee.',
				code: `<script lang="ts">
  import InfiniteMarquee from '$lib/components/InfiniteMarquee.svelte';

  const items = [
    { label: '120Hz ProMotion', tag: 'Kinetic' },
    { label: 'Sub-pixel Translation', tag: 'GPU' },
    { label: 'Modulo Wrap Seam', tag: 'Ω(1)' },
    { label: 'Zero Runtime Deps', tag: 'Pure' },
    { label: '13 Target Ecosystems', tag: 'Universal' },
  ];
</script>

<main class="min-h-screen py-16 bg-background text-foreground">
  <InfiniteMarquee
    speed={${speed}}
    direction="${direction}"
    pauseOnHover={${pauseOnHover}}
    gap={${gap}}
    showFadeEdges={${showFadeEdges}}
    fadeWidth={${fadeWidth}}
    fadeEdgeColor="${fadeEdgeColor}"
    fadeEdgeColorDark="${fadeEdgeColorDark}"
  >
    {#each items as item}
      <div class="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-xs font-semibold shadow-xs">
        <span class="h-2 w-2 rounded-full bg-primary"></span>
        <span class="font-mono">{item.label}</span>
        <span class="text-muted-foreground font-mono text-[10px]">{item.tag}</span>
      </div>
    {/each}
  </InfiniteMarquee>
</main>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'infinite-marquee-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component with InfiniteMarquee.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaInfiniteMarqueeComponent } from './infinite-marquee.component';

@Component({
  selector: 'app-infinite-marquee-demo',
  standalone: true,
  imports: [CommonModule, ExhumaInfiniteMarqueeComponent],
  template: \`
    <div class="marquee-wrapper">
      <exhuma-infinite-marquee
        [speed]="${speed}"
        direction="${direction}"
        [pauseOnHover]="${pauseOnHover}"
        [gap]="${gap}"
        [showFadeEdges]="${showFadeEdges}"
        [fadeWidth]="${fadeWidth}"
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
      >
        <div *ngFor="let item of items" class="marquee-chip">
          <span class="dot"></span>
          <span class="label">{{ item.label }}</span>
          <span class="tag">{{ item.tag }}</span>
        </div>
      </exhuma-infinite-marquee>
    </div>
  \`,
  styles: [\`
    .marquee-wrapper { padding: 4rem 0; background: #0a0a0a; color: #fff; }
    .marquee-chip { display: flex; align-items: center; gap: 0.75rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; background: #141414; padding: 0.75rem 1.25rem; font-size: 0.75rem; }
    .dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: #10b981; }
    .label { font-family: monospace; font-weight: 500; }
    .tag { font-family: monospace; font-size: 0.625rem; color: #888; }
  \`],
})
export class AppInfiniteMarqueeDemoComponent {
  items = [
    { label: '120Hz ProMotion', tag: 'Kinetic' },
    { label: 'Sub-pixel Translation', tag: 'GPU' },
    { label: 'Modulo Wrap Seam', tag: 'Ω(1)' },
    { label: 'Zero Runtime Deps', tag: 'Pure' },
    { label: '13 Target Ecosystems', tag: 'Universal' },
  ];
}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'InfiniteMarqueeDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component using InfiniteMarquee.',
				code: `import { For } from 'solid-js';
import { InfiniteMarquee } from './InfiniteMarquee';

const items = [
  { label: '120Hz ProMotion', tag: 'Kinetic' },
  { label: 'Sub-pixel Translation', tag: 'GPU' },
  { label: 'Modulo Wrap Seam', tag: 'Ω(1)' },
  { label: 'Zero Runtime Deps', tag: 'Pure' },
  { label: '13 Target Ecosystems', tag: 'Universal' },
];

export default function InfiniteMarqueeDemo() {
  return (
    <div class="py-16 bg-background text-foreground">
      <InfiniteMarquee
        speed={${speed}}
        direction="${direction}"
        pauseOnHover={${pauseOnHover}}
        gap={${gap}}
        showFadeEdges={${showFadeEdges}}
        fadeWidth={${fadeWidth}}
        fadeEdgeColor="${fadeEdgeColor}"
        fadeEdgeColorDark="${fadeEdgeColorDark}"
      >
        <For each={items}>
          {(item) => (
            <div class="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-xs font-semibold shadow-xs">
              <span class="h-2 w-2 rounded-full bg-primary" />
              <span class="font-mono">{item.label}</span>
              <span class="text-muted-foreground font-mono text-[10px]">{item.tag}</span>
            </div>
          )}
        </For>
      </InfiniteMarquee>
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'InfiniteMarqueeDemo.astro',
				language: 'astro',
				description: 'Astro component using InfiniteMarquee.',
				code: `---
import InfiniteMarquee from '@/components/ui/InfiniteMarquee.astro';

const items = [
  { label: '120Hz ProMotion', tag: 'Kinetic' },
  { label: 'Sub-pixel Translation', tag: 'GPU' },
  { label: 'Modulo Wrap Seam', tag: 'Ω(1)' },
  { label: 'Zero Runtime Deps', tag: 'Pure' },
  { label: '13 Target Ecosystems', tag: 'Universal' },
];
---

<div class="py-16 bg-background text-foreground">
  <InfiniteMarquee
    speed={${speed}}
    direction="${direction}"
    pauseOnHover={${pauseOnHover}}
    gap={${gap}}
    showFadeEdges={${showFadeEdges}}
    fadeWidth={${fadeWidth}}
    fadeEdgeColor="${fadeEdgeColor}"
    fadeEdgeColorDark="${fadeEdgeColorDark}"
  >
    {items.map((item) => (
      <div class="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-xs font-semibold shadow-xs">
        <span class="h-2 w-2 rounded-full bg-primary" />
        <span class="font-mono">{item.label}</span>
        <span class="text-muted-foreground font-mono text-[10px]">{item.tag}</span>
      </div>
    ))}
  </InfiniteMarquee>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'marquee-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade view using InfiniteMarquee component.',
				code: `<div class="py-16 bg-neutral-950 text-white">
  <x-infinite-marquee
    :speed="${speed}"
    direction="${direction}"
    :pause-on-hover="${pauseOnHover ? 'true' : 'false'}"
    :gap="${gap}"
    :show-fade-edges="${showFadeEdges ? 'true' : 'false'}"
    :fade-width="${fadeWidth}"
    fade-edge-color="${fadeEdgeColor}"
    fade-edge-color-dark="${fadeEdgeColorDark}"
  >
    <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold">
      <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
      <span class="font-mono">120Hz ProMotion</span>
    </div>
    <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold">
      <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
      <span class="font-mono">Sub-pixel Translation</span>
    </div>
    <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold">
      <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
      <span class="font-mono">Modulo Wrap Seam</span>
    </div>
  </x-infinite-marquee>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'marquee.html',
				language: 'html',
				description: 'Vanilla HTML markup and JS driver for InfiniteMarquee.',
				code: `<!-- Infinite Marquee Container -->
<div
  class="exhuma-marquee-root relative w-full overflow-hidden select-none py-4"
  data-exhuma-marquee
  data-speed="${speed}"
  data-direction="${direction}"
  data-pause-on-hover="${pauseOnHover}"
  data-gap="${gap}"
>
  <div class="exhuma-marquee-track flex w-max will-change-transform" style="column-gap: ${gap}px;">
    <div class="exhuma-marquee-content flex shrink-0 items-center" style="column-gap: ${gap}px;">
      <div class="chip">120Hz ProMotion</div>
      <div class="chip">Sub-pixel Translation</div>
      <div class="chip">Modulo Wrap Seam</div>
    </div>
    <div aria-hidden="true" class="exhuma-marquee-clone flex shrink-0 items-center" style="column-gap: ${gap}px;">
      <div class="chip">120Hz ProMotion</div>
      <div class="chip">Sub-pixel Translation</div>
      <div class="chip">Modulo Wrap Seam</div>
    </div>
  </div>
</div>

<script type="module">
  import { initInfiniteMarquee } from './infinite-marquee.vanilla.js';
  initInfiniteMarquee();
</script>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'block-template.php',
				language: 'php',
				description: 'WordPress Gutenberg block template for InfiniteMarquee.',
				code: `<!-- wp:exhuma/infinite-marquee {"speed":${speed},"direction":"${direction}","gap":${gap},"showFadeEdges":${showFadeEdges}} -->
<div class="wp-block-exhuma-infinite-marquee" data-speed="${speed}" data-gap="${gap}">
  <div class="marquee-item">120Hz ProMotion</div>
  <div class="marquee-item">Sub-pixel Translation</div>
  <div class="marquee-item">Modulo Wrap Seam</div>
</div>
<!-- /wp:exhuma/infinite-marquee -->
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'marquee-component.html',
				language: 'html',
				description: 'Native Custom Element <exhuma-infinite-marquee> usage.',
				code: `<exhuma-infinite-marquee
  speed="${speed}"
  direction="${direction}"
  pause-on-hover="${pauseOnHover}"
  gap="${gap}"
>
  <div class="badge">120Hz ProMotion</div>
  <div class="badge">Sub-pixel Translation</div>
  <div class="badge">Modulo Wrap Seam</div>
</exhuma-infinite-marquee>

<script type="module" src="./exhuma-infinite-marquee.js"></script>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'MarqueeScreen.tsx',
				language: 'tsx',
				description: 'React Native screen using InfiniteMarquee.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfiniteMarquee } from './components/InfiniteMarquee';

export default function MarqueeScreen() {
  return (
    <View style={styles.screen}>
      <InfiniteMarquee duration={12000} direction="${direction}" gap={${gap}}>
        <View style={styles.badge}><Text style={styles.text}>120Hz ProMotion</Text></View>
        <View style={styles.badge}><Text style={styles.text}>Sub-pixel Translation</Text></View>
        <View style={styles.badge}><Text style={styles.text}>Modulo Wrap Seam</Text></View>
      </InfiniteMarquee>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', backgroundColor: '#000' },
  badge: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#1a1a1a', borderRadius: 16, marginRight: 16 },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'marquee_screen.dart',
				language: 'dart',
				description: 'Flutter widget usage with ExhumaInfiniteMarquee.',
				code: `import 'package:flutter/material.dart';
import 'package:my_app/widgets/infinite_marquee.dart';

class MarqueeScreen extends StatelessWidget {
  const MarqueeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: ExhumaInfiniteMarquee(
          speed: ${speed}.0,
          gap: ${gap}.0,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[900],
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Text(
              '120Hz ProMotion • Hardware Translation',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
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

		default:
			return {
				filename: 'InfiniteMarquee.tsx',
				language: 'tsx',
				description: 'InfiniteMarquee component usage.',
				code: `<InfiniteMarquee speed={${speed}} direction="${direction}" gap={${gap}}>...</InfiniteMarquee>`,
			};
	}
}
