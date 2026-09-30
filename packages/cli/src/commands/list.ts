import pc from 'picocolors';
import { CANONICAL_COMPONENTS, SUPPORTED_ECOSYSTEMS, ECOSYSTEM_LABELS } from '../constants';

export function listCommand(): void {
	console.log(pc.bold(pc.cyan('\n  ▲ Exhuma Universal Component Registry\n')));

	console.log(pc.bold(pc.white('  Available Components:')));
	console.log(pc.dim(`  ${'─'.repeat(58)}`));

	for (const comp of CANONICAL_COMPONENTS) {
		const slugStr = pc.cyan(comp.slug.padEnd(24));
		const catStr = pc.dim(`[${comp.category.toUpperCase()}]`.padEnd(12));
		console.log(`  ${slugStr} ${catStr} ${comp.name}`);
		console.log(pc.dim(`    ${comp.description}`));
	}

	console.log(pc.dim(`  ${'─'.repeat(58)}`));
	console.log(pc.bold(pc.white('\n  Supported Ecosystems (13):')));
	console.log(`  ${SUPPORTED_ECOSYSTEMS.map((eco) => pc.green(eco)).join(pc.dim(' • '))}`);

	console.log(pc.dim('\n  Usage:'));
	console.log(`  ${pc.cyan('npx exhuma add <slug> --flavor=<target>')}\n`);
}
