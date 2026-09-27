import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getFloatingDockOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const direction = (props.direction as string) || 'bottom';
	const baseSize = Number(props.baseSize ?? 44);
	const maxMagnification = Number(props.maxMagnification ?? 0.65);
	const influenceRadius = Number(props.influenceRadius ?? 85);
	const showLabels = props.showLabels !== false;
	const panelStyle = (props.panelStyle as string) || 'glass';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			if (!isEjected) {
				return [
					{
						filename: 'FloatingDock.tsx',
						language: 'tsx',
						description: 'Floating Dock — Clean Shadcn-style component powered by @exhuma/core kinetic primitives.',
						code: `${header}import * as React from 'react';
import {
  FloatingDock as CoreFloatingDock,
  DockItem as CoreDockItem,
  DockIcon as CoreDockIcon,
  DockLabel as CoreDockLabel,
  type FloatingDockProps as CoreFloatingDockProps,
  type FloatingDockItemData,
  type DockDirection,
  type DockPanelStyle,
} from '@exhuma/core';
import { clsx } from 'clsx';

export type { FloatingDockItemData, DockDirection, DockPanelStyle };

export interface FloatingDockProps extends CoreFloatingDockProps {
  className?: string;
}

export const FloatingDock = React.forwardRef<HTMLDivElement, FloatingDockProps>(
  (
    {
      direction = '${direction}',
      baseSize = ${baseSize},
      maxMagnification = ${maxMagnification},
      influenceRadius = ${influenceRadius},
      showLabels = ${showLabels},
      panelStyle = '${panelStyle}',
      className,
      items,
      children,
      ...props
    },
    _ref
  ) => {
    return (
      <CoreFloatingDock
        ref={_ref}
        direction={direction as DockDirection}
        baseSize={baseSize}
        maxMagnification={maxMagnification}
        influenceRadius={influenceRadius}
        showLabels={showLabels}
        panelStyle={panelStyle as DockPanelStyle}
        className={clsx(className)}
        items={items}
        {...props}
      >
        {children}
      </CoreFloatingDock>
    );
  }
);
FloatingDock.displayName = 'FloatingDock';

export const DockItem = CoreDockItem;
export const DockIcon = CoreDockIcon;
export const DockLabel = CoreDockLabel;
`,
					},
				];
			}

			// Ejected Mode — Standalone Engine (Zero External Dependencies)
			return [
				{
					filename: 'FloatingDock.tsx',
					language: 'tsx',
					description: 'Floating Dock — Standalone Ejected Engine (Zero Dependencies). C1-continuous cosine proximity distribution, separated read/write rAF loops, and orientation-aware popover tooltips.',
					code: `${header}import * as React from 'react';

export type DockDirection = 'bottom' | 'top' | 'left' | 'right';
export type DockPanelStyle = 'glass' | 'translucent' | 'minimal';

export interface FloatingDockItemData {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface FloatingDockProps {
  items?: FloatingDockItemData[];
  children?: React.ReactNode;
  direction?: DockDirection;
  baseSize?: number;
  maxMagnification?: number;
  influenceRadius?: number;
  showLabels?: boolean;
  panelStyle?: DockPanelStyle;
  className?: string;
  style?: React.CSSProperties;
}

interface DockContextValue {
  direction: DockDirection;
  baseSize: number;
  maxMagnification: number;
  influenceRadius: number;
  showLabels: boolean;
  registerItem: (el: HTMLElement) => () => void;
}

const DockContext = React.createContext<DockContextValue | null>(null);

function calculateCosineBellScale(distance: number, influenceRadius: number, maxMagnification: number): number {
  if (influenceRadius <= 0 || maxMagnification <= 0) return 1.0;
  if (distance >= influenceRadius) return 1.0;
  const normalizedDistance = distance / influenceRadius;
  const factor = 0.5 * (1 + Math.cos(Math.PI * normalizedDistance));
  return 1.0 + maxMagnification * factor;
}

function calculateDockItemSize(distance: number, baseSize: number, influenceRadius: number, maxMagnification: number): number {
  return baseSize * calculateCosineBellScale(distance, influenceRadius, maxMagnification);
}

function lerpDockScale(current: number, target: number, speed: number = 0.2): number {
  const diff = target - current;
  if (Math.abs(diff) < 0.002) return target;
  return current + diff * speed;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  items = [],
  children,
  direction = '${direction}',
  baseSize = ${baseSize},
  maxMagnification = ${maxMagnification},
  influenceRadius = ${influenceRadius},
  showLabels = ${showLabels},
  panelStyle = '${panelStyle}',
  className = '',
  style,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pointerCoord = React.useRef<number>(-9999);
  const isHoveredRef = React.useRef<boolean>(false);
  const itemsRef = React.useRef<HTMLElement[]>([]);
  const currentSizesRef = React.useRef<Map<HTMLElement, number>>(new Map());
  const rafIdRef = React.useRef<number | null>(null);

  const registerItem = React.useCallback(
    (el: HTMLElement) => {
      itemsRef.current.push(el);
      currentSizesRef.current.set(el, baseSize);
      return () => {
        itemsRef.current = itemsRef.current.filter((item) => item !== el);
        currentSizesRef.current.delete(el);
      };
    },
    [baseSize]
  );

  const updateScales = React.useCallback(() => {
    const isHovered = isHoveredRef.current;
    const coord = pointerCoord.current;
    const isHorizontal = direction === 'bottom' || direction === 'top';
    const elements = itemsRef.current;
    const count = elements.length;

    if (count === 0) {
      rafIdRef.current = null;
      return;
    }

    // Phase 1: Batched Read Phase (Read all geometry before any style writes)
    const centers: number[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const rect = elements[i].getBoundingClientRect();
      centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    }

    // Phase 2: Compute target sizes and interpolate
    let stillAnimating = false;

    for (let i = 0; i < count; i++) {
      const el = elements[i];
      const currentSize = currentSizesRef.current.get(el) ?? baseSize;
      let targetSize = baseSize;

      if (isHovered && coord !== -9999) {
        const distance = Math.abs(coord - centers[i]);
        targetSize = calculateDockItemSize(distance, baseSize, influenceRadius, maxMagnification);
      }

      const lerpSpeed = isHovered ? 0.38 : 0.22;
      const nextSize = lerpDockScale(currentSize, targetSize, lerpSpeed);
      currentSizesRef.current.set(el, nextSize);

      if (Math.abs(nextSize - targetSize) > 0.05) {
        stillAnimating = true;
      }

      // Phase 3: Batched Write Phase (Direct pixel size on element)
      el.style.width = \`\${nextSize.toFixed(2)}px\`;
      el.style.height = \`\${nextSize.toFixed(2)}px\`;
    }

    if (isHovered || stillAnimating) {
      rafIdRef.current = requestAnimationFrame(updateScales);
    } else {
      for (let i = 0; i < count; i++) {
        const el = elements[i];
        el.style.width = \`\${baseSize}px\`;
        el.style.height = \`\${baseSize}px\`;
        currentSizesRef.current.set(el, baseSize);
      }
      rafIdRef.current = null;
    }
  }, [baseSize, direction, influenceRadius, maxMagnification]);

  const scheduleUpdate = React.useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateScales);
    }
  }, [updateScales]);

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isHoveredRef.current = true;
      pointerCoord.current = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
      scheduleUpdate();
    },
    [direction, scheduleUpdate]
  );

  const handlePointerEnter = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isHoveredRef.current = true;
      pointerCoord.current = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
      scheduleUpdate();
    },
    [direction, scheduleUpdate]
  );

  const handlePointerLeave = React.useCallback(() => {
    isHoveredRef.current = false;
    pointerCoord.current = -9999;
    scheduleUpdate();
  }, [scheduleUpdate]);

  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const isHorizontal = direction === 'bottom' || direction === 'top';
  const crossAxisSize = \`\${baseSize + 16}px\`;

  const directionLayoutClasses = {
    bottom: 'flex-row items-end px-3 pb-2 pt-2',
    top: 'flex-row items-start px-3 pt-2 pb-2',
    left: 'flex-col items-start py-3 pl-2 pr-2',
    right: 'flex-col items-end py-3 pr-2 pl-2',
  }[direction];

  const panelStyleClasses = {
    glass: 'border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 rounded-full',
    translucent: 'border border-border/60 bg-card/90 shadow-xl backdrop-blur-md rounded-2xl',
    minimal: 'border-transparent bg-transparent shadow-none',
  }[panelStyle];

  const mergedStyle: React.CSSProperties = {
    ...(isHorizontal ? { height: crossAxisSize } : { width: crossAxisSize }),
    ...style,
  };

  return (
    <DockContext.Provider
      value={{
        direction,
        baseSize,
        maxMagnification,
        influenceRadius,
        showLabels,
        registerItem,
      }}
    >
      <div
        ref={containerRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={\`exhuma-dock-root relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] select-none touch-none \${directionLayoutClasses} \${panelStyleClasses} \${className}\`}
        style={mergedStyle}
        role="toolbar"
        aria-label="Application Dock"
      >
        {items.length > 0
          ? items.map((item) => (
              <DockItem key={item.title} title={item.title} href={item.href} onClick={item.onClick} active={item.active}>
                {item.icon}
              </DockItem>
            ))
          : children}
      </div>
    </DockContext.Provider>
  );
};

export const DockItem: React.FC<{
  children: React.ReactNode;
  title?: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}> = ({ children, title, href, onClick, active = false, className = '' }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const ctx = React.useContext(DockContext);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const direction = ctx?.direction ?? 'bottom';
  const baseSize = ctx?.baseSize ?? 44;
  const showLabels = ctx?.showLabels ?? true;

  React.useEffect(() => {
    if (!ctx || !itemRef.current) return;
    return ctx.registerItem(itemRef.current);
  }, [ctx]);

  const tooltipDirectionClasses = {
    bottom: 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
    top: 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2',
    left: 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2',
    right: 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2',
  }[direction];



  const showTooltip = Boolean(showLabels && title && (hovered || focused));

  const content = (
    <div
      ref={itemRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={onClick}
      tabIndex={href ? undefined : 0}
      role={href ? undefined : 'button'}
      aria-label={title}
      className={\`exhuma-dock-item relative flex shrink-0 items-center justify-center rounded-full transition-shadow duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer \${className}\`}
      style={{
        width: \`\${baseSize}px\`,
        height: \`\${baseSize}px\`,
      }}
    >
      {showTooltip && (
        <div
          role="tooltip"
          aria-hidden={!showTooltip}
          className={\`pointer-events-none absolute z-50 rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none animate-in fade-in zoom-in-95 duration-100 \${tooltipDirectionClasses}\`}
        >
          {title}
        </div>
      )}

      <div className="relative z-10 flex size-full items-center justify-center">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="inline-block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={title}
      >
        {content}
      </a>
    );
  }

  return content;
};

`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'FloatingDock.vue',
					language: 'vue',
					description: 'Floating Dock — Vue 3 Composition API with reactive Gaussian proximity math and directional tooltips.',
					code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

export interface DockItemData {
  title: string;
  href?: string;
  active?: boolean;
}

const props = withDefaults(
  defineProps<{
    items?: DockItemData[];
    direction?: 'bottom' | 'top' | 'left' | 'right';
    baseSize?: number;
    maxMagnification?: number;
    influenceRadius?: number;
  }>(),
  {
    direction: '${direction}',
    baseSize: ${baseSize},
    maxMagnification: ${maxMagnification},
    influenceRadius: ${influenceRadius},
  }
);

const containerRef = ref<HTMLDivElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const pointerCoord = ref<number>(-9999);
const isHovered = ref(false);
const activeTooltip = ref<string | null>(null);
let rafId: number | null = null;
const currentSizes = new Map<HTMLElement, number>();

function setItemRef(el: any, idx: number) {
  if (el) itemRefs.value[idx] = el as HTMLElement;
}

function calculateGaussianScale(distance: number, sigma: number, maxBoost: number): number {
  if (sigma <= 0) return 1.0;
  if (distance > sigma * 2.5) return 1.0;
  return 1.0 + maxBoost * Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function updateScales() {
  const elements = itemRefs.value;
  const count = elements.length;
  if (count === 0) {
    rafId = null;
    return;
  }

  const isHorizontal = props.direction === 'bottom' || props.direction === 'top';
  const centers: number[] = new Array(count);

  // Read Phase
  for (let i = 0; i < count; i++) {
    const rect = elements[i].getBoundingClientRect();
    centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
  }

  // Write Phase
  let stillAnimating = false;
  for (let i = 0; i < count; i++) {
    const el = elements[i];
    const current = currentSizes.get(el) ?? props.baseSize;
    let target = props.baseSize;

    if (isHovered.value && pointerCoord.value !== -9999) {
      const dist = Math.abs(pointerCoord.value - centers[i]);
      target = props.baseSize * calculateGaussianScale(dist, props.influenceRadius, props.maxMagnification);
    }

    const next = current + (target - current) * (isHovered.value ? 0.38 : 0.22);
    currentSizes.set(el, next);

    if (Math.abs(next - target) > 0.05) stillAnimating = true;

    const scale = next / props.baseSize;
    el.style.width = \`\${next.toFixed(2)}px\`;
    el.style.height = \`\${next.toFixed(2)}px\`;
    el.style.setProperty('--dock-scale', scale.toFixed(3));
  }

  if (isHovered.value || stillAnimating) {
    rafId = requestAnimationFrame(updateScales);
  } else {
    for (let i = 0; i < count; i++) {
      const el = elements[i];
      el.style.width = \`\${props.baseSize}px\`;
      el.style.height = \`\${props.baseSize}px\`;
      el.style.setProperty('--dock-scale', '1.0');
      currentSizes.set(el, props.baseSize);
    }
    rafId = null;
  }
}

function onPointerMove(e: PointerEvent) {
  isHovered.value = true;
  pointerCoord.value = props.direction === 'bottom' || props.direction === 'top' ? e.clientX : e.clientY;
  if (rafId === null) rafId = requestAnimationFrame(updateScales);
}

function onPointerLeave() {
  isHovered.value = false;
  pointerCoord.value = -9999;
  activeTooltip.value = null;
  if (rafId === null) rafId = requestAnimationFrame(updateScales);
}

const directionClasses = computed(() => {
  switch (props.direction) {
    case 'top': return 'flex-row items-start px-3 pt-2 pb-2';
    case 'left': return 'flex-col items-start py-3 pl-2 pr-2';
    case 'right': return 'flex-col items-end py-3 pr-2 pl-2';
    default: return 'flex-row items-end px-3 pb-2 pt-2';
  }
});

const tooltipClasses = computed(() => {
  switch (props.direction) {
    case 'top': return 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2';
    case 'left': return 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2';
    case 'right': return 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2';
    default: return 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2';
  }
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    ref="containerRef"
    @pointerenter="onPointerMove"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="['relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none', directionClasses]"
    :style="direction === 'bottom' || direction === 'top' ? { height: (baseSize + 16) + 'px' } : { width: (baseSize + 16) + 'px' }"
    role="toolbar"
    aria-label="Application Dock"
  >
    <div
      v-for="(item, idx) in items"
      :key="item.title"
      :ref="(el) => setItemRef(el, idx)"
      @pointerenter="activeTooltip = item.title"
      @pointerleave="activeTooltip = null"
      class="relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
      :style="{ width: baseSize + 'px', height: baseSize + 'px' }"
    >
      <!-- macOS Tooltip -->
      <div
        v-if="activeTooltip === item.title"
        role="tooltip"
        :class="['pointer-events-none absolute z-50 rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none', tooltipClasses]"
      >
        {{ item.title }}
      </div>

      <!-- Icon Wrapper -->
      <div class="relative z-10 flex size-full items-center justify-center">
        <slot :name="'icon-' + idx" :item="item">
          <span class="font-mono text-xs font-bold text-foreground/80">{{ item.title.charAt(0) }}</span>
        </slot>
      </div>

      <!-- Active Indicator Dot -->
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
					filename: 'FloatingDock.svelte',
					language: 'svelte',
					description: 'Floating Dock — Svelte 5 component with runes ($state, $derived) and native rAF kinetic scaling.',
					code: `<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface DockItemData {
    title: string;
    href?: string;
    active?: boolean;
  }

  let {
    items = [],
    direction = '${direction}',
    baseSize = ${baseSize},
    maxMagnification = ${maxMagnification},
    influenceRadius = ${influenceRadius},
  }: {
    items?: DockItemData[];
    direction?: 'bottom' | 'top' | 'left' | 'right';
    baseSize?: number;
    maxMagnification?: number;
    influenceRadius?: number;
  } = $props();

  let containerEl: HTMLDivElement;
  let itemElements: HTMLElement[] = $state([]);
  let isHovered = $state(false);
  let hoveredTitle: string | null = $state(null);
  let pointerCoord = -9999;
  let rafId: number | null = null;
  const currentSizes = new Map<HTMLElement, number>();

  function calculateGaussianScale(dist: number, sigma: number, maxBoost: number): number {
    if (sigma <= 0) return 1.0;
    if (dist > sigma * 2.5) return 1.0;
    return 1.0 + maxBoost * Math.exp(-(dist * dist) / (2 * sigma * sigma));
  }

  function updateScales() {
    const count = itemElements.length;
    if (count === 0) {
      rafId = null;
      return;
    }

    const isHorizontal = direction === 'bottom' || direction === 'top';
    const centers = new Array(count);

    for (let i = 0; i < count; i++) {
      const rect = itemElements[i].getBoundingClientRect();
      centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    }

    let stillAnimating = false;
    for (let i = 0; i < count; i++) {
      const el = itemElements[i];
      const current = currentSizes.get(el) ?? baseSize;
      let target = baseSize;

      if (isHovered && pointerCoord !== -9999) {
        const dist = Math.abs(pointerCoord - centers[i]);
        target = baseSize * calculateGaussianScale(dist, influenceRadius, maxMagnification);
      }

      const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
      currentSizes.set(el, next);

      if (Math.abs(next - target) > 0.05) stillAnimating = true;

      const scale = next / baseSize;
      el.style.width = \`\${next.toFixed(2)}px\`;
      el.style.height = \`\${next.toFixed(2)}px\`;
      el.style.setProperty('--dock-scale', scale.toFixed(3));
    }

    if (isHovered || stillAnimating) {
      rafId = requestAnimationFrame(updateScales);
    } else {
      for (let i = 0; i < count; i++) {
        const el = itemElements[i];
        el.style.width = \`\${baseSize}px\`;
        el.style.height = \`\${baseSize}px\`;
        el.style.setProperty('--dock-scale', '1.0');
        currentSizes.set(el, baseSize);
      }
      rafId = null;
    }
  }

  function handlePointerMove(e: PointerEvent) {
    isHovered = true;
    pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(updateScales);
  }

  function handlePointerLeave() {
    isHovered = false;
    pointerCoord = -9999;
    hoveredTitle = null;
    if (rafId === null) rafId = requestAnimationFrame(updateScales);
  }

  const directionClasses = $derived(
    direction === 'top' ? 'flex-row items-start px-3 pt-2 pb-2' :
    direction === 'left' ? 'flex-col items-start py-3 pl-2 pr-2' :
    direction === 'right' ? 'flex-col items-end py-3 pr-2 pl-2' :
    'flex-row items-end px-3 pb-2 pt-2'
  );

  const tooltipClasses = $derived(
    direction === 'top' ? 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2' :
    direction === 'left' ? 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2' :
    direction === 'right' ? 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2' :
    'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2'
  );

  onDestroy(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  });
</script>

<div
  bind:this={containerEl}
  onpointerenter={handlePointerMove}
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  class="relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none {directionClasses}"
  style="{direction === 'bottom' || direction === 'top' ? 'height: ' + (baseSize + 16) + 'px;' : 'width: ' + (baseSize + 16) + 'px;'}"
  role="toolbar"
  aria-label="Application Dock"
>
  {#each items as item, idx}
    <div
      bind:this={itemElements[idx]}
      onpointerenter={() => (hoveredTitle = item.title)}
      onpointerleave={() => (hoveredTitle = null)}
      class="relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
      style="width: {baseSize}px; height: {baseSize}px;"
    >
      {#if hoveredTitle === item.title}
        <div
          role="tooltip"
          class="pointer-events-none absolute z-50 rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none {tooltipClasses}"
        >
          {item.title}
        </div>
      {/if}

      <div class="relative z-10 flex size-full items-center justify-center">
        <span class="text-xs font-mono font-bold text-white">{item.title.slice(0, 2).toUpperCase()}</span>
      </div>
    </div>
  {/each}
</div>
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'floating-dock.component.ts',
					language: 'typescript',
					description: 'Floating Dock — Angular 18+ Standalone Component with signal inputs, direct DOM rendering, and rAF proximity interpolation.',
					code: `import { Component, Input, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DockItemData {
  title: string;
  href?: string;
  active?: boolean;
}

@Component({
  selector: 'exhuma-floating-dock',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      #container
      (pointerenter)="onPointerMove($event)"
      (pointermove)="onPointerMove($event)"
      (pointerleave)="onPointerLeave()"
      class="relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none"
      [style.height.px]="(direction === 'bottom' || direction === 'top') ? baseSize + 16 : null"
      [style.width.px]="(direction === 'left' || direction === 'right') ? baseSize + 16 : null"
      [ngClass]="getDirectionClasses()"
      role="toolbar"
      aria-label="Application Dock"
    >
      <div
        *ngFor="let item of items; let idx = index"
        #dockItem
        (pointerenter)="activeTooltip = item.title"
        (pointerleave)="activeTooltip = null"
        class="relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
        [style.width.px]="baseSize"
        [style.height.px]="baseSize"
      >
        <div
          *ngIf="activeTooltip === item.title"
          role="tooltip"
          class="pointer-events-none absolute z-50 rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none"
          [ngClass]="getTooltipClasses()"
        >
          {{ item.title }}
        </div>

        <div class="relative z-10 flex size-full items-center justify-center">
          <span class="text-xs font-mono font-bold text-white">{{ item.title.slice(0, 2).toUpperCase() }}</span>
        </div>
      </div>
    </div>
  \`,
})
export class FloatingDockComponent implements AfterViewInit, OnDestroy {
  @Input() items: DockItemData[] = [];
  @Input() direction: 'bottom' | 'top' | 'left' | 'right' = '${direction}';
  @Input() baseSize = ${baseSize};
  @Input() maxMagnification = ${maxMagnification};
  @Input() influenceRadius = ${influenceRadius};

  @ViewChildren('dockItem') itemRefs!: QueryList<ElementRef<HTMLElement>>;

  activeTooltip: string | null = null;
  private pointerCoord = -9999;
  private isHovered = false;
  private rafId: number | null = null;
  private currentSizes = new Map<HTMLElement, number>();

  ngAfterViewInit() {
    this.itemRefs.forEach((ref) => {
      this.currentSizes.set(ref.nativeElement, this.baseSize);
    });
  }

  onPointerMove(e: PointerEvent) {
    this.isHovered = true;
    this.pointerCoord = this.direction === 'bottom' || this.direction === 'top' ? e.clientX : e.clientY;
    this.scheduleUpdate();
  }

  onPointerLeave() {
    this.isHovered = false;
    this.pointerCoord = -9999;
    this.activeTooltip = null;
    this.scheduleUpdate();
  }

  private scheduleUpdate() {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.updateScales());
    }
  }

  private updateScales() {
    const items = this.itemRefs.toArray();
    const count = items.length;
    if (count === 0) {
      this.rafId = null;
      return;
    }

    const isHorizontal = this.direction === 'bottom' || this.direction === 'top';
    const centers = new Array(count);

    for (let i = 0; i < count; i++) {
      const rect = items[i].nativeElement.getBoundingClientRect();
      centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    }

    let stillAnimating = false;
    for (let i = 0; i < count; i++) {
      const el = items[i].nativeElement;
      const current = this.currentSizes.get(el) ?? this.baseSize;
      let target = this.baseSize;

      if (this.isHovered && this.pointerCoord !== -9999) {
        const dist = Math.abs(this.pointerCoord - centers[i]);
        if (dist <= this.influenceRadius * 2.5) {
          const exponent = -(dist * dist) / (2 * this.influenceRadius * this.influenceRadius);
          target = this.baseSize * (1.0 + this.maxMagnification * Math.exp(exponent));
        }
      }

      const next = current + (target - current) * (this.isHovered ? 0.38 : 0.22);
      this.currentSizes.set(el, next);

      if (Math.abs(next - target) > 0.05) stillAnimating = true;

      const scale = next / this.baseSize;
      el.style.width = \`\${next.toFixed(2)}px\`;
      el.style.height = \`\${next.toFixed(2)}px\`;
      el.style.setProperty('--dock-scale', scale.toFixed(3));
    }

    if (this.isHovered || stillAnimating) {
      this.rafId = requestAnimationFrame(() => this.updateScales());
    } else {
      for (let i = 0; i < count; i++) {
        const el = items[i].nativeElement;
        el.style.width = \`\${this.baseSize}px\`;
        el.style.height = \`\${this.baseSize}px\`;
        el.style.setProperty('--dock-scale', '1.0');
        this.currentSizes.set(el, this.baseSize);
      }
      this.rafId = null;
    }
  }

  getDirectionClasses() {
    switch (this.direction) {
      case 'top': return 'flex-row items-start px-3 pt-2 pb-2';
      case 'left': return 'flex-col items-start py-3 pl-2 pr-2';
      case 'right': return 'flex-col items-end py-3 pr-2 pl-2';
      default: return 'flex-row items-end px-3 pb-2 pt-2';
    }
  }

  getTooltipClasses() {
    switch (this.direction) {
      case 'top': return 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2';
      case 'left': return 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2';
      case 'right': return 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2';
      default: return 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2';
    }
  }

  ngOnDestroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'FloatingDock.tsx',
					language: 'tsx',
					description: 'Floating Dock — SolidJS fine-grained reactivity with direct DOM manipulation and zero re-render overhead.',
					code: `import { createSignal, onCleanup, For, Component } from 'solid-js';

export interface DockItemData {
  title: string;
  href?: string;
  active?: boolean;
}

export interface FloatingDockProps {
  items: DockItemData[];
  direction?: 'bottom' | 'top' | 'left' | 'right';
  baseSize?: number;
  maxMagnification?: number;
  influenceRadius?: number;
}

export const FloatingDock: Component<FloatingDockProps> = (props) => {
  const direction = () => props.direction || '${direction}';
  const baseSize = () => props.baseSize || ${baseSize};
  const maxMagnification = () => props.maxMagnification || ${maxMagnification};
  const influenceRadius = () => props.influenceRadius || ${influenceRadius};

  const [activeTooltip, setActiveTooltip] = createSignal<string | null>(null);
  let elements: HTMLElement[] = [];
  let pointerCoord = -9999;
  let isHovered = false;
  let rafId: number | null = null;
  const currentSizes = new Map<HTMLElement, number>();

  function updateScales() {
    const count = elements.length;
    if (count === 0) {
      rafId = null;
      return;
    }

    const isHorizontal = direction() === 'bottom' || direction() === 'top';
    const centers = new Array(count);

    for (let i = 0; i < count; i++) {
      const rect = elements[i].getBoundingClientRect();
      centers[i] = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    }

    let stillAnimating = false;
    for (let i = 0; i < count; i++) {
      const el = elements[i];
      const current = currentSizes.get(el) ?? baseSize();
      let target = baseSize();

      if (isHovered && pointerCoord !== -9999) {
        const dist = Math.abs(pointerCoord - centers[i]);
        if (dist <= influenceRadius() * 2.5) {
          const exponent = -(dist * dist) / (2 * influenceRadius() * influenceRadius());
          target = baseSize() * (1.0 + maxMagnification() * Math.exp(exponent));
        }
      }

      const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
      currentSizes.set(el, next);

      if (Math.abs(next - target) > 0.05) stillAnimating = true;

      const scale = next / baseSize();
      el.style.width = \`\${next.toFixed(2)}px\`;
      el.style.height = \`\${next.toFixed(2)}px\`;
      el.style.setProperty('--dock-scale', scale.toFixed(3));
    }

    if (isHovered || stillAnimating) {
      rafId = requestAnimationFrame(updateScales);
    } else {
      for (let i = 0; i < count; i++) {
        const el = elements[i];
        el.style.width = \`\${baseSize()}px\`;
        el.style.height = \`\${baseSize()}px\`;
        el.style.setProperty('--dock-scale', '1.0');
        currentSizes.set(el, baseSize());
      }
      rafId = null;
    }
  }

  function handlePointerMove(e: PointerEvent) {
    isHovered = true;
    pointerCoord = direction() === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(updateScales);
  }

  function handlePointerLeave() {
    isHovered = false;
    pointerCoord = -9999;
    setActiveTooltip(null);
    if (rafId === null) rafId = requestAnimationFrame(updateScales);
  }

  onCleanup(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  });

  const directionClass = () => {
    switch (direction()) {
      case 'top': return 'flex-row items-start px-3 pt-2 pb-2';
      case 'left': return 'flex-col items-start py-3 pl-2 pr-2';
      case 'right': return 'flex-col items-end py-3 pr-2 pl-2';
      default: return 'flex-row items-end px-3 pb-2 pt-2';
    }
  };

  const tooltipClass = () => {
    switch (direction()) {
      case 'top': return 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2';
      case 'left': return 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2';
      case 'right': return 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2';
      default: return 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      onPointerEnter={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      class={\`relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none \${directionClass()}\`}
      style={direction() === 'bottom' || direction() === 'top' ? { height: \`\${baseSize() + 16}px\` } : { width: \`\${baseSize() + 16}px\` }}
      role="toolbar"
      aria-label="Application Dock"
    >
      <For each={props.items}>
        {(item, idx) => (
          <div
            ref={(el) => { if (el) elements[idx()] = el; }}
            onPointerEnter={() => setActiveTooltip(item.title)}
            onPointerLeave={() => setActiveTooltip(null)}
            class="relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
            style={{ width: \`\${baseSize()}px\`, height: \`\${baseSize()}px\` }}
          >
            {activeTooltip() === item.title && (
              <div
                role="tooltip"
                class={\`pointer-events-none absolute z-50 rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none \${tooltipClass()}\`}
              >
                {item.title}
              </div>
            )}

            <div class="relative z-10 flex size-full items-center justify-center">
              <span class="text-xs font-mono font-bold text-white">{item.title.slice(0, 2).toUpperCase()}</span>
            </div>
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

		case 'astro': {
			return [
				{
					filename: 'FloatingDock.astro',
					language: 'astro',
					description: 'Floating Dock — Astro component with self-hydrating client script and pure CSS/rAF magnification.',
					code: `---
interface DockItemData {
  title: string;
  href?: string;
  active?: boolean;
}

interface Props {
  items: DockItemData[];
  direction?: 'bottom' | 'top' | 'left' | 'right';
  baseSize?: number;
  maxMagnification?: number;
  influenceRadius?: number;
  class?: string;
}

const {
  items = [],
  direction = '${direction}',
  baseSize = ${baseSize},
  maxMagnification = ${maxMagnification},
  influenceRadius = ${influenceRadius},
  class: className = '',
} = Astro.props;

const directionClasses = {
  bottom: 'flex-row items-end px-3 pb-2 pt-2',
  top: 'flex-row items-start px-3 pt-2 pb-2',
  left: 'flex-col items-start py-3 pl-2 pr-2',
  right: 'flex-col items-end py-3 pr-2 pl-2',
}[direction];
---

<div
  class:list={['exhuma-dock relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none', directionClasses, className]}
  style={direction === 'bottom' || direction === 'top' ? \`height: \${baseSize + 16}px;\` : \`width: \${baseSize + 16}px;\`}
  data-direction={direction}
  data-base-size={baseSize}
  data-max-mag={maxMagnification}
  data-radius={influenceRadius}
  role="toolbar"
  aria-label="Application Dock"
>
  {items.map((item) => (
    <div
      class="exhuma-dock-item relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
      style="width: ${baseSize}px; height: ${baseSize}px;"
      data-title={item.title}
    >
      <div
        role="tooltip"
        class="exhuma-dock-tooltip pointer-events-none absolute z-50 hidden rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none"
      >
        {item.title}
      </div>

      <div class="exhuma-dock-icon relative z-10 flex size-full items-center justify-center overflow-hidden rounded-[inherit]">
        <span class="text-xs font-mono font-bold text-white">{item.title.slice(0, 2).toUpperCase()}</span>
      </div>
    </div>
  ))}
</div>

<script>
  function setupDocks() {
    document.querySelectorAll<HTMLElement>('.exhuma-dock').forEach((dock) => {
      const direction = dock.dataset.direction || 'bottom';
      const baseSize = parseFloat(dock.dataset.baseSize || '${baseSize}');
      const maxMag = parseFloat(dock.dataset.maxMag || '${maxMagnification}');
      const radius = parseFloat(dock.dataset.radius || '${influenceRadius}');
      const items = Array.from(dock.querySelectorAll<HTMLElement>('.exhuma-dock-item'));

      let pointerCoord = -9999;
      let isHovered = false;
      let rafId: number | null = null;
      const currentSizes = new Map<HTMLElement, number>();

      items.forEach((el) => {
        currentSizes.set(el, baseSize);
        const tooltip = el.querySelector<HTMLElement>('.exhuma-dock-tooltip');
        if (!tooltip) return;

        // Position tooltip according to direction
        if (direction === 'top') {
          tooltip.style.top = 'calc(100% + 12px)';
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
        } else if (direction === 'left') {
          tooltip.style.left = 'calc(100% + 12px)';
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
        } else if (direction === 'right') {
          tooltip.style.right = 'calc(100% + 12px)';
          tooltip.style.top = '50%';
          tooltip.style.transform = 'translateY(-50%)';
        } else {
          tooltip.style.bottom = 'calc(100% + 12px)';
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
        }

        el.addEventListener('pointerenter', () => (tooltip.style.display = 'block'));
        el.addEventListener('pointerleave', () => (tooltip.style.display = 'none'));
      });

      function update() {
        const isHorizontal = direction === 'bottom' || direction === 'top';
        const centers = items.map((el) => {
          const rect = el.getBoundingClientRect();
          return isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
        });

        let stillAnimating = false;
        items.forEach((el, i) => {
          const current = currentSizes.get(el) ?? baseSize;
          let target = baseSize;

          if (isHovered && pointerCoord !== -9999) {
            const dist = Math.abs(pointerCoord - centers[i]);
            if (dist <= radius * 2.5) {
              const exponent = -(dist * dist) / (2 * radius * radius);
              target = baseSize * (1.0 + maxMag * Math.exp(exponent));
            }
          }

          const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
          currentSizes.set(el, next);

          if (Math.abs(next - target) > 0.05) stillAnimating = true;

          const scale = next / baseSize;
          el.style.width = \`\${next.toFixed(2)}px\`;
          el.style.height = \`\${next.toFixed(2)}px\`;
          el.style.setProperty('--dock-scale', scale.toFixed(3));
        });

        if (isHovered || stillAnimating) {
          rafId = requestAnimationFrame(update);
        } else {
          items.forEach((el) => {
            el.style.width = \`\${baseSize}px\`;
            el.style.height = \`\${baseSize}px\`;
            el.style.setProperty('--dock-scale', '1.0');
            currentSizes.set(el, baseSize);
          });
          rafId = null;
        }
      }

      dock.addEventListener('pointerenter', (e) => {
        isHovered = true;
        pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
        if (rafId === null) rafId = requestAnimationFrame(update);
      });

      dock.addEventListener('pointermove', (e) => {
        isHovered = true;
        pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
        if (rafId === null) rafId = requestAnimationFrame(update);
      });

      dock.addEventListener('pointerleave', () => {
        isHovered = false;
        pointerCoord = -9999;
        if (rafId === null) rafId = requestAnimationFrame(update);
      });
    });
  }

  setupDocks();
  document.addEventListener('astro:page-load', setupDocks);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'floating-dock.blade.php',
					language: 'php',
					description: 'Floating Dock — Laravel Blade component with Alpine.js or native JS controller and directional tooltips.',
					code: `@props([
    'items' => [],
    'direction' => '${direction}',
    'baseSize' => ${baseSize},
    'maxMagnification' => ${maxMagnification},
    'influenceRadius' => ${influenceRadius},
])

@php
    $directionClasses = match($direction) {
        'top' => 'flex-row items-start px-3 pt-2 pb-2',
        'left' => 'flex-col items-start py-3 pl-2 pr-2',
        'right' => 'flex-col items-end py-3 pr-2 pl-2',
        default => 'flex-row items-end px-3 pb-2 pt-2',
    };

    $tooltipClasses = match($direction) {
        'top' => 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2',
        'left' => 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2',
        'right' => 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2',
        default => 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
    };

    $crossAxisStyle = ($direction === 'bottom' || $direction === 'top')
        ? 'height: ' . ($baseSize + 16) . 'px;'
        : 'width: ' . ($baseSize + 16) . 'px;';
@endphp

<div
    {{ $attributes->merge(['class' => 'exhuma-dock relative inline-flex gap-2 sm:gap-2.5 max-w-[calc(100vw-24px)] rounded-full border border-white/20 bg-background/60 dark:border-white/10 dark:bg-card/50 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.35)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150 select-none touch-none ' . $directionClasses]) }}
    style="{{ $crossAxisStyle }}"
    data-direction="{{ $direction }}"
    data-base-size="{{ $baseSize }}"
    data-max-mag="{{ $maxMagnification }}"
    data-radius="{{ $influenceRadius }}"
    role="toolbar"
    aria-label="Application Dock"
>
    @foreach ($items as $item)
        <div
            class="exhuma-dock-item relative flex shrink-0 items-center justify-center rounded-full cursor-pointer"
            style="width: {{ $baseSize }}px; height: {{ $baseSize }}px;"
            data-title="{{ $item['title'] ?? '' }}"
        >
            <div
                role="tooltip"
                class="exhuma-dock-tooltip pointer-events-none absolute z-50 hidden rounded-full border border-border/60 bg-popover/90 px-3 py-1 font-sans text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-2xl whitespace-nowrap select-none touch-none {{ $tooltipClasses }}"
            >
                {{ $item['title'] ?? '' }}
            </div>

            <div class="exhuma-dock-icon relative z-10 flex size-full items-center justify-center overflow-hidden rounded-[inherit]">
                <span class="text-xs font-mono font-bold text-white">{{ strtoupper(substr($item['title'] ?? 'AP', 0, 2)) }}</span>
            </div>
        </div>
    @endforeach
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.exhuma-dock').forEach((dock) => {
            const direction = dock.dataset.direction || 'bottom';
            const baseSize = parseFloat(dock.dataset.baseSize || '{{ $baseSize }}');
            const maxMag = parseFloat(dock.dataset.maxMag || '{{ $maxMagnification }}');
            const radius = parseFloat(dock.dataset.radius || '{{ $influenceRadius }}');
            const items = Array.from(dock.querySelectorAll('.exhuma-dock-item'));

            let pointerCoord = -9999;
            let isHovered = false;
            let rafId = null;
            const currentSizes = new Map();

            items.forEach((el) => {
                currentSizes.set(el, baseSize);
                const tooltip = el.querySelector('.exhuma-dock-tooltip');
                if (tooltip) {
                    el.addEventListener('pointerenter', () => (tooltip.style.display = 'block'));
                    el.addEventListener('pointerleave', () => (tooltip.style.display = 'none'));
                }
            });

            function update() {
                const isHorizontal = direction === 'bottom' || direction === 'top';
                const centers = items.map((el) => {
                    const rect = el.getBoundingClientRect();
                    return isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
                });

                let stillAnimating = false;
                items.forEach((el, i) => {
                    const current = currentSizes.get(el) ?? baseSize;
                    let target = baseSize;

                    if (isHovered && pointerCoord !== -9999) {
                        const dist = Math.abs(pointerCoord - centers[i]);
                        if (dist <= radius * 2.5) {
                            const exponent = -(dist * dist) / (2 * radius * radius);
                            target = baseSize * (1.0 + maxMag * Math.exp(exponent));
                        }
                    }

                    const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
                    currentSizes.set(el, next);

                    if (Math.abs(next - target) > 0.05) stillAnimating = true;

                    const scale = next / baseSize;
                    el.style.width = next.toFixed(2) + 'px';
                    el.style.height = next.toFixed(2) + 'px';
                    el.style.setProperty('--dock-scale', scale.toFixed(3));
                });

                if (isHovered || stillAnimating) {
                    rafId = requestAnimationFrame(update);
                } else {
                    items.forEach((el) => {
                        el.style.width = baseSize + 'px';
                        el.style.height = baseSize + 'px';
                        el.style.setProperty('--dock-scale', '1.0');
                        currentSizes.set(el, baseSize);
                    });
                    rafId = null;
                }
            }

            dock.addEventListener('pointerenter', (e) => {
                isHovered = true;
                pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
                if (rafId === null) rafId = requestAnimationFrame(update);
            });

            dock.addEventListener('pointermove', (e) => {
                isHovered = true;
                pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
                if (rafId === null) rafId = requestAnimationFrame(update);
            });

            dock.addEventListener('pointerleave', () => {
                isHovered = false;
                pointerCoord = -9999;
                if (rafId === null) rafId = requestAnimationFrame(update);
            });
        });
    });
</script>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'floating-dock.js',
					language: 'javascript',
					description: 'Floating Dock — Vanilla JavaScript ESM module with zero dependencies.',
					code: `/**
 * Floating Dock — Vanilla JS ESM
 * Continuous cosine proximity application dock with separated read/write rAF loops.
 */
export function initFloatingDock(container, options = {}) {
  const direction = options.direction || '${direction}';
  const baseSize = options.baseSize || ${baseSize};
  const maxMag = options.maxMagnification || ${maxMagnification};
  const radius = options.influenceRadius || ${influenceRadius};

  const items = Array.from(container.querySelectorAll('.exhuma-dock-item'));
  let pointerCoord = -9999;
  let isHovered = false;
  let rafId = null;
  const currentSizes = new Map();

  items.forEach((el) => {
    currentSizes.set(el, baseSize);
    const tooltip = el.querySelector('.exhuma-dock-tooltip');
    if (!tooltip) return;

    if (direction === 'top') {
      tooltip.style.top = 'calc(100% + 12px)';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
    } else if (direction === 'left') {
      tooltip.style.left = 'calc(100% + 12px)';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translateY(-50%)';
    } else if (direction === 'right') {
      tooltip.style.right = 'calc(100% + 12px)';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translateY(-50%)';
    } else {
      tooltip.style.bottom = 'calc(100% + 12px)';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
    }

    el.addEventListener('pointerenter', () => (tooltip.style.display = 'block'));
    el.addEventListener('pointerleave', () => (tooltip.style.display = 'none'));
  });

  function update() {
    const isHorizontal = direction === 'bottom' || direction === 'top';
    const centers = items.map((el) => {
      const rect = el.getBoundingClientRect();
      return isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
    });

    let stillAnimating = false;
    items.forEach((el, i) => {
      const current = currentSizes.get(el) ?? baseSize;
      let target = baseSize;

      if (isHovered && pointerCoord !== -9999) {
        const dist = Math.abs(pointerCoord - centers[i]);
        if (dist <= radius * 2.5) {
          const exponent = -(dist * dist) / (2 * radius * radius);
          target = baseSize * (1.0 + maxMag * Math.exp(exponent));
        }
      }

      const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
      currentSizes.set(el, next);

      if (Math.abs(next - target) > 0.05) stillAnimating = true;

      const scale = next / baseSize;
      el.style.width = \`\${next.toFixed(2)}px\`;
      el.style.height = \`\${next.toFixed(2)}px\`;
      el.style.setProperty('--dock-scale', scale.toFixed(3));
    });

    if (isHovered || stillAnimating) {
      rafId = requestAnimationFrame(update);
    } else {
      items.forEach((el) => {
        el.style.width = \`\${baseSize}px\`;
        el.style.height = \`\${baseSize}px\`;
        el.style.setProperty('--dock-scale', '1.0');
        currentSizes.set(el, baseSize);
      });
      rafId = null;
    }
  }

  container.addEventListener('pointerenter', (e) => {
    isHovered = true;
    pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(update);
  });

  container.addEventListener('pointermove', (e) => {
    isHovered = true;
    pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
    if (rafId === null) rafId = requestAnimationFrame(update);
  });

  container.addEventListener('pointerleave', () => {
    isHovered = false;
    pointerCoord = -9999;
    if (rafId === null) rafId = requestAnimationFrame(update);
  });

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  };
}
`,
				},
				{
					filename: 'floating-dock.css',
					language: 'css',
					description: 'Floating Dock — CSS Styles for Vanilla JS implementation.',
					code: `.exhuma-dock {
  display: inline-flex;
  gap: 0.625rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(23, 23, 23, 0.6);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: relative;
}

.exhuma-dock[data-direction='bottom'] {
  flex-direction: row;
  align-items: flex-end;
  height: calc(${baseSize}px + 16px);
  padding: 0.5rem 0.75rem;
}

.exhuma-dock[data-direction='top'] {
  flex-direction: row;
  align-items: flex-start;
  height: calc(${baseSize}px + 16px);
  padding: 0.5rem 0.75rem;
}

.exhuma-dock[data-direction='left'] {
  flex-direction: column;
  align-items: flex-start;
  width: calc(${baseSize}px + 16px);
  padding: 0.75rem 0.5rem;
}

.exhuma-dock[data-direction='right'] {
  flex-direction: column;
  align-items: flex-end;
  width: calc(${baseSize}px + 16px);
  padding: 0.75rem 0.5rem;
}

.exhuma-dock-item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 1.125rem;
  cursor: pointer;
  will-change: width, height;
}

.exhuma-dock-tooltip {
  position: absolute;
  z-index: 50;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(23, 23, 23, 0.9);
  padding: 0.25rem 0.75rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: #f5f5f5;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(16px);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
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
					description: 'WordPress Gutenberg block metadata for Floating Dock.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/floating-dock",
  "version": "1.0.0",
  "title": "Floating Dock",
  "category": "widgets",
  "description": "High-performance kinetic floating application dock with continuous cosine proximity distribution.",
  "attributes": {
    "direction": { "type": "string", "default": "${direction}" },
    "baseSize": { "type": "number", "default": ${baseSize} },
    "maxMagnification": { "type": "number", "default": ${maxMagnification} },
    "influenceRadius": { "type": "number", "default": ${influenceRadius} }
  },
  "editorScript": "file:./index.js",
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress PHP render template for Floating Dock.',
					code: `<?php
$direction = $attributes['direction'] ?? '${direction}';
$baseSize = $attributes['baseSize'] ?? ${baseSize};
$maxMag = $attributes['maxMagnification'] ?? ${maxMagnification};
$radius = $attributes['influenceRadius'] ?? ${influenceRadius};
?>
<div
  class="exhuma-dock"
  data-direction="<?php echo esc_attr($direction); ?>"
  data-base-size="<?php echo esc_attr($baseSize); ?>"
  data-max-mag="<?php echo esc_attr($maxMag); ?>"
  data-radius="<?php echo esc_attr($radius); ?>"
  role="toolbar"
  aria-label="Application Dock"
>
  <?php echo $content; ?>
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'floating-dock.js',
					language: 'javascript',
					description: 'Floating Dock — W3C Custom Element (<exhuma-floating-dock>) with encapsulated kinetic magnification.',
					code: `class ExhumaFloatingDock extends HTMLElement {
  connectedCallback() {
    const direction = this.getAttribute('direction') || '${direction}';
    const baseSize = parseFloat(this.getAttribute('base-size') || '${baseSize}');
    const maxMag = parseFloat(this.getAttribute('max-magnification') || '${maxMagnification}');
    const radius = parseFloat(this.getAttribute('influence-radius') || '${influenceRadius}');

    this.classList.add('exhuma-dock');
    this.dataset.direction = direction;

    const items = Array.from(this.querySelectorAll('.exhuma-dock-item'));
    let pointerCoord = -9999;
    let isHovered = false;
    let rafId = null;
    const currentSizes = new Map();

    items.forEach((el) => {
      currentSizes.set(el, baseSize);
      const tooltip = el.querySelector('.exhuma-dock-tooltip');
      if (!tooltip) return;

      if (direction === 'top') {
        tooltip.style.top = 'calc(100% + 12px)';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      } else if (direction === 'left') {
        tooltip.style.left = 'calc(100% + 12px)';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
      } else if (direction === 'right') {
        tooltip.style.right = 'calc(100% + 12px)';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
      } else {
        tooltip.style.bottom = 'calc(100% + 12px)';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      }

      el.addEventListener('pointerenter', () => (tooltip.style.display = 'block'));
      el.addEventListener('pointerleave', () => (tooltip.style.display = 'none'));
    });

    const update = () => {
      const isHorizontal = direction === 'bottom' || direction === 'top';
      const centers = items.map((el) => {
        const rect = el.getBoundingClientRect();
        return isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
      });

      let stillAnimating = false;
      items.forEach((el, i) => {
        const current = currentSizes.get(el) ?? baseSize;
        let target = baseSize;

        if (isHovered && pointerCoord !== -9999) {
          const dist = Math.abs(pointerCoord - centers[i]);
          if (dist <= radius * 2.5) {
            const exponent = -(dist * dist) / (2 * radius * radius);
            target = baseSize * (1.0 + maxMag * Math.exp(exponent));
          }
        }

        const next = current + (target - current) * (isHovered ? 0.38 : 0.22);
        currentSizes.set(el, next);

        if (Math.abs(next - target) > 0.05) stillAnimating = true;

        const scale = next / baseSize;
        el.style.width = \`\${next.toFixed(2)}px\`;
        el.style.height = \`\${next.toFixed(2)}px\`;
        el.style.setProperty('--dock-scale', scale.toFixed(3));
      });

      if (isHovered || stillAnimating) {
        rafId = requestAnimationFrame(update);
      } else {
        items.forEach((el) => {
          el.style.width = \`\${baseSize}px\`;
          el.style.height = \`\${baseSize}px\`;
          el.style.setProperty('--dock-scale', '1.0');
          currentSizes.set(el, baseSize);
        });
        rafId = null;
      }
    };

    this._update = update;
    this._onEnter = (e) => {
      isHovered = true;
      pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    this._onMove = (e) => {
      isHovered = true;
      pointerCoord = direction === 'bottom' || direction === 'top' ? e.clientX : e.clientY;
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    this._onLeave = () => {
      isHovered = false;
      pointerCoord = -9999;
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    this.addEventListener('pointerenter', this._onEnter);
    this.addEventListener('pointermove', this._onMove);
    this.addEventListener('pointerleave', this._onLeave);
  }

  disconnectedCallback() {
    if (this._onEnter) this.removeEventListener('pointerenter', this._onEnter);
    if (this._onMove) this.removeEventListener('pointermove', this._onMove);
    if (this._onLeave) this.removeEventListener('pointerleave', this._onLeave);
  }
}

if (!customElements.get('exhuma-floating-dock')) {
  customElements.define('exhuma-floating-dock', ExhumaFloatingDock);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'FloatingDock.tsx',
					language: 'tsx',
					description: 'Floating Dock — React Native component using Animated API and PanResponder for touch gestures.',
					code: `import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text } from 'react-native';

export interface DockItemData {
  title: string;
  active?: boolean;
}

export interface FloatingDockProps {
  items: DockItemData[];
  baseSize?: number;
  maxMagnification?: number;
  influenceRadius?: number;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  items,
  baseSize = ${baseSize},
  maxMagnification = ${maxMagnification},
  influenceRadius = ${influenceRadius},
}) => {
  const scales = useRef(items.map(() => new Animated.Value(1.0))).current;
  const containerRef = useRef<View>(null);
  const containerX = useRef<number>(0);

  const updateScales = (touchX: number) => {
    items.forEach((_, idx) => {
      const itemCenter = containerX.current + 12 + idx * (baseSize + 10) + baseSize / 2;
      const distance = Math.abs(touchX - itemCenter);
      let targetScale = 1.0;
      if (influenceRadius > 0 && distance < influenceRadius) {
        const factor = Math.cos((distance / influenceRadius) * (Math.PI / 2));
        targetScale = 1.0 + maxMagnification * factor * factor;
      }
      Animated.spring(scales[idx], {
        toValue: targetScale,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateScales(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateScales(evt.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {
        items.forEach((_, idx) => {
          Animated.spring(scales[idx], {
            toValue: 1.0,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }).start();
        });
      },
    })
  ).current;

  return (
    <View
      ref={containerRef}
      onLayout={() => {
        containerRef.current?.measure((_x, _y, _width, _height, pageX) => {
          containerX.current = pageX;
        });
      }}
      style={styles.dockContainer}
      {...panResponder.panHandlers}
    >
      {items.map((item, idx) => (
        <Animated.View
          key={item.title}
          style={[
            styles.dockItem,
            {
              width: baseSize,
              height: baseSize,
              transform: [{ scale: scales[idx] }],
            },
          ]}
        >
          <Text style={styles.iconText}>{item.title.slice(0, 2).toUpperCase()}</Text>
          {item.active && <View style={styles.activeDot} />}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(23, 23, 23, 0.75)',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dockItem: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e5e5',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'floating_dock.dart',
					language: 'dart',
					description: 'Floating Dock — Flutter widget with MouseRegion and AnimatedContainer for smooth magnification.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class DockItemData {
  final String title;
  final IconData icon;
  final bool active;

  const DockItemData({
    required this.title,
    required this.icon,
    this.active = false,
  });
}

class ExhumaFloatingDock extends StatefulWidget {
  final List<DockItemData> items;
  final String direction;
  final double baseSize;
  final double maxMagnification;
  final double influenceRadius;

  const ExhumaFloatingDock({
    Key? key,
    required this.items,
    this.direction = '${direction}',
    this.baseSize = ${baseSize}.0,
    this.maxMagnification = ${maxMagnification},
    this.influenceRadius = ${influenceRadius}.0,
  }) : super(key: key);

  @override
  State<ExhumaFloatingDock> createState() => _ExhumaFloatingDockState();
}

class _ExhumaFloatingDockState extends State<ExhumaFloatingDock> {
  double? _hoverCoord;

  @override
  Widget build(BuildContext context) {
    final isHorizontal = widget.direction == 'bottom' || widget.direction == 'top';

    return MouseRegion(
      onHover: (event) {
        setState(() {
          _hoverCoord = isHorizontal ? event.localPosition.dx : event.localPosition.dy;
        });
      },
      onExit: (_) {
        setState(() {
          _hoverCoord = null;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.65),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.4),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: isHorizontal
            ? Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: widget.direction == 'top' ? CrossAxisAlignment.start : CrossAxisAlignment.end,
                children: _buildItems(isHorizontal),
              )
            : Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: widget.direction == 'left' ? CrossAxisAlignment.start : CrossAxisAlignment.end,
                children: _buildItems(isHorizontal),
              ),
      ),
    );
  }

  List<Widget> _buildItems(bool isHorizontal) {
    return List.generate(widget.items.length, (index) {
      final item = widget.items[index];
      double scale = 1.0;

      if (_hoverCoord != null) {
        final itemCenter = (index * (widget.baseSize + 10)) + widget.baseSize / 2;
        final dist = (_hoverCoord! - itemCenter).abs();
        if (dist <= widget.influenceRadius * 2.5) {
          final exponent = -(dist * dist) / (2 * widget.influenceRadius * widget.influenceRadius);
          scale = 1.0 + widget.maxMagnification * math.exp(exponent);
        }
      }

      final size = widget.baseSize * scale;

      return Padding(
        padding: const EdgeInsets.all(4.0),
        child: Tooltip(
          message: item.title,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 100),
            curve: Curves.easeOut,
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(item.icon, color: Colors.white, size: 20 * scale),
                if (item.active)
                  Positioned(
                    bottom: 2,
                    child: Container(
                      width: 4,
                      height: 4,
                      decoration: const BoxDecoration(
                        color: Colors.white70,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      );
    });
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

export function getFloatingDockUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const direction = (props.direction as string) || 'bottom';
	const baseSize = Number(props.baseSize ?? 44);
	const maxMagnification = Number(props.maxMagnification ?? 0.65);
	const influenceRadius = Number(props.influenceRadius ?? 85);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'AppNavigationDock.tsx',
				language: 'tsx',
				description: 'Next.js App Router component rendering FloatingDock application navigation bar.',
				code: `'use client';

import React from 'react';
import { FloatingDock, type FloatingDockItemData } from '@/components/ui/FloatingDock';
import {
  IconLayoutDashboard as Dashboard,
  IconFolders as Projects,
  IconChartBar as Analytics,
  IconDatabase as Database,
  IconTerminal2 as Terminal,
  IconSettings as Settings,
} from '@tabler/icons-react';

const DOCK_ITEMS: FloatingDockItemData[] = [
  { title: 'Dashboard', icon: <Dashboard className="size-5 text-primary" />, active: true },
  { title: 'Projects', icon: <Projects className="size-5 text-muted-foreground" />, active: false },
  { title: 'Analytics', icon: <Analytics className="size-5 text-muted-foreground" />, active: false },
  { title: 'Database', icon: <Database className="size-5 text-muted-foreground" />, active: false },
  { title: 'Terminal', icon: <Terminal className="size-5 text-muted-foreground" />, active: false },
  { title: 'Settings', icon: <Settings className="size-5 text-muted-foreground" />, active: false },
];

export default function AppNavigationPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-8 bg-background text-foreground overflow-hidden">
      <div className="text-center pt-12">
        <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
          Application Navigation
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2 sm:text-4xl">
          Kinetic Floating Dock
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Continuous C¹ cosine proximity scaling, zero layout shift, and orientation-aware popover tooltips.
        </p>
      </div>

      <div className="w-full flex items-center justify-center pb-8">
        <FloatingDock
          direction="${direction}"
          baseSize={${baseSize}}
          maxMagnification={${maxMagnification}}
          influenceRadius={${influenceRadius}}
          items={DOCK_ITEMS}
        />
      </div>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'AppDockSection.tsx',
				language: 'tsx',
				description: 'React component rendering FloatingDock with application navigation items.',
				code: `import React from 'react';
import { FloatingDock, type FloatingDockItemData } from '@/components/ui/FloatingDock';
import {
  IconLayoutDashboard as Dashboard,
  IconFolders as Projects,
  IconChartBar as Analytics,
  IconDatabase as Database,
  IconTerminal2 as Terminal,
  IconSettings as Settings,
} from '@tabler/icons-react';

const DOCK_ITEMS: FloatingDockItemData[] = [
  { title: 'Dashboard', icon: <Dashboard className="size-5 text-primary" />, active: true },
  { title: 'Projects', icon: <Projects className="size-5 text-muted-foreground" />, active: false },
  { title: 'Analytics', icon: <Analytics className="size-5 text-muted-foreground" />, active: false },
  { title: 'Database', icon: <Database className="size-5 text-muted-foreground" />, active: false },
  { title: 'Terminal', icon: <Terminal className="size-5 text-muted-foreground" />, active: false },
  { title: 'Settings', icon: <Settings className="size-5 text-muted-foreground" />, active: false },
];

export function AppDockSection() {
  return (
    <section className="flex flex-col items-center justify-center py-12">
      <FloatingDock
        direction="${direction}"
        baseSize={${baseSize}}
        maxMagnification={${maxMagnification}}
        influenceRadius={${influenceRadius}}
        items={DOCK_ITEMS}
      />
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'AppDock.vue',
				language: 'vue',
				description: 'Vue 3 component implementing FloatingDock application navigation.',
				code: `<script setup lang="ts">
import FloatingDock from '@/components/ui/FloatingDock.vue';

const dockItems = [
  { title: 'Dashboard', active: true },
  { title: 'Projects', active: false },
  { title: 'Analytics', active: false },
  { title: 'Database', active: false },
  { title: 'Terminal', active: false },
  { title: 'Settings', active: false },
];
</script>

<template>
  <div class="flex justify-center p-8">
    <FloatingDock
      direction="${direction}"
      :base-size="${baseSize}"
      :max-magnification="${maxMagnification}"
      :influence-radius="${influenceRadius}"
      :items="dockItems"
    />
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'AppDock.svelte',
				language: 'svelte',
				description: 'Svelte 5 component implementing FloatingDock application navigation.',
				code: `<script lang="ts">
  import FloatingDock from '$lib/components/ui/FloatingDock.svelte';

  const dockItems = [
    { title: 'Dashboard', active: true },
    { title: 'Projects', active: false },
    { title: 'Analytics', active: false },
    { title: 'Database', active: false },
    { title: 'Terminal', active: false },
    { title: 'Settings', active: false },
  ];
</script>

<div class="flex justify-center p-8">
  <FloatingDock
    direction="${direction}"
    baseSize={${baseSize}}
    maxMagnification={${maxMagnification}}
    influenceRadius={${influenceRadius}}
    items={dockItems}
  />
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'app-dock.component.ts',
				language: 'typescript',
				description: 'Angular 18+ component implementing FloatingDock application navigation.',
				code: `import { Component } from '@angular/core';
import { FloatingDockComponent, DockItemData } from './floating-dock.component';

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [FloatingDockComponent],
  template: \`
    <div class="flex justify-center p-8">
      <exhuma-floating-dock
        direction="${direction}"
        [baseSize]="${baseSize}"
        [maxMagnification]="${maxMagnification}"
        [influenceRadius]="${influenceRadius}"
        [items]="dockItems"
      />
    </div>
  \`,
})
export class AppDockComponent {
  dockItems: DockItemData[] = [
    { title: 'Dashboard', active: true },
    { title: 'Projects', active: false },
    { title: 'Analytics', active: false },
    { title: 'Database', active: false },
    { title: 'Terminal', active: false },
    { title: 'Settings', active: false },
  ];
}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'AppDock.tsx',
				language: 'tsx',
				description: 'SolidJS component implementing FloatingDock application navigation.',
				code: `import { Component } from 'solid-js';
import { FloatingDock } from './FloatingDock';

const DOCK_ITEMS = [
  { title: 'Dashboard', active: true },
  { title: 'Projects', active: false },
  { title: 'Analytics', active: false },
  { title: 'Database', active: false },
  { title: 'Terminal', active: false },
  { title: 'Settings', active: false },
];

export const AppDockSection: Component = () => {
  return (
    <div class="flex justify-center p-8">
      <FloatingDock
        direction="${direction}"
        baseSize={${baseSize}}
        maxMagnification={${maxMagnification}}
        influenceRadius={${influenceRadius}}
        items={DOCK_ITEMS}
      />
    </div>
  );
};
`,
			};
		}

		case 'astro': {
			return {
				filename: 'AppDock.astro',
				language: 'astro',
				description: 'Astro component implementing FloatingDock application navigation.',
				code: `---
import FloatingDock from '@/components/ui/FloatingDock.astro';

const dockItems = [
  { title: 'Dashboard', active: true },
  { title: 'Projects', active: false },
  { title: 'Analytics', active: false },
  { title: 'Database', active: false },
  { title: 'Terminal', active: false },
  { title: 'Settings', active: false },
];
---

<div class="flex justify-center p-8">
  <FloatingDock
    direction="${direction}"
    baseSize={${baseSize}}
    maxMagnification={${maxMagnification}}
    influenceRadius={${influenceRadius}}
    items={dockItems}
  />
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'app-dock.blade.php',
				language: 'php',
				description: 'Laravel Blade view implementing FloatingDock application navigation.',
				code: `@php
$dockItems = [
    ['title' => 'Dashboard', 'active' => true],
    ['title' => 'Projects', 'active' => false],
    ['title' => 'Analytics', 'active' => false],
    ['title' => 'Database', 'active' => false],
    ['title' => 'Terminal', 'active' => false],
    ['title' => 'Settings', 'active' => false],
];
@endphp

<div class="flex justify-center p-8">
    <x-floating-dock
        direction="${direction}"
        :baseSize="${baseSize}"
        :maxMagnification="${maxMagnification}"
        :influenceRadius="${influenceRadius}"
        :items="$dockItems"
    />
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML and JavaScript implementing FloatingDock application navigation.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="./floating-dock.css">
  <style>
    body {
      background: #09090b;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
  </style>
</head>
<body>
  <div
    id="dock"
    class="exhuma-dock"
    data-direction="${direction}"
    data-base-size="${baseSize}"
    data-max-mag="${maxMagnification}"
    data-radius="${influenceRadius}"
  >
    <div class="exhuma-dock-item" data-title="Dashboard">
      <div class="exhuma-dock-tooltip">Dashboard</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">DA</span>
    </div>
    <div class="exhuma-dock-item" data-title="Projects">
      <div class="exhuma-dock-tooltip">Projects</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">PR</span>
    </div>
    <div class="exhuma-dock-item" data-title="Analytics">
      <div class="exhuma-dock-tooltip">Analytics</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">AN</span>
    </div>
    <div class="exhuma-dock-item" data-title="Database">
      <div class="exhuma-dock-tooltip">Database</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">DB</span>
    </div>
    <div class="exhuma-dock-item" data-title="Terminal">
      <div class="exhuma-dock-tooltip">Terminal</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">TE</span>
    </div>
    <div class="exhuma-dock-item" data-title="Settings">
      <div class="exhuma-dock-tooltip">Settings</div>
      <span style="color:#fff; font-family:monospace; font-weight:bold;">SE</span>
    </div>
  </div>

  <script type="module">
    import { initFloatingDock } from './floating-dock.js';
    initFloatingDock(document.getElementById('dock'));
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'block-template.html',
				language: 'html',
				description: 'WordPress block template for Floating Dock.',
				code: `<!-- wp:exhuma/floating-dock {"direction":"${direction}","baseSize":${baseSize},"maxMagnification":${maxMagnification},"influenceRadius":${influenceRadius}} -->
<div class="exhuma-dock" data-direction="${direction}">
  <div class="exhuma-dock-item"><span class="text-white">DA</span></div>
  <div class="exhuma-dock-item"><span class="text-white">PR</span></div>
  <div class="exhuma-dock-item"><span class="text-white">AN</span></div>
  <div class="exhuma-dock-item"><span class="text-white">DB</span></div>
  <div class="exhuma-dock-item"><span class="text-white">TE</span></div>
  <div class="exhuma-dock-item"><span class="text-white">SE</span></div>
</div>
<!-- /wp:exhuma/floating-dock -->
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Web Component usage of <exhuma-floating-dock>.',
				code: `<script type="module" src="./floating-dock.js"></script>

<div style="display:flex; justify-content:center; padding: 2rem;">
  <exhuma-floating-dock
    direction="${direction}"
    base-size="${baseSize}"
    max-magnification="${maxMagnification}"
    influence-radius="${influenceRadius}"
  >
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Dashboard</div>
      <span style="color:#fff;">DA</span>
    </div>
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Projects</div>
      <span style="color:#fff;">PR</span>
    </div>
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Analytics</div>
      <span style="color:#fff;">AN</span>
    </div>
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Database</div>
      <span style="color:#fff;">DB</span>
    </div>
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Terminal</div>
      <span style="color:#fff;">TE</span>
    </div>
    <div class="exhuma-dock-item">
      <div class="exhuma-dock-tooltip">Settings</div>
      <span style="color:#fff;">SE</span>
    </div>
  </exhuma-floating-dock>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native usage of FloatingDock.',
				code: `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FloatingDock } from './components/FloatingDock';

export default function App() {
  const items = [
    { title: 'Dashboard', active: true },
    { title: 'Projects', active: false },
    { title: 'Analytics', active: false },
    { title: 'Database', active: false },
    { title: 'Terminal', active: false },
    { title: 'Settings', active: false },
  ];

  return (
    <View style={styles.container}>
      <FloatingDock items={items} baseSize={${baseSize}} maxMagnification={${maxMagnification}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'main.dart',
				language: 'dart',
				description: 'Flutter application usage of ExhumaFloatingDock.',
				code: `import 'package:flutter/material.dart';
import 'floating_dock.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: const Color(0xFF09090B),
        body: Center(
          child: ExhumaFloatingDock(
            direction: '${direction}',
            baseSize: ${baseSize}.0,
            maxMagnification: ${maxMagnification},
            influenceRadius: ${influenceRadius}.0,
            items: const [
              DockItemData(title: 'Dashboard', icon: Icons.dashboard, active: true),
              DockItemData(title: 'Projects', icon: Icons.folder, active: false),
              DockItemData(title: 'Analytics', icon: Icons.bar_chart, active: false),
              DockItemData(title: 'Database', icon: Icons.storage, active: false),
              DockItemData(title: 'Terminal', icon: Icons.terminal, active: false),
              DockItemData(title: 'Settings', icon: Icons.settings, active: false),
            ],
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
				filename: 'FloatingDock.tsx',
				language: 'tsx',
				description: 'Default FloatingDock usage.',
				code: '// FloatingDock usage example',
			};
	}
}
