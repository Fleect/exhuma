import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getTiltCardOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const name = 'Tilt Card';
	const slug = 'tilt-card';
	const pascalName = 'TiltCard';
	const snakeName = 'tilt_card';
	const defaultTailwindClass = 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md';
	const defaultClass = defaultTailwindClass;
	const description = 'Interactive 3D mouse-tracking card tilt with smooth gyroscopic physics, spring damping, and reverse mode.';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			const header = `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';\nimport { clsx } from 'clsx';\n\n`;

			const maxTilt = Number(props.maxTilt ?? 15);
			const perspective = Number(props.perspective ?? 1000);
			const scale = Number(props.scale ?? 1.02);
			const speed = Number(props.speed ?? 0.12);
			const reverse = Boolean(props.reverse ?? false);
			const disabled = Boolean(props.disabled ?? false);
			const axis = (props.axis as string) ?? 'all';

			const code = `${header}export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
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

			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `${name} — Standalone Ejected Engine (Zero Dependencies). All raw math and physics inlined.`,
					code,
				},
			];
		}
		case 'vue': {
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
		case 'svelte': {
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
		case 'solid': {
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
		case 'angular': {
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
		case 'astro': {
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
		case 'webcomponent': {
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
		case 'vanilla': {
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
		case 'blade': {
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
		case 'wordpress': {
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
		case 'react-native': {
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
		case 'flutter': {
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
		default:
			return null;
	}
}

export function getTiltCardUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
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
