# Exhuma Package Consumption Guide

Guide to consuming Exhuma packages across applications and frameworks.

---

## Consumption Approaches

### 1. All-in-One (`@exhuma/core`)

Recommended for rapid development and applications that use multiple tools across interactions, layout, and routing.

```bash
pnpm add @exhuma/core
```

```tsx
// Root barrel import (with tree-shaking)
import { StackingCards, CssMasonry, LandingLayout } from '@exhuma/core';

// Or explicit subpath imports
import { StackingCards, HorizontalScroller } from '@exhuma/core/cards';
import { CssMasonry, AutoGrid } from '@exhuma/core/layouts';
import { LandingLayout, DashboardLayout } from '@exhuma/core/router';
```

---

### 2. Standalone Targeted Packages

Recommended for micro-frontends or repositories with strict bundle boundaries:

```bash
# Only interactive card micro-interactions
pnpm add @exhuma/cards

# Only masonry and grid layouts
pnpm add @exhuma/layouts

# Only router skeletons and guards
pnpm add @exhuma/router
```

---

## Framework Compatibility

| Framework                   | Support Status | Notes                                                               |
| :-------------------------- | :------------: | :------------------------------------------------------------------ |
| **Next.js (App Router)**    |      Full      | All interactive components include `'use client'` banner; SSR safe. |
| **Next.js (Pages Router)**  |      Full      | Fully compatible.                                                   |
| **Vite / React**            |      Full      | Dual ESM and CJS bundle output with `.d.ts` declaration maps.       |
| **Remix / React Router v7** |      Full      | Fully compatible.                                                   |
