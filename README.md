# Exhuma

> **The Universal Kinetic Component Platform & Multi-Framework Registry.** 20 physics-driven primitives, 13 frontend ecosystems, zero layout thrashing, and zero runtime lock-in.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15_App_Router-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/Tests-701%20passing-brightgreen?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Ecosystems](https://img.shields.io/badge/Ecosystems-13%20Supported-purple?style=flat-square)](https://exhuma-ui.com/docs/ecosystems)
[![Primitives](https://img.shields.io/badge/Primitives-20%20Production-orange?style=flat-square)](https://exhuma-ui.com/docs/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Exhuma is an open-source, universal UI component platform delivering tactile, physics-based interactions and responsive layout engines. Instead of locking you into a single framework or heavyweight runtime, Exhuma
distributes canonical, zero-dependency source code across **13 frontend ecosystems** via a dedicated CLI.

---

## ✨ Key Architectural Guarantees

- **20 Audited Kinetic Primitives**: From 3D sticky stacking cards and elastic magnetic buttons to shared-element morphing tabs and comparison diff sliders.
- **13 Framework Ecosystems**: Full implementation parity across React, Next.js, Vue 3, Nuxt, Svelte 5, SvelteKit, Angular 18+, SolidJS, Astro, Laravel Blade, Vanilla JS, WordPress Gutenberg, Web Components, React
  Native, and Flutter.
- **$\Omega(1)$ Layout Thrashing Protection**: Pure compositor-driven execution utilizing `transform` and `opacity` GPU layers to ensure sustained 60fps/120fps motion without triggering forced synchronous layouts.
- **Deterministic Lifecycle Teardowns**: Strict, verified event listener detachment, `ResizeObserver` / `IntersectionObserver` disconnections, and zero memory leaks upon unmount.
- **Tailwind CSS v4 & Zero-Flash Theming**: Semantic CSS variables with native dark/light mode support, zero visual flashes, and instant hydration.
- **Zero-Lock-in CLI Distribution**: Own your source code. Copy directly into your codebase with `npx exhuma add <component>`.

---

## 📦 Packages in the Monorepo

| Package                                        | Description                                                                           | Status  |
| :--------------------------------------------- | :------------------------------------------------------------------------------------ | :-----: |
| **`exhuma`** (`packages/cli`)                  | Universal Component CLI — add tactile components to any project across 13 ecosystems. | `Ready` |
| **`create-exhuma`** (`packages/create-exhuma`) | Interactive project scaffolding wizard for quickstart boilerplates.                   | `Ready` |
| **`@fleect/exhuma`**                           | Complete flagship bundle: cards, layouts, and router with subpath exports.            | `Ready` |
| **`@fleect/exhuma-cards`**                     | Interactive card micro-interactions, stacking cards, tilt cards, and sliders.         | `Ready` |
| **`@fleect/exhuma-layouts`**                   | High-performance CSS masonry grids, diamond grids, and auto-grids.                    | `Ready` |
| **`@fleect/exhuma-router`**                    | Production layout framing, landing layouts, auth screens, and route guards.           | `Ready` |
| **`@fleect/exhuma-registry`**                  | Canonical multi-flavor registry compiler and schema specifications.                   | `Ready` |
| **`showcase`** (`apps/showcase`)               | Next.js 15 documentation hub, interactive Component Studio, and live playgrounds.     | `Ready` |

---

## 🚀 Quickstart

### Option A: Use the Universal CLI (Recommended)

Initialize Exhuma in your existing project:

```bash
npx exhuma init
```

Add any of the 20 components directly into your codebase:

```bash
# Add to your current project (auto-detects framework)
npx exhuma add stacking-cards

# Explicitly target a specific ecosystem flavor
npx exhuma add floating-dock --flavor=svelte
npx exhuma add magnetic-button --flavor=vue
npx exhuma add comparison-slider --flavor=flutter

# Add all components
npx exhuma add --all
```

List all available canonical components and categories:

```bash
npx exhuma list
```

### Option B: Scaffold a Fresh Project with `create-exhuma`

```bash
npm create exhuma@latest
# or
pnpm create exhuma
# or
bun create exhuma
```

### Option C: Install Monorepo Packages

```bash
# Install flagship unified package
pnpm add @fleect/exhuma

# Or targeted standalone packages
pnpm add @fleect/exhuma-cards @fleect/exhuma-layouts
```

```tsx
import { StackingCards } from '@fleect/exhuma/cards';
import { CssMasonry } from '@fleect/exhuma/layouts';

export default function Page() {
  return (
    <CssMasonry columns={3} gap='1.5rem'>
      <StackingCards topStart={90} topIncrement={24}>
        <div className='card'>Card 1</div>
        <div className='card'>Card 2</div>
      </StackingCards>
    </CssMasonry>
  );
}
```

---

## 🧩 Complete Component Inventory (19 Primitives)

| Component Slug            | Category     | Description                                                | Supported Flavors |
| :------------------------ | :----------- | :--------------------------------------------------------- | :---------------: |
| **`stacking-cards`**      | Cards        | Sticky stacking cards with mathematical decay scaling      |       13/13       |
| **`card-swipe-stack`**    | Cards        | Tactile swipeable card deck with inertial physics          |       13/13       |
| **`tilt-card`**           | Cards        | 3D gyroscopic pointer-tracking tilt card                   |       13/13       |
| **`expandable-card`**     | Cards        | Shared-layout card expanding into modal view               |       13/13       |
| **`glow-card`**           | Cards        | Radial cursor-following glow border card                   |       13/13       |
| **`spotlight-border`**    | Cards        | Dynamic cursor-tracking border illumination                |       13/13       |
| **`diamond-grid`**        | Layouts      | Isometric 45° angled responsive diamond matrix             |       13/13       |
| **`masonry-grid`**        | Layouts      | High-performance CSS multi-column masonry                  |       13/13       |
| **`auto-grid`**           | Layouts      | Responsive auto-fitting CSS grid container                 |       13/13       |
| **`infinite-marquee`**    | Layouts      | Seamless hardware-accelerated looping marquee              |       13/13       |
| **`horizontal-scroller`** | Layouts      | Scroll-driven pinned horizontal camera translation         |       13/13       |
| **`morphing-tabs`**       | Navigation   | Fluid shared-element indicator tabs                        |       13/13       |
| **`floating-dock`**       | Navigation   | Proximity magnification floating toolbar                   |       13/13       |
| **`cursor-follower`**     | Interactions | Spring-interpolated pointer follower orb                   |       13/13       |
| **`animated-cursor`**     | Interactions | Dual-ring magnetic cursor with velocity scaling            |       13/13       |
| **`magnetic-button`**     | Interactions | Elastic pointer attraction with tactile boundary dampening |       13/13       |
| **`comparison-slider`**   | Media        | Dual-pane visual diff comparison slider                    |       13/13       |
| **`accordion`**           | Disclosures  | Zero-layout-thrashing spring accordion                     |       13/13       |
| **`number-ticker`**       | Data Display | Smooth tabular rolling digit counter                       |       13/13       |

---

## 🌐 Supported Framework Ecosystems

| Ecosystem                   | Extension / Format    | Lifecycle Model                                           |
| :-------------------------- | :-------------------- | :-------------------------------------------------------- |
| **React 18 / 19**           | `.tsx`                | Hooks, `useRef`, `useCallback`, `useId`                   |
| **Next.js 15 (App Router)** | `.tsx`                | `'use client'` isolation, SSR safe                        |
| **Vue.js 3 / Nuxt 3**       | `.vue`                | `<script setup>`, `ref`, `onMounted`, `onBeforeUnmount`   |
| **Svelte 5 / SvelteKit**    | `.svelte`             | Svelte 5 Runes (`$state`, `$effect`)                      |
| **Angular 18+**             | `.ts`                 | Signals, standalone components, `DestroyRef`              |
| **SolidJS**                 | `.tsx`                | Fine-grained reactivity, `createSignal`, `onCleanup`      |
| **Astro**                   | `.astro`              | Zero-JS default with scoped client hydration              |
| **Laravel Blade**           | `.blade.php`          | Native Blade component with Vanilla JS bundle             |
| **Vanilla JavaScript**      | `.js` + `.css`        | ES Modules, strict `destroy()` cleanup, CSS layers        |
| **WordPress Gutenberg**     | `block.json` + `.tsx` | Gutenberg v3 block editor & frontend render               |
| **Web Components**          | Custom Element        | Shadow DOM / Light DOM, `<exhuma-*>`                      |
| **React Native / Expo**     | `.tsx`                | React Native primitives & gestures                        |
| **Flutter**                 | `.dart`               | `StatefulWidget`, `AnimationController`, `TickerProvider` |

---

## 🛠️ Monorepo Development & Quality Gates

This repository is governed by strict automated quality gates powered by **Turborepo**, **pnpm**, and **Vitest**:

```bash
# Clone the repository
git clone https://github.com/Fleect/exhuma.git
cd exhuma

# Install all workspace dependencies
pnpm install

# Build registry, packages, and showcase
pnpm run build

# Run entire test suite (636 tests across 20 suites)
pnpm test

# Run TypeScript typechecks across all packages
pnpm typecheck

# Verify architecture boundaries, configs, and links
pnpm check:all

# Start local interactive documentation showcase
pnpm dev
```

---

## 📖 Documentation & Resources

- [Exhuma Documentation Hub](docs/README.md) — Monorepo engineering guides and specifications.
- [Architecture & Universal Component Model](docs/architecture.md) — Technical deep-dive into UCM design.
- [Engineering Principles & Performance](docs/engineering.md) — Compositor rules and mathematical guarantees.
- [Future Components Roadmap](docs/future-components.md) — Post-beta component roadmap.
- [Interactive Showcase & Studio](https://exhuma-ui.com) — Live interactive documentation.

---

## 📄 License

MIT © [Fleect](https://fleect.com) — A Fleect Artifact.
