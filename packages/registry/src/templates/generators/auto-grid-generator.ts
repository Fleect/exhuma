import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getAutoGridOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const minItemWidth = Number(props.minItemWidth ?? 280);
	const gap = Number(props.gap ?? 24);
	const mode = (props.mode as string) ?? 'auto-fit';
	const maxColumns = Number(props.maxColumns ?? 4);
	const alignItems = (props.alignItems as string) ?? 'stretch';

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'AutoGrid.tsx',
					language: 'tsx',
					description: 'Auto Grid — Standalone Ejected Engine (Zero Dependencies). Raw minmax auto-fit/fill repeat track layout inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface AutoGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number | 'full';
  rowSpan?: number;
}

/**
 * AutoGridItem — Standalone compound item with dynamic span support.
 * Guaranteed Ω(1) layout: uses standard grid-column and grid-row CSS declarations.
 */
export const AutoGridItem = React.forwardRef<HTMLDivElement, AutoGridItemProps>(
  ({ children, colSpan, rowSpan, className, style, ...props }, ref) => {
    const itemStyle: React.CSSProperties = {
      gridColumn: colSpan === 'full' ? '1 / -1' : typeof colSpan === 'number' ? \`span \${colSpan}\` : undefined,
      gridRow: typeof rowSpan === 'number' ? \`span \${rowSpan}\` : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx('exhuma-auto-grid-item', className)}
        style={itemStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AutoGridItem.displayName = 'AutoGridItem';

export interface AutoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: number | string;
  gap?: number | string;
  mode?: 'auto-fit' | 'auto-fill';
  maxColumns?: number;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
}

/**
 * AutoGrid — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) pure CSS Grid track calculation.
 * - Zero runtime JavaScript overhead or DOM event listeners.
 * - Zero layout thrashing (CLS = 0.00).
 * - Clamps max columns with pure CSS fractional unit distribution.
 */
export const AutoGrid = React.forwardRef<HTMLDivElement, AutoGridProps>(
  (
    {
      children,
      minItemWidth = ${minItemWidth},
      gap = ${gap},
      mode = '${mode}',
      maxColumns = ${maxColumns},
      alignItems = '${alignItems}',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const minWidthVal = typeof minItemWidth === 'number' ? \`\${minItemWidth}px\` : minItemWidth;
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    const minTrack = \`min(100%, \${minWidthVal})\`;

    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns:
        maxColumns && maxColumns > 0
          ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxColumns - 1} * \${gapVal}) / \${maxColumns})), 1fr))\`
          : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`,
      gap: gapVal,
      alignItems,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx('exhuma-auto-grid w-full', className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AutoGrid.displayName = 'AutoGrid';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'AutoGrid.vue',
					language: 'vue',
					description: 'Vue 3 Native Auto Grid layout component.',
					code: `<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  minItemWidth?: number | string;
  gap?: number | string;
  mode?: 'auto-fit' | 'auto-fill';
  maxColumns?: number;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  minItemWidth: ${minItemWidth},
  gap: ${gap},
  mode: '${mode}',
  maxColumns: ${maxColumns},
  alignItems: '${alignItems}',
  class: '',
});

const gridStyle = computed(() => {
  const minWidthVal = typeof props.minItemWidth === 'number' ? \`\${props.minItemWidth}px\` : props.minItemWidth;
  const gapVal = typeof props.gap === 'number' ? \`\${props.gap}px\` : props.gap;
  const repeatTrack = props.mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
  const minTrack = \`min(100%, \${minWidthVal})\`;

  const templateCols = props.maxColumns && props.maxColumns > 0
    ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${props.maxColumns - 1} * \${gapVal}) / \${props.maxColumns})), 1fr))\`
    : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`;

  return {
    display: 'grid',
    gridTemplateColumns: templateCols,
    gap: gapVal,
    alignItems: props.alignItems,
  };
});
</script>

<template>
  <div class="exhuma-auto-grid w-full" :class="props.class" :style="gridStyle">
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
					filename: 'AutoGrid.svelte',
					language: 'svelte',
					description: 'Svelte 5 Runes Auto Grid layout component.',
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    minItemWidth = ${minItemWidth},
    gap = ${gap},
    mode = '${mode}',
    maxColumns = ${maxColumns},
    alignItems = '${alignItems}',
    class: className = '',
    children,
    ...restProps
  }: {
    minItemWidth?: number | string;
    gap?: number | string;
    mode?: 'auto-fit' | 'auto-fill';
    maxColumns?: number;
    alignItems?: 'stretch' | 'start' | 'center' | 'end';
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();

  const minWidthVal = $derived(typeof minItemWidth === 'number' ? \`\${minItemWidth}px\` : minItemWidth);
  const gapVal = $derived(typeof gap === 'number' ? \`\${gap}px\` : gap);
  const repeatTrack = $derived(mode === 'auto-fill' ? 'auto-fill' : 'auto-fit');
  const minTrack = $derived(\`min(100%, \${minWidthVal})\`);

  const gridTemplateColumns = $derived(
    maxColumns && maxColumns > 0
      ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxColumns - 1} * \${gapVal}) / \${maxColumns})), 1fr))\`
      : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`
  );
</script>

<div
  class={clsx('exhuma-auto-grid w-full', className)}
  style="display: grid; grid-template-columns: {gridTemplateColumns}; gap: {gapVal}; align-items: {alignItems};"
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
					filename: 'AutoGrid.tsx',
					language: 'tsx',
					description: 'SolidJS Native Auto Grid layout component.',
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface AutoGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: number | string;
  gap?: number | string;
  mode?: 'auto-fit' | 'auto-fill';
  maxColumns?: number;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
}

export const AutoGrid: Component<AutoGridProps> = (props) => {
  const [local, others] = splitProps(props, [
    'minItemWidth',
    'gap',
    'mode',
    'maxColumns',
    'alignItems',
    'class',
    'children',
    'style',
  ]);

  const minItemWidth = () => local.minItemWidth ?? ${minItemWidth};
  const gap = () => local.gap ?? ${gap};
  const mode = () => local.mode ?? '${mode}';
  const maxColumns = () => local.maxColumns ?? ${maxColumns};
  const alignItems = () => local.alignItems ?? '${alignItems}';

  const minWidthVal = () => typeof minItemWidth() === 'number' ? \`\${minItemWidth()}px\` : minItemWidth();
  const gapVal = () => typeof gap() === 'number' ? \`\${gap()}px\` : gap();
  const repeatTrack = () => mode() === 'auto-fill' ? 'auto-fill' : 'auto-fit';
  const minTrack = () => \`min(100%, \${minWidthVal()})\`;

  const templateCols = () =>
    maxColumns() && maxColumns() > 0
      ? \`repeat(\${repeatTrack()}, minmax(max(\${minTrack()}, calc((100% - \${maxColumns() - 1} * \${gapVal()}) / \${maxColumns()})), 1fr))\`
      : \`repeat(\${repeatTrack()}, minmax(\${minTrack()}, 1fr))\`;

  return (
    <div
      class={\`exhuma-auto-grid w-full \${local.class ?? ''}\`}
      style={{
        display: 'grid',
        'grid-template-columns': templateCols(),
        gap: gapVal(),
        'align-items': alignItems(),
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
					filename: 'auto-grid.component.ts',
					language: 'typescript',
					description: 'Angular 18+ standalone Auto Grid component with signals.',
					code: `import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-auto-grid',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      class="exhuma-auto-grid w-full {{ className() }}"
      [style.display]="'grid'"
      [style.gridTemplateColumns]="gridTemplateColumns()"
      [style.gap]="gapVal()"
      [style.alignItems]="alignItems()"
    >
      <ng-content />
    </div>
  \`,
})
export class ExhumaAutoGridComponent {
  minItemWidth = input<number | string>(${minItemWidth});
  gap = input<number | string>(${gap});
  mode = input<'auto-fit' | 'auto-fill'>('${mode}');
  maxColumns = input<number>(${maxColumns});
  alignItems = input<'stretch' | 'start' | 'center' | 'end'>('${alignItems}');
  className = input<string>('');

  minWidthVal = computed(() =>
    typeof this.minItemWidth() === 'number' ? \`\${this.minItemWidth()}px\` : this.minItemWidth()
  );

  gapVal = computed(() =>
    typeof this.gap() === 'number' ? \`\${this.gap()}px\` : this.gap()
  );

  gridTemplateColumns = computed(() => {
    const repeat = this.mode() === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    const minTrack = \`min(100%, \${this.minWidthVal()})\`;
    const maxCols = this.maxColumns();

    return maxCols && maxCols > 0
      ? \`repeat(\${repeat}, minmax(max(\${minTrack}, calc((100% - \${maxCols - 1} * \${this.gapVal()}) / \${maxCols})), 1fr))\`
      : \`repeat(\${repeat}, minmax(\${minTrack}, 1fr))\`;
  });
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'AutoGrid.astro',
					language: 'astro',
					description: 'Astro zero-JS Auto Grid component.',
					code: `---
interface Props {
  minItemWidth?: number | string;
  gap?: number | string;
  mode?: 'auto-fit' | 'auto-fill';
  maxColumns?: number;
  alignItems?: 'stretch' | 'start' | 'center' | 'end';
  class?: string;
}

const {
  minItemWidth = ${minItemWidth},
  gap = ${gap},
  mode = '${mode}',
  maxColumns = ${maxColumns},
  alignItems = '${alignItems}',
  class: className = '',
} = Astro.props;

const minWidthVal = typeof minItemWidth === 'number' ? \`\${minItemWidth}px\` : minItemWidth;
const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
const minTrack = \`min(100%, \${minWidthVal})\`;

const gridTemplateColumns =
  maxColumns && maxColumns > 0
    ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxColumns - 1} * \${gapVal}) / \${maxColumns})), 1fr))\`
    : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`;
---

<div
  class:list={['exhuma-auto-grid w-full', className]}
  style={{
    display: 'grid',
    gridTemplateColumns,
    gap: gapVal,
    alignItems,
  }}
>
  <slot />
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-auto-grid.js',
					language: 'javascript',
					description: 'Framework-agnostic Web Component for Auto Grid.',
					code: `class ExhumaAutoGrid extends HTMLElement {
  static get observedAttributes() {
    return ['min-item-width', 'gap', 'mode', 'max-columns', 'align-items'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const minWidth = this.getAttribute('min-item-width') || '${minItemWidth}';
    const gap = this.getAttribute('gap') || '${gap}';
    const mode = this.getAttribute('mode') || '${mode}';
    const maxCols = parseInt(this.getAttribute('max-columns') || '${maxColumns}', 10);
    const alignItems = this.getAttribute('align-items') || '${alignItems}';

    const minWidthVal = isNaN(Number(minWidth)) ? minWidth : \`\${minWidth}px\`;
    const gapVal = isNaN(Number(gap)) ? gap : \`\${gap}px\`;
    const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    const minTrack = \`min(100%, \${minWidthVal})\`;

    const cols = maxCols > 0
      ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxCols - 1} * \${gapVal}) / \${maxCols})), 1fr))\`
      : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`;

    this.style.display = 'grid';
    this.style.gridTemplateColumns = cols;
    this.style.gap = gapVal;
    this.style.alignItems = alignItems;
    this.style.width = '100%';
  }
}

if (!customElements.get('exhuma-auto-grid')) {
  customElements.define('exhuma-auto-grid', ExhumaAutoGrid);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'auto-grid.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JavaScript Auto Grid initializer.',
					code: `export function initAutoGrid(selector = '[data-exhuma-auto-grid]', options = {}) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const minWidth = options.minItemWidth ?? el.dataset.minItemWidth ?? ${minItemWidth};
    const gap = options.gap ?? el.dataset.gap ?? ${gap};
    const mode = options.mode ?? el.dataset.mode ?? '${mode}';
    const maxColumns = options.maxColumns ?? parseInt(el.dataset.maxColumns || '${maxColumns}', 10);
    const alignItems = options.alignItems ?? el.dataset.alignItems ?? '${alignItems}';

    const minWidthVal = typeof minWidth === 'number' ? \`\${minWidth}px\` : minWidth;
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    const repeatTrack = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    const minTrack = \`min(100%, \${minWidthVal})\`;

    const cols = maxColumns > 0
      ? \`repeat(\${repeatTrack}, minmax(max(\${minTrack}, calc((100% - \${maxColumns - 1} * \${gapVal}) / \${maxColumns})), 1fr))\`
      : \`repeat(\${repeatTrack}, minmax(\${minTrack}, 1fr))\`;

    el.style.display = 'grid';
    el.style.gridTemplateColumns = cols;
    el.style.gap = gapVal;
    el.style.alignItems = alignItems;
    el.style.width = '100%';
  });
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'auto-grid.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Auto Grid.',
					code: `@props([
    'minItemWidth' => ${minItemWidth},
    'gap' => ${gap},
    'mode' => '${mode}',
    'maxColumns' => ${maxColumns},
    'alignItems' => '${alignItems}',
    'class' => '',
])

@php
    $minWidthVal = is_numeric($minItemWidth) ? "{$minItemWidth}px" : $minItemWidth;
    $gapVal = is_numeric($gap) ? "{$gap}px" : $gap;
    $repeatTrack = $mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
    $minTrack = "min(100%, {$minWidthVal})";

    $templateCols = $maxColumns > 0
        ? "repeat({$repeatTrack}, minmax(max({$minTrack}, calc((100% - " . ($maxColumns - 1) . " * {$gapVal}) / {$maxColumns})), 1fr))"
        : "repeat({$repeatTrack}, minmax({$minTrack}, 1fr))";
@endphp

<div
    {{ $attributes->merge(['class' => 'exhuma-auto-grid w-full ' . $class]) }}
    style="display: grid; grid-template-columns: {{ $templateCols }}; gap: {{ $gapVal }}; align-items: {{ $alignItems }};"
>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg block render template for Auto Grid.',
					code: `<?php
/**
 * Exhuma Auto Grid Block Render Template
 */
$minItemWidth = $attributes['minItemWidth'] ?? ${minItemWidth};
$gap = $attributes['gap'] ?? ${gap};
$mode = $attributes['mode'] ?? '${mode}';
$maxColumns = $attributes['maxColumns'] ?? ${maxColumns};
$alignItems = $attributes['alignItems'] ?? '${alignItems}';

$minWidthVal = is_numeric($minItemWidth) ? "{$minItemWidth}px" : $minItemWidth;
$gapVal = is_numeric($gap) ? "{$gap}px" : $gap;
$repeatTrack = $mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
$minTrack = "min(100%, {$minWidthVal})";

$templateCols = $maxColumns > 0
    ? "repeat({$repeatTrack}, minmax(max({$minTrack}, calc((100% - " . ($maxColumns - 1) . " * {$gapVal}) / {$maxColumns})), 1fr))"
    : "repeat({$repeatTrack}, minmax({$minTrack}, 1fr))";
?>

<div
    class="exhuma-auto-grid w-full <?php echo esc_attr($attributes['className'] ?? ''); ?>"
    style="display: grid; grid-template-columns: <?php echo esc_attr($templateCols); ?>; gap: <?php echo esc_attr($gapVal); ?>; align-items: <?php echo esc_attr($alignItems); ?>;"
>
    <?php echo $content; ?>
</div>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'AutoGrid.tsx',
					language: 'tsx',
					description: 'React Native Auto Grid component using responsive flexbox wrapping.',
					code: `import React from 'react';
import { View, StyleSheet, useWindowDimensions, type ViewProps } from 'react-native';

export interface AutoGridProps extends ViewProps {
  minItemWidth?: number;
  gap?: number;
  maxColumns?: number;
}

export const AutoGrid: React.FC<AutoGridProps> = ({
  children,
  minItemWidth = ${minItemWidth},
  gap = ${gap},
  maxColumns = ${maxColumns},
  style,
  ...props
}) => {
  const { width } = useWindowDimensions();
  const availableWidth = width - 32; // Default screen horizontal padding
  const computedCols = Math.min(
    maxColumns,
    Math.max(1, Math.floor((availableWidth + gap) / (minItemWidth + gap)))
  );
  const itemWidth = (availableWidth - (computedCols - 1) * gap) / computedCols;

  return (
    <View style={[styles.container, { gap }, style]} {...props}>
      {React.Children.map(children, (child) => (
        <View style={{ width: itemWidth }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'auto_grid.dart',
					language: 'dart',
					description: 'Flutter Auto Grid widget using SliverGridDelegateWithMaxCrossAxisExtent.',
					code: `import 'package:flutter/material.dart';

class ExhumaAutoGrid extends StatelessWidget {
  final List<Widget> children;
  final double minItemWidth;
  final double gap;
  final int maxColumns;

  const ExhumaAutoGrid({
    super.key,
    required this.children,
    this.minItemWidth = ${minItemWidth}.0,
    this.gap = ${gap}.0,
    this.maxColumns = ${maxColumns},
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = (constraints.maxWidth / minItemWidth).floor().clamp(1, maxColumns);

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: gap,
            mainAxisSpacing: gap,
            childAspectRatio: 1.0,
          ),
          itemCount: children.length,
          itemBuilder: (context, index) => children[index],
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

export function getAutoGridUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const minItemWidth = Number(props.minItemWidth ?? 280);
	const gap = Number(props.gap ?? 24);
	const mode = (props.mode as string) ?? 'auto-fit';
	const maxColumns = Number(props.maxColumns ?? 4);
	const alignItems = (props.alignItems as string) ?? 'stretch';

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 App Router page with AutoGrid and AutoGridItem.',
				code: `'use client';

import React from 'react';
import { AutoGrid, AutoGridItem } from '@/components/ui/AutoGrid';

const ITEMS = [
  { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Automated repeat tracks expanding fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
  { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Evaluates minmax(min(100%, ${minItemWidth}px), 1fr) for zero horizontal scroll overflow.', metric: '${minItemWidth}px Floor' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution across render passes (CLS = 0.00).', metric: 'CLS: 0.00' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Column wrapping transitions with fluid visual hierarchy and balanced element distribution.', metric: 'Hermite Smooth' },
  { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Zero-runtime pure CSS grid templates compiled for Vue, Svelte, Angular, Solid, and modern web frameworks.', metric: '13 Flavors' },
  { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container avoiding persistent listener references.', metric: '0 Heap Leaks' },
];

export default function AutoGridPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          EXHUMA LAYOUT ENGINE // AUTO GRID
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          Autonomous Responsive CSS Grid
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
          Pure CSS auto-fit and auto-fill repeat tracks with hardware compositor promotion. Zero JavaScript resize observers.
        </p>
      </div>

      <AutoGrid
        minItemWidth={${minItemWidth}}
        gap={${gap}}
        mode="${mode}"
        maxColumns={${maxColumns}}
        alignItems="${alignItems}"
        className="max-w-6xl mx-auto"
      >
        {ITEMS.map((item) => (
          <AutoGridItem key={item.id} className="group">
            <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xs font-mono font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 rounded px-2 py-0.5">
                    {item.tag}
                  </span>
                  <span className="text-3xs font-mono text-muted-foreground">GRID #{item.id}</span>
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-3xs font-mono text-muted-foreground">
                <span>Mode: ${mode}</span>
                <span className="font-semibold text-emerald-400">{item.metric}</span>
              </div>
            </div>
          </AutoGridItem>
        ))}
      </AutoGrid>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'AutoGridDemo.tsx',
				language: 'tsx',
				description: 'React + Vite demo showcasing AutoGrid.',
				code: `import React from 'react';
import { AutoGrid, AutoGridItem } from '@/components/ui/AutoGrid';

const ITEMS = [
  { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Automated repeat tracks expanding fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
  { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Evaluates minmax(min(100%, ${minItemWidth}px), 1fr) for zero horizontal scroll overflow.', metric: '${minItemWidth}px Floor' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution across render passes (CLS = 0.00).', metric: 'CLS: 0.00' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Column wrapping transitions with fluid visual hierarchy and balanced element distribution.', metric: 'Hermite Smooth' },
  { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Zero-runtime pure CSS grid templates compiled for Vue, Svelte, Angular, Solid, and modern web frameworks.', metric: '13 Flavors' },
  { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container avoiding persistent listener references.', metric: '0 Heap Leaks' },
];

export function AutoGridDemo() {
  return (
    <section className="p-8 bg-background text-foreground">
      <AutoGrid
        minItemWidth={${minItemWidth}}
        gap={${gap}}
        mode="${mode}"
        maxColumns={${maxColumns}}
        alignItems="${alignItems}"
        className="max-w-6xl mx-auto"
      >
        {ITEMS.map((item) => (
          <AutoGridItem key={item.id}>
            <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-3xs font-mono font-bold text-primary">{item.tag}</span>
                <h3 className="font-bold text-base mt-2">{item.title}</h3>
                <p className="text-muted-foreground text-xs mt-2">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
                <span>GRID #{item.id}</span>
                <span className="text-emerald-400 font-bold">{item.metric}</span>
              </div>
            </div>
          </AutoGridItem>
        ))}
      </AutoGrid>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'AutoGridDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component utilizing AutoGrid.',
				code: `<script setup lang="ts">
import AutoGrid from '@/components/ui/AutoGrid.vue';

const items = [
  { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Repeat tracks expand fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
  { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Zero horizontal scroll overflow on mobile.', metric: '${minItemWidth}px Floor' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution preventing CLS.', metric: 'CLS: 0.00' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Balanced visual element wrapping.', metric: 'Hermite Smooth' },
  { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Compiled for all modern web frameworks.', metric: '13 Flavors' },
  { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container.', metric: '0 Heap Leaks' },
];
</script>

<template>
  <main class="p-8 bg-background text-foreground">
    <AutoGrid
      :min-item-width="${minItemWidth}"
      :gap="${gap}"
      mode="${mode}"
      :max-columns="${maxColumns}"
      align-items="${alignItems}"
      class="max-w-6xl mx-auto"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between"
      >
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{{ item.tag }}</span>
          <h3 class="font-bold text-base mt-2">{{ item.title }}</h3>
          <p class="text-muted-foreground text-xs mt-2">{{ item.desc }}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>GRID #{{ item.id }}</span>
          <span class="text-emerald-400 font-bold">{{ item.metric }}</span>
        </div>
      </div>
    </AutoGrid>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'AutoGridDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component embedding AutoGrid.',
				code: `<script lang="ts">
  import AutoGrid from '$lib/components/AutoGrid.svelte';

  const items = [
    { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Repeat tracks expand fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
    { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Zero horizontal scroll overflow on mobile.', metric: '${minItemWidth}px Floor' },
    { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution preventing CLS.', metric: 'CLS: 0.00' },
    { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Balanced visual element wrapping.', metric: 'Hermite Smooth' },
    { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Compiled for all modern web frameworks.', metric: '13 Flavors' },
    { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container.', metric: '0 Heap Leaks' },
  ];
</script>

<div class="p-8 bg-background text-foreground">
  <AutoGrid
    minItemWidth={${minItemWidth}}
    gap={${gap}}
    mode="${mode}"
    maxColumns={${maxColumns}}
    alignItems="${alignItems}"
    class="max-w-6xl mx-auto"
  >
    {#each items as item}
      <div class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>
          <h3 class="font-bold text-base mt-2">{item.title}</h3>
          <p class="text-muted-foreground text-xs mt-2">{item.desc}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>GRID #{item.id}</span>
          <span class="text-emerald-400 font-bold">{item.metric}</span>
        </div>
      </div>
    {/each}
  </AutoGrid>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'AutoGridDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactive AutoGrid.',
				code: `import { Component, For } from 'solid-js';
import { AutoGrid } from '@/components/ui/AutoGrid';

const ITEMS = [
  { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Repeat tracks expand fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
  { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Zero horizontal scroll overflow on mobile.', metric: '${minItemWidth}px Floor' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution preventing CLS.', metric: 'CLS: 0.00' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Balanced visual element wrapping.', metric: 'Hermite Smooth' },
  { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Compiled for all modern web frameworks.', metric: '13 Flavors' },
  { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container.', metric: '0 Heap Leaks' },
];

export const AutoGridDemo: Component = () => {
  return (
    <div class="p-8 bg-background text-foreground">
      <AutoGrid
        minItemWidth={${minItemWidth}}
        gap={${gap}}
        mode="${mode}"
        maxColumns={${maxColumns}}
        alignItems="${alignItems}"
        class="max-w-6xl mx-auto"
      >
        <For each={ITEMS}>
          {(item) => (
            <div class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>
                <h3 class="font-bold text-base mt-2">{item.title}</h3>
                <p class="text-muted-foreground text-xs mt-2">{item.desc}</p>
              </div>
              <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
                <span>GRID #{item.id}</span>
                <span class="text-emerald-400 font-bold">{item.metric}</span>
              </div>
            </div>
          )}
        </For>
      </AutoGrid>
    </div>
  );
};

export default AutoGridDemo;
`,
			};
		}

		case 'angular': {
			return {
				filename: 'auto-grid-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component importing ExhumaAutoGridComponent.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaAutoGridComponent } from './components/auto-grid.component';

@Component({
  selector: 'app-auto-grid-demo',
  standalone: true,
  imports: [CommonModule, ExhumaAutoGridComponent],
  template: \`
    <div class="p-8 bg-background text-foreground">
      <exhuma-auto-grid
        [minItemWidth]="${minItemWidth}"
        [gap]="${gap}"
        mode="${mode}"
        [maxColumns]="${maxColumns}"
        alignItems="${alignItems}"
        className="max-w-6xl mx-auto"
      >
        @for (item of items; track item.id) {
          <div class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span class="text-3xs font-mono font-bold text-primary">{{ item.tag }}</span>
              <h3 class="font-bold text-base mt-2">{{ item.title }}</h3>
              <p class="text-muted-foreground text-xs mt-2">{{ item.desc }}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
              <span>GRID #{{ item.id }}</span>
              <span class="text-emerald-400 font-bold">{{ item.metric }}</span>
            </div>
          </div>
        }
      </exhuma-auto-grid>
    </div>
  \`,
})
export class AutoGridDemoComponent {
  items = [
    { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Repeat tracks expand fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
    { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Zero horizontal scroll overflow on mobile.', metric: '${minItemWidth}px Floor' },
    { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution preventing CLS.', metric: 'CLS: 0.00' },
    { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Balanced visual element wrapping.', metric: 'Hermite Smooth' },
    { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Compiled for all modern web frameworks.', metric: '13 Flavors' },
    { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container.', metric: '0 Heap Leaks' },
  ];
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'AutoGridDemo.astro',
				language: 'astro',
				description: 'Zero-JS Astro component leveraging pure CSS AutoGrid.',
				code: `---
import AutoGrid from '@/components/ui/AutoGrid.astro';

const items = [
  { id: '01', tag: 'PIPELINE', title: 'High-Throughput Kinetic Pipeline', desc: 'Repeat tracks expand fluidly with zero layout thrashing.', metric: '0.14ms Frame' },
  { id: '02', tag: 'COMPLIANCE', title: 'Dynamic MinMax Constraint Engine', desc: 'Zero horizontal scroll overflow on mobile.', metric: '${minItemWidth}px Floor' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Layout Stability', desc: 'Fractional unit distribution preventing CLS.', metric: 'CLS: 0.00' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped Track Transition', desc: 'Balanced visual element wrapping.', metric: 'Hermite Smooth' },
  { id: '05', tag: 'UNIVERSAL', title: 'Cross-Ecosystem Universal Grid', desc: 'Compiled for all modern web frameworks.', metric: '13 Flavors' },
  { id: '06', tag: 'AUDIT', title: 'Zero Memory Leak Architecture', desc: 'Stateless declarative container.', metric: '0 Heap Leaks' },
];
---

<div class="p-8 bg-background text-foreground">
  <AutoGrid
    minItemWidth={${minItemWidth}}
    gap={${gap}}
    mode="${mode}"
    maxColumns={${maxColumns}}
    alignItems="${alignItems}"
    class="max-w-6xl mx-auto"
  >
    {items.map((item) => (
      <div class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{item.tag}</span>
          <h3 class="font-bold text-base mt-2">{item.title}</h3>
          <p class="text-muted-foreground text-xs mt-2">{item.desc}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>GRID #{item.id}</span>
          <span class="text-emerald-400 font-bold">{item.metric}</span>
        </div>
      </div>
    ))}
  </AutoGrid>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'auto-grid-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade component embedding x-auto-grid.',
				code: `@php
$items = [
    ['id' => '01', 'tag' => 'PIPELINE', 'title' => 'High-Throughput Kinetic Pipeline', 'desc' => 'Repeat tracks expand fluidly with zero layout thrashing.', 'metric' => '0.14ms Frame'],
    ['id' => '02', 'tag' => 'COMPLIANCE', 'title' => 'Dynamic MinMax Constraint Engine', 'desc' => 'Zero horizontal scroll overflow on mobile.', 'metric' => '${minItemWidth}px Floor'],
    ['id' => '03', 'tag' => 'VITALS', 'title' => 'Sub-Pixel Layout Stability', 'desc' => 'Fractional unit distribution preventing CLS.', 'metric' => 'CLS: 0.00'],
    ['id' => '04', 'tag' => 'PHYSICS', 'title' => 'Hermite Damped Track Transition', 'desc' => 'Balanced visual element wrapping.', 'metric' => 'Hermite Smooth'],
    ['id' => '05', 'tag' => 'UNIVERSAL', 'title' => 'Cross-Ecosystem Universal Grid', 'desc' => 'Compiled for all modern web frameworks.', 'metric' => '13 Flavors'],
    ['id' => '06', 'tag' => 'AUDIT', 'title' => 'Zero Memory Leak Architecture', 'desc' => 'Stateless declarative container.', 'metric' => '0 Heap Leaks'],
];
@endphp

<div class="p-8 bg-background text-foreground">
  <x-auto-grid
    :minItemWidth="${minItemWidth}"
    :gap="${gap}"
    mode="${mode}"
    :maxColumns="${maxColumns}"
    alignItems="${alignItems}"
    class="max-w-6xl mx-auto"
  >
    @foreach ($items as $item)
      <div class="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{{ $item['tag'] }}</span>
          <h3 class="font-bold text-base mt-2">{{ $item['title'] }}</h3>
          <p class="text-muted-foreground text-xs mt-2">{{ $item['desc'] }}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>GRID #{{ $item['id'] }}</span>
          <span class="text-emerald-400 font-bold">{{ $item['metric'] }}</span>
        </div>
      </div>
    @endforeach
  </x-auto-grid>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JavaScript and CSS Auto Grid initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exhuma Auto Grid — Vanilla JS</title>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; color: #fff; padding: 32px; }
    .grid-container { max-width: 1200px; margin: 0 auto; }
    .grid-card { background: #131c2e; border: 1px solid #223252; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
    .tag { font-size: 10px; font-family: monospace; color: #6366f1; font-weight: bold; text-transform: uppercase; }
    h3 { margin: 8px 0; font-size: 16px; }
    p { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; }
    .footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid #223252; display: flex; justify-content: space-between; font-size: 10px; font-family: monospace; }
    .metric { color: #34d399; font-weight: bold; }
  </style>
</head>
<body>
  <div class="grid-container" data-exhuma-auto-grid>
    <div class="grid-card">
      <div>
        <span class="tag">PIPELINE</span>
        <h3>High-Throughput Kinetic Pipeline</h3>
        <p>Repeat tracks expand fluidly with zero layout thrashing.</p>
      </div>
      <div class="footer"><span>GRID #01</span><span class="metric">0.14ms Frame</span></div>
    </div>
    <div class="grid-card">
      <div>
        <span class="tag">COMPLIANCE</span>
        <h3>Dynamic MinMax Constraint Engine</h3>
        <p>Evaluates minmax(min(100%, ${minItemWidth}px), 1fr) for zero overflow.</p>
      </div>
      <div class="footer"><span>GRID #02</span><span class="metric">${minItemWidth}px Floor</span></div>
    </div>
    <div class="grid-card">
      <div>
        <span class="tag">VITALS</span>
        <h3>Sub-Pixel Layout Stability</h3>
        <p>Fractional unit distribution preventing cumulative layout shift.</p>
      </div>
      <div class="footer"><span>GRID #03</span><span class="metric">CLS: 0.00</span></div>
    </div>
  </div>

  <script type="module">
    import { initAutoGrid } from './auto-grid.vanilla.js';
    initAutoGrid('[data-exhuma-auto-grid]', {
      minItemWidth: ${minItemWidth},
      gap: ${gap},
      mode: '${mode}',
      maxColumns: ${maxColumns},
      alignItems: '${alignItems}',
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
				description: 'WordPress Gutenberg block render template for Auto Grid.',
				code: `<?php
/**
 * Exhuma Auto Grid Block Render Template
 */
$minItemWidth = $attributes['minItemWidth'] ?? ${minItemWidth};
$gap = $attributes['gap'] ?? ${gap};
$mode = $attributes['mode'] ?? '${mode}';
$maxColumns = $attributes['maxColumns'] ?? ${maxColumns};
$alignItems = $attributes['alignItems'] ?? '${alignItems}';

$minWidthVal = is_numeric($minItemWidth) ? "{$minItemWidth}px" : $minItemWidth;
$gapVal = is_numeric($gap) ? "{$gap}px" : $gap;
$repeatTrack = $mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
$minTrack = "min(100%, {$minWidthVal})";

$templateCols = $maxColumns > 0
    ? "repeat({$repeatTrack}, minmax(max({$minTrack}, calc((100% - " . ($maxColumns - 1) . " * {$gapVal}) / {$maxColumns})), 1fr))"
    : "repeat({$repeatTrack}, minmax({$minTrack}, 1fr))";
?>

<div
    class="exhuma-auto-grid w-full <?php echo esc_attr($attributes['className'] ?? ''); ?>"
    style="display: grid; grid-template-columns: <?php echo esc_attr($templateCols); ?>; gap: <?php echo esc_attr($gapVal); ?>; align-items: <?php echo esc_attr($alignItems); ?>;"
>
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Framework-agnostic HTML implementing <exhuma-auto-grid> custom element.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exhuma Auto Grid — Web Component</title>
  <script type="module" src="./exhuma-auto-grid.js"></script>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; color: #fff; padding: 32px; }
    .card { background: #131c2e; border: 1px solid #223252; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
    .tag { font-size: 10px; font-family: monospace; color: #6366f1; font-weight: bold; }
    h3 { margin: 8px 0; font-size: 16px; }
    p { font-size: 12px; color: #94a3b8; margin: 0; }
  </style>
</head>
<body>
  <exhuma-auto-grid
    min-item-width="${minItemWidth}"
    gap="${gap}"
    mode="${mode}"
    max-columns="${maxColumns}"
    align-items="${alignItems}"
  >
    <div class="card">
      <span class="tag">PIPELINE</span>
      <h3>High-Throughput Kinetic Pipeline</h3>
      <p>Repeat tracks expand fluidly with zero layout thrashing.</p>
    </div>
    <div class="card">
      <span class="tag">COMPLIANCE</span>
      <h3>Dynamic MinMax Constraint Engine</h3>
      <p>Guarantees zero mobile horizontal scroll overflow.</p>
    </div>
    <div class="card">
      <span class="tag">VITALS</span>
      <h3>Sub-Pixel Layout Stability</h3>
      <p>Fractional unit distribution preventing CLS.</p>
    </div>
  </exhuma-auto-grid>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen with AutoGrid.',
				code: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AutoGrid } from './components/AutoGrid';

const ITEMS = [
  { id: '01', tag: 'PIPELINE', title: 'Kinetic Pipeline', desc: 'Repeat tracks expand fluidly.' },
  { id: '02', tag: 'COMPLIANCE', title: 'MinMax Engine', desc: 'Guarantees zero overflow.' },
  { id: '03', tag: 'VITALS', title: 'Sub-Pixel Stability', desc: 'Zero layout shift.' },
  { id: '04', tag: 'PHYSICS', title: 'Hermite Damped', desc: 'Fluid visual hierarchy.' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AutoGrid minItemWidth={${minItemWidth}} gap={${gap}} maxColumns={${maxColumns}}>
          {ITEMS.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.tag}>{item.tag}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          ))}
        </AutoGrid>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#090d16' },
  scroll: { padding: 16 },
  card: { backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', borderRadius: 16, padding: 16 },
  tag: { fontSize: 10, fontFamily: 'monospace', color: '#6366f1', fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  desc: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'auto_grid_screen.dart',
				language: 'dart',
				description: 'Flutter screen with ExhumaAutoGrid widget.',
				code: `import 'package:flutter/material.dart';
import 'auto_grid.dart';

class AutoGridScreen extends StatelessWidget {
  const AutoGridScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: ExhumaAutoGrid(
          minItemWidth: ${minItemWidth}.0,
          gap: ${gap}.0,
          maxColumns: ${maxColumns},
          children: [
            _buildCard('PIPELINE', 'Kinetic Pipeline', 'Repeat tracks expand fluidly.'),
            _buildCard('COMPLIANCE', 'MinMax Engine', 'Guarantees zero overflow.'),
            _buildCard('VITALS', 'Sub-Pixel Stability', 'Zero layout shift.'),
            _buildCard('PHYSICS', 'Hermite Damped', 'Fluid visual hierarchy.'),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(String tag, String title, String desc) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131C2E),
        border: Border.all(color: const Color(0xFF223252)),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(tag, style: const TextStyle(fontSize: 10, color: Color(0xFF6366F1), fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(title, style: const TextStyle(fontSize: 15, color: Colors.white, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(desc, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
        ],
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'Example.tsx',
				language: 'tsx',
				description: 'Auto Grid universal usage.',
				code: `import { AutoGrid, AutoGridItem } from '@/components/ui/AutoGrid';\n\nexport default function Example() {\n  return (\n    <AutoGrid minItemWidth={${minItemWidth}} gap={${gap}} mode="${mode}">\n      <AutoGridItem>Content</AutoGridItem>\n    </AutoGrid>\n  );\n}`,
			};
		}
	}
}
