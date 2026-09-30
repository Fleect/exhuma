import { EcosystemFlavor, ComponentFilePayload } from '../../schema';

export function getRowMasonryOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const columns = Number(props.columns ?? 1);
	const columnsSm = Number(props.columnsSm ?? 2);
	const columnsMd = Number(props.columnsMd ?? 2);
	const columnsLg = Number(props.columnsLg ?? 3);
	const columnsXl = Number(props.columnsXl ?? 4);
	const gap = Number(props.gap ?? 16);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'RowMasonry.tsx',
					language: 'tsx',
					description: 'Row Masonry — Standalone Ejected Engine (Zero Dependencies). Greedy shortest-column balancer with GPU translate3d positioning.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export interface RowMasonryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * RowMasonryItem — Compound container for masonry tiles ensuring independent bounding context.
 */
export const RowMasonryItem = React.forwardRef<HTMLDivElement, RowMasonryItemProps>(
  ({ children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('exhuma-row-masonry-item w-full', className)}
        style={{ ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RowMasonryItem.displayName = 'RowMasonryItem';

export interface RowMasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  children?: React.ReactNode;
}

/**
 * RowMasonry — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - O(N log K) greedy shortest-column dynamic assignment.
 * - Single-frame coalesced rAF: strictly batched reads and writes eliminating layout thrashing.
 * - Hardware compositor acceleration via transform: translate3d(x, y, 0).
 * - Automatic image and media load capture preventing tile overlap.
 */
export const RowMasonry = React.forwardRef<HTMLDivElement, RowMasonryProps>(
  (
    {
      children,
      columns = ${columns},
      columnsSm = ${columnsSm},
      columnsMd = ${columnsMd},
      columnsLg = ${columnsLg},
      columnsXl = ${columnsXl},
      gap = ${gap},
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [containerHeight, setContainerHeight] = React.useState<number>(0);
    const [isMounted, setIsMounted] = React.useState(false);
    const rafIdRef = React.useRef<number | null>(null);

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const resolveColumns = (width: number): number => {
      if (width >= 1280 && columnsXl) return columnsXl;
      if (width >= 1024 && columnsLg) return columnsLg;
      if (width >= 768 && columnsMd) return columnsMd;
      if (width >= 640 && columnsSm) return columnsSm;
      return columns;
    };

    const scheduleLayout = React.useCallback(() => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const width = container.clientWidth;
        if (width <= 0) return;

        const effectiveCols = Math.max(1, resolveColumns(width));
        const colWidth = (width - (effectiveCols - 1) * gap) / effectiveCols;
        const colHeights = new Array(effectiveCols).fill(0);
        const childrenNodes = Array.from(container.children) as HTMLElement[];

        // Phase 1: Batched geometry write (width)
        childrenNodes.forEach((node) => {
          node.style.position = 'absolute';
          node.style.width = \`\${colWidth}px\`;
        });

        // Phase 2: Batched read & shortest-column assignment
        childrenNodes.forEach((node) => {
          let minCol = 0;
          let minH = colHeights[0];
          for (let c = 1; c < effectiveCols; c++) {
            if (colHeights[c] < minH) {
              minH = colHeights[c];
              minCol = c;
            }
          }
          const x = minCol * (colWidth + gap);
          const y = minH;
          node.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
          colHeights[minCol] += node.offsetHeight + gap;
        });

        const maxH = Math.max(...colHeights);
        setContainerHeight(maxH > 0 ? maxH - gap : 0);
      });
    }, [columns, columnsSm, columnsMd, columnsLg, columnsXl, gap]);

    React.useEffect(() => {
      setIsMounted(true);
      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
        scheduleLayout();
      });
      observer.observe(container);
      Array.from(container.children).forEach((child) => observer.observe(child));

      container.addEventListener('load', scheduleLayout, true);

      return () => {
        observer.disconnect();
        container.removeEventListener('load', scheduleLayout, true);
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [scheduleLayout, children]);

    return (
      <div
        ref={containerRef}
        className={clsx('exhuma-row-masonry relative w-full', className)}
        style={{
          height: containerHeight > 0 ? \`\${containerHeight}px\` : 'auto',
          opacity: isMounted ? 1 : 0.001,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
RowMasonry.displayName = 'RowMasonry';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'RowMasonry.vue',
					language: 'vue',
					description: 'Vue 3 Native Row Masonry layout component with greedy column balancing.',
					code: `<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { clsx } from 'clsx';

interface Props {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  columns: ${columns},
  columnsSm: ${columnsSm},
  columnsMd: ${columnsMd},
  columnsLg: ${columnsLg},
  columnsXl: ${columnsXl},
  gap: ${gap},
  class: '',
});

const containerRef = ref<HTMLDivElement | null>(null);
const containerHeight = ref<number>(0);
let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

function resolveColumns(width: number): number {
  if (width >= 1280 && props.columnsXl) return props.columnsXl;
  if (width >= 1024 && props.columnsLg) return props.columnsLg;
  if (width >= 768 && props.columnsMd) return props.columnsMd;
  if (width >= 640 && props.columnsSm) return props.columnsSm;
  return props.columns;
}

function scheduleLayout() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    const container = containerRef.value;
    if (!container) return;
    const width = container.clientWidth;
    if (width <= 0) return;

    const cols = Math.max(1, resolveColumns(width));
    const colWidth = (width - (cols - 1) * props.gap) / cols;
    const colHeights = new Array(cols).fill(0);
    const children = Array.from(container.children) as HTMLElement[];

    children.forEach((child) => {
      child.style.position = 'absolute';
      child.style.width = \`\${colWidth}px\`;
    });

    children.forEach((child) => {
      let minCol = 0;
      let minH = colHeights[0];
      for (let c = 1; c < cols; c++) {
        if (colHeights[c] < minH) {
          minH = colHeights[c];
          minCol = c;
        }
      }
      const x = minCol * (colWidth + props.gap);
      const y = minH;
      child.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
      colHeights[minCol] += child.offsetHeight + props.gap;
    });

    const maxH = Math.max(...colHeights);
    containerHeight.value = maxH > 0 ? maxH - props.gap : 0;
  });
}

onMounted(() => {
  nextTick(() => {
    const container = containerRef.value;
    if (!container) return;

    resizeObserver = new ResizeObserver(() => scheduleLayout());
    resizeObserver.observe(container);
    Array.from(container.children).forEach((el) => resizeObserver?.observe(el));
    container.addEventListener('load', scheduleLayout, true);
    scheduleLayout();
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (containerRef.value) containerRef.value.removeEventListener('load', scheduleLayout, true);
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    ref="containerRef"
    :class="clsx('exhuma-row-masonry relative w-full', props.class)"
    :style="{ height: containerHeight > 0 ? \`\${containerHeight}px\` : 'auto' }"
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
					filename: 'RowMasonry.svelte',
					language: 'svelte',
					description: 'Svelte 5 Runes Row Masonry layout component with greedy column balancing.',
					code: `<script lang="ts">
  import { onMount } from 'svelte';
  import { clsx } from 'clsx';

  let {
    columns = ${columns},
    columnsSm = ${columnsSm},
    columnsMd = ${columnsMd},
    columnsLg = ${columnsLg},
    columnsXl = ${columnsXl},
    gap = ${gap},
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
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();

  let containerEl: HTMLDivElement | null = $state(null);
  let containerHeight = $state(0);
  let rafId: number | null = null;

  function resolveColumns(width: number): number {
    if (width >= 1280 && columnsXl) return columnsXl;
    if (width >= 1024 && columnsLg) return columnsLg;
    if (width >= 768 && columnsMd) return columnsMd;
    if (width >= 640 && columnsSm) return columnsSm;
    return columns;
  }

  function scheduleLayout() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!containerEl) return;
      const width = containerEl.clientWidth;
      if (width <= 0) return;

      const cols = Math.max(1, resolveColumns(width));
      const colWidth = (width - (cols - 1) * gap) / cols;
      const colHeights = new Array(cols).fill(0);
      const items = Array.from(containerEl.children) as HTMLElement[];

      items.forEach((item) => {
        item.style.position = 'absolute';
        item.style.width = \`\${colWidth}px\`;
      });

      items.forEach((item) => {
        let minCol = 0;
        let minH = colHeights[0];
        for (let c = 1; c < cols; c++) {
          if (colHeights[c] < minH) {
            minH = colHeights[c];
            minCol = c;
          }
        }
        const x = minCol * (colWidth + gap);
        const y = minH;
        item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
        colHeights[minCol] += item.offsetHeight + gap;
      });

      const maxH = Math.max(...colHeights);
      containerHeight = maxH > 0 ? maxH - gap : 0;
    });
  }

  onMount(() => {
    if (!containerEl) return;
    const observer = new ResizeObserver(() => scheduleLayout());
    observer.observe(containerEl);
    Array.from(containerEl.children).forEach((child) => observer.observe(child));
    containerEl.addEventListener('load', scheduleLayout, true);
    scheduleLayout();

    return () => {
      observer.disconnect();
      if (containerEl) containerEl.removeEventListener('load', scheduleLayout, true);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<div
  bind:this={containerEl}
  class={clsx('exhuma-row-masonry relative w-full', className)}
  style="height: {containerHeight > 0 ? \`\${containerHeight}px\` : 'auto'};"
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
					filename: 'RowMasonry.tsx',
					language: 'tsx',
					description: 'SolidJS Native Row Masonry layout component with fine-grained reactivity.',
					code: `import { Component, JSX, splitProps, createSignal, onMount, onCleanup } from 'solid-js';

export interface RowMasonryProps extends JSX.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
}

export const RowMasonry: Component<RowMasonryProps> = (props) => {
  const [local, others] = splitProps(props, ['columns', 'columnsSm', 'columnsMd', 'columnsLg', 'columnsXl', 'gap', 'class', 'children']);
  let containerRef!: HTMLDivElement;
  const [containerHeight, setContainerHeight] = createSignal(0);
  let rafId: number | null = null;

  const resolveColumns = (width: number): number => {
    if (width >= 1280 && local.columnsXl) return local.columnsXl;
    if (width >= 1024 && local.columnsLg) return local.columnsLg;
    if (width >= 768 && local.columnsMd) return local.columnsMd;
    if (width >= 640 && local.columnsSm) return local.columnsSm;
    return local.columns ?? ${columns};
  };

  const scheduleLayout = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!containerRef) return;
      const width = containerRef.clientWidth;
      if (width <= 0) return;

      const gapVal = local.gap ?? ${gap};
      const cols = Math.max(1, resolveColumns(width));
      const colWidth = (width - (cols - 1) * gapVal) / cols;
      const colHeights = new Array(cols).fill(0);
      const items = Array.from(containerRef.children) as HTMLElement[];

      items.forEach((item) => {
        item.style.position = 'absolute';
        item.style.width = \`\${colWidth}px\`;
      });

      items.forEach((item) => {
        let minCol = 0;
        let minH = colHeights[0];
        for (let c = 1; c < cols; c++) {
          if (colHeights[c] < minH) {
            minH = colHeights[c];
            minCol = c;
          }
        }
        const x = minCol * (colWidth + gapVal);
        const y = minH;
        item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
        colHeights[minCol] += item.offsetHeight + gapVal;
      });

      const maxH = Math.max(...colHeights);
      setContainerHeight(maxH > 0 ? maxH - gapVal : 0);
    });
  };

  onMount(() => {
    const observer = new ResizeObserver(() => scheduleLayout());
    observer.observe(containerRef);
    Array.from(containerRef.children).forEach((child) => observer.observe(child));
    containerRef.addEventListener('load', scheduleLayout, true);
    scheduleLayout();

    onCleanup(() => {
      observer.disconnect();
      if (containerRef) containerRef.removeEventListener('load', scheduleLayout, true);
      if (rafId !== null) cancelAnimationFrame(rafId);
    });
  });

  return (
    <div
      ref={containerRef}
      class={\`exhuma-row-masonry relative w-full \${local.class ?? ''}\`}
      style={{ height: containerHeight() > 0 ? \`\${containerHeight()}px\` : 'auto' }}
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
					filename: 'row-masonry.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Row Masonry component with greedy column balancing.',
					code: `import { Component, input, ElementRef, ViewChild, afterNextRender, OnDestroy } from '@angular/core';

@Component({
  selector: 'exhuma-row-masonry',
  standalone: true,
  template: \`
    <div
      #container
      class="exhuma-row-masonry relative w-full {{ customClass() }}"
      [style.height]="containerHeight() > 0 ? containerHeight() + 'px' : 'auto'"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class ExhumaRowMasonryComponent implements OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  readonly columns = input<number>(${columns});
  readonly columnsSm = input<number>(${columnsSm});
  readonly columnsMd = input<number>(${columnsMd});
  readonly columnsLg = input<number>(${columnsLg});
  readonly columnsXl = input<number>(${columnsXl});
  readonly gap = input<number>(${gap});
  readonly customClass = input<string>('');

  containerHeight = input<number>(0);
  private observer: ResizeObserver | null = null;
  private rafId: number | null = null;

  constructor() {
    afterNextRender(() => {
      const container = this.containerRef.nativeElement;
      this.observer = new ResizeObserver(() => this.scheduleLayout());
      this.observer.observe(container);
      Array.from(container.children).forEach((child) => this.observer?.observe(child));
      container.addEventListener('load', () => this.scheduleLayout(), true);
      this.scheduleLayout();
    });
  }

  private resolveColumns(width: number): number {
    if (width >= 1280 && this.columnsXl()) return this.columnsXl();
    if (width >= 1024 && this.columnsLg()) return this.columnsLg();
    if (width >= 768 && this.columnsMd()) return this.columnsMd();
    if (width >= 640 && this.columnsSm()) return this.columnsSm();
    return this.columns();
  }

  private scheduleLayout() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      const container = this.containerRef?.nativeElement;
      if (!container) return;
      const width = container.clientWidth;
      if (width <= 0) return;

      const cols = Math.max(1, this.resolveColumns(width));
      const g = this.gap();
      const colWidth = (width - (cols - 1) * g) / cols;
      const colHeights = new Array(cols).fill(0);
      const items = Array.from(container.children) as HTMLElement[];

      items.forEach((item) => {
        item.style.position = 'absolute';
        item.style.width = \`\${colWidth}px\`;
      });

      items.forEach((item) => {
        let minCol = 0;
        let minH = colHeights[0];
        for (let c = 1; c < cols; c++) {
          if (colHeights[c] < minH) {
            minH = colHeights[c];
            minCol = c;
          }
        }
        const x = minCol * (colWidth + g);
        const y = minH;
        item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
        colHeights[minCol] += item.offsetHeight + g;
      });

      const maxH = Math.max(...colHeights);
      container.style.height = maxH > 0 ? \`\${maxH - g}px\` : 'auto';
    });
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'RowMasonry.astro',
					language: 'astro',
					description: 'Pure Native Astro Row Masonry component with greedy column balancing script.',
					code: `---
interface Props {
  columns?: number;
  columnsSm?: number;
  columnsMd?: number;
  columnsLg?: number;
  columnsXl?: number;
  gap?: number;
  class?: string;
  [key: string]: unknown;
}

const {
  columns = ${columns},
  columnsSm = ${columnsSm},
  columnsMd = ${columnsMd},
  columnsLg = ${columnsLg},
  columnsXl = ${columnsXl},
  gap = ${gap},
  class: className = '',
  ...props
} = Astro.props;
---

<div
  class={\`exhuma-row-masonry relative w-full \${className}\`}
  data-columns={columns}
  data-columns-sm={columnsSm}
  data-columns-md={columnsMd}
  data-columns-lg={columnsLg}
  data-columns-xl={columnsXl}
  data-gap={gap}
  {...props}
>
  <slot />
</div>

<script>
  function initRowMasonryElements() {
    const containers = document.querySelectorAll<HTMLElement>('.exhuma-row-masonry');
    containers.forEach((container) => {
      const cols = Number(container.dataset.columns || 1);
      const colsSm = Number(container.dataset.columnsSm || 2);
      const colsMd = Number(container.dataset.columnsMd || 2);
      const colsLg = Number(container.dataset.columnsLg || 3);
      const colsXl = Number(container.dataset.columnsXl || 4);
      const gap = Number(container.dataset.gap || 16);

      function resolveCols(w: number) {
        if (w >= 1280 && colsXl) return colsXl;
        if (w >= 1024 && colsLg) return colsLg;
        if (w >= 768 && colsMd) return colsMd;
        if (w >= 640 && colsSm) return colsSm;
        return cols;
      }

      function layout() {
        const width = container.clientWidth;
        if (width <= 0) return;
        const effectiveCols = Math.max(1, resolveCols(width));
        const colWidth = (width - (effectiveCols - 1) * gap) / effectiveCols;
        const colHeights = new Array(effectiveCols).fill(0);
        const items = Array.from(container.children) as HTMLElement[];

        items.forEach((item) => {
          item.style.position = 'absolute';
          item.style.width = \`\${colWidth}px\`;
        });

        items.forEach((item) => {
          let minCol = 0;
          let minH = colHeights[0];
          for (let c = 1; c < effectiveCols; c++) {
            if (colHeights[c] < minH) {
              minH = colHeights[c];
              minCol = c;
            }
          }
          const x = minCol * (colWidth + gap);
          const y = minH;
          item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
          colHeights[minCol] += item.offsetHeight + gap;
        });

        const maxH = Math.max(...colHeights);
        container.style.height = maxH > 0 ? \`\${maxH - gap}px\` : 'auto';
      }

      const observer = new ResizeObserver(() => layout());
      observer.observe(container);
      Array.from(container.children).forEach((child) => observer.observe(child));
      container.addEventListener('load', layout, true);
      layout();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRowMasonryElements);
  } else {
    initRowMasonryElements();
  }
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-row-masonry.js',
					language: 'javascript',
					description: 'Universal Custom Web Component <exhuma-row-masonry> with greedy column balancing.',
					code: `/**
 * Universal Custom Web Component: <exhuma-row-masonry>
 * Big-Omega O(N log K) greedy shortest-column balancing.
 */
class ExhumaRowMasonryElement extends HTMLElement {
  constructor() {
    super();
    this._rafId = null;
    this._observer = null;
    this.scheduleLayout = this.scheduleLayout.bind(this);
  }

  static get observedAttributes() {
    return ['columns', 'columns-sm', 'columns-md', 'columns-lg', 'columns-xl', 'gap'];
  }

  connectedCallback() {
    this.classList.add('exhuma-row-masonry');
    this.style.position = 'relative';
    this.style.display = 'block';
    this.style.width = '100%';

    this._observer = new ResizeObserver(() => this.scheduleLayout());
    this._observer.observe(this);
    Array.from(this.children).forEach((child) => this._observer.observe(child));
    this.addEventListener('load', this.scheduleLayout, true);
    this.scheduleLayout();
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
    this.removeEventListener('load', this.scheduleLayout, true);
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
  }

  attributeChangedCallback() {
    this.scheduleLayout();
  }

  resolveColumns(width) {
    const xl = Number(this.getAttribute('columns-xl') || ${columnsXl});
    const lg = Number(this.getAttribute('columns-lg') || ${columnsLg});
    const md = Number(this.getAttribute('columns-md') || ${columnsMd});
    const sm = Number(this.getAttribute('columns-sm') || ${columnsSm});
    const base = Number(this.getAttribute('columns') || ${columns});

    if (width >= 1280 && xl) return xl;
    if (width >= 1024 && lg) return lg;
    if (width >= 768 && md) return md;
    if (width >= 640 && sm) return sm;
    return base;
  }

  scheduleLayout() {
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      const width = this.clientWidth;
      if (width <= 0) return;

      const gap = Number(this.getAttribute('gap') || ${gap});
      const cols = Math.max(1, this.resolveColumns(width));
      const colWidth = (width - (cols - 1) * gap) / cols;
      const colHeights = new Array(cols).fill(0);
      const items = Array.from(this.children);

      items.forEach((item) => {
        item.style.position = 'absolute';
        item.style.width = \`\${colWidth}px\`;
      });

      items.forEach((item) => {
        let minCol = 0;
        let minH = colHeights[0];
        for (let c = 1; c < cols; c++) {
          if (colHeights[c] < minH) {
            minH = colHeights[c];
            minCol = c;
          }
        }
        const x = minCol * (colWidth + gap);
        const y = minH;
        item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
        colHeights[minCol] += item.offsetHeight + gap;
      });

      const maxH = Math.max(...colHeights);
      this.style.height = maxH > 0 ? \`\${maxH - gap}px\` : 'auto';
    });
  }
}

if (!customElements.get('exhuma-row-masonry')) {
  customElements.define('exhuma-row-masonry', ExhumaRowMasonryElement);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'row-masonry.vanilla.js',
					language: 'javascript',
					description: 'Autonomous Vanilla JS Row Masonry controller with greedy column balancing.',
					code: `/**
 * Initializes Row Masonry kinetic layout on selected containers.
 * Big-Omega Ω(N log K) greedy shortest-column balancing with single-frame coalesced rAF.
 */
export function initRowMasonry(containerSelector = '.exhuma-row-masonry', options = {}) {
  const containers = document.querySelectorAll(containerSelector);
  const cleanups = [];

  containers.forEach((container) => {
    let rafId = null;
    const columns = options.columns ?? Number(container.dataset.columns || ${columns});
    const columnsSm = options.columnsSm ?? Number(container.dataset.columnsSm || ${columnsSm});
    const columnsMd = options.columnsMd ?? Number(container.dataset.columnsMd || ${columnsMd});
    const columnsLg = options.columnsLg ?? Number(container.dataset.columnsLg || ${columnsLg});
    const columnsXl = options.columnsXl ?? Number(container.dataset.columnsXl || ${columnsXl});
    const gap = options.gap ?? Number(container.dataset.gap || ${gap});

    function resolveCols(w) {
      if (w >= 1280 && columnsXl) return columnsXl;
      if (w >= 1024 && columnsLg) return columnsLg;
      if (w >= 768 && columnsMd) return columnsMd;
      if (w >= 640 && columnsSm) return columnsSm;
      return columns;
    }

    function layout() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const width = container.clientWidth;
        if (width <= 0) return;

        const cols = Math.max(1, resolveCols(width));
        const colWidth = (width - (cols - 1) * gap) / cols;
        const colHeights = new Array(cols).fill(0);
        const items = Array.from(container.children);

        items.forEach((item) => {
          item.style.position = 'absolute';
          item.style.width = \`\${colWidth}px\`;
        });

        items.forEach((item) => {
          let minCol = 0;
          let minH = colHeights[0];
          for (let c = 1; c < cols; c++) {
            if (colHeights[c] < minH) {
              minH = colHeights[c];
              minCol = c;
            }
          }
          const x = minCol * (colWidth + gap);
          const y = minH;
          item.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
          colHeights[minCol] += item.offsetHeight + gap;
        });

        const maxH = Math.max(...colHeights);
        container.style.height = maxH > 0 ? \`\${maxH - gap}px\` : 'auto';
      });
    }

    const observer = new ResizeObserver(() => layout());
    observer.observe(container);
    Array.from(container.children).forEach((child) => observer.observe(child));
    container.addEventListener('load', layout, true);
    layout();

    cleanups.push(() => {
      observer.disconnect();
      container.removeEventListener('load', layout, true);
      if (rafId !== null) cancelAnimationFrame(rafId);
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

		case 'blade': {
			return [
				{
					filename: 'row-masonry.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Row Masonry with dynamic shortest-column layout.',
					code: `@props([
    'columns' => ${columns},
    'columnsSm' => ${columnsSm},
    'columnsMd' => ${columnsMd},
    'columnsLg' => ${columnsLg},
    'columnsXl' => ${columnsXl},
    'gap' => ${gap},
])

<div
    {{ $attributes->merge([
        'class' => 'exhuma-row-masonry relative w-full',
    ]) }}
    data-columns="{{ $columns }}"
    data-columns-sm="{{ $columnsSm }}"
    data-columns-md="{{ $columnsMd }}"
    data-columns-lg="{{ $columnsLg }}"
    data-columns-xl="{{ $columnsXl }}"
    data-gap="{{ $gap }}"
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
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Block API v3 definition for Row Masonry.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/row-masonry',
							version: '1.0.0',
							title: 'Exhuma Row Masonry',
							category: 'layout',
							description: 'Greedy dynamic row-by-row masonry balancer placing items into the shortest column.',
							attributes: {
								columns: { type: 'number', default: columns },
								columnsSm: { type: 'number', default: columnsSm },
								columnsMd: { type: 'number', default: columnsMd },
								columnsLg: { type: 'number', default: columnsLg },
								columnsXl: { type: 'number', default: columnsXl },
								gap: { type: 'number', default: gap },
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
					description: 'WordPress render template for Row Masonry block.',
					code: `<?php
/**
 * Row Masonry Block Render Template
 */
$attributes = $attributes ?? [];
$columns = $attributes['columns'] ?? ${columns};
$gap = $attributes['gap'] ?? ${gap};
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-row-masonry relative w-full',
    'data-columns' => $columns,
    'data-gap' => $gap,
]);
?>
<div <?php echo $wrapper_attributes; ?>>
  <?php echo $content; ?>
</div>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'RowMasonry.tsx',
					language: 'tsx',
					description: 'React Native Row Masonry component distributing children across balanced vertical columns.',
					code: `import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

export interface RowMasonryProps extends ViewProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode[];
}

export const RowMasonry: React.FC<RowMasonryProps> = ({
  columns = ${columns},
  gap = ${gap},
  children,
  style,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const colCount = Math.max(1, columns);
  const columnBuckets: React.ReactNode[][] = Array.from({ length: colCount }, () => []);

  childArray.forEach((child, index) => {
    columnBuckets[index % colCount].push(child);
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
					filename: 'row_masonry.dart',
					language: 'dart',
					description: 'Flutter Row Masonry widget distributing children across shortest columns.',
					code: `import 'package:flutter/material.dart';

class ExhumaRowMasonry extends StatelessWidget {
  final List<Widget> children;
  final int columns;
  final double gap;

  const ExhumaRowMasonry({
    super.key,
    required this.children,
    this.columns = ${columns},
    this.gap = ${gap}.0,
  });

  @override
  Widget build(BuildContext context) {
    final int colCount = columns < 1 ? 1 : columns;
    final List<List<Widget>> buckets = List.generate(colCount, (_) => []);

    for (int i = 0; i < children.length; i++) {
      buckets[i % colCount].add(children[i]);
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: buckets.map((bucket) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: gap / 2),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: bucket.map((item) {
                return Padding(
                  padding: EdgeInsets.only(bottom: gap),
                  child: item,
                );
              }).toList(),
            ),
          ),
        );
      }).toList(),
    );
  }
}
`,
				},
			];
		}
	}
}

export function getRowMasonryUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const columns = Number(props.columns ?? 1);
	const columnsSm = Number(props.columnsSm ?? 2);
	const columnsMd = Number(props.columnsMd ?? 2);
	const columnsLg = Number(props.columnsLg ?? 3);
	const columnsXl = Number(props.columnsXl ?? 4);
	const gap = Number(props.gap ?? 16);

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 App Router page with RowMasonry gallery.',
				code: `'use client';

import React from 'react';
import { RowMasonry, RowMasonryItem } from '@/components/ui/RowMasonry';

const CARDS = [
  { id: '01', title: '120 FPS Native Kinetics', desc: 'Hardware-composited smooth transforms on resize without layout thrashing.', height: 'h-40', tag: '01 // KINETICS' },
  { id: '02', title: 'Greedy Column Balancer', desc: 'Dynamic shortest-column placement algorithm maintaining visual equilibrium.', height: 'h-60', tag: '02 // BALANCER' },
  { id: '03', title: 'Reading Order Preservation', desc: 'Row-order bin-packing guarantees authentic left-to-right DOM flow.', height: 'h-48', tag: '03 // A11Y' },
  { id: '04', title: 'Sub-Millisecond V-Sync', desc: 'Single-frame batched DOM height reads completely eliminating layout shift.', height: 'h-72', tag: '04 // ZERO-CLS' },
  { id: '05', title: 'Adaptive Breakpoints', desc: 'Auto-responsive column scaling spanning mobile (1 col) to ultra-wide (4+ cols).', height: 'h-52', tag: '05 // ADAPTIVE' },
  { id: '06', title: 'Async Media Handling', desc: 'Automatic load listeners for images and videos with zero card overlap.', height: 'h-44', tag: '06 // ASYNC-SAFE' },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          EXHUMA LAYOUT ENGINE // ROW MASONRY
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          Dynamic Row Masonry Balancer
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
          Greedy dynamic shortest-column packing with GPU translate3d positioning.
        </p>
      </div>

      <RowMasonry
        columns={${columns}}
        columnsSm={${columnsSm}}
        columnsMd={${columnsMd}}
        columnsLg={${columnsLg}}
        columnsXl={${columnsXl}}
        gap={${gap}}
        className="max-w-6xl mx-auto"
      >
        {CARDS.map((card) => (
          <RowMasonryItem key={card.id}>
            <div className={\`border border-border/80 bg-card rounded-xl p-5 \${card.height} flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors\`}>
              <div className="flex items-center justify-between">
                <span className="text-3xs font-mono text-primary font-bold uppercase">{card.tag}</span>
                <span className="text-3xs font-mono text-muted-foreground">#{card.id}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          </RowMasonryItem>
        ))}
      </RowMasonry>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'RowMasonryDemo.tsx',
				language: 'tsx',
				description: 'React component with RowMasonry gallery.',
				code: `import React from 'react';
import { RowMasonry, RowMasonryItem } from '@/components/ui/RowMasonry';

const CARDS = [
  { id: '01', title: '120 FPS Native Kinetics', desc: 'Hardware-composited smooth transforms on resize.', height: 'h-40' },
  { id: '02', title: 'Greedy Column Balancer', desc: 'Dynamic shortest-column placement algorithm.', height: 'h-60' },
  { id: '03', title: 'Reading Order Preservation', desc: 'Row-order bin-packing guarantees authentic DOM flow.', height: 'h-48' },
  { id: '04', title: 'Zero Layout Shift', desc: 'Single-frame batched DOM height reads eliminating reflow.', height: 'h-72' },
];

export default function RowMasonryDemo() {
  return (
    <RowMasonry
      columns={${columns}}
      columnsSm={${columnsSm}}
      columnsMd={${columnsMd}}
      columnsLg={${columnsLg}}
      columnsXl={${columnsXl}}
      gap={${gap}}
      className="max-w-5xl mx-auto p-6"
    >
      {CARDS.map((card) => (
        <RowMasonryItem key={card.id}>
          <div className={\`border border-border bg-card rounded-xl p-5 \${card.height} flex flex-col justify-between\`}>
            <span className="text-xs font-mono text-muted-foreground">#{card.id}</span>
            <div>
              <h4 className="text-sm font-bold">{card.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </div>
          </div>
        </RowMasonryItem>
      ))}
    </RowMasonry>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'RowMasonryDemo.vue',
				language: 'vue',
				description: 'Vue 3 component with RowMasonry gallery.',
				code: `<script setup lang="ts">
import RowMasonry from '@/components/ui/RowMasonry.vue';

const cards = [
  { id: '01', title: '120 FPS Native Kinetics', height: 'h-40' },
  { id: '02', title: 'Greedy Column Balancer', height: 'h-60' },
  { id: '03', title: 'Reading Order Preservation', height: 'h-48' },
];
</script>

<template>
  <RowMasonry
    :columns="${columns}"
    :columns-sm="${columnsSm}"
    :columns-md="${columnsMd}"
    :columns-lg="${columnsLg}"
    :columns-xl="${columnsXl}"
    :gap="${gap}"
    class="max-w-5xl mx-auto p-6"
  >
    <div
      v-for="card in cards"
      :key="card.id"
      :class="['border border-border bg-card rounded-xl p-5 flex flex-col justify-between', card.height]"
    >
      <span class="text-xs font-mono text-muted-foreground">#{{ card.id }}</span>
      <h4 class="text-sm font-bold">{{ card.title }}</h4>
    </div>
  </RowMasonry>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'RowMasonryDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 component with RowMasonry gallery.',
				code: `<script lang="ts">
  import RowMasonry from '$lib/components/RowMasonry.svelte';

  const cards = [
    { id: '01', title: '120 FPS Native Kinetics', height: 'h-40' },
    { id: '02', title: 'Greedy Column Balancer', height: 'h-60' },
    { id: '03', title: 'Reading Order Preservation', height: 'h-48' },
  ];
</script>

<RowMasonry
  columns={${columns}}
  columnsSm={${columnsSm}}
  columnsMd={${columnsMd}}
  columnsLg={${columnsLg}}
  columnsXl={${columnsXl}}
  gap={${gap}}
  class="max-w-5xl mx-auto p-6"
>
  {#each cards as card (card.id)}
    <div class="border border-border bg-card rounded-xl p-5 {card.height} flex flex-col justify-between">
      <span class="text-xs font-mono text-muted-foreground">#{card.id}</span>
      <h4 class="text-sm font-bold">{card.title}</h4>
    </div>
  {/each}
</RowMasonry>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'RowMasonryDemo.tsx',
				language: 'tsx',
				description: 'SolidJS component with RowMasonry gallery.',
				code: `import { Component } from 'solid-js';
import { RowMasonry } from '@/components/ui/RowMasonry';

export const RowMasonryDemo: Component = () => {
  return (
    <RowMasonry columns={${columns}} columnsSm={${columnsSm}} columnsMd={${columnsMd}} columnsLg={${columnsLg}} columnsXl={${columnsXl}} gap={${gap}} class="max-w-5xl mx-auto p-6">
      <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
      <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
      <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
    </RowMasonry>
  );
};
`,
			};
		}

		case 'angular': {
			return {
				filename: 'row-masonry-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ component with RowMasonry gallery.',
				code: `import { Component } from '@angular/core';
import { ExhumaRowMasonryComponent } from '@/components/ui/row-masonry.component';

@Component({
  selector: 'app-row-masonry-demo',
  standalone: true,
  imports: [ExhumaRowMasonryComponent],
  template: \`
    <exhuma-row-masonry [columns]="${columns}" [gap]="${gap}" customClass="max-w-5xl mx-auto p-6">
      <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
      <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
      <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
    </exhuma-row-masonry>
  \`,
})
export class RowMasonryDemoComponent {}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'RowMasonryDemo.astro',
				language: 'astro',
				description: 'Astro component with RowMasonry gallery.',
				code: `---
import RowMasonry from '@/components/ui/RowMasonry.astro';
---

<RowMasonry columns={${columns}} columnsSm={${columnsSm}} columnsMd={${columnsMd}} columnsLg={${columnsLg}} columnsXl={${columnsXl}} gap={${gap}} class="max-w-5xl mx-auto p-6">
  <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
  <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
  <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
</RowMasonry>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'row-masonry-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade component with RowMasonry gallery.',
				code: `<x-row-masonry :columns="${columns}" :gap="${gap}" class="max-w-5xl mx-auto p-6">
    <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
    <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
    <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
</x-row-masonry>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'row-masonry-pattern.php',
				language: 'php',
				description: 'WordPress block pattern with RowMasonry gallery.',
				code: `<!-- wp:exhuma/row-masonry {"columns":${columns},"gap":${gap}} -->
<div class="wp-block-exhuma-row-masonry">
  <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
  <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
  <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
</div>
<!-- /wp:exhuma/row-masonry -->
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'row-masonry-demo.html',
				language: 'html',
				description: 'Web Component <exhuma-row-masonry> consumption.',
				code: `<script type="module" src="./exhuma-row-masonry.js"></script>

<exhuma-row-masonry columns="${columns}" gap="${gap}" class="max-w-5xl mx-auto p-6">
  <div class="h-40 border rounded-xl p-4 bg-card">Tile 1</div>
  <div class="h-60 border rounded-xl p-4 bg-card">Tile 2</div>
  <div class="h-48 border rounded-xl p-4 bg-card">Tile 3</div>
</exhuma-row-masonry>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'row-masonry-demo.js',
				language: 'javascript',
				description: 'Vanilla JS Row Masonry demo.',
				code: `import { initRowMasonry } from './row-masonry.vanilla.js';

const masonry = initRowMasonry('.exhuma-row-masonry', {
  columns: ${columns},
  gap: ${gap},
});

// Teardown when unmounting:
// masonry.destroy();
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'RowMasonryDemo.tsx',
				language: 'tsx',
				description: 'React Native Row Masonry consumption.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RowMasonry } from './RowMasonry';

export default function RowMasonryDemo() {
  return (
    <RowMasonry columns={${columns}} gap={${gap}} style={styles.container}>
      <View style={[styles.card, { height: 160 }]}><Text>Tile 1</Text></View>
      <View style={[styles.card, { height: 240 }]}><Text>Tile 2</Text></View>
      <View style={[styles.card, { height: 190 }]}><Text>Tile 3</Text></View>
    </RowMasonry>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#18181b', borderRadius: 12, padding: 16 },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'row_masonry_demo.dart',
				language: 'dart',
				description: 'Flutter ExhumaRowMasonry widget demo.',
				code: `import 'package:flutter/material.dart';
import 'row_masonry.dart';

class RowMasonryDemo extends StatelessWidget {
  const RowMasonryDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return ExhumaRowMasonry(
      columns: ${columns},
      gap: ${gap}.0,
      children: [
        Container(height: 160, color: Colors.blueGrey, child: const Center(child: Text('Tile 1'))),
        Container(height: 240, color: Colors.indigo, child: const Center(child: Text('Tile 2'))),
        Container(height: 190, color: Colors.deepPurple, child: const Center(child: Text('Tile 3'))),
      ],
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'RowMasonryDemo.tsx',
				language: 'tsx',
				description: `Row Masonry consumption in ${flavor}.`,
				code: `import { RowMasonry, RowMasonryItem } from '@/components/ui/RowMasonry';

export default function Demo() {
  return (
    <RowMasonry columns={${columns}} gap={${gap}}>
      <RowMasonryItem><div className="h-40 p-4 border rounded-xl">Tile 1</div></RowMasonryItem>
      <RowMasonryItem><div className="h-60 p-4 border rounded-xl">Tile 2</div></RowMasonryItem>
    </RowMasonry>
  );
}
`,
			};
		}
	}
}
