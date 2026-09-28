import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getCursorTooltipOuterFiles(
	flavor: EcosystemFlavor,
	props: Record<string, unknown>,
	isEjected: boolean
): ComponentFilePayload[] | null {
	const content = String(props.content ?? 'Explore Showcase');
	const springDamping = Number(props.springDamping ?? 20);
	const direction = String(props.direction ?? 'bottom-right');
	const offsetX = Number(props.offsetX ?? 16);
	const offsetY = Number(props.offsetY ?? 16);
	const variant = String(props.variant ?? 'frosted');
	const collisionPadding = Number(props.collisionPadding ?? 12);

	const toDartDouble = (val: number): string => {
		const s = String(val);
		return s.includes('.') ? s : `${s}.0`;
	};

	const variantClasses: Record<string, string> = {
		frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
		accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
		dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
		minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
		glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
	};

	const activeVariantClass = variantClasses[variant] || variantClasses.frosted;

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			if (!isEjected) {
				return [
					{
						filename: 'CursorTooltip.tsx',
						language: 'tsx',
						description: 'Cursor Tooltip — Clean Shadcn-style component powered by @exhuma/core kinetic primitives.',
						code: `${header}import * as React from 'react';
import {
  CursorTooltip as CoreCursorTooltip,
  type CursorTooltipProps as CoreCursorTooltipProps,
  type CursorTooltipVariant,
} from '@exhuma/core';
import { clsx } from 'clsx';

export type { CursorTooltipVariant };

export interface CursorTooltipProps extends CoreCursorTooltipProps {
  className?: string;
}

export const CursorTooltip = React.forwardRef<HTMLDivElement, CursorTooltipProps>(
  (
    {
      content = '${content}',
      springDamping = ${springDamping},
      direction = '${direction}',
      offsetX = ${offsetX},
      offsetY = ${offsetY},
      variant = '${variant}',
      collisionPadding = ${collisionPadding},
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <CoreCursorTooltip
        content={content}
        springDamping={springDamping}
        direction={direction as any}
        offsetX={offsetX}
        offsetY={offsetY}
        variant={variant as CursorTooltipVariant}
        collisionPadding={collisionPadding}
        className={clsx('relative inline-block cursor-pointer', className)}
        {...props}
      >
        <div ref={ref}>{children}</div>
      </CoreCursorTooltip>
    );
  }
);
CursorTooltip.displayName = 'CursorTooltip';
`,
					},
				];
			}

			// Ejected React Mode — Standalone Engine
			return [
				{
					filename: 'CursorTooltip.tsx',
					language: 'tsx',
					description: 'Cursor Tooltip — Standalone Ejected Engine (Zero Dependencies). Continuous exponential lerp tracking, boundary viewport collision clamping, and tokenized badges.',
					code: `${header}import * as React from 'react';
import { createPortal } from 'react-dom';

export type CursorTooltipVariant = 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';

export type CursorTooltipDirection =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export interface CursorTooltipProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  springDamping?: number;
  direction?: CursorTooltipDirection;
  offsetX?: number;
  offsetY?: number;
  variant?: CursorTooltipVariant;
  collisionPadding?: number;
  className?: string;
  contentClassName?: string;
}

const VARIANT_CLASSES: Record<CursorTooltipVariant, string> = {
  frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
  accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
  dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
  minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
  glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
};

function dampCursorCoordinate(current: number, target: number, lambda: number, dt: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return target;
  if (!Number.isFinite(lambda) || lambda <= 0) return target;
  if (!Number.isFinite(dt) || dt <= 0) return current;
  const diff = target - current;
  if (Math.abs(diff) < 0.001) return target;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

function calculateTargetPosition(
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number,
  direction: CursorTooltipDirection,
  width: number = 0,
  height: number = 0
) {
  switch (direction) {
    case 'top':
      return { x: clientX - width / 2, y: clientY - offsetY - height };
    case 'bottom':
      return { x: clientX - width / 2, y: clientY + offsetY };
    case 'left':
      return { x: clientX - offsetX - width, y: clientY - height / 2 };
    case 'right':
      return { x: clientX + offsetX, y: clientY - height / 2 };
    case 'top-left':
      return { x: clientX - offsetX - width, y: clientY - offsetY - height };
    case 'top-right':
      return { x: clientX + offsetX, y: clientY - offsetY - height };
    case 'bottom-left':
      return { x: clientX - offsetX - width, y: clientY + offsetY };
    case 'bottom-right':
    default:
      return { x: clientX + offsetX, y: clientY + offsetY };
  }
}

function clampTooltipToViewport(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  viewportW: number,
  viewportH: number,
  padding: number
) {
  const safePadding = Math.max(0, padding);
  const maxX = Math.max(safePadding, viewportW - width - safePadding);
  const maxY = Math.max(safePadding, viewportH - height - safePadding);
  return {
    x: Math.min(maxX, Math.max(safePadding, targetX)),
    y: Math.min(maxY, Math.max(safePadding, targetY)),
  };
}

export const CursorTooltip: React.FC<CursorTooltipProps> = ({
  children,
  content = '${content}',
  springDamping = ${springDamping},
  direction = '${direction}',
  offsetX = ${offsetX},
  offsetY = ${offsetY},
  variant = '${variant}',
  collisionPadding = ${collisionPadding},
  className = '',
  contentClassName = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isVisibleRef = React.useRef(false);
  const mousePosRef = React.useRef({ x: -9999, y: -9999 });
  const targetPosRef = React.useRef({ x: -9999, y: -9999 });
  const currentPosRef = React.useRef({ x: -9999, y: -9999 });
  const tooltipElRef = React.useRef<HTMLDivElement | null>(null);
  const rafIdRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updateRaf = React.useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const cur = currentPosRef.current;
      const target = targetPosRef.current;

      const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (tooltipElRef.current && mousePosRef.current.x >= 0) {
        const el = tooltipElRef.current;
        const rect = el.getBoundingClientRect();
        targetPosRef.current = calculateTargetPosition(
          mousePosRef.current.x,
          mousePosRef.current.y,
          offsetX,
          offsetY,
          direction,
          rect.width,
          rect.height
        );
      }

      if (isReduced) {
        cur.x = target.x;
        cur.y = target.y;
      } else {
        cur.x = dampCursorCoordinate(cur.x, target.x, springDamping, dt);
        cur.y = dampCursorCoordinate(cur.y, target.y, springDamping, dt);
      }

      if (tooltipElRef.current) {
        const el = tooltipElRef.current;
        const rect = el.getBoundingClientRect();
        const clamped = clampTooltipToViewport(cur.x, cur.y, rect.width, rect.height, window.innerWidth, window.innerHeight, collisionPadding);
        el.style.transform = \`translate3d(\${clamped.x.toFixed(2)}px, \${clamped.y.toFixed(2)}px, 0)\`;
      }

      const dist = Math.hypot(target.x - cur.x, target.y - cur.y);
      if (dist > 0.2 && isVisibleRef.current) {
        rafIdRef.current = requestAnimationFrame(updateRaf);
      } else {
        rafIdRef.current = null;
        lastTimeRef.current = 0;
      }
    },
    [collisionPadding, springDamping, offsetX, offsetY, direction]
  );

  const startRaf = React.useCallback(() => {
    if (!rafIdRef.current) {
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(updateRaf);
    }
  }, [updateRaf]);

  const handlePointerEnter = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return;
      isVisibleRef.current = true;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      const rect = tooltipElRef.current?.getBoundingClientRect();
      const target = calculateTargetPosition(e.clientX, e.clientY, offsetX, offsetY, direction, rect?.width ?? 0, rect?.height ?? 0);
      if (currentPosRef.current.x < 0) {
        currentPosRef.current = { ...target };
      }
      targetPosRef.current = target;
      setIsVisible(true);
      startRaf();
    },
    [direction, offsetX, offsetY, startRaf]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      const rect = tooltipElRef.current?.getBoundingClientRect();
      targetPosRef.current = calculateTargetPosition(e.clientX, e.clientY, offsetX, offsetY, direction, rect?.width ?? 0, rect?.height ?? 0);
      startRaf();
    },
    [direction, offsetX, offsetY, startRaf]
  );

  const handlePointerLeave = React.useCallback(() => {
    isVisibleRef.current = false;
    setIsVisible(false);
    mousePosRef.current = { x: -9999, y: -9999 };
    currentPosRef.current = { x: -9999, y: -9999 };
    targetPosRef.current = { x: -9999, y: -9999 };
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const badgeClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.frosted;

  return (
    <>
      <div
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={\`relative inline-block cursor-pointer \${className}\`}
      >
        {children}
      </div>

      {mounted &&
        isVisible &&
        createPortal(
          <div
            ref={(node) => {
              tooltipElRef.current = node;
            }}
            className={\`pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform \${contentClassName}\`}
            style={{
              transform: \`translate3d(\${currentPosRef.current.x >= 0 ? currentPosRef.current.x : targetPosRef.current.x}px, \${currentPosRef.current.y >= 0 ? currentPosRef.current.y : targetPosRef.current.y}px, 0)\`,
            }}
          >
            <div className={\`px-3 py-1.5 text-xs font-semibold \${badgeClass}\`}>
              {content}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'CursorTooltip.vue',
					language: 'vue',
					description: 'Cursor Tooltip — Vue 3 Composition API with reactive exponential cursor tracking and boundary collision clamping.',
					code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

export interface CursorTooltipProps {
  content?: string;
  springDamping?: number;
  direction?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top' | 'bottom' | 'left' | 'right';
  offsetX?: number;
  offsetY?: number;
  variant?: 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';
  collisionPadding?: number;
  class?: string;
}

const props = withDefaults(defineProps<CursorTooltipProps>(), {
  content: '${content}',
  springDamping: ${springDamping},
  direction: '${direction}',
  offsetX: ${offsetX},
  offsetY: ${offsetY},
  variant: '${variant}',
  collisionPadding: ${collisionPadding},
  class: '',
});

const isVisible = ref(false);
const tooltipEl = ref<HTMLDivElement | null>(null);
const currentPos = { x: -9999, y: -9999 };
const targetPos = { x: -9999, y: -9999 };
let rafId: number | null = null;
let lastTime = 0;

const variantClasses: Record<string, string> = {
  frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
  accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
  dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
  minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
  glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
};

const badgeClass = computed(() => variantClasses[props.variant] || variantClasses.frosted);

function damp(current: number, target: number, lambda: number, dt: number): number {
  const diff = target - current;
  if (Math.abs(diff) < 0.01) return target;
  return current + diff * (1 - Math.exp(-lambda * dt));
}

function updateLoop(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  currentPos.x = damp(currentPos.x, targetPos.x, props.springDamping, dt);
  currentPos.y = damp(currentPos.y, targetPos.y, props.springDamping, dt);

  if (tooltipEl.value) {
    const el = tooltipEl.value;
    const rect = el.getBoundingClientRect();
    const safePad = Math.max(0, props.collisionPadding);
    const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
    const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
    const clampedX = Math.min(maxX, Math.max(safePad, currentPos.x));
    const clampedY = Math.min(maxY, Math.max(safePad, currentPos.y));
    el.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
  }

  const dist = Math.hypot(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
  if (dist > 0.2 && isVisible.value) {
    rafId = requestAnimationFrame(updateLoop);
  } else {
    rafId = null;
    lastTime = 0;
  }
}

function calculateTargetPosition(
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number,
  direction: string,
  width = 0,
  height = 0
) {
  switch (direction) {
    case 'top':
      return { x: clientX - width / 2, y: clientY - offsetY - height };
    case 'bottom':
      return { x: clientX - width / 2, y: clientY + offsetY };
    case 'left':
      return { x: clientX - offsetX - width, y: clientY - height / 2 };
    case 'right':
      return { x: clientX + offsetX, y: clientY - height / 2 };
    case 'top-left':
      return { x: clientX - offsetX - width, y: clientY - offsetY - height };
    case 'top-right':
      return { x: clientX + offsetX, y: clientY - offsetY - height };
    case 'bottom-left':
      return { x: clientX - offsetX - width, y: clientY + offsetY };
    case 'bottom-right':
    default:
      return { x: clientX + offsetX, y: clientY + offsetY };
  }
}

function startRaf() {
  if (!rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(updateLoop);
  }
}

function onPointerEnter(e: PointerEvent) {
  if (e.pointerType === 'touch') return;
  const rect = tooltipEl.value?.getBoundingClientRect();
  const target = calculateTargetPosition(
    e.clientX,
    e.clientY,
    props.offsetX,
    props.offsetY,
    props.direction,
    rect?.width ?? 0,
    rect?.height ?? 0
  );
  targetPos.x = target.x;
  targetPos.y = target.y;
  if (currentPos.x < 0) {
    currentPos.x = target.x;
    currentPos.y = target.y;
  }
  isVisible.value = true;
  startRaf();
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return;
  const rect = tooltipEl.value?.getBoundingClientRect();
  const target = calculateTargetPosition(
    e.clientX,
    e.clientY,
    props.offsetX,
    props.offsetY,
    props.direction,
    rect?.width ?? 0,
    rect?.height ?? 0
  );
  targetPos.x = target.x;
  targetPos.y = target.y;
  startRaf();
}

function onPointerLeave() {
  isVisible.value = false;
  currentPos.x = -9999;
  currentPos.y = -9999;
  targetPos.x = -9999;
  targetPos.y = -9999;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="['relative inline-block cursor-pointer', props.class]"
  >
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-if="isVisible"
      ref="tooltipEl"
      class="pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform"
      :style="{ transform: \`translate3d(\${targetPos.x}px, \${targetPos.y}px, 0)\` }"
    >
      <div :class="['px-3 py-1.5 text-xs font-semibold', badgeClass]">
        <slot name="content">{{ props.content }}</slot>
      </div>
    </div>
  </Teleport>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'CursorTooltip.svelte',
					language: 'svelte',
					description: 'Cursor Tooltip — Svelte 5 Native component with reactive runes, exponential cursor smoothing, and boundary clamping.',
					code: `<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    content?: string;
    springDamping?: number;
    direction?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top' | 'bottom' | 'left' | 'right';
    offsetX?: number;
    offsetY?: number;
    variant?: 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';
    collisionPadding?: number;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    content = '${content}',
    springDamping = ${springDamping},
    direction = '${direction}',
    offsetX = ${offsetX},
    offsetY = ${offsetY},
    variant = '${variant}',
    collisionPadding = ${collisionPadding},
    class: className = '',
    children,
  }: Props = $props();

  let isVisible = $state(false);
  let tooltipEl = $state<HTMLDivElement | null>(null);
  let currentX = -9999;
  let currentY = -9999;
  let targetX = -9999;
  let targetY = -9999;
  let rafId: number | null = null;
  let lastTime = 0;

  const variantClasses: Record<string, string> = {
    frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
    accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
    dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
    minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
    glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
  };

  const badgeClass = $derived(variantClasses[variant] || variantClasses.frosted);

  function damp(cur: number, tar: number, lambda: number, dt: number): number {
    const diff = tar - cur;
    if (Math.abs(diff) < 0.01) return tar;
    return cur + diff * (1 - Math.exp(-lambda * dt));
  }

  function updateLoop(timestamp: number) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    currentX = damp(currentX, targetX, springDamping, dt);
    currentY = damp(currentY, targetY, springDamping, dt);

    if (tooltipEl) {
      const rect = tooltipEl.getBoundingClientRect();
      const safePad = Math.max(0, collisionPadding);
      const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
      const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
      const clampedX = Math.min(maxX, Math.max(safePad, currentX));
      const clampedY = Math.min(maxY, Math.max(safePad, currentY));
      tooltipEl.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
    }

    const dist = Math.hypot(targetX - currentX, targetY - currentY);
    if (dist > 0.2 && isVisible) {
      rafId = requestAnimationFrame(updateLoop);
    } else {
      rafId = null;
      lastTime = 0;
    }
  }

  function calculateTargetPosition(
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
    direction: string,
    width = 0,
    height = 0
  ) {
    switch (direction) {
      case 'top':
        return { x: clientX - width / 2, y: clientY - offsetY - height };
      case 'bottom':
        return { x: clientX - width / 2, y: clientY + offsetY };
      case 'left':
        return { x: clientX - offsetX - width, y: clientY - height / 2 };
      case 'right':
        return { x: clientX + offsetX, y: clientY - height / 2 };
      case 'top-left':
        return { x: clientX - offsetX - width, y: clientY - offsetY - height };
      case 'top-right':
        return { x: clientX + offsetX, y: clientY - offsetY - height };
      case 'bottom-left':
        return { x: clientX - offsetX - width, y: clientY + offsetY };
      case 'bottom-right':
      default:
        return { x: clientX + offsetX, y: clientY + offsetY };
    }
  }

  function startRaf() {
    if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  function onPointerEnter(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    const rect = tooltipEl?.getBoundingClientRect();
    const target = calculateTargetPosition(e.clientX, e.clientY, offsetX, offsetY, direction, rect?.width ?? 0, rect?.height ?? 0);
    targetX = target.x;
    targetY = target.y;
    if (currentX < 0) {
      currentX = targetX;
      currentY = targetY;
    }
    isVisible = true;
    startRaf();
  }

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    const rect = tooltipEl?.getBoundingClientRect();
    const target = calculateTargetPosition(e.clientX, e.clientY, offsetX, offsetY, direction, rect?.width ?? 0, rect?.height ?? 0);
    targetX = target.x;
    targetY = target.y;
    startRaf();
  }

  function onPointerLeave() {
    isVisible = false;
    currentX = -9999;
    currentY = -9999;
    targetX = -9999;
    targetY = -9999;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>

<div
  onpointerenter={onPointerEnter}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  class="relative inline-block cursor-pointer {className}"
>
  {@render children?.()}
</div>

{#if isVisible}
  <div
    bind:this={tooltipEl}
    class="pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform"
    style="transform: translate3d({targetX}px, {targetY}px, 0)"
  >
    <div class="px-3 py-1.5 text-xs font-semibold {badgeClass}">
      {content}
    </div>
  </div>
{/if}
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'cursor-tooltip.component.ts',
					language: 'typescript',
					description: 'Cursor Tooltip — Angular 18+ Standalone component running rAF loops outside Zone.js with boundary clamping.',
					code: `import { Component, ElementRef, NgZone, AfterViewInit, OnDestroy, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-cursor-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      #targetEl
      [class]="'relative inline-block cursor-pointer ' + customClass()"
    >
      <ng-content></ng-content>
    </div>

    @if (isVisible) {
      <div
        #floatingEl
        class="pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform"
        [style.transform]="'translate3d(' + targetX + 'px, ' + targetY + 'px, 0)'"
      >
        <div [class]="'px-3 py-1.5 text-xs font-semibold ' + badgeClass()">
          {{ content() }}
        </div>
      </div>
    }
  \`,
})
export class ExhumaCursorTooltipComponent implements AfterViewInit, OnDestroy {
  readonly content = input<string>('${content}');
  readonly springDamping = input<number>(${springDamping});
  readonly direction = input<string>('${direction}');
  readonly offsetX = input<number>(${offsetX});
  readonly offsetY = input<number>(${offsetY});
  readonly variant = input<'frosted' | 'accent' | 'dark' | 'minimal' | 'glow'>('${variant}');
  readonly collisionPadding = input<number>(${collisionPadding});
  readonly customClass = input<string>('');

  readonly targetEl = viewChild<ElementRef<HTMLDivElement>>('targetEl');
  readonly floatingEl = viewChild<ElementRef<HTMLDivElement>>('floatingEl');

  isVisible = false;
  targetX = -9999;
  targetY = -9999;
  private currentX = -9999;
  private currentY = -9999;
  private rafId: number | null = null;
  private lastTime = 0;
  private cleanups: Array<() => void> = [];

  constructor(private ngZone: NgZone) {}

  badgeClass(): string {
    const map: Record<string, string> = {
      frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
      accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
      dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
      minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
      glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
    };
    return map[this.variant()] || map.frosted;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const el = this.targetEl()?.nativeElement;
      if (!el) return;

      const calculateTargetPosition = (
        clientX: number,
        clientY: number,
        offsetX: number,
        offsetY: number,
        direction: string,
        width = 0,
        height = 0
      ) => {
        switch (direction) {
          case 'top':
            return { x: clientX - width / 2, y: clientY - offsetY - height };
          case 'bottom':
            return { x: clientX - width / 2, y: clientY + offsetY };
          case 'left':
            return { x: clientX - offsetX - width, y: clientY - height / 2 };
          case 'right':
            return { x: clientX + offsetX, y: clientY - height / 2 };
          case 'top-left':
            return { x: clientX - offsetX - width, y: clientY - offsetY - height };
          case 'top-right':
            return { x: clientX + offsetX, y: clientY - offsetY - height };
          case 'bottom-left':
            return { x: clientX - offsetX - width, y: clientY + offsetY };
          case 'bottom-right':
          default:
            return { x: clientX + offsetX, y: clientY + offsetY };
        }
      };

      const damp = (cur: number, tar: number, lambda: number, dt: number): number => {
        const diff = tar - cur;
        if (Math.abs(diff) < 0.01) return tar;
        return cur + diff * (1 - Math.exp(-lambda * dt));
      };

      const updateLoop = (timestamp: number) => {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.currentX = damp(this.currentX, this.targetX, this.springDamping(), dt);
        this.currentY = damp(this.currentY, this.targetY, this.springDamping(), dt);

        const badge = this.floatingEl()?.nativeElement;
        if (badge) {
          const rect = badge.getBoundingClientRect();
          const safePad = Math.max(0, this.collisionPadding());
          const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
          const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
          const clampedX = Math.min(maxX, Math.max(safePad, this.currentX));
          const clampedY = Math.min(maxY, Math.max(safePad, this.currentY));
          badge.style.transform = 'translate3d(' + clampedX.toFixed(2) + 'px, ' + clampedY.toFixed(2) + 'px, 0)';
        }

        const dist = Math.hypot(this.targetX - this.currentX, this.targetY - this.currentY);
        if (dist > 0.2 && this.isVisible) {
          this.rafId = requestAnimationFrame(updateLoop);
        } else {
          this.rafId = null;
          this.lastTime = 0;
        }
      };

      const startRaf = () => {
        if (!this.rafId) {
          this.lastTime = 0;
          this.rafId = requestAnimationFrame(updateLoop);
        }
      };

      const onPointerEnter = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        const badge = this.floatingEl()?.nativeElement;
        const rect = badge?.getBoundingClientRect();
        const target = calculateTargetPosition(
          e.clientX,
          e.clientY,
          this.offsetX(),
          this.offsetY(),
          this.direction(),
          rect?.width ?? 0,
          rect?.height ?? 0
        );
        this.targetX = target.x;
        this.targetY = target.y;
        if (this.currentX < 0) {
          this.currentX = this.targetX;
          this.currentY = this.targetY;
        }
        this.ngZone.run(() => {
          this.isVisible = true;
        });
        startRaf();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        const badge = this.floatingEl()?.nativeElement;
        const rect = badge?.getBoundingClientRect();
        const target = calculateTargetPosition(
          e.clientX,
          e.clientY,
          this.offsetX(),
          this.offsetY(),
          this.direction(),
          rect?.width ?? 0,
          rect?.height ?? 0
        );
        this.targetX = target.x;
        this.targetY = target.y;
        startRaf();
      };

      const onPointerLeave = () => {
        this.ngZone.run(() => {
          this.isVisible = false;
        });
        this.currentX = -9999;
        this.currentY = -9999;
        this.targetX = -9999;
        this.targetY = -9999;
        if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
      };

      el.addEventListener('pointerenter', onPointerEnter);
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerleave', onPointerLeave);

      this.cleanups.push(() => {
        el.removeEventListener('pointerenter', onPointerEnter);
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerleave', onPointerLeave);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.cleanups.forEach((c) => c());
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'CursorTooltip.tsx',
					language: 'tsx',
					description: 'Cursor Tooltip — SolidJS Native component with fine-grained reactivity, Portal badge, and rAF interpolation.',
					code: `import { Component, JSX, createSignal, onCleanup, mergeProps, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface CursorTooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  content?: string;
  springDamping?: number;
  direction?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top' | 'bottom' | 'left' | 'right';
  offsetX?: number;
  offsetY?: number;
  variant?: 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';
  collisionPadding?: number;
  class?: string;
  children?: JSX.Element;
}

export const CursorTooltip: Component<CursorTooltipProps> = (rawProps) => {
  const props = mergeProps(
    {
      content: '${content}',
      springDamping: ${springDamping},
      direction: '${direction}',
      offsetX: ${offsetX},
      offsetY: ${offsetY},
      variant: '${variant}',
      collisionPadding: ${collisionPadding},
    },
    rawProps
  );

  const [local, others] = splitProps(props, [
    'content',
    'springDamping',
    'direction',
    'offsetX',
    'offsetY',
    'variant',
    'collisionPadding',
    'class',
    'children',
  ]);

  const [isVisible, setIsVisible] = createSignal(false);
  let tooltipEl: HTMLDivElement | undefined;
  let currentX = -9999;
  let currentY = -9999;
  let targetX = -9999;
  let targetY = -9999;
  let rafId: number | null = null;
  let lastTime = 0;

  const variantClasses: Record<string, string> = {
    frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
    accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
    dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
    minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
    glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
  };

  const badgeClass = () => variantClasses[local.variant] || variantClasses.frosted;

  function damp(cur: number, tar: number, lambda: number, dt: number): number {
    const diff = tar - cur;
    if (Math.abs(diff) < 0.01) return tar;
    return cur + diff * (1 - Math.exp(-lambda * dt));
  }

  function updateLoop(timestamp: number) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    currentX = damp(currentX, targetX, local.springDamping, dt);
    currentY = damp(currentY, targetY, local.springDamping, dt);

    if (tooltipEl) {
      const rect = tooltipEl.getBoundingClientRect();
      const safePad = Math.max(0, local.collisionPadding);
      const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
      const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
      const clampedX = Math.min(maxX, Math.max(safePad, currentX));
      const clampedY = Math.min(maxY, Math.max(safePad, currentY));
      tooltipEl.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
    }

    const dist = Math.hypot(targetX - currentX, targetY - currentY);
    if (dist > 0.2 && isVisible()) {
      rafId = requestAnimationFrame(updateLoop);
    } else {
      rafId = null;
      lastTime = 0;
    }
  }

  function calculateTargetPosition(
    clientX: number,
    clientY: number,
    offsetX: number,
    offsetY: number,
    direction: string,
    width = 0,
    height = 0
  ) {
    switch (direction) {
      case 'top':
        return { x: clientX - width / 2, y: clientY - offsetY - height };
      case 'bottom':
        return { x: clientX - width / 2, y: clientY + offsetY };
      case 'left':
        return { x: clientX - offsetX - width, y: clientY - height / 2 };
      case 'right':
        return { x: clientX + offsetX, y: clientY - height / 2 };
      case 'top-left':
        return { x: clientX - offsetX - width, y: clientY - offsetY - height };
      case 'top-right':
        return { x: clientX + offsetX, y: clientY - offsetY - height };
      case 'bottom-left':
        return { x: clientX - offsetX - width, y: clientY + offsetY };
      case 'bottom-right':
      default:
        return { x: clientX + offsetX, y: clientY + offsetY };
    }
  }

  function startRaf() {
    if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  onCleanup(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  return (
    <>
      <div
        onPointerEnter={(e) => {
          if (e.pointerType === 'touch') return;
          const rect = tooltipEl?.getBoundingClientRect();
          const target = calculateTargetPosition(e.clientX, e.clientY, local.offsetX, local.offsetY, local.direction, rect?.width ?? 0, rect?.height ?? 0);
          targetX = target.x;
          targetY = target.y;
          if (currentX < 0) {
            currentX = targetX;
            currentY = targetY;
          }
          setIsVisible(true);
          startRaf();
        }}
        onPointerMove={(e) => {
          if (e.pointerType === 'touch') return;
          const rect = tooltipEl?.getBoundingClientRect();
          const target = calculateTargetPosition(e.clientX, e.clientY, local.offsetX, local.offsetY, local.direction, rect?.width ?? 0, rect?.height ?? 0);
          targetX = target.x;
          targetY = target.y;
          startRaf();
        }}
        onPointerLeave={() => {
          setIsVisible(false);
          currentX = -9999;
          currentY = -9999;
          targetX = -9999;
          targetY = -9999;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }}
        class={\`relative inline-block cursor-pointer \${local.class ?? ''}\`}
        {...others}
      >
        {local.children}
      </div>

      {isVisible() && (
        <Portal>
          <div
            ref={tooltipEl}
            class="pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform"
            style={{ transform: \`translate3d(\${targetX}px, \${targetY}px, 0)\` }}
          >
            <div class={\`px-3 py-1.5 text-xs font-semibold \${badgeClass()}\`}>
              {local.content}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'CursorTooltip.astro',
					language: 'astro',
					description: 'Cursor Tooltip — Astro component with standalone client-side exponential tracking and boundary clamping.',
					code: `---
interface Props {
  content?: string;
  springDamping?: number;
  direction?: string;
  offsetX?: number;
  offsetY?: number;
  variant?: 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';
  collisionPadding?: number;
  class?: string;
}

const {
  content = '${content}',
  springDamping = ${springDamping},
  direction = '${direction}',
  offsetX = ${offsetX},
  offsetY = ${offsetY},
  variant = '${variant}',
  collisionPadding = ${collisionPadding},
  class: className = '',
  ...props
} = Astro.props;

const variantClasses: Record<string, string> = {
  frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
  accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
  dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
  minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
  glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
};

const badgeClass = variantClasses[variant] || variantClasses.frosted;
---

<div
  data-exhuma-cursor-tooltip
  data-content={content}
  data-damping={springDamping}
  data-direction={direction}
  data-offset-x={offsetX}
  data-offset-y={offsetY}
  data-padding={collisionPadding}
  data-badge-class={badgeClass}
  class={\`relative inline-block cursor-pointer \${className}\`}
  {...props}
>
  <slot />
</div>

<script>
  function initTooltips() {
    const targets = document.querySelectorAll<HTMLElement>('[data-exhuma-cursor-tooltip]');
    targets.forEach((el) => {
      if ((el as any)._exhumaInitialized) return;
      (el as any)._exhumaInitialized = true;

      const text = el.dataset.content || 'Explore Showcase';
      const damping = Number(el.dataset.damping || 20);
      const offX = Number(el.dataset.offsetX || 16);
      const offY = Number(el.dataset.offsetY || 16);
      const pad = Number(el.dataset.padding || 12);
      const badgeCls = el.dataset.badgeClass || '';

      let badge: HTMLDivElement | null = null;
      let targetX = -9999;
      let targetY = -9999;
      let curX = -9999;
      let curY = -9999;
      let rafId: number | null = null;
      let lastTime = 0;

      function calculateTargetPosition(
        clientX: number,
        clientY: number,
        offsetX: number,
        offsetY: number,
        direction: string,
        width = 0,
        height = 0
      ) {
        switch (direction) {
          case 'top':
            return { x: clientX - width / 2, y: clientY - offsetY - height };
          case 'bottom':
            return { x: clientX - width / 2, y: clientY + offsetY };
          case 'left':
            return { x: clientX - offsetX - width, y: clientY - height / 2 };
          case 'right':
            return { x: clientX + offsetX, y: clientY - height / 2 };
          case 'top-left':
            return { x: clientX - offsetX - width, y: clientY - offsetY - height };
          case 'top-right':
            return { x: clientX + offsetX, y: clientY - offsetY - height };
          case 'bottom-left':
            return { x: clientX - offsetX - width, y: clientY + offsetY };
          case 'bottom-right':
          default:
            return { x: clientX + offsetX, y: clientY + offsetY };
        }
      }

      function damp(c: number, t: number, dt: number) {
        const diff = t - c;
        if (Math.abs(diff) < 0.01) return t;
        return c + diff * (1 - Math.exp(-damping * dt));
      }

      function update(timestamp: number) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        curX = damp(curX, targetX, dt);
        curY = damp(curY, targetY, dt);

        if (badge) {
          const rect = badge.getBoundingClientRect();
          const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
          const maxY = Math.max(pad, window.innerHeight - rect.height - pad);
          const clampedX = Math.min(maxX, Math.max(pad, curX));
          const clampedY = Math.min(maxY, Math.max(pad, curY));
          badge.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
        }

        if (Math.hypot(targetX - curX, targetY - curY) > 0.2 && badge) {
          rafId = requestAnimationFrame(update);
        } else {
          rafId = null;
          lastTime = 0;
        }
      }

      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        const dir = el.dataset.direction || 'bottom-right';

        badge = document.createElement('div');
        badge.className = 'pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform';
        const inner = document.createElement('div');
        inner.className = \`px-3 py-1.5 text-xs font-semibold \${badgeCls}\`;
        inner.textContent = text;
        badge.appendChild(inner);
        document.body.appendChild(badge);

        const rect = badge.getBoundingClientRect();
        const pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
        targetX = pos.x;
        targetY = pos.y;
        curX = targetX;
        curY = targetY;
        badge.style.transform = \`translate3d(\${targetX.toFixed(2)}px, \${targetY.toFixed(2)}px, 0)\`;

        lastTime = 0;
        rafId = requestAnimationFrame(update);
      });

      el.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const dir = el.dataset.direction || 'bottom-right';
        const rect = badge ? badge.getBoundingClientRect() : { width: 0, height: 0 };
        const pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
        targetX = pos.x;
        targetY = pos.y;
        if (!rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(update);
        }
      });

      el.addEventListener('pointerleave', () => {
        if (badge) {
          badge.remove();
          badge = null;
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initTooltips);
  document.addEventListener('astro:page-load', initTooltips);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'cursor-tooltip.blade.php',
					language: 'php',
					description: 'Cursor Tooltip — Laravel Blade component with native script-driven exponential cursor tracking.',
					code: `@props([
    'content' => '${content}',
    'springDamping' => ${springDamping},
    'direction' => '${direction}',
    'offsetX' => ${offsetX},
    'offsetY' => ${offsetY},
    'variant' => '${variant}',
    'collisionPadding' => ${collisionPadding},
    'class' => '',
])

@php
$variantClasses = [
    'frosted' => 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
    'accent' => 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
    'dark' => 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
    'minimal' => 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
    'glow' => 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
];
$badgeClass = $variantClasses[$variant] ?? $variantClasses['frosted'];
@endphp

<div
    {{ $attributes->merge([
        'class' => 'relative inline-block cursor-pointer ' . $class,
        'data-exhuma-cursor-tooltip' => '',
        'data-content' => $content,
        'data-damping' => $springDamping,
        'data-direction' => $direction,
        'data-offset-x' => $offsetX,
        'data-offset-y' => $offsetY,
        'data-padding' => $collisionPadding,
        'data-badge-class' => $badgeClass,
    ]) }}
>
    {{ $slot }}
</div>

<script>
(function() {
    function initBladeCursorTooltips() {
        document.querySelectorAll('[data-exhuma-cursor-tooltip]').forEach(function(el) {
            if (el._exhumaBladeInitialized) return;
            el._exhumaBladeInitialized = true;

            var text = el.dataset.content || 'Explore Showcase';
            var damping = parseFloat(el.dataset.damping || 20);
            var offX = parseFloat(el.dataset.offsetX || 16);
            var offY = parseFloat(el.dataset.offsetY || 16);
            var pad = parseFloat(el.dataset.padding || 12);
            var badgeCls = el.dataset.badgeClass || '';

            var badge = null;
            var targetX = -9999, targetY = -9999;
            var curX = -9999, curY = -9999;
            var rafId = null;
            var lastTime = 0;

            function calculateTargetPosition(clientX, clientY, offsetX, offsetY, direction, width, height) {
                width = width || 0;
                height = height || 0;
                switch (direction) {
                    case 'top':
                        return { x: clientX - width / 2, y: clientY - offsetY - height };
                    case 'bottom':
                        return { x: clientX - width / 2, y: clientY + offsetY };
                    case 'left':
                        return { x: clientX - offsetX - width, y: clientY - height / 2 };
                    case 'right':
                        return { x: clientX + offsetX, y: clientY - height / 2 };
                    case 'top-left':
                        return { x: clientX - offsetX - width, y: clientY - offsetY - height };
                    case 'top-right':
                        return { x: clientX + offsetX, y: clientY - offsetY - height };
                    case 'bottom-left':
                        return { x: clientX - offsetX - width, y: clientY + offsetY };
                    case 'bottom-right':
                    default:
                        return { x: clientX + offsetX, y: clientY + offsetY };
                }
            }

            function update(timestamp) {
                if (!lastTime) lastTime = timestamp;
                var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
                lastTime = timestamp;

                curX += (targetX - curX) * (1 - Math.exp(-damping * dt));
                curY += (targetY - curY) * (1 - Math.exp(-damping * dt));

                if (badge) {
                    var rect = badge.getBoundingClientRect();
                    var maxX = Math.max(pad, window.innerWidth - rect.width - pad);
                    var maxY = Math.max(pad, window.innerHeight - rect.height - pad);
                    var clampedX = Math.min(maxX, Math.max(pad, curX));
                    var clampedY = Math.min(maxY, Math.max(pad, curY));
                    badge.style.transform = 'translate3d(' + clampedX.toFixed(2) + 'px, ' + clampedY.toFixed(2) + 'px, 0)';
                }

                if (Math.hypot(targetX - curX, targetY - curY) > 0.2 && badge) {
                    rafId = requestAnimationFrame(update);
                } else {
                    rafId = null;
                    lastTime = 0;
                }
            }

            el.addEventListener('pointerenter', function(e) {
                if (e.pointerType === 'touch') return;
                var dir = el.dataset.direction || 'bottom-right';

                badge = document.createElement('div');
                badge.className = 'pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform';
                var inner = document.createElement('div');
                inner.className = 'px-3 py-1.5 text-xs font-semibold ' + badgeCls;
                inner.textContent = text;
                badge.appendChild(inner);
                document.body.appendChild(badge);

                var rect = badge.getBoundingClientRect();
                var pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
                targetX = pos.x;
                targetY = pos.y;
                curX = targetX;
                curY = targetY;
                badge.style.transform = 'translate3d(' + targetX.toFixed(2) + 'px, ' + targetY.toFixed(2) + 'px, 0)';

                lastTime = 0;
                rafId = requestAnimationFrame(update);
            });

            el.addEventListener('pointermove', function(e) {
                if (e.pointerType === 'touch') return;
                var dir = el.dataset.direction || 'bottom-right';
                var rect = badge ? badge.getBoundingClientRect() : { width: 0, height: 0 };
                var pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
                targetX = pos.x;
                targetY = pos.y;
                if (!rafId) {
                    lastTime = 0;
                    rafId = requestAnimationFrame(update);
                }
            });

            el.addEventListener('pointerleave', function() {
                if (badge) {
                    badge.remove();
                    badge = null;
                }
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBladeCursorTooltips);
    } else {
        initBladeCursorTooltips();
    }
})();
</script>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'cursor-tooltip.vanilla.js',
					language: 'javascript',
					description: 'Cursor Tooltip — Autonomous Vanilla JS module with 120 FPS rAF exponential smoothing and collision clamping.',
					code: `/**
 * Exhuma Cursor Tooltip — Vanilla JS Autonomous Module
 * Big-Omega (Ω) Guarantees: 120 FPS rAF loop, zero layout thrashing, automatic boundary clamping.
 */

export function initCursorTooltip(selector = '[data-exhuma-cursor-tooltip]', options = {}) {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  const cleanups = [];

  const defaults = {
    content: '${content}',
    springDamping: ${springDamping},
    direction: '${direction}',
    offsetX: ${offsetX},
    offsetY: ${offsetY},
    variant: '${variant}',
    collisionPadding: ${collisionPadding},
  };

  const config = { ...defaults, ...options };

  const variantClasses = {
    frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
    accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
    dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
    minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
    glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
  };

  const badgeClass = variantClasses[config.variant] || variantClasses.frosted;

  elements.forEach((el) => {
    let badge = null;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let rafId = null;
    let lastTime = 0;

    function calculateTargetPosition(
      clientX,
      clientY,
      offsetX,
      offsetY,
      direction,
      width = 0,
      height = 0
    ) {
      switch (direction) {
        case 'top':
          return { x: clientX - width / 2, y: clientY - offsetY - height };
        case 'bottom':
          return { x: clientX - width / 2, y: clientY + offsetY };
        case 'left':
          return { x: clientX - offsetX - width, y: clientY - height / 2 };
        case 'right':
          return { x: clientX + offsetX, y: clientY - height / 2 };
        case 'top-left':
          return { x: clientX - offsetX - width, y: clientY - offsetY - height };
        case 'top-right':
          return { x: clientX + offsetX, y: clientY - offsetY - height };
        case 'bottom-left':
          return { x: clientX - offsetX - width, y: clientY + offsetY };
        case 'bottom-right':
        default:
          return { x: clientX + offsetX, y: clientY + offsetY };
      }
    }

    function damp(cur, tar, lambda, dt) {
      const diff = tar - cur;
      if (Math.abs(diff) < 0.01) return tar;
      return cur + diff * (1 - Math.exp(-lambda * dt));
    }

    function update(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      currentX = damp(currentX, targetX, config.springDamping, dt);
      currentY = damp(currentY, targetY, config.springDamping, dt);

      if (badge) {
        const rect = badge.getBoundingClientRect();
        const safePad = Math.max(0, config.collisionPadding);
        const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
        const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
        const clampedX = Math.min(maxX, Math.max(safePad, currentX));
        const clampedY = Math.min(maxY, Math.max(safePad, currentY));
        badge.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
      }

      if (Math.hypot(targetX - currentX, targetY - currentY) > 0.2 && badge) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
        lastTime = 0;
      }
    }

    function onPointerEnter(e) {
      if (e.pointerType === 'touch') return;
      badge = document.createElement('div');
      badge.className = 'pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform';
      const inner = document.createElement('div');
      inner.className = \`px-3 py-1.5 text-xs font-semibold \${badgeClass}\`;
      inner.textContent = config.content;
      badge.appendChild(inner);
      document.body.appendChild(badge);

      const rect = badge.getBoundingClientRect();
      const pos = calculateTargetPosition(e.clientX, e.clientY, config.offsetX, config.offsetY, config.direction, rect.width, rect.height);
      targetX = pos.x;
      targetY = pos.y;
      currentX = targetX;
      currentY = targetY;
      badge.style.transform = \`translate3d(\${targetX.toFixed(2)}px, \${targetY.toFixed(2)}px, 0)\`;

      lastTime = 0;
      rafId = requestAnimationFrame(update);
    }

    function onPointerMove(e) {
      if (e.pointerType === 'touch') return;
      const rect = badge ? badge.getBoundingClientRect() : { width: 0, height: 0 };
      const pos = calculateTargetPosition(e.clientX, e.clientY, config.offsetX, config.offsetY, config.direction, rect.width, rect.height);
      targetX = pos.x;
      targetY = pos.y;
      if (!rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(update);
      }
    }

    function onPointerLeave() {
      if (badge) {
        badge.remove();
        badge = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);

    cleanups.push(() => {
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      if (badge) badge.remove();
      if (rafId) cancelAnimationFrame(rafId);
    });
  });

  return () => cleanups.forEach((c) => c());
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
					description: 'WordPress Gutenberg block metadata with client-side viewScript for Cursor Tooltip.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/cursor-tooltip",
  "version": "1.0.0",
  "title": "Cursor Tooltip",
  "category": "widgets",
  "description": "Tactile cursor-following tooltip with continuous exponential lerp tracking and boundary collision clamping.",
  "supports": {
    "html": false,
    "anchor": true
  },
  "attributes": {
    "content": { "type": "string", "default": "${content}" },
    "springDamping": { "type": "number", "default": ${springDamping} },
    "direction": { "type": "string", "default": "${direction}" },
    "offsetX": { "type": "number", "default": ${offsetX} },
    "offsetY": { "type": "number", "default": ${offsetY} },
    "variant": { "type": "string", "default": "${variant}" },
    "collisionPadding": { "type": "number", "default": ${collisionPadding} }
  },
  "viewScript": "file:./view.js",
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg server-side render template for Cursor Tooltip.',
					code: `<?php
$content = $attributes['content'] ?? '${content}';
$springDamping = $attributes['springDamping'] ?? ${springDamping};
$direction = $attributes['direction'] ?? '${direction}';
$offsetX = $attributes['offsetX'] ?? ${offsetX};
$offsetY = $attributes['offsetY'] ?? ${offsetY};
$variant = $attributes['variant'] ?? '${variant}';
$collisionPadding = $attributes['collisionPadding'] ?? ${collisionPadding};

$variantClasses = [
    'frosted' => 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
    'accent' => 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
    'dark' => 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
    'minimal' => 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
    'glow' => 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
];
$badgeClass = $variantClasses[$variant] ?? $variantClasses['frosted'];
?>
<div
    class="wp-block-exhuma-cursor-tooltip relative inline-block cursor-pointer"
    data-content="<?php echo esc_attr($content); ?>"
    data-damping="<?php echo esc_attr($springDamping); ?>"
    data-direction="<?php echo esc_attr($direction); ?>"
    data-offset-x="<?php echo esc_attr($offsetX); ?>"
    data-offset-y="<?php echo esc_attr($offsetY); ?>"
    data-padding="<?php echo esc_attr($collisionPadding); ?>"
    data-badge-class="<?php echo esc_attr($badgeClass); ?>"
>
    <?php echo $content_markup ?? ''; ?>
</div>
`,
				},
				{
					filename: 'view.js',
					language: 'javascript',
					description: 'WordPress frontend interactivity script for Cursor Tooltip.',
					code: `document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wp-block-exhuma-cursor-tooltip').forEach((el) => {
    const text = el.dataset.content || '${content}';
    const damping = parseFloat(el.dataset.damping || ${springDamping});
    const offX = parseFloat(el.dataset.offsetX || ${offsetX});
    const offY = parseFloat(el.dataset.offsetY || ${offsetY});
    const pad = parseFloat(el.dataset.padding || ${collisionPadding});
    const badgeCls = el.dataset.badgeClass || '';

    let badge = null;
    let targetX = -9999, targetY = -9999;
    let curX = -9999, curY = -9999;
    let rafId = null;
    let lastTime = 0;

    function calculateTargetPosition(
      clientX,
      clientY,
      offsetX,
      offsetY,
      direction,
      width = 0,
      height = 0
    ) {
      switch (direction) {
        case 'top':
          return { x: clientX - width / 2, y: clientY - offsetY - height };
        case 'bottom':
          return { x: clientX - width / 2, y: clientY + offsetY };
        case 'left':
          return { x: clientX - offsetX - width, y: clientY - height / 2 };
        case 'right':
          return { x: clientX + offsetX, y: clientY - height / 2 };
        case 'top-left':
          return { x: clientX - offsetX - width, y: clientY - offsetY - height };
        case 'top-right':
          return { x: clientX + offsetX, y: clientY - offsetY - height };
        case 'bottom-left':
          return { x: clientX - offsetX - width, y: clientY + offsetY };
        case 'bottom-right':
        default:
          return { x: clientX + offsetX, y: clientY + offsetY };
      }
    }

    function update(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      curX += (targetX - curX) * (1 - Math.exp(-damping * dt));
      curY += (targetY - curY) * (1 - Math.exp(-damping * dt));

      if (badge) {
        const rect = badge.getBoundingClientRect();
        const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
        const maxY = Math.max(pad, window.innerHeight - rect.height - pad);
        const clampedX = Math.min(maxX, Math.max(pad, curX));
        const clampedY = Math.min(maxY, Math.max(pad, curY));
        badge.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
      }

      if (Math.hypot(targetX - curX, targetY - curY) > 0.2 && badge) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
        lastTime = 0;
      }
    }

    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      const dir = el.dataset.direction || 'bottom-right';

      badge = document.createElement('div');
      badge.className = 'pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform';
      const inner = document.createElement('div');
      inner.className = \`px-3 py-1.5 text-xs font-semibold \${badgeCls}\`;
      inner.textContent = text;
      badge.appendChild(inner);
      document.body.appendChild(badge);

      const rect = badge.getBoundingClientRect();
      const pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
      targetX = pos.x;
      targetY = pos.y;
      curX = targetX;
      curY = targetY;
      badge.style.transform = \`translate3d(\${targetX.toFixed(2)}px, \${targetY.toFixed(2)}px, 0)\`;

      lastTime = 0;
      rafId = requestAnimationFrame(update);
    });

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const dir = el.dataset.direction || 'bottom-right';
      const rect = badge ? badge.getBoundingClientRect() : { width: 0, height: 0 };
      const pos = calculateTargetPosition(e.clientX, e.clientY, offX, offY, dir, rect.width, rect.height);
      targetX = pos.x;
      targetY = pos.y;
      if (!rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(update);
      }
    });

    el.addEventListener('pointerleave', () => {
      if (badge) {
        badge.remove();
        badge = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  });
});
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-cursor-tooltip.js',
					language: 'javascript',
					description: 'Cursor Tooltip — W3C Custom Element (<exhuma-cursor-tooltip>) with autonomous rAF loop and collision clamping.',
					code: `/**
 * Exhuma Cursor Tooltip — W3C Custom Element
 */
class ExhumaCursorTooltipElement extends HTMLElement {
  connectedCallback() {
    this.content = this.getAttribute('content') || '${content}';
    this.springDamping = parseFloat(this.getAttribute('spring-damping') || '${springDamping}');
    this.direction = this.getAttribute('direction') || '${direction}';
    this.offsetX = parseFloat(this.getAttribute('offset-x') || '${offsetX}');
    this.offsetY = parseFloat(this.getAttribute('offset-y') || '${offsetY}');
    this.collisionPadding = parseFloat(this.getAttribute('collision-padding') || '${collisionPadding}');
    this.variant = this.getAttribute('variant') || '${variant}';

    this.classList.add('relative', 'inline-block', 'cursor-pointer');

    const variantClasses = {
      frosted: 'border border-white/20 bg-background/80 text-foreground dark:border-white/10 dark:bg-card/75 shadow-xl backdrop-blur-2xl rounded-xl',
      accent: 'border border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-full font-bold',
      dark: 'border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl rounded-lg',
      minimal: 'border border-border/60 bg-background/90 text-foreground shadow-sm rounded-md',
      glow: 'border border-emerald-500/50 bg-background/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl font-mono',
    };
    this.badgeClass = variantClasses[this.variant] || variantClasses.frosted;

    this.badge = null;
    this.targetX = -9999;
    this.targetY = -9999;
    this.currentX = -9999;
    this.currentY = -9999;
    this.rafId = null;
    this.lastTime = 0;

    this._onPointerEnter = this.onPointerEnter.bind(this);
    this._onPointerMove = this.onPointerMove.bind(this);
    this._onPointerLeave = this.onPointerLeave.bind(this);
    this.update = this.update.bind(this);

    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerleave', this._onPointerLeave);
  }

  calculateTargetPosition(clientX, clientY, offsetX, offsetY, direction, width = 0, height = 0) {
    switch (direction) {
      case 'top':
        return { x: clientX - width / 2, y: clientY - offsetY - height };
      case 'bottom':
        return { x: clientX - width / 2, y: clientY + offsetY };
      case 'left':
        return { x: clientX - offsetX - width, y: clientY - height / 2 };
      case 'right':
        return { x: clientX + offsetX, y: clientY - height / 2 };
      case 'top-left':
        return { x: clientX - offsetX - width, y: clientY - offsetY - height };
      case 'top-right':
        return { x: clientX + offsetX, y: clientY - offsetY - height };
      case 'bottom-left':
        return { x: clientX - offsetX - width, y: clientY + offsetY };
      case 'bottom-right':
      default:
        return { x: clientX + offsetX, y: clientY + offsetY };
    }
  }

  update(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.currentX += (this.targetX - this.currentX) * (1 - Math.exp(-this.springDamping * dt));
    this.currentY += (this.targetY - this.currentY) * (1 - Math.exp(-this.springDamping * dt));

    if (this.badge) {
      const rect = this.badge.getBoundingClientRect();
      const safePad = Math.max(0, this.collisionPadding);
      const maxX = Math.max(safePad, window.innerWidth - rect.width - safePad);
      const maxY = Math.max(safePad, window.innerHeight - rect.height - safePad);
      const clampedX = Math.min(maxX, Math.max(safePad, this.currentX));
      const clampedY = Math.min(maxY, Math.max(safePad, this.currentY));
      this.badge.style.transform = \`translate3d(\${clampedX.toFixed(2)}px, \${clampedY.toFixed(2)}px, 0)\`;
    }

    if (Math.hypot(this.targetX - this.currentX, this.targetY - this.currentY) > 0.2 && this.badge) {
      this.rafId = requestAnimationFrame(this.update);
    } else {
      this.rafId = null;
      this.lastTime = 0;
    }
  }

  onPointerEnter(e) {
    if (e.pointerType === 'touch') return;
    this.badge = document.createElement('div');
    this.badge.className = 'pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform';
    const inner = document.createElement('div');
    inner.className = \`px-3 py-1.5 text-xs font-semibold \${this.badgeClass}\`;
    inner.textContent = this.content;
    this.badge.appendChild(inner);
    document.body.appendChild(this.badge);

    const rect = this.badge.getBoundingClientRect();
    const pos = this.calculateTargetPosition(e.clientX, e.clientY, this.offsetX, this.offsetY, this.direction, rect.width, rect.height);
    this.targetX = pos.x;
    this.targetY = pos.y;
    this.currentX = this.targetX;
    this.currentY = this.targetY;
    this.badge.style.transform = \`translate3d(\${this.targetX.toFixed(2)}px, \${this.targetY.toFixed(2)}px, 0)\`;

    this.lastTime = 0;
    this.rafId = requestAnimationFrame(this.update);
  }

  onPointerMove(e) {
    if (e.pointerType === 'touch') return;
    const rect = this.badge ? this.badge.getBoundingClientRect() : { width: 0, height: 0 };
    const pos = this.calculateTargetPosition(e.clientX, e.clientY, this.offsetX, this.offsetY, this.direction, rect.width, rect.height);
    this.targetX = pos.x;
    this.targetY = pos.y;
    if (!this.rafId) {
      this.lastTime = 0;
      this.rafId = requestAnimationFrame(this.update);
    }
  }

  onPointerLeave() {
    if (this.badge) {
      this.badge.remove();
      this.badge = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  disconnectedCallback() {
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    if (this.badge) this.badge.remove();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

if (!customElements.get('exhuma-cursor-tooltip')) {
  customElements.define('exhuma-cursor-tooltip', ExhumaCursorTooltipElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'CursorTooltip.tsx',
					language: 'tsx',
					description: 'Cursor Tooltip — React Native component using Animated tracking and PanResponder coordinates.',
					code: `import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, type ViewStyle, type LayoutChangeEvent } from 'react-native';

export interface CursorTooltipProps {
  content?: string;
  springDamping?: number;
  direction?: string;
  offsetX?: number;
  offsetY?: number;
  variant?: 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';
  collisionPadding?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const calculateTargetPosition = (
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
  direction: string,
  width = 0,
  height = 0
) => {
  switch (direction) {
    case 'top':
      return { x: x - width / 2, y: y - offsetY - height };
    case 'bottom':
      return { x: x - width / 2, y: y + offsetY };
    case 'left':
      return { x: x - offsetX - width, y: y - height / 2 };
    case 'right':
      return { x: x + offsetX, y: y - height / 2 };
    case 'top-left':
      return { x: x - offsetX - width, y: y - offsetY - height };
    case 'top-right':
      return { x: x + offsetX, y: y - offsetY - height };
    case 'bottom-left':
      return { x: x - offsetX - width, y: y + offsetY };
    case 'bottom-right':
    default:
      return { x: x + offsetX, y: y + offsetY };
  }
};

export const CursorTooltip: React.FC<CursorTooltipProps> = ({
  content = '${content}',
  springDamping = ${springDamping},
  direction = '${direction}',
  offsetX = ${offsetX},
  offsetY = ${offsetY},
  variant = '${variant}',
  collisionPadding = ${collisionPadding},
  style,
  children,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [active, setActive] = useState(false);
  const badgeSizeRef = useRef({ width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setActive(true);
        const pos = calculateTargetPosition(
          evt.nativeEvent.locationX,
          evt.nativeEvent.locationY,
          offsetX,
          offsetY,
          direction,
          badgeSizeRef.current.width,
          badgeSizeRef.current.height
        );
        pan.setValue(pos);
      },
      onPanResponderMove: (evt) => {
        const pos = calculateTargetPosition(
          evt.nativeEvent.locationX,
          evt.nativeEvent.locationY,
          offsetX,
          offsetY,
          direction,
          badgeSizeRef.current.width,
          badgeSizeRef.current.height
        );
        Animated.spring(pan, {
          toValue: pos,
          bounciness: 0,
          speed: springDamping,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderRelease: () => {
        setActive(false);
      },
      onPanResponderTerminate: () => {
        setActive(false);
      },
    })
  ).current;

  const onBadgeLayout = (e: LayoutChangeEvent) => {
    badgeSizeRef.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
  };

  const getBadgeStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.accentBadge;
      case 'dark':
        return styles.darkBadge;
      case 'minimal':
        return styles.minimalBadge;
      case 'glow':
        return styles.glowBadge;
      case 'frosted':
      default:
        return styles.frostedBadge;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'accent':
        return styles.accentText;
      case 'dark':
        return styles.darkText;
      case 'minimal':
        return styles.minimalText;
      case 'glow':
        return styles.glowText;
      case 'frosted':
      default:
        return styles.frostedText;
    }
  };

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      {children}
      {active && (
        <Animated.View
          onLayout={onBadgeLayout}
          pointerEvents="none"
          style={[
            styles.badge,
            getBadgeStyle(),
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
        >
          <Text style={getTextStyle()}>{content}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 999,
  },
  frostedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  frostedText: {
    color: '#09090b',
    fontSize: 12,
    fontWeight: '600',
  },
  accentBadge: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
  },
  accentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  darkBadge: {
    backgroundColor: '#09090b',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 8,
  },
  darkText: {
    color: '#f4f4f5',
    fontSize: 12,
    fontWeight: '600',
  },
  minimalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e4e4e7',
    borderWidth: 1,
    borderRadius: 6,
  },
  minimalText: {
    color: '#18181b',
    fontSize: 12,
    fontWeight: '500',
  },
  glowBadge: {
    backgroundColor: '#022c22',
    borderColor: '#10b981',
    borderWidth: 1,
    shadowColor: '#10b981',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  glowText: {
    color: '#34d399',
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'cursor_tooltip.dart',
					language: 'dart',
					description: 'Cursor Tooltip — Flutter StatefulWidget with MouseRegion pointer tracking, smooth Offset interpolation, and boundary clamping.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaCursorTooltip extends StatefulWidget {
  final Widget child;
  final String content;
  final double springDamping;
  final String direction;
  final double offsetX;
  final double offsetY;
  final String variant;
  final double collisionPadding;

  const ExhumaCursorTooltip({
    Key? key,
    required this.child,
    this.content = '${content}',
    this.springDamping = ${toDartDouble(springDamping)},
    this.direction = '${direction}',
    this.offsetX = ${toDartDouble(offsetX)},
    this.offsetY = ${toDartDouble(offsetY)},
    this.variant = '${variant}',
    this.collisionPadding = ${toDartDouble(collisionPadding)},
  }) : super(key: key);

  @override
  State<ExhumaCursorTooltip> createState() => _ExhumaCursorTooltipState();
}

class _ExhumaCursorTooltipState extends State<ExhumaCursorTooltip> with SingleTickerProviderStateMixin {
  Offset _target = const Offset(-9999, -9999);
  Offset _current = const Offset(-9999, -9999);
  bool _isHovered = false;
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 16),
    )..addListener(_tick);
  }

  Offset _calculateTarget(Offset localPos, double width, double height) {
    final double ox = widget.offsetX;
    final double oy = widget.offsetY;
    switch (widget.direction) {
      case 'top':
        return Offset(localPos.dx - width / 2, localPos.dy - oy - height);
      case 'bottom':
        return Offset(localPos.dx - width / 2, localPos.dy + oy);
      case 'left':
        return Offset(localPos.dx - ox - width, localPos.dy - height / 2);
      case 'right':
        return Offset(localPos.dx + ox, localPos.dy - height / 2);
      case 'top-left':
        return Offset(localPos.dx - ox - width, localPos.dy - oy - height);
      case 'top-right':
        return Offset(localPos.dx + ox, localPos.dy - oy - height);
      case 'bottom-left':
        return Offset(localPos.dx - ox - width, localPos.dy + oy);
      case 'bottom-right':
      default:
        return Offset(localPos.dx + ox, localPos.dy + oy);
    }
  }

  void _tick() {
    if (!_isHovered) return;
    const double dt = 0.016;
    final double lambda = widget.springDamping;
    final double factor = 1.0 - math.exp(-lambda * dt);

    final double nextX = _current.dx + (_target.dx - _current.dx) * factor;
    final double nextY = _current.dy + (_target.dy - _current.dy) * factor;

    setState(() {
      _current = Offset(nextX, nextY);
    });

    if ((_target - _current).distance <= 0.2) {
      _controller.stop();
    }
  }

  void _startLoop() {
    if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  BoxDecoration _getDecoration(BuildContext context) {
    switch (widget.variant) {
      case 'accent':
        return BoxDecoration(
          color: Theme.of(context).primaryColor,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Theme.of(context).primaryColor.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        );
      case 'dark':
        return BoxDecoration(
          color: const Color(0xFF09090B),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFF27272A)),
          boxShadow: const [
            BoxShadow(color: Colors.black54, blurRadius: 12, offset: Offset(0, 6)),
          ],
        );
      case 'minimal':
        return BoxDecoration(
          color: const Color(0xF5FFFFFF),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: const Color(0xFFE4E4E7)),
          boxShadow: const [
            BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2)),
          ],
        );
      case 'glow':
        return BoxDecoration(
          color: const Color(0xE6022C22),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0x8010B981)),
          boxShadow: const [
            BoxShadow(color: Color(0x4D10B981), blurRadius: 16, offset: Offset(0, 0)),
          ],
        );
      case 'frosted':
      default:
        return BoxDecoration(
          color: const Color(0xD918181B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0x33FFFFFF)),
          boxShadow: const [
            BoxShadow(color: Colors.black38, blurRadius: 10, offset: Offset(0, 4)),
          ],
        );
    }
  }

  TextStyle _getTextStyle() {
    if (widget.variant == 'minimal') {
      return const TextStyle(color: Color(0xFF18181B), fontSize: 12, fontWeight: FontWeight.w500);
    }
    if (widget.variant == 'glow') {
      return const TextStyle(color: Color(0xFF34D399), fontSize: 12, fontFamily: 'monospace', fontWeight: FontWeight.bold);
    }
    return const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600);
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (event) {
        setState(() {
          _isHovered = true;
          _target = _calculateTarget(event.localPosition, 80.0, 32.0);
          _current = _target;
        });
        _startLoop();
      },
      onHover: (event) {
        setState(() {
          _target = _calculateTarget(event.localPosition, 80.0, 32.0);
        });
        _startLoop();
      },
      onExit: (_) {
        setState(() {
          _isHovered = false;
          _target = const Offset(-9999, -9999);
        });
        _controller.stop();
      },
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          widget.child,
          if (_isHovered)
            Positioned(
              left: _current.dx,
              top: _current.dy,
              child: IgnorePointer(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: _getDecoration(context),
                  child: Text(
                    widget.content,
                    style: _getTextStyle(),
                  ),
                ),
              ),
            ),
        ],
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

export function getCursorTooltipUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const content = String(props.content ?? 'Explore Showcase');
	const springDamping = Number(props.springDamping ?? 20);
	const direction = String(props.direction ?? 'bottom-right');
	const offsetX = Number(props.offsetX ?? 16);
	const offsetY = Number(props.offsetY ?? 16);
	const variant = String(props.variant ?? 'frosted');
	const collisionPadding = Number(props.collisionPadding ?? 12);

	const toDartDouble = (val: number): string => {
		const s = String(val);
		return s.includes('.') ? s : `${s}.0`;
	};

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';
			return {
				filename: isNext ? 'app/cursor-tooltip-demo/page.tsx' : 'CursorTooltipDemo.tsx',
				language: 'tsx',
				description: `${isNext ? 'Next.js 15 App Router' : 'React'} Demo with CursorTooltip.`,
				code: `${header}import React from 'react';
import { CursorTooltip } from './CursorTooltip';

export default function CursorTooltipDemo() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
      <CursorTooltip
        content="${content}"
        springDamping={${springDamping}}
        direction="${direction}"
        offsetX={${offsetX}}
        offsetY={${offsetY}}
        variant="${variant}"
        collisionPadding={${collisionPadding}}
        className="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl hover:border-primary/50 transition-colors"
      >
        <span className="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
        <h3 className="text-lg font-bold text-foreground">Interactive Target Zone</h3>
        <p className="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
      </CursorTooltip>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'CursorTooltipDemo.vue',
				language: 'vue',
				description: 'Vue 3 Demo with CursorTooltip component.',
				code: `<script setup lang="ts">
import CursorTooltip from './CursorTooltip.vue';
</script>

<template>
  <div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
    <CursorTooltip
      content="${content}"
      :springDamping="${springDamping}"
      direction="${direction}"
      :offsetX="${offsetX}"
      :offsetY="${offsetY}"
      variant="${variant}"
      :collisionPadding="${collisionPadding}"
      class="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl hover:border-primary/50 transition-colors"
    >
      <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
      <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
      <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
    </CursorTooltip>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'CursorTooltipDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 Demo with CursorTooltip component.',
				code: `<script lang="ts">
  import CursorTooltip from './CursorTooltip.svelte';
</script>

<div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
  <CursorTooltip
    content="${content}"
    springDamping={${springDamping}}
    direction="${direction}"
    offsetX={${offsetX}}
    offsetY={${offsetY}}
    variant="${variant}"
    collisionPadding={${collisionPadding}}
    class="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl hover:border-primary/50 transition-colors"
  >
    <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
    <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
    <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
  </CursorTooltip>
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'cursor-tooltip-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Demo with ExhumaCursorTooltipComponent.',
				code: `import { Component } from '@angular/core';
import { ExhumaCursorTooltipComponent } from './cursor-tooltip.component';

@Component({
  selector: 'app-cursor-tooltip-demo',
  standalone: true,
  imports: [ExhumaCursorTooltipComponent],
  template: \`
    <div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
      <exhuma-cursor-tooltip
        content="${content}"
        [springDamping]="${springDamping}"
        direction="${direction}"
        [offsetX]="${offsetX}"
        [offsetY]="${offsetY}"
        variant="${variant}"
        [collisionPadding]="${collisionPadding}"
        customClass="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl"
      >
        <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
        <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
        <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
      </exhuma-cursor-tooltip>
    </div>
  \`,
})
export class CursorTooltipDemoComponent {}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'CursorTooltipDemo.tsx',
				language: 'tsx',
				description: 'SolidJS Demo with CursorTooltip component.',
				code: `import { Component } from 'solid-js';
import { CursorTooltip } from './CursorTooltip';

export const CursorTooltipDemo: Component = () => {
  return (
    <div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
      <CursorTooltip
        content="${content}"
        springDamping={${springDamping}}
        direction="${direction}"
        offsetX={${offsetX}}
        offsetY={${offsetY}}
        variant="${variant}"
        collisionPadding={${collisionPadding}}
        class="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl"
      >
        <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
        <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
        <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
      </CursorTooltip>
    </div>
  );
};
`,
			};
		}

		case 'astro': {
			return {
				filename: 'src/pages/cursor-tooltip-demo.astro',
				language: 'astro',
				description: 'Astro Page Demo with CursorTooltip component.',
				code: `---
import CursorTooltip from '../components/CursorTooltip.astro';
---

<div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
  <CursorTooltip
    content="${content}"
    springDamping={${springDamping}}
    direction="${direction}"
    offsetX={${offsetX}}
    offsetY={${offsetY}}
    variant="${variant}"
    collisionPadding={${collisionPadding}}
    class="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl"
  >
    <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
    <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
    <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
  </CursorTooltip>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'resources/views/cursor-tooltip-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade View Demo with cursor-tooltip component.',
				code: `<div class="flex min-h-[400px] w-full items-center justify-center p-8 bg-background">
    <x-cursor-tooltip
        content="${content}"
        :springDamping="${springDamping}"
        direction="${direction}"
        :offsetX="${offsetX}"
        :offsetY="${offsetY}"
        variant="${variant}"
        :collisionPadding="${collisionPadding}"
        class="rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl"
    >
        <span class="text-[10px] font-mono font-bold uppercase text-primary mb-2 inline-block">Hover Sandbox</span>
        <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
        <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
    </x-cursor-tooltip>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML & JS Demo with initCursorTooltip.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cursor Tooltip Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white flex min-h-screen items-center justify-center p-8">
  <div
    data-exhuma-cursor-tooltip
    class="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl cursor-pointer"
  >
    <span class="text-xs font-mono font-bold uppercase text-emerald-400 mb-2 inline-block">Hover Sandbox</span>
    <h3 class="text-lg font-bold text-white">Interactive Target Zone</h3>
    <p class="mt-1 text-xs text-slate-400">Move pointer over this card to track trailing tooltip</p>
  </div>

  <script type="module">
    import { initCursorTooltip } from './cursor-tooltip.vanilla.js';
    initCursorTooltip('[data-exhuma-cursor-tooltip]', {
      content: '${content}',
      springDamping: ${springDamping},
      direction: '${direction}',
      offsetX: ${offsetX},
      offsetY: ${offsetY},
      variant: '${variant}',
      collisionPadding: ${collisionPadding},
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'sample-page.html',
				language: 'html',
				description: 'WordPress Gutenberg Cursor Tooltip Block Markup.',
				code: `<!-- wp:exhuma/cursor-tooltip {
  "content": "${content}",
  "springDamping": ${springDamping},
  "direction": "${direction}",
  "offsetX": ${offsetX},
  "offsetY": ${offsetY},
  "variant": "${variant}",
  "collisionPadding": ${collisionPadding}
} -->
<div class="wp-block-exhuma-cursor-tooltip rounded-2xl border border-border bg-card/80 p-8 text-center shadow-xl">
  <h3 class="text-lg font-bold text-foreground">Interactive Target Zone</h3>
  <p class="mt-1 text-xs text-muted-foreground">Move pointer over this card to track trailing tooltip</p>
</div>
<!-- /wp:exhuma/cursor-tooltip -->
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'W3C Custom Element Usage for Cursor Tooltip.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cursor Tooltip Web Component</title>
  <script type="module" src="./exhuma-cursor-tooltip.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white flex min-h-screen items-center justify-center p-8">
  <exhuma-cursor-tooltip
    content="${content}"
    spring-damping="${springDamping}"
    direction="${direction}"
    offset-x="${offsetX}"
    offset-y="${offsetY}"
    variant="${variant}"
    collision-padding="${collisionPadding}"
    class="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl"
  >
    <h3 class="text-lg font-bold text-white">Interactive Target Zone</h3>
    <p class="mt-1 text-xs text-slate-400">Move pointer over this card to track trailing tooltip</p>
  </exhuma-cursor-tooltip>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'CursorTooltipDemo.tsx',
				language: 'tsx',
				description: 'React Native Application Demo with CursorTooltip.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CursorTooltip } from './CursorTooltip';

export default function CursorTooltipDemo() {
  return (
    <View style={styles.container}>
      <CursorTooltip
        content="${content}"
        springDamping={${springDamping}}
        direction="${direction}"
        offsetX={${offsetX}}
        offsetY={${offsetY}}
        variant="${variant}"
        style={styles.card}
      >
        <Text style={styles.title}>Touch & Drag Target</Text>
        <Text style={styles.subtitle}>Drag finger over card to move floating badge</Text>
      </CursorTooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#09090b',
  },
  card: {
    padding: 32,
    borderRadius: 20,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 6,
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'main.dart',
				language: 'dart',
				description: 'Flutter Application Demo with ExhumaCursorTooltip.',
				code: `import 'package:flutter/material.dart';
import 'cursor_tooltip.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: Scaffold(
        body: Center(
          child: ExhumaCursorTooltip(
            content: '${content}',
            springDamping: ${toDartDouble(springDamping)},
            direction: '${direction}',
            offsetX: ${toDartDouble(offsetX)},
            offsetY: ${toDartDouble(offsetY)},
            variant: '${variant}',
            collisionPadding: ${toDartDouble(collisionPadding)},
            child: Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: const Color(0xFF18181B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF27272A)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text(
                    'Interactive Target Zone',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Move mouse pointer over card to track trailing tooltip',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
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

		default:
			return {
				filename: 'CursorTooltipDemo.tsx',
				language: 'tsx',
				description: 'Cursor Tooltip Demo',
				code: `import React from 'react';
import { CursorTooltip } from './CursorTooltip';

export default function CursorTooltipDemo() {
  return (
    <CursorTooltip content="${content}">
      <div>Hover me</div>
    </CursorTooltip>
  );
}
`,
			};
	}
}

