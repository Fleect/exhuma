import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getBorderBeamOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const size = Number(props.size ?? 200);
	const duration = Number(props.duration ?? 8);
	const borderWidth = Number(props.borderWidth ?? 2);
	const colorFrom = String(props.colorFrom ?? '#ffaa40');
	const colorTo = String(props.colorTo ?? '#9c40ff');
	const doubleBeam = Boolean(props.doubleBeam ?? false);
	const endOpacity = Number(props.endOpacity ?? 0);
	const opacity = Number(props.opacity ?? 1);
	const blur = Number(props.blur ?? 0);
	const borderRadius = Number(props.borderRadius ?? 16);

	const defaultClass = 'exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]';

	const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
	const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : `color-mix(in srgb, ${colorTo} ${Math.round(clampedEndOpacity * 100)}%, transparent)`;
	const pathRadius = Math.min(size, 200);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			return [
				{
					filename: 'BorderBeam.tsx',
					language: 'tsx',
					description: 'Border Beam — Standalone Ejected Engine (Zero Dependencies). Zero-runtime GPU perimeter laser trace with hardware mask clipping.',
					code: `${header}import * as React from 'react';
import { clsx } from 'clsx';

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
}

/**
 * BorderBeam — Standalone Ejected Engine (Zero-Dependency)
 * Zero-runtime GPU perimeter laser trace with hardware mask clipping and sub-pixel compositing.
 */
export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      size = ${size},
      duration = ${duration},
      borderWidth = ${borderWidth},
      borderRadius = ${borderRadius},
      colorFrom = '${colorFrom}',
      colorTo = '${colorTo}',
      doubleBeam = ${doubleBeam},
      endOpacity = ${endOpacity},
      opacity = ${opacity},
      blur = ${blur},
      className,
      style,
      ...props
    },
    ref
  ) => {
    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;
    const pathRadius = Math.min(size, 200);

    return (
      <div
        ref={ref}
        key={\`\${duration}-\${doubleBeam}-\${borderRadius}\`}
        aria-hidden="true"
        className={clsx('${defaultClass}', className)}
        style={{
          border: \`\${borderWidth}px solid transparent\`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: opacity !== 1 ? opacity : undefined,
          filter: blur > 0 ? \`blur(\${blur}px)\` : undefined,
          ...style,
        }}
        {...props}
      >
        <div
          className="exhuma-border-beam-trace"
          style={{
            position: 'absolute',
            aspectRatio: '1 / 1',
            width: \`\${size}px\`,
            offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
            offsetAnchor: \`\${size / 2}px \${size / 2}px\`,
            background: \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`,
            animation: \`exhuma-border-beam \${duration}s linear infinite\`,
          }}
        />

        {doubleBeam && (
          <div
            className="exhuma-border-beam-trace"
            style={{
              position: 'absolute',
              aspectRatio: '1 / 1',
              width: \`\${size}px\`,
              offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
              offsetAnchor: \`\${size / 2}px \${size / 2}px\`,
              background: \`linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor})\`,
              animation: \`exhuma-border-beam \${duration}s linear -\${duration / 2}s infinite\`,
            }}
          />
        )}

        <style>{\`
          @keyframes exhuma-border-beam {
            from {
              offset-distance: 0%;
            }
            to {
              offset-distance: 100%;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .exhuma-border-beam-trace {
              animation-play-state: paused !important;
            }
          }
        \`}</style>
      </div>
    );
  }
);
BorderBeam.displayName = 'BorderBeam';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'BorderBeam.vue',
					language: 'vue',
					description: 'Vue 3 Native Border Beam component with hardware mask clipping and sub-pixel laser trace.',
					code: `<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: ${size},
  duration: ${duration},
  borderWidth: ${borderWidth},
  borderRadius: ${borderRadius},
  colorFrom: '${colorFrom}',
  colorTo: '${colorTo}',
  doubleBeam: ${doubleBeam},
  endOpacity: ${endOpacity},
  opacity: ${opacity},
  blur: ${blur},
  class: '',
});

const endColor = computed(() => {
  const clamped = Math.max(0, Math.min(1, props.endOpacity));
  if (clamped <= 0) return 'transparent';
  if (clamped >= 1) return props.colorTo;
  return \`color-mix(in srgb, \${props.colorTo} \${Math.round(clamped * 100)}%, transparent)\`;
});

const pathRadius = computed(() => Math.min(props.size, 200));
</script>

<template>
  <div
    aria-hidden="true"
    :class="['${defaultClass}', props.class]"
    :style="{
      border: \`\${props.borderWidth}px solid transparent\`,
      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'destination-out',
      mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      opacity: props.opacity !== 1 ? props.opacity : undefined,
      filter: props.blur > 0 ? \`blur(\${props.blur}px)\` : undefined,
    }"
  >
    <div
      class="exhuma-border-beam-trace"
      :style="{
        position: 'absolute',
        aspectRatio: '1 / 1',
        width: \`\${props.size}px\`,
        offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
        offsetAnchor: \`\${props.size / 2}px \${props.size / 2}px\`,
        background: \`linear-gradient(to left, \${props.colorFrom}, \${props.colorTo}, \${endColor})\`,
        animation: \`exhuma-border-beam \${props.duration}s linear infinite\`,
      }"
    />
    <div
      v-if="props.doubleBeam"
      class="exhuma-border-beam-trace"
      :style="{
        position: 'absolute',
        aspectRatio: '1 / 1',
        width: \`\${props.size}px\`,
        offsetPath: \`rect(0 auto auto 0 round \${pathRadius}px)\`,
        offsetAnchor: \`\${props.size / 2}px \${props.size / 2}px\`,
        background: \`linear-gradient(to left, \${props.colorFrom}, \${props.colorTo}, \${endColor})\`,
        animation: \`exhuma-border-beam \${props.duration}s linear -\${props.duration / 2}s infinite\`,
      }"
    />
  </div>
</template>

<style>
@keyframes exhuma-border-beam {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .exhuma-border-beam-trace {
    animation-play-state: paused !important;
  }
}
</style>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'BorderBeam.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Border Beam component with hardware mask clipping and sub-pixel laser trace.',
					code: `<script lang="ts">
  interface Props {
    size?: number;
    duration?: number;
    borderWidth?: number;
    borderRadius?: number;
    colorFrom?: string;
    colorTo?: string;
    doubleBeam?: boolean;
    endOpacity?: number;
    opacity?: number;
    blur?: number;
    class?: string;
    [key: string]: unknown;
  }

  let {
    size = ${size},
    duration = ${duration},
    borderWidth = ${borderWidth},
    borderRadius = ${borderRadius},
    colorFrom = '${colorFrom}',
    colorTo = '${colorTo}',
    doubleBeam = ${doubleBeam},
    endOpacity = ${endOpacity},
    opacity = ${opacity},
    blur = ${blur},
    class: className = '',
    ...restProps
  }: Props = $props();

  const clampedEndOpacity = $derived(Math.max(0, Math.min(1, endOpacity)));
  const endColor = $derived(
    clampedEndOpacity <= 0
      ? 'transparent'
      : clampedEndOpacity >= 1
        ? colorTo
        : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`
  );
  const pathRadius = $derived(Math.min(size, 200));
</script>

<div
  aria-hidden="true"
  class="${defaultClass} {className}"
  style="border: {borderWidth}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; {opacity !== 1 ? \`opacity: \${opacity};\` : ''} {blur > 0 ? \`filter: blur(\${blur}px);\` : ''}"
  {...restProps}
>
  <div
    class="exhuma-border-beam-trace"
    style="position: absolute; aspect-ratio: 1 / 1; width: {size}px; offset-path: rect(0 auto auto 0 round {pathRadius}px); offset-anchor: {size / 2}px {size / 2}px; background: linear-gradient(to left, {colorFrom}, {colorTo}, {endColor}); animation: exhuma-border-beam {duration}s linear infinite;"
  ></div>

  {#if doubleBeam}
    <div
      class="exhuma-border-beam-trace"
      style="position: absolute; aspect-ratio: 1 / 1; width: {size}px; offset-path: rect(0 auto auto 0 round {pathRadius}px); offset-anchor: {size / 2}px {size / 2}px; background: linear-gradient(to left, {colorFrom}, {colorTo}, {endColor}); animation: exhuma-border-beam {duration}s linear -{duration / 2}s infinite;"
    ></div>
  {/if}
</div>

<style>
  @keyframes exhuma-border-beam {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .exhuma-border-beam-trace {
      animation-play-state: paused !important;
    }
  }
</style>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'BorderBeam.tsx',
					language: 'tsx',
					description: 'SolidJS Native Border Beam component with hardware mask clipping and sub-pixel laser trace.',
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface BorderBeamProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
}

export const BorderBeam: Component<BorderBeamProps> = (props) => {
  const [local, others] = splitProps(props, [
    'size',
    'duration',
    'borderWidth',
    'borderRadius',
    'colorFrom',
    'colorTo',
    'doubleBeam',
    'endOpacity',
    'opacity',
    'blur',
    'class',
  ]);

  const size = () => local.size ?? ${size};
  const duration = () => local.duration ?? ${duration};
  const borderWidth = () => local.borderWidth ?? ${borderWidth};
  const borderRadius = () => local.borderRadius ?? ${borderRadius};
  const colorFrom = () => local.colorFrom ?? '${colorFrom}';
  const colorTo = () => local.colorTo ?? '${colorTo}';
  const doubleBeam = () => local.doubleBeam ?? ${doubleBeam};
  const endOpacity = () => local.endOpacity ?? ${endOpacity};
  const opacity = () => local.opacity ?? ${opacity};
  const blur = () => local.blur ?? ${blur};

  const endColor = () => {
    const clamped = Math.max(0, Math.min(1, endOpacity()));
    if (clamped <= 0) return 'transparent';
    if (clamped >= 1) return colorTo();
    return \`color-mix(in srgb, \${colorTo()} \${Math.round(clamped * 100)}%, transparent)\`;
  };

  const pathRadius = () => Math.min(local.size, 200);

  return (
    <div
      aria-hidden="true"
      class={\`${defaultClass} \${local.class ?? ''}\`}
      style={{
        border: \`\${borderWidth()}px solid transparent\`,
        '-webkit-mask': 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        '-webkit-mask-composite': 'destination-out',
        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        'mask-composite': 'exclude',
        opacity: opacity() !== 1 ? opacity() : undefined,
        filter: blur() > 0 ? \`blur(\${blur()}px)\` : undefined,
      }}
      {...others}
    >
      <div
        class="exhuma-border-beam-trace"
        style={{
          position: 'absolute',
          'aspect-ratio': '1 / 1',
          width: \`\${size()}px\`,
          'offset-path': \`rect(0 auto auto 0 round \${pathRadius()}px)\`,
          'offset-anchor': \`\${size() / 2}px \${size() / 2}px\`,
          background: \`linear-gradient(to left, \${colorFrom()}, \${colorTo()}, \${endColor()})\`,
          animation: \`exhuma-border-beam \${duration()}s linear infinite\`,
        }}
      />

      {doubleBeam() && (
        <div
          class="exhuma-border-beam-trace"
          style={{
            position: 'absolute',
            'aspect-ratio': '1 / 1',
            width: \`\${size()}px\`,
            'offset-path': \`rect(0 auto auto 0 round \${pathRadius()}px)\`,
            'offset-anchor': \`\${size() / 2}px \${size() / 2}px\`,
            background: \`linear-gradient(to left, \${colorFrom()}, \${colorTo()}, \${endColor()})\`,
            animation: \`exhuma-border-beam \${duration()}s linear -\${duration() / 2}s infinite\`,
          }}
        />
      )}

      <style>{\`
        @keyframes exhuma-border-beam {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .exhuma-border-beam-trace { animation-play-state: paused !important; }
        }
      \`}</style>
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
					filename: 'border-beam.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Border Beam component with perimeter laser trace.',
					code: `import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'exhuma-border-beam',
  standalone: true,
  template: \`
    <div
      aria-hidden="true"
      class="${defaultClass} {{ customClass() }}"
      [style.border]="borderWidth() + 'px solid transparent'"
      [style.-webkit-mask]="'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)'"
      [style.-webkit-mask-composite]="'destination-out'"
      [style.mask]="'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)'"
      [style.maskComposite]="'exclude'"
      [style.opacity]="opacity() !== 1 ? opacity() : null"
      [style.filter]="blur() > 0 ? 'blur(' + blur() + 'px)' : null"
    >
      <div
        class="exhuma-border-beam-trace"
        [style.width.px]="size()"
        [style.offset-path]="'rect(0 auto auto 0 round ' + pathRadius() + 'px)'"
        [style.offset-anchor]="(size() / 2) + 'px ' + (size() / 2) + 'px'"
        [style.background]="'linear-gradient(to left, ' + colorFrom() + ', ' + colorTo() + ', ' + endColor() + ')'"
        [style.animation]="'exhuma-border-beam ' + duration() + 's linear infinite'"
      ></div>

      @if (doubleBeam()) {
        <div
          class="exhuma-border-beam-trace"
          [style.width.px]="size()"
          [style.offset-path]="'rect(0 auto auto 0 round ' + pathRadius() + 'px)'"
          [style.offset-anchor]="(size() / 2) + 'px ' + (size() / 2) + 'px'"
          [style.background]="'linear-gradient(to left, ' + colorFrom() + ', ' + colorTo() + ', ' + endColor() + ')'"
          [style.animation]="'exhuma-border-beam ' + duration() + 's linear -' + (duration() / 2) + 's infinite'"
        ></div>
      }
    </div>
  \`,
  styles: [\`
    :host { display: contents; }
    .exhuma-border-beam-trace {
      position: absolute;
      aspect-ratio: 1 / 1;
    }
    @keyframes exhuma-border-beam {
      from { offset-distance: 0%; }
      to { offset-distance: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .exhuma-border-beam-trace { animation-play-state: paused !important; }
    }
  \`],
})
export class ExhumaBorderBeamComponent {
  readonly customClass = input<string>('');
  readonly size = input<number>(${size});
  readonly duration = input<number>(${duration});
  readonly borderWidth = input<number>(${borderWidth});
  readonly borderRadius = input<number>(${borderRadius});
  readonly colorFrom = input<string>('${colorFrom}');
  readonly colorTo = input<string>('${colorTo}');
  readonly doubleBeam = input<boolean>(${doubleBeam});
  readonly endOpacity = input<number>(${endOpacity});
  readonly opacity = input<number>(${opacity});
  readonly blur = input<number>(${blur});

  readonly endColor = computed(() => {
    const clamped = Math.max(0, Math.min(1, this.endOpacity()));
    if (clamped <= 0) return 'transparent';
    if (clamped >= 1) return this.colorTo();
    return \`color-mix(in srgb, \${this.colorTo()} \${Math.round(clamped * 100)}%, transparent)\`;
  });

  readonly pathRadius = computed(() => Math.min(this.size(), 200));
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'BorderBeam.astro',
					language: 'astro',
					description: 'Pure Native Astro Border Beam component with perimeter laser trace.',
					code: `---
interface Props {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  endOpacity?: number;
  opacity?: number;
  blur?: number;
  class?: string;
  [key: string]: unknown;
}

const {
  size = ${size},
  duration = ${duration},
  borderWidth = ${borderWidth},
  borderRadius = ${borderRadius},
  colorFrom = '${colorFrom}',
  colorTo = '${colorTo}',
  doubleBeam = ${doubleBeam},
  endOpacity = ${endOpacity},
  opacity = ${opacity},
  blur = ${blur},
  class: className = '',
  ...props
} = Astro.props;

const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : \`color-mix(in srgb, \${colorTo} \${Math.round(clampedEndOpacity * 100)}%, transparent)\`;
const pathRadius = Math.min(size, 200);
---

<div
  aria-hidden="true"
  class={\`${defaultClass} \${className}\`}
  style={\`border: \${borderWidth}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; \${opacity !== 1 ? \`opacity: \${opacity};\` : ''} \${blur > 0 ? \`filter: blur(\${blur}px);\` : ''}\`}
  {...props}
>
  <div
    class="exhuma-border-beam-trace"
    style={\`position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${size / 2}px \${size / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear infinite;\`}
  />

  {doubleBeam && (
    <div
      class="exhuma-border-beam-trace"
      style={\`position: absolute; aspect-ratio: 1 / 1; width: \${size}px; offset-path: rect(0 auto auto 0 round \${pathRadius}px); offset-anchor: \${size / 2}px \${size / 2}px; background: linear-gradient(to left, \${colorFrom}, \${colorTo}, \${endColor}); animation: exhuma-border-beam \${duration}s linear -\${duration / 2}s infinite;\`}
    />
  )}
</div>

<style>
  @keyframes exhuma-border-beam {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .exhuma-border-beam-trace {
      animation-play-state: paused !important;
    }
  }
</style>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-border-beam.js',
					language: 'javascript',
					description: 'Autonomous Web Component <exhuma-border-beam> with hardware mask clipping and sub-pixel laser trace.',
					code: `class ExhumaBorderBeamElement extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-border-beam');
    this.style.pointerEvents = 'none';
    this.style.position = 'absolute';
    this.style.inset = '0';
    this.style.borderRadius = 'inherit';

    const size = this.getAttribute('size') || '${size}';
    const duration = this.getAttribute('duration') || '${duration}';
    const borderWidth = this.getAttribute('border-width') || '${borderWidth}';
    const borderRadius = parseFloat(this.getAttribute('border-radius') || '${borderRadius}');
    const colorFrom = this.getAttribute('color-from') || '${colorFrom}';
    const colorTo = this.getAttribute('color-to') || '${colorTo}';
    const doubleBeam = this.getAttribute('double-beam') === 'true' || ${doubleBeam};
    const endOpacity = parseFloat(this.getAttribute('end-opacity') || '${endOpacity}');
    const opacity = parseFloat(this.getAttribute('opacity') || '${opacity}');
    const blur = parseFloat(this.getAttribute('blur') || '${blur}');

    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : 'color-mix(in srgb, ' + colorTo + ' ' + Math.round(clampedEndOpacity * 100) + '%, transparent)';
    const sizeNum = parseFloat(size);
    const pathRadius = Math.min(sizeNum, 200);

    this.style.border = borderWidth + 'px solid transparent';
    this.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    this.style.webkitMaskComposite = 'destination-out';
    this.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    this.style.maskComposite = 'exclude';
    if (opacity !== 1) this.style.opacity = opacity.toString();
    if (blur > 0) this.style.filter = 'blur(' + blur + 'px)';

    if (!document.getElementById('exhuma-border-beam-keyframes')) {
      const style = document.createElement('style');
      style.id = 'exhuma-border-beam-keyframes';
      style.textContent = \`
        @keyframes exhuma-border-beam {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .exhuma-border-beam-trace { animation-play-state: paused !important; }
        }
      \`;
      document.head.appendChild(style);
    }

    const beam1 = document.createElement('div');
    beam1.className = 'exhuma-border-beam-trace';
    beam1.style.cssText = 'position: absolute; aspect-ratio: 1 / 1; width: ' + size + 'px; offset-path: rect(0 auto auto 0 round ' + pathRadius + 'px); offset-anchor: ' + (sizeNum / 2) + 'px ' + (sizeNum / 2) + 'px; background: linear-gradient(to left, ' + colorFrom + ', ' + colorTo + ', ' + endColor + '); animation: exhuma-border-beam ' + duration + 's linear infinite;';
    this.appendChild(beam1);

    if (doubleBeam) {
      const beam2 = document.createElement('div');
      beam2.className = 'exhuma-border-beam-trace';
      beam2.style.cssText = 'position: absolute; aspect-ratio: 1 / 1; width: ' + size + 'px; offset-path: rect(0 auto auto 0 round ' + pathRadius + 'px); offset-anchor: ' + (sizeNum / 2) + 'px ' + (sizeNum / 2) + 'px; background: linear-gradient(to left, ' + colorFrom + ', ' + colorTo + ', ' + endColor + '); animation: exhuma-border-beam ' + duration + 's linear -' + (parseFloat(duration) / 2) + 's infinite;';
      this.appendChild(beam2);
    }
  }
}

if (!customElements.get('exhuma-border-beam')) {
  customElements.define('exhuma-border-beam', ExhumaBorderBeamElement);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'border-beam.vanilla.js',
					language: 'javascript',
					description: 'Autonomous Vanilla JS Border Beam initialization module.',
					code: `export function initBorderBeam(selector = '[data-exhuma-border-beam]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const cleanups = [];

  if (!document.getElementById('exhuma-border-beam-keyframes')) {
    const style = document.createElement('style');
    style.id = 'exhuma-border-beam-keyframes';
    style.textContent = \`
      @keyframes exhuma-border-beam {
        from { offset-distance: 0%; }
        to { offset-distance: 100%; }
      }
      @media (prefers-reduced-motion: reduce) {
        .exhuma-border-beam-trace { animation-play-state: paused !important; }
      }
    \`;
    document.head.appendChild(style);
  }

  elements.forEach((container) => {
    const size = parseFloat(container.getAttribute('data-size') || options.size || ${size});
    const duration = parseFloat(container.getAttribute('data-duration') || options.duration || ${duration});
    const borderWidth = parseFloat(container.getAttribute('data-border-width') || options.borderWidth || ${borderWidth});
    const borderRadius = parseFloat(container.getAttribute('data-border-radius') || options.borderRadius || ${borderRadius});
    const colorFrom = container.getAttribute('data-color-from') || options.colorFrom || '${colorFrom}';
    const colorTo = container.getAttribute('data-color-to') || options.colorTo || '${colorTo}';
    const doubleBeam = (container.getAttribute('data-double-beam') || options.doubleBeam) === 'true' || options.doubleBeam === true || ${doubleBeam};
    const endOpacity = parseFloat(container.getAttribute('data-end-opacity') || options.endOpacity || ${endOpacity});
    const opacity = parseFloat(container.getAttribute('data-opacity') || options.opacity || ${opacity});
    const blur = parseFloat(container.getAttribute('data-blur') || options.blur || ${blur});

    const clampedEndOpacity = Math.max(0, Math.min(1, endOpacity));
    const endColor = clampedEndOpacity <= 0 ? 'transparent' : clampedEndOpacity >= 1 ? colorTo : 'color-mix(in srgb, ' + colorTo + ' ' + Math.round(clampedEndOpacity * 100) + '%, transparent)';
    const pathRadius = Math.min(size, 200);

    container.className = 'exhuma-border-beam';
    container.style.pointerEvents = 'none';
    container.style.position = 'absolute';
    container.style.inset = '0';
    container.style.borderRadius = 'inherit';
    container.style.border = borderWidth + 'px solid transparent';
    container.style.webkitMask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    container.style.webkitMaskComposite = 'destination-out';
    container.style.mask = 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)';
    container.style.maskComposite = 'exclude';
    if (opacity !== 1) container.style.opacity = opacity.toString();
    if (blur > 0) container.style.filter = 'blur(' + blur + 'px)';

    const beam1 = document.createElement('div');
    beam1.className = 'exhuma-border-beam-trace';
    beam1.style.position = 'absolute';
    beam1.style.aspectRatio = '1 / 1';
    beam1.style.width = size + 'px';
    beam1.style.offsetPath = 'rect(0 auto auto 0 round ' + pathRadius + 'px)';
    beam1.style.offsetAnchor = (size / 2) + 'px ' + (size / 2) + 'px';
    beam1.style.background = 'linear-gradient(to left, ' + colorFrom + ', ' + colorTo + ', ' + endColor + ')';
    beam1.style.animation = 'exhuma-border-beam ' + duration + 's linear infinite';
    container.appendChild(beam1);

    if (doubleBeam) {
      const beam2 = document.createElement('div');
      beam2.className = 'exhuma-border-beam-trace';
      beam2.style.position = 'absolute';
      beam2.style.aspectRatio = '1 / 1';
      beam2.style.width = size + 'px';
      beam2.style.offsetPath = 'rect(0 auto auto 0 round ' + pathRadius + 'px)';
      beam2.style.offsetAnchor = (size / 2) + 'px ' + (size / 2) + 'px';
      beam2.style.background = 'linear-gradient(to left, ' + colorFrom + ', ' + colorTo + ', ' + endColor + ')';
      beam2.style.animation = 'exhuma-border-beam ' + duration + 's linear -' + (duration / 2) + 's infinite';
      container.appendChild(beam2);
    }

    cleanups.push(() => {
      container.innerHTML = '';
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
					filename: 'border-beam.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Border Beam with hardware mask clipping.',
					code: `@props([
    'size' => ${size},
    'duration' => ${duration},
    'borderWidth' => ${borderWidth},
    'borderRadius' => ${borderRadius},
    'colorFrom' => '${colorFrom}',
    'colorTo' => '${colorTo}',
    'doubleBeam' => ${doubleBeam ? 'true' : 'false'},
    'endOpacity' => ${endOpacity},
    'opacity' => ${opacity},
    'blur' => ${blur},
    'class' => '',
])

@php
    $clampedEndOpacity = max(0, min(1, (float)$endOpacity));
    $endColor = $clampedEndOpacity <= 0 ? 'transparent' : ($clampedEndOpacity >= 1 ? $colorTo : "color-mix(in srgb, {$colorTo} " . round($clampedEndOpacity * 100) . "%, transparent)");
    $pathRadius = min((int)$size, 200);
@endphp

<div
    aria-hidden="true"
    {{ $attributes->merge(['class' => '${defaultClass} ' . $class]) }}
    style="border: {{ $borderWidth }}px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; {{ $opacity != 1 ? 'opacity: ' . $opacity . ';' : '' }} {{ $blur > 0 ? 'filter: blur(' . $blur . 'px);' : '' }}"
>
    <div
        class="exhuma-border-beam-trace"
        style="position: absolute; aspect-ratio: 1 / 1; width: {{ $size }}px; offset-path: rect(0 auto auto 0 round {{ $pathRadius }}px); offset-anchor: {{ $size / 2 }}px {{ $size / 2 }}px; background: linear-gradient(to left, {{ $colorFrom }}, {{ $colorTo }}, {{ $endColor }}); animation: exhuma-border-beam {{ $duration }}s linear infinite;"
    ></div>

    @if ($doubleBeam)
        <div
            class="exhuma-border-beam-trace"
            style="position: absolute; aspect-ratio: 1 / 1; width: {{ $size }}px; offset-path: rect(0 auto auto 0 round {{ $pathRadius }}px); offset-anchor: {{ $size / 2 }}px {{ $size / 2 }}px; background: linear-gradient(to left, {{ $colorFrom }}, {{ $colorTo }}, {{ $endColor }}); animation: exhuma-border-beam {{ $duration }}s linear -{{ $duration / 2 }}s infinite;"
        ></div>
    @endif

    <style>
        @keyframes exhuma-border-beam {
            from { offset-distance: 0%; }
            to { offset-distance: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
            .exhuma-border-beam-trace { animation-play-state: paused !important; }
        }
    </style>
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
					description: 'WordPress Block API v3 definition for Border Beam.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/border-beam',
							version: '1.0.0',
							title: 'Exhuma Border Beam',
							category: 'widgets',
							icon: 'art',
							description: 'Perimeter laser trace with hardware mask clipping and sub-pixel compositing.',
							attributes: {
								size: { type: 'number', default: size },
								duration: { type: 'number', default: duration },
								borderWidth: { type: 'number', default: borderWidth },
								borderRadius: { type: 'number', default: borderRadius },
								colorFrom: { type: 'string', default: colorFrom },
								colorTo: { type: 'string', default: colorTo },
								doubleBeam: { type: 'boolean', default: doubleBeam },
								endOpacity: { type: 'number', default: endOpacity },
								opacity: { type: 'number', default: opacity },
								blur: { type: 'number', default: blur },
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
					description: 'WordPress render template for Border Beam with hardware exclusion mask.',
					code: `<?php
/**
 * Exhuma Border Beam Block Render Template
 */
$size = isset($attributes['size']) ? (float)$attributes['size'] : ${size};
$duration = isset($attributes['duration']) ? (float)$attributes['duration'] : ${duration};
$borderWidth = isset($attributes['borderWidth']) ? (float)$attributes['borderWidth'] : ${borderWidth};
$borderRadius = isset($attributes['borderRadius']) ? (float)$attributes['borderRadius'] : ${borderRadius};
$colorFrom = isset($attributes['colorFrom']) ? sanitize_text_field($attributes['colorFrom']) : '${colorFrom}';
$colorTo = isset($attributes['colorTo']) ? sanitize_text_field($attributes['colorTo']) : '${colorTo}';
$doubleBeam = !empty($attributes['doubleBeam']);
$endOpacity = isset($attributes['endOpacity']) ? (float)$attributes['endOpacity'] : ${endOpacity};
$opacity = isset($attributes['opacity']) ? (float)$attributes['opacity'] : ${opacity};
$blur = isset($attributes['blur']) ? (float)$attributes['blur'] : ${blur};

$clampedEndOpacity = max(0, min(1, $endOpacity));
$endColor = $clampedEndOpacity <= 0 ? 'transparent' : ($clampedEndOpacity >= 1 ? $colorTo : "color-mix(in srgb, {$colorTo} " . round($clampedEndOpacity * 100) . "%, transparent)");
$pathRadius = min((int)$size, 200);
?>
<div
  class="exhuma-border-beam pointer-events-none absolute inset-0 rounded-[inherit]"
  style="border: <?php echo esc_attr($borderWidth); ?>px solid transparent; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; <?php echo ($opacity !== 1) ? 'opacity: ' . esc_attr($opacity) . ';' : ''; ?> <?php echo ($blur > 0) ? 'filter: blur(' . esc_attr($blur) . 'px);' : ''; ?>"
>
  <div
    class="exhuma-border-beam-trace"
    style="position: absolute; aspect-ratio: 1 / 1; width: <?php echo esc_attr($size); ?>px; offset-path: rect(0 auto auto 0 round <?php echo esc_attr($pathRadius); ?>px); offset-anchor: <?php echo esc_attr($size / 2); ?>px <?php echo esc_attr($size / 2); ?>px; background: linear-gradient(to left, <?php echo esc_attr($colorFrom); ?>, <?php echo esc_attr($colorTo); ?>, <?php echo esc_attr($endColor); ?>); animation: exhuma-border-beam <?php echo esc_attr($duration); ?>s linear infinite;"
  ></div>

  <?php if ($doubleBeam): ?>
    <div
      class="exhuma-border-beam-trace"
      style="position: absolute; aspect-ratio: 1 / 1; width: <?php echo esc_attr($size); ?>px; offset-path: rect(0 auto auto 0 round <?php echo esc_attr($pathRadius); ?>px); offset-anchor: <?php echo esc_attr($size / 2); ?>px <?php echo esc_attr($size / 2); ?>px; background: linear-gradient(to left, <?php echo esc_attr($colorFrom); ?>, <?php echo esc_attr($colorTo); ?>, <?php echo esc_attr($endColor); ?>); animation: exhuma-border-beam <?php echo esc_attr($duration); ?>s linear -<?php echo esc_attr($duration / 2); ?>s infinite;"
    ></div>
  <?php endif; ?>

  <style>
    @keyframes exhuma-border-beam {
      from { offset-distance: 0%; }
      to { offset-distance: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .exhuma-border-beam-trace { animation-play-state: paused !important; }
    }
  </style>
</div>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'BorderBeam.tsx',
					language: 'tsx',
					description: 'React Native Border Beam perimeter laser trace component.',
					code: `import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, type ViewProps } from 'react-native';

export interface BorderBeamProps extends ViewProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  colorFrom?: string;
  colorTo?: string;
  doubleBeam?: boolean;
  opacity?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = ${size},
  duration = ${duration},
  borderWidth = ${borderWidth},
  borderRadius = ${borderRadius},
  colorFrom = '${colorFrom}',
  colorTo = '${colorTo}',
  doubleBeam = ${doubleBeam},
  opacity = ${opacity},
  style,
  ...props
}) => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.timing(anim1, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop1.start();

    let loop2: Animated.CompositeAnimation | null = null;
    if (doubleBeam) {
      loop2 = Animated.loop(
        Animated.timing(anim2, {
          toValue: 1.5,
          duration: duration * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop2.start();
    }

    return () => {
      loop1.stop();
      if (loop2) loop2.stop();
    };
  }, [duration, doubleBeam, anim1, anim2]);

  const rotate1 = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotate2 = anim2.interpolate({
    inputRange: [0.5, 1.5],
    outputRange: ['180deg', '540deg'],
  });

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          borderWidth,
          borderRadius,
          opacity: opacity !== 1 ? opacity : 1,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          styles.beam,
          {
            width: size,
            height: size,
            backgroundColor: colorFrom,
            transform: [{ rotate: rotate1 }],
          },
        ]}
      />
      {doubleBeam && (
        <Animated.View
          style={[
            styles.beam,
            {
              width: size,
              height: size,
              backgroundColor: colorTo,
              transform: [{ rotate: rotate2 }],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  beam: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -${size / 2},
    marginLeft: -${size / 2},
    borderRadius: 9999,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'border_beam.dart',
					language: 'dart',
					description: 'Flutter Border Beam perimeter laser trace widget.',
					code: `import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExhumaBorderBeam extends StatefulWidget {
  final double size;
  final double duration;
  final double borderWidth;
  final double borderRadius;
  final Color colorFrom;
  final Color colorTo;
  final bool doubleBeam;
  final double opacity;

  const ExhumaBorderBeam({
    super.key,
    this.size = ${size}.0,
    this.duration = ${duration}.0,
    this.borderWidth = ${borderWidth},
    this.borderRadius = ${borderRadius}.0,
    this.colorFrom = const Color(0xFFFFAA40),
    this.colorTo = const Color(0xFF9C40FF),
    this.doubleBeam = ${doubleBeam},
    this.opacity = ${opacity},
  });

  @override
  State<ExhumaBorderBeam> createState() => _ExhumaBorderBeamState();
}

class _ExhumaBorderBeamState extends State<ExhumaBorderBeam>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: widget.duration.toInt()),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: widget.opacity.clamp(0.0, 1.0),
          child: CustomPaint(
            painter: _BorderBeamPainter(
              progress: _controller.value,
              borderWidth: widget.borderWidth,
              borderRadius: widget.borderRadius,
              colorFrom: widget.colorFrom,
              colorTo: widget.colorTo,
              doubleBeam: widget.doubleBeam,
            ),
          ),
        );
      },
    );
  }
}

class _BorderBeamPainter extends CustomPainter {
  final double progress;
  final double borderWidth;
  final double borderRadius;
  final Color colorFrom;
  final Color colorTo;
  final bool doubleBeam;

  _BorderBeamPainter({
    required this.progress,
    required this.borderWidth,
    required this.borderRadius,
    required this.colorFrom,
    required this.colorTo,
    required this.doubleBeam,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rrect = RRect.fromRectAndRadius(rect, Radius.circular(borderRadius));

    void drawBeam(double p, Color startCol, Color endCol) {
      final angle = p * 2 * math.pi;
      final paint = Paint()
        ..shader = SweepGradient(
          startAngle: 0.0,
          endAngle: math.pi / 2,
          colors: [startCol, endCol, Colors.transparent],
          stops: const [0.0, 0.5, 1.0],
          transform: GradientRotation(angle),
        ).createShader(rect)
        ..style = PaintingStyle.stroke
        ..strokeWidth = borderWidth;

      canvas.drawRRect(rrect, paint);
    }

    drawBeam(progress, colorFrom, colorTo);
    if (doubleBeam) {
      drawBeam((progress + 0.5) % 1.0, colorTo, colorFrom);
    }
  }

  @override
  bool shouldRepaint(_BorderBeamPainter oldDelegate) =>
      oldDelegate.progress != progress ||
      oldDelegate.borderWidth != borderWidth ||
      oldDelegate.borderRadius != borderRadius ||
      oldDelegate.doubleBeam != doubleBeam;
}
`,
				},
			];
		}

		default:
			return null;
	}
}
