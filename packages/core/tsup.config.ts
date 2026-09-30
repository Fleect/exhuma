import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/cards.ts', 'src/layouts.ts', 'src/router.ts', 'src/physics.ts', 'src/gestures.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: false,
	sourcemap: true,
	treeshake: true,
	banner: {
		js: "'use client';",
	},
	outExtension({ format }) {
		return { js: format === 'cjs' ? '.cjs' : '.mjs' };
	},
});
