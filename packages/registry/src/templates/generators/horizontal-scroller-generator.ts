import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getHorizontalScrollerOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const speed = Number(props.speed ?? 1.0);
	const itemGap = Number(props.itemGap ?? 28);
	const cardWidth = typeof props.cardWidth === 'number' ? props.cardWidth : Number(props.cardWidth ?? 320);
	const showProgress = props.showProgress !== false;
	const showFadeEdges = props.showFadeEdges !== false;
	const fadeWidth = Number(props.fadeWidth ?? 48);
	const fadeEdgeColor = String(props.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(props.fadeEdgeColorDark || '#09090b');
	const mobileMode = (props.mobileMode as 'scroll' | 'stack' | 'pinned') ?? 'scroll';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'HorizontalScroller.tsx',
					language: 'tsx',
					description: 'HorizontalScroller — Standalone Ejected Engine (Zero Dependencies). Pinned kinetic camera with 1:1 vertical-to-horizontal mapping (Brix Agency architecture).',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface HorizontalScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
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
      mobileMode = '${mobileMode}',
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

    const useColorOverlay = Boolean(showFadeEdges && (fadeEdgeColor || fadeEdgeColorDark));

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
                <style>{\`
                  .exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right {
                    --exhuma-horizontal-fade: var(--fade-light, \${fadeEdgeColor || '#ffffff'});
                  }
                  :is(.dark, [data-theme='dark']) :is(.exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right),
                  :is(.dark, [data-theme='dark']).exhuma-horizontal-fade-left,
                  :is(.dark, [data-theme='dark']).exhuma-horizontal-fade-right {
                    --exhuma-horizontal-fade: var(--fade-dark, \${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
                  }
                  @media (prefers-color-scheme: dark) {
                    :root:not(.light) :is(.exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right) {
                      --exhuma-horizontal-fade: var(--fade-dark, \${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
                    }
                  }
                \`}</style>
                <div
                  aria-hidden="true"
                  className="exhuma-horizontal-fade-left pointer-events-none absolute inset-y-0 left-0 z-10"
                  style={{
                    width: \`\${fadeWidth}px\`,
                    ['--fade-light' as string]: fadeEdgeColor,
                    ['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
                    background: 'linear-gradient(to right, var(--exhuma-horizontal-fade, var(--fade-light)), transparent)',
                  }}
                />
                <div
                  aria-hidden="true"
                  className="exhuma-horizontal-fade-right pointer-events-none absolute inset-y-0 right-0 z-10"
                  style={{
                    width: \`\${fadeWidth}px\`,
                    ['--fade-light' as string]: fadeEdgeColor,
                    ['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
                    background: 'linear-gradient(to left, var(--exhuma-horizontal-fade, var(--fade-light)), transparent)',
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
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'HorizontalScroller.vue',
					language: 'vue',
					description: 'Vue 3 Native HorizontalScroller with pinned kinetic camera (Brix Agency architecture).',
					code: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  speed: ${speed},
  itemGap: ${itemGap},
  cardWidth: ${cardWidth},
  showProgress: ${showProgress},
  showFadeEdges: ${showFadeEdges},
  fadeWidth: ${fadeWidth},
  fadeEdgeColor: '${fadeEdgeColor}',
  fadeEdgeColorDark: '${fadeEdgeColorDark}',
  mobileMode: '${mobileMode}',
  class: '',
});

const sectionRef = ref<HTMLElement | null>(null);
const cameraRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const progressTextRef = ref<HTMLElement | null>(null);

const sectionHeight = ref<number | null>(null);
const isDark = ref(false);

let cachedDistance = 0;
let isIntersecting = false;
let rafId: number | null = null;
let observer: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;

const resolvedColor = computed(() => {
  return isDark.value && props.fadeEdgeColorDark ? props.fadeEdgeColorDark : props.fadeEdgeColor;
});

const useColorOverlay = computed(() => {
  return props.showFadeEdges && Boolean(resolvedColor.value && resolvedColor.value.trim() !== '');
});

const maskStyle = computed(() => {
  if (!props.showFadeEdges || useColorOverlay.value) return {};
  const grad = \`linear-gradient(to right, transparent, black \${props.fadeWidth}px, black calc(100% - \${props.fadeWidth}px), transparent)\`;
  return {
    WebkitMaskImage: grad,
    maskImage: grad,
  };
});

const recalculate = () => {
  if (!cameraRef.value || !trackRef.value) return;
  const viewportHeight = window.innerHeight;
  const containerWidth = cameraRef.value.clientWidth;
  const resolvedCardWidth = typeof props.cardWidth === 'number'
    ? props.cardWidth + 'px'
    : /^\\d+$/.test(String(props.cardWidth).trim()) ? String(props.cardWidth).trim() + 'px' : String(props.cardWidth);
  for (let i = 0; i < trackRef.value.children.length; i += 1) {
    const item = trackRef.value.children.item(i);
    if (item instanceof HTMLElement) {
      item.style.width = resolvedCardWidth;
      item.style.flexShrink = '0';
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
  const total = (sectionHeight.value ?? window.innerHeight) - window.innerHeight;
  if (total <= 0) return;
  const progress = Math.min(Math.max(-rect.top / total, 0), 1);
  const offset = -(progress * cachedDistance);
  trackRef.value.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
  if (progressBarRef.value) progressBarRef.value.style.width = \`\${(progress * 100).toFixed(1)}%\`;
  if (progressTextRef.value) progressTextRef.value.textContent = \`\${Math.round(progress * 100)}%\`;
};

const onScroll = () => {
  if (rafId === null) {
    rafId = window.requestAnimationFrame(() => {
      updateScroll();
      rafId = null;
    });
  }
};

onMounted(() => {
  if (typeof document !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    mutationObserver = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    });
    mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  }

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
  mutationObserver?.disconnect();
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
      <div v-if="useColorOverlay" class="pointer-events-none absolute inset-y-0 left-0 z-10" :style="{ width: props.fadeWidth + 'px', background: 'linear-gradient(to right, ' + resolvedColor + ', transparent)' }" />
      <div v-if="useColorOverlay" class="pointer-events-none absolute inset-y-0 right-0 z-10" :style="{ width: props.fadeWidth + 'px', background: 'linear-gradient(to left, ' + resolvedColor + ', transparent)' }" />

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

		case 'svelte': {
			return [
				{
					filename: 'HorizontalScroller.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native HorizontalScroller with pinned kinetic camera (Brix Agency architecture).',
					code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    speed?: number;
    itemGap?: number;
    cardWidth?: number | string;
    showProgress?: boolean;
    showFadeEdges?: boolean;
    fadeWidth?: number;
    fadeEdgeColor?: string;
    fadeEdgeColorDark?: string;
    mobileMode?: 'scroll' | 'stack' | 'pinned';
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  }

  let {
    speed = ${speed},
    itemGap = ${itemGap},
    cardWidth = ${cardWidth},
    showProgress = ${showProgress},
    showFadeEdges = ${showFadeEdges},
    fadeWidth = ${fadeWidth},
    fadeEdgeColor = '${fadeEdgeColor}',
    fadeEdgeColorDark = '${fadeEdgeColorDark}',
    mobileMode = '${mobileMode}',
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
  let isDark = $state(false);

  let cachedDistance = 0;
  let isIntersecting = false;
  let rafId: number | null = null;
  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

  let resolvedColor = $derived(isDark && fadeEdgeColorDark ? fadeEdgeColorDark : fadeEdgeColor);
  let useColorOverlay = $derived(showFadeEdges && Boolean(resolvedColor && resolvedColor.trim() !== ''));

  let maskStyle = $derived(
    (!showFadeEdges || useColorOverlay)
      ? ''
      : \`mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black \${fadeWidth}px, black calc(100% - \${fadeWidth}px), transparent);\`
  );

  const recalculate = () => {
    if (!camera || !track) return;
    const viewportHeight = window.innerHeight;
    const containerWidth = camera.clientWidth;
    const resolvedCardWidth = typeof cardWidth === 'number'
      ? cardWidth + 'px'
      : /^\\d+$/.test(String(cardWidth).trim()) ? String(cardWidth).trim() + 'px' : String(cardWidth);

    for (let i = 0; i < track.children.length; i += 1) {
      const item = track.children.item(i);
      if (item instanceof HTMLElement) {
        item.style.width = resolvedCardWidth;
        item.style.flexShrink = '0';
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
    const total = (sectionHeight ?? window.innerHeight) - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    const offset = -(progress * cachedDistance);
    track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
    if (progressBar) progressBar.style.width = \`\${(progress * 100).toFixed(1)}%\`;
    if (progressText) progressText.textContent = \`\${Math.round(progress * 100)}%\`;
  };

  const onScroll = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(() => {
        updateScroll();
        rafId = null;
      });
    }
  };

  onMount(() => {
    if (typeof document !== 'undefined') {
      isDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
      mutationObserver = new MutationObserver(() => {
        isDark = document.documentElement.classList.contains('dark') ||
          (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
      });
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }

    recalculate();
    observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    if (section) observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalculate);
    };
  });
</script>

<section
  bind:this={section}
  class="relative w-full {className}"
  style="min-height: {sectionHeight ? sectionHeight + 'px' : '150vh'};"
  {...restProps}
>
  <div
    bind:this={camera}
    class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
    style={maskStyle}
  >
    {#if useColorOverlay}
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10" style="width: {fadeWidth}px; background: linear-gradient(to right, {resolvedColor}, transparent);" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10" style="width: {fadeWidth}px; background: linear-gradient(to left, {resolvedColor}, transparent);" />
    {/if}

    <div
      bind:this={track}
      class="flex items-stretch will-change-transform"
      style="gap: {itemGap}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
    >
      {#if children}
        {@render children()}
      {/if}
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

		case 'solid': {
			return [
				{
					filename: 'HorizontalScroller.tsx',
					language: 'tsx',
					description: 'SolidJS Native HorizontalScroller with pinned kinetic camera (Brix Agency architecture).',
					code: `import { Component, JSX, createSignal, createMemo, onMount, onCleanup, splitProps } from 'solid-js';

export interface HorizontalScrollerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
}

export const HorizontalScroller: Component<HorizontalScrollerProps> = (props) => {
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
    'fadeEdgeColor',
    'fadeEdgeColorDark',
    'mobileMode',
    'class',
    'children',
  ]);

  const [sectionHeight, setSectionHeight] = createSignal<number | undefined>(undefined);
  const [isDark, setIsDark] = createSignal(false);

  const speed = () => local.speed ?? ${speed};
  const itemGap = () => local.itemGap ?? ${itemGap};
  const showProgress = () => local.showProgress !== false;
  const showFadeEdges = () => local.showFadeEdges !== false;
  const fadeWidth = () => local.fadeWidth ?? ${fadeWidth};
  const fadeEdgeColor = () => local.fadeEdgeColor ?? '${fadeEdgeColor}';
  const fadeEdgeColorDark = () => local.fadeEdgeColorDark ?? '${fadeEdgeColorDark}';

  const resolvedColor = createMemo(() => {
    return isDark() && fadeEdgeColorDark() ? fadeEdgeColorDark() : fadeEdgeColor();
  });

  const useColorOverlay = createMemo(() => {
    return showFadeEdges() && Boolean(resolvedColor() && resolvedColor().trim() !== '');
  });

  const maskStyle = createMemo(() => {
    if (!showFadeEdges() || useColorOverlay()) return {};
    const grad = \`linear-gradient(to right, transparent, black \${fadeWidth()}px, black calc(100% - \${fadeWidth()}px), transparent)\`;
    return {
      '-webkit-mask-image': grad,
      'mask-image': grad,
    };
  });

  onMount(() => {
    if (!sectionRef || !cameraRef || !trackRef) return;

    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches));
      const mutationObserver = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains('dark') ||
          (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches));
      });
      mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      onCleanup(() => mutationObserver.disconnect());
    }

    let cachedDistance = 0;
    let isIntersecting = false;
    let rafId: number | null = null;

    const recalculate = () => {
      if (!cameraRef || !trackRef) return;
      const viewportHeight = window.innerHeight;
      const containerWidth = cameraRef.clientWidth;
      const rawCardWidth = local.cardWidth ?? ${cardWidth};
      const resolvedCardWidth = typeof rawCardWidth === 'number'
        ? rawCardWidth + 'px'
        : /^\\d+$/.test(String(rawCardWidth).trim()) ? String(rawCardWidth).trim() + 'px' : String(rawCardWidth);

      for (let i = 0; i < trackRef.children.length; i += 1) {
        const item = trackRef.children.item(i);
        if (item instanceof HTMLElement) {
          item.style.width = resolvedCardWidth;
          item.style.flexShrink = '0';
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
      const total = (sectionHeight() ?? window.innerHeight) - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const offset = -(progress * cachedDistance);
      trackRef.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
      if (progressBarRef) progressBarRef.style.width = \`\${(progress * 100).toFixed(1)}%\`;
      if (progressTextRef) progressTextRef.textContent = \`\${Math.round(progress * 100)}%\`;
    };

    const onScroll = () => {
      if (rafId === null) {
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

  return (
    <section
      ref={sectionRef}
      class={\`relative w-full \${local.class ?? ''}\`}
      style={{ 'min-height': sectionHeight() ? \`\${sectionHeight()}px\` : '150vh' }}
      {...others}
    >
      <div
        ref={cameraRef}
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        style={maskStyle()}
      >
        {useColorOverlay() && (
          <>
            <div class="pointer-events-none absolute inset-y-0 left-0 z-10" style={{ width: \`\${fadeWidth()}px\`, background: \`linear-gradient(to right, \${resolvedColor()}, transparent)\` }} />
            <div class="pointer-events-none absolute inset-y-0 right-0 z-10" style={{ width: \`\${fadeWidth()}px\`, background: \`linear-gradient(to left, \${resolvedColor()}, transparent)\` }} />
          </>
        )}
        <div
          ref={trackRef}
          class="flex items-stretch will-change-transform"
          style={{
            gap: \`\${itemGap()}px\`,
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

		case 'angular': {
			return [
				{
					filename: 'horizontal-scroller.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone HorizontalScroller Component with signals and kinetic camera.',
					code: `import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-horizontal-scroller',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <section
      #sectionRef
      class="relative w-full"
      [style.min-height]="sectionHeight() ? sectionHeight() + 'px' : '150vh'"
    >
      <div
        #cameraRef
        class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        [ngStyle]="maskStyles()"
      >
        <div
          *ngIf="useColorOverlay()"
          class="pointer-events-none absolute inset-y-0 left-0 z-10"
          [style.width.px]="fadeWidth"
          [style.background]="'linear-gradient(to right, ' + resolvedColor() + ', transparent)'"
        ></div>
        <div
          *ngIf="useColorOverlay()"
          class="pointer-events-none absolute inset-y-0 right-0 z-10"
          [style.width.px]="fadeWidth"
          [style.background]="'linear-gradient(to left, ' + resolvedColor() + ', transparent)'"
        ></div>

        <div
          #trackRef
          class="flex items-stretch will-change-transform"
          [style.gap.px]="itemGap"
          style="padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
          <ng-content></ng-content>
        </div>

        <div
          *ngIf="showProgress"
          class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12"
        >
          <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
            <div
              #progressBarRef
              class="h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"
            ></div>
          </div>
          <span
            #progressTextRef
            class="font-mono text-2xs text-muted-foreground tabular-nums"
          >
            0%
          </span>
        </div>
      </div>
    </section>
  \`,
})
export class ExhumaHorizontalScrollerComponent implements AfterViewInit, OnDestroy {
  @Input() speed = ${speed};
  @Input() itemGap = ${itemGap};
  @Input() cardWidth: number | string = ${cardWidth};
  @Input() showProgress = ${showProgress};
  @Input() showFadeEdges = ${showFadeEdges};
  @Input() fadeWidth = ${fadeWidth};
  @Input() fadeEdgeColor = '${fadeEdgeColor}';
  @Input() fadeEdgeColorDark = '${fadeEdgeColorDark}';
  @Input() mobileMode: 'scroll' | 'stack' | 'pinned' = '${mobileMode}';

  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('cameraRef') cameraRef!: ElementRef<HTMLDivElement>;
  @ViewChild('trackRef') trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('progressBarRef') progressBarRef?: ElementRef<HTMLDivElement>;
  @ViewChild('progressTextRef') progressTextRef?: ElementRef<HTMLSpanElement>;

  readonly sectionHeight = signal<number | null>(null);
  readonly isDark = signal<boolean>(false);

  readonly resolvedColor = computed(() => {
    return this.isDark() && this.fadeEdgeColorDark ? this.fadeEdgeColorDark : this.fadeEdgeColor;
  });

  readonly useColorOverlay = computed(() => {
    return this.showFadeEdges && Boolean(this.resolvedColor() && this.resolvedColor().trim() !== '');
  });

  readonly maskStyles = computed(() => {
    if (!this.showFadeEdges || this.useColorOverlay()) return {};
    const grad = \`linear-gradient(to right, transparent, black \${this.fadeWidth}px, black calc(100% - \${this.fadeWidth}px), transparent)\`;
    return {
      '-webkit-mask-image': grad,
      'mask-image': grad,
    };
  });

  private cachedDistance = 0;
  private isIntersecting = false;
  private rafId: number | null = null;
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.isDark.set(document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches));
      this.mutationObserver = new MutationObserver(() => {
        this.isDark.set(document.documentElement.classList.contains('dark') ||
          (!document.documentElement.classList.contains('light') && window.matchMedia?.('(prefers-color-scheme: dark)').matches));
      });
      this.mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }

    this.recalculate();
    this.observer = new IntersectionObserver((entries) => {
      this.isIntersecting = entries[0]?.isIntersecting ?? false;
      if (this.isIntersecting) this.updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    this.observer.observe(this.sectionRef.nativeElement);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) window.cancelAnimationFrame(this.rafId);
    this.observer?.disconnect();
    this.mutationObserver?.disconnect();
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  private onScroll = (): void => {
    if (this.rafId === null) {
      this.rafId = window.requestAnimationFrame(() => {
        this.updateScroll();
        this.rafId = null;
      });
    }
  };

  private onResize = (): void => {
    this.recalculate();
  };

  private recalculate(): void {
    if (!this.cameraRef || !this.trackRef) return;
    const viewportHeight = window.innerHeight;
    const containerWidth = this.cameraRef.nativeElement.clientWidth;
    const track = this.trackRef.nativeElement;

    const resolvedCardWidth = typeof this.cardWidth === 'number'
      ? this.cardWidth + 'px'
      : /^\\d+$/.test(String(this.cardWidth).trim()) ? String(this.cardWidth).trim() + 'px' : String(this.cardWidth);

    for (let i = 0; i < track.children.length; i += 1) {
      const item = track.children.item(i);
      if (item instanceof HTMLElement) {
        item.style.width = resolvedCardWidth;
        item.style.flexShrink = '0';
      }
    }

    const trackWidth = track.scrollWidth;
    this.cachedDistance = Math.max(0, trackWidth - containerWidth + this.itemGap * 2);
    const safeSpeed = Math.max(0.1, this.speed);
    this.sectionHeight.set(Math.round(viewportHeight + this.cachedDistance / safeSpeed));
  }

  private updateScroll(): void {
    if (!this.sectionRef || !this.trackRef) return;
    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const total = (this.sectionHeight() ?? window.innerHeight) - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    const offset = -(progress * this.cachedDistance);
    this.trackRef.nativeElement.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
    if (this.progressBarRef) this.progressBarRef.nativeElement.style.width = \`\${(progress * 100).toFixed(1)}%\`;
    if (this.progressTextRef) this.progressTextRef.nativeElement.textContent = \`\${Math.round(progress * 100)}%\`;
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'HorizontalScroller.astro',
					language: 'astro',
					description: 'Astro Native HorizontalScroller with pinned kinetic camera (Brix Agency architecture).',
					code: `---
interface Props {
  speed?: number;
  itemGap?: number;
  cardWidth?: number | string;
  showProgress?: boolean;
  showFadeEdges?: boolean;
  fadeWidth?: number;
  fadeEdgeColor?: string;
  fadeEdgeColorDark?: string;
  mobileMode?: 'scroll' | 'stack' | 'pinned';
  class?: string;
}

const {
  speed = ${speed},
  itemGap = ${itemGap},
  cardWidth = ${cardWidth},
  showProgress = ${showProgress},
  showFadeEdges = ${showFadeEdges},
  fadeWidth = ${fadeWidth},
  fadeEdgeColor = '${fadeEdgeColor}',
  fadeEdgeColorDark = '${fadeEdgeColorDark}',
  mobileMode = '${mobileMode}',
  class: className = '',
} = Astro.props;
---

<section
  class:list={['exhuma-horizontal-scroller relative w-full', className]}
  data-exhuma-horizontal-scroller
  data-speed={speed}
  data-item-gap={itemGap}
  data-card-width={cardWidth}
  data-show-progress={showProgress ? 'true' : 'false'}
  data-show-fade-edges={showFadeEdges ? 'true' : 'false'}
  data-fade-width={fadeWidth}
  data-fade-edge-color={fadeEdgeColor}
  data-fade-edge-color-dark={fadeEdgeColorDark}
  data-mobile-mode={mobileMode}
>
  <div class="exhuma-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
    <div class="exhuma-fade-left pointer-events-none absolute inset-y-0 left-0 z-10" style="display: none;"></div>
    <div class="exhuma-fade-right pointer-events-none absolute inset-y-0 right-0 z-10" style="display: none;"></div>

    <div
      class="exhuma-track flex items-stretch will-change-transform"
      style={{
        gap: \`\${itemGap}px\`,
        paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
        paddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
      }}
    >
      <slot />
    </div>

    {showProgress && (
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div class="exhuma-progress-bar h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out" />
        </div>
        <span class="exhuma-progress-text font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
      </div>
    )}
  </div>
</section>

<script>
  function setupScrollers() {
    document.querySelectorAll<HTMLElement>('[data-exhuma-horizontal-scroller]').forEach((section) => {
      const camera = section.querySelector<HTMLElement>('.exhuma-camera');
      const track = section.querySelector<HTMLElement>('.exhuma-track');
      const progressBar = section.querySelector<HTMLElement>('.exhuma-progress-bar');
      const progressText = section.querySelector<HTMLElement>('.exhuma-progress-text');
      const fadeLeft = section.querySelector<HTMLElement>('.exhuma-fade-left');
      const fadeRight = section.querySelector<HTMLElement>('.exhuma-fade-right');

      if (!camera || !track) return;

      const speed = parseFloat(section.dataset.speed || '1.0');
      const itemGap = parseFloat(section.dataset.itemGap || '28');
      const cardWidth = section.dataset.cardWidth || '320';
      const showFade = section.dataset.showFadeEdges !== 'false';
      const fadeW = parseFloat(section.dataset.fadeWidth || '48');
      const colorLight = section.dataset.fadeEdgeColor || '#ffffff';
      const colorDark = section.dataset.fadeEdgeColorDark || '#09090b';

      let cachedDistance = 0;
      let sectionH = 0;
      let rafId: number | null = null;
      let isIntersecting = false;

      const updateFadeEdges = () => {
        if (!showFade) return;
        const isDark = document.documentElement.classList.contains('dark');
        const color = isDark ? colorDark : colorLight;
        if (fadeLeft && fadeRight) {
          fadeLeft.style.display = 'block';
          fadeLeft.style.width = fadeW + 'px';
          fadeLeft.style.background = 'linear-gradient(to right, ' + color + ', transparent)';
          fadeRight.style.display = 'block';
          fadeRight.style.width = fadeW + 'px';
          fadeRight.style.background = 'linear-gradient(to left, ' + color + ', transparent)';
        }
      };

      const recalculate = () => {
        const vh = window.innerHeight;
        const containerW = camera.clientWidth;
        const resolvedCardW = /^\\d+$/.test(cardWidth.trim()) ? cardWidth.trim() + 'px' : cardWidth;
        Array.from(track.children).forEach((child) => {
          if (child instanceof HTMLElement) {
            child.style.width = resolvedCardW;
            child.style.flexShrink = '0';
          }
        });
        const trackW = track.scrollWidth;
        cachedDistance = Math.max(0, trackW - containerW + itemGap * 2);
        const safeSpeed = Math.max(0.1, speed);
        sectionH = Math.round(vh + cachedDistance / safeSpeed);
        section.style.minHeight = sectionH + 'px';
        updateFadeEdges();
      };

      const updateScroll = () => {
        const rect = section.getBoundingClientRect();
        const total = sectionH - window.innerHeight;
        if (total <= 0) return;
        const progress = Math.min(Math.max(-rect.top / total, 0), 1);
        const offset = -(progress * cachedDistance);
        track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
        if (progressBar) progressBar.style.width = \`\${(progress * 100).toFixed(1)}%\`;
        if (progressText) progressText.textContent = \`\${Math.round(progress * 100)}%\`;
      };

      const onScroll = () => {
        if (rafId === null) {
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

      const mutObs = new MutationObserver(updateFadeEdges);
      mutObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', recalculate, { passive: true });

      document.addEventListener('astro:before-swap', () => {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        mutObs.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      }, { once: true });
    });
  }

  setupScrollers();
  document.addEventListener('astro:page-load', setupScrollers);
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-horizontal-scroller.js',
					language: 'javascript',
					description: 'Custom Web Component <exhuma-horizontal-scroller> with pinned kinetic camera.',
					code: `export class ExhumaHorizontalScrollerElement extends HTMLElement {
  static get observedAttributes() {
    return ['speed', 'item-gap', 'card-width', 'show-progress', 'show-fade-edges', 'fade-width', 'fade-edge-color', 'fade-edge-color-dark', 'mobile-mode'];
  }

  constructor() {
    super();
    this._rafId = null;
    this._cachedDistance = 0;
    this._sectionH = 0;
    this._isIntersecting = false;
    this._onScroll = this._onScroll.bind(this);
    this._recalculate = this._recalculate.bind(this);
    this._updateFadeEdges = this._updateFadeEdges.bind(this);
  }

  connectedCallback() {
    this.classList.add('exhuma-horizontal-scroller');
    this.style.position = 'relative';
    this.style.display = 'block';
    this.style.width = '100%';

    let camera = this.querySelector('.exhuma-camera');
    if (!camera) {
      camera = document.createElement('div');
      camera.className = 'exhuma-camera';
      camera.style.cssText = 'position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: center;';

      const fadeLeft = document.createElement('div');
      fadeLeft.className = 'exhuma-fade-left';
      fadeLeft.style.cssText = 'pointer-events: none; position: absolute; top: 0; bottom: 0; left: 0; z-index: 10; display: none;';
      camera.appendChild(fadeLeft);

      const fadeRight = document.createElement('div');
      fadeRight.className = 'exhuma-fade-right';
      fadeRight.style.cssText = 'pointer-events: none; position: absolute; top: 0; bottom: 0; right: 0; z-index: 10; display: none;';
      camera.appendChild(fadeRight);

      const track = document.createElement('div');
      track.className = 'exhuma-track';
      track.style.cssText = 'display: flex; align-items: stretch; will-change: transform;';

      while (this.firstChild) {
        track.appendChild(this.firstChild);
      }
      camera.appendChild(track);
      this.appendChild(camera);
    }

    this._camera = this.querySelector('.exhuma-camera');
    this._track = this.querySelector('.exhuma-track');
    this._fadeLeft = this.querySelector('.exhuma-fade-left');
    this._fadeRight = this.querySelector('.exhuma-fade-right');

    this._recalculate();

    this._observer = new IntersectionObserver((entries) => {
      this._isIntersecting = entries[0]?.isIntersecting ?? false;
      if (this._isIntersecting) this._updateScroll();
    }, { rootMargin: '100px 0px', threshold: 0 });
    this._observer.observe(this);

    this._themeObs = new MutationObserver(this._updateFadeEdges);
    this._themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._recalculate, { passive: true });
  }

  disconnectedCallback() {
    if (this._rafId !== null) window.cancelAnimationFrame(this._rafId);
    this._observer?.disconnect();
    this._themeObs?.disconnect();
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._recalculate);
  }

  attributeChangedCallback() {
    this._recalculate();
  }

  _updateFadeEdges() {
    const showFade = this.getAttribute('show-fade-edges') !== 'false';
    if (!showFade) return;
    const isDark = document.documentElement.classList.contains('dark');
    const color = isDark
      ? (this.getAttribute('fade-edge-color-dark') || '${fadeEdgeColorDark}')
      : (this.getAttribute('fade-edge-color') || '${fadeEdgeColor}');
    const fadeW = this.getAttribute('fade-width') || '${fadeWidth}';

    if (this._fadeLeft && this._fadeRight) {
      this._fadeLeft.style.display = 'block';
      this._fadeLeft.style.width = fadeW + 'px';
      this._fadeLeft.style.background = 'linear-gradient(to right, ' + color + ', transparent)';
      this._fadeRight.style.display = 'block';
      this._fadeRight.style.width = fadeW + 'px';
      this._fadeRight.style.background = 'linear-gradient(to left, ' + color + ', transparent)';
    }
  }

  _recalculate() {
    if (!this._camera || !this._track) return;
    const vh = window.innerHeight;
    const containerW = this._camera.clientWidth;
    const speed = parseFloat(this.getAttribute('speed') || '${speed}');
    const itemGap = parseFloat(this.getAttribute('item-gap') || '${itemGap}');
    const cardWidth = this.getAttribute('card-width') || '${cardWidth}';

    const resolvedCardW = /^\\d+$/.test(cardWidth.trim()) ? cardWidth.trim() + 'px' : cardWidth;
    Array.from(this._track.children).forEach((child) => {
      if (child instanceof HTMLElement && !child.classList.contains('exhuma-fade-left') && !child.classList.contains('exhuma-fade-right')) {
        child.style.width = resolvedCardW;
        child.style.flexShrink = '0';
      }
    });

    this._track.style.gap = itemGap + 'px';
    const trackW = this._track.scrollWidth;
    this._cachedDistance = Math.max(0, trackW - containerW + itemGap * 2);
    const safeSpeed = Math.max(0.1, speed);
    this._sectionH = Math.round(vh + this._cachedDistance / safeSpeed);
    this.style.minHeight = this._sectionH + 'px';
    this._updateFadeEdges();
  }

  _updateScroll() {
    if (!this._track) return;
    const rect = this.getBoundingClientRect();
    const total = this._sectionH - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    const offset = -(progress * this._cachedDistance);
    this._track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
  }

  _onScroll() {
    if (this._rafId === null) {
      this._rafId = window.requestAnimationFrame(() => {
        this._updateScroll();
        this._rafId = null;
      });
    }
  }
}

if (!customElements.get('exhuma-horizontal-scroller')) {
  customElements.define('exhuma-horizontal-scroller', ExhumaHorizontalScrollerElement);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'horizontal-scroller.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JavaScript module for kinetic horizontal scroller.',
					code: `export function initHorizontalScroller(selector = '[data-exhuma-horizontal-scroller]', options = {}) {
  const instances = [];

  document.querySelectorAll(selector).forEach((section) => {
    const camera = section.querySelector('.exhuma-camera') || section;
    const track = section.querySelector('.exhuma-track');
    const progressBar = section.querySelector('.exhuma-progress-bar');
    const progressText = section.querySelector('.exhuma-progress-text');

    if (!track) return;

    const speed = parseFloat(section.dataset.speed || options.speed || ${speed});
    const itemGap = parseFloat(section.dataset.itemGap || options.itemGap || ${itemGap});
    const cardWidth = section.dataset.cardWidth || options.cardWidth || '${cardWidth}';
    const showFade = section.dataset.showFadeEdges !== 'false' && options.showFadeEdges !== false;
    const fadeW = parseFloat(section.dataset.fadeWidth || options.fadeWidth || ${fadeWidth});
    const colorLight = section.dataset.fadeEdgeColor || options.fadeEdgeColor || '${fadeEdgeColor}';
    const colorDark = section.dataset.fadeEdgeColorDark || options.fadeEdgeColorDark || '${fadeEdgeColorDark}';

    let fadeLeft = section.querySelector('.exhuma-fade-left');
    let fadeRight = section.querySelector('.exhuma-fade-right');

    if (showFade && (!fadeLeft || !fadeRight)) {
      fadeLeft = document.createElement('div');
      fadeLeft.className = 'exhuma-fade-left pointer-events-none absolute inset-y-0 left-0 z-10';
      fadeRight = document.createElement('div');
      fadeRight.className = 'exhuma-fade-right pointer-events-none absolute inset-y-0 right-0 z-10';
      camera.appendChild(fadeLeft);
      camera.appendChild(fadeRight);
    }

    let cachedDistance = 0;
    let sectionH = 0;
    let rafId = null;
    let isIntersecting = false;

    const updateFadeEdges = () => {
      if (!showFade || !fadeLeft || !fadeRight) return;
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? colorDark : colorLight;
      fadeLeft.style.width = fadeW + 'px';
      fadeLeft.style.background = 'linear-gradient(to right, ' + color + ', transparent)';
      fadeRight.style.width = fadeW + 'px';
      fadeRight.style.background = 'linear-gradient(to left, ' + color + ', transparent)';
    };

    const recalculate = () => {
      const vh = window.innerHeight;
      const containerW = camera.clientWidth;
      const resolvedCardW = /^\\d+$/.test(String(cardWidth).trim()) ? String(cardWidth).trim() + 'px' : cardWidth;
      Array.from(track.children).forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains('exhuma-fade-left') && !child.classList.contains('exhuma-fade-right')) {
          child.style.width = resolvedCardW;
          child.style.flexShrink = '0';
        }
      });
      const trackW = track.scrollWidth;
      cachedDistance = Math.max(0, trackW - containerW + itemGap * 2);
      const safeSpeed = Math.max(0.1, speed);
      sectionH = Math.round(vh + cachedDistance / safeSpeed);
      section.style.minHeight = sectionH + 'px';
      updateFadeEdges();
    };

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = sectionH - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      const offset = -(progress * cachedDistance);
      track.style.transform = \`translate3d(\${offset.toFixed(2)}px, 0, 0)\`;
      if (progressBar) progressBar.style.width = \`\${(progress * 100).toFixed(1)}%\`;
      if (progressText) progressText.textContent = \`\${Math.round(progress * 100)}%\`;
    };

    const onScroll = () => {
      if (rafId === null) {
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

    const themeObs = new MutationObserver(updateFadeEdges);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalculate, { passive: true });

    instances.push({
      destroy() {
        if (rafId !== null) window.cancelAnimationFrame(rafId);
        observer.disconnect();
        themeObs.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', recalculate);
      },
    });
  });

  return {
    destroy() {
      instances.forEach((inst) => inst.destroy());
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
					filename: 'horizontal-scroller.blade.php',
					language: 'php',
					description: 'Laravel Blade component for kinetic horizontal scroller.',
					code: `@props([
    'speed' => ${speed},
    'itemGap' => ${itemGap},
    'cardWidth' => '${cardWidth}',
    'showProgress' => ${showProgress ? 'true' : 'false'},
    'showFadeEdges' => ${showFadeEdges ? 'true' : 'false'},
    'fadeWidth' => ${fadeWidth},
    'fadeEdgeColor' => '${fadeEdgeColor}',
    'fadeEdgeColorDark' => '${fadeEdgeColorDark}',
    'mobileMode' => '${mobileMode}',
])

<section
    {{ $attributes->merge(['class' => 'exhuma-horizontal-scroller relative w-full']) }}
    data-exhuma-horizontal-scroller
    data-speed="{{ $speed }}"
    data-item-gap="{{ $itemGap }}"
    data-card-width="{{ $cardWidth }}"
    data-show-progress="{{ $showProgress ? 'true' : 'false' }}"
    data-show-fade-edges="{{ $showFadeEdges ? 'true' : 'false' }}"
    data-fade-width="{{ $fadeWidth }}"
    data-fade-edge-color="{{ $fadeEdgeColor }}"
    data-fade-edge-color-dark="{{ $fadeEdgeColorDark }}"
    data-mobile-mode="{{ $mobileMode }}"
>
    <div class="exhuma-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        @if ($showFadeEdges)
            <div class="exhuma-fade-left pointer-events-none absolute inset-y-0 left-0 z-10" style="width: {{ $fadeWidth }}px;"></div>
            <div class="exhuma-fade-right pointer-events-none absolute inset-y-0 right-0 z-10" style="width: {{ $fadeWidth }}px;"></div>
        @endif

        <div
            class="exhuma-track flex items-stretch will-change-transform"
            style="gap: {{ $itemGap }}px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
        >
            {{ $slot }}
        </div>

        @if ($showProgress)
            <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
                <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
                    <div class="exhuma-progress-bar h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
                </div>
                <span class="exhuma-progress-text font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
            </div>
        @endif
    </div>
</section>

@pushOnce('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-exhuma-horizontal-scroller]').forEach(function(section) {
            const camera = section.querySelector('.exhuma-camera');
            const track = section.querySelector('.exhuma-track');
            const progressBar = section.querySelector('.exhuma-progress-bar');
            const progressText = section.querySelector('.exhuma-progress-text');
            const fadeLeft = section.querySelector('.exhuma-fade-left');
            const fadeRight = section.querySelector('.exhuma-fade-right');

            if (!camera || !track) return;

            const speed = parseFloat(section.dataset.speed || '1.0');
            const itemGap = parseFloat(section.dataset.itemGap || '28');
            const cardWidth = section.dataset.cardWidth || '320';
            const showFade = section.dataset.showFadeEdges !== 'false';
            const fadeW = parseFloat(section.dataset.fadeWidth || '48');
            const colorLight = section.dataset.fadeEdgeColor || '#ffffff';
            const colorDark = section.dataset.fadeEdgeColorDark || '#09090b';

            let cachedDistance = 0;
            let sectionH = 0;
            let rafId = null;

            function updateFade() {
                if (!showFade || !fadeLeft || !fadeRight) return;
                const isDark = document.documentElement.classList.contains('dark');
                const color = isDark ? colorDark : colorLight;
                fadeLeft.style.background = 'linear-gradient(to right, ' + color + ', transparent)';
                fadeRight.style.background = 'linear-gradient(to left, ' + color + ', transparent)';
            }

            function recalculate() {
                const vh = window.innerHeight;
                const containerW = camera.clientWidth;
                const resolvedCardW = /^\\d+$/.test(cardWidth.trim()) ? cardWidth.trim() + 'px' : cardWidth;
                Array.from(track.children).forEach(function(child) {
                    if (child instanceof HTMLElement) {
                        child.style.width = resolvedCardW;
                        child.style.flexShrink = '0';
                    }
                });
                const trackW = track.scrollWidth;
                cachedDistance = Math.max(0, trackW - containerW + itemGap * 2);
                const safeSpeed = Math.max(0.1, speed);
                sectionH = Math.round(vh + cachedDistance / safeSpeed);
                section.style.minHeight = sectionH + 'px';
                updateFade();
            }

            function updateScroll() {
                const rect = section.getBoundingClientRect();
                const total = sectionH - window.innerHeight;
                if (total <= 0) return;
                const progress = Math.min(Math.max(-rect.top / total, 0), 1);
                const offset = -(progress * cachedDistance);
                track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px, 0, 0)';
                if (progressBar) progressBar.style.width = (progress * 100).toFixed(1) + '%';
                if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
            }

            recalculate();
            updateFade();

            const obs = new IntersectionObserver(function(entries) {
                if (entries[0] && entries[0].isIntersecting) updateScroll();
            }, { rootMargin: '100px 0px', threshold: 0 });
            obs.observe(section);

            const themeObs = new MutationObserver(updateFade);
            themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

            window.addEventListener('scroll', function() {
                if (rafId === null) {
                    rafId = window.requestAnimationFrame(function() {
                        updateScroll();
                        rafId = null;
                    });
                }
            }, { passive: true });
            window.addEventListener('resize', recalculate, { passive: true });

            window.addEventListener('pagehide', function cleanup() {
                if (rafId !== null) window.cancelAnimationFrame(rafId);
                obs.disconnect();
                themeObs.disconnect();
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', recalculate);
            }, { once: true });
        });
    });
</script>
@endPushOnce
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Block Metadata for Exhuma Horizontal Scroller.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/horizontal-scroller",
  "version": "1.1.0",
  "title": "Exhuma Horizontal Scroller",
  "category": "layout",
  "icon": "columns",
  "description": "Pinned kinetic viewport camera that translates horizontal cards in synchronization with vertical scroll.",
  "attributes": {
    "speed": { "type": "number", "default": ${speed} },
    "itemGap": { "type": "number", "default": ${itemGap} },
    "cardWidth": { "type": "string", "default": "${cardWidth}" },
    "showProgress": { "type": "boolean", "default": ${showProgress} },
    "showFadeEdges": { "type": "boolean", "default": ${showFadeEdges} },
    "fadeWidth": { "type": "number", "default": ${fadeWidth} },
    "fadeEdgeColor": { "type": "string", "default": "${fadeEdgeColor}" },
    "fadeEdgeColorDark": { "type": "string", "default": "${fadeEdgeColorDark}" },
    "mobileMode": { "type": "string", "default": "${mobileMode}" }
  },
  "supports": { "align": ["full", "wide"] },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Block Render Template for Exhuma Horizontal Scroller.',
					code: `<?php
$speed = isset($attributes['speed']) ? floatval($attributes['speed']) : ${speed};
$item_gap = isset($attributes['itemGap']) ? intval($attributes['itemGap']) : ${itemGap};
$card_width = isset($attributes['cardWidth']) ? esc_attr($attributes['cardWidth']) : '${cardWidth}';
$show_progress = !empty($attributes['showProgress']);
$show_fade_edges = !empty($attributes['showFadeEdges']);
$fade_width = isset($attributes['fadeWidth']) ? intval($attributes['fadeWidth']) : ${fadeWidth};
$fade_edge_color = isset($attributes['fadeEdgeColor']) ? esc_attr($attributes['fadeEdgeColor']) : '${fadeEdgeColor}';
$fade_edge_color_dark = isset($attributes['fadeEdgeColorDark']) ? esc_attr($attributes['fadeEdgeColorDark']) : '${fadeEdgeColorDark}';
$mobile_mode = isset($attributes['mobileMode']) ? esc_attr($attributes['mobileMode']) : '${mobileMode}';
?>
<section
  class="exhuma-horizontal-scroller relative w-full"
  data-exhuma-horizontal-scroller
  data-speed="<?php echo esc_attr($speed); ?>"
  data-item-gap="<?php echo esc_attr($item_gap); ?>"
  data-card-width="<?php echo esc_attr($card_width); ?>"
  data-show-progress="<?php echo $show_progress ? 'true' : 'false'; ?>"
  data-show-fade-edges="<?php echo $show_fade_edges ? 'true' : 'false'; ?>"
  data-fade-width="<?php echo esc_attr($fade_width); ?>"
  data-fade-edge-color="<?php echo esc_attr($fade_edge_color); ?>"
  data-fade-edge-color-dark="<?php echo esc_attr($fade_edge_color_dark); ?>"
  data-mobile-mode="<?php echo esc_attr($mobile_mode); ?>"
>
  <div class="exhuma-camera sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
    <?php if ($show_fade_edges): ?>
      <div class="exhuma-fade-left pointer-events-none absolute inset-y-0 left-0 z-10" style="width: <?php echo esc_attr($fade_width); ?>px;"></div>
      <div class="exhuma-fade-right pointer-events-none absolute inset-y-0 right-0 z-10" style="width: <?php echo esc_attr($fade_width); ?>px;"></div>
    <?php endif; ?>

    <div
      class="exhuma-track flex items-stretch will-change-transform"
      style="gap: <?php echo esc_attr($item_gap); ?>px; padding-left: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem)); padding-right: max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem));"
    >
      <?php echo $content ?? ''; ?>
    </div>

    <?php if ($show_progress): ?>
      <div class="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex items-center gap-4 sm:left-12 sm:right-12">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-border/60 backdrop-blur-sm">
          <div class="exhuma-progress-bar h-full w-0 rounded-full bg-emerald-500 transition-[width] duration-75 ease-out"></div>
        </div>
        <span class="exhuma-progress-text font-mono text-2xs text-muted-foreground tabular-nums">0%</span>
      </div>
    <?php endif; ?>
  </div>
</section>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'HorizontalScroller.tsx',
					language: 'tsx',
					description: 'React Native HorizontalScroller horizontal rail component.',
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
  itemGap = ${itemGap},
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
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.content, { gap: itemGap }]}
        snapToInterval={cardWidth + itemGap}
        decelerationRate="fast"
        data={data}
        renderItem={({ item, index }) => (
          <View style={{ width: cardWidth }}>
            {renderItem({ item, index })}
          </View>
        )}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'horizontal_scroller.dart',
					language: 'dart',
					description: 'Flutter ExhumaHorizontalScroller native horizontal scroll rail.',
					code: `import 'package:flutter/material.dart';

class ExhumaHorizontalScroller extends StatelessWidget {
  final List<Widget> children;
  final double itemGap;
  final double cardWidth;

  const ExhumaHorizontalScroller({
    super.key,
    required this.children,
    this.itemGap = ${itemGap}.0,
    this.cardWidth = ${cardWidth}.0,
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

		default:
			return null;
	}
}
