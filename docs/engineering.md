# Exhuma Engineering Contract

Exhuma enforces strict engineering standards to ensure all code is production-grade and peer-review ready.

## Core Rules & Invariants
- **Strict TypeScript**: `strict: true` across all packages. No explicit `any`, no untyped casts, and no disabled lints to mask bugs.
- **Zero Broken Snippets**: Every generated code snippet in `apps/showcase/src/registry/` must be 100% copy-paste runnable and must pass automated compiler testing via `tests/snippets/snippet-compiler.test.ts`.
- **Ecosystem Parity**: Canonical components must provide 13 production implementations:
  1. React (`.tsx`)
  2. Next.js 15 App Router (`.tsx`)
  3. Vue 3 / Nuxt (`.vue` with `<script setup lang="ts">`)
  4. Svelte 5 / SvelteKit (`.svelte` with Runes)
  5. Angular 18+ (`.ts` Standalone with Signals)
  6. SolidJS (`.tsx` with createSignal)
  7. Astro (`.astro` with zero-JS default)
  8. Laravel Blade (`.blade.php` component with `@props`)
  9. Pure Vanilla JS & Scoped CSS (`.js` + `.css`)
  10. WordPress Gutenberg Block (Block API v3) + Theme PHP
  11. Universal Web Component (`<exhuma-*>`)
  12. React Native / Expo (`.tsx` with NativeWind)
  13. Flutter (`.dart` with Canvas/Widget tree)
- **Memory Safety**: No uncleaned DOM listeners or detached observers. Every component must release memory on unmount or destruction.
- **Security & Isolation**: Vanilla CSS styles must never leak outside their container. No external CDN script dependencies required for core functionality.

## Branching & Release Strategy
- **`main`**: Production release branch only. Protected. Direct commits prohibited.
- **`dev`**: Active integration branch. All feature and fix branches (`feat/*`, `fix/*`) branch off `dev` and merge back into `dev`.
- **Releases**: Scheduled or milestone Pull Requests from `dev` into `main`.
- **Review Protocol**: Every task completion must report:
  1. **Review**: Comprehensive audit of touched files, dependencies, and architectural bounds.
  2. **Issue**: Any blockers, edge cases, or compiler errors encountered and their exact resolutions.
  3. **Achievement**: Quantifiable test metrics, performance impact, and capabilities delivered.

## Verification Workflow
Before concluding turns or submitting PRs:
```bash
# 1. Verify Auterix context integrity
pnpm tooling:check

# 2. Verify monorepo architecture and config
pnpm arch:check
pnpm config:check

# 3. Verify documentation links
pnpm docs:check

# 4. Verify TypeScript strict compilation
pnpm typecheck

# 5. Verify snippet compilation and unit tests
pnpm test
```
