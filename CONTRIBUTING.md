# Contributing to Exhuma

Thank you for your interest in contributing to **Exhuma** — the Universal Component Platform & Registry!

We maintain uncompromising quality standards to ensure our open-source codebase remains robust, accessible, and respected across the global developer community.

## Development Setup

1. Clone repository:
   ```bash
   git clone git@github.com:SapanMozammel/exhuma.git
   cd exhuma
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run quality verification:
   ```bash
   pnpm check:all
   ```

## Adding a New Universal Component

1. Run the component scaffolder:
   ```bash
   pnpm run scaffold:component <component-name>
   ```
2. Implement the component across all 8 ecosystems in `apps/showcase/src/registry/components/`:
   - React (`.tsx`)
   - Next.js 15 App Router (`.tsx`)
   - Vue 3 (`.vue`)
   - Astro (`.astro`)
   - Laravel Blade (`.blade.php`)
   - Pure Vanilla JS & Scoped CSS (`.js` + `.css`)
   - WordPress Gutenberg (Block API v3) + Theme PHP
   - Universal Web Component (`<exhuma-*>`)
3. Register the component in `apps/showcase/src/registry/index.ts`.
4. Run `pnpm test` to verify that all code snippets compile cleanly without syntax errors.

## Quality Gates Checklist Before Submitting a PR

- [ ] `pnpm tooling:check` passes without errors.
- [ ] `pnpm arch:check` passes with zero boundary violations.
- [ ] `pnpm typecheck` passes with zero TypeScript errors.
- [ ] `pnpm test` passes all snippet compiler tests.
- [ ] `pnpm build` succeeds.
