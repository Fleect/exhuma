import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getCssMasonryOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const columns = Number(props.columns ?? 1);
	const columnsSm = Number(props.columnsSm ?? 2);
	const columnsMd = Number(props.columnsMd ?? 2);
	const columnsLg = Number(props.columnsLg ?? 3);
	const columnsXl = Number(props.columnsXl ?? 4);
	const gap = Number(props.gap ?? 16);
	const columnFill = (props.columnFill as string) ?? 'balance';
	const height = Number(props.height ?? 0);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'CssMasonry.tsx',
					language: 'tsx',
					description: 'CSS Masonry — Standalone Ejected Engine (Zero Dependencies). Pure CSS multi-column layout with container queries inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface CssMasonryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  breakInside?: 'avoid' | 'auto';
}

/**
 * CssMasonryItem — Standalone compound item preventing fragmentation across columns.
 */
export const CssMasonryItem = React.forwardRef<HTMLDivElement, CssMasonryItemProps>(
  ({ children, breakInside = 'avoid', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('exhuma-masonry-item inline-block w-full', className)}
        style={{
          breakInside: breakInside === 'avoid' ? 'avoid-column' : breakInside,
          pageBreakInside: 'avoid',
          display: 'inline-block',
          width: '100%',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CssMasonryItem.displayName = 'CssMasonryItem';

export interface CssMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  columnFill?: 'balance' | 'auto';
  height?: number;
}

/**
 * CssMasonry — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) multi-column CSS layout.
 * - Zero forced reflows or synchronous DOM measurements.
 * - Hardware compositor acceleration with break-inside-avoid protection.
 * - Supports balanced heights or deterministic sequential auto waterfall.
 */
export const CssMasonry = React.forwardRef<HTMLDivElement, CssMasonryProps>(
  (
    {
      children,
      columns = ${columns},
      columnsSm = ${columnsSm},
      columnsMd = ${columnsMd},
      columnsLg = ${columnsLg},
      columnsXl = ${columnsXl},
      gap = ${gap},
      columnFill = '${columnFill}',
      height = ${height},
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerStyle: React.CSSProperties = {
      columnCount: columns,
      columnGap: \`\${gap}px\`,
      columnFill: columnFill === 'auto' ? 'auto' : 'balance',
      height: columnFill === 'auto' && height && height > 0 ? \`\${height}px\` : undefined,
      overflowY: columnFill === 'auto' && height && height > 0 ? 'auto' : undefined,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'exhuma-css-masonry w-full',
          columnsSm && \`sm:[column-count:\${columnsSm}]\`,
          columnsMd && \`md:[column-count:\${columnsMd}]\`,
          columnsLg && \`lg:[column-count:\${columnsLg}]\`,
          columnsXl && \`xl:[column-count:\${columnsXl}]\`,
          className
        )}
        style={containerStyle}
        {...props}
      >
        {React.Children.map(children, (child) => (
          <div
            className="break-inside-avoid"
            style={{ marginBottom: \`\${gap}px\` }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);
CssMasonry.displayName = 'CssMasonry';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'CssMasonry.vue',
					language: 'vue',
					description: 'Vue 3 Native CSS Masonry multi-column layout component.',
					code: `<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  columnFill?: 'balance' | 'auto';
  height?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  columns: ${columns},
  columnsSm: ${columnsSm},
  columnsMd: ${columnsMd},
  columnsLg: ${columnsLg},
  columnsXl: ${columnsXl},
  gap: ${gap},
  columnFill: '${columnFill}',
  height: ${height},
  class: '',
});

const containerStyle = computed(() => ({
  columnCount: props.columns,
  columnGap: \`\${props.gap}px\`,
  columnFill: props.columnFill === 'auto' ? 'auto' : 'balance',
  height: props.columnFill === 'auto' && props.height > 0 ? \`\${props.height}px\` : undefined,
  overflowY: props.columnFill === 'auto' && props.height > 0 ? 'auto' : undefined,
}));
</script>

<template>
  <div
    class="exhuma-css-masonry w-full"
    :class="[
      props.columnsSm ? \`sm:[column-count:\${props.columnsSm}]\` : '',
      props.columnsMd ? \`md:[column-count:\${props.columnsMd}]\` : '',
      props.columnsLg ? \`lg:[column-count:\${props.columnsLg}]\` : '',
      props.columnsXl ? \`xl:[column-count:\${props.columnsXl}]\` : '',
      props.class,
    ]"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
:deep(> *) {
  break-inside: avoid;
  margin-bottom: v-bind('\`\${props.gap}px\`');
}
</style>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'CssMasonry.svelte',
					language: 'svelte',
					description: 'Svelte 5 Runes CSS Masonry multi-column layout component.',
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    columns = ${columns},
    columnsSm = ${columnsSm},
    columnsMd = ${columnsMd},
    columnsLg = ${columnsLg},
    columnsXl = ${columnsXl},
    gap = ${gap},
    columnFill = '${columnFill}',
    height = ${height},
    class: className = '',
    children,
    ...restProps
  }: {
    columns?: number;
    columnsSm?: number;
    columnsMd?: number;
    columnsLg?: number;
    columnsXl?: number;
    gap?: number;
    columnFill?: 'balance' | 'auto';
    height?: number;
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<div
  class={clsx(
    'exhuma-css-masonry w-full',
    columnsSm && \`sm:[column-count:\${columnsSm}]\`,
    columnsMd && \`md:[column-count:\${columnsMd}]\`,
    columnsLg && \`lg:[column-count:\${columnsLg}]\`,
    columnsXl && \`xl:[column-count:\${columnsXl}]\`,
    className
  )}
  style="column-count: {columns}; column-gap: {gap}px; column-fill: {columnFill}; {columnFill === 'auto' && height > 0 ? \`height: \${height}px; overflow-y: auto;\` : ''}"
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  :global(.exhuma-css-masonry > *) {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap, ${gap}px);
  }
</style>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'CssMasonry.tsx',
					language: 'tsx',
					description: 'SolidJS Native CSS Masonry multi-column component.',
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface CssMasonryProps extends JSX.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  columnFill?: 'balance' | 'auto';
  height?: number;
}

export const CssMasonry: Component<CssMasonryProps> = (props) => {
  const [local, others] = splitProps(props, [
    'columns',
    'columnsSm',
    'columnsMd',
    'columnsLg',
    'columnsXl',
    'gap',
    'columnFill',
    'height',
    'class',
    'children',
    'style',
  ]);

  const columns = () => local.columns ?? ${columns};
  const columnsSm = () => local.columnsSm ?? ${columnsSm};
  const columnsMd = () => local.columnsMd ?? ${columnsMd};
  const columnsLg = () => local.columnsLg ?? ${columnsLg};
  const columnsXl = () => local.columnsXl ?? ${columnsXl};
  const gap = () => local.gap ?? ${gap};
  const columnFill = () => local.columnFill ?? '${columnFill}';
  const height = () => local.height ?? ${height};

  return (
    <div
      class={\`exhuma-css-masonry w-full \${columnsSm() ? \`sm:[column-count:\${columnsSm()}] \` : ''}\${columnsMd() ? \`md:[column-count:\${columnsMd()}] \` : ''}\${columnsLg() ? \`lg:[column-count:\${columnsLg}] \` : ''}\${columnsXl() ? \`xl:[column-count:\${columnsXl()}] \` : ''}\${local.class ?? ''}\`}
      style={{
        'column-count': columns(),
        'column-gap': \`\${gap()}px\`,
        'column-fill': columnFill() === 'auto' ? 'auto' : 'balance',
        ...(columnFill() === 'auto' && height() > 0 ? { height: \`\${height()}px\`, 'overflow-y': 'auto' } : {}),
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
					filename: 'css-masonry.component.ts',
					language: 'typescript',
					description: 'Angular 18+ standalone CSS Masonry component.',
					code: `import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-css-masonry',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      class="exhuma-css-masonry w-full {{ className() }}"
      [style.columnCount]="columns()"
      [style.columnGap]="gap() + 'px'"
      [style.columnFill]="columnFill()"
      [style.height]="columnFill() === 'auto' && height() > 0 ? height() + 'px' : null"
      [style.overflowY]="columnFill() === 'auto' && height() > 0 ? 'auto' : null"
    >
      <ng-content />
    </div>
  \`,
  styles: [\`
    :host ::ng-deep .exhuma-css-masonry > * {
      break-inside: avoid;
      margin-bottom: ${gap}px;
    }
  \`],
})
export class ExhumaCssMasonryComponent {
  columns = input<number>(${columns});
  columnsSm = input<number>(${columnsSm});
  columnsMd = input<number>(${columnsMd});
  columnsLg = input<number>(${columnsLg});
  columnsXl = input<number>(${columnsXl});
  gap = input<number>(${gap});
  columnFill = input<'balance' | 'auto'>('${columnFill}');
  height = input<number>(${height});
  className = input<string>('');
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'CssMasonry.astro',
					language: 'astro',
					description: 'Astro zero-JS CSS Masonry component.',
					code: `---
interface Props {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  columnFill?: 'balance' | 'auto';
  height?: number;
  class?: string;
}

const {
  columns = ${columns},
  columnsSm = ${columnsSm},
  columnsMd = ${columnsMd},
  columnsLg = ${columnsLg},
  columnsXl = ${columnsXl},
  gap = ${gap},
  columnFill = '${columnFill}',
  height = ${height},
  class: className = '',
} = Astro.props;
---

<div
  class:list={[
    'exhuma-css-masonry w-full',
    columnsSm && \`sm:[column-count:\${columnsSm}]\`,
    columnsMd && \`md:[column-count:\${columnsMd}]\`,
    columnsLg && \`lg:[column-count:\${columnsLg}]\`,
    columnsXl && \`xl:[column-count:\${columnsXl}]\`,
    className,
  ]}
  style={{
    columnCount: columns,
    columnGap: \`\${gap}px\`,
    columnFill: columnFill === 'auto' ? 'auto' : 'balance',
    height: columnFill === 'auto' && height > 0 ? \`\${height}px\` : undefined,
    overflowY: columnFill === 'auto' && height > 0 ? 'auto' : undefined,
  }}
>
  <slot />
</div>

<style>
  .exhuma-css-masonry > :global(*) {
    break-inside: avoid;
    margin-bottom: var(--masonry-gap, 16px);
  }
</style>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-css-masonry.js',
					language: 'javascript',
					description: 'Framework-agnostic Web Component for CSS Masonry.',
					code: `class ExhumaCssMasonry extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'gap', 'column-fill', 'height'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const cols = this.getAttribute('columns') || '${columns}';
    const gap = this.getAttribute('gap') || '${gap}';
    const fill = this.getAttribute('column-fill') || '${columnFill}';
    const height = parseInt(this.getAttribute('height') || '${height}', 10);

    this.style.display = 'block';
    this.style.width = '100%';
    this.style.columnCount = cols;
    this.style.columnGap = \`\${gap}px\`;
    this.style.columnFill = fill === 'auto' ? 'auto' : 'balance';

    if (fill === 'auto' && height > 0) {
      this.style.height = \`\${height}px\`;
      this.style.overflowY = 'auto';
    }
  }
}

if (!customElements.get('exhuma-css-masonry')) {
  customElements.define('exhuma-css-masonry', ExhumaCssMasonry);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'css-masonry.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JavaScript CSS Masonry initializer.',
					code: `export function initCssMasonry(selector = '[data-exhuma-css-masonry]', options = {}) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const cols = options.columns ?? el.dataset.columns ?? ${columns};
    const gap = options.gap ?? el.dataset.gap ?? ${gap};
    const fill = options.columnFill ?? el.dataset.columnFill ?? '${columnFill}';
    const height = options.height ?? parseInt(el.dataset.height || '${height}', 10);

    el.style.columnCount = cols;
    el.style.columnGap = \`\${gap}px\`;
    el.style.columnFill = fill === 'auto' ? 'auto' : 'balance';

    if (fill === 'auto' && height > 0) {
      el.style.height = \`\${height}px\`;
      el.style.overflowY = 'auto';
    }

    Array.from(el.children).forEach((child) => {
      child.style.breakInside = 'avoid';
      child.style.marginBottom = \`\${gap}px\`;
    });
  });
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'css-masonry.blade.php',
					language: 'php',
					description: 'Laravel Blade component for CSS Masonry.',
					code: `@props([
    'columns' => ${columns},
    'columnsSm' => ${columnsSm},
    'columnsMd' => ${columnsMd},
    'columnsLg' => ${columnsLg},
    'columnsXl' => ${columnsXl},
    'gap' => ${gap},
    'columnFill' => '${columnFill}',
    'height' => ${height},
    'class' => '',
])

<div
    {{ $attributes->merge(['class' => 'exhuma-css-masonry w-full ' . $class]) }}
    style="column-count: {{ $columns }}; column-gap: {{ $gap }}px; column-fill: {{ $columnFill }}; {{ $columnFill === 'auto' && $height > 0 ? "height: {$height}px; overflow-y: auto;" : '' }}"
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
					description: 'WordPress Gutenberg block render template for CSS Masonry.',
					code: `<?php
/**
 * Exhuma CSS Masonry Block Render Template
 */
$columns = $attributes['columns'] ?? ${columns};
$gap = $attributes['gap'] ?? ${gap};
$columnFill = $attributes['columnFill'] ?? '${columnFill}';
$height = $attributes['height'] ?? ${height};
?>

<div
    class="exhuma-css-masonry w-full <?php echo esc_attr($attributes['className'] ?? ''); ?>"
    style="column-count: <?php echo esc_attr($columns); ?>; column-gap: <?php echo esc_attr($gap); ?>px; column-fill: <?php echo esc_attr($columnFill); ?>; <?php echo $columnFill === 'auto' && $height > 0 ? "height: {$height}px; overflow-y: auto;" : ''; ?>"
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
					filename: 'CssMasonry.tsx',
					language: 'tsx',
					description: 'React Native dual-column vertical Masonry layout component.',
					code: `import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

export interface CssMasonryProps extends ViewProps {
  columns?: number;
  gap?: number;
}

export const CssMasonry: React.FC<CssMasonryProps> = ({
  children,
  columns = 2,
  gap = ${gap},
  style,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const columnBuckets: React.ReactNode[][] = Array.from({ length: columns }, () => []);

  childArray.forEach((child, index) => {
    columnBuckets[index % columns].push(child);
  });

  return (
    <View style={[styles.container, { gap }, style]} {...props}>
      {columnBuckets.map((bucket, colIdx) => (
        <View key={colIdx} style={[styles.column, { gap }]}>
          {bucket}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
  column: {
    flex: 1,
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
					filename: 'css_masonry.dart',
					language: 'dart',
					description: 'Flutter dual-column Masonry layout widget.',
					code: `import 'package:flutter/material.dart';

class ExhumaCssMasonry extends StatelessWidget {
  final List<Widget> children;
  final int columns;
  final double gap;

  const ExhumaCssMasonry({
    super.key,
    required this.children,
    this.columns = 2,
    this.gap = ${gap}.0,
  });

  @override
  Widget build(BuildContext context) {
    final List<List<Widget>> buckets = List.generate(columns, (_) => []);

    for (var i = 0; i < children.length; i++) {
      buckets[i % columns].add(children[i]);
      if (i < children.length - 1) {
        buckets[i % columns].add(SizedBox(height: gap));
      }
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < buckets.length; i++) ...[
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: buckets[i],
            ),
          ),
          if (i < buckets.length - 1) SizedBox(width: gap),
        ],
      ],
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

export function getCssMasonryUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const columns = Number(props.columns ?? 1);
	const columnsSm = Number(props.columnsSm ?? 2);
	const columnsMd = Number(props.columnsMd ?? 2);
	const columnsLg = Number(props.columnsLg ?? 3);
	const columnsXl = Number(props.columnsXl ?? 4);
	const gap = Number(props.gap ?? 16);
	const columnFill = (props.columnFill as string) ?? 'balance';
	const height = Number(props.height ?? 0);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 App Router page with CssMasonry gallery.',
				code: `'use client';

import React from 'react';
import { CssMasonry } from '@/components/ui/CssMasonry';

const TILES = [
  { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited multi-column tracks with zero reflow penalties.', heightClass: 'h-48', tag: '01 // GPU' },
  { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally across column partitions without clipping.', heightClass: 'h-64', tag: '02 // CASCADE' },
  { id: '03', title: 'Break-Inside Isolation', desc: 'Native CSS fragmentation protection preventing boundary fracture.', heightClass: 'h-40', tag: '03 // ISOLATION' },
  { id: '04', title: 'Sequential Auto Waterfall', desc: 'Height-bounded deterministic layout filling columns in priority sequence.', heightClass: 'h-72', tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling spanning mobile (1 col) to ultra-wide (4+ cols).', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Stateless declarative container with zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
  { id: '07', title: 'Universal Compilation', desc: 'Single unified layout engine compiled for all 13 supported ecosystems.', heightClass: 'h-60', tag: '07 // CROSS-PLATFORM' },
  { id: '08', title: 'Sub-Millisecond V-Sync', desc: 'Zero JavaScript execution during scroll, guaranteeing 120 FPS render.', heightClass: 'h-48', tag: '08 // V-SYNC' },
];

export default function MasonryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          EXHUMA LAYOUT ENGINE // CSS MASONRY
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          Hardware-Accelerated CSS Masonry
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
          Pure CSS multi-column waterfall with automatic break-inside protection and responsive container scaling.
        </p>
      </div>

      <CssMasonry
        columns={${columns}}
        columnsSm={${columnsSm}}
        columnsMd={${columnsMd}}
        columnsLg={${columnsLg}}
        columnsXl={${columnsXl}}
        gap={${gap}}
        columnFill="${columnFill}"
        ${height > 0 ? `height={${height}}\n        ` : ''}className="max-w-6xl mx-auto"
      >
        {TILES.map((tile) => (
          <div
            key={tile.id}
            className={\`\${tile.heightClass} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg\`}
          >
            <div>
              <span className="text-3xs font-mono font-bold text-primary">{tile.tag}</span>
              <h3 className="font-bold text-base mt-2">{tile.title}</h3>
              <p className="text-muted-foreground text-xs mt-2">{tile.desc}</p>
            </div>
            <div className="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono text-muted-foreground">
              <span>TILE #{tile.id}</span>
              <span className="text-emerald-400 font-bold">120 FPS</span>
            </div>
          </div>
        ))}
      </CssMasonry>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'CssMasonryDemo.tsx',
				language: 'tsx',
				description: 'React + Vite demo showcasing CSS Masonry.',
				code: `import React from 'react';
import { CssMasonry } from '@/components/ui/CssMasonry';

const TILES = [
  { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited multi-column tracks with zero reflow penalties.', heightClass: 'h-48', tag: '01 // GPU' },
  { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally across column partitions without clipping.', heightClass: 'h-64', tag: '02 // CASCADE' },
  { id: '03', title: 'Break-Inside Isolation', desc: 'Native CSS fragmentation protection preventing boundary fracture.', heightClass: 'h-40', tag: '03 // ISOLATION' },
  { id: '04', title: 'Sequential Auto Waterfall', desc: 'Height-bounded deterministic layout filling columns in priority sequence.', heightClass: 'h-72', tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling spanning mobile (1 col) to ultra-wide (4+ cols).', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Stateless declarative container with zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
  { id: '07', title: 'Universal Compilation', desc: 'Single unified layout engine compiled for all 13 supported ecosystems.', heightClass: 'h-60', tag: '07 // CROSS-PLATFORM' },
  { id: '08', title: 'Sub-Millisecond V-Sync', desc: 'Zero JavaScript execution during scroll, guaranteeing 120 FPS render.', heightClass: 'h-48', tag: '08 // V-SYNC' },
];

export function CssMasonryDemo() {
  return (
    <section className="p-8 bg-background text-foreground">
      <CssMasonry
        columns={${columns}}
        columnsSm={${columnsSm}}
        columnsMd={${columnsMd}}
        columnsLg={${columnsLg}}
        columnsXl={${columnsXl}}
        gap={${gap}}
        columnFill="${columnFill}"
        ${height > 0 ? `height={${height}}\n        ` : ''}className="max-w-6xl mx-auto"
      >
        {TILES.map((tile) => (
          <div
            key={tile.id}
            className={\`\${tile.heightClass} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between\`}
          >
            <div>
              <span className="text-3xs font-mono font-bold text-primary">{tile.tag}</span>
              <h3 className="font-bold text-base mt-2">{tile.title}</h3>
              <p className="text-muted-foreground text-xs mt-2">{tile.desc}</p>
            </div>
            <div className="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono text-muted-foreground">
              <span>TILE #{tile.id}</span>
              <span className="text-emerald-400 font-bold">120 FPS</span>
            </div>
          </div>
        ))}
      </CssMasonry>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'CssMasonryDemo.vue',
				language: 'vue',
				description: 'Vue 3 Single File Component utilizing CssMasonry.',
				code: `<script setup lang="ts">
import CssMasonry from '@/components/ui/CssMasonry.vue';

const tiles = [
  { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited multi-column tracks.', heightClass: 'h-48', tag: '01 // GPU' },
  { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally across columns.', heightClass: 'h-64', tag: '02 // CASCADE' },
  { id: '03', title: 'Break-Inside Isolation', desc: 'Native CSS fragmentation protection.', heightClass: 'h-40', tag: '03 // ISOLATION' },
  { id: '04', title: 'Sequential Auto Waterfall', desc: 'Deterministic priority filling.', heightClass: 'h-72', tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling.', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
];
</script>

<template>
  <main class="p-8 bg-background text-foreground">
    <CssMasonry
      :columns="${columns}"
      :columns-sm="${columnsSm}"
      :columns-md="${columnsMd}"
      :columns-lg="${columnsLg}"
      :columns-xl="${columnsXl}"
      :gap="${gap}"
      column-fill="${columnFill}"
      ${height > 0 ? `:height="${height}"\n      ` : ''}class="max-w-6xl mx-auto"
    >
      <div
        v-for="tile in tiles"
        :key="tile.id"
        class="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between"
        :class="tile.heightClass"
      >
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{{ tile.tag }}</span>
          <h3 class="font-bold text-base mt-2">{{ tile.title }}</h3>
          <p class="text-muted-foreground text-xs mt-2">{{ tile.desc }}</p>
        </div>
        <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>TILE #{{ tile.id }}</span>
          <span class="text-emerald-400 font-bold">120 FPS</span>
        </div>
      </div>
    </CssMasonry>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'CssMasonryDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes component embedding CssMasonry.',
				code: `<script lang="ts">
  import CssMasonry from '$lib/components/CssMasonry.svelte';

  const tiles = [
    { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited multi-column tracks.', heightClass: 'h-48', tag: '01 // GPU' },
    { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally across columns.', heightClass: 'h-64', tag: '02 // CASCADE' },
    { id: '03', title: 'Break-Inside Isolation', desc: 'Native CSS fragmentation protection.', heightClass: 'h-40', tag: '03 // ISOLATION' },
    { id: '04', title: 'Sequential Auto Waterfall', desc: 'Deterministic priority filling.', heightClass: 'h-72', tag: '04 // WATERFALL' },
    { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling.', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
    { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
  ];
</script>

<div class="p-8 bg-background text-foreground">
  <CssMasonry
    columns={${columns}}
    columnsSm={${columnsSm}}
    columnsMd={${columnsMd}}
    columnsLg={${columnsLg}}
    columnsXl={${columnsXl}}
    gap={${gap}}
    columnFill="${columnFill}"
    ${height > 0 ? `height={${height}}\n    ` : ''}class="max-w-6xl mx-auto"
  >
    {#each tiles as tile}
      <div class="{tile.heightClass} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{tile.tag}</span>
          <h3 class="font-bold text-base mt-2">{tile.title}</h3>
          <p class="text-muted-foreground text-xs mt-2">{tile.desc}</p>
        </div>
        <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>TILE #{tile.id}</span>
          <span class="text-emerald-400 font-bold">120 FPS</span>
        </div>
      </div>
    {/each}
  </CssMasonry>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'CssMasonryDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with fine-grained reactive CssMasonry.',
				code: `import { Component, For } from 'solid-js';
import { CssMasonry } from '@/components/ui/CssMasonry';

const TILES = [
  { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited tracks.', heightClass: 'h-48', tag: '01 // GPU' },
  { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally.', heightClass: 'h-64', tag: '02 // CASCADE' },
  { id: '03', title: 'Break-Inside Isolation', desc: 'Native fragmentation protection.', heightClass: 'h-40', tag: '03 // ISOLATION' },
  { id: '04', title: 'Sequential Auto Waterfall', desc: 'Deterministic priority filling.', heightClass: 'h-72', tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling.', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
];

export const CssMasonryDemo: Component = () => {
  return (
    <div class="p-8 bg-background text-foreground">
      <CssMasonry
        columns={${columns}}
        columnsSm={${columnsSm}}
        columnsMd={${columnsMd}}
        columnsLg={${columnsLg}}
        columnsXl={${columnsXl}}
        gap={${gap}}
        columnFill="${columnFill}"
        ${height > 0 ? `height={${height}}\n        ` : ''}class="max-w-6xl mx-auto"
      >
        <For each={TILES}>
          {(tile) => (
            <div class={\`\${tile.heightClass} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between\`}>
              <div>
                <span class="text-3xs font-mono font-bold text-primary">{tile.tag}</span>
                <h3 class="font-bold text-base mt-2">{tile.title}</h3>
                <p class="text-muted-foreground text-xs mt-2">{tile.desc}</p>
              </div>
              <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
                <span>TILE #{tile.id}</span>
                <span class="text-emerald-400 font-bold">120 FPS</span>
              </div>
            </div>
          )}
        </For>
      </CssMasonry>
    </div>
  );
};

export default CssMasonryDemo;
`,
			};
		}

		case 'angular': {
			return {
				filename: 'css-masonry-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone component importing ExhumaCssMasonryComponent.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaCssMasonryComponent } from './components/css-masonry.component';

@Component({
  selector: 'app-css-masonry-demo',
  standalone: true,
  imports: [CommonModule, ExhumaCssMasonryComponent],
  template: \`
    <div class="p-8 bg-background text-foreground">
      <exhuma-css-masonry
        [columns]="${columns}"
        [columnsSm]="${columnsSm}"
        [columnsMd]="${columnsMd}"
        [columnsLg]="${columnsLg}"
        [columnsXl]="${columnsXl}"
        [gap]="${gap}"
        columnFill="${columnFill}"
        [height]="${height}"
        className="max-w-6xl mx-auto"
      >
        @for (tile of tiles; track tile.id) {
          <div [class]="tile.heightClass + ' rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between'">
            <div>
              <span class="text-3xs font-mono font-bold text-primary">{{ tile.tag }}</span>
              <h3 class="font-bold text-base mt-2">{{ tile.title }}</h3>
              <p class="text-muted-foreground text-xs mt-2">{{ tile.desc }}</p>
            </div>
            <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
              <span>TILE #{{ tile.id }}</span>
              <span class="text-emerald-400 font-bold">120 FPS</span>
            </div>
          </div>
        }
      </exhuma-css-masonry>
    </div>
  \`,
})
export class CssMasonryDemoComponent {
  tiles = [
    { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited tracks.', heightClass: 'h-48', tag: '01 // GPU' },
    { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally.', heightClass: 'h-64', tag: '02 // CASCADE' },
    { id: '03', title: 'Break-Inside Isolation', desc: 'Native fragmentation protection.', heightClass: 'h-40', tag: '03 // ISOLATION' },
    { id: '04', title: 'Sequential Auto Waterfall', desc: 'Deterministic priority filling.', heightClass: 'h-72', tag: '04 // WATERFALL' },
    { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling.', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
    { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
  ];
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'CssMasonryDemo.astro',
				language: 'astro',
				description: 'Zero-JS Astro component leveraging pure CSS CssMasonry.',
				code: `---
import CssMasonry from '@/components/ui/CssMasonry.astro';

const tiles = [
  { id: '01', title: 'Quantum Sub-Pixel Masonry', desc: 'Hardware-composited tracks.', heightClass: 'h-48', tag: '01 // GPU' },
  { id: '02', title: 'Continuous Fluid Flow', desc: 'Elements cascade naturally.', heightClass: 'h-64', tag: '02 // CASCADE' },
  { id: '03', title: 'Break-Inside Isolation', desc: 'Native fragmentation protection.', heightClass: 'h-40', tag: '03 // ISOLATION' },
  { id: '04', title: 'Sequential Auto Waterfall', desc: 'Deterministic priority filling.', heightClass: 'h-72', tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Container-aware column scaling.', heightClass: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Memory-Safe Lifecycle', desc: 'Zero persistent listeners.', heightClass: 'h-44', tag: '06 // ZERO-LEAK' },
];
---

<div class="p-8 bg-background text-foreground">
  <CssMasonry
    columns={${columns}}
    columnsSm={${columnsSm}}
    columnsMd={${columnsMd}}
    columnsLg={${columnsLg}}
    columnsXl={${columnsXl}}
    gap={${gap}}
    columnFill="${columnFill}"
    ${height > 0 ? `height={${height}}\n    ` : ''}class="max-w-6xl mx-auto"
  >
    {tiles.map((tile) => (
      <div class={\`\${tile.heightClass} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between\`}>
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{tile.tag}</span>
          <h3 class="font-bold text-base mt-2">{tile.title}</h3>
          <p class="text-muted-foreground text-xs mt-2">{tile.desc}</p>
        </div>
        <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>TILE #{tile.id}</span>
          <span class="text-emerald-400 font-bold">120 FPS</span>
        </div>
      </div>
    ))}
  </CssMasonry>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'css-masonry-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade component embedding x-css-masonry.',
				code: `@php
$tiles = [
    ['id' => '01', 'title' => 'Quantum Sub-Pixel Masonry', 'desc' => 'Hardware-composited tracks.', 'heightClass' => 'h-48', 'tag' => '01 // GPU'],
    ['id' => '02', 'title' => 'Continuous Fluid Flow', 'desc' => 'Elements cascade naturally.', 'heightClass' => 'h-64', 'tag' => '02 // CASCADE'],
    ['id' => '03', 'title' => 'Break-Inside Isolation', 'desc' => 'Native fragmentation protection.', 'heightClass' => 'h-40', 'tag' => '03 // ISOLATION'],
    ['id' => '04', 'title' => 'Sequential Auto Waterfall', 'desc' => 'Deterministic priority filling.', 'heightClass' => 'h-72', 'tag' => '04 // WATERFALL'],
    ['id' => '05', 'title' => 'Adaptive Breakpoints', 'desc' => 'Container-aware column scaling.', 'heightClass' => 'h-52', 'tag' => '05 // ADAPTIVE'],
    ['id' => '06', 'title' => 'Memory-Safe Lifecycle', 'desc' => 'Zero persistent listeners.', 'heightClass' => 'h-44', 'tag' => '06 // ZERO-LEAK'],
];
@endphp

<div class="p-8 bg-background text-foreground">
  <x-css-masonry
    :columns="${columns}"
    :columnsSm="${columnsSm}"
    :columnsMd="${columnsMd}"
    :columnsLg="${columnsLg}"
    :columnsXl="${columnsXl}"
    :gap="${gap}"
    columnFill="${columnFill}"
    :height="${height}"
    class="max-w-6xl mx-auto"
  >
    @foreach ($tiles as $tile)
      <div class="{{ $tile['heightClass'] }} rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between">
        <div>
          <span class="text-3xs font-mono font-bold text-primary">{{ $tile['tag'] }}</span>
          <h3 class="font-bold text-base mt-2">{{ $tile['title'] }}</h3>
          <p class="text-muted-foreground text-xs mt-2">{{ $tile['desc'] }}</p>
        </div>
        <div class="pt-3 border-t border-border/40 flex justify-between text-3xs font-mono">
          <span>TILE #{{ $tile['id'] }}</span>
          <span class="text-emerald-400 font-bold">120 FPS</span>
        </div>
      </div>
    @endforeach
  </x-css-masonry>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JavaScript and CSS Masonry initialization.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exhuma CSS Masonry — Vanilla JS</title>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; color: #fff; padding: 32px; }
    .masonry-container { max-width: 1200px; margin: 0 auto; }
    .masonry-tile { background: #131c2e; border: 1px solid #223252; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; break-inside: avoid; }
    .h-48 { height: 192px; }
    .h-64 { height: 256px; }
    .h-40 { height: 160px; }
    .h-52 { height: 208px; }
    .tag { font-size: 10px; font-family: monospace; color: #6366f1; font-weight: bold; }
    h3 { margin: 8px 0; font-size: 16px; }
    p { font-size: 12px; color: #94a3b8; margin: 0; }
  </style>
</head>
<body>
  <div class="masonry-container" data-exhuma-css-masonry>
    <div class="masonry-tile h-48">
      <div><span class="tag">01 // GPU</span><h3>Quantum Sub-Pixel Masonry</h3><p>Hardware-composited tracks.</p></div>
    </div>
    <div class="masonry-tile h-64">
      <div><span class="tag">02 // CASCADE</span><h3>Continuous Fluid Flow</h3><p>Elements cascade naturally.</p></div>
    </div>
    <div class="masonry-tile h-40">
      <div><span class="tag">03 // ISOLATION</span><h3>Break-Inside Isolation</h3><p>Native fragmentation protection.</p></div>
    </div>
    <div class="masonry-tile h-52">
      <div><span class="tag">04 // ADAPTIVE</span><h3>Adaptive Breakpoints</h3><p>Container-aware column scaling.</p></div>
    </div>
  </div>

  <script type="module">
    import { initCssMasonry } from './css-masonry.vanilla.js';
    initCssMasonry('[data-exhuma-css-masonry]', {
      columns: ${columns},
      gap: ${gap},
      columnFill: '${columnFill}',
      height: ${height},
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
				description: 'WordPress Gutenberg block render template for CSS Masonry.',
				code: `<?php
/**
 * Exhuma CSS Masonry Block Render Template
 */
$columns = $attributes['columns'] ?? ${columns};
$gap = $attributes['gap'] ?? ${gap};
$columnFill = $attributes['columnFill'] ?? '${columnFill}';
$height = $attributes['height'] ?? ${height};
?>

<div
    class="exhuma-css-masonry w-full <?php echo esc_attr($attributes['className'] ?? ''); ?>"
    style="column-count: <?php echo esc_attr($columns); ?>; column-gap: <?php echo esc_attr($gap); ?>px; column-fill: <?php echo esc_attr($columnFill); ?>; <?php echo $columnFill === 'auto' && $height > 0 ? "height: {$height}px; overflow-y: auto;" : ''; ?>"
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
				description: 'Framework-agnostic HTML implementing <exhuma-css-masonry> custom element.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Exhuma CSS Masonry — Web Component</title>
  <script type="module" src="./exhuma-css-masonry.js"></script>
  <style>
    body { margin: 0; background: #090d16; font-family: system-ui, sans-serif; color: #fff; padding: 32px; }
    .card { background: #131c2e; border: 1px solid #223252; border-radius: 16px; padding: 24px; break-inside: avoid; margin-bottom: 16px; }
    .tag { font-size: 10px; font-family: monospace; color: #6366f1; font-weight: bold; }
    h3 { margin: 8px 0; font-size: 16px; }
    p { font-size: 12px; color: #94a3b8; margin: 0; }
  </style>
</head>
<body>
  <exhuma-css-masonry
    columns="${columns}"
    gap="${gap}"
    column-fill="${columnFill}"
    ${height > 0 ? `height="${height}"` : ''}
  >
    <div class="card" style="height: 180px;">
      <span class="tag">01 // GPU</span>
      <h3>Quantum Sub-Pixel Masonry</h3>
      <p>Hardware-composited tracks with zero reflow penalties.</p>
    </div>
    <div class="card" style="height: 240px;">
      <span class="tag">02 // CASCADE</span>
      <h3>Continuous Fluid Flow</h3>
      <p>Elements cascade naturally across column partitions.</p>
    </div>
    <div class="card" style="height: 160px;">
      <span class="tag">03 // ISOLATION</span>
      <h3>Break-Inside Isolation</h3>
      <p>Native CSS fragmentation protection preventing fracture.</p>
    </div>
  </exhuma-css-masonry>
</body>
</html>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'App.tsx',
				language: 'tsx',
				description: 'React Native / Expo screen with dual-column vertical Masonry list.',
				code: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { CssMasonry } from './components/CssMasonry';

const TILES = [
  { id: '01', title: 'Quantum Sub-Pixel', height: 160, tag: '01 // GPU' },
  { id: '02', title: 'Continuous Flow', height: 220, tag: '02 // CASCADE' },
  { id: '03', title: 'Break Isolation', height: 140, tag: '03 // ISOLATION' },
  { id: '04', title: 'Auto Waterfall', height: 240, tag: '04 // WATERFALL' },
  { id: '05', title: 'Adaptive Scale', height: 180, tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Zero Leak', height: 150, tag: '06 // ZERO-LEAK' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CssMasonry columns={2} gap={${gap}}>
          {TILES.map((tile) => (
            <View key={tile.id} style={[styles.card, { height: tile.height }]}>
              <Text style={styles.tag}>{tile.tag}</Text>
              <Text style={styles.title}>{tile.title}</Text>
            </View>
          ))}
        </CssMasonry>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#090d16' },
  scroll: { padding: 16 },
  card: { backgroundColor: '#131c2e', borderWidth: 1, borderColor: '#223252', borderRadius: 16, padding: 16, justifyContent: 'space-between' },
  tag: { fontSize: 10, fontFamily: 'monospace', color: '#6366f1', fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginTop: 4 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'css_masonry_screen.dart',
				language: 'dart',
				description: 'Flutter screen with ExhumaCssMasonry widget.',
				code: `import 'package:flutter/material.dart';
import 'css_masonry.dart';

class CssMasonryScreen extends StatelessWidget {
  const CssMasonryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: ExhumaCssMasonry(
          columns: 2,
          gap: ${gap}.0,
          children: [
            _buildTile('01 // GPU', 'Quantum Sub-Pixel', 160),
            _buildTile('02 // CASCADE', 'Continuous Flow', 220),
            _buildTile('03 // ISOLATION', 'Break Isolation', 140),
            _buildTile('04 // WATERFALL', 'Auto Waterfall', 240),
            _buildTile('05 // ADAPTIVE', 'Adaptive Scale', 180),
            _buildTile('06 // ZERO-LEAK', 'Zero Leak', 150),
          ],
        ),
      ),
    );
  }

  Widget _buildTile(String tag, String title, double height) {
    return Container(
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFF131C2E),
        border: Border.all(color: const Color(0xFF223252)),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(tag, style: const TextStyle(fontSize: 10, color: Color(0xFF6366F1), fontWeight: FontWeight.bold)),
          Text(title, style: const TextStyle(fontSize: 15, color: Colors.white, fontWeight: FontWeight.bold)),
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
				description: 'CSS Masonry universal usage.',
				code: `import { CssMasonry } from '@/components/ui/CssMasonry';\n\nexport default function Example() {\n  return (\n    <CssMasonry columns={${columns}} gap={${gap}} columnFill="${columnFill}">\n      <div>Content 1</div>\n      <div>Content 2</div>\n    </CssMasonry>\n  );\n}`,
			};
		}
	}
}
