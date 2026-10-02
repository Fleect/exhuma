import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getNumberTickerOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const value = Number(props.value ?? 1000);
	const initialValue = Number(props.initialValue ?? 0);
	const duration = Number(props.duration ?? 1.5);
	const decimalPlaces = Number(props.decimalPlaces ?? 0);
	const prefix = String(props.prefix ?? '');
	const suffix = String(props.suffix ?? '');

	const toFlutterDouble = (v: number) => (String(v).includes('.') ? String(v) : `${v}.0`);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			if (!isEjected) {
				return [
					{
						filename: 'NumberTicker.tsx',
						language: 'tsx',
						description: 'Number Ticker — Clean component powered by @fleect/exhuma kinetic primitives.',
						code: `${header}import * as React from 'react';
import {
  NumberTicker as CoreNumberTicker,
  type NumberTickerProps as CoreNumberTickerProps,
} from '@fleect/exhuma';
import { clsx } from 'clsx';

export interface NumberTickerProps extends CoreNumberTickerProps {
  className?: string;
}

export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value = ${value},
      initialValue = ${initialValue},
      duration = ${duration},
      decimalPlaces = ${decimalPlaces},
      prefix = '${prefix}',
      suffix = '${suffix}',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <CoreNumberTicker
        ref={ref}
        value={value}
        initialValue={initialValue}
        duration={duration}
        decimalPlaces={decimalPlaces}
        prefix={prefix}
        suffix={suffix}
        className={clsx('inline-block tabular-nums font-bold tracking-tight text-foreground font-mono', className)}
        {...props}
      />
    );
  }
);
NumberTicker.displayName = 'NumberTicker';

export default NumberTicker;
`,
					},
				];
			}

			// Ejected zero-dependency React implementation
			return [
				{
					filename: 'NumberTicker.tsx',
					language: 'tsx',
					description: 'Number Ticker — Standalone Ejected Engine with direct DOM manipulation and analytical easeOutExpo.',
					code: `${header}import * as React from 'react';
import { clsx } from 'clsx';

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  initialValue?: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  triggerOnScroll?: boolean;
}

/**
 * Analytical easeOutExpo: 1 - 2^(-10 * progress)
 */
function easeOutExpo(progress: number): number {
  if (progress >= 1.0) return 1.0;
  if (progress <= 0.0) return 0.0;
  return 1 - Math.pow(2, -10 * progress);
}

/**
 * NumberTicker — Exhuma Kinetic Methodology (EKM)
 * Big-Omega Guarantee: Direct DOM textContent manipulation via rAF (ZERO React VDOM re-renders during counting).
 */
export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value = ${value},
      initialValue = ${initialValue},
      duration = ${duration},
      decimalPlaces = ${decimalPlaces},
      prefix = '${prefix}',
      suffix = '${suffix}',
      triggerOnScroll = true,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLSpanElement>(null);
    const internalRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => containerRef.current as HTMLSpanElement);

    const rafIdRef = React.useRef<number | null>(null);
    const startTimeRef = React.useRef<number | null>(null);
    const hasStartedRef = React.useRef<boolean>(false);

    const safeDecimals = Math.max(0, Math.min(20, Math.floor(decimalPlaces)));

    const formatNumber = React.useCallback(
      (val: number): string => {
        const formatted = val.toLocaleString(undefined, {
          minimumFractionDigits: safeDecimals,
          maximumFractionDigits: safeDecimals,
        });
        return \`\${prefix}\${formatted}\${suffix}\`;
      },
      [safeDecimals, prefix, suffix]
    );

    const startTicker = React.useCallback(() => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      startTimeRef.current = null;

      const tick = (now: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = now;
        }

        const elapsedSeconds = (now - startTimeRef.current) / 1000;
        const progress = Math.max(0, Math.min(1, elapsedSeconds / duration));
        const ease = easeOutExpo(progress);
        const currentVal = initialValue + (value - initialValue) * ease;

        if (internalRef.current) {
          internalRef.current.textContent = formatNumber(progress >= 1.0 ? value : currentVal);
        }

        if (progress < 1.0) {
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          rafIdRef.current = null;
        }
      };

      rafIdRef.current = requestAnimationFrame(tick);
    }, [initialValue, value, duration, formatNumber]);

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      hasStartedRef.current = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Honor prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        el.textContent = formatNumber(value);
        return;
      }

      el.textContent = formatNumber(initialValue);

      let observer: IntersectionObserver | null = null;

      if (!triggerOnScroll) {
        startTicker();
      } else {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              startTicker();
              observer?.disconnect();
            }
          },
          { threshold: 0.1 }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }
      }

      return () => {
        if (observer) {
          observer.disconnect();
        }
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [triggerOnScroll, startTicker, formatNumber, initialValue, value]);

    return (
      <span
        ref={containerRef}
        className={clsx('inline-block tabular-nums font-bold tracking-tight text-foreground font-mono', className)}
        {...props}
      >
        <span ref={internalRef} aria-hidden="true">
          {formatNumber(initialValue)}
        </span>
        <span className="sr-only">{formatNumber(value)}</span>
      </span>
    );
  }
);
NumberTicker.displayName = 'NumberTicker';

export default NumberTicker;
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'NumberTicker.vue',
					language: 'vue',
					description: 'Number Ticker — Vue 3 SFC with direct DOM textContent manipulation and zero VDOM re-rendering during animation.',
					code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: number;
    initialValue?: number;
    duration?: number;
    decimalPlaces?: number;
    prefix?: string;
    suffix?: string;
    triggerOnScroll?: boolean;
    class?: string;
  }>(),
  {
    value: ${value},
    initialValue: ${initialValue},
    duration: ${duration},
    decimalPlaces: ${decimalPlaces},
    prefix: '${prefix}',
    suffix: '${suffix}',
    triggerOnScroll: true,
    class: '',
  }
);

const spanRef = ref<HTMLSpanElement | null>(null);
let rafId: number | null = null;
let startTime: number | null = null;
let observer: IntersectionObserver | null = null;

function easeOutExpo(progress: number): number {
  if (progress >= 1.0) return 1.0;
  if (progress <= 0.0) return 0.0;
  return 1 - Math.pow(2, -10 * progress);
}

function formatNumber(val: number): string {
  const formatted = val.toLocaleString(undefined, {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  });
  return \`\${props.prefix}\${formatted}\${props.suffix}\`;
}

function startTicker() {
  startTime = null;
  const tick = (now: number) => {
    if (startTime === null) startTime = now;
    const elapsed = (now - startTime) / 1000;
    const progress = Math.max(0, Math.min(1, elapsed / props.duration));
    const ease = easeOutExpo(progress);
    const current = props.initialValue + (props.value - props.initialValue) * ease;

    if (spanRef.value) {
      spanRef.value.textContent = formatNumber(progress >= 1.0 ? props.value : current);
    }

    if (progress < 1.0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  };
  rafId = requestAnimationFrame(tick);
}

function resetAndStart() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (!spanRef.value) return;

  spanRef.value.textContent = formatNumber(props.initialValue);

  if (!props.triggerOnScroll) {
    startTicker();
    return;
  }

  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        startTicker();
        observer?.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(spanRef.value);
}

onMounted(() => {
  resetAndStart();
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (observer) observer.disconnect();
});

watch(
  () => [props.value, props.initialValue, props.duration, props.decimalPlaces, props.prefix, props.suffix],
  () => {
    resetAndStart();
  }
);
</script>

<template>
  <span
    ref="spanRef"
    :class="['inline-block tabular-nums font-bold tracking-tight text-foreground font-mono', props.class]"
  >
    {{ formatNumber(initialValue) }}
  </span>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'NumberTicker.svelte',
					language: 'svelte',
					description: 'Number Ticker — Svelte 5 component with Runes and direct DOM manipulation via rAF.',
					code: `<script lang="ts">
  import { onMount } from 'svelte';

  let {
    value = ${value},
    initialValue = ${initialValue},
    duration = ${duration},
    decimalPlaces = ${decimalPlaces},
    prefix = '${prefix}',
    suffix = '${suffix}',
    triggerOnScroll = true,
    class: className = '',
  }: {
    value?: number;
    initialValue?: number;
    duration?: number;
    decimalPlaces?: number;
    prefix?: string;
    suffix?: string;
    triggerOnScroll?: boolean;
    class?: string;
  } = $props();

  let spanEl = $state<HTMLSpanElement | null>(null);
  let rafId: number | null = null;

  function easeOutExpo(progress: number): number {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  function formatNumber(val: number): string {
    const formatted = val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
    return \`\${prefix}\${formatted}\${suffix}\`;
  }

  function startTicker() {
    let startTime: number | null = null;
    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      const ease = easeOutExpo(progress);
      const current = initialValue + (value - initialValue) * ease;

      if (spanEl) {
        spanEl.textContent = formatNumber(progress >= 1.0 ? value : current);
      }

      if (progress < 1.0) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(tick);
  }

  onMount(() => {
    if (!spanEl) return;
    spanEl.textContent = formatNumber(initialValue);

    let observer: IntersectionObserver | null = null;

    if (!triggerOnScroll) {
      startTicker();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            startTicker();
            observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(spanEl);
    }

    return () => {
      if (observer) observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<span
  bind:this={spanEl}
  class="inline-block tabular-nums font-bold tracking-tight text-foreground font-mono {className}"
>
  {formatNumber(initialValue)}
</span>
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'number-ticker.component.ts',
					language: 'typescript',
					description: 'Number Ticker — Standalone Angular 18+ component running out-of-zone rAF for 120 FPS counting without change detection churn.',
					code: `import { Component, ChangeDetectionStrategy, ElementRef, NgZone, AfterViewInit, OnDestroy, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-number-ticker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <span
      #spanEl
      [class]="'inline-block tabular-nums font-bold tracking-tight text-foreground font-mono ' + customClass()"
    >
      {{ formatNumber(initialValue()) }}
    </span>
  \`
})
export class NumberTickerComponent implements AfterViewInit, OnDestroy {
  readonly value = input<number>(${value});
  readonly initialValue = input<number>(${initialValue});
  readonly duration = input<number>(${duration});
  readonly decimalPlaces = input<number>(${decimalPlaces});
  readonly prefix = input<string>('${prefix}');
  readonly suffix = input<string>('${suffix}');
  readonly triggerOnScroll = input<boolean>(true);
  readonly customClass = input<string>('');

  readonly spanEl = viewChild<ElementRef<HTMLSpanElement>>('spanEl');

  private rafId: number | null = null;
  private observer: IntersectionObserver | null = null;

  constructor(private ngZone: NgZone) {}

  formatNumber(val: number): string {
    const decimals = Math.max(0, Math.min(20, Math.floor(this.decimalPlaces())));
    const formatted = val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return \`\${this.prefix()}\${formatted}\${this.suffix()}\`;
  }

  private easeOutExpo(progress: number): number {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const el = this.spanEl()?.nativeElement;
      if (!el) return;

      el.textContent = this.formatNumber(this.initialValue());

      const start = () => {
        let startTime: number | null = null;
        const tick = (now: number) => {
          if (startTime === null) startTime = now;
          const elapsed = (now - startTime) / 1000;
          const progress = Math.max(0, Math.min(1, elapsed / this.duration()));
          const ease = this.easeOutExpo(progress);
          const current = this.initialValue() + (this.value() - this.initialValue()) * ease;

          el.textContent = this.formatNumber(progress >= 1.0 ? this.value() : current);

          if (progress < 1.0) {
            this.rafId = requestAnimationFrame(tick);
          } else {
            this.rafId = null;
          }
        };
        this.rafId = requestAnimationFrame(tick);
      };

      if (!this.triggerOnScroll()) {
        start();
      } else {
        this.observer = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              start();
              this.observer?.disconnect();
            }
          },
          { threshold: 0.1 }
        );
        this.observer.observe(el);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.observer) this.observer.disconnect();
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'NumberTicker.tsx',
					language: 'tsx',
					description: 'Number Ticker — SolidJS component with direct DOM textContent manipulation.',
					code: `import { Component, onMount, onCleanup, JSX } from 'solid-js';

export interface NumberTickerProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  initialValue?: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  triggerOnScroll?: boolean;
}

export const NumberTicker: Component<NumberTickerProps> = (props) => {
  const value = () => props.value ?? ${value};
  const initialValue = () => props.initialValue ?? ${initialValue};
  const duration = () => props.duration ?? ${duration};
  const decimalPlaces = () => props.decimalPlaces ?? ${decimalPlaces};
  const prefix = () => props.prefix ?? '${prefix}';
  const suffix = () => props.suffix ?? '${suffix}';
  const triggerOnScroll = () => props.triggerOnScroll ?? true;

  let spanRef: HTMLSpanElement | undefined;
  let rafId: number | null = null;
  let observer: IntersectionObserver | null = null;

  function easeOutExpo(progress: number): number {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  function formatNumber(val: number): string {
    const formatted = val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces(),
      maximumFractionDigits: decimalPlaces(),
    });
    return \`\${prefix()}\${formatted}\${suffix()}\`;
  }

  function startTicker() {
    let startTime: number | null = null;
    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.max(0, Math.min(1, elapsed / duration()));
      const ease = easeOutExpo(progress);
      const current = initialValue() + (value() - initialValue()) * ease;

      if (spanRef) {
        spanRef.textContent = formatNumber(progress >= 1.0 ? value() : current);
      }

      if (progress < 1.0) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(tick);
  }

  onMount(() => {
    if (!spanRef) return;
    spanRef.textContent = formatNumber(initialValue());

    if (!triggerOnScroll()) {
      startTicker();
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          startTicker();
          observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(spanRef);
  });

  onCleanup(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (observer) observer.disconnect();
  });

  return (
    <span
      ref={spanRef}
      class={"inline-block tabular-nums font-bold tracking-tight text-foreground font-mono " + (props.class ?? '')}
      {...props}
    >
      {formatNumber(initialValue())}
    </span>
  );
};

export default NumberTicker;
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'NumberTicker.astro',
					language: 'astro',
					description: 'Number Ticker — Astro component with progressive hydration script.',
					code: `---
export interface Props {
  value?: number;
  initialValue?: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  triggerOnScroll?: boolean;
  class?: string;
}

const {
  value = ${value},
  initialValue = ${initialValue},
  duration = ${duration},
  decimalPlaces = ${decimalPlaces},
  prefix = '${prefix}',
  suffix = '${suffix}',
  triggerOnScroll = true,
  class: className = '',
} = Astro.props;

const initialFormatted = \`\${prefix}\${initialValue.toLocaleString(undefined, {
  minimumFractionDigits: decimalPlaces,
  maximumFractionDigits: decimalPlaces,
})}\${suffix}\`;
---

<span
  class={\`exhuma-number-ticker inline-block tabular-nums font-bold tracking-tight text-foreground font-mono \${className}\`}
  data-value={value}
  data-initial-value={initialValue}
  data-duration={duration}
  data-decimals={decimalPlaces}
  data-prefix={prefix}
  data-suffix={suffix}
  data-trigger-on-scroll={String(triggerOnScroll)}
>
  {initialFormatted}
</span>

<script>
  function easeOutExpo(progress: number): number {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  function initTickers() {
    document.querySelectorAll<HTMLElement>('.exhuma-number-ticker').forEach((el) => {
      if (el.dataset.tickerInit) return;
      el.dataset.tickerInit = 'true';

      const value = parseFloat(el.getAttribute('data-value') || '0');
      const initialValue = parseFloat(el.getAttribute('data-initial-value') || '0');
      const duration = parseFloat(el.getAttribute('data-duration') || '1.5');
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const triggerOnScroll = el.getAttribute('data-trigger-on-scroll') !== 'false';

      const formatNumber = (val: number) => {
        const formatted = val.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
        return \`\${prefix}\${formatted}\${suffix}\`;
      };

      const start = () => {
        let startTime: number | null = null;
        let rafId: number;

        const tick = (now: number) => {
          if (startTime === null) startTime = now;
          const elapsed = (now - startTime) / 1000;
          const progress = Math.max(0, Math.min(1, elapsed / duration));
          const ease = easeOutExpo(progress);
          const current = initialValue + (value - initialValue) * ease;

          el.textContent = formatNumber(progress >= 1.0 ? value : current);

          if (progress < 1.0) {
            rafId = requestAnimationFrame(tick);
          }
        };

        rafId = requestAnimationFrame(tick);
      };

      if (!triggerOnScroll) {
        start();
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            start();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    });
  }

  initTickers();
  document.addEventListener('astro:page-load', initTickers);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'number-ticker.blade.php',
					language: 'php',
					description: 'Number Ticker — Laravel Blade component with Alpine.js progressive animation.',
					code: `@props([
  'value' => ${value},
  'initialValue' => ${initialValue},
  'duration' => ${duration},
  'decimalPlaces' => ${decimalPlaces},
  'prefix' => '${prefix}',
  'suffix' => '${suffix}',
  'triggerOnScroll' => true,
])

<span
  {{ $attributes->merge(['class' => 'inline-block tabular-nums font-bold tracking-tight text-foreground font-mono']) }}
  x-data="{
    value: {{ $value }},
    initialValue: {{ $initialValue }},
    duration: {{ $duration }},
    decimals: {{ $decimalPlaces }},
    prefix: @js($prefix),
    suffix: @js($suffix),
    triggerOnScroll: {{ $triggerOnScroll ? 'true' : 'false' }},
    easeOutExpo(p) {
      if (p >= 1.0) return 1.0;
      if (p <= 0.0) return 0.0;
      return 1 - Math.pow(2, -10 * p);
    },
    formatNumber(val) {
      const formatted = val.toLocaleString(undefined, {
        minimumFractionDigits: this.decimals,
        maximumFractionDigits: this.decimals,
      });
      return \`\${this.prefix}\${formatted}\${this.suffix}\`;
    },
    startTicker() {
      let startTime = null;
      const tick = (now) => {
        if (startTime === null) startTime = now;
        const elapsed = (now - startTime) / 1000;
        const progress = Math.max(0, Math.min(1, elapsed / this.duration));
        const ease = this.easeOutExpo(progress);
        const current = this.initialValue + (this.value - this.initialValue) * ease;
        this.$el.textContent = this.formatNumber(progress >= 1.0 ? this.value : current);

        if (progress < 1.0) {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    },
    init() {
      if (!this.triggerOnScroll) {
        this.startTicker();
        return;
      }
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.startTicker();
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      observer.observe(this.$el);
    }
  }"
>
  {{ $prefix }}{{ number_format($initialValue, $decimalPlaces) }}{{ $suffix }}
</span>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'number-ticker.js',
					language: 'javascript',
					description: 'Number Ticker — Autonomous Vanilla ESM script with direct DOM manipulation.',
					code: `export class ExhumaNumberTicker {
  constructor(element, options = {}) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    this.options = {
      value: ${value},
      initialValue: ${initialValue},
      duration: ${duration},
      decimalPlaces: ${decimalPlaces},
      prefix: '${prefix}',
      suffix: '${suffix}',
      triggerOnScroll: true,
      ...options
    };

    this.rafId = null;
    this.observer = null;
    this.init();
  }

  easeOutExpo(progress) {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  formatNumber(val) {
    const decimals = Math.max(0, Math.min(20, Math.floor(this.options.decimalPlaces)));
    const formatted = val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return \`\${this.options.prefix}\${formatted}\${this.options.suffix}\`;
  }

  start() {
    let startTime = null;
    const tick = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.max(0, Math.min(1, elapsed / this.options.duration));
      const ease = this.easeOutExpo(progress);
      const current = this.options.initialValue + (this.options.value - this.options.initialValue) * ease;

      this.el.textContent = this.formatNumber(progress >= 1.0 ? this.options.value : current);

      if (progress < 1.0) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  init() {
    this.el.textContent = this.formatNumber(this.options.initialValue);

    if (!this.options.triggerOnScroll) {
      this.start();
      return;
    }

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.start();
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.el);
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export function initNumberTicker(selector, options) {
  return new ExhumaNumberTicker(selector, options);
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
					description: 'Number Ticker — Gutenberg block manifest definition.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/number-ticker",
  "version": "1.0.0",
  "title": "Exhuma Number Ticker",
  "category": "design",
  "description": "Analytical easeOutExpo numerical counter with direct DOM textContent manipulation.",
  "attributes": {
    "value": { "type": "number", "default": ${value} },
    "initialValue": { "type": "number", "default": ${initialValue} },
    "duration": { "type": "number", "default": ${duration} },
    "decimalPlaces": { "type": "number", "default": ${decimalPlaces} },
    "prefix": { "type": "string", "default": "${prefix}" },
    "suffix": { "type": "string", "default": "${suffix}" }
  },
  "viewScript": "file:./view.js",
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'Number Ticker — Server-side Gutenberg block renderer.',
					code: `<?php
/**
 * Exhuma Number Ticker Block Template.
 */
$val = $attributes['value'] ?? ${value};
$init = $attributes['initialValue'] ?? ${initialValue};
$dur = $attributes['duration'] ?? ${duration};
$dec = $attributes['decimalPlaces'] ?? ${decimalPlaces};
$prefix = $attributes['prefix'] ?? '${prefix}';
$suffix = $attributes['suffix'] ?? '${suffix}';
?>

<span
  class="exhuma-number-ticker inline-block tabular-nums font-bold tracking-tight text-foreground font-mono"
  data-value="<?php echo esc_attr($val); ?>"
  data-initial-value="<?php echo esc_attr($init); ?>"
  data-duration="<?php echo esc_attr($dur); ?>"
  data-decimals="<?php echo esc_attr($dec); ?>"
  data-prefix="<?php echo esc_attr($prefix); ?>"
  data-suffix="<?php echo esc_attr($suffix); ?>"
>
  <?php echo esc_html($prefix . number_format($init, $dec) . $suffix); ?>
</span>
`,
				},
				{
					filename: 'view.js',
					language: 'javascript',
					description: 'Number Ticker — Front-end client script for WordPress.',
					code: `document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.exhuma-number-ticker').forEach((el) => {
    const value = parseFloat(el.dataset.value || '${value}');
    const initialValue = parseFloat(el.dataset.initialValue || '${initialValue}');
    const duration = parseFloat(el.dataset.duration || '${duration}');
    const decimals = parseInt(el.dataset.decimals || '${decimalPlaces}', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    const format = (v) => prefix + v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      let start = null;
      const tick = (now) => {
        if (!start) start = now;
        const p = Math.max(0, Math.min(1, (now - start) / (duration * 1000)));
        const ease = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = format(initialValue + (value - initialValue) * ease);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.1 });

    observer.observe(el);
  });
});
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-number-ticker.ts',
					language: 'typescript',
					description: 'Number Ticker — W3C Custom Element (<exhuma-number-ticker>).',
					code: `export class ExhumaNumberTickerElement extends HTMLElement {
  private rafId: number | null = null;
  private observer: IntersectionObserver | null = null;

  connectedCallback() {
    this.classList.add('inline-block', 'tabular-nums', 'font-bold', 'tracking-tight', 'text-foreground', 'font-mono');
    this.start();
  }

  private easeOutExpo(progress: number): number {
    if (progress >= 1.0) return 1.0;
    if (progress <= 0.0) return 0.0;
    return 1 - Math.pow(2, -10 * progress);
  }

  private start() {
    const value = parseFloat(this.getAttribute('value') || '${value}');
    const initialValue = parseFloat(this.getAttribute('initial-value') || '${initialValue}');
    const duration = parseFloat(this.getAttribute('duration') || '${duration}');
    const decimals = parseInt(this.getAttribute('decimal-places') || '${decimalPlaces}', 10);
    const prefix = this.getAttribute('prefix') || '${prefix}';
    const suffix = this.getAttribute('suffix') || '${suffix}';

    const format = (v: number) =>
      \`\${prefix}\${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}\${suffix}\`;

    this.textContent = format(initialValue);

    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      this.observer?.disconnect();

      let startTime: number | null = null;
      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = (now - startTime) / 1000;
        const progress = Math.max(0, Math.min(1, elapsed / duration));
        const ease = this.easeOutExpo(progress);
        const current = initialValue + (value - initialValue) * ease;

        this.textContent = format(progress >= 1.0 ? value : current);

        if (progress < 1.0) {
          this.rafId = requestAnimationFrame(tick);
        }
      };

      this.rafId = requestAnimationFrame(tick);
    }, { threshold: 0.1 });

    this.observer.observe(this);
  }

  disconnectedCallback() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.observer) this.observer.disconnect();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('exhuma-number-ticker')) {
  customElements.define('exhuma-number-ticker', ExhumaNumberTickerElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'NumberTicker.tsx',
					language: 'tsx',
					description: 'Number Ticker — React Native component with smooth easeOutExpo counting.',
					code: `import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

export interface NumberTickerProps {
  value?: number;
  initialValue?: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value = ${value},
  initialValue = ${initialValue},
  duration = ${duration},
  decimalPlaces = ${decimalPlaces},
  prefix = '${prefix}',
  suffix = '${suffix}',
  style,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return \`\${prefix}\${initialValue.toFixed(decimalPlaces)}\${suffix}\`;
  });

  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      const ease = progress >= 1.0 ? 1.0 : 1 - Math.pow(2, -10 * progress);
      const current = initialValue + (value - initialValue) * ease;

      const formatted = current.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });

      setDisplayValue(\`\${prefix}\${formatted}\${suffix}\`);

      if (progress < 1.0) {
        rafId.current = requestAnimationFrame(tick);
      }
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [value, initialValue, duration, decimalPlaces, prefix, suffix]);

  return <Text style={[styles.text, style]}>{displayValue}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 24,
    color: '#111827',
  },
});

export default NumberTicker;
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'number_ticker.dart',
					language: 'dart',
					description: 'Number Ticker — Flutter StatefulWidget with AnimationController and easeOutExpo curve.',
					code: `import 'package:flutter/material.dart';

class ExhumaNumberTicker extends StatefulWidget {
  final double value;
  final double initialValue;
  final Duration duration;
  final int decimalPlaces;
  final String prefix;
  final String suffix;
  final TextStyle? style;

  const ExhumaNumberTicker({
    super.key,
    required this.value,
    this.initialValue = ${toFlutterDouble(initialValue)},
    this.duration = const Duration(milliseconds: ${(duration * 1000).toFixed(0)}),
    this.decimalPlaces = ${decimalPlaces},
    this.prefix = '${prefix}',
    this.suffix = '${suffix}',
    this.style,
  });

  @override
  State<ExhumaNumberTicker> createState() => _ExhumaNumberTickerState();
}

class _ExhumaNumberTickerState extends State<ExhumaNumberTicker> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _animation = Tween<double>(begin: widget.initialValue, end: widget.value).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutExpo),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(ExhumaNumberTicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _animation = Tween<double>(begin: _animation.value, end: widget.value).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeOutExpo),
      );
      _controller.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final formatted = _animation.value.toStringAsFixed(widget.decimalPlaces);
        return Text(
          '\${widget.prefix}\$formatted\${widget.suffix}',
          style: widget.style ??
              const TextStyle(
                fontFamily: 'monospace',
                fontWeight: FontWeight.bold,
                fontSize: 28,
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

export function getNumberTickerUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const value = Number(props.value ?? 1000);
	const initialValue = Number(props.initialValue ?? 0);
	const duration = Number(props.duration ?? 1.5);
	const decimalPlaces = Number(props.decimalPlaces ?? 0);
	const prefix = String(props.prefix ?? '');
	const suffix = String(props.suffix ?? '');

	const toFlutterDouble = (v: number) => (String(v).includes('.') ? String(v) : `${v}.0`);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';
			return {
				filename: 'NumberTickerDemo.tsx',
				language: 'tsx',
				description: 'Number Ticker KPI metrics card demonstration.',
				code: `${header}import * as React from 'react';
import { NumberTicker } from './NumberTicker';

export function NumberTickerDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
      <span className="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
        HARDWARE TELEMETRY
      </span>
      <div className="font-mono text-5xl font-black tracking-tight text-foreground">
        <NumberTicker
          value={${value}}
          initialValue={${initialValue}}
          duration={${duration}}
          decimalPlaces={${decimalPlaces}}
          prefix="${prefix}"
          suffix="${suffix}"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-3 font-mono">
        Closed-form analytical easeOutExpo with zero React VDOM re-render overhead.
      </p>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'NumberTickerDemo.vue',
				language: 'vue',
				description: 'Vue 3 Number Ticker KPI metrics card demonstration.',
				code: `<script setup lang="ts">
import NumberTicker from './NumberTicker.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
    <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
      HARDWARE TELEMETRY
    </span>
    <div class="font-mono text-5xl font-black tracking-tight text-foreground">
      <NumberTicker
        :value="${value}"
        :initialValue="${initialValue}"
        :duration="${duration}"
        :decimalPlaces="${decimalPlaces}"
        prefix="${prefix}"
        suffix="${suffix}"
      />
    </div>
    <p class="text-xs text-muted-foreground mt-3 font-mono">
      Closed-form analytical easeOutExpo with direct DOM textContent manipulation.
    </p>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'NumberTickerDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 Number Ticker KPI metrics card demonstration.',
				code: `<script lang="ts">
  import NumberTicker from './NumberTicker.svelte';
</script>

<div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
  <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
    HARDWARE TELEMETRY
  </span>
  <div class="font-mono text-5xl font-black tracking-tight text-foreground">
    <NumberTicker
      value={${value}}
      initialValue={${initialValue}}
      duration={${duration}}
      decimalPlaces={${decimalPlaces}}
      prefix="${prefix}"
      suffix="${suffix}"
    />
  </div>
  <p class="text-xs text-muted-foreground mt-3 font-mono">
    Closed-form analytical easeOutExpo with direct DOM textContent manipulation.
  </p>
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'number-ticker-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Number Ticker KPI metrics card demonstration.',
				code: `import { Component } from '@angular/core';
import { NumberTickerComponent } from './number-ticker.component';

@Component({
  selector: 'app-number-ticker-demo',
  standalone: true,
  imports: [NumberTickerComponent],
  template: \`
    <div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
      <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
        HARDWARE TELEMETRY
      </span>
      <div class="font-mono text-5xl font-black tracking-tight text-foreground">
        <exhuma-number-ticker
          [value]="${value}"
          [initialValue]="${initialValue}"
          [duration]="${duration}"
          [decimalPlaces]="${decimalPlaces}"
          prefix="${prefix}"
          suffix="${suffix}"
        />
      </div>
      <p class="text-xs text-muted-foreground mt-3 font-mono">
        Closed-form analytical easeOutExpo running outside NgZone for 120 FPS counting.
      </p>
    </div>
  \`
})
export class NumberTickerDemoComponent {}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'NumberTickerDemo.tsx',
				language: 'tsx',
				description: 'SolidJS Number Ticker KPI metrics card demonstration.',
				code: `import { NumberTicker } from './NumberTicker';

export function NumberTickerDemo() {
  return (
    <div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
      <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
        HARDWARE TELEMETRY
      </span>
      <div class="font-mono text-5xl font-black tracking-tight text-foreground">
        <NumberTicker
          value={${value}}
          initialValue={${initialValue}}
          duration={${duration}}
          decimalPlaces={${decimalPlaces}}
          prefix="${prefix}"
          suffix="${suffix}"
        />
      </div>
      <p class="text-xs text-muted-foreground mt-3 font-mono">
        Closed-form analytical easeOutExpo with direct DOM textContent manipulation.
      </p>
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'NumberTickerDemo.astro',
				language: 'astro',
				description: 'Astro Number Ticker KPI metrics card demonstration.',
				code: `---
import NumberTicker from './NumberTicker.astro';
---

<div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
  <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
    HARDWARE TELEMETRY
  </span>
  <div class="font-mono text-5xl font-black tracking-tight text-foreground">
    <NumberTicker
      value={${value}}
      initialValue={${initialValue}}
      duration={${duration}}
      decimalPlaces={${decimalPlaces}}
      prefix="${prefix}"
      suffix="${suffix}"
    />
  </div>
  <p class="text-xs text-muted-foreground mt-3 font-mono">
    Closed-form analytical easeOutExpo with zero client-side bundle weight.
  </p>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'number-ticker-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade Number Ticker KPI metrics card demonstration.',
				code: `<div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
  <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
    HARDWARE TELEMETRY
  </span>
  <div class="font-mono text-5xl font-black tracking-tight text-foreground">
    <x-number-ticker
      :value="${value}"
      :initial-value="${initialValue}"
      :duration="${duration}"
      :decimal-places="${decimalPlaces}"
      prefix="${prefix}"
      suffix="${suffix}"
    />
  </div>
  <p class="text-xs text-muted-foreground mt-3 font-mono">
    Closed-form analytical easeOutExpo with direct DOM textContent manipulation.
  </p>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML/JS Number Ticker KPI metrics card demonstration.',
				code: `<div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
  <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
    HARDWARE TELEMETRY
  </span>
  <div class="font-mono text-5xl font-black tracking-tight text-foreground">
    <span id="kpi-ticker"></span>
  </div>
  <p class="text-xs text-muted-foreground mt-3 font-mono">
    Closed-form analytical easeOutExpo with direct DOM textContent manipulation.
  </p>
</div>

<script type="module">
  import { initNumberTicker } from './number-ticker.js';

  initNumberTicker('#kpi-ticker', {
    value: ${value},
    initialValue: ${initialValue},
    duration: ${duration},
    decimalPlaces: ${decimalPlaces},
    prefix: '${prefix}',
    suffix: '${suffix}'
  });
</script>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'example-page.php',
				language: 'php',
				description: 'WordPress template Number Ticker demo.',
				code: `<?php
/**
 * Template Name: Number Ticker KPI Example
 */
get_header();
?>

<div class="entry-content max-w-sm mx-auto py-12 px-4">
  <!-- wp:exhuma/number-ticker {"value":${value},"initialValue":${initialValue},"duration":${duration},"decimalPlaces":${decimalPlaces},"prefix":"${prefix}","suffix":"${suffix}"} /-->
</div>

<?php get_footer(); ?>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Web Component <exhuma-number-ticker> demonstration.',
				code: `<script type="module" src="./exhuma-number-ticker.ts"></script>

<div class="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border/80 shadow-lg max-w-sm mx-auto">
  <span class="text-3xs font-mono font-bold text-primary uppercase tracking-wider mb-2">
    HARDWARE TELEMETRY
  </span>
  <div class="font-mono text-5xl font-black tracking-tight text-foreground">
    <exhuma-number-ticker
      value="${value}"
      initial-value="${initialValue}"
      duration="${duration}"
      decimal-places="${decimalPlaces}"
      prefix="${prefix}"
      suffix="${suffix}"
    ></exhuma-number-ticker>
  </div>
  <p class="text-xs text-muted-foreground mt-3 font-mono">
    Standard W3C Custom Element with direct DOM textContent manipulation.
  </p>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'NumberTickerDemo.tsx',
				language: 'tsx',
				description: 'React Native Number Ticker demonstration.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NumberTicker } from './NumberTicker';

export function NumberTickerDemo() {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>HARDWARE TELEMETRY</Text>
      <NumberTicker
        value={${value}}
        initialValue={${initialValue}}
        duration={${duration}}
        decimalPlaces={${decimalPlaces}}
        prefix="${prefix}"
        suffix="${suffix}"
        style={styles.number}
      />
      <Text style={styles.caption}>
        Closed-form analytical easeOutExpo for fluid mobile frame rates.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  eyebrow: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
  },
  number: {
    fontSize: 40,
    fontWeight: '900',
    color: '#111827',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'number_ticker_demo.dart',
				language: 'dart',
				description: 'Flutter Number Ticker demonstration.',
				code: `import 'package:flutter/material.dart';
import 'number_ticker.dart';

class NumberTickerDemoPage extends StatelessWidget {
  const NumberTickerDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.3)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'HARDWARE TELEMETRY',
              style: TextStyle(
                fontFamily: 'monospace',
                fontWeight: FontWeight.bold,
                fontSize: 11,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),
            ExhumaNumberTicker(
              value: ${toFlutterDouble(value)},
              initialValue: ${toFlutterDouble(initialValue)},
              duration: Duration(milliseconds: ${(duration * 1000).toFixed(0)}),
              decimalPlaces: ${decimalPlaces},
              prefix: '${prefix}',
              suffix: '${suffix}',
            ),
            const SizedBox(height: 12),
            const Text(
              'Closed-form analytical easeOutExpo with zero frame hitching.',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
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
				filename: 'NumberTicker.tsx',
				language: 'tsx',
				description: 'Number Ticker component.',
				code: '// Number Ticker component',
			};
	}
}
