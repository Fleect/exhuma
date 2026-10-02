# Changelog

All notable changes to the **Exhuma** developer monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0-beta.1] - 2026-10-02

### Changed

- **Namespace Migration**: Migrated all packages to the `@fleect/*` namespace on npm:
  - `@fleect/exhuma` (Unified Flagship Engine, re-exporting cards, layouts, router, and core primitives)
  - `@fleect/exhuma-cards` (Standalone tactile card components)
  - `@fleect/exhuma-layouts` (Standalone responsive layout engines)
  - `@fleect/exhuma-router` (Layout framing and route guards)
  - `@fleect/exhuma-registry` (Canonical multi-framework component registry)
  - `exhuma` (Universal Component CLI)
  - `create-exhuma` (Interactive Starter Wizard)

---

## [0.1.0] - 2026-09-12

### Added

- **Monorepo Genesis**: Consolidated `interactive-cards`, `rr6-boilerplate`, and `react-toolkit` into the unified **Exhuma** architecture.
- **`@fleect/exhuma-cards`**:
  - `StackingCards`: React component with sticky thresholding, 3D scale decay, and layered z-index management.
  - `HorizontalScroller`: Converts vertical scroll into smooth horizontal rail translation with ResizeObserver support.
- **`@fleect/exhuma-layouts`**:
  - `CssMasonry`: Zero-dependency CSS column-count masonry layout.
  - `MacyMasonry`: Balanced column layout with dynamic breakpoint recalculation.
  - `AutoGrid`: Declarative CSS grid auto-fit / auto-fill wrapper.
  - `useMacy`: React hook for programmatic grid recalculation.
- **`@fleect/exhuma-router`**:
  - `LandingLayout`: Marketing header, content canvas, and footer wrapper.
  - `AuthLayout`: Centered and split-screen hero layout frames.
  - `DashboardLayout`: Collapsible sidebar slot, header rail, breadcrumb navigation, and viewport.
  - `ProtectedRoute`: Type-safe route guard wrapper.
- **`@fleect/exhuma`**: Unified flagship package with barrel and subpath exports (`/cards`, `/layouts`, `/router`).
- **`apps/showcase`**: Next.js App Router interactive documentation hub and live component testing playground.
- **Standards & Tooling**: Configured `.formatter/`, flat ESLint, strict TypeScript, Turborepo pipeline, and documentation hub (`docs/`).
