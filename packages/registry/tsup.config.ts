import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/schema.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: false,
	sourcemap: true,
	treeshake: true,
	outExtension({ format }) {
		return { js: format === 'cjs' ? '.cjs' : '.mjs' };
	},
});
