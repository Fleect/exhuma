import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import { detectEcosystem, writeConfig, getConfig } from '../utils/config';
import { SUPPORTED_ECOSYSTEMS, ECOSYSTEM_LABELS, DEFAULT_PATHS, EcosystemFlavor } from '../constants';

export async function initCommand(options: { yes?: boolean; flavor?: string }): Promise<void> {
	console.log(pc.bold(pc.cyan('\n  ▲ Exhuma CLI v0.1.0\n')));

	const existingConfig = getConfig();
	if (existingConfig && !options.yes) {
		const { overwrite } = await prompts({
			type: 'confirm',
			name: 'overwrite',
			message: 'exhuma.json already exists. Do you want to overwrite it?',
			initial: false,
		});
		if (!overwrite) {
			console.log(pc.yellow('  Initialization cancelled.\n'));
			return;
		}
	}

	const detected = detectEcosystem();
	let flavor: EcosystemFlavor = detected;

	if (options.flavor && SUPPORTED_ECOSYSTEMS.includes(options.flavor as EcosystemFlavor)) {
		flavor = options.flavor as EcosystemFlavor;
	} else if (!options.yes) {
		const response = await prompts({
			type: 'select',
			name: 'flavor',
			message: `Select your project ecosystem (detected: ${pc.green(detected)}):`,
			choices: SUPPORTED_ECOSYSTEMS.map((eco) => ({
				title: ECOSYSTEM_LABELS[eco],
				value: eco,
			})),
			initial: SUPPORTED_ECOSYSTEMS.indexOf(detected),
		});
		if (!response.flavor) {
			console.log(pc.yellow('  Initialization cancelled.\n'));
			return;
		}
		flavor = response.flavor;
	}

	let componentPath = DEFAULT_PATHS[flavor];
	if (!options.yes) {
		const pathResponse = await prompts({
			type: 'text',
			name: 'path',
			message: 'Where would you like to install components?',
			initial: componentPath,
		});
		if (pathResponse.path) {
			componentPath = pathResponse.path;
		}
	}

	const spinner = ora('Writing exhuma.json configuration...').start();
	writeConfig({
		$schema: 'https://exhuma.dev/schema.json',
		flavor,
		path: componentPath,
		typescript: true,
		tailwind: true,
	});
	spinner.succeed(pc.green('Configuration saved to exhuma.json'));

	console.log(pc.dim('\n  Next steps:'));
	console.log(`  ${pc.cyan('npx exhuma add <component>')} to install a component`);
	console.log(`  ${pc.cyan('npx exhuma list')} to view available components\n`);
}
