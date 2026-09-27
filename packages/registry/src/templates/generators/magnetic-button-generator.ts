import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

function toDartDouble(val: number): string {
	return Number.isInteger(val) ? `${val}.0` : `${val}`;
}

export function getMagneticButtonOuterFiles(
	flavor: EcosystemFlavor,
	props: Record<string, unknown>,
	isEjected: boolean
): ComponentFilePayload[] | null {
	const strength = Number(props.strength ?? 0.35);
	const radius = Number(props.radius ?? 120);
	const springDamping = Number(props.springDamping ?? 18);
	const maxDisplacement = Number(props.maxDisplacement ?? 36);
	const text = String(props.text ?? 'Magnetic Attraction');

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			if (!isEjected) {
				return [
					{
						filename: 'MagneticButton.tsx',
						language: 'tsx',
						description: 'Magnetic Button — Clean component powered by @exhuma/core kinetic primitives.',
						code: `${header}import * as React from 'react';
import {
  MagneticButton as CoreMagneticButton,
  type MagneticButtonProps as CoreMagneticButtonProps,
} from '@exhuma/core';
import { clsx } from 'clsx';

export interface MagneticButtonProps extends CoreMagneticButtonProps {
  className?: string;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      strength = ${strength},
      radius = ${radius},
      springDamping = ${springDamping},
      maxDisplacement = ${maxDisplacement},
      className,
      ...props
    },
    ref
  ) => {
    return (
      <CoreMagneticButton
        ref={ref}
        strength={strength}
        radius={radius}
        springDamping={springDamping}
        maxDisplacement={maxDisplacement}
        className={clsx(
          'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none',
          className
        )}
        {...props}
      >
        {children ?? '${text}'}
      </CoreMagneticButton>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
`,
					},
				];
			}

			// Ejected zero-dependency React implementation
			return [
				{
					filename: 'MagneticButton.tsx',
					language: 'tsx',
					description: 'Magnetic Button — Standalone Ejected Engine with direct DOM manipulation, invariant origin reference frame, and critically damped spring return.',
					code: `${header}import * as React from 'react';
import { clsx } from 'clsx';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  radius?: number;
  springDamping?: number;
  maxDisplacement?: number;
}

/**
 * Calculates inverted spring magnetic pull displacement with displacement clamping.
 */
function calculateMagneticPull(
  pointerX: number,
  pointerY: number,
  centerX: number,
  centerY: number,
  radius: number,
  strength: number,
  maxDisplacement: number
) {
  if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY) || !Number.isFinite(centerX) || !Number.isFinite(centerY) || radius <= 0) {
    return { x: 0, y: 0, isInside: false };
  }

  const dx = pointerX - centerX;
  const dy = pointerY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance > radius) {
    return { x: 0, y: 0, isInside: false };
  }

  const safeStrength = Number.isFinite(strength) ? strength : 0.4;
  const attenuation = 1 - distance / radius;
  let pullX = dx * safeStrength * attenuation;
  let pullY = dy * safeStrength * attenuation;

  if (maxDisplacement > 0) {
    const pullDist = Math.hypot(pullX, pullY);
    if (pullDist > maxDisplacement) {
      const scale = maxDisplacement / pullDist;
      pullX *= scale;
      pullY *= scale;
    }
  }

  return { x: pullX, y: pullY, isInside: true };
}

/**
 * Frame-rate independent spring damping (lerp with exponential decay).
 */
function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/**
 * MagneticButton — Exhuma Kinetic Methodology (EKM)
 * Big-Omega Guarantee: Direct DOM translate3d writes via 120Hz rAF (ZERO React state re-renders during motion).
 */
export const MagneticButton = React.memo(
  React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
    (
      {
        children,
        strength = ${strength},
        radius = ${radius},
        springDamping = ${springDamping},
        maxDisplacement = ${maxDisplacement},
        className,
        style,
        onPointerMove,
        onPointerLeave,
        ...props
      },
      forwardedRef
    ) => {
      const buttonRef = React.useRef<HTMLButtonElement>(null);
      React.useImperativeHandle(forwardedRef, () => buttonRef.current as HTMLButtonElement);

      const targetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
      const currentRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
      const isHoveredRef = React.useRef<boolean>(false);
      const rafIdRef = React.useRef<number | null>(null);
      const lastTimeRef = React.useRef<number>(0);

      const updateLoop = React.useCallback(
        (timestamp: number) => {
          if (!lastTimeRef.current) lastTimeRef.current = timestamp;
          const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
          lastTimeRef.current = timestamp;

          const current = currentRef.current;
          const target = targetRef.current;

          current.x = damp(current.x, target.x, springDamping, dt);
          current.y = damp(current.y, target.y, springDamping, dt);

          if (buttonRef.current) {
            buttonRef.current.style.transform = \`translate3d(\${current.x.toFixed(2)}px, \${current.y.toFixed(2)}px, 0)\`;
          }

          const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
          if (isHoveredRef.current || distToTarget > 0.1) {
            rafIdRef.current = requestAnimationFrame(updateLoop);
          } else {
            current.x = 0;
            current.y = 0;
            if (buttonRef.current) {
              buttonRef.current.style.transform = 'translate3d(0, 0, 0)';
            }
            rafIdRef.current = null;
            lastTimeRef.current = 0;
          }
        },
        [springDamping]
      );

      const startRafIfNeeded = React.useCallback(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        if (!rafIdRef.current) {
          lastTimeRef.current = 0;
          rafIdRef.current = requestAnimationFrame(updateLoop);
        }
      }, [updateLoop]);

      const handlePointerMove = React.useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
          onPointerMove?.(e);
          if (e.defaultPrevented) return;

          const el = buttonRef.current;
          if (!el) return;

          if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
          }

          // Invariant origin reference frame subtraction
          const rect = el.getBoundingClientRect();
          const baseCenterX = rect.left - currentRef.current.x + rect.width / 2;
          const baseCenterY = rect.top - currentRef.current.y + rect.height / 2;

          const result = calculateMagneticPull(
            e.clientX,
            e.clientY,
            baseCenterX,
            baseCenterY,
            radius,
            strength,
            maxDisplacement
          );

          targetRef.current.x = result.x;
          targetRef.current.y = result.y;
          isHoveredRef.current = true;
          startRafIfNeeded();
        },
        [radius, strength, maxDisplacement, onPointerMove, startRafIfNeeded]
      );

      const handlePointerLeave = React.useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
          onPointerLeave?.(e);
          isHoveredRef.current = false;
          targetRef.current.x = 0;
          targetRef.current.y = 0;
          startRafIfNeeded();
        },
        [onPointerLeave, startRafIfNeeded]
      );

      React.useEffect(() => {
        return () => {
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
        };
      }, []);

      return (
        <button
          ref={buttonRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={clsx(
            'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none',
            className
          )}
          style={{ willChange: 'transform', ...style }}
          {...props}
        >
          {children ?? '${text}'}
        </button>
      );
    }
  )
);
MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'MagneticButton.vue',
					language: 'vue',
					description: 'Magnetic Button — Vue 3 Composition API with direct DOM transform mutation and rAF physics.',
					code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  strength?: number;
  radius?: number;
  springDamping?: number;
  maxDisplacement?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  strength: ${strength},
  radius: ${radius},
  springDamping: ${springDamping},
  maxDisplacement: ${maxDisplacement},
  class: '',
});

const buttonRef = ref<HTMLButtonElement | null>(null);
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let isHovered = false;
let rafId: number | null = null;
let lastTime = 0;

function damp(curr: number, targ: number, lambda: number, dt: number): number {
  return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
}

function calculateMagneticPull(px: number, py: number, cx: number, cy: number, r: number, str: number, maxD: number) {
  if (r <= 0) return { x: 0, y: 0 };
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > r) return { x: 0, y: 0 };

  const attenuation = 1 - dist / r;
  let pullX = dx * str * attenuation;
  let pullY = dy * str * attenuation;

  if (maxD > 0) {
    const pullDist = Math.hypot(pullX, pullY);
    if (pullDist > maxD) {
      const scale = maxD / pullDist;
      pullX *= scale;
      pullY *= scale;
    }
  }
  return { x: pullX, y: pullY };
}

function updateLoop(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  current.x = damp(current.x, target.x, props.springDamping, dt);
  current.y = damp(current.y, target.y, props.springDamping, dt);

  if (buttonRef.value) {
    buttonRef.value.style.transform = \`translate3d(\${current.x.toFixed(2)}px, \${current.y.toFixed(2)}px, 0)\`;
  }

  const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
  if (isHovered || distToTarget > 0.1) {
    rafId = requestAnimationFrame(updateLoop);
  } else {
    current.x = 0;
    current.y = 0;
    if (buttonRef.value) {
      buttonRef.value.style.transform = 'translate3d(0, 0, 0)';
    }
    rafId = null;
    lastTime = 0;
  }
}

function startRafIfNeeded() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(updateLoop);
  }
}

function onPointerMove(e: PointerEvent) {
  const el = buttonRef.value;
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = el.getBoundingClientRect();
  const baseCenterX = rect.left - current.x + rect.width / 2;
  const baseCenterY = rect.top - current.y + rect.height / 2;

  const pull = calculateMagneticPull(
    e.clientX,
    e.clientY,
    baseCenterX,
    baseCenterY,
    props.radius,
    props.strength,
    props.maxDisplacement
  );

  target.x = pull.x;
  target.y = pull.y;
  isHovered = true;
  startRafIfNeeded();
}

function onPointerLeave() {
  isHovered = false;
  target.x = 0;
  target.y = 0;
  startRafIfNeeded();
}

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
});
</script>

<template>
  <button
    ref="buttonRef"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    :class="[
      'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none',
      props.class
    ]"
    style="will-change: transform"
  >
    <slot>${text}</slot>
  </button>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'MagneticButton.svelte',
					language: 'svelte',
					description: 'Magnetic Button — Svelte 5 Runes with direct DOM transform mutation.',
					code: `<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    strength?: number;
    radius?: number;
    springDamping?: number;
    maxDisplacement?: number;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    strength = ${strength},
    radius = ${radius},
    springDamping = ${springDamping},
    maxDisplacement = ${maxDisplacement},
    class: className = '',
    children
  }: Props = $props();

  let buttonEl: HTMLButtonElement | undefined = $state();
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let isHovered = false;
  let rafId: number | null = null;
  let lastTime = 0;

  function damp(curr: number, targ: number, lambda: number, dt: number): number {
    return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
  }

  function calculateMagneticPull(px: number, py: number, cx: number, cy: number, r: number, str: number, maxD: number) {
    if (r <= 0) return { x: 0, y: 0 };
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > r) return { x: 0, y: 0 };

    const attenuation = 1 - dist / r;
    let pullX = dx * str * attenuation;
    let pullY = dy * str * attenuation;

    if (maxD > 0) {
      const pullDist = Math.hypot(pullX, pullY);
      if (pullDist > maxD) {
        const scale = maxD / pullDist;
        pullX *= scale;
        pullY *= scale;
      }
    }
    return { x: pullX, y: pullY };
  }

  function updateLoop(timestamp: number) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    current.x = damp(current.x, target.x, springDamping, dt);
    current.y = damp(current.y, target.y, springDamping, dt);

    if (buttonEl) {
      buttonEl.style.transform = \`translate3d(\${current.x.toFixed(2)}px, \${current.y.toFixed(2)}px, 0)\`;
    }

    const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
    if (isHovered || distToTarget > 0.1) {
      rafId = requestAnimationFrame(updateLoop);
    } else {
      current.x = 0;
      current.y = 0;
      if (buttonEl) {
        buttonEl.style.transform = 'translate3d(0, 0, 0)';
      }
      rafId = null;
      lastTime = 0;
    }
  }

  function startRafIfNeeded() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!buttonEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = buttonEl.getBoundingClientRect();
    const baseCenterX = rect.left - current.x + rect.width / 2;
    const baseCenterY = rect.top - current.y + rect.height / 2;

    const pull = calculateMagneticPull(
      e.clientX,
      e.clientY,
      baseCenterX,
      baseCenterY,
      radius,
      strength,
      maxDisplacement
    );

    target.x = pull.x;
    target.y = pull.y;
    isHovered = true;
    startRafIfNeeded();
  }

  function handlePointerLeave() {
    isHovered = false;
    target.x = 0;
    target.y = 0;
    startRafIfNeeded();
  }

  onDestroy(() => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
</script>

<button
  bind:this={buttonEl}
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  class="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none {className}"
  style="will-change: transform"
>
  {#if children}
    {@render children()}
  {:else}
    ${text}
  {/if}
</button>
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'magnetic-button.component.ts',
					language: 'typescript',
					description: 'Magnetic Button — Angular 18+ Standalone Component with runOutsideAngular rAF physics.',
					code: `import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-magnetic-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button
      #buttonRef
      (pointermove)="onPointerMove($event)"
      (pointerleave)="onPointerLeave()"
      [class]="'group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none ' + customClass"
      style="will-change: transform"
    >
      <ng-content>${text}</ng-content>
    </button>
  \`
})
export class ExhumaMagneticButtonComponent implements OnDestroy {
  @Input() strength: number = ${strength};
  @Input() radius: number = ${radius};
  @Input() springDamping: number = ${springDamping};
  @Input() maxDisplacement: number = ${maxDisplacement};
  @Input('class') customClass: string = '';

  @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;

  private target = { x: 0, y: 0 };
  private current = { x: 0, y: 0 };
  private isHovered = false;
  private rafId: number | null = null;
  private lastTime = 0;

  constructor(private ngZone: NgZone) {}

  private damp(curr: number, targ: number, lambda: number, dt: number): number {
    return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
  }

  private calculatePull(px: number, py: number, cx: number, cy: number, r: number, str: number, maxD: number) {
    if (r <= 0) return { x: 0, y: 0 };
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > r) return { x: 0, y: 0 };

    const attenuation = 1 - dist / r;
    let pullX = dx * str * attenuation;
    let pullY = dy * str * attenuation;

    if (maxD > 0) {
      const pullDist = Math.hypot(pullX, pullY);
      if (pullDist > maxD) {
        const scale = maxD / pullDist;
        pullX *= scale;
        pullY *= scale;
      }
    }
    return { x: pullX, y: pullY };
  }

  private updateLoop = (timestamp: number) => {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.current.x = this.damp(this.current.x, this.target.x, this.springDamping, dt);
    this.current.y = this.damp(this.current.y, this.target.y, this.springDamping, dt);

    const el = this.buttonRef?.nativeElement;
    if (el) {
      el.style.transform = \`translate3d(\${this.current.x.toFixed(2)}px, \${this.current.y.toFixed(2)}px, 0)\`;
    }

    const distToTarget = Math.hypot(this.target.x - this.current.x, this.target.y - this.current.y);
    if (this.isHovered || distToTarget > 0.1) {
      this.rafId = requestAnimationFrame(this.updateLoop);
    } else {
      this.current.x = 0;
      this.current.y = 0;
      if (el) {
        el.style.transform = 'translate3d(0, 0, 0)';
      }
      this.rafId = null;
      this.lastTime = 0;
    }
  };

  private startRafIfNeeded() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!this.rafId) {
      this.lastTime = 0;
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(this.updateLoop);
      });
    }
  }

  onPointerMove(e: PointerEvent) {
    const el = this.buttonRef?.nativeElement;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const baseCenterX = rect.left - this.current.x + rect.width / 2;
    const baseCenterY = rect.top - this.current.y + rect.height / 2;

    const pull = this.calculatePull(
      e.clientX,
      e.clientY,
      baseCenterX,
      baseCenterY,
      this.radius,
      this.strength,
      this.maxDisplacement
    );

    this.target.x = pull.x;
    this.target.y = pull.y;
    this.isHovered = true;
    this.startRafIfNeeded();
  }

  onPointerLeave() {
    this.isHovered = false;
    this.target.x = 0;
    this.target.y = 0;
    this.startRafIfNeeded();
  }

  ngOnDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'MagneticButton.tsx',
					language: 'tsx',
					description: 'Magnetic Button — SolidJS fine-grained reactivity with direct DOM transform writes.',
					code: `import { Component, JSX, onCleanup, mergeProps } from 'solid-js';

export interface MagneticButtonProps {
  strength?: number;
  radius?: number;
  springDamping?: number;
  maxDisplacement?: number;
  class?: string;
  children?: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

function damp(curr: number, targ: number, lambda: number, dt: number): number {
  return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
}

function calculateMagneticPull(px: number, py: number, cx: number, cy: number, r: number, str: number, maxD: number) {
  if (r <= 0) return { x: 0, y: 0 };
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > r) return { x: 0, y: 0 };

  const attenuation = 1 - dist / r;
  let pullX = dx * str * attenuation;
  let pullY = dy * str * attenuation;

  if (maxD > 0) {
    const pullDist = Math.hypot(pullX, pullY);
    if (pullDist > maxD) {
      const scale = maxD / pullDist;
      pullX *= scale;
      pullY *= scale;
    }
  }
  return { x: pullX, y: pullY };
}

export const MagneticButton: Component<MagneticButtonProps> = (props) => {
  const merged = mergeProps({
    strength: ${strength},
    radius: ${radius},
    springDamping: ${springDamping},
    maxDisplacement: ${maxDisplacement},
  }, props);

  let buttonRef: HTMLButtonElement | undefined;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let isHovered = false;
  let rafId: number | null = null;
  let lastTime = 0;

  function updateLoop(timestamp: number) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    current.x = damp(current.x, target.x, merged.springDamping, dt);
    current.y = damp(current.y, target.y, merged.springDamping, dt);

    if (buttonRef) {
      buttonRef.style.transform = \`translate3d(\${current.x.toFixed(2)}px, \${current.y.toFixed(2)}px, 0)\`;
    }

    const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
    if (isHovered || distToTarget > 0.1) {
      rafId = requestAnimationFrame(updateLoop);
    } else {
      current.x = 0;
      current.y = 0;
      if (buttonRef) {
        buttonRef.style.transform = 'translate3d(0, 0, 0)';
      }
      rafId = null;
      lastTime = 0;
    }
  }

  function startRafIfNeeded() {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!rafId) {
      lastTime = 0;
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!buttonRef || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = buttonRef.getBoundingClientRect();
    const baseCenterX = rect.left - current.x + rect.width / 2;
    const baseCenterY = rect.top - current.y + rect.height / 2;

    const pull = calculateMagneticPull(
      e.clientX,
      e.clientY,
      baseCenterX,
      baseCenterY,
      merged.radius,
      merged.strength,
      merged.maxDisplacement
    );

    target.x = pull.x;
    target.y = pull.y;
    isHovered = true;
    startRafIfNeeded();
  }

  function handlePointerLeave() {
    isHovered = false;
    target.x = 0;
    target.y = 0;
    startRafIfNeeded();
  }

  onCleanup(() => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={merged.onClick}
      class={\`group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none \${props.class ?? ''}\`}
      style={{ 'will-change': 'transform' }}
    >
      {props.children ?? '${text}'}
    </button>
  );
};

export default MagneticButton;
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'MagneticButton.astro',
					language: 'astro',
					description: 'Magnetic Button — Astro progressive SSR button with client kinetic script.',
					code: `---
interface Props {
  strength?: number;
  radius?: number;
  springDamping?: number;
  maxDisplacement?: number;
  class?: string;
}

const {
  strength = ${strength},
  radius = ${radius},
  springDamping = ${springDamping},
  maxDisplacement = ${maxDisplacement},
  class: className = '',
} = Astro.props;
---

<button
  class:list={[
    'exhuma-magnetic-btn group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none',
    className
  ]}
  data-strength={strength}
  data-radius={radius}
  data-damping={springDamping}
  data-max-displacement={maxDisplacement}
  style="will-change: transform"
>
  <slot>${text}</slot>
</button>

<script>
  function initMagneticButtons() {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.exhuma-magnetic-btn:not([data-exhuma-init])');

    buttons.forEach((el) => {
      el.setAttribute('data-exhuma-init', 'true');
      const strength = parseFloat(el.getAttribute('data-strength') || '${strength}');
      const radius = parseFloat(el.getAttribute('data-radius') || '${radius}');
      const damping = parseFloat(el.getAttribute('data-damping') || '${springDamping}');
      const maxDisplacement = parseFloat(el.getAttribute('data-max-displacement') || '${maxDisplacement}');

      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      let isHovered = false;
      let rafId: number | null = null;
      let lastTime = 0;

      function damp(curr: number, targ: number, lambda: number, dt: number): number {
        return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
      }

      function update(timestamp: number) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        current.x = damp(current.x, target.x, damping, dt);
        current.y = damp(current.y, target.y, damping, dt);

        el.style.transform = \`translate3d(\${current.x.toFixed(2)}px, \${current.y.toFixed(2)}px, 0)\`;

        const dist = Math.hypot(target.x - current.x, target.y - current.y);
        if (isHovered || dist > 0.1) {
          rafId = requestAnimationFrame(update);
        } else {
          current.x = 0;
          current.y = 0;
          el.style.transform = 'translate3d(0, 0, 0)';
          rafId = null;
          lastTime = 0;
        }
      }

      function startRaf() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(update);
        }
      }

      el.addEventListener('pointermove', (e: PointerEvent) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = el.getBoundingClientRect();
        const baseCenterX = rect.left - current.x + rect.width / 2;
        const baseCenterY = rect.top - current.y + rect.height / 2;

        const dx = e.clientX - baseCenterX;
        const dy = e.clientY - baseCenterY;
        const distance = Math.hypot(dx, dy);

        if (distance > radius) {
          target.x = 0;
          target.y = 0;
        } else {
          const attenuation = 1 - distance / radius;
          let pullX = dx * strength * attenuation;
          let pullY = dy * strength * attenuation;

          if (maxDisplacement > 0) {
            const pullDist = Math.hypot(pullX, pullY);
            if (pullDist > maxDisplacement) {
              const scale = maxDisplacement / pullDist;
              pullX *= scale;
              pullY *= scale;
            }
          }
          target.x = pullX;
          target.y = pullY;
        }

        isHovered = true;
        startRaf();
      });

      el.addEventListener('pointerleave', () => {
        isHovered = false;
        target.x = 0;
        target.y = 0;
        startRaf();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticButtons);
  } else {
    initMagneticButtons();
  }
  document.addEventListener('astro:page-load', initMagneticButtons);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'magnetic-button.blade.php',
					language: 'php',
					description: 'Magnetic Button — Laravel Blade template with zero-dependency vanilla JS kinetic driver.',
					code: `@props([
  'strength' => ${strength},
  'radius' => ${radius},
  'springDamping' => ${springDamping},
  'maxDisplacement' => ${maxDisplacement},
  'text' => '${text}',
])

<button
  {{ $attributes->merge([
    'class' => 'exhuma-magnetic-btn group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none'
  ]) }}
  data-strength="{{ $strength }}"
  data-radius="{{ $radius }}"
  data-damping="{{ $springDamping }}"
  data-max-displacement="{{ $maxDisplacement }}"
  style="will-change: transform"
>
  {{ $slot->isEmpty() ? $text : $slot }}
</button>

@once
<script>
document.addEventListener('DOMContentLoaded', function() {
  function initMagneticButtons() {
    document.querySelectorAll('.exhuma-magnetic-btn:not([data-exhuma-init])').forEach(function(el) {
      el.setAttribute('data-exhuma-init', 'true');
      var strength = parseFloat(el.getAttribute('data-strength')) || ${strength};
      var radius = parseFloat(el.getAttribute('data-radius')) || ${radius};
      var damping = parseFloat(el.getAttribute('data-damping')) || ${springDamping};
      var maxDisplacement = parseFloat(el.getAttribute('data-max-displacement')) || ${maxDisplacement};

      var target = { x: 0, y: 0 };
      var current = { x: 0, y: 0 };
      var isHovered = false;
      var rafId = null;
      var lastTime = 0;

      function damp(curr, targ, lambda, dt) {
        return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
      }

      function update(timestamp) {
        if (!lastTime) lastTime = timestamp;
        var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        current.x = damp(current.x, target.x, damping, dt);
        current.y = damp(current.y, target.y, damping, dt);

        el.style.transform = 'translate3d(' + current.x.toFixed(2) + 'px, ' + current.y.toFixed(2) + 'px, 0)';

        var dist = Math.hypot(target.x - current.x, target.y - current.y);
        if (isHovered || dist > 0.1) {
          rafId = requestAnimationFrame(update);
        } else {
          current.x = 0;
          current.y = 0;
          el.style.transform = 'translate3d(0, 0, 0)';
          rafId = null;
          lastTime = 0;
        }
      }

      function startRaf() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(update);
        }
      }

      el.addEventListener('pointermove', function(e) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var rect = el.getBoundingClientRect();
        var baseCenterX = rect.left - current.x + rect.width / 2;
        var baseCenterY = rect.top - current.y + rect.height / 2;

        var dx = e.clientX - baseCenterX;
        var dy = e.clientY - baseCenterY;
        var dist = Math.hypot(dx, dy);

        if (dist > radius) {
          target.x = 0;
          target.y = 0;
        } else {
          var attenuation = 1 - dist / radius;
          var pullX = dx * strength * attenuation;
          var pullY = dy * strength * attenuation;

          if (maxDisplacement > 0) {
            var pullDist = Math.hypot(pullX, pullY);
            if (pullDist > maxDisplacement) {
              var scale = maxDisplacement / pullDist;
              pullX *= scale;
              pullY *= scale;
            }
          }
          target.x = pullX;
          target.y = pullY;
        }

        isHovered = true;
        startRaf();
      });

      el.addEventListener('pointerleave', function() {
        isHovered = false;
        target.x = 0;
        target.y = 0;
        startRaf();
      });
    });
  }

  initMagneticButtons();
});
</script>
@endonce
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'magnetic-button.js',
					language: 'javascript',
					description: 'Magnetic Button — Autonomous ESM module with direct rAF physics loop.',
					code: `/**
 * Exhuma Kinetic Methodology (EKM) — Magnetic Button
 * Invariant origin reference frame with 120Hz rAF spring damping.
 */
export class ExhumaMagneticButton {
  constructor(element, options = {}) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    this.options = {
      strength: ${strength},
      radius: ${radius},
      springDamping: ${springDamping},
      maxDisplacement: ${maxDisplacement},
      ...options,
    };

    this.target = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.isHovered = false;
    this.rafId = null;
    this.lastTime = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.update = this.update.bind(this);

    this.init();
  }

  init() {
    this.el.style.willChange = 'transform';
    this.el.addEventListener('pointermove', this.onPointerMove);
    this.el.addEventListener('pointerleave', this.onPointerLeave);
  }

  damp(curr, targ, lambda, dt) {
    return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
  }

  update(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.current.x = this.damp(this.current.x, this.target.x, this.options.springDamping, dt);
    this.current.y = this.damp(this.current.y, this.target.y, this.options.springDamping, dt);

    this.el.style.transform = \`translate3d(\${this.current.x.toFixed(2)}px, \${this.current.y.toFixed(2)}px, 0)\`;

    const dist = Math.hypot(this.target.x - this.current.x, this.target.y - this.current.y);
    if (this.isHovered || dist > 0.1) {
      this.rafId = requestAnimationFrame(this.update);
    } else {
      this.current.x = 0;
      this.current.y = 0;
      this.el.style.transform = 'translate3d(0, 0, 0)';
      this.rafId = null;
      this.lastTime = 0;
    }
  }

  startRaf() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!this.rafId) {
      this.lastTime = 0;
      this.rafId = requestAnimationFrame(this.update);
    }
  }

  onPointerMove(e) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = this.el.getBoundingClientRect();
    const baseCenterX = rect.left - this.current.x + rect.width / 2;
    const baseCenterY = rect.top - this.current.y + rect.height / 2;

    const dx = e.clientX - baseCenterX;
    const dy = e.clientY - baseCenterY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.options.radius) {
      this.target.x = 0;
      this.target.y = 0;
    } else {
      const attenuation = 1 - dist / this.options.radius;
      let pullX = dx * this.options.strength * attenuation;
      let pullY = dy * this.options.strength * attenuation;

      if (this.options.maxDisplacement > 0) {
        const pullDist = Math.hypot(pullX, pullY);
        if (pullDist > this.options.maxDisplacement) {
          const scale = this.options.maxDisplacement / pullDist;
          pullX *= scale;
          pullY *= scale;
        }
      }
      this.target.x = pullX;
      this.target.y = pullY;
    }

    this.isHovered = true;
    this.startRaf();
  }

  onPointerLeave() {
    this.isHovered = false;
    this.target.x = 0;
    this.target.y = 0;
    this.startRaf();
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.el.removeEventListener('pointermove', this.onPointerMove);
    this.el.removeEventListener('pointerleave', this.onPointerLeave);
  }
}

export function initMagneticButton(selector, options) {
  return new ExhumaMagneticButton(selector, options);
}
`,
				},
				{
					filename: 'magnetic-button.css',
					language: 'css',
					description: 'Magnetic Button — Base CSS styling.',
					code: `.exhuma-magnetic-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border-radius: 1rem;
  background-color: #ffffff;
  color: #09090b;
  padding: 1rem 2rem;
  font-size: 0.875rem;
  font-weight: 900;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  will-change: transform;
  user-select: none;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.exhuma-magnetic-btn:hover {
  transform: scale(1.05);
}

.exhuma-magnetic-btn:active {
  transform: scale(0.95);
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
					description: 'WordPress Gutenberg Block Metadata.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/magnetic-button',
							version: '1.0.0',
							title: 'Magnetic Button',
							category: 'widgets',
							icon: 'button',
							description: 'Inverted spring pull field button that magnetically attracts cursor proximity.',
							attributes: {
								strength: { type: 'number', default: strength },
								radius: { type: 'number', default: radius },
								springDamping: { type: 'number', default: springDamping },
								maxDisplacement: { type: 'number', default: maxDisplacement },
								text: { type: 'string', default: text },
							},
							supports: { align: true, color: { background: true, text: true } },
							editorScript: 'file:./index.js',
							viewScript: 'file:./view.js',
							render: 'file:./render.php',
						},
						null,
						2
					),
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg Server-Side Render Template.',
					code: `<?php
$strength = isset($attributes['strength']) ? floatval($attributes['strength']) : ${strength};
$radius = isset($attributes['radius']) ? floatval($attributes['radius']) : ${radius};
$damping = isset($attributes['springDamping']) ? floatval($attributes['springDamping']) : ${springDamping};
$maxDisplacement = isset($attributes['maxDisplacement']) ? floatval($attributes['maxDisplacement']) : ${maxDisplacement};
$text = isset($attributes['text']) ? esc_html($attributes['text']) : '${text}';
$wrapper_attributes = get_block_wrapper_attributes([
  'class' => 'wp-block-exhuma-magnetic-button exhuma-magnetic-btn'
]);
?>

<div <?php echo $wrapper_attributes; ?>>
  <button
    type="button"
    class="exhuma-magnetic-element group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer will-change-transform select-none"
    data-strength="<?php echo esc_attr($strength); ?>"
    data-radius="<?php echo esc_attr($radius); ?>"
    data-damping="<?php echo esc_attr($damping); ?>"
    data-max-displacement="<?php echo esc_attr($maxDisplacement); ?>"
    style="will-change: transform"
  >
    <span><?php echo $text; ?></span>
  </button>
</div>
`,
				},
				{
					filename: 'view.js',
					language: 'javascript',
					description: 'WordPress Gutenberg Frontend View Script.',
					code: `(function() {
  function initBlocks() {
    document.querySelectorAll('.wp-block-exhuma-magnetic-button .exhuma-magnetic-element:not([data-exhuma-init])').forEach(function(el) {
      el.setAttribute('data-exhuma-init', 'true');
      var strength = parseFloat(el.getAttribute('data-strength')) || ${strength};
      var radius = parseFloat(el.getAttribute('data-radius')) || ${radius};
      var damping = parseFloat(el.getAttribute('data-damping')) || ${springDamping};
      var maxDisplacement = parseFloat(el.getAttribute('data-max-displacement')) || ${maxDisplacement};

      var target = { x: 0, y: 0 };
      var current = { x: 0, y: 0 };
      var isHovered = false;
      var rafId = null;
      var lastTime = 0;

      function damp(curr, targ, lambda, dt) {
        return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
      }

      function update(timestamp) {
        if (!lastTime) lastTime = timestamp;
        var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        current.x = damp(current.x, target.x, damping, dt);
        current.y = damp(current.y, target.y, damping, dt);

        el.style.transform = 'translate3d(' + current.x.toFixed(2) + 'px, ' + current.y.toFixed(2) + 'px, 0)';

        var dist = Math.hypot(target.x - current.x, target.y - current.y);
        if (isHovered || dist > 0.1) {
          rafId = requestAnimationFrame(update);
        } else {
          current.x = 0;
          current.y = 0;
          el.style.transform = 'translate3d(0, 0, 0)';
          rafId = null;
          lastTime = 0;
        }
      }

      function startRaf() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!rafId) {
          lastTime = 0;
          rafId = requestAnimationFrame(update);
        }
      }

      el.addEventListener('pointermove', function(e) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var rect = el.getBoundingClientRect();
        var baseCenterX = rect.left - current.x + rect.width / 2;
        var baseCenterY = rect.top - current.y + rect.height / 2;

        var dx = e.clientX - baseCenterX;
        var dy = e.clientY - baseCenterY;
        var dist = Math.hypot(dx, dy);

        if (dist > radius) {
          target.x = 0;
          target.y = 0;
        } else {
          var attenuation = 1 - dist / radius;
          var pullX = dx * strength * attenuation;
          var pullY = dy * strength * attenuation;

          if (maxDisplacement > 0) {
            var pullDist = Math.hypot(pullX, pullY);
            if (pullDist > maxDisplacement) {
              var scale = maxDisplacement / pullDist;
              pullX *= scale;
              pullY *= scale;
            }
          }
          target.x = pullX;
          target.y = pullY;
        }

        isHovered = true;
        startRaf();
      });

      el.addEventListener('pointerleave', function() {
        isHovered = false;
        target.x = 0;
        target.y = 0;
        startRaf();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlocks);
  } else {
    initBlocks();
  }
})();
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'magnetic-button.wc.js',
					language: 'javascript',
					description: 'Magnetic Button — W3C Autonomous Custom Element <exhuma-magnetic-button>.',
					code: `/**
 * W3C Custom Element: <exhuma-magnetic-button>
 */
export class ExhumaMagneticButtonElement extends HTMLElement {
  static get observedAttributes() {
    return ['strength', 'radius', 'spring-damping', 'max-displacement'];
  }

  constructor() {
    super();
    this.target = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.isHovered = false;
    this.rafId = null;
    this.lastTime = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.update = this.update.bind(this);
  }

  get strength() {
    return parseFloat(this.getAttribute('strength')) || ${strength};
  }

  get radius() {
    return parseFloat(this.getAttribute('radius')) || ${radius};
  }

  get springDamping() {
    return parseFloat(this.getAttribute('spring-damping')) || ${springDamping};
  }

  get maxDisplacement() {
    return parseFloat(this.getAttribute('max-displacement')) || ${maxDisplacement};
  }

  connectedCallback() {
    this.style.display = 'inline-block';
    this.style.willChange = 'transform';
    this.addEventListener('pointermove', this.onPointerMove);
    this.addEventListener('pointerleave', this.onPointerLeave);
  }

  disconnectedCallback() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.removeEventListener('pointermove', this.onPointerMove);
    this.removeEventListener('pointerleave', this.onPointerLeave);
  }

  damp(curr, targ, lambda, dt) {
    return curr + (targ - curr) * (1 - Math.exp(-lambda * dt));
  }

  update(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.current.x = this.damp(this.current.x, this.target.x, this.springDamping, dt);
    this.current.y = this.damp(this.current.y, this.target.y, this.springDamping, dt);

    this.style.transform = \`translate3d(\${this.current.x.toFixed(2)}px, \${this.current.y.toFixed(2)}px, 0)\`;

    const dist = Math.hypot(this.target.x - this.current.x, this.target.y - this.current.y);
    if (this.isHovered || dist > 0.1) {
      this.rafId = requestAnimationFrame(this.update);
    } else {
      this.current.x = 0;
      this.current.y = 0;
      this.style.transform = 'translate3d(0, 0, 0)';
      this.rafId = null;
      this.lastTime = 0;
    }
  }

  startRaf() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!this.rafId) {
      this.lastTime = 0;
      this.rafId = requestAnimationFrame(this.update);
    }
  }

  onPointerMove(e) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = this.getBoundingClientRect();
    const baseCenterX = rect.left - this.current.x + rect.width / 2;
    const baseCenterY = rect.top - this.current.y + rect.height / 2;

    const dx = e.clientX - baseCenterX;
    const dy = e.clientY - baseCenterY;
    const dist = Math.hypot(dx, dy);

    if (dist > this.radius) {
      this.target.x = 0;
      this.target.y = 0;
    } else {
      const attenuation = 1 - dist / this.radius;
      let pullX = dx * this.strength * attenuation;
      let pullY = dy * this.strength * attenuation;

      if (this.maxDisplacement > 0) {
        const pullDist = Math.hypot(pullX, pullY);
        if (pullDist > this.maxDisplacement) {
          const scale = this.maxDisplacement / pullDist;
          pullX *= scale;
          pullY *= scale;
        }
      }
      this.target.x = pullX;
      this.target.y = pullY;
    }

    this.isHovered = true;
    this.startRaf();
  }

  onPointerLeave() {
    this.isHovered = false;
    this.target.x = 0;
    this.target.y = 0;
    this.startRaf();
  }
}

if (!customElements.get('exhuma-magnetic-button')) {
  customElements.define('exhuma-magnetic-button', ExhumaMagneticButtonElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'MagneticButton.tsx',
					language: 'tsx',
					description: 'Magnetic Button — React Native implementation with Animated physics.',
					code: `import * as React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewStyle,
  TextStyle
} from 'react-native';

export interface MagneticButtonProps {
  strength?: number;
  maxDisplacement?: number;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  strength = ${strength},
  maxDisplacement = ${maxDisplacement},
  text = '${text}',
  style,
  textStyle,
  onPress
}) => {
  const pan = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          let dx = gestureState.dx * strength;
          let dy = gestureState.dy * strength;

          const dist = Math.hypot(dx, dy);
          if (maxDisplacement > 0 && dist > maxDisplacement) {
            const scale = maxDisplacement / dist;
            dx *= scale;
            dy *= scale;
          }

          pan.setValue({ x: dx, y: dy });
        },
        onPanResponderRelease: () => {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }).start();
          onPress?.();
        },
      }),
    [strength, maxDisplacement, pan, onPress]
  );

  return (
    <Animated.View
      style={[
        styles.button,
        style,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  text: {
    color: '#09090b',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default MagneticButton;
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'magnetic_button.dart',
					language: 'dart',
					description: 'Magnetic Button — Flutter implementation with MouseRegion and Spring controller.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaMagneticButton extends StatefulWidget {
  final Widget? child;
  final String text;
  final double strength;
  final double radius;
  final double springDamping;
  final double maxDisplacement;
  final VoidCallback? onTap;

  const ExhumaMagneticButton({
    super.key,
    this.child,
    this.text = '${text}',
    this.strength = ${toDartDouble(strength)},
    this.radius = ${toDartDouble(radius)},
    this.springDamping = ${toDartDouble(springDamping)},
    this.maxDisplacement = ${toDartDouble(maxDisplacement)},
    this.onTap,
  });

  @override
  State<ExhumaMagneticButton> createState() => _ExhumaMagneticButtonState();
}

class _ExhumaMagneticButtonState extends State<ExhumaMagneticButton>
    with SingleTickerProviderStateMixin {
  final GlobalKey _buttonKey = GlobalKey();
  Offset _current = Offset.zero;
  Offset _target = Offset.zero;
  bool _isHovered = false;
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController.unbounded(vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onHover(PointerEvent event) {
    final renderBox = _buttonKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox == null) return;

    final size = renderBox.size;
    final position = renderBox.localToGlobal(Offset.zero);
    final baseCenterX = position.dx - _current.dx + size.width / 2;
    final baseCenterY = position.dy - _current.dy + size.height / 2;

    final dx = event.position.dx - baseCenterX;
    final dy = event.position.dy - baseCenterY;
    final dist = math.sqrt(dx * dx + dy * dy);

    if (dist > widget.radius) {
      _target = Offset.zero;
    } else {
      final attenuation = 1.0 - (dist / widget.radius);
      var pullX = dx * widget.strength * attenuation;
      var pullY = dy * widget.strength * attenuation;

      if (widget.maxDisplacement > 0) {
        final pullDist = math.sqrt(pullX * pullX + pullY * pullY);
        if (pullDist > widget.maxDisplacement) {
          final scale = widget.maxDisplacement / pullDist;
          pullX *= scale;
          pullY *= scale;
        }
      }
      _target = Offset(pullX, pullY);
    }

    _isHovered = true;
    setState(() {
      _current = _target;
    });
  }

  void _onExit(PointerEvent event) {
    _isHovered = false;
    _target = Offset.zero;
    setState(() {
      _current = Offset.zero;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onHover: _onHover,
      onExit: _onExit,
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedSlide(
          offset: Offset(_current.dx / 100, _current.dy / 100),
          duration: const Duration(milliseconds: 150),
          curve: Curves.easeOutCubic,
          child: Container(
            key: _buttonKey,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.25),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: widget.child ??
                Text(
                  widget.text,
                  style: const TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
          ),
        ),
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

export function getMagneticButtonUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const strength = Number(props.strength ?? 0.35);
	const radius = Number(props.radius ?? 120);
	const springDamping = Number(props.springDamping ?? 18);
	const maxDisplacement = Number(props.maxDisplacement ?? 36);
	const text = String(props.text ?? 'Magnetic Attraction');
	const fieldDiameter = Math.max(140, Math.min(340, radius * 2));

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';
			return {
				filename: 'MagneticButtonDemo.tsx',
				language: 'tsx',
				description: 'Production Hero Centerpiece with Magnetic Attraction Field and High-Contrast Button.',
				code: `${header}import * as React from 'react';
import { MagneticButton } from './MagneticButton';
import { Sparkles, ArrowRight } from 'lucide-react';

export function MagneticButtonDemo() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-4 py-1.5 text-xs font-mono font-semibold text-foreground">
        <Sparkles className="size-3.5" />
        <span>GAUSSIAN PROXIMITY ATTRACTOR</span>
      </div>

      <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
        Physics you can feel.
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
        Inverted spring pull field dynamically draws the cursor toward high-priority conversion targets with 120 FPS sub-pixel accuracy.
      </p>

      {/* Visual Magnetic Attractor Field */}
      <div className="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden sm:h-68">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            style={{ width: '${fieldDiameter}px', height: '${fieldDiameter}px' }}
            className="border-foreground/15 absolute rounded-full border border-dashed animate-[spin_60s_linear_infinite]"
          />
          <div
            style={{ width: '${fieldDiameter * 0.75}px', height: '${fieldDiameter * 0.75}px' }}
            className="border-foreground/15 absolute rounded-full border border-dotted"
          />
          <div
            style={{ width: '${fieldDiameter * 0.5}px', height: '${fieldDiameter * 0.5}px' }}
            className="border-foreground/10 absolute rounded-full border"
          />
        </div>

        <div className="bg-foreground/5 pointer-events-none absolute -inset-6 rounded-full blur-2xl" />

        <MagneticButton
          strength={${strength}}
          radius={${radius}}
          springDamping={${springDamping}}
          maxDisplacement={${maxDisplacement}}
          className="group relative z-10 cursor-pointer rounded-2xl bg-foreground px-8 py-4 text-xs sm:text-sm font-black text-background shadow-2xl transition-transform hover:scale-105 active:scale-95 will-change-transform select-none"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="size-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span>${text}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </MagneticButton>
      </div>
    </section>
  );
}

export default MagneticButtonDemo;
`,
			};
		}

		case 'vue': {
			return {
				filename: 'MagneticButtonDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component Demo with Magnetic Attraction Field.',
				code: `<script setup lang="ts">
import MagneticButton from './MagneticButton.vue';
</script>

<template>
  <div class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
    <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
      Vue 3 Kinetic Attraction
    </h2>
    <p class="mt-2 max-w-md text-sm text-muted-foreground">
      Hover inside the orbital rings to feel the reactive inverted spring attractor.
    </p>

    <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
      <!-- Magnetic Field Rings -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div style="width: ${fieldDiameter}px; height: ${fieldDiameter}px;" class="border-foreground/15 absolute rounded-full border border-dashed animate-spin" />
        <div style="width: ${fieldDiameter * 0.75}px; height: ${fieldDiameter * 0.75}px;" class="border-foreground/15 absolute rounded-full border border-dotted" />
      </div>

      <MagneticButton
        :strength="${strength}"
        :radius="${radius}"
        :spring-damping="${springDamping}"
        :max-displacement="${maxDisplacement}"
      >
        <span>${text}</span>
      </MagneticButton>
    </div>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'MagneticButtonDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 Runes Demo with Magnetic Attraction Field.',
				code: `<script lang="ts">
  import MagneticButton from './MagneticButton.svelte';
</script>

<div class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
  <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
    Svelte 5 Kinetic Magnet
  </h2>
  <p class="mt-2 max-w-md text-sm text-muted-foreground">
    Continuous rAF vector attraction with zero framework overhead.
  </p>

  <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div style="width: ${fieldDiameter}px; height: ${fieldDiameter}px;" class="border-foreground/15 absolute rounded-full border border-dashed animate-spin" />
      <div style="width: ${fieldDiameter * 0.75}px; height: ${fieldDiameter * 0.75}px;" class="border-foreground/15 absolute rounded-full border border-dotted" />
    </div>

    <MagneticButton
      strength={${strength}}
      radius={${radius}}
      springDamping={${springDamping}}
      maxDisplacement={${maxDisplacement}}
    >
      ${text}
    </MagneticButton>
  </div>
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'magnetic-button-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Demo with Standalone Magnetic Button Component.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaMagneticButtonComponent } from './magnetic-button.component';

@Component({
  selector: 'app-magnetic-button-demo',
  standalone: true,
  imports: [CommonModule, ExhumaMagneticButtonComponent],
  template: \`
    <div class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
      <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        Angular 18+ Kinetic Attraction
      </h2>
      <p class="mt-2 max-w-md text-sm text-muted-foreground">
        Zero change-detection overhead via ngZone.runOutsideAngular.
      </p>

      <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div style="width: ${fieldDiameter}px; height: ${fieldDiameter}px;" class="border-foreground/15 absolute rounded-full border border-dashed animate-spin"></div>
        </div>

        <exhuma-magnetic-button
          [strength]="${strength}"
          [radius]="${radius}"
          [springDamping]="${springDamping}"
          [maxDisplacement]="${maxDisplacement}"
        >
          ${text}
        </exhuma-magnetic-button>
      </div>
    </div>
  \`
})
export class MagneticButtonDemoComponent {}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'MagneticButtonDemo.tsx',
				language: 'tsx',
				description: 'SolidJS Interactive Demo with Magnetic Button.',
				code: `import { Component } from 'solid-js';
import { MagneticButton } from './MagneticButton';

export const MagneticButtonDemo: Component = () => {
  return (
    <div class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
      <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        SolidJS Kinetic Field
      </h2>
      <p class="mt-2 max-w-md text-sm text-muted-foreground">
        Fine-grained reactive signals coupled with direct DOM style writes.
      </p>

      <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div style="width: ${fieldDiameter}px; height: ${fieldDiameter}px;" class="border-foreground/15 absolute rounded-full border border-dashed animate-spin" />
        </div>

        <MagneticButton
          strength={${strength}}
          radius={${radius}}
          springDamping={${springDamping}}
          maxDisplacement={${maxDisplacement}}
        >
          ${text}
        </MagneticButton>
      </div>
    </div>
  );
};

export default MagneticButtonDemo;
`,
			};
		}

		case 'astro': {
			return {
				filename: 'MagneticButtonDemo.astro',
				language: 'astro',
				description: 'Astro Island Demo with Magnetic Button.',
				code: `---
import MagneticButton from './MagneticButton.astro';
---

<section class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
  <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
    Astro Kinetic Action
  </h2>
  <p class="mt-2 max-w-md text-sm text-muted-foreground">
    Zero-JS SSR fallback with client-side progressive kinetic enhancement.
  </p>

  <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div style="width: ${fieldDiameter}px; height: ${fieldDiameter}px;" class="border-foreground/15 absolute rounded-full border border-dashed animate-spin"></div>
    </div>

    <MagneticButton
      strength={${strength}}
      radius={${radius}}
      springDamping={${springDamping}}
      maxDisplacement={${maxDisplacement}}
    >
      ${text}
    </MagneticButton>
  </div>
</section>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'demo.blade.php',
				language: 'php',
				description: 'Laravel Blade View Demo with Magnetic Button Component.',
				code: `<div class="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl">
  <h2 class="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
    Laravel Blade Kinetic Magnet
  </h2>
  <p class="mt-2 max-w-md text-sm text-muted-foreground">
    Direct DOM transform manipulation with zero npm dependencies.
  </p>

  <div class="relative my-8 flex h-60 w-full items-center justify-center overflow-hidden">
    <x-magnetic-button
      :strength="${strength}"
      :radius="${radius}"
      :springDamping="${springDamping}"
      :maxDisplacement="${maxDisplacement}"
      text="${text}"
    />
  </div>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML5 + ESM Demo with Magnetic Button.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exhuma Magnetic Button Demo</title>
  <link rel="stylesheet" href="./magnetic-button.css">
</head>
<body style="display: flex; min-height: 100vh; align-items: center; justify-content: center; background: #09090b; color: #f4f4f5; margin: 0; font-family: sans-serif;">

  <button id="cta-btn" class="exhuma-magnetic-btn">
    ${text}
  </button>

  <script type="module">
    import { initMagneticButton } from './magnetic-button.js';

    initMagneticButton('#cta-btn', {
      strength: ${strength},
      radius: ${radius},
      springDamping: ${springDamping},
      maxDisplacement: ${maxDisplacement},
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'block-preview.html',
				language: 'html',
				description: 'WordPress Gutenberg Editor Preview Markup.',
				code: `<div class="wp-block-exhuma-magnetic-button exhuma-magnetic-btn">
  <button
    class="exhuma-magnetic-element"
    data-strength="${strength}"
    data-radius="${radius}"
    data-damping="${springDamping}"
    data-max-displacement="${maxDisplacement}"
  >
    <span>${text}</span>
  </button>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Web Components Custom Element Demo.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exhuma Web Component Demo</title>
  <script type="module" src="./magnetic-button.wc.js"></script>
  <style>
    exhuma-magnetic-button {
      padding: 1rem 2rem;
      border-radius: 1rem;
      background: #ffffff;
      color: #09090b;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body style="display: flex; min-height: 100vh; align-items: center; justify-content: center; background: #09090b; margin: 0; font-family: sans-serif;">
  <exhuma-magnetic-button
    strength="${strength}"
    radius="${radius}"
    spring-damping="${springDamping}"
    max-displacement="${maxDisplacement}"
  >
    ${text}
  </exhuma-magnetic-button>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native Screen Demo with MagneticButton.',
				code: `import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MagneticButton } from './components/MagneticButton';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kinetic Attraction</Text>
      <Text style={styles.subtitle}>Drag or swipe near the target button</Text>

      <MagneticButton
        strength={${strength}}
        maxDisplacement={${maxDisplacement}}
        text="${text}"
        onPress={() => console.log('MagneticButton pressed!')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 32,
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'main.dart',
				language: 'dart',
				description: 'Flutter Application Demo with ExhumaMagneticButton.',
				code: `import 'package:flutter/material.dart';
import 'magnetic_button.dart';

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
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Flutter Magnetic Attraction',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'Move mouse cursor in proximity to attract button',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 32),
              ExhumaMagneticButton(
                strength: ${toDartDouble(strength)},
                radius: ${toDartDouble(radius)},
                springDamping: ${toDartDouble(springDamping)},
                maxDisplacement: ${toDartDouble(maxDisplacement)},
                text: '${text}',
                onTap: () {
                  debugPrint('Magnetic button tapped!');
                },
              ),
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
				filename: 'MagneticButtonDemo.tsx',
				language: 'tsx',
				description: 'Magnetic Button Demo',
				code: `import React from 'react';
import { MagneticButton } from './MagneticButton';

export default function Demo() {
  return <MagneticButton strength={${strength}} radius={${radius}}>${text}</MagneticButton>;
}
`,
			};
	}
}
