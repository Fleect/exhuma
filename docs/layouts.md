# Layout Engines Deep Dive (@exhuma/layouts)

`@exhuma/layouts` provides high-performance masonry and responsive auto-grid primitives.

---

## `<CssMasonry>`

Zero-dependency CSS column-count masonry layout. Automatically handles `break-inside: avoid` so cards never tear across columns.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `3` | Number of columns or responsive column map. |
| `gap` | `string \| number` | `'1.5rem'` | Column and row gap. |

---

## `<RowMasonry>`

High-performance $\mathcal{O}(N \log K)$ greedy row-by-row masonry balancer placing items into the shortest column using hardware-accelerated GPU `transform: translate3d(x, y, 0)` positioning. Features automatic media load capture listeners and single-frame coalesced rAF layout batching.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `1` | Mobile column count (<640px) or responsive breakpoint map. |
| `columnsSm` | `number` | `2` | Small tablet column count (≥640px). |
| `columnsMd` | `number` | `2` | Medium tablet column count (≥768px). |
| `columnsLg` | `number` | `3` | Desktop column count (≥1024px). |
| `columnsXl` | `number` | `4` | Ultra-wide column count (≥1280px). |
| `gap` | `string \| number` | `16` | Spacing between masonry columns and tiles. |
| `children` | `ReactNode` | — | Masonry tiles wrapped in `<RowMasonryItem>` or raw elements. |

---

## `<AutoGrid>`

Smart CSS grid wrapper utilizing `repeat(auto-fit, minmax(minItemWidth, 1fr))`.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `minItemWidth` | `number \| string` | `280` | Minimum column width before wrapping to the next line. |
| `gap` | `string \| number` | `'1.5rem'` | CSS gap token between cells. |

---

## `<MacyMasonry>`

Balanced masonry layout that distributes children across columns using balanced height calculations with zero visual flicker.
