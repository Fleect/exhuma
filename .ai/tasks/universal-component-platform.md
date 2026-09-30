# Universal Component Platform & Registry

Task schema: 1
Status: in_progress
Owner: Sapan Mozammel
Risk: medium
Workflow: .ai/core/workflows/implementation.md
Dependencies: none
Owned files: apps/, packages/, docs/, tooling/, tests/, .ai/, .agents/, .cursor/, .github/, .husky/, package.json, tsconfig.json

## Objective

Build Exhuma as an elite, production-grade universal component library and registry platform supporting 8 ecosystems (React, Next.js 15, Vue 3, Astro, Laravel Blade, Vanilla JS, WordPress Gutenberg API v3 + PHP,
Universal Web Components), featuring an interactive Studio Workbench and shadcn-compatible CLI registry API.

## Scope

Establish Auterix WI workflow context and Auterix Pro guardrails; configure root monorepo tooling and quality gate checkers following aufnehmen and sapan.dev; implement the Universal Component Model (UCM) registry with 5
canonical components; build the multi-flavor ComponentViewer, DocsSidebar, and /studio workbench; verify all code snippets compile cleanly.

## Acceptance

- Auterix context validator (node .ai/tools/check.mjs) passes without errors or warnings.
- Architecture, configuration, and link checkers pass.
- Monorepo TypeScript type checking passes across node and web workspaces (pnpm typecheck).
- Component registry provides 8 distinct, zero-leak implementations for all canonical components.
- Studio Workbench provides responsive viewports (375px, 768px, 100%), visual prop sliders, and live 8-flavor code synthesis.
- Snippet compiler CI test passes with zero compilation errors.
- Next.js production build (pnpm build) succeeds.

## Evidence

Foundation setup initialized. Auterix core workflows, adapters, pre-commit guardrail hook, and CI verification action installed. Task actively tracked under Auterix WI protocol.

2026-09-20 horizontal-scroller / stacking-cards implementation:

- Completed Horizontal Scroller package behavior, workbench controls, pinned-camera showcase, mobile scroll/stack fallbacks, progress/fade options, and pure geometry exports/tests.
- Added native source generation for Horizontal Scroller and kinetic Stacking Cards across all 13 supported ecosystems, including rAF coalescing, IntersectionObserver culling, compositor transforms, and deterministic
  cleanup in component-owned browser runtimes.
- Repaired Angular, Astro, Vanilla, Web Component, React Native, and Flutter quick starts; isolated `@exhuma/core` installation to React and Next.js.
- Made `build:registry` compile from canonical TypeScript source rather than stale package output, format its JSON deterministically, and regenerated showcase/CLI artifacts.
- Added 13-ecosystem filename/export, lifecycle, quick-start, dependency-isolation, numeric-card-width, and artifact-synchronization coverage.
- Verification passed: `pnpm config:check`, `pnpm arch:check`, `pnpm docs:check`, `pnpm typecheck`, `pnpm test` (391 tests), `pnpm format:check`, `pnpm lint` (0 errors; 38 existing `no-console` warnings),
  `pnpm run build:libs`, and `pnpm --filter showcase build` (success; existing `src/app/error.tsx` console warning).
- `pnpm check:all` remains blocked at its first step by pre-existing managed-file drift in `CLAUDE.md`; no managed workflow file was changed. Manual browser interaction across every generated ecosystem remains deferred
  because those external runtimes are not available in this workspace session.

## Handoff

Horizontal Scroller and Stacking Cards plan is implemented and source/registry synchronization is covered by tests. Next owner action: resolve the managed `CLAUDE.md` checksum drift, rerun `pnpm check:all`, then perform
the documented manual interaction pass in representative browser/framework hosts before release. Preserve the generated-registry source import in `tooling/registry/build-registry.ts`; reverting to the package export can
silently rebuild stale artifacts when `dist` is older than source.
