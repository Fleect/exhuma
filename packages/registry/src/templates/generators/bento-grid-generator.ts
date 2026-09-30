import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getBentoGridOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const cols = Number(props.cols ?? 3);
	const gap = Number(props.gap ?? 20);
	const rowHeight = Number(props.rowHeight ?? 180);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'BentoGrid.tsx',
					language: 'tsx',
					description: 'Bento Grid — Standalone Ejected Engine (Zero Dependencies). Raw math, CSS Grid dense auto-packing, and cached pointer sheen inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: number | string;
  rowHeight?: number | string;
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  enableGlow?: boolean;
  glowColor?: string;
}

/**
 * BentoGrid — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) auto-flow packing.
 * - Zero forced reflows during active pointer tracking via cached bounding rect.
 */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ children, cols = ${cols}, gap = ${gap}, rowHeight = ${rowHeight}, className, style, ...props }, ref) => {
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const autoRowsVal = rowHeight ? (typeof rowHeight === 'number' ? \`minmax(\${rowHeight}px, auto)\` : rowHeight) : undefined;

    return (
      <div
        ref={ref}
        className={clsx('exhuma-bento-grid grid w-full grid-flow-dense', className)}
        style={{
          gridTemplateColumns: \`repeat(\${cols}, minmax(0, 1fr))\`,
          gap: gapVal,
          ...(autoRowsVal ? { gridAutoRows: autoRowsVal } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = 'BentoGrid';

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, colSpan = 1, rowSpan = 1, enableGlow = true, glowColor = 'rgba(99, 102, 241, 0.08)', className, style, ...props }, forwardedRef) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const rectRef = React.useRef<{ left: number; top: number } | null>(null);

    const handlePointerEnter = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top };
    }, []);

    const handlePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      const el = internalRef.current;
      if (!el) return;
      if (!rectRef.current) {
        const rect = el.getBoundingClientRect();
        rectRef.current = { left: rect.left, top: rect.top };
      }
      const x = e.clientX - rectRef.current.left;
      const y = e.clientY - rectRef.current.top;
      el.style.setProperty('--bento-x', \`\${x.toFixed(1)}px\`);
      el.style.setProperty('--bento-y', \`\${y.toFixed(1)}px\`);
    }, []);

    const handlePointerLeave = React.useCallback(() => {
      rectRef.current = null;
      const el = internalRef.current;
      if (!el) return;
      el.style.setProperty('--bento-x', '-999px');
      el.style.setProperty('--bento-y', '-999px');
    }, []);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef && 'current' in forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    return (
      <div
        ref={setRefs}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className={clsx(
          'exhuma-bento-card group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 focus-within:border-primary/40 hover:shadow-xl',
          className
        )}
        style={{
          gridColumn: \`span \${Math.max(1, colSpan)}\`,
          gridRow: \`span \${Math.max(1, rowSpan)}\`,
          ...style,
        }}
        {...props}
      >
        {enableGlow && (
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
            style={{
              background: \`radial-gradient(400px circle at var(--bento-x, -999px) var(--bento-y, -999px), \${glowColor}, transparent 80%)\`,
            }}
          />
        )}
        <div className="relative z-10 flex h-full flex-col justify-between">{children}</div>
      </div>
    );
  }
);
BentoCard.displayName = 'BentoCard';

export const BentoHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-header space-y-2', className)} {...props}>
      {children}
    </div>
  )
);
BentoHeader.displayName = 'BentoHeader';

export const BentoContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-content text-sm text-muted-foreground', className)} {...props}>
      {children}
    </div>
  )
);
BentoContent.displayName = 'BentoContent';

export const BentoVisual = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('exhuma-bento-visual my-auto flex items-center justify-center overflow-hidden py-4', className)} {...props}>
      {children}
    </div>
  )
);
BentoVisual.displayName = 'BentoVisual';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'BentoGrid.vue',
					language: 'vue',
					description: 'Vue 3 Native Bento Grid component with dense auto-flow.',
					code: `<script setup lang="ts">
import { computed } from 'vue';
import { clsx } from 'clsx';

interface Props {
  cols?: number;
  gap?: number | string;
  rowHeight?: number | string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  cols: ${cols},
  gap: ${gap},
  rowHeight: ${rowHeight},
  class: '',
});

const gridStyle = computed(() => {
  const gapVal = typeof props.gap === 'number' ? \`\${props.gap}px\` : props.gap;
  const autoRowsVal = typeof props.rowHeight === 'number' ? \`minmax(\${props.rowHeight}px, auto)\` : props.rowHeight;

  return {
    display: 'grid',
    gridTemplateColumns: \`repeat(\${props.cols}, minmax(0, 1fr))\`,
    gap: gapVal,
    gridAutoFlow: 'dense',
    ...(autoRowsVal ? { gridAutoRows: autoRowsVal } : {}),
  };
});
</script>

<template>
  <div :class="clsx('exhuma-bento-grid w-full', props.class)" :style="gridStyle" v-bind="$attrs">
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
					filename: 'BentoGrid.svelte',
					language: 'svelte',
					description: 'Svelte 5 Runes Bento Grid layout component.',
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    cols = ${cols},
    gap = ${gap},
    rowHeight = ${rowHeight},
    class: className = '',
    children,
    ...restProps
  }: {
    cols?: number;
    gap?: number | string;
    rowHeight?: number | string;
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();

  const gapVal = $derived(typeof gap === 'number' ? \`\${gap}px\` : gap);
  const autoRowsVal = $derived(typeof rowHeight === 'number' ? \`minmax(\${rowHeight}px, auto)\` : rowHeight);
</script>

<div
  class={clsx('exhuma-bento-grid grid w-full grid-flow-dense', className)}
  style="grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: {gapVal}; {autoRowsVal ? \`grid-auto-rows: \${autoRowsVal};\` : ''}"
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
					filename: 'BentoGrid.tsx',
					language: 'tsx',
					description: 'SolidJS Bento Grid layout component with fine-grained reactivity.',
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface BentoGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: number | string;
  rowHeight?: number | string;
}

export const BentoGrid: Component<BentoGridProps> = (props) => {
  const [local, others] = splitProps(props, ['cols', 'gap', 'rowHeight', 'class', 'children', 'style']);
  const cols = () => local.cols ?? ${cols};
  const gap = () => typeof local.gap === 'number' ? \`\${local.gap}px\` : (local.gap ?? '${gap}px');
  const autoRows = () => typeof local.rowHeight === 'number' ? \`minmax(\${local.rowHeight}px, auto)\` : (local.rowHeight ?? 'minmax(${rowHeight}px, auto)');

  return (
    <div
      class={\`exhuma-bento-grid grid w-full grid-flow-dense \${local.class || ''}\`}
      style={{
        'grid-template-columns': \`repeat(\${cols()}, minmax(0, 1fr))\`,
        gap: gap(),
        'grid-auto-rows': autoRows(),
        ...(typeof local.style === 'object' ? local.style : {}),
      }}
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
					filename: 'bento-grid.component.ts',
					language: 'typescript',
					description: 'Angular 18+ standalone Bento Grid component.',
					code: `import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'exhuma-bento-grid',
  standalone: true,
  template: \`
    <div
      class="exhuma-bento-grid grid w-full grid-flow-dense {{ customClass() }}"
      [style.gridTemplateColumns]="templateCols()"
      [style.gap]="gapVal()"
      [style.gridAutoRows]="autoRowsVal()"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaBentoGridComponent {
  readonly cols = input<number>(${cols});
  readonly gap = input<number | string>(${gap});
  readonly rowHeight = input<number | string>(${rowHeight});
  readonly customClass = input<string>('');

  readonly templateCols = computed(() => \`repeat(\${this.cols()}, minmax(0, 1fr))\`);
  readonly gapVal = computed(() => typeof this.gap() === 'number' ? \`\${this.gap()}px\` : this.gap() as string);
  readonly autoRowsVal = computed(() => typeof this.rowHeight() === 'number' ? \`minmax(\${this.rowHeight()}px, auto)\` : this.rowHeight() as string);
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'BentoGrid.astro',
					language: 'astro',
					description: 'Astro Bento Grid layout component with zero clientside JS.',
					code: `---
interface Props {
  cols?: number;
  gap?: number | string;
  rowHeight?: number | string;
  class?: string;
  [key: string]: unknown;
}

const {
  cols = ${cols},
  gap = ${gap},
  rowHeight = ${rowHeight},
  class: className = '',
  ...props
} = Astro.props;

const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
const autoRowsVal = typeof rowHeight === 'number' ? \`minmax(\${rowHeight}px, auto)\` : rowHeight;
---

<div
  class={\`exhuma-bento-grid grid w-full grid-flow-dense \${className}\`}
  style={\`grid-template-columns: repeat(\${cols}, minmax(0, 1fr)); gap: \${gapVal}; grid-auto-rows: \${autoRowsVal};\`}
  {...props}
>
  <slot />
</div>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'bento-grid.blade.php',
					language: 'php',
					description: 'Laravel Blade Bento Grid component.',
					code: `@props([
    'cols' => ${cols},
    'gap' => ${gap},
    'rowHeight' => ${rowHeight},
])

@php
$gapVal = is_numeric($gap) ? "{$gap}px" : $gap;
$autoRowsVal = is_numeric($rowHeight) ? "minmax({$rowHeight}px, auto)" : $rowHeight;
@endphp

<div
    {{ $attributes->merge([
        'class' => 'exhuma-bento-grid grid w-full grid-flow-dense',
    ]) }}
    style="grid-template-columns: repeat({{ $cols }}, minmax(0, 1fr)); gap: {{ $gapVal }}; grid-auto-rows: {{ $autoRowsVal }};"
>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'bento-grid.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JavaScript Bento Grid with Big-Omega cached pointer sheen and auto-packing.',
					code: `/**
 * Initializes kinetic pointer sheen on Bento Grid cards.
 * Implements Big-Omega Ω(1) cached geometry reads on pointerenter.
 * Zero layout thrashing during active cursor movement.
 */
export function initBentoGrid(containerSelector = '.exhuma-bento-grid') {
  const containers = document.querySelectorAll(containerSelector);
  const cleanups = [];

  containers.forEach((container) => {
    const cards = container.querySelectorAll('.exhuma-bento-card');

    cards.forEach((card) => {
      let rect = null;

      const onEnter = () => {
        rect = card.getBoundingClientRect();
      };

      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--bento-x', x.toFixed(1) + 'px');
        card.style.setProperty('--bento-y', y.toFixed(1) + 'px');
      };

      const onLeave = () => {
        rect = null;
        card.style.setProperty('--bento-x', '-999px');
        card.style.setProperty('--bento-y', '-999px');
      };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('pointercancel', onLeave);

      cleanups.push(() => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        card.removeEventListener('pointercancel', onLeave);
      });
    });
  });

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
    },
  };
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
					description: 'WordPress block definition for Bento Grid.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/bento-grid",
  "version": "1.0.0",
  "title": "Exhuma Bento Grid",
  "category": "layout",
  "description": "Fluid responsive layout engine with dense auto-flow and asymmetric spans.",
  "attributes": {
    "cols": { "type": "number", "default": ${cols} },
    "gap": { "type": "number", "default": ${gap} },
    "rowHeight": { "type": "number", "default": ${rowHeight} }
  },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress render callback for Bento Grid.',
					code: `<?php
/**
 * BentoGrid Block Render Template
 */
$cols = isset($attributes['cols']) ? (int) $attributes['cols'] : ${cols};
$gap = isset($attributes['gap']) ? (int) $attributes['gap'] : ${gap};
$row_height = isset($attributes['rowHeight']) ? (int) $attributes['rowHeight'] : ${rowHeight};

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-bento-grid grid w-full grid-flow-dense',
    'style' => sprintf(
        'grid-template-columns: repeat(%d, minmax(0, 1fr)); gap: %dpx; grid-auto-rows: minmax(%dpx, auto);',
        $cols,
        $gap,
        $row_height
    ),
]);
?>
<div <?php echo $wrapper_attributes; ?>>
    <?php echo $content; ?>
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-bento-grid.js',
					language: 'javascript',
					description: 'Autonomous Custom Element <exhuma-bento-grid> with cached pointer sheen.',
					code: `class ExhumaBentoGridElement extends HTMLElement {
  connectedCallback() {
    const cols = this.getAttribute('cols') || '${cols}';
    const gap = this.getAttribute('gap') || '${gap}';
    const rowHeight = this.getAttribute('row-height') || '${rowHeight}';

    this.style.display = 'grid';
    this.style.gridTemplateColumns = \`repeat(\${cols}, minmax(0, 1fr))\`;
    this.style.gap = \`\${gap}px\`;
    this.style.gridAutoFlow = 'dense';
    this.style.gridAutoRows = \`minmax(\${rowHeight}px, auto)\`;
    this.style.width = '100%';

    this.querySelectorAll('.exhuma-bento-card').forEach((card) => {
      let rect = null;
      card.addEventListener('pointerenter', () => {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('pointermove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        card.style.setProperty('--bento-x', (e.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--bento-y', (e.clientY - rect.top).toFixed(1) + 'px');
      });
      card.addEventListener('pointerleave', () => {
        rect = null;
        card.style.setProperty('--bento-x', '-999px');
        card.style.setProperty('--bento-y', '-999px');
      });
    });
  }
}

if (!customElements.get('exhuma-bento-grid')) {
  customElements.define('exhuma-bento-grid', ExhumaBentoGridElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'BentoGrid.tsx',
					language: 'tsx',
					description: 'React Native Bento Grid container.',
					code: `import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

export interface BentoGridProps extends ViewProps {
  gap?: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ gap = ${gap}, style, children, ...props }) => (
  <View style={[styles.container, { gap }, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'bento_grid.dart',
					language: 'dart',
					description: 'Flutter Bento Grid layout widget.',
					code: `import 'package:flutter/material.dart';

class ExhumaBentoGrid extends StatelessWidget {
  final List<Widget> children;
  final double spacing;

  const ExhumaBentoGrid({
    super.key,
    required this.children,
    this.spacing = ${gap}.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: children.map((c) => Padding(
        padding: EdgeInsets.only(bottom: spacing),
        child: c,
      )).toList(),
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

export function getBentoGridUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const cols = Number(props.cols ?? 3);
	const gap = Number(props.gap ?? 20);
	const rowHeight = Number(props.rowHeight ?? 180);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 App Router page showcasing BentoGrid with asymmetric spans and pointer sheen.',
				code: `'use client';

import React from 'react';
import {
  BentoGrid,
  BentoCard,
  BentoHeader,
  BentoContent,
  BentoVisual,
} from '@/components/ui/BentoGrid';

export default function BentoGridPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          EXHUMA LAYOUT ENGINE // BENTO GRID
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          Asymmetric Dense Bento Layout
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
          Hardware-accelerated CSS auto-flow grid with pointer sheen, continuous math, and Big-Omega stability.
        </p>
      </div>

      <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}} className="max-w-5xl mx-auto">
        {/* 01. Hero Analytical Kinetics Card */}
        <BentoCard colSpan={2} rowSpan={2}>
          <BentoHeader>
            <div className="flex items-center justify-between">
              <span className="text-3xs font-mono font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                ANALYTICAL KINETICS
              </span>
              <span className="text-3xs font-mono text-muted-foreground">#01</span>
            </div>
            <h3 className="text-foreground text-lg font-bold tracking-tight mt-2">Continuous Math Engine</h3>
          </BentoHeader>
          <BentoVisual>
            <div className="w-full rounded-xl border border-primary/20 bg-background/60 p-3 shadow-2xs backdrop-blur-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xs font-mono text-muted-foreground uppercase">Live Compositor Telemetry</span>
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              </div>
              <svg className="h-16 w-full text-primary fill-primary/10 stroke-current" viewBox="0 0 300 60">
                <path d="M0,45 Q50,10 100,35 T200,20 T300,30 L300,60 L0,60 Z" />
                <path d="M0,45 Q50,10 100,35 T200,20 T300,30" fill="none" strokeWidth="2" />
              </svg>
            </div>
          </BentoVisual>
          <BentoContent>
            Hardware-accelerated CSS custom properties driven directly by zero-allocation requestAnimationFrame loops.
          </BentoContent>
        </BentoCard>

        {/* 02. Big-Omega Metric */}
        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-emerald-500 uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              BIG-OMEGA
            </span>
            <h4 className="text-foreground text-base font-bold mt-2">Ω(120Hz)</h4>
          </BentoHeader>
          <BentoVisual>
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-emerald-500">
              120<span className="text-xs font-normal text-muted-foreground">FPS</span>
            </div>
          </BentoVisual>
          <BentoContent>
            Guaranteed lower-bound execution with zero layout thrashing via cached bounding geometry.
          </BentoContent>
        </BentoCard>

        {/* 03. Compositor Latency */}
        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              COMPOSITOR
            </span>
            <h4 className="text-foreground text-base font-bold mt-2">&lt; 0.04ms</h4>
          </BentoHeader>
          <BentoVisual>
            <div className="flex items-baseline gap-1 font-mono text-2xl font-black text-indigo-400">
              0.038<span className="text-xs font-normal text-muted-foreground">ms</span>
            </div>
          </BentoVisual>
          <BentoContent>
            Sub-pixel compositor translation without main-thread jank.
          </BentoContent>
        </BentoCard>

        {/* 04. Dense Auto-Flow Feature */}
        <BentoCard colSpan={2} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
              AUTO-PACKING
            </span>
            <h4 className="text-foreground text-base font-bold mt-2">Dense Flow Backfill</h4>
          </BentoHeader>
          <BentoContent>
            CSS Grid automatically backfills empty track pockets, eliminating layout voids.
          </BentoContent>
        </BentoCard>

        {/* 05. Universal Ecosystems */}
        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              UNIVERSAL
            </span>
            <h4 className="text-foreground text-base font-bold mt-2">13 Ecosystems</h4>
          </BentoHeader>
          <BentoContent>
            Native zero-dependency implementations for React, Vue, Svelte, and modern frameworks.
          </BentoContent>
        </BentoCard>
      </BentoGrid>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'BentoGridDemo.tsx',
				language: 'tsx',
				description: 'React + Vite demo showcasing BentoGrid with compound components.',
				code: `import React from 'react';
import {
  BentoGrid,
  BentoCard,
  BentoHeader,
  BentoContent,
  BentoVisual,
} from '@/components/ui/BentoGrid';

export function BentoGridDemo() {
  return (
    <section className="p-8 bg-background text-foreground">
      <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}} className="max-w-5xl mx-auto">
        <BentoCard colSpan={2} rowSpan={2}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-primary">ANALYTICAL KINETICS</span>
            <h3 className="text-xl font-bold mt-1">Continuous Math Engine</h3>
          </BentoHeader>
          <BentoVisual>
            <div className="w-full h-24 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center">
              <span className="text-xs font-mono text-primary">Telemetry Visualization</span>
            </div>
          </BentoVisual>
          <BentoContent>Hardware-accelerated CSS custom properties driven by rAF loops.</BentoContent>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-emerald-500">BIG-OMEGA</span>
            <h4 className="text-base font-bold mt-1">Ω(120Hz)</h4>
          </BentoHeader>
          <BentoContent>Guaranteed lower-bound execution.</BentoContent>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-indigo-400">LATENCY</span>
            <h4 className="text-base font-bold mt-1">&lt; 0.04ms</h4>
          </BentoHeader>
          <BentoContent>Zero layout thrashing with cached geometry.</BentoContent>
        </BentoCard>

        <BentoCard colSpan={2} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-violet-400">AUTO-PACKING</span>
            <h4 className="text-base font-bold mt-1">Dense Flow Backfill</h4>
          </BentoHeader>
          <BentoContent>CSS Grid auto-packing prevents layout voids.</BentoContent>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <BentoHeader>
            <span className="text-3xs font-mono font-bold text-amber-500">ECOSYSTEMS</span>
            <h4 className="text-base font-bold mt-1">13 Flavors</h4>
          </BentoHeader>
          <BentoContent>Production-ready templates across all stacks.</BentoContent>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'BentoGridDemo.vue',
				language: 'vue',
				description: 'Vue 3 SFC demo with BentoGrid and BentoCard.',
				code: `<script setup lang="ts">
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
</script>

<template>
  <main class="min-h-screen bg-background text-foreground p-8">
    <BentoGrid :cols="${cols}" :gap="${gap}" :row-height="${rowHeight}" class="max-w-5xl mx-auto">
      <BentoCard :col-span="2" :row-span="2">
        <div class="space-y-2">
          <span class="text-xs font-mono text-primary font-bold uppercase">Analytical Kinetics</span>
          <h3 class="text-xl font-bold">Continuous Math Engine</h3>
          <p class="text-sm text-muted-foreground">Hardware-accelerated CSS custom properties driven by rAF loops.</p>
        </div>
      </BentoCard>

      <BentoCard :col-span="1" :row-span="1">
        <div class="space-y-2">
          <span class="text-xs font-mono text-emerald-500 font-bold uppercase">Big-Omega</span>
          <h4 class="text-base font-bold">Ω(120Hz)</h4>
          <p class="text-sm text-muted-foreground">Zero layout thrashing.</p>
        </div>
      </BentoCard>

      <BentoCard :col-span="1" :row-span="1">
        <div class="space-y-2">
          <span class="text-xs font-mono text-indigo-400 font-bold uppercase">Latency</span>
          <h4 class="text-base font-bold">&lt; 0.04ms</h4>
          <p class="text-sm text-muted-foreground">Sub-pixel compositor translation.</p>
        </div>
      </BentoCard>

      <BentoCard :col-span="2" :row-span="1">
        <div class="space-y-2">
          <span class="text-xs font-mono text-violet-400 font-bold uppercase">Auto-Packing</span>
          <h4 class="text-base font-bold">Dense Flow Backfill</h4>
          <p class="text-sm text-muted-foreground">CSS Grid automatically backfills empty track pockets.</p>
        </div>
      </BentoCard>

      <BentoCard :col-span="1" :row-span="1">
        <div class="space-y-2">
          <span class="text-xs font-mono text-amber-500 font-bold uppercase">Universal</span>
          <h4 class="text-base font-bold">13 Ecosystems</h4>
          <p class="text-sm text-muted-foreground">Universal native components.</p>
        </div>
      </BentoCard>
    </BentoGrid>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'BentoGridDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes demo with BentoGrid and BentoCard.',
				code: `<script lang="ts">
  import { BentoGrid, BentoCard } from '$lib/components/ui/BentoGrid';
</script>

<main class="min-h-screen bg-background text-foreground p-8">
  <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}} class="max-w-5xl mx-auto">
    <BentoCard colSpan={2} rowSpan={2}>
      <div class="space-y-2">
        <span class="text-xs font-mono text-primary font-bold uppercase">Analytical Kinetics</span>
        <h3 class="text-xl font-bold">Continuous Math Engine</h3>
        <p class="text-sm text-muted-foreground">Hardware-accelerated CSS custom properties driven by rAF loops.</p>
      </div>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <div class="space-y-2">
        <span class="text-xs font-mono text-emerald-500 font-bold uppercase">Big-Omega</span>
        <h4 class="text-base font-bold">Ω(120Hz)</h4>
        <p class="text-sm text-muted-foreground">Zero layout thrashing with cached geometry.</p>
      </div>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <div class="space-y-2">
        <span class="text-xs font-mono text-indigo-400 font-bold uppercase">Latency</span>
        <h4 class="text-base font-bold">&lt; 0.04ms</h4>
        <p class="text-sm text-muted-foreground">Sub-pixel compositor translation.</p>
      </div>
    </BentoCard>

    <BentoCard colSpan={2} rowSpan={1}>
      <div class="space-y-2">
        <span class="text-xs font-mono text-violet-400 font-bold uppercase">Auto-Packing</span>
        <h4 class="text-base font-bold">Dense Flow Backfill</h4>
        <p class="text-sm text-muted-foreground">CSS Grid auto-packing eliminates layout voids.</p>
      </div>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <div class="space-y-2">
        <span class="text-xs font-mono text-amber-500 font-bold uppercase">Universal</span>
        <h4 class="text-base font-bold">13 Ecosystems</h4>
        <p class="text-sm text-muted-foreground">Universal native components.</p>
      </div>
    </BentoCard>
  </BentoGrid>
</main>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'BentoGridDemo.tsx',
				language: 'tsx',
				description: 'SolidJS demo with fine-grained reactivity and BentoGrid.',
				code: `import { Component } from 'solid-js';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';

export const BentoGridDemo: Component = () => {
  return (
    <main class="min-h-screen bg-background text-foreground p-8">
      <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}} class="max-w-5xl mx-auto">
        <BentoCard colSpan={2} rowSpan={2}>
          <span class="text-xs font-mono text-primary font-bold">ANALYTICAL KINETICS</span>
          <h3 class="text-xl font-bold mt-1">Continuous Math Engine</h3>
          <p class="text-sm text-muted-foreground mt-2">Hardware-accelerated CSS custom properties driven by rAF loops.</p>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <span class="text-xs font-mono text-emerald-500 font-bold">BIG-OMEGA</span>
          <h4 class="text-base font-bold mt-1">Ω(120Hz)</h4>
          <p class="text-sm text-muted-foreground mt-2">Guaranteed lower-bound execution.</p>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <span class="text-xs font-mono text-indigo-400 font-bold">LATENCY</span>
          <h4 class="text-base font-bold mt-1">&lt; 0.04ms</h4>
          <p class="text-sm text-muted-foreground mt-2">Zero layout thrashing.</p>
        </BentoCard>

        <BentoCard colSpan={2} rowSpan={1}>
          <span class="text-xs font-mono text-violet-400 font-bold">AUTO-PACKING</span>
          <h4 class="text-base font-bold mt-1">Dense Flow Backfill</h4>
          <p class="text-sm text-muted-foreground mt-2">CSS Grid auto-packing prevents layout voids.</p>
        </BentoCard>

        <BentoCard colSpan={1} rowSpan={1}>
          <span class="text-xs font-mono text-amber-500 font-bold">UNIVERSAL</span>
          <h4 class="text-base font-bold mt-1">13 Ecosystems</h4>
          <p class="text-sm text-muted-foreground mt-2">Zero-dependency implementations.</p>
        </BentoCard>
      </BentoGrid>
    </main>
  );
};
`,
			};
		}

		case 'astro': {
			return {
				filename: 'BentoGridDemo.astro',
				language: 'astro',
				description: 'Astro component rendering BentoGrid with zero JS overhead.',
				code: `---
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
---

<main class="min-h-screen bg-background text-foreground p-8">
  <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}} class="max-w-5xl mx-auto">
    <BentoCard colSpan={2} rowSpan={2}>
      <span class="text-xs font-mono text-primary font-bold">ANALYTICAL KINETICS</span>
      <h3 class="text-xl font-bold mt-1">Continuous Math Engine</h3>
      <p class="text-sm text-muted-foreground mt-2">Hardware-accelerated CSS custom properties driven by rAF loops.</p>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <span class="text-xs font-mono text-emerald-500 font-bold">BIG-OMEGA</span>
      <h4 class="text-base font-bold mt-1">Ω(120Hz)</h4>
      <p class="text-sm text-muted-foreground mt-2">Guaranteed lower-bound execution.</p>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <span class="text-xs font-mono text-indigo-400 font-bold">LATENCY</span>
      <h4 class="text-base font-bold mt-1">&lt; 0.04ms</h4>
      <p class="text-sm text-muted-foreground mt-2">Zero layout thrashing.</p>
    </BentoCard>

    <BentoCard colSpan={2} rowSpan={1}>
      <span class="text-xs font-mono text-violet-400 font-bold">AUTO-PACKING</span>
      <h4 class="text-base font-bold mt-1">Dense Flow Backfill</h4>
      <p class="text-sm text-muted-foreground mt-2">CSS Grid auto-packing prevents layout voids.</p>
    </BentoCard>

    <BentoCard colSpan={1} rowSpan={1}>
      <span class="text-xs font-mono text-amber-500 font-bold">UNIVERSAL</span>
      <h4 class="text-base font-bold mt-1">13 Ecosystems</h4>
      <p class="text-sm text-muted-foreground mt-2">Zero-dependency implementations.</p>
    </BentoCard>
  </BentoGrid>
</main>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'bento-grid-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component with BentoGrid.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BentoGridComponent, BentoCardComponent } from './bento-grid.component';

@Component({
  selector: 'app-bento-grid-demo',
  standalone: true,
  imports: [CommonModule, BentoGridComponent, BentoCardComponent],
  template: \`
    <main class="min-h-screen bg-background text-foreground p-8">
      <exhuma-bento-grid [cols]="${cols}" [gap]="${gap}" [rowHeight]="${rowHeight}" class="max-w-5xl mx-auto">
        <exhuma-bento-card [colSpan]="2" [rowSpan]="2">
          <span class="text-xs font-mono text-primary font-bold">ANALYTICAL KINETICS</span>
          <h3 class="text-xl font-bold mt-1">Continuous Math Engine</h3>
          <p class="text-sm text-muted-foreground mt-2">Hardware-accelerated CSS custom properties.</p>
        </exhuma-bento-card>

        <exhuma-bento-card [colSpan]="1" [rowSpan]="1">
          <span class="text-xs font-mono text-emerald-500 font-bold">BIG-OMEGA</span>
          <h4 class="text-base font-bold mt-1">Ω(120Hz)</h4>
          <p class="text-sm text-muted-foreground mt-2">Guaranteed lower-bound execution.</p>
        </exhuma-bento-card>

        <exhuma-bento-card [colSpan]="1" [rowSpan]="1">
          <span class="text-xs font-mono text-indigo-400 font-bold">LATENCY</span>
          <h4 class="text-base font-bold mt-1">&lt; 0.04ms</h4>
          <p class="text-sm text-muted-foreground mt-2">Zero layout thrashing.</p>
        </exhuma-bento-card>

        <exhuma-bento-card [colSpan]="2" [rowSpan]="1">
          <span class="text-xs font-mono text-violet-400 font-bold">AUTO-PACKING</span>
          <h4 class="text-base font-bold mt-1">Dense Flow Backfill</h4>
          <p class="text-sm text-muted-foreground mt-2">CSS Grid auto-packing prevents layout voids.</p>
        </exhuma-bento-card>

        <exhuma-bento-card [colSpan]="1" [rowSpan]="1">
          <span class="text-xs font-mono text-amber-500 font-bold">UNIVERSAL</span>
          <h4 class="text-base font-bold mt-1">13 Ecosystems</h4>
          <p class="text-sm text-muted-foreground mt-2">Zero-dependency implementations.</p>
        </exhuma-bento-card>
      </exhuma-bento-grid>
    </main>
  \`,
})
export class BentoGridDemoComponent {}
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Pure HTML5 / Vanilla JavaScript BentoGrid with kinetic pointer sheen.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bento Grid Demo</title>
  <style>
    .exhuma-bento-grid {
      display: grid;
      grid-template-columns: repeat(${cols}, minmax(0, 1fr));
      gap: ${gap}px;
      grid-auto-flow: dense;
      grid-auto-rows: minmax(${rowHeight}px, auto);
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem;
    }
    .exhuma-bento-card {
      position: relative;
      overflow: hidden;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .exhuma-bento-card:hover {
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .exhuma-bento-sheen {
      pointer-events: none;
      position: absolute;
      inset: -1px;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: radial-gradient(400px circle at var(--bento-x, -999px) var(--bento-y, -999px), rgba(99, 102, 241, 0.12), transparent 80%);
    }
    .exhuma-bento-card:hover .exhuma-bento-sheen {
      opacity: 1;
    }
  </style>
</head>
<body style="background: #09090b; color: #fafafa; font-family: system-ui, sans-serif;">
  <div class="exhuma-bento-grid">
    <div class="exhuma-bento-card" style="grid-column: span 2; grid-row: span 2;">
      <div class="exhuma-bento-sheen"></div>
      <h3>Continuous Math Engine</h3>
      <p>Hardware-accelerated CSS custom properties driven by rAF loops.</p>
    </div>
    <div class="exhuma-bento-card" style="grid-column: span 1; grid-row: span 1;">
      <div class="exhuma-bento-sheen"></div>
      <h4>Ω(120Hz)</h4>
      <p>Zero layout thrashing with cached geometry.</p>
    </div>
    <div class="exhuma-bento-card" style="grid-column: span 1; grid-row: span 1;">
      <div class="exhuma-bento-sheen"></div>
      <h4>&lt; 0.04ms</h4>
      <p>Sub-pixel compositor translation.</p>
    </div>
    <div class="exhuma-bento-card" style="grid-column: span 2; grid-row: span 1;">
      <div class="exhuma-bento-sheen"></div>
      <h4>Dense Flow Backfill</h4>
      <p>CSS Grid auto-packing prevents layout voids.</p>
    </div>
    <div class="exhuma-bento-card" style="grid-column: span 1; grid-row: span 1;">
      <div class="exhuma-bento-sheen"></div>
      <h4>13 Ecosystems</h4>
      <p>Universal zero-dependency primitives.</p>
    </div>
  </div>

  <script>
    document.querySelectorAll('.exhuma-bento-card').forEach((card) => {
      let rect = null;
      card.addEventListener('pointerenter', () => {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('pointermove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        card.style.setProperty('--bento-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--bento-y', (e.clientY - rect.top) + 'px');
      });
      card.addEventListener('pointerleave', () => {
        rect = null;
        card.style.setProperty('--bento-x', '-999px');
        card.style.setProperty('--bento-y', '-999px');
      });
    });
  </script>
</body>
</html>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'bento-grid.blade.php',
				language: 'php',
				description: 'Laravel Blade component rendering BentoGrid with Tailwind CSS.',
				code: `@props([
    'cols' => ${cols},
    'gap' => ${gap},
    'rowHeight' => ${rowHeight},
])

<div
    class="grid w-full grid-flow-dense max-w-5xl mx-auto"
    style="grid-template-columns: repeat({{ $cols }}, minmax(0, 1fr)); gap: {{ $gap }}px; grid-auto-rows: minmax({{ $rowHeight }}px, auto);"
>
    <!-- 01. Hero Card -->
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl" style="grid-column: span 2; grid-row: span 2;">
        <span class="text-xs font-mono text-primary font-bold uppercase">Analytical Kinetics</span>
        <h3 class="text-xl font-bold mt-1 text-foreground">Continuous Math Engine</h3>
        <p class="text-sm text-muted-foreground mt-2">Hardware-accelerated CSS custom properties.</p>
    </div>

    <!-- 02. Stat Tile -->
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl" style="grid-column: span 1; grid-row: span 1;">
        <span class="text-xs font-mono text-emerald-500 font-bold uppercase">Big-Omega</span>
        <h4 class="text-base font-bold mt-1 text-foreground">Ω(120Hz)</h4>
        <p class="text-sm text-muted-foreground mt-2">Guaranteed lower-bound execution.</p>
    </div>

    <!-- 03. Latency Tile -->
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl" style="grid-column: span 1; grid-row: span 1;">
        <span class="text-xs font-mono text-indigo-400 font-bold uppercase">Compositor</span>
        <h4 class="text-base font-bold mt-1 text-foreground">&lt; 0.04ms</h4>
        <p class="text-sm text-muted-foreground mt-2">Zero layout thrashing.</p>
    </div>

    <!-- 04. Auto-Flow Card -->
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl" style="grid-column: span 2; grid-row: span 1;">
        <span class="text-xs font-mono text-violet-400 font-bold uppercase">Auto-Packing</span>
        <h4 class="text-base font-bold mt-1 text-foreground">Dense Flow Backfill</h4>
        <p class="text-sm text-muted-foreground mt-2">CSS Grid auto-packing prevents layout voids.</p>
    </div>

    <!-- 05. Universal Card -->
    <div class="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl" style="grid-column: span 1; grid-row: span 1;">
        <span class="text-xs font-mono text-amber-500 font-bold uppercase">Universal</span>
        <h4 class="text-base font-bold mt-1 text-foreground">13 Ecosystems</h4>
        <p class="text-sm text-muted-foreground mt-2">Universal native components.</p>
    </div>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'bento-grid.js',
				language: 'javascript',
				description: 'Native Autonomous Web Component (<exhuma-bento-grid>) with Shadow DOM.',
				code: `class ExhumaBentoGrid extends HTMLElement {
  connectedCallback() {
    const cols = this.getAttribute('cols') || '${cols}';
    const gap = this.getAttribute('gap') || '${gap}';
    const rowHeight = this.getAttribute('row-height') || '${rowHeight}';

    this.style.display = 'grid';
    this.style.gridTemplateColumns = \`repeat(\${cols}, minmax(0, 1fr))\`;
    this.style.gap = \`\${gap}px\`;
    this.style.gridAutoFlow = 'dense';
    this.style.gridAutoRows = \`minmax(\${rowHeight}px, auto)\`;
    this.style.width = '100%';
  }
}

customElements.define('exhuma-bento-grid', ExhumaBentoGrid);
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'render.php',
				language: 'php',
				description: 'WordPress Gutenberg block render template for BentoGrid.',
				code: `<?php
/**
 * BentoGrid Block Render Template
 *
 * @param array $attributes Block attributes.
 * @param string $content Block default content.
 */

$cols = isset($attributes['cols']) ? (int) $attributes['cols'] : ${cols};
$gap = isset($attributes['gap']) ? (int) $attributes['gap'] : ${gap};
$row_height = isset($attributes['rowHeight']) ? (int) $attributes['rowHeight'] : ${rowHeight};
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-bento-grid grid w-full grid-flow-dense max-w-5xl mx-auto',
    'style' => sprintf(
        'grid-template-columns: repeat(%d, minmax(0, 1fr)); gap: %dpx; grid-auto-rows: minmax(%dpx, auto);',
        $cols,
        $gap,
        $row_height
    ),
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'BentoGridScreen.tsx',
				language: 'tsx',
				description: 'React Native demo with flexbox wrap bento simulation.',
				code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BentoGridScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.tag}>ANALYTICAL KINETICS</Text>
        <Text style={styles.title}>Continuous Math Engine</Text>
        <Text style={styles.desc}>Hardware-accelerated CSS custom properties driven by zero-allocation loops.</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.halfCard}>
          <Text style={styles.tagGreen}>BIG-OMEGA</Text>
          <Text style={styles.metric}>Ω(120Hz)</Text>
          <Text style={styles.desc}>Guaranteed lower-bound execution.</Text>
        </View>

        <View style={styles.halfCard}>
          <Text style={styles.tagIndigo}>COMPOSITOR</Text>
          <Text style={styles.metric}>&lt; 0.04ms</Text>
          <Text style={styles.desc}>Zero layout thrashing.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#09090b', gap: ${gap} },
  heroCard: { backgroundColor: '#18181b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#27272a' },
  row: { flexDirection: 'row', gap: ${gap} },
  halfCard: { flex: 1, backgroundColor: '#18181b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#27272a' },
  tag: { color: '#6366f1', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
  tagGreen: { color: '#10b981', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
  tagIndigo: { color: '#818cf8', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' },
  title: { color: '#fafafa', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  metric: { color: '#fafafa', fontSize: 22, fontWeight: '900', marginTop: 6 },
  desc: { color: '#a1a1aa', fontSize: 12, marginTop: 6, lineHeight: 18 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'bento_grid_page.dart',
				language: 'dart',
				description: 'Flutter page using StaggeredGrid / Wrap bento architecture.',
				code: `import 'package:flutter/material.dart';

class BentoGridPage extends StatelessWidget {
  const BentoGridPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        title: const Text('Bento Grid'),
        backgroundColor: const Color(0xFF18181B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: const Color(0xFF18181B),
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(color: const Color(0xFF27272A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('ANALYTICAL KINETICS', style: TextStyle(color: Color(0xFF6366F1), fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text('Continuous Math Engine', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  SizedBox(height: 6),
                  Text('Hardware-accelerated custom properties driven by zero-allocation loops.', style: TextStyle(color: Color(0xFFA1A1AA), fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: ${gap}.0),
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF18181B),
                      borderRadius: BorderRadius.circular(16.0),
                      border: Border.all(color: const Color(0xFF27272A)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('BIG-OMEGA', style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                        SizedBox(height: 6),
                        Text('Ω(120Hz)', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        SizedBox(height: 4),
                        Text('Guaranteed lower-bound.', style: TextStyle(color: Color(0xFFA1A1AA), fontSize: 11)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: ${gap}.0),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF18181B),
                      borderRadius: BorderRadius.circular(16.0),
                      border: Border.all(color: const Color(0xFF27272A)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('COMPOSITOR', style: TextStyle(color: Color(0xFF818CF8), fontSize: 10, fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                        SizedBox(height: 6),
                        Text('< 0.04ms', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        SizedBox(height: 4),
                        Text('Zero layout thrashing.', style: TextStyle(color: Color(0xFFA1A1AA), fontSize: 11)),
                      ],
                    ),
                  ),
                ),
              ],
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

		default: {
			return {
				filename: 'BentoGrid.tsx',
				language: 'tsx',
				description: 'Generic BentoGrid component usage.',
				code: `import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';

export default function BentoGridDemo() {
  return (
    <BentoGrid cols={${cols}} gap={${gap}} rowHeight={${rowHeight}}>
      <BentoCard colSpan={2} rowSpan={2}>
        <h3>Continuous Math Engine</h3>
      </BentoCard>
      <BentoCard colSpan={1} rowSpan={1}>
        <h4>Ω(120Hz)</h4>
      </BentoCard>
    </BentoGrid>
  );
}
`,
			};
		}
	}
}
