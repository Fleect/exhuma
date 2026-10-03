# @fleect/exhuma

The unified flagship package of the **Exhuma** developer suite. Gives you complete access to all cards, layout engines, and routing frameworks with tree-shaking and subpath exports.

---

## Installation

```bash
pnpm add @fleect/exhuma
# or
npm install @fleect/exhuma
```

---

## Usage

### Direct Import

```tsx
import { HorizontalScroller, StackingCards, CssMasonry, AutoGrid, LandingLayout } from '@fleect/exhuma';
```

### Subpath Imports

```tsx
import { StackingCards } from '@fleect/exhuma/cards';
import { CssMasonry, AutoGrid } from '@fleect/exhuma/layouts';
import { LandingLayout, DashboardLayout } from '@fleect/exhuma/router';
```

---

## License

MIT © [Fleect](https://fleect.com) — A Fleect Artifact.
