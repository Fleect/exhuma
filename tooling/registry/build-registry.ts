import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { format } from 'prettier';
import { ALL_COMPONENTS, CATEGORIES } from '../../packages/registry/src/index';
import { EcosystemFlavorSchema, type ComponentFilePayload, type EcosystemFlavor } from '../../packages/registry/src/schema';

const FLAVORS: EcosystemFlavor[] = EcosystemFlavorSchema.options;

async function formatRegistryJson(value: unknown): Promise<string> {
	return format(JSON.stringify(value), { parser: 'json', printWidth: 220, tabWidth: 4, useTabs: true });
}

export async function buildRegistry(rootDir: string = process.cwd()): Promise<void> {
	console.log('Compiling Exhuma Universal Registry...');

	const showcasePublicDir = resolve(rootDir, 'apps/showcase/public/registry');
	const cliRegistryDir = resolve(rootDir, 'packages/cli/src/registry');

	for (const dir of [showcasePublicDir, cliRegistryDir]) {
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}
	}

	// 1. Index Manifest
	const indexManifest = {
		$schema: 'https://exhuma-ui.com/schema/registry-index.json',
		version: '1.0.0',
		generatedAt: new Date().toISOString(),
		categories: CATEGORIES,
		components: ALL_COMPONENTS.map((comp) => ({
			name: comp.name,
			slug: comp.slug,
			category: comp.category,
			description: comp.description,
			version: comp.version,
			props: comp.props,
			dependencies: comp.dependencies,
			flavors: FLAVORS,
		})),
	};

	writeFileSync(resolve(showcasePublicDir, 'index.json'), await formatRegistryJson(indexManifest), 'utf8');

	// 2. Canonical Full Dictionary
	const canonicalDictionary: Record<string, Record<EcosystemFlavor, ComponentFilePayload[]>> = {};

	for (const comp of ALL_COMPONENTS) {
		canonicalDictionary[comp.slug] = {} as Record<EcosystemFlavor, ComponentFilePayload[]>;
		canonicalDictionary[`${comp.slug}:ejected`] = {} as Record<EcosystemFlavor, ComponentFilePayload[]>;

		const componentPayload = {
			name: comp.name,
			slug: comp.slug,
			category: comp.category,
			description: comp.description,
			version: comp.version,
			props: comp.props,
			dependencies: comp.dependencies,
			flavors: {} as Record<EcosystemFlavor, ComponentFilePayload[]>,
			ejected: {} as Record<EcosystemFlavor, ComponentFilePayload[]>,
		};

		for (const flavor of FLAVORS) {
			const files = comp.generateCode(flavor, comp.defaultProps);
			const ejectedFiles = comp.generateCode(flavor, comp.defaultProps, { eject: true });
			componentPayload.flavors[flavor] = files;
			componentPayload.ejected[flavor] = ejectedFiles;
			canonicalDictionary[comp.slug][flavor] = files;
			canonicalDictionary[`${comp.slug}:ejected`][flavor] = ejectedFiles;
		}

		// Write individual public registry endpoint for Vercel
		writeFileSync(resolve(showcasePublicDir, `${comp.slug}.json`), await formatRegistryJson(componentPayload), 'utf8');
	}

	// Write embedded canonical registry for CLI
	writeFileSync(resolve(cliRegistryDir, 'canonical.json'), await formatRegistryJson(canonicalDictionary), 'utf8');

	console.log(`Successfully compiled registry:`);
	console.log(`  - Vercel Static CDN: apps/showcase/public/registry/ (${ALL_COMPONENTS.length} components)`);
	console.log(`  - CLI Embedded: packages/cli/src/registry/canonical.json`);
}

await buildRegistry();
