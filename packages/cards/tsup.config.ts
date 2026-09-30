import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
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
