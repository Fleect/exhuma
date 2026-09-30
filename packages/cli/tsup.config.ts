import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	clean: false,
	sourcemap: false,
	banner: {
		js: '#!/usr/bin/env node',
	},
	outExtension() {
		return { js: '.js' };
	},
});
