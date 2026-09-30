import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getDiamondGridOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const gap = typeof props.gap === 'number' ? props.gap : Number(props.gap ?? 16);
	const layout = String(props.layout || 'auto');
	const mode = String(props.mode || 'rhombic');
	const responsive = Boolean(props.responsive ?? false);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'DiamondGrid.tsx',
					language: 'tsx',
					description: 'Diamond Grid — Standalone Ejected Engine (Zero Dependencies). Inlines rhombic mathematical partitioning and container queries.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

export type DiamondLayoutVariant = 'large' | 'medium' | 'small' | 'auto';
export type DiamondGridMode = 'rhombic' | 'isometric';

export interface DiamondLayoutConfig {
  maxItems: number;
  columns: number;
  pattern: number[];
}

export const DIAMOND_LAYOUT_CONFIGS: Record<'large' | 'medium' | 'small', DiamondLayoutConfig> = {
  large: { maxItems: 16, columns: 7, pattern: [1, 2, 3, 4, 3, 2, 1] },
  medium: { maxItems: 9, columns: 5, pattern: [1, 2, 3, 2, 1] },
  small: { maxItems: 4, columns: 3, pattern: [1, 2, 1] },
};

export function getDiamondLayoutConfig(totalItems: number, layout: DiamondLayoutVariant = 'auto'): DiamondLayoutConfig {
  if (layout === 'large') return DIAMOND_LAYOUT_CONFIGS.large;
  if (layout === 'medium') return DIAMOND_LAYOUT_CONFIGS.medium;
  if (layout === 'small') return DIAMOND_LAYOUT_CONFIGS.small;

  if (totalItems >= 16) return DIAMOND_LAYOUT_CONFIGS.large;
  if (totalItems >= 9) return DIAMOND_LAYOUT_CONFIGS.medium;
  if (totalItems >= 4) return DIAMOND_LAYOUT_CONFIGS.small;
  return {
    maxItems: totalItems,
    columns: Math.max(1, Math.min(totalItems, 3)),
    pattern: [],
  };
}

export function partitionDiamondItems<T>(items: T[], config: DiamondLayoutConfig): { item: T; index: number }[][] {
  const columns: { item: T; index: number }[][] = Array.from({ length: config.columns }, () => []);
  const displayedItems = items.slice(0, config.maxItems);
  let itemIndex = 0;

  if (config.pattern.length === 0) {
    for (let col = 0; col < config.columns && itemIndex < displayedItems.length; col++) {
      columns[col].push({ item: displayedItems[itemIndex], index: itemIndex });
      itemIndex++;
    }
    return columns;
  }

  for (let columnIndex = 0; columnIndex < config.pattern.length && itemIndex < displayedItems.length; columnIndex++) {
    const itemsInColumn = config.pattern[columnIndex];
    for (let i = 0; i < itemsInColumn && itemIndex < displayedItems.length; i++) {
      columns[columnIndex].push({ item: displayedItems[itemIndex], index: itemIndex });
      itemIndex++;
    }
  }

  return columns;
}

export interface DiamondColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  columnIndex: number;
  gap?: number | string;
}

export const DiamondColumn = React.forwardRef<HTMLDivElement, DiamondColumnProps>(
  ({ children, columnIndex, gap = ${gap}, className, style, ...props }, ref) => {
    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
    return (
      <div
        ref={ref}
        className={clsx('exhuma-diamond-column flex flex-col items-center justify-center', className)}
        style={{
          gridColumn: columnIndex + 1,
          gap: gapVal,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DiamondColumn.displayName = 'DiamondColumn';

export interface DiamondItemProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: DiamondGridMode;
  diamond?: boolean;
}

export const DiamondItem = React.forwardRef<HTMLDivElement, DiamondItemProps>(
  ({ children, mode = 'rhombic', diamond = false, className, ...props }, ref) => {
    const isIsometric = mode === 'isometric' || diamond;
    if (isIsometric) {
      return (
        <div
          ref={ref}
          className={clsx(
            'exhuma-diamond-item exhuma-diamond-isometric group relative flex aspect-square items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg',
            className
          )}
          {...props}
        >
          <div className="-rotate-45 flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      );
    }
    return (
      <div ref={ref} className={clsx('exhuma-diamond-item', className)} {...props}>
        {children}
      </div>
    );
  }
);
DiamondItem.displayName = 'DiamondItem';

export interface DiamondGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  layout?: DiamondLayoutVariant;
  mode?: DiamondGridMode;
  diamondItems?: boolean;
  responsive?: boolean;
}

export type DiamondGridComponent = React.ForwardRefExoticComponent<
  DiamondGridProps & React.RefAttributes<HTMLDivElement>
> & {
  Grid: DiamondGridComponent;
  Column: typeof DiamondColumn;
  Item: typeof DiamondItem;
};

/**
 * DiamondGrid — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Invariants:
 * - Constant-time Ω(1) config resolution and linear single-pass partitioning.
 * - Symmetrical rhombic column layout with optional container-query responsive collapse.
 *
 * Modes:
 * - 'rhombic' (Default): Classic upright cards forming rhombic column silhouette.
 * - 'isometric': 45-degree diamond cards with counter-rotated upright contents.
 */
export const DiamondGrid = React.forwardRef<HTMLDivElement, DiamondGridProps>(
  ({ children, gap = ${gap}, layout = '${layout}', mode = '${mode}' as DiamondGridMode, diamondItems = false, responsive = ${responsive}, className, style, ...props }, ref) => {
    const uniqueId = React.useId().replace(/:/g, '');
    const childrenArray = React.useMemo(() => React.Children.toArray(children), [children]);
    const totalItems = childrenArray.length;

    const config = React.useMemo(() => getDiamondLayoutConfig(totalItems, layout as DiamondLayoutVariant), [totalItems, layout]);
    const columnGroups = React.useMemo(() => partitionDiamondItems(childrenArray, config), [childrenArray, config]);

    const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;

    return (
      <div
        ref={ref}
        className={clsx(\`exhuma-diamond-container-\${uniqueId} flex w-full flex-col gap-4\`, className)}
        style={{ containerType: responsive ? 'inline-size' : undefined, ...style }}
        {...props}
      >
        {responsive && (
          <style>{\`
            .exhuma-diamond-container-\${uniqueId} {
              container-type: inline-size;
            }
            .exhuma-diamond-mobile-\${uniqueId} {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 0.75rem;
              width: 100%;
            }
            .exhuma-diamond-desktop-\${uniqueId} {
              display: none;
            }
            @container (min-width: 420px) {
              .exhuma-diamond-mobile-\${uniqueId} {
                display: none !important;
              }
              .exhuma-diamond-desktop-\${uniqueId} {
                display: grid !important;
                grid-template-columns: repeat(\${config.columns}, minmax(0, 1fr));
                gap: \${gapVal};
                align-items: center;
                justify-content: center;
                width: 100%;
              }
            }
          \`}</style>
        )}

        {/* Mobile compact grid (< 420px container width) only when responsive=true */}
        {responsive && (
          <div className={\`exhuma-diamond-mobile-\${uniqueId}\`}>
            {childrenArray.map((item, index) => (
              <div key={\`diamond-mobile-\${index}\`} className="flex items-center justify-center">
                {mode === 'isometric' || diamondItems ? (
                  <DiamondItem mode="isometric">{item}</DiamondItem>
                ) : (
                  item
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rhombic Diamond pattern: always active when responsive=false; container-managed when responsive=true */}
        <div
          className={responsive ? \`exhuma-diamond-desktop-\${uniqueId}\` : 'w-full'}
          style={{
            display: responsive ? undefined : 'grid',
            gridTemplateColumns: \`repeat(\${config.columns}, minmax(0, 1fr))\`,
            gap: gapVal,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {columnGroups.map((columnItems, columnIndex) => (
            <DiamondColumn key={\`diamond-col-\${columnIndex}\`} columnIndex={columnIndex} gap={gapVal}>
              {columnItems.map((group) => (
                <DiamondItem key={\`item-\${group.index}\`} mode={mode} diamond={diamondItems}>{group.item}</DiamondItem>
              ))}
            </DiamondColumn>
          ))}
        </div>
      </div>
    );
  }
) as unknown as DiamondGridComponent;

DiamondGrid.displayName = 'DiamondGrid';
DiamondGrid.Grid = DiamondGrid;
DiamondGrid.Column = DiamondColumn;
DiamondGrid.Item = DiamondItem;
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'DiamondGrid.vue',
					language: 'vue',
					description: 'Vue 3 Native Diamond Grid component with container-query responsive collapse.',
					code: `<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue';

interface Props {
  gap?: number | string;
  layout?: 'auto' | 'large' | 'medium' | 'small';
  mode?: 'rhombic' | 'isometric';
  responsive?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  gap: ${gap},
  layout: '${layout}',
  mode: '${mode}',
  responsive: ${responsive},
  class: '',
});

const slots = useSlots();

const DIAMOND_LAYOUT_CONFIGS = {
  large: { maxItems: 16, columns: 7, pattern: [1, 2, 3, 4, 3, 2, 1] },
  medium: { maxItems: 9, columns: 5, pattern: [1, 2, 3, 2, 1] },
  small: { maxItems: 4, columns: 3, pattern: [1, 2, 1] },
};

const rawChildren = computed(() => {
  return slots.default ? slots.default() : [];
});

const config = computed(() => {
  const total = rawChildren.value.length;
  if (props.layout === 'large') return DIAMOND_LAYOUT_CONFIGS.large;
  if (props.layout === 'medium') return DIAMOND_LAYOUT_CONFIGS.medium;
  if (props.layout === 'small') return DIAMOND_LAYOUT_CONFIGS.small;
  if (total >= 16) return DIAMOND_LAYOUT_CONFIGS.large;
  if (total >= 9) return DIAMOND_LAYOUT_CONFIGS.medium;
  if (total >= 4) return DIAMOND_LAYOUT_CONFIGS.small;
  return { maxItems: total, columns: Math.max(1, Math.min(total, 3)), pattern: [] };
});

const columnGroups = computed(() => {
  const items = rawChildren.value.slice(0, config.value.maxItems);
  const cols: VNode[][] = Array.from({ length: config.value.columns }, () => []);
  let idx = 0;

  if (config.value.pattern.length === 0) {
    for (let c = 0; c < config.value.columns && idx < items.length; c++) {
      cols[c].push(items[idx++]);
    }
    return cols;
  }

  for (let c = 0; c < config.value.pattern.length && idx < items.length; c++) {
    const count = config.value.pattern[c];
    for (let i = 0; i < count && idx < items.length; i++) {
      cols[c].push(items[idx++]);
    }
  }
  return cols;
});

const gapVal = computed(() => (typeof props.gap === 'number' ? \`\${props.gap}px\` : props.gap));
</script>

<template>
  <div
    :class="['exhuma-diamond-container flex w-full flex-col gap-4', props.class]"
    :style="{ containerType: props.responsive ? 'inline-size' : undefined }"
  >
    <!-- Mobile Grid (< 420px container width) only when responsive=true -->
    <div v-if="props.responsive" class="exhuma-diamond-mobile grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      <div v-for="(child, i) in rawChildren" :key="i" class="flex items-center justify-center">
        <div v-if="props.mode === 'isometric'" class="group relative flex aspect-square w-12 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
          <div class="-rotate-45 flex flex-col items-center justify-center">
            <component :is="child" />
          </div>
        </div>
        <component v-else :is="child" />
      </div>
    </div>

    <!-- Rhombic Diamond Grid: always active when responsive=false; container-managed when responsive=true -->
    <div
      :class="props.responsive ? 'exhuma-diamond-desktop' : 'w-full'"
      :style="{
        display: props.responsive ? undefined : 'grid',
        gridTemplateColumns: \`repeat(\${config.columns}, minmax(0, 1fr))\`,
        gap: gapVal,
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <div
        v-for="(colItems, colIdx) in columnGroups"
        :key="colIdx"
        class="flex flex-col items-center justify-center"
        :style="{ gridColumn: colIdx + 1, gap: gapVal }"
      >
        <div v-for="(child, i) in colItems" :key="i" class="exhuma-diamond-item">
          <div v-if="props.mode === 'isometric'" class="group relative flex aspect-square w-12 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
            <div class="-rotate-45 flex flex-col items-center justify-center">
              <component :is="child" />
            </div>
          </div>
          <component v-else :is="child" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exhuma-diamond-desktop {
  display: none;
}
@container (min-width: 420px) {
  .exhuma-diamond-mobile {
    display: none !important;
  }
  .exhuma-diamond-desktop {
    display: grid !important;
    align-items: center;
    justify-content: center;
    width: 100%;
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
					filename: 'DiamondGrid.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Diamond Grid component with authentic rhombic column partitioning and container query collapse.',
					code: `<script lang="ts">
  import { onMount, type Snippet } from 'svelte';

  export type DiamondGridMode = 'rhombic' | 'isometric';

  interface Props {
    gap?: number | string;
    layout?: 'auto' | 'large' | 'medium' | 'small';
    mode?: DiamondGridMode;
    responsive?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    gap = ${gap},
    layout = '${layout}',
    mode = '${mode}' as DiamondGridMode,
    responsive = ${responsive},
    class: className = '',
    children
  }: Props = $props();

  const DIAMOND_PATTERN = [1, 2, 3, 4, 3, 2, 1];
  const gapVal = $derived(typeof gap === 'number' ? \`\${gap}px\` : gap);
  let containerRef: HTMLDivElement | undefined = $state();
  let desktopRef: HTMLDivElement | undefined = $state();

  function partitionChildren() {
    if (!desktopRef) return;
    const directChildren = Array.from(desktopRef.children).filter(
      (el) => !el.classList.contains('exhuma-diamond-column')
    );
    if (directChildren.length === 0) return;

    desktopRef.innerHTML = '';
    let idx = 0;
    for (let c = 0; c < DIAMOND_PATTERN.length && idx < directChildren.length; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
      colDiv.style.gridColumn = String(c + 1);
      colDiv.style.gap = gapVal;

      const count = DIAMOND_PATTERN[c];
      for (let i = 0; i < count && idx < directChildren.length; i++) {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'exhuma-diamond-item';
        itemWrap.appendChild(directChildren[idx]);
        colDiv.appendChild(itemWrap);
        idx++;
      }
      desktopRef.appendChild(colDiv);
    }
  }

  onMount(() => {
    partitionChildren();
  });
</script>

<div
  bind:this={containerRef}
  class="exhuma-diamond-container flex w-full flex-col gap-4 {className}"
  style={responsive ? 'container-type: inline-size;' : undefined}
>
  <div
    bind:this={desktopRef}
    class={responsive ? 'exhuma-diamond-desktop w-full' : 'w-full'}
    style="display: {responsive ? undefined : 'grid'}; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: {gapVal}; align-items: center; justify-content: center;"
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .exhuma-diamond-desktop {
    display: none;
  }
  @container (min-width: 420px) {
    .exhuma-diamond-desktop {
      display: grid !important;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      align-items: center;
      justify-content: center;
      width: 100%;
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
					filename: 'DiamondGrid.tsx',
					language: 'tsx',
					description: 'SolidJS Native Diamond Grid component with fine-grained reactivity and rhombic column partitioning.',
					code: `import { Component, JSX, splitProps, createMemo, onMount } from 'solid-js';

export type DiamondLayoutVariant = 'large' | 'medium' | 'small' | 'auto';
export type DiamondGridMode = 'rhombic' | 'isometric';

export interface DiamondGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  layout?: DiamondLayoutVariant;
  mode?: DiamondGridMode;
  responsive?: boolean;
}

const DIAMOND_PATTERN = [1, 2, 3, 4, 3, 2, 1];

export const DiamondGrid: Component<DiamondGridProps> = (props) => {
  const [local, others] = splitProps(props, ['gap', 'layout', 'mode', 'responsive', 'class', 'children']);
  const gapVal = createMemo(() => (typeof local.gap === 'number' ? \`\${local.gap}px\` : (local.gap || '${gap}px')));
  const isResponsive = createMemo(() => Boolean(local.responsive ?? ${responsive}));

  let desktopRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!desktopRef) return;
    const directChildren = Array.from(desktopRef.children).filter(
      (el) => !el.classList.contains('exhuma-diamond-column')
    );
    if (directChildren.length === 0) return;

    desktopRef.innerHTML = '';
    let idx = 0;
    for (let c = 0; c < DIAMOND_PATTERN.length && idx < directChildren.length; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
      colDiv.style.gridColumn = String(c + 1);
      colDiv.style.gap = gapVal();

      const count = DIAMOND_PATTERN[c];
      for (let i = 0; i < count && idx < directChildren.length; i++) {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'exhuma-diamond-item';
        itemWrap.appendChild(directChildren[idx]);
        colDiv.appendChild(itemWrap);
        idx++;
      }
      desktopRef.appendChild(colDiv);
    }
  });

  return (
    <div
      class={\`exhuma-diamond-container flex w-full flex-col gap-4 \${local.class || ''}\`}
      style={{ 'container-type': isResponsive() ? 'inline-size' : undefined }}
      {...others}
    >
      <div
        ref={desktopRef}
        class={isResponsive() ? 'exhuma-diamond-desktop w-full' : 'w-full'}
        style={{
          display: isResponsive() ? undefined : 'grid',
          'grid-template-columns': 'repeat(7, minmax(0, 1fr))',
          gap: gapVal(),
          'align-items': 'center',
          'justify-content': 'center',
        }}
      >
        {local.children}
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
					filename: 'diamond-grid.component.ts',
					language: 'typescript',
					description: 'Angular 18+ standalone Diamond Grid component with authentic rhombic column partitioning.',
					code: `import { Component, input, computed, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhuma-diamond-grid',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div
      class="exhuma-diamond-container flex w-full flex-col gap-4 {{ customClass() }}"
      [style.containerType]="responsive() ? 'inline-size' : undefined"
    >
      <div
        #desktopGrid
        [class]="responsive() ? 'exhuma-diamond-desktop w-full' : 'w-full'"
        [style.display]="responsive() ? null : 'grid'"
        style="grid-template-columns: repeat(7, minmax(0, 1fr)); align-items: center; justify-content: center; width: 100%;"
        [style.gap]="gapValue()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  \`,
  styles: [\`
    :host { display: block; width: 100%; }
    .exhuma-diamond-desktop { display: none; }
    @container (min-width: 420px) {
      .exhuma-diamond-desktop {
        display: grid !important;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        align-items: center;
        justify-content: center;
        width: 100%;
      }
    }
  \`]
})
export class ExhumaDiamondGridComponent implements AfterViewInit {
  readonly gap = input<number | string>(${gap});
  readonly layout = input<string>('${layout}');
  readonly mode = input<'rhombic' | 'isometric'>('${mode}');
  readonly responsive = input<boolean>(${responsive});
  readonly customClass = input<string>('');

  readonly desktopGrid = viewChild<ElementRef<HTMLDivElement>>('desktopGrid');

  gapValue = computed(() => {
    const g = this.gap();
    return typeof g === 'number' ? \`\${g}px\` : g;
  });

  ngAfterViewInit() {
    const gridEl = this.desktopGrid()?.nativeElement;
    if (!gridEl) return;
    const directChildren = Array.from(gridEl.children).filter(
      (el) => !el.classList.contains('exhuma-diamond-column')
    );
    if (directChildren.length === 0) return;

    const pattern = [1, 2, 3, 4, 3, 2, 1];
    gridEl.innerHTML = '';
    let idx = 0;
    for (let c = 0; c < pattern.length && idx < directChildren.length; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
      colDiv.style.gridColumn = String(c + 1);
      colDiv.style.gap = String(this.gapValue());

      const count = pattern[c];
      for (let i = 0; i < count && idx < directChildren.length; i++) {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'exhuma-diamond-item';
        itemWrap.appendChild(directChildren[idx]);
        colDiv.appendChild(itemWrap);
        idx++;
      }
      gridEl.appendChild(colDiv);
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
					filename: 'DiamondGrid.astro',
					language: 'astro',
					description: 'Astro Native Diamond Grid component with authentic rhombic column partitioning.',
					code: `---
interface Props {
  gap?: number | string;
  layout?: 'auto' | 'large' | 'medium' | 'small';
  mode?: 'rhombic' | 'isometric';
  responsive?: boolean;
  class?: string;
}

const {
  gap = ${gap},
  layout = '${layout}',
  mode = '${mode}',
  responsive = ${responsive},
  class: className = ''
} = Astro.props;

const gapVal = typeof gap === 'number' ? \`\${gap}px\` : gap;
---

<div
  class:list={["exhuma-diamond-container flex w-full flex-col gap-4", className]}
  style={responsive ? "container-type: inline-size;" : undefined}
>
  <div
    class:list={["exhuma-diamond-desktop w-full", !responsive && "grid-active"]}
    data-gap={gapVal}
    style={{
      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
      gap: gapVal,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <slot />
  </div>
</div>

<script>
  function partitionAstroDiamond() {
    document.querySelectorAll('.exhuma-diamond-desktop').forEach((grid) => {
      const children = Array.from(grid.children).filter(
        (el) => !el.classList.contains('exhuma-diamond-column')
      );
      if (children.length === 0) return;
      const pattern = [1, 2, 3, 4, 3, 2, 1];
      const gap = (grid as HTMLElement).dataset.gap || '${gap}px';
      grid.innerHTML = '';
      let idx = 0;
      for (let c = 0; c < pattern.length && idx < children.length; c++) {
        const col = document.createElement('div');
        col.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
        col.style.gridColumn = String(c + 1);
        col.style.gap = gap;
        for (let i = 0; i < pattern[c] && idx < children.length; i++) {
          const itemWrap = document.createElement('div');
          itemWrap.className = 'exhuma-diamond-item';
          itemWrap.appendChild(children[idx]);
          col.appendChild(itemWrap);
          idx++;
        }
        grid.appendChild(col);
      }
    });
  }
  partitionAstroDiamond();
  document.addEventListener('astro:page-load', partitionAstroDiamond);
</script>

<style>
  .exhuma-diamond-desktop.grid-active {
    display: grid !important;
  }
  .exhuma-diamond-desktop:not(.grid-active) {
    display: none;
  }
  @container (min-width: 420px) {
    .exhuma-diamond-desktop {
      display: grid !important;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }
</style>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'diamond-grid.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Diamond Grid with rhombic column distribution.',
					code: `@props([
    'gap' => ${gap},
    'layout' => '${layout}',
    'mode' => '${mode}',
    'responsive' => ${responsive ? 'true' : 'false'},
])

@php
$gapVal = is_numeric($gap) ? "{$gap}px" : $gap;
$containerStyle = $responsive ? 'container-type: inline-size;' : '';
$uniqueId = 'diamond_' . uniqid();
@endphp

<div {{ $attributes->merge(['class' => 'exhuma-diamond-container flex w-full flex-col gap-4']) }} style="{{ $containerStyle }}" id="{{ $uniqueId }}">
    <div class="exhuma-diamond-desktop w-full" style="display: {{ $responsive ? 'none' : 'grid' }}; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: {{ $gapVal }}; align-items: center; justify-content: center;" data-gap="{{ $gapVal }}">
        {{ $slot }}
    </div>
</div>

<script>
(function() {
    var container = document.getElementById('{{ $uniqueId }}');
    if (!container) return;
    var grid = container.querySelector('.exhuma-diamond-desktop');
    if (!grid) return;
    var children = Array.from(grid.children).filter(function(el) { return !el.classList.contains('exhuma-diamond-column'); });
    if (children.length === 0) return;
    var pattern = [1, 2, 3, 4, 3, 2, 1];
    var gap = grid.getAttribute('data-gap') || '{{ $gapVal }}';
    grid.innerHTML = '';
    var idx = 0;
    for (var c = 0; c < pattern.length && idx < children.length; c++) {
        var col = document.createElement('div');
        col.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
        col.style.gridColumn = String(c + 1);
        col.style.gap = gap;
        for (var i = 0; i < pattern[c] && idx < children.length; i++) {
            var itemWrap = document.createElement('div');
            itemWrap.className = 'exhuma-diamond-item';
            itemWrap.appendChild(children[idx]);
            col.appendChild(itemWrap);
            idx++;
        }
        grid.appendChild(col);
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
					filename: 'diamond-grid.js',
					language: 'javascript',
					description: 'Autonomous Vanilla JS Diamond Grid partition and container-query initialization module.',
					code: `export function initDiamondGrid(selector = '[data-exhuma-diamond-grid]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const instances = [];

  elements.forEach((grid) => {
    const gap = options.gap || grid.getAttribute('data-gap') || '${gap}px';
    const gapVal = typeof gap === 'number' ? gap + 'px' : gap;
    const responsive = options.responsive !== undefined ? options.responsive : grid.getAttribute('data-responsive') === 'true';
    const mode = options.mode || grid.getAttribute('data-mode') || '${mode}';

    const rawChildren = Array.from(grid.children).filter(
      (el) => !el.classList.contains('exhuma-diamond-column')
    );
    if (rawChildren.length === 0) return;

    const pattern = [1, 2, 3, 4, 3, 2, 1];
    const columns = 7;

    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = \`repeat(\${columns}, minmax(0, 1fr))\`;
    grid.style.gap = gapVal;
    grid.style.alignItems = 'center';
    grid.style.justifyContent = 'center';
    grid.style.width = '100%';

    if (responsive) {
      grid.style.containerType = 'inline-size';
    }

    let idx = 0;
    for (let c = 0; c < pattern.length && idx < rawChildren.length; c++) {
      const col = document.createElement('div');
      col.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
      col.style.gridColumn = String(c + 1);
      col.style.gap = gapVal;

      const count = pattern[c];
      for (let i = 0; i < count && idx < rawChildren.length; i++) {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'exhuma-diamond-item';

        if (mode === 'isometric') {
          itemWrap.className += ' group relative flex aspect-square w-12 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary';
          const inner = document.createElement('div');
          inner.className = '-rotate-45 flex flex-col items-center justify-center';
          inner.appendChild(rawChildren[idx]);
          itemWrap.appendChild(inner);
        } else {
          itemWrap.appendChild(rawChildren[idx]);
        }

        col.appendChild(itemWrap);
        idx++;
      }
      grid.appendChild(col);
    }

    instances.push(grid);
  });

  return instances;
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
					description: 'WordPress Block API v3 specification for Diamond Grid.',
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: 'exhuma/diamond-grid',
							version: '1.0.0',
							title: 'Exhuma Diamond Grid',
							category: 'layout',
							description: 'Rhombic symmetrical diamond column distribution with container-query responsive collapse.',
							attributes: {
								gap: { type: 'number', default: gap },
								layout: { type: 'string', default: layout },
								mode: { type: 'string', default: mode },
								responsive: { type: 'boolean', default: responsive },
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
					description: 'WordPress render template for Diamond Grid with rhombic column partitioning.',
					code: `<?php
/**
 * Exhuma Diamond Grid Block Render Template
 */
$gap = isset($attributes['gap']) ? $attributes['gap'] : ${gap};
$gap_val = is_numeric($gap) ? "{$gap}px" : $gap;
$responsive = isset($attributes['responsive']) ? (bool) $attributes['responsive'] : ${responsive ? 'true' : 'false'};
$mode = isset($attributes['mode']) ? $attributes['mode'] : '${mode}';
$unique_id = 'wp_diamond_' . wp_unique_id();

$container_style = $responsive ? 'container-type: inline-size;' : '';

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'exhuma-diamond-container flex w-full flex-col gap-4',
    'id' => $unique_id,
    'style' => $container_style,
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="exhuma-diamond-desktop w-full" data-gap="<?php echo esc_attr($gap_val); ?>" data-mode="<?php echo esc_attr($mode); ?>" style="display: <?php echo $responsive ? 'none' : 'grid'; ?>; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: <?php echo esc_attr($gap_val); ?>; align-items: center; justify-content: center;">
        <?php echo $content; ?>
    </div>
</div>

<script>
(function() {
    var container = document.getElementById('<?php echo esc_js($unique_id); ?>');
    if (!container) return;
    var grid = container.querySelector('.exhuma-diamond-desktop');
    if (!grid) return;
    var children = Array.from(grid.children).filter(function(el) { return !el.classList.contains('exhuma-diamond-column'); });
    if (children.length === 0) return;
    var pattern = [1, 2, 3, 4, 3, 2, 1];
    var gap = grid.getAttribute('data-gap') || '<?php echo esc_js($gap_val); ?>';
    grid.innerHTML = '';
    var idx = 0;
    for (var c = 0; c < pattern.length && idx < children.length; c++) {
        var col = document.createElement('div');
        col.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
        col.style.gridColumn = String(c + 1);
        col.style.gap = gap;
        for (var i = 0; i < pattern[c] && idx < children.length; i++) {
            var itemWrap = document.createElement('div');
            itemWrap.className = 'exhuma-diamond-item';
            itemWrap.appendChild(children[idx]);
            col.appendChild(itemWrap);
            idx++;
        }
        grid.appendChild(col);
    }
})();
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-diamond-grid.js',
					language: 'javascript',
					description: 'Autonomous Custom Element (<exhuma-diamond-grid>) with authentic rhombic column partitioning.',
					code: `class ExhumaDiamondGrid extends HTMLElement {
  connectedCallback() {
    const gap = this.getAttribute('gap') || '${gap}px';
    const gapVal = typeof gap === 'number' ? gap + 'px' : gap;
    const responsive = this.hasAttribute('responsive') && this.getAttribute('responsive') !== 'false';
    const mode = this.getAttribute('mode') || '${mode}';

    const children = Array.from(this.children).filter(
      (el) => !el.classList.contains('exhuma-diamond-column')
    );
    if (children.length === 0) return;

    this.style.display = 'grid';
    this.style.gridTemplateColumns = 'repeat(7, minmax(0, 1fr))';
    this.style.gap = gapVal;
    this.style.width = '100%';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';

    if (responsive) {
      this.style.containerType = 'inline-size';
    }

    const pattern = [1, 2, 3, 4, 3, 2, 1];
    this.innerHTML = '';
    let idx = 0;

    for (let c = 0; c < pattern.length && idx < children.length; c++) {
      const col = document.createElement('div');
      col.className = 'exhuma-diamond-column flex flex-col items-center justify-center';
      col.style.gridColumn = String(c + 1);
      col.style.gap = gapVal;

      const count = pattern[c];
      for (let i = 0; i < count && idx < children.length; i++) {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'exhuma-diamond-item';
        if (mode === 'isometric') {
          itemWrap.className += ' group relative flex aspect-square w-12 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary';
          const inner = document.createElement('div');
          inner.className = '-rotate-45 flex flex-col items-center justify-center';
          inner.appendChild(children[idx]);
          itemWrap.appendChild(inner);
        } else {
          itemWrap.appendChild(children[idx]);
        }
        col.appendChild(itemWrap);
        idx++;
      }
      this.appendChild(col);
    }
  }
}

if (!customElements.get('exhuma-diamond-grid')) {
  customElements.define('exhuma-diamond-grid', ExhumaDiamondGrid);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'DiamondGrid.tsx',
					language: 'tsx',
					description: 'React Native Diamond Grid layout container with authentic rhombic column distribution.',
					code: `import React, { useMemo } from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';

export type DiamondGridMode = 'rhombic' | 'isometric';

export interface DiamondGridProps extends ViewProps {
  gap?: number;
  mode?: DiamondGridMode;
  responsive?: boolean;
}

const DIAMOND_PATTERN = [1, 2, 3, 4, 3, 2, 1];

export const DiamondGrid: React.FC<DiamondGridProps> = ({
  gap = ${gap},
  mode = '${mode}' as DiamondGridMode,
  responsive = ${responsive},
  style,
  children,
  ...props
}) => {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  const columnGroups = useMemo(() => {
    const cols: React.ReactNode[][] = Array.from({ length: 7 }, () => []);
    let idx = 0;
    for (let c = 0; c < DIAMOND_PATTERN.length && idx < childrenArray.length; c++) {
      const count = DIAMOND_PATTERN[c];
      for (let i = 0; i < count && idx < childrenArray.length; i++) {
        cols[c].push(childrenArray[idx++]);
      }
    }
    return cols;
  }, [childrenArray]);

  return (
    <View style={[styles.container, { gap }, style]} {...props}>
      {columnGroups.map((colItems, colIdx) => (
        <View key={colIdx} style={[styles.column, { gap }]}>
          {colItems.map((child, itemIdx) => (
            <View key={itemIdx} style={styles.itemWrapper}>
              {child}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'diamond_grid.dart',
					language: 'dart',
					description: 'Flutter Diamond Grid layout widget with authentic rhombic column distribution.',
					code: `import 'package:flutter/material.dart';

class ExhumaDiamondGrid extends StatelessWidget {
  final List<Widget> children;
  final double gap;
  final String mode;
  final bool responsive;

  static const List<int> diamondPattern = [1, 2, 3, 4, 3, 2, 1];

  const ExhumaDiamondGrid({
    super.key,
    required this.children,
    this.gap = ${gap}.0,
    this.mode = '${mode}',
    this.responsive = ${responsive},
  });

  List<List<Widget>> _partitionChildren() {
    final List<List<Widget>> cols = List.generate(7, (_) => []);
    int idx = 0;
    for (int c = 0; c < diamondPattern.length && idx < children.length; c++) {
      final count = diamondPattern[c];
      for (int i = 0; i < count && idx < children.length; i++) {
        cols[c].add(children[idx++]);
      }
    }
    return cols;
  }

  @override
  Widget build(BuildContext context) {
    final columnGroups = _partitionChildren();

    return Center(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            for (int colIdx = 0; colIdx < columnGroups.length; colIdx++) ...[
              if (colIdx > 0) SizedBox(width: gap),
              Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  for (int itemIdx = 0; itemIdx < columnGroups[colIdx].length; itemIdx++) ...[
                    if (itemIdx > 0) SizedBox(height: gap),
                    columnGroups[colIdx][itemIdx],
                  ],
                ],
              ),
            ],
          ],
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

export function getDiamondGridUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const gap = typeof props.gap === 'number' ? props.gap : Number(props.gap ?? 16);
	const layout = String(props.layout || 'auto');
	const mode = String(props.mode || 'rhombic');
	const responsive = Boolean(props.responsive ?? false);
	const isIsometric = mode === 'isometric';

	const cardReact = isIsometric
		? `          <div
            key={idx}
            className="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
          >
            <div className="-rotate-45 flex flex-col items-center justify-center">
              <span className="text-3xs font-mono font-bold text-primary">#{idx + 1}</span>
            </div>
          </div>`
		: `          <div
            key={idx}
            className="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary"
          >
            <span className="text-3xs font-mono font-bold text-primary">#{idx + 1}</span>
          </div>`;

	const cardVue = isIsometric
		? `      <div
        v-for="idx in 16"
        :key="idx"
        class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
      >
        <div class="-rotate-45 flex flex-col items-center justify-center">
          <span class="text-xs font-mono font-bold text-primary">#{{ idx }}</span>
        </div>
      </div>`
		: `      <div
        v-for="idx in 16"
        :key="idx"
        class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary"
      >
        <span class="text-xs font-mono font-bold text-primary">#{{ idx }}</span>
      </div>`;

	const cardSvelte = isIsometric
		? `      <div class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
        <div class="-rotate-45 flex flex-col items-center justify-center">
          <span class="text-xs font-mono font-bold text-primary">#{idx + 1}</span>
        </div>
      </div>`
		: `      <div class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary">
        <span class="text-xs font-mono font-bold text-primary">#{idx + 1}</span>
      </div>`;

	const cardSolid = isIsometric
		? `            <div class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
              <div class="-rotate-45 flex flex-col items-center justify-center">
                <span class="text-xs font-mono font-bold text-primary">#{idx() + 1}</span>
              </div>
            </div>`
		: `            <div class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary">
              <span class="text-xs font-mono font-bold text-primary">#{idx() + 1}</span>
            </div>`;

	const cardAngular = isIsometric
		? `        <div
          *ngFor="let item of items; let idx = index"
          class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg"
        >
          <div class="-rotate-45 flex flex-col items-center justify-center">
            <span class="text-xs font-mono font-bold text-primary">#{{ idx + 1 }}</span>
          </div>
        </div>`
		: `        <div
          *ngFor="let item of items; let idx = index"
          class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary"
        >
          <span class="text-xs font-mono font-bold text-primary">#{{ idx + 1 }}</span>
        </div>`;

	const cardAstro = isIsometric
		? `      <div class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
        <div class="-rotate-45 flex flex-col items-center justify-center">
          <span class="text-xs font-mono font-bold text-primary">#{idx + 1}</span>
        </div>
      </div>`
		: `      <div class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary">
        <span class="text-xs font-mono font-bold text-primary">#{idx + 1}</span>
      </div>`;

	const cardBlade = isIsometric
		? `            <div class="group relative flex aspect-square w-10 sm:w-14 items-center justify-center rotate-45 rounded-xl border border-border/80 bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-primary/20 hover:shadow-lg">
                <div class="-rotate-45 flex flex-col items-center justify-center">
                    <span class="text-xs font-mono font-bold text-primary">#{{ $i }}</span>
                </div>
            </div>`
		: `            <div class="flex aspect-square w-12 sm:w-16 flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary">
                <span class="text-xs font-mono font-bold text-primary">#{{ $i }}</span>
            </div>`;

	switch (flavor) {
		case 'nextjs': {
			return {
				filename: 'page.tsx',
				language: 'tsx',
				description: 'Next.js 15 App Router page showcasing DiamondGrid with rhombic column distribution.',
				code: `'use client';

import React from 'react';
import { DiamondGrid } from '@/components/ui/DiamondGrid';

export default function DiamondGridPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <span className="text-xs font-mono text-primary uppercase tracking-widest">
          EXHUMA LAYOUT ENGINE // DIAMOND GRID
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          Rhombic Symmetrical Mosaic
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-3">
          Symmetrical column distribution [1, 2, 3, 4, 3, 2, 1] with container-query responsive collapse.
        </p>
      </div>

      <DiamondGrid gap={${gap}} layout="${layout}" mode="${mode}"${responsive ? ' responsive' : ''} className="max-w-4xl mx-auto">
        {Array.from({ length: 16 }).map((_, idx) => (
${cardReact}
        ))}
      </DiamondGrid>
    </main>
  );
}
`,
			};
		}

		case 'react': {
			return {
				filename: 'DiamondGridDemo.tsx',
				language: 'tsx',
				description: 'React demo component showcasing DiamondGrid with rhombic items.',
				code: `import React from 'react';
import { DiamondGrid } from '@/components/ui/DiamondGrid';

export default function DiamondGridDemo() {
  return (
    <section className="py-12 bg-background text-foreground">
      <DiamondGrid gap={${gap}} layout="${layout}" mode="${mode}"${responsive ? ' responsive' : ''} className="max-w-4xl mx-auto">
        {Array.from({ length: 16 }).map((_, idx) => (
${cardReact}
        ))}
      </DiamondGrid>
    </section>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'DiamondGridDemo.vue',
				language: 'vue',
				description: 'Vue 3 SFC demo with DiamondGrid and 16 items.',
				code: `<script setup lang="ts">
import DiamondGrid from '@/components/ui/DiamondGrid.vue';
</script>

<template>
  <main class="min-h-screen bg-background text-foreground p-8">
    <DiamondGrid :gap="${gap}" layout="${layout}" mode="${mode}"${responsive ? ' :responsive="true"' : ''} class="max-w-4xl mx-auto">
${cardVue}
    </DiamondGrid>
  </main>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'DiamondGridDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 runes demo with DiamondGrid and 16 items.',
				code: `<script lang="ts">
  import DiamondGrid from '$lib/components/DiamondGrid.svelte';
</script>

<main class="min-h-screen bg-background text-foreground p-8">
  <DiamondGrid gap={${gap}} layout="${layout}" mode="${mode}"${responsive ? ' responsive' : ''} class="max-w-4xl mx-auto">
    {#each Array(16) as _, idx}
${cardSvelte}
    {/each}
  </DiamondGrid>
</main>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'DiamondGridDemo.tsx',
				language: 'tsx',
				description: 'SolidJS demo with DiamondGrid.',
				code: `import { Component, For } from 'solid-js';
import { DiamondGrid } from '@/components/ui/DiamondGrid';

export const DiamondGridDemo: Component = () => {
  return (
    <main class="min-h-screen bg-background text-foreground p-8">
      <DiamondGrid gap={${gap}} layout="${layout}" mode="${mode}"${responsive ? ' responsive' : ''} class="max-w-4xl mx-auto">
        <For each={Array.from({ length: 16 })}>
          {(_, idx) => (
${cardSolid}
          )}
        </For>
      </DiamondGrid>
    </main>
  );
};
`,
			};
		}

		case 'angular': {
			return {
				filename: 'diamond-grid-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ standalone demo with DiamondGrid.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExhumaDiamondGridComponent } from './diamond-grid.component';

@Component({
  selector: 'app-diamond-grid-demo',
  standalone: true,
  imports: [CommonModule, ExhumaDiamondGridComponent],
  template: \`
    <main class="min-h-screen bg-background text-foreground p-8">
      <exhuma-diamond-grid [gap]="${gap}" layout="${layout}" mode="${mode}"${responsive ? ' [responsive]="true"' : ''} class="max-w-4xl mx-auto">
${cardAngular}
      </exhuma-diamond-grid>
    </main>
  \`,
})
export class DiamondGridDemoComponent {
  readonly items = Array.from({ length: 16 });
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'DiamondGridDemo.astro',
				language: 'astro',
				description: 'Astro component demo with DiamondGrid.',
				code: `---
import DiamondGrid from '@/components/DiamondGrid.astro';
---

<main class="min-h-screen bg-background text-foreground p-8">
  <DiamondGrid gap={${gap}} layout="${layout}" mode="${mode}"${responsive ? ' responsive' : ''} class="max-w-4xl mx-auto">
    {Array.from({ length: 16 }).map((_, idx) => (
${cardAstro}
    ))}
  </DiamondGrid>
</main>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'diamond-grid-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade view showcasing DiamondGrid.',
				code: `<main class="min-h-screen bg-background text-foreground p-8">
    <x-diamond-grid :gap="${gap}" layout="${layout}" mode="${mode}"${responsive ? ' :responsive="true"' : ''} class="max-w-4xl mx-auto">
        @for ($i = 1; $i <= 16; $i++)
${cardBlade}
        @endfor
    </x-diamond-grid>
</main>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'HTML5 / Vanilla JavaScript Diamond Grid demo.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diamond Grid Demo</title>
  <style>
    .exhuma-diamond-grid {
      display: grid;
      grid-template-columns: ${responsive ? 'repeat(2, minmax(0, 1fr))' : 'repeat(7, minmax(0, 1fr))'};
      gap: ${gap}px;
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem;
      ${responsive ? 'container-type: inline-size;' : 'align-items: center; justify-content: center;'}
    }
    ${
		responsive
			? `@media (min-width: 640px) {
      .exhuma-diamond-grid {
        grid-template-columns: repeat(7, minmax(0, 1fr));
        align-items: center;
      }
    }`
			: ''
	}
    .diamond-card {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      font-family: monospace;
      font-weight: bold;
      color: #6366f1;
      transition: transform 0.3s ease;
    }
    .diamond-card:hover {
      transform: scale(1.05);
      border-color: #6366f1;
    }
  </style>
</head>
<body style="background: #09090b; color: #fafafa; font-family: system-ui, sans-serif;">
  <div class="exhuma-diamond-grid" data-exhuma-diamond-grid data-gap="${gap}"${responsive ? ' data-responsive="true"' : ''}>
    <!-- 16 Diamond Cards -->
    <div class="diamond-card">#1</div>
    <div class="diamond-card">#2</div>
    <div class="diamond-card">#3</div>
    <div class="diamond-card">#4</div>
    <div class="diamond-card">#5</div>
    <div class="diamond-card">#6</div>
    <div class="diamond-card">#7</div>
    <div class="diamond-card">#8</div>
    <div class="diamond-card">#9</div>
    <div class="diamond-card">#10</div>
    <div class="diamond-card">#11</div>
    <div class="diamond-card">#12</div>
    <div class="diamond-card">#13</div>
    <div class="diamond-card">#14</div>
    <div class="diamond-card">#15</div>
    <div class="diamond-card">#16</div>
  </div>

  <script type="module">
    import { initDiamondGrid } from './diamond-grid.js';
    initDiamondGrid();
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
				description: 'WordPress render template for Diamond Grid with attributes.',
				code: `<?php
/**
 * DiamondGrid Block Render Template
 */
$gap = isset($attributes['gap']) ? (int) $attributes['gap'] : ${gap};
$responsive = isset($attributes['responsive']) ? (bool) $attributes['responsive'] : ${responsive ? 'true' : 'false'};
$wrapper_attributes = get_block_wrapper_attributes([
    'class' => $responsive ? 'exhuma-diamond-grid grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 items-center justify-center max-w-4xl mx-auto' : 'exhuma-diamond-grid grid grid-cols-7 items-center justify-center max-w-4xl mx-auto',
    'style' => 'gap: ' . $gap . 'px;' . ($responsive ? ' container-type: inline-size;' : ''),
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php echo $content; ?>
</div>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'diamond-grid.html',
				language: 'html',
				description: 'Autonomous Custom Element usage for <exhuma-diamond-grid>.',
				code: `<exhuma-diamond-grid gap="${gap}"${responsive ? ' responsive' : ''}>
  <div>#1</div>
  <div>#2</div>
  <div>#3</div>
  <div>#4</div>
  <div>#5</div>
  <div>#6</div>
  <div>#7</div>
  <div>#8</div>
  <div>#9</div>
  <div>#10</div>
  <div>#11</div>
  <div>#12</div>
  <div>#13</div>
  <div>#14</div>
  <div>#15</div>
  <div>#16</div>
</exhuma-diamond-grid>

<script src="./exhuma-diamond-grid.js"></script>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'DiamondGridDemo.tsx',
				language: 'tsx',
				description: 'React Native DiamondGrid demo with 16 cards.',
				code: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiamondGrid } from './DiamondGrid';

export default function DiamondGridDemo() {
  return (
    <View style={styles.screen}>
      <DiamondGrid gap={${gap}}${responsive ? ' responsive' : ''}>
        {Array.from({ length: 16 }).map((_, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.cardText}>#{idx + 1}</Text>
          </View>
        ))}
      </DiamondGrid>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#09090b', padding: 24, justifyContent: 'center' },
  card: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { color: '#6366f1', fontFamily: 'monospace', fontWeight: 'bold' },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'diamond_grid_demo.dart',
				language: 'dart',
				description: 'Flutter DiamondGrid demo with 16 cards.',
				code: `import 'package:flutter/material.dart';
import 'diamond_grid.dart';

class DiamondGridDemo extends StatelessWidget {
  const DiamondGridDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      body: Center(
        child: ExhumaDiamondGrid(
          gap: ${gap}.0,
          ${responsive ? 'responsive: true,\n          ' : ''}children: List.generate(
            16,
            (idx) => Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: Center(
                child: Text(
                  '#\${idx + 1}',
                  style: const TextStyle(
                    color: Color(0xFF6366F1),
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                  ),
                ),
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
				filename: 'DiamondGridDemo.tsx',
				language: 'tsx',
				description: 'Generic DiamondGrid demo.',
				code: `import { DiamondGrid } from '@/components/ui/DiamondGrid';

export default function DiamondGridDemo() {
  return (
    <DiamondGrid gap={${gap}} layout="${layout}">
      {Array.from({ length: 16 }).map((_, idx) => (
        <div key={idx}>#{idx + 1}</div>
      ))}
    </DiamondGrid>
  );
}
`,
			};
		}
	}
}
