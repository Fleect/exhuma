import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': fromRoot('./apps/showcase/src'),
      '@exhuma/cards': fromRoot('./packages/cards/src/index.ts'),
      '@exhuma/layouts': fromRoot('./packages/layouts/src/index.ts'),
      '@exhuma/router': fromRoot('./packages/router/src/index.ts'),
      '@exhuma/core': fromRoot('./packages/core/src/index.ts'),
      '@exhuma/registry': fromRoot('./packages/registry/src/index.ts'),
    },
  },
  test: {
    include: [
      'packages/**/src/**/*.test.ts',
      'apps/**/*.test.{ts,tsx}',
      'tooling/**/*.test.ts',
      'tests/**/*.test.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
    ],
    environment: 'node',
  },
});
