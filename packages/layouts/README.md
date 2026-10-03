# @fleect/exhuma-layouts

High-performance, zero-dependency layout primitives for React: Masonry layouts, AutoGrids, and dynamic height balancers. Part of the **Exhuma** developer suite.

---

## Installation

```bash
pnpm add @fleect/exhuma-layouts
# or
npm install @fleect/exhuma-layouts
```

---

## Features

- **`CssMasonry`**: Zero-dependency CSS column-count masonry layout with automatic `break-inside: avoid` handling.
- **`RowMasonry`**: Greedy column balancer with GPU `translate3d` positioning and zero layout thrashing.
- **`AutoGrid`**: Intelligent CSS grid container with auto-fit/auto-fill and minimum column widths.
- **`BentoGrid`**: Adaptive kinetic bento grid with spring displacement.
- **`InfiniteMarquee`**: Smooth continuous kinetic scroller.

---

## Quick Usage

### Zero-Dependency CSS Masonry

```tsx
import { CssMasonry } from '@fleect/exhuma-layouts';

export default function Gallery() {
  return (
    <CssMasonry columns={{ sm: 1, md: 2, lg: 3 }} gap='1.5rem'>
      <div className='h-64 rounded-xl bg-zinc-800 p-4'>Short card</div>
      <div className='h-96 rounded-xl bg-zinc-800 p-4'>Tall card</div>
      <div className='h-48 rounded-xl bg-zinc-800 p-4'>Mini card</div>
    </CssMasonry>
  );
}
```

### AutoGrid

```tsx
import { AutoGrid } from '@fleect/exhuma-layouts';

export default function Products() {
  return (
    <AutoGrid minItemWidth={280} gap='1.5rem'>
      {items.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </AutoGrid>
  );
}
```

---

## License

MIT © [Fleect](https://fleect.com) — A Fleect Artifact.
