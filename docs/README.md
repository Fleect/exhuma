# Exhuma Documentation Hub

Welcome to the central documentation for **Exhuma**, a modern Universal Component Platform and developer monorepo for tactile interactions, layout engines, and cross-framework component distribution.

---

## 📚 Repository Guides

- [Architecture & Universal Component Model](architecture.md) — Universal Component Model (UCM), headless math separation, and multi-ecosystem design.
- [Engineering Principles & Performance](engineering.md) — $\Omega(1)$ layout thrashing guarantees, compositor acceleration, and memory safety rules.
- [Component Specification](component-spec.md) — Standard schema for component metadata, props, dependencies, and lifecycle contracts.
- [Quickstart Guide](quickstart.md) — Get up and running with `@exhuma/core` in under 60 seconds.
- [Cards Deep Dive](cards.md) — Complete guide to the tactile cards collection (`StackingCards`, `TiltCard`, `SpotlightCard`, `BorderBeam`, `CardSwipeStack`, `ComparisonSlider`, `ExpandableCard`, `HorizontalScroller`).
- [Layout Engines](layouts.md) — Understanding `CssMasonry`, `RowMasonry`, and `AutoGrid`.
- [Routing Framework](router.md) — Utilizing `LandingLayout`, `AuthLayout`, and `DashboardLayout`.
- [Future Components Roadmap](future-components.md) — Master component wishlist and Beta expansion candidates.
- [Provenance & Lineage](provenance.md) — Architectural lineage, governance, and licensing.

---

## 🌐 Interactive Web Documentation

For the full interactive documentation experience with live playgrounds and code generators, visit the Exhuma Showcase application:

- **[Installation & Quickstart](https://exhuma-ui.com/docs/installation)** — Step-by-step setup guides for all package managers.
- **[CLI Reference Manual](https://exhuma-ui.com/docs/cli)** — Complete documentation for `exhuma init`, `add`, `list`, and `build`.
- **[Component Catalog](https://exhuma-ui.com/docs/components)** — Live interactive catalog of all 20 kinetic primitives across 13 frontend ecosystems.
- **[Supported Ecosystems](https://exhuma-ui.com/docs/ecosystems)** — In-depth implementation guides for all 13 frontend ecosystems.
- **[Engineering Methodology](https://exhuma-ui.com/docs/methodology)** — Compositor pipeline, zero layout thrashing, and mathematical modeling.
- **[Lifecycle & Safety](https://exhuma-ui.com/docs/lifecycle)** — Deterministic teardowns, zero-leak event handling, and memory guarantees.
- **[Theming & Tokens](https://exhuma-ui.com/docs/theming)** — CSS custom properties, Tailwind CSS v4 `@theme`, and zero-flash dark mode.

---

## 🏗️ Monorepo Topology

```
exhuma/
├── packages/
│   ├── core/           # @exhuma/core — Unified flagship package (cards, layouts, router)
│   ├── cards/          # @exhuma/cards — Standalone cards package
│   ├── layouts/        # @exhuma/layouts — Standalone layout engines (Masonry, Diamond, AutoGrid)
│   ├── router/         # @exhuma/router — Layout framing and route guards
│   ├── registry/       # @exhuma/registry — Canonical component registry schema and compiler
│   ├── cli/            # exhuma — Universal Component CLI (init, add, list)
│   └── create-exhuma/  # create-exhuma — Interactive project starter wizard
├── apps/
│   └── showcase/       # Next.js 15 interactive documentation and component studio
├── docs/               # Architecture specifications and technical guides
└── tooling/            # Architecture guards, registry build scripts, and scaffolders
```
