import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pc from 'picocolors';
import ora from 'ora';
import canonicalRegistry from '../registry/canonical.json';
import { CANONICAL_COMPONENTS, SUPPORTED_ECOSYSTEMS, EcosystemFlavor } from '../constants';

export interface BuildCommandOptions {
	output?: string;
	check?: boolean;
}

export function buildCommand(options: BuildCommandOptions): void {
	console.log(pc.bold(pc.cyan('\n  ▲ Exhuma CLI — Registry Compiler\n')));

	const spinner = ora('Compiling universal component registry...').start();
	const outputDir = resolve(process.cwd(), options.output || 'public/registry');

	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	// 1. Generate index.json
	const indexManifest = {
		$schema: 'https://exhuma.dev/schema/registry-index.json',
		version: '1.0.0',
		generatedAt: new Date().toISOString(),
		components: CANONICAL_COMPONENTS.map((c) => ({
			...c,
			flavors: SUPPORTED_ECOSYSTEMS,
		})),
	};

	writeFileSync(resolve(outputDir, 'index.json'), `${JSON.stringify(indexManifest, null, 2)}\n`, 'utf8');

	// 2. Generate each component payload
	const registry = canonicalRegistry as Record<string, Record<EcosystemFlavor, any[]>>;
	let count = 0;

	for (const comp of CANONICAL_COMPONENTS) {
		const compFlavors = registry[comp.slug];
		if (!compFlavors) continue;

		const payload = {
			...comp,
			version: '1.0.0',
			flavors: compFlavors,
		};

		writeFileSync(resolve(outputDir, `${comp.slug}.json`), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
		count++;
	}

	spinner.succeed(pc.green(`Compiled ${pc.bold(count)} components to ${pc.dim(options.output || 'public/registry')}`));

	console.log(pc.dim('\n  Output files:'));
	console.log(`  - ${pc.cyan(`${options.output || 'public/registry'}/index.json`)}`);
	for (const comp of CANONICAL_COMPONENTS) {
		console.log(`  - ${pc.dim(`${options.output || 'public/registry'}/${comp.slug}.json`)}`);
	}
	console.log();
}
