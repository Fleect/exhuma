# Layout Engines Deep Dive (@exhuma/layouts)

`@exhuma/layouts` provides high-performance responsive layout engines, masonry balancers, marquee tracks, and geometric grids engineered for silky-smooth 60 FPS compositor execution.

---

## 1. `<CssMasonry>`

Zero-dependency CSS `column-count` masonry layout. Automatically handles `break-inside: avoid` so cards never tear across columns.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `3` | Base column count or responsive breakpoint map. |
| `columnsSm` | `number` | `1` | Column count override on mobile viewports (<640px). |
| `columnsMd` | `number` | `2` | Column count override on tablet viewports (640px-1024px). |
| `columnsLg` | `number` | `3` | Column count override on desktop viewports (1024px-1280px). |
| `columnsXl` | `number` | `4` | Column count override on ultra-wide viewports (≥1280px). |
| `gap` | `string \| number` | `'1.5rem'` | Column and row gap. |
| `columnFill` | `'balance' \| 'auto'` | `'balance'` | Multi-column fill mode. |
| `height` | `string \| number` | `undefined` | Optional fixed container height (needed for `columnFill: 'auto'`). |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { CssMasonry, CssMasonryItem } from '@exhuma/core';

export function MasonryFeed({ items }: { items: string[] }) {
  return (
    <CssMasonry columns={{ sm: 1, md: 2, lg: 3 }} gap="1.5rem">
      {items.map((item, idx) => (
        <CssMasonryItem key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-300">{item}</p>
        </CssMasonryItem>
      ))}
    </CssMasonry>
  );
}
```

---

## 2. `<RowMasonry>`

High-performance $\mathcal{O}(N \log K)$ greedy row-by-row masonry balancer placing items into the shortest column using hardware-accelerated GPU `transform: translate3d(x, y, 0)` positioning. Preserves natural chronological reading order across rows and features capture-phase media load listeners with single-frame coalesced `requestAnimationFrame` batching.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `1` | Mobile column count (<640px) or responsive breakpoint map. |
| `columnsSm` | `number` | `2` | Small tablet column count (≥640px). |
| `columnsMd` | `number` | `2` | Medium tablet column count (≥768px). |
| `columnsLg` | `number` | `3` | Desktop column count (≥1024px). |
| `columnsXl` | `number` | `4` | Ultra-wide column count (≥1280px). |
| `gap` | `string \| number` | `16` | Spacing between masonry columns and tiles in px. |
| `children` | `ReactNode` | *required* | Masonry tiles wrapped in `<RowMasonryItem>` or raw elements. |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { RowMasonry, RowMasonryItem } from '@exhuma/core';

export function ChronologicalFeed({ cards }: { cards: { id: string; height: number; text: string }[] }) {
  return (
    <RowMasonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={20}>
      {cards.map((card) => (
        <RowMasonryItem key={card.id}>
          <div
            style={{ height: card.height }}
            className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl"
          >
            <p className="text-zinc-300">{card.text}</p>
          </div>
        </RowMasonryItem>
      ))}
    </RowMasonry>
  );
}
```

---

## 3. `<AutoGrid>`

Smart CSS grid wrapper utilizing `repeat(auto-fit, minmax(minItemWidth, 1fr))`. Automatically computes responsive track counts without requiring media queries.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `minItemWidth` | `number \| string` | `280` | Minimum column width before wrapping to the next line. |
| `gap` | `string \| number` | `'1.5rem'` | CSS gap token between cells. |
| `mode` | `'auto-fit' \| 'auto-fill'` | `'auto-fit'` | CSS Grid repeat track mode. |
| `maxColumns` | `number` | `undefined` | Optional maximum column ceiling. |
| `alignItems` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | Cross-axis item alignment. |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { AutoGrid, AutoGridItem } from '@exhuma/core';

export function FeatureGrid() {
  return (
    <AutoGrid minItemWidth={280} gap="1.5rem">
      <AutoGridItem className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-white font-bold">Fast Setup</h3>
      </AutoGridItem>
      <AutoGridItem className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-white font-bold">Zero Overhead</h3>
      </AutoGridItem>
    </AutoGrid>
  );
}
```

---

## 4. `<InfiniteMarquee>`

Continuous horizontal ticker rail with pause-on-hover deceleration, edge gradient masks, and sub-pixel translation.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `speed` | `number` | `40` | Scroll speed in pixels per second. |
| `direction` | `'left' \| 'right'` | `'left'` | Direction of marquee translation. |
| `pauseOnHover` | `boolean` | `true` | Decelerate translation to zero when hovered. |
| `gap` | `string \| number` | `'1.5rem'` | Spacing between items and repeated blocks. |
| `showFadeEdges` | `boolean` | `true` | Show gradient mask at boundaries for seamless entry/exit. |
| `fadeWidth` | `number` | `48` | Width in pixels of edge gradient mask. |
| `fadeEdgeColor` | `string` | `'#ffffff'` | Light mode gradient fade color. |
| `fadeEdgeColorDark` | `string` | `'#09090b'` | Dark mode gradient fade color. |
| `scrollCoupling` | `boolean` | `false` | Couple marquee velocity to page scroll speed. |
| `directionHysteresis` | `boolean` | `false` | Smooth direction reversal on scroll direction change. |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { InfiniteMarquee } from '@exhuma/core';

export function SponsorTicker({ logos }: { logos: string[] }) {
  return (
    <InfiniteMarquee speed={50} pauseOnHover={true} gap="2rem">
      {logos.map((logo, idx) => (
        <span key={idx} className="text-zinc-500 font-semibold text-lg">{logo}</span>
      ))}
    </InfiniteMarquee>
  );
}
```

---

## 5. `<BentoGrid>` & `<BentoCard>`

Asymmetric bento-box grid with responsive column spans, customizable row heights, and optional kinetic pointer hover glow.

### Props (`BentoGrid`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cols` | `number \| { sm?: number; md?: number; lg?: number }` | `3` | Maximum column count for large screens. |
| `gap` | `string \| number` | `'1.5rem'` | Spacing between bento tiles. |
| `rowHeight` | `string \| number` | `undefined` | Base auto-rows track height for asymmetric vertical spans. |
| `className` | `string` | `''` | Container class name. |

### Props (`BentoCard`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `colSpan` | `number` | `1` | Column span on desktop screens (1 to 4). |
| `rowSpan` | `number` | `1` | Row span on desktop screens (1 to 3). |
| `enableGlow` | `boolean` | `true` | Enable subtle kinetic pointer hover glow. |
| `glowColor` | `string` | `'rgba(99, 102, 241, 0.08)'` | Custom radial glow color on hover. |
| `className` | `string` | `''` | Tile class name. |

### Usage

```tsx
import { BentoGrid, BentoCard } from '@exhuma/core';

export function DashboardBento() {
  return (
    <BentoGrid cols={{ sm: 1, md: 2, lg: 3 }} gap="1.5rem">
      <BentoCard colSpan={2} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-xl font-bold text-white">Analytics Overview</h3>
      </BentoCard>
      <BentoCard colSpan={1} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 className="text-xl font-bold text-white">Live Feeds</h3>
      </BentoCard>
    </BentoGrid>
  );
}
```

---

## 6. `<DiamondGrid>`

Signature geometric diamond showcase displaying cards in a symmetrical rhombic column silhouette (e.g. `[1, 2, 3, 2, 1]`) with optional 45-degree isometric rotation and counter-rotated upright content.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `gap` | `string \| number` | `16` | Spacing between diamond columns and elements. |
| `layout` | `'large' \| 'medium' \| 'small' \| 'auto'` | `'auto'` | Column topology ('medium' = 5 cols `[1, 2, 3, 2, 1]`). |
| `mode` | `'rhombic' \| 'isometric'` | `'rhombic'` | Visual rendering silhouette mode. |
| `diamondItems` | `boolean` | `false` | Apply 45-degree card rotation with upright counter-rotated content. |
| `responsive` | `boolean` | `false` | Collapse to a compact grid on mobile viewports (<420px). |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { DiamondGrid, DiamondItem } from '@exhuma/core';

export function DiamondShowcase({ images }: { images: string[] }) {
  return (
    <DiamondGrid layout="medium" gap={20}>
      {images.map((img, idx) => (
        <DiamondItem key={idx} className="w-48 h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <img src={img} alt="Showcase tile" className="w-full h-full object-cover" />
        </DiamondItem>
      ))}
    </DiamondGrid>
  );
}
```

---

## 7. `<MacyMasonry>`

Legacy height-balanced masonry layout integrating the Macy algorithm with React lifecycle management for zero visual flicker.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number` | `3` | Number of columns for Macy height balancing. |
| `margin` | `number` | `20` | Margin between items in px. |
| `breakAt` | `Record<number, number>` | `undefined` | Breakpoints map (e.g. `{ 1024: 3, 768: 2, 480: 1 }`). |
| `className` | `string` | `''` | Container class name. |
