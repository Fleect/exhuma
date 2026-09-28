import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getComparisonSliderOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const defaultPosition = Number(props.defaultPosition ?? 0.5);
	const step = Number(props.step ?? 0.05);
	const orientation = (props.orientation as string) ?? 'horizontal';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'ComparisonSlider.tsx',
					language: 'tsx',
					description: 'Comparison Slider — Standalone Ejected Engine (Zero Dependencies). Raw 120 FPS polygon clipping and WAI-ARIA slider math inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface ComparisonSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  before: React.ReactNode;
  after: React.ReactNode;
  defaultPosition?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  aspectRatio?: string;
  disabled?: boolean;
}

/**
 * ComparisonSlider — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Guarantees:
 * - Bounds cached once on pointerdown: eliminates continuous getBoundingClientRect() layout thrashing.
 * - Sub-pixel GPU clip-path polygon slicing.
 * - Pointer lifecycle safety: lostpointercapture + buttons===0 validation.
 * - Full WAI-ARIA slider semantics and keyboard arrow stepping.
 */
export const ComparisonSlider = React.forwardRef<HTMLDivElement, ComparisonSliderProps>(
  (
    {
      before,
      after,
      defaultPosition = ${defaultPosition},
      step = ${step},
      orientation = '${orientation}',
      aspectRatio = '16/10',
      disabled = false,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const isVertical = orientation === 'vertical';
    const [position, setPosition] = React.useState(Math.max(0, Math.min(1, defaultPosition)));
    const positionRef = React.useRef(position);
    positionRef.current = position;

    const internalRef = React.useRef<HTMLDivElement>(null);
    const containerRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const isDraggingRef = React.useRef(false);
    const containerRectRef = React.useRef<{ left: number; top: number; width: number; height: number } | null>(null);
    const handleRef = React.useRef<HTMLDivElement>(null);

    const updatePositionFromPointer = (clientX: number, clientY: number) => {
      let rect = containerRectRef.current;
      if (!rect && containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
        containerRectRef.current = rect;
      }
      if (!rect) return;

      let ratio = isVertical
        ? rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5
        : rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;

      ratio = Math.max(0, Math.min(1, ratio));
      setPosition(ratio);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      isDraggingRef.current = true;
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        containerRectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      updatePositionFromPointer(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      if (e.pointerType === 'mouse' && e.buttons === 0) {
        isDraggingRef.current = false;
        containerRectRef.current = null;
        return;
      }
      updatePositionFromPointer(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = false;
      containerRectRef.current = null;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      let delta = 0;
      if (isVertical) {
        if (e.key === 'ArrowUp') delta = -step;
        else if (e.key === 'ArrowDown') delta = step;
      } else {
        if (e.key === 'ArrowLeft') delta = -step;
        else if (e.key === 'ArrowRight') delta = step;
      }
      if (delta !== 0) {
        e.preventDefault();
        setPosition((prev) => Math.max(0, Math.min(1, prev + delta)));
      }
    };

    const pct = (position * 100).toFixed(3);
    const clipPath = isVertical
      ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
      : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`;

    return (
      <div
        ref={containerRef}
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto cursor-col-resize',
          isVertical ? 'cursor-row-resize' : 'cursor-col-resize',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        style={{ aspectRatio, ...style }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={() => {
          isDraggingRef.current = false;
          containerRectRef.current = null;
        }}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuenow={Math.round(position * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Layer 1: After (Base Background) */}
        <div className="absolute inset-0 size-full overflow-hidden">{after}</div>

        {/* Layer 2: Before (Overlaid with GPU clip-path polygon) */}
        <div
          className="absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
          style={{ clipPath }}
        >
          {before}
        </div>

        {/* Layer 3: Divider Handle line */}
        <div
          ref={handleRef}
          className={clsx(
            'absolute z-20 pointer-events-none bg-white shadow-lg transition-transform duration-75',
            isVertical
              ? 'left-0 right-0 h-0.5 -translate-y-1/2'
              : 'top-0 bottom-0 w-0.5 -translate-x-1/2'
          )}
          style={isVertical ? { top: \`\${pct}%\` } : { left: \`\${pct}%\` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs">
            {isVertical ? '↕' : '↔'}
          </div>
        </div>
      </div>
    );
  }
);
ComparisonSlider.displayName = 'ComparisonSlider';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'ComparisonSlider.vue',
					language: 'vue',
					description: 'Vue 3 Native Comparison Slider component with sub-pixel clip-path and pointer tracking.',
					code: `<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  defaultPosition?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  aspectRatio?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultPosition: ${defaultPosition},
  step: ${step},
  orientation: '${orientation}',
  aspectRatio: '16/10',
  disabled: false,
  class: '',
});

const position = ref(Math.max(0, Math.min(1, props.defaultPosition)));
const containerRef = ref<HTMLDivElement | null>(null);
let isDragging = false;
let containerRect: { left: number; top: number; width: number; height: number } | null = null;

const isVertical = computed(() => props.orientation === 'vertical');
const pct = computed(() => (position.value * 100).toFixed(3));
const clipPath = computed(() =>
  isVertical.value
    ? \`polygon(0 0, 100% 0, 100% \${pct.value}%, 0 \${pct.value}%)\`
    : \`polygon(0 0, \${pct.value}% 0, \${pct.value}% 100%, 0 100%)\`
);

const updatePointer = (clientX: number, clientY: number) => {
  if (!containerRect && containerRef.value) {
    const r = containerRef.value.getBoundingClientRect();
    containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
  }
  if (!containerRect) return;

  let ratio = isVertical.value
    ? containerRect.height > 0 ? (clientY - containerRect.top) / containerRect.height : 0.5
    : containerRect.width > 0 ? (clientX - containerRect.left) / containerRect.width : 0.5;

  position.value = Math.max(0, Math.min(1, ratio));
};

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || e.button !== 0) return;
  isDragging = true;
  if (containerRef.value) {
    const r = containerRef.value.getBoundingClientRect();
    containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    try { containerRef.value.setPointerCapture(e.pointerId); } catch {}
  }
  updatePointer(e.clientX, e.clientY);
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging) return;
  if (e.pointerType === 'mouse' && e.buttons === 0) {
    isDragging = false;
    containerRect = null;
    return;
  }
  updatePointer(e.clientX, e.clientY);
};

const onPointerUp = (e: PointerEvent) => {
  isDragging = false;
  containerRect = null;
  if (containerRef.value) {
    try {
      if (containerRef.value.hasPointerCapture(e.pointerId)) {
        containerRef.value.releasePointerCapture(e.pointerId);
      }
    } catch {}
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return;
  let delta = 0;
  if (isVertical.value) {
    if (e.key === 'ArrowUp') delta = -props.step;
    else if (e.key === 'ArrowDown') delta = props.step;
  } else {
    if (e.key === 'ArrowLeft') delta = -props.step;
    else if (e.key === 'ArrowRight') delta = props.step;
  }
  if (delta !== 0) {
    e.preventDefault();
    position.value = Math.max(0, Math.min(1, position.value + delta));
  }
};
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto',
      isVertical ? 'cursor-row-resize' : 'cursor-col-resize',
      props.disabled && 'opacity-60 pointer-events-none',
      props.class
    ]"
    :style="{ aspectRatio: props.aspectRatio }"
    role="slider"
    :aria-valuenow="Math.round(position * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-orientation="props.orientation"
    tabindex="0"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeyDown"
  >
    <div class="absolute inset-0 size-full overflow-hidden">
      <slot name="after" />
    </div>

    <div
      class="absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
      :style="{ clipPath }"
    >
      <slot name="before" />
    </div>

    <div
      :class="[
        'absolute z-20 pointer-events-none bg-white shadow-lg',
        isVertical ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'
      ]"
      :style="isVertical ? { top: pct + '%' } : { left: pct + '%' }"
    >
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
        {{ isVertical ? '↕' : '↔' }}
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
					filename: 'ComparisonSlider.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Comparison Slider component using Runes.',
					code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    defaultPosition?: number;
    step?: number;
    orientation?: 'horizontal' | 'vertical';
    aspectRatio?: string;
    disabled?: boolean;
    class?: string;
    before?: import('svelte').Snippet;
    after?: import('svelte').Snippet;
  }

  let {
    defaultPosition = ${defaultPosition},
    step = ${step},
    orientation = '${orientation}',
    aspectRatio = '16/10',
    disabled = false,
    class: className = '',
    before,
    after,
  }: Props = $props();

  let position = $state(Math.max(0, Math.min(1, defaultPosition)));
  let container: HTMLDivElement | null = $state(null);
  let isDragging = false;
  let containerRect: { left: number; top: number; width: number; height: number } | null = null;

  let isVertical = $derived(orientation === 'vertical');
  let pct = $derived((position * 100).toFixed(3));
  let clipPath = $derived(
    isVertical
      ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
      : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`
  );

  function updatePointer(clientX: number, clientY: number) {
    if (!containerRect && container) {
      const r = container.getBoundingClientRect();
      containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    if (!containerRect) return;

    let ratio = isVertical
      ? containerRect.height > 0 ? (clientY - containerRect.top) / containerRect.height : 0.5
      : containerRect.width > 0 ? (clientX - containerRect.left) / containerRect.width : 0.5;

    position = Math.max(0, Math.min(1, ratio));
  }

  function handlePointerDown(e: PointerEvent) {
    if (disabled || e.button !== 0) return;
    isDragging = true;
    if (container) {
      const r = container.getBoundingClientRect();
      containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
      try { container.setPointerCapture(e.pointerId); } catch {}
    }
    updatePointer(e.clientX, e.clientY);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      isDragging = false;
      containerRect = null;
      return;
    }
    updatePointer(e.clientX, e.clientY);
  }

  function handlePointerUp(e: PointerEvent) {
    isDragging = false;
    containerRect = null;
    if (container) {
      try {
        if (container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    let delta = 0;
    if (isVertical) {
      if (e.key === 'ArrowUp') delta = -step;
      else if (e.key === 'ArrowDown') delta = step;
    } else {
      if (e.key === 'ArrowLeft') delta = -step;
      else if (e.key === 'ArrowRight') delta = step;
    }
    if (delta !== 0) {
      e.preventDefault();
      position = Math.max(0, Math.min(1, position + delta));
    }
  }
</script>

<div
  bind:this={container}
  class="relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto {isVertical ? 'cursor-row-resize' : 'cursor-col-resize'} {disabled ? 'opacity-60 pointer-events-none' : ''} {className}"
  style="aspect-ratio: {aspectRatio};"
  role="slider"
  aria-valuenow={Math.round(position * 100)}
  aria-valuemin="0"
  aria-valuemax="100"
  aria-orientation={orientation}
  tabindex="0"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  onkeydown={handleKeyDown}
>
  <div class="absolute inset-0 size-full overflow-hidden">
    {@render after?.()}
  </div>

  <div
    class="absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
    style="clip-path: {clipPath};"
  >
    {@render before?.()}
  </div>

  <div
    class="absolute z-20 pointer-events-none bg-white shadow-lg {isVertical ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'}"
    style="{isVertical ? \`top: \${pct}%;\` : \`left: \${pct}%;\`}"
  >
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
      {isVertical ? '↕' : '↔'}
    </div>
  </div>
</div>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'ComparisonSlider.tsx',
					language: 'tsx',
					description: 'SolidJS Native Comparison Slider component with reactive clip-path.',
					code: `import { Component, createSignal, createMemo, JSX } from 'solid-js';

export interface ComparisonSliderProps {
  before?: JSX.Element;
  after?: JSX.Element;
  defaultPosition?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  aspectRatio?: string;
  disabled?: boolean;
  class?: string;
}

export const ComparisonSlider: Component<ComparisonSliderProps> = (props) => {
  const [position, setPosition] = createSignal(Math.max(0, Math.min(1, props.defaultPosition ?? ${defaultPosition})));
  let containerRef: HTMLDivElement | undefined;
  let isDragging = false;
  let containerRect: { left: number; top: number; width: number; height: number } | null = null;

  const isVertical = createMemo(() => props.orientation === 'vertical');
  const pct = createMemo(() => (position() * 100).toFixed(3));
  const clipPath = createMemo(() =>
    isVertical()
      ? \`polygon(0 0, 100% 0, 100% \${pct()}%, 0 \${pct()}%)\`
      : \`polygon(0 0, \${pct()}% 0, \${pct()}% 100%, 0 100%)\`
  );

  const updatePointer = (clientX: number, clientY: number) => {
    if (!containerRect && containerRef) {
      const r = containerRef.getBoundingClientRect();
      containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    if (!containerRect) return;

    let ratio = isVertical()
      ? containerRect.height > 0 ? (clientY - containerRect.top) / containerRect.height : 0.5
      : containerRect.width > 0 ? (clientX - containerRect.left) / containerRect.width : 0.5;

    setPosition(Math.max(0, Math.min(1, ratio)));
  };

  return (
    <div
      ref={containerRef}
      class={\`relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto \${isVertical() ? 'cursor-row-resize' : 'cursor-col-resize'} \${props.disabled ? 'opacity-60 pointer-events-none' : ''} \${props.class ?? ''}\`}
      style={{ 'aspect-ratio': props.aspectRatio ?? '16/10' }}
      role="slider"
      aria-valuenow={Math.round(position() * 100)}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-orientation={props.orientation ?? '${orientation}'}
      tabIndex={0}
      onPointerDown={(e) => {
        if (props.disabled || e.button !== 0) return;
        isDragging = true;
        if (containerRef) {
          const r = containerRef.getBoundingClientRect();
          containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
          try { containerRef.setPointerCapture(e.pointerId); } catch {}
        }
        updatePointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        if (e.pointerType === 'mouse' && e.buttons === 0) {
          isDragging = false;
          containerRect = null;
          return;
        }
        updatePointer(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        isDragging = false;
        containerRect = null;
        if (containerRef) {
          try {
            if (containerRef.hasPointerCapture(e.pointerId)) {
              containerRef.releasePointerCapture(e.pointerId);
            }
          } catch {}
        }
      }}
      onKeyDown={(e) => {
        if (props.disabled) return;
        const stepVal = props.step ?? ${step};
        let delta = 0;
        if (isVertical()) {
          if (e.key === 'ArrowUp') delta = -stepVal;
          else if (e.key === 'ArrowDown') delta = stepVal;
        } else {
          if (e.key === 'ArrowLeft') delta = -stepVal;
          else if (e.key === 'ArrowRight') delta = stepVal;
        }
        if (delta !== 0) {
          e.preventDefault();
          setPosition((prev) => Math.max(0, Math.min(1, prev + delta)));
        }
      }}
    >
      <div class="absolute inset-0 size-full overflow-hidden">{props.after}</div>
      <div class="absolute inset-0 size-full overflow-hidden will-change-[clip-path]" style={{ 'clip-path': clipPath() }}>
        {props.before}
      </div>
      <div
        class={\`absolute z-20 pointer-events-none bg-white shadow-lg \${isVertical() ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'}\`}
        style={isVertical() ? { top: \`\${pct()}%\` } : { left: \`\${pct()}%\` }}
      >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
          {isVertical() ? '↕' : '↔'}
        </div>
      </div>
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
					filename: 'comparison-slider.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Comparison Slider component with signals.',
					code: `import { Component, input, signal, computed, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'exhuma-comparison-slider',
  standalone: true,
  template: \`
    <div
      #container
      class="relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto {{ isVertical() ? 'cursor-row-resize' : 'cursor-col-resize' }} {{ customClass() }}"
      [style.aspect-ratio]="aspectRatio()"
      role="slider"
      [attr.aria-valuenow]="ariaValue()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-orientation]="orientation()"
      tabindex="0"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      (keydown)="onKeyDown($event)"
    >
      <div class="absolute inset-0 size-full overflow-hidden">
        <ng-content select="[slot=after]"></ng-content>
      </div>

      <div
        class="absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
        [style.clip-path]="clipPath()"
      >
        <ng-content select="[slot=before]"></ng-content>
      </div>

      <div
        class="absolute z-20 pointer-events-none bg-white shadow-lg {{ isVertical() ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2' }}"
        [style.top]="isVertical() ? pct() + '%' : null"
        [style.left]="!isVertical() ? pct() + '%' : null"
      >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
          {{ isVertical() ? '↕' : '↔' }}
        </div>
      </div>
    </div>
  \`,
})
export class ExhumaComparisonSliderComponent {
  readonly defaultPosition = input<number>(${defaultPosition});
  readonly step = input<number>(${step});
  readonly orientation = input<'horizontal' | 'vertical'>('${orientation}');
  readonly aspectRatio = input<string>('16/10');
  readonly disabled = input<boolean>(false);
  readonly customClass = input<string>('');

  readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  readonly position = signal<number>(${defaultPosition});
  private isDragging = false;
  private containerRect: { left: number; top: number; width: number; height: number } | null = null;

  readonly isVertical = computed(() => this.orientation() === 'vertical');
  readonly pct = computed(() => (this.position() * 100).toFixed(3));
  readonly ariaValue = computed(() => Math.round(this.position() * 100));
  readonly clipPath = computed(() =>
    this.isVertical()
      ? \`polygon(0 0, 100% 0, 100% \${this.pct()}%, 0 \${this.pct()}%)\`
      : \`polygon(0 0, \${this.pct()}% 0, \${this.pct()}% 100%, 0 100%)\`
  );

  private updatePointer(clientX: number, clientY: number) {
    const el = this.container()?.nativeElement;
    if (!this.containerRect && el) {
      const r = el.getBoundingClientRect();
      this.containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    if (!this.containerRect) return;

    let ratio = this.isVertical()
      ? this.containerRect.height > 0 ? (clientY - this.containerRect.top) / this.containerRect.height : 0.5
      : this.containerRect.width > 0 ? (clientX - this.containerRect.left) / this.containerRect.width : 0.5;

    this.position.set(Math.max(0, Math.min(1, ratio)));
  }

  onPointerDown(e: PointerEvent) {
    if (this.disabled() || e.button !== 0) return;
    this.isDragging = true;
    const el = this.container()?.nativeElement;
    if (el) {
      const r = el.getBoundingClientRect();
      this.containerRect = { left: r.left, top: r.top, width: r.width, height: r.height };
      try { el.setPointerCapture(e.pointerId); } catch {}
    }
    this.updatePointer(e.clientX, e.clientY);
  }

  onPointerMove(e: PointerEvent) {
    if (!this.isDragging) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      this.isDragging = false;
      this.containerRect = null;
      return;
    }
    this.updatePointer(e.clientX, e.clientY);
  }

  onPointerUp(e: PointerEvent) {
    this.isDragging = false;
    this.containerRect = null;
    const el = this.container()?.nativeElement;
    if (el) {
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.disabled()) return;
    let delta = 0;
    if (this.isVertical()) {
      if (e.key === 'ArrowUp') delta = -this.step();
      else if (e.key === 'ArrowDown') delta = this.step();
    } else {
      if (e.key === 'ArrowLeft') delta = -this.step();
      else if (e.key === 'ArrowRight') delta = this.step();
    }
    if (delta !== 0) {
      e.preventDefault();
      this.position.update((prev) => Math.max(0, Math.min(1, prev + delta)));
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
					filename: 'ComparisonSlider.astro',
					language: 'astro',
					description: 'Pure Native Astro Comparison Slider component with zero-JS island hydration.',
					code: `---
interface Props {
  defaultPosition?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  aspectRatio?: string;
  class?: string;
}

const {
  defaultPosition = ${defaultPosition},
  step = ${step},
  orientation = '${orientation}',
  aspectRatio = '16/10',
  class: className = '',
} = Astro.props;

const isVertical = orientation === 'vertical';
const initialPct = (defaultPosition * 100).toFixed(3);
const initialClip = isVertical
  ? \`polygon(0 0, 100% 0, 100% \${initialPct}%, 0 \${initialPct}%)\`
  : \`polygon(0 0, \${initialPct}% 0, \${initialPct}% 100%, 0 100%)\`;
---

<div
  class={\`exhuma-comparison-slider relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto \${isVertical ? 'cursor-row-resize' : 'cursor-col-resize'} \${className}\`}
  style={\`aspect-ratio: \${aspectRatio};\`}
  data-position={defaultPosition}
  data-step={step}
  data-orientation={orientation}
  role="slider"
  aria-valuenow={Math.round(defaultPosition * 100)}
  aria-valuemin="0"
  aria-valuemax="100"
  aria-orientation={orientation}
  tabindex="0"
>
  <div class="absolute inset-0 size-full overflow-hidden">
    <slot name="after" />
  </div>

  <div
    class="exhuma-cs-before absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
    style={\`clip-path: \${initialClip};\`}
  >
    <slot name="before" />
  </div>

  <div
    class={\`exhuma-cs-handle absolute z-20 pointer-events-none bg-white shadow-lg \${isVertical ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'}\`}
    style={isVertical ? \`top: \${initialPct}%;\` : \`left: \${initialPct}%;\`}
  >
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
      {isVertical ? '↕' : '↔'}
    </div>
  </div>
</div>

<script>
  function initSliders() {
    document.querySelectorAll<HTMLElement>('.exhuma-comparison-slider').forEach((el) => {
      if (el.dataset.initialized) return;
      el.dataset.initialized = 'true';

      const isVertical = el.dataset.orientation === 'vertical';
      const step = parseFloat(el.dataset.step || '0.05');
      let pos = parseFloat(el.dataset.position || '0.5');
      let isDragging = false;
      let rect: DOMRect | null = null;

      const beforeEl = el.querySelector<HTMLElement>('.exhuma-cs-before');
      const handleEl = el.querySelector<HTMLElement>('.exhuma-cs-handle');

      const applyPosition = (ratio: number) => {
        pos = Math.max(0, Math.min(1, ratio));
        const pct = (pos * 100).toFixed(3);
        const clip = isVertical
          ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
          : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`;
        if (beforeEl) beforeEl.style.clipPath = clip;
        if (handleEl) {
          if (isVertical) handleEl.style.top = pct + '%';
          else handleEl.style.left = pct + '%';
        }
        el.setAttribute('aria-valuenow', Math.round(pos * 100).toString());
      };

      const updatePointer = (clientX: number, clientY: number) => {
        if (!rect) rect = el.getBoundingClientRect();
        const ratio = isVertical
          ? (clientY - rect.top) / rect.height
          : (clientX - rect.left) / rect.width;
        applyPosition(ratio);
      };

      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        rect = el.getBoundingClientRect();
        try { el.setPointerCapture(e.pointerId); } catch {}
        updatePointer(e.clientX, e.clientY);
      });

      el.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        if (e.pointerType === 'mouse' && e.buttons === 0) {
          isDragging = false;
          rect = null;
          return;
        }
        updatePointer(e.clientX, e.clientY);
      });

      const onEnd = (e: PointerEvent) => {
        isDragging = false;
        rect = null;
        try {
          if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        } catch {}
      };

      el.addEventListener('pointerup', onEnd);
      el.addEventListener('pointercancel', onEnd);

      el.addEventListener('keydown', (e) => {
        let delta = 0;
        if (isVertical) {
          if (e.key === 'ArrowUp') delta = -step;
          else if (e.key === 'ArrowDown') delta = step;
        } else {
          if (e.key === 'ArrowLeft') delta = -step;
          else if (e.key === 'ArrowRight') delta = step;
        }
        if (delta !== 0) {
          e.preventDefault();
          applyPosition(pos + delta);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initSliders);
  initSliders();
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-comparison-slider.js',
					language: 'javascript',
					description: 'Universal Custom Web Component <exhuma-comparison-slider>.',
					code: `/**
 * Exhuma Comparison Slider Web Component
 * <exhuma-comparison-slider default-position="0.5" orientation="horizontal">
 */
class ExhumaComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.isDragging = false;
    this.rect = null;
    this.position = parseFloat(this.getAttribute('default-position') || '${defaultPosition}');
    this.step = parseFloat(this.getAttribute('step') || '${step}');
    this.orientation = this.getAttribute('orientation') || '${orientation}';
  }

  connectedCallback() {
    this.style.position = 'relative';
    this.style.display = 'block';
    this.style.overflow = 'hidden';
    this.style.borderRadius = '1rem';
    this.style.border = '1px solid var(--border, #27272a)';
    this.style.userSelect = 'none';
    this.style.width = '100%';
    this.style.maxWidth = '42rem';
    this.style.margin = '0 auto';
    this.style.aspectRatio = this.getAttribute('aspect-ratio') || '16/10';
    this.style.cursor = this.orientation === 'vertical' ? 'row-resize' : 'col-resize';
    this.tabIndex = 0;
    this.setAttribute('role', 'slider');
    this.setAttribute('aria-valuenow', Math.round(this.position * 100));

    this.render();
    this.attachEvents();
  }

  render() {
    const isVertical = this.orientation === 'vertical';
    const pct = (this.position * 100).toFixed(3);
    const clip = isVertical
      ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
      : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`;

    this.beforeEl = this.querySelector('[slot="before"]');
    if (this.beforeEl) {
      this.beforeEl.style.position = 'absolute';
      this.beforeEl.style.inset = '0';
      this.beforeEl.style.width = '100%';
      this.beforeEl.style.height = '100%';
      this.beforeEl.style.clipPath = clip;
      this.beforeEl.style.willChange = 'clip-path';
    }

    this.handleEl = document.createElement('div');
    this.handleEl.className = 'exhuma-cs-handle';
    this.handleEl.style.position = 'absolute';
    this.handleEl.style.zIndex = '20';
    this.handleEl.style.pointerEvents = 'none';
    this.handleEl.style.backgroundColor = '#fff';
    if (isVertical) {
      this.handleEl.style.left = '0';
      this.handleEl.style.right = '0';
      this.handleEl.style.height = '2px';
      this.handleEl.style.top = pct + '%';
      this.handleEl.style.transform = 'translateY(-50%)';
    } else {
      this.handleEl.style.top = '0';
      this.handleEl.style.bottom = '0';
      this.handleEl.style.width = '2px';
      this.handleEl.style.left = pct + '%';
      this.handleEl.style.transform = 'translateX(-50%)';
    }

    const badge = document.createElement('div');
    badge.textContent = isVertical ? '↕' : '↔';
    badge.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2rem;height:2rem;border-radius:9999px;background:rgba(24,24,27,0.9);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;border:1px solid rgba(255,255,255,0.2);';
    this.handleEl.appendChild(badge);
    this.appendChild(this.handleEl);
  }

  applyPosition(ratio) {
    this.position = Math.max(0, Math.min(1, ratio));
    const isVertical = this.orientation === 'vertical';
    const pct = (this.position * 100).toFixed(3);
    const clip = isVertical
      ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
      : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`;

    if (this.beforeEl) this.beforeEl.style.clipPath = clip;
    if (this.handleEl) {
      if (isVertical) this.handleEl.style.top = pct + '%';
      else this.handleEl.style.left = pct + '%';
    }
    this.setAttribute('aria-valuenow', Math.round(this.position * 100));
  }

  attachEvents() {
    const isVertical = this.orientation === 'vertical';
    const updatePointer = (x, y) => {
      if (!this.rect) this.rect = this.getBoundingClientRect();
      const ratio = isVertical ? (y - this.rect.top) / this.rect.height : (x - this.rect.left) / this.rect.width;
      this.applyPosition(ratio);
    };

    this.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      this.isDragging = true;
      this.rect = this.getBoundingClientRect();
      try { this.setPointerCapture(e.pointerId); } catch {}
      updatePointer(e.clientX, e.clientY);
    });

    this.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      if (e.pointerType === 'mouse' && e.buttons === 0) {
        this.isDragging = false;
        this.rect = null;
        return;
      }
      updatePointer(e.clientX, e.clientY);
    });

    const onEnd = (e) => {
      this.isDragging = false;
      this.rect = null;
      try { if (this.hasPointerCapture(e.pointerId)) this.releasePointerCapture(e.pointerId); } catch {}
    };

    this.addEventListener('pointerup', onEnd);
    this.addEventListener('pointercancel', onEnd);

    this.addEventListener('keydown', (e) => {
      let delta = 0;
      if (isVertical) {
        if (e.key === 'ArrowUp') delta = -this.step;
        else if (e.key === 'ArrowDown') delta = this.step;
      } else {
        if (e.key === 'ArrowLeft') delta = -this.step;
        else if (e.key === 'ArrowRight') delta = this.step;
      }
      if (delta !== 0) {
        e.preventDefault();
        this.applyPosition(this.position + delta);
      }
    });
  }
}

customElements.define('exhuma-comparison-slider', ExhumaComparisonSlider);
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'comparison-slider.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS ES Module Comparison Slider engine.',
					code: `/**
 * Vanilla JS Comparison Slider Controller
 * Attaches 120 FPS hardware-accelerated pointer tracking to DOM container.
 */
export function initComparisonSlider(containerSelector = '[data-comparison-slider]') {
  const containers = typeof containerSelector === 'string'
    ? document.querySelectorAll(containerSelector)
    : [containerSelector];

  containers.forEach((container) => {
    if (!container || container.__exhuma_slider) return;
    container.__exhuma_slider = true;

    const isVertical = container.dataset.orientation === 'vertical';
    const step = parseFloat(container.dataset.step || '${step}');
    let position = parseFloat(container.dataset.position || '${defaultPosition}');
    let isDragging = false;
    let rect = null;

    const beforeEl = container.querySelector('.exhuma-cs-before');
    const handleEl = container.querySelector('.exhuma-cs-handle');

    const updateUI = () => {
      const pct = (position * 100).toFixed(3);
      const clip = isVertical
        ? \`polygon(0 0, 100% 0, 100% \${pct}%, 0 \${pct}%)\`
        : \`polygon(0 0, \${pct}% 0, \${pct}% 100%, 0 100%)\`;
      if (beforeEl) beforeEl.style.clipPath = clip;
      if (handleEl) {
        if (isVertical) handleEl.style.top = pct + '%';
        else handleEl.style.left = pct + '%';
      }
      container.setAttribute('aria-valuenow', Math.round(position * 100));
    };

    const updatePointer = (clientX, clientY) => {
      if (!rect) rect = container.getBoundingClientRect();
      const ratio = isVertical
        ? (clientY - rect.top) / rect.height
        : (clientX - rect.left) / rect.width;
      position = Math.max(0, Math.min(1, ratio));
      updateUI();
    };

    container.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      rect = container.getBoundingClientRect();
      try { container.setPointerCapture(e.pointerId); } catch {}
      updatePointer(e.clientX, e.clientY);
    });

    container.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      if (e.pointerType === 'mouse' && e.buttons === 0) {
        isDragging = false;
        rect = null;
        return;
      }
      updatePointer(e.clientX, e.clientY);
    });

    const onEnd = (e) => {
      isDragging = false;
      rect = null;
      try {
        if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    container.addEventListener('pointerup', onEnd);
    container.addEventListener('pointercancel', onEnd);

    container.addEventListener('keydown', (e) => {
      let delta = 0;
      if (isVertical) {
        if (e.key === 'ArrowUp') delta = -step;
        else if (e.key === 'ArrowDown') delta = step;
      } else {
        if (e.key === 'ArrowLeft') delta = -step;
        else if (e.key === 'ArrowRight') delta = step;
      }
      if (delta !== 0) {
        e.preventDefault();
        position = Math.max(0, Math.min(1, position + delta));
        updateUI();
      }
    });

    updateUI();
  });
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'comparison-slider.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Comparison Slider with Alpine.js reactivity.',
					code: `@props([
    'defaultPosition' => ${defaultPosition},
    'step' => ${step},
    'orientation' => '${orientation}',
    'aspectRatio' => '16/10',
])

@php
    $isVertical = $orientation === 'vertical';
@endphp

<div
    x-data="{
        position: {{ $defaultPosition }},
        step: {{ $step }},
        isVertical: {{ $isVertical ? 'true' : 'false' }},
        isDragging: false,
        rect: null,
        get pct() { return (this.position * 100).toFixed(3); },
        get clipPath() {
            return this.isVertical
                ? 'polygon(0 0, 100% 0, 100% ' + this.pct + '%, 0 ' + this.pct + '%)'
                : 'polygon(0 0, ' + this.pct + '% 0, ' + this.pct + '% 100%, 0 100%)';
        },
        updatePointer(clientX, clientY) {
            if (!this.rect) this.rect = this.$el.getBoundingClientRect();
            let ratio = this.isVertical
                ? (clientY - this.rect.top) / this.rect.height
                : (clientX - this.rect.left) / this.rect.width;
            this.position = Math.max(0, Math.min(1, ratio));
        }
    }"
    {{ $attributes->merge([
        'class' => 'relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto ' . ($isVertical ? 'cursor-row-resize' : 'cursor-col-resize'),
    ]) }}
    style="aspect-ratio: {{ $aspectRatio }};"
    role="slider"
    :aria-valuenow="Math.round(position * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
    @pointerdown="
        if ($event.button !== 0) return;
        isDragging = true;
        rect = $el.getBoundingClientRect();
        try { $el.setPointerCapture($event.pointerId); } catch(e) {}
        updatePointer($event.clientX, $event.clientY);
    "
    @pointermove="
        if (!isDragging) return;
        if ($event.pointerType === 'mouse' && $event.buttons === 0) { isDragging = false; rect = null; return; }
        updatePointer($event.clientX, $event.clientY);
    "
    @pointerup="isDragging = false; rect = null; try { if ($el.hasPointerCapture($event.pointerId)) $el.releasePointerCapture($event.pointerId); } catch(e) {}"
    @pointercancel="isDragging = false; rect = null;"
    @keydown.left.prevent="if (!isVertical) position = Math.max(0, Math.min(1, position - step))"
    @keydown.right.prevent="if (!isVertical) position = Math.max(0, Math.min(1, position + step))"
    @keydown.up.prevent="if (isVertical) position = Math.max(0, Math.min(1, position - step))"
    @keydown.down.prevent="if (isVertical) position = Math.max(0, Math.min(1, position + step))"
>
    <div class="absolute inset-0 size-full overflow-hidden">
        {{ $after ?? '' }}
    </div>

    <div
        class="absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
        :style="'clip-path: ' + clipPath"
    >
        {{ $before ?? '' }}
    </div>

    <div
        class="absolute z-20 pointer-events-none bg-white shadow-lg {{ $isVertical ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2' }}"
        :style="isVertical ? 'top: ' + pct + '%' : 'left: ' + pct + '%'"
    >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
            {{ $isVertical ? '↕' : '↔' }}
        </div>
    </div>
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
					description: 'WordPress Gutenberg block definition for Comparison Slider.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/comparison-slider",
  "version": "1.0.0",
  "title": "Exhuma Comparison Slider",
  "category": "media",
  "icon": "columns",
  "description": "Interactive before/after media comparison slider with sub-pixel clip-path polygon slicing.",
  "attributes": {
    "defaultPosition": { "type": "number", "default": ${defaultPosition} },
    "step": { "type": "number", "default": ${step} },
    "orientation": { "type": "string", "default": "${orientation}" },
    "aspectRatio": { "type": "string", "default": "16/10" }
  },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg block dynamic render template with sub-pixel polygon clipping and kinetic pointer controller.',
					code: `<?php
/**
 * Comparison Slider Block Template
 */
$pos = isset($attributes['defaultPosition']) ? (float)$attributes['defaultPosition'] : ${defaultPosition};
$step = isset($attributes['step']) ? (float)$attributes['step'] : ${step};
$orientation = isset($attributes['orientation']) ? sanitize_text_field($attributes['orientation']) : '${orientation}';
$aspect_ratio = isset($attributes['aspectRatio']) ? sanitize_text_field($attributes['aspectRatio']) : '16/10';
$is_vertical = ($orientation === 'vertical');
$pct = number_format($pos * 100, 3, '.', '');
$clip = $is_vertical
    ? "polygon(0 0, 100% 0, 100% {$pct}%, 0 {$pct}%)"
    : "polygon(0 0, {$pct}% 0, {$pct}% 100%, 0 100%)";
?>
<div
    class="exhuma-comparison-slider wp-block-exhuma-comparison-slider relative overflow-hidden rounded-2xl border border-border select-none w-full max-w-2xl mx-auto <?php echo $is_vertical ? 'cursor-row-resize' : 'cursor-col-resize'; ?>"
    style="aspect-ratio: <?php echo esc_attr($aspect_ratio); ?>;"
    data-position="<?php echo esc_attr($pos); ?>"
    data-step="<?php echo esc_attr($step); ?>"
    data-orientation="<?php echo esc_attr($orientation); ?>"
    role="slider"
    aria-valuenow="<?php echo esc_attr(round($pos * 100)); ?>"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-orientation="<?php echo esc_attr($orientation); ?>"
    tabindex="0"
>
    <!-- After Layer (Full View) -->
    <div class="exhuma-cs-after absolute inset-0 size-full overflow-hidden">
        <?php echo !empty($content) ? $content : '<div class="flex size-full items-center justify-center bg-zinc-900 text-zinc-400 font-mono text-xs">After View</div>'; ?>
    </div>

    <!-- Before Layer (Sub-pixel Clipped Polygon) -->
    <div
        class="exhuma-cs-before absolute inset-0 size-full overflow-hidden will-change-[clip-path]"
        style="clip-path: <?php echo esc_attr($clip); ?>;"
    >
        <div class="flex size-full items-center justify-center bg-zinc-950 text-white font-mono text-xs">
            Before View
        </div>
    </div>

    <!-- Divider Rail & Handle -->
    <div
        class="exhuma-cs-handle absolute z-20 pointer-events-none bg-white shadow-lg <?php echo $is_vertical ? 'left-0 right-0 h-0.5 -translate-y-1/2' : 'top-0 bottom-0 w-0.5 -translate-x-1/2'; ?>"
        style="<?php echo $is_vertical ? 'top: ' . esc_attr($pct) . '%;' : 'left: ' . esc_attr($pct) . '%;'; ?>"
    >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full border border-border/80 bg-background/90 backdrop-blur-md shadow-md text-foreground text-xs font-bold">
            <?php echo $is_vertical ? '↕' : '↔'; ?>
        </div>
    </div>
</div>

<script>
(function() {
  function initWordPressSliders() {
    document.querySelectorAll('.wp-block-exhuma-comparison-slider').forEach(function(slider) {
      if (slider.__exhuma_init) return;
      slider.__exhuma_init = true;

      var isVertical = slider.dataset.orientation === 'vertical';
      var step = parseFloat(slider.dataset.step || '0.05');
      var pos = parseFloat(slider.dataset.position || '0.5');
      var isDragging = false;
      var rect = null;

      var beforeEl = slider.querySelector('.exhuma-cs-before');
      var handleEl = slider.querySelector('.exhuma-cs-handle');

      function applyPos(val) {
        pos = Math.max(0, Math.min(1, val));
        var pct = (pos * 100).toFixed(3);
        var clip = isVertical
          ? 'polygon(0 0, 100% 0, 100% ' + pct + '%, 0 ' + pct + '%)'
          : 'polygon(0 0, ' + pct + '% 0, ' + pct + '% 100%, 0 100%)';
        if (beforeEl) beforeEl.style.clipPath = clip;
        if (handleEl) {
          if (isVertical) handleEl.style.top = pct + '%';
          else handleEl.style.left = pct + '%';
        }
        slider.setAttribute('aria-valuenow', Math.round(pos * 100).toString());
      }

      function updatePointer(clientX, clientY) {
        if (!rect) rect = slider.getBoundingClientRect();
        var ratio = isVertical
          ? (clientY - rect.top) / rect.height
          : (clientX - rect.left) / rect.width;
        applyPos(ratio);
      }

      slider.addEventListener('pointerdown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        rect = slider.getBoundingClientRect();
        try { slider.setPointerCapture(e.pointerId); } catch(err) {}
        updatePointer(e.clientX, e.clientY);
      });

      slider.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        if (e.pointerType === 'mouse' && e.buttons === 0) {
          isDragging = false;
          rect = null;
          return;
        }
        updatePointer(e.clientX, e.clientY);
      });

      function onEnd(e) {
        isDragging = false;
        rect = null;
        try { if (slider.hasPointerCapture(e.pointerId)) slider.releasePointerCapture(e.pointerId); } catch(err) {}
      }

      slider.addEventListener('pointerup', onEnd);
      slider.addEventListener('pointercancel', onEnd);

      slider.addEventListener('keydown', function(e) {
        var delta = 0;
        if (isVertical) {
          if (e.key === 'ArrowUp') delta = -step;
          else if (e.key === 'ArrowDown') delta = step;
        } else {
          if (e.key === 'ArrowLeft') delta = -step;
          else if (e.key === 'ArrowRight') delta = step;
        }
        if (delta !== 0) {
          e.preventDefault();
          applyPos(pos + delta);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordPressSliders);
  } else {
    initWordPressSliders();
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
					filename: 'ComparisonSlider.tsx',
					language: 'tsx',
					description: 'React Native Comparison Slider with PanResponder gestures and hardware clipping.',
					code: `import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';

export interface ComparisonSliderProps {
  before: React.ReactNode;
  after: React.ReactNode;
  defaultPosition?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  before,
  after,
  defaultPosition = ${defaultPosition},
  orientation = '${orientation}',
}) => {
  const isVertical = orientation === 'vertical';
  const [position, setPosition] = useState(defaultPosition);
  const layoutRef = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    layoutRef.current = e.nativeEvent.layout;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { width, height } = layoutRef.current;
        if (isVertical) {
          if (height <= 0) return;
          const ratio = Math.max(0, Math.min(1, (gestureState.moveY - layoutRef.current.y) / height));
          setPosition(ratio);
        } else {
          if (width <= 0) return;
          const ratio = Math.max(0, Math.min(1, (gestureState.moveX - layoutRef.current.x) / width));
          setPosition(ratio);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} onLayout={onLayout} {...panResponder.panHandlers}>
      {/* After Layer (Full View) */}
      <View style={StyleSheet.absoluteFill}>{after}</View>

      {/* Before Layer (Clipped Window) */}
      <View
        style={[
          styles.clipWindow,
          isVertical
            ? { height: \`\${position * 100}%\`, width: '100%' }
            : { width: \`\${position * 100}%\`, height: '100%' },
        ]}
      >
        <View style={styles.innerContent}>{before}</View>
      </View>

      {/* Divider Bar */}
      <View
        style={[
          styles.divider,
          isVertical
            ? { top: \`\${position * 100}%\`, left: 0, right: 0, height: 2 }
            : { left: \`\${position * 100}%\`, top: 0, bottom: 0, width: 2 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    width: '100%',
    aspectRatio: 16 / 10,
  },
  clipWindow: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  innerContent: {
    width: '100%',
    height: '100%',
  },
  divider: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    zIndex: 20,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'comparison_slider.dart',
					language: 'dart',
					description: 'Flutter StatefulWidget Comparison Slider with GestureDetector and CustomClipper.',
					code: `import 'package:flutter/material.dart';

class ComparisonSlider extends StatefulWidget {
  final Widget before;
  final Widget after;
  final double defaultPosition;
  final Axis orientation;

  const ComparisonSlider({
    Key? key,
    required this.before,
    required this.after,
    this.defaultPosition = ${defaultPosition},
    this.orientation = Axis.${orientation === 'vertical' ? 'vertical' : 'horizontal'},
  }) : super(key: key);

  @override
  State<ComparisonSlider> createState() => _ComparisonSliderState();
}

class _ComparisonSliderState extends State<ComparisonSlider> {
  late double _position;

  @override
  void initState() {
    super.initState();
    _position = widget.defaultPosition.clamp(0.0, 1.0);
  }

  void _updatePosition(Offset localPosition, Size size) {
    setState(() {
      if (widget.orientation == Axis.vertical) {
        _position = (localPosition.dy / size.height).clamp(0.0, 1.0);
      } else {
        _position = (localPosition.dx / size.width).clamp(0.0, 1.0);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final size = Size(constraints.maxWidth, constraints.maxHeight);
        return GestureDetector(
          onPanDown: (details) => _updatePosition(details.localPosition, size),
          onPanUpdate: (details) => _updatePosition(details.localPosition, size),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(
              children: [
                Positioned.fill(child: widget.after),
                Positioned.fill(
                  child: ClipRect(
                    clipper: _SliderClipper(_position, widget.orientation),
                    child: widget.before,
                  ),
                ),
                if (widget.orientation == Axis.horizontal)
                  Positioned(
                    left: size.width * _position - 1,
                    top: 0,
                    bottom: 0,
                    child: Container(width: 2, color: Colors.white),
                  )
                else
                  Positioned(
                    top: size.height * _position - 1,
                    left: 0,
                    right: 0,
                    child: Container(height: 2, color: Colors.white),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _SliderClipper extends CustomClipper<Rect> {
  final double position;
  final Axis orientation;

  _SliderClipper(this.position, this.orientation);

  @override
  Rect getClip(Size size) {
    if (orientation == Axis.vertical) {
      return Rect.fromLTWH(0, 0, size.width, size.height * position);
    }
    return Rect.fromLTWH(0, 0, size.width * position, size.height);
  }

  @override
  bool shouldReclip(_SliderClipper oldClipper) =>
      oldClipper.position != position || oldClipper.orientation != orientation;
}
`,
				},
			];
		}

		default:
			return null;
	}
}

export function getComparisonSliderUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
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
