# Exhuma Documentation Hub

Welcome to the central documentation for **Exhuma**, a modern developer monorepo for tactile interactions, layout engines, and routing architecture.

---

## Guides

- [Quickstart Guide](quickstart.md) — Get up and running with `@exhuma/core` in under 60 seconds.
- [Cards Deep Dive](cards.md) — Complete guide to `StackingCards` and `HorizontalScroller`.
- [Layout Engines](layouts.md) — Understanding `CssMasonry`, `MacyMasonry`, and `AutoGrid`.
- [Router Framework](router.md) — Utilizing `LandingLayout`, `AuthLayout`, and `DashboardLayout`.
- [Future Components](future-components.md) — Post-beta roadmap and architecture for deferred kinetic primitives.

---

## Architecture Overview

```
exhuma/
├── packages/
│   ├── cards/    # @exhuma/cards
│   ├── layouts/  # @exhuma/layouts
│   ├── router/   # @exhuma/router
│   └── core/     # @exhuma/core
└── apps/
    └── showcase/ # Next.js interactive demo site
```
