# Quickstart Guide

Get started with **Exhuma** in your React or Next.js project in under 60 seconds.

---

## 1. Installation

You can install the unified `@exhuma/core` package:

```bash
# Using pnpm
pnpm add @exhuma/core

# Using npm
npm install @exhuma/core

# Using yarn
yarn add @exhuma/core
```

Or copy-paste 100% owned source code directly into your repository with the Exhuma CLI:

```bash
# Add components directly to your codebase
npx exhuma add stacking-cards
npx exhuma add row-masonry
```

---

## 2. Using Stacking Cards

Import `StackingCards` from `@exhuma/core` and pass any set of card elements as children:

```tsx
import { StackingCards } from '@exhuma/core';

export default function ExperienceSection() {
  return (
    <div className="py-24 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-12">Projects</h2>
      <StackingCards topStart={90} topIncrement={20} minScale={0.9}>
        <div className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white">Project Alpha</h3>
          <p className="text-sm text-zinc-400 mt-2">Scalable monorepo tooling.</p>
        </div>
        <div className="h-72 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white">Project Beta</h3>
          <p className="text-sm text-zinc-400 mt-2">Zero-dependency masonry layout.</p>
        </div>
      </StackingCards>
    </div>
  );
}
```

---

## 3. Using Greedy Row Masonry

`<RowMasonry>` calculates dynamic greedy shortest-column placement in $\mathcal{O}(N \log K)$, ensuring chronological reading order across rows with single-frame coalesced `requestAnimationFrame` batching:

```tsx
import { RowMasonry, RowMasonryItem } from '@exhuma/core';

export default function DynamicFeed({ items }: { items: { id: string; height: number; title: string }[] }) {
  return (
    <RowMasonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={16}>
      {items.map((item) => (
        <RowMasonryItem key={item.id}>
          <div
            style={{ height: item.height }}
            className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl"
          >
            <h4 className="text-lg font-bold text-white">{item.title}</h4>
          </div>
        </RowMasonryItem>
      ))}
    </RowMasonry>
  );
}
```

---

## 4. Using CSS Masonry

For lightweight, zero-JavaScript column-count masonry:

```tsx
import { CssMasonry } from '@exhuma/core';

export default function SimpleMasonry({ items }: { items: string[] }) {
  return (
    <CssMasonry columns={{ sm: 1, md: 2, lg: 3 }} gap="1.5rem">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          {item}
        </div>
      ))}
    </CssMasonry>
  );
}
```
