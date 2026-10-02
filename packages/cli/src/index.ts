import { Command } from 'commander';
import { ECOSYSTEM_COUNT } from '@fleect/exhuma-registry';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { buildCommand } from './commands/build';

const program = new Command();

program.name('exhuma').description(`Universal Component CLI — Add tactile, headless components to any project across ${ECOSYSTEM_COUNT} ecosystems`).version('0.2.0-beta.1');

program
	.command('init')
	.description('Initialize exhuma.json configuration in your project')
	.option('-y, --yes', 'Skip prompts and use defaults')
	.option('-f, --flavor <flavor>', 'Target ecosystem flavor')
	.action(initCommand);

program
	.command('add')
	.description('Add components to your project')
	.argument('[components...]', 'Names of components to install (e.g. stacking-cards)')
	.option('-f, --flavor <flavor>', 'Override ecosystem flavor (e.g. svelte, react, blade, flutter)')
	.option('-o, --overwrite', 'Overwrite existing files')
	.option('-a, --all', 'Install all available components')
	.option('-p, --path <path>', 'Custom directory to install component files')
	.option('-y, --yes', 'Skip confirmation prompts')
	.option('-e, --eject', 'Install standalone zero-dependency ejected engine with inlined math')
	.option('-v, --vendor', 'Vendor all core kinetic math into local directory')
	.action(addCommand);

program.command('list').description('List all available components in the Exhuma registry').action(listCommand);

program
	.command('build')
	.description('Compile and export universal component registry to static JSON for Vercel/CDN')
	.option('-o, --output <dir>', 'Output directory (default: public/registry)')
	.option('-c, --check', 'Run compiler syntax checks on all components')
	.action(buildCommand);

program.parse(process.argv);
