# Exhuma Architecture Specification

Exhuma is an open-source Universal Component Platform and Registry designed to eliminate frontend fragmentation. It bridges React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Laravel Blade, Vanilla JS,
WordPress Gutenberg, Universal Web Components, React Native / Expo, and Flutter (Dart) under a unified headless engineering model.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    Universal Component Model (UCM)                      │
│            Pure Headless Math, State, & Behavioral Engine               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
┌─────────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│ Modern Web Frameworks       │ │ Full-Stack & CMS Runtimes │ │ Native & Mobile Platforms │
├─────────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤
│ - React 18/19 (.tsx)        │ │ - Laravel Blade           │ │ - React Native (iOS/Andr) │
│ - Next.js 15 App Router     │ │ - WordPress Gutenberg v3  │ │ - Flutter (Dart)          │
│ - Vue.js 3 / Nuxt (.vue)    │ │ - Classic WordPress PHP   │ │ - Universal Web Component │
│ - Svelte 5 Runes (.svelte)  │ │ - Vanilla JS & Scoped CSS │ │                           │
│ - Angular 18+ Signals (.ts) │ │                           │ │                           │
│ - SolidJS (.tsx)            │ │                           │ │                           │
│ - Astro (.astro zero-JS)    │ │                           │ │                           │
└─────────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
```

## Monorepo Topology

- `apps/showcase`: Next.js 15 App Router documentation hub, ComponentViewer, Studio Workbench, and JSON Registry API.
- `packages/core`: Headless mathematical engines, shared utilities, and pre-bundled core primitives (`@fleect/exhuma`).
- `packages/cards`: Pre-bundled standalone React cards package (`@fleect/exhuma-cards`).
- `packages/layouts`: Pre-bundled standalone React layouts package (`@fleect/exhuma-layouts`).
- `packages/router`: Pre-bundled layout frameworks and route guards (`@fleect/exhuma-router`).
- `packages/registry`: Canonical multi-flavor registry compiler and schema specifications (`@fleect/exhuma-registry`).
- `packages/cli`: Universal Component CLI for project bootstrapping and component injection (`exhuma`).
- `packages/create-exhuma`: Interactive project starter wizard (`create-exhuma`).
- `tooling/`: Monorepo architecture validation, configuration checks, and registry compiler.
- `tests/`: Automated quality gates, snippet compiler smoke tests, and axe-core accessibility audits.

## Universal Component Model (UCM) Rules

1. **Headless Math Separation**: Mathematical calculations (card scaling decay, parallax scroll offsets, tilt matrix trigonometry) must exist in pure, runtime-agnostic functions that never touch DOM elements directly.
2. **Zero Memory Leakage**: In every Vanilla JS and Web Component implementation, all event listeners (`scroll`, `resize`, `mousemove`), `ResizeObserver`, and `IntersectionObserver` instances must be strictly tracked and
   torn down via an explicit `destroy()` method.
3. **Scoped CSS Layers**: All Vanilla and Web Component CSS styles must be scoped under CSS Cascade Layers (`@layer exhuma`) and prefixed custom properties (`--exhuma-*`) to guarantee zero specificity conflicts with host
   applications or WordPress themes.
4. **Accessible Semantics**: Every component must follow WCAG 2.2 AA standards with keyboard navigation, ARIA landmarks, focus rings, and `prefers-reduced-motion` CSS overrides.
