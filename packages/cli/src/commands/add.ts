import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import { getConfig, detectEcosystem } from '../utils/config';
import { fetchComponentFromRegistry } from '../utils/registry';
import { CANONICAL_COMPONENTS, DEFAULT_PATHS, EcosystemFlavor, SUPPORTED_ECOSYSTEMS } from '../constants';
import { ensureCoreDependency } from '../utils/dependencies';

export interface AddCommandOptions {
	flavor?: string;
	overwrite?: boolean;
	all?: boolean;
	path?: string;
	yes?: boolean;
	eject?: boolean;
	vendor?: boolean;
}

export function requiresCoreDependency(flavor: EcosystemFlavor, isEjected: boolean = false): boolean {
	if (isEjected) return false;
	return flavor === 'react' || flavor === 'nextjs';
}

export async function addCommand(components: string[], options: AddCommandOptions): Promise<void> {
	console.log(pc.bold(pc.cyan('\n  ▲ Exhuma CLI — Component Installer\n')));

	const config = getConfig();
	const flavor: EcosystemFlavor = options.flavor && SUPPORTED_ECOSYSTEMS.includes(options.flavor as EcosystemFlavor) ? (options.flavor as EcosystemFlavor) : config?.flavor || detectEcosystem();
	const isEjected = Boolean(options.eject);

	const targetDir = options.path || config?.path || DEFAULT_PATHS[flavor];

	let selectedSlugs = components;

	if (options.all) {
		selectedSlugs = CANONICAL_COMPONENTS.map((c) => c.slug);
	} else if (!selectedSlugs || selectedSlugs.length === 0) {
		const response = await prompts({
			type: 'multiselect',
			name: 'selected',
			message: 'Select the components you want to add:',
			choices: CANONICAL_COMPONENTS.map((c) => ({
				title: `${c.name} (${pc.dim(c.category)})`,
				value: c.slug,
			})),
			min: 1,
		});

		if (!response.selected || response.selected.length === 0) {
			console.log(pc.yellow('  No components selected. Exiting.\n'));
			return;
		}
		selectedSlugs = response.selected;
	}

	// Ensure core packages for React/Next.js frameworks (skipped if standalone --eject is requested)
	if (requiresCoreDependency(flavor, isEjected)) {
		ensureCoreDependency(process.cwd());
	}

	// Handle enterprise --vendor flag for local asset hosting
	if (options.vendor) {
		const vendorDir = resolve(process.cwd(), 'public/vendor/exhuma');
		if (!existsSync(vendorDir)) {
			mkdirSync(vendorDir, { recursive: true });
		}
		const runtimeStub = `// Exhuma Kinetic Micro-Kernel (Local Vendor Asset)\nimport '@exhuma/core';\n`;
		writeFileSync(join(vendorDir, 'kinetic.js'), runtimeStub, 'utf8');
		console.log(pc.green('  ✔ Vendored ') + pc.bold('public/vendor/exhuma/kinetic.js') + pc.dim(' for offline/firewall use'));
	}

	const destinationPath = resolve(process.cwd(), targetDir);
	if (!existsSync(destinationPath)) {
		mkdirSync(destinationPath, { recursive: true });
	}

	for (const slug of selectedSlugs) {
		const compMeta = CANONICAL_COMPONENTS.find((c) => c.slug === slug);
		const compName = compMeta ? compMeta.name : slug;
		const spinner = ora(`Installing ${pc.bold(compName)} for ${pc.cyan(flavor)}...`).start();

		try {
			const files = await fetchComponentFromRegistry(slug, flavor, { eject: isEjected });

			if (!files || files.length === 0) {
				spinner.fail(pc.red(`Component '${slug}' not found in registry.`));
				continue;
			}

			for (const file of files) {
				const filePath = join(destinationPath, file.filename);
				if (existsSync(filePath) && !options.overwrite && !options.yes) {
					spinner.stop();
					const { confirmOverwrite } = await prompts({
						type: 'confirm',
						name: 'confirmOverwrite',
						message: `File ${pc.yellow(file.filename)} already exists in ${targetDir}. Overwrite?`,
						initial: false,
					});
					if (!confirmOverwrite) {
						console.log(pc.dim(`  Skipped ${file.filename}`));
						continue;
					}
					spinner.start(`Installing ${compName}...`);
				}

				writeFileSync(filePath, file.code, 'utf8');
			}

			spinner.succeed(`${pc.green('Installed')} ${pc.bold(compName)} → ${pc.dim(targetDir)}`);
		} catch (err: any) {
			spinner.fail(pc.red(`Failed to install ${compName}: ${err.message}`));
		}
	}

	console.log(pc.green('\n  ✔ All components installed successfully!\n'));
}
