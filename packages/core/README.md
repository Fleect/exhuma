# @exhuma/core

The unified flagship package of the **Exhuma** developer suite. Gives you complete access to all cards, layout engines, and routing frameworks with tree-shaking and subpath exports.

---

## Installation

```bash
pnpm add @exhuma/core
# or
npm install @exhuma/core
```

---

## Usage

### Direct Import

```tsx
import { HorizontalScroller, StackingCards, CssMasonry, AutoGrid, LandingLayout } from '@exhuma/core';
```

### Subpath Imports

```tsx
import { StackingCards } from '@exhuma/core/cards';
import { CssMasonry, AutoGrid } from '@exhuma/core/layouts';
import { LandingLayout, DashboardLayout } from '@exhuma/core/router';
```
