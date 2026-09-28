import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsTable, docsTableHeadClass } from '@/components/docs/DocsTable';
import { getDocsSection } from '@/components/docs/docs-nav';
import { COMPONENT_COUNT } from '@/components/docs/docs-stats';

const HREF = '/docs/cli';

export const metadata: Metadata = {
	title: 'CLI Reference',
	description: 'Every exhuma command and flag: init, add, list, and build, plus the offline embedded registry.',
};

const toc = [
	{ id: 'cli-overview', title: 'CLI Overview' },
	{ id: 'command-init', title: 'exhuma init' },
	{ id: 'command-add', title: 'exhuma add' },
	{ id: 'command-list', title: 'exhuma list' },
	{ id: 'command-build', title: 'exhuma build' },
	{ id: 'offline-guarantee', title: 'Offline Embedded Guarantee' },
];

const code = 'text-foreground font-mono';

function FlagTable({ label, rows }: { label: string; rows: { flag: string; type: string; description: string }[] }) {
	return (
		<DocsTable label={label}>
			<thead className={docsTableHeadClass}>
				<tr>
					<th className='px-4 py-3'>Flag</th>
					<th className='px-4 py-3'>Type</th>
					<th className='px-4 py-3'>Description</th>
				</tr>
			</thead>
			<tbody className='divide-border divide-y'>
				{rows.map((row) => (
					<tr key={row.flag} className='hover:bg-muted/30 transition-colors'>
						<td className='text-foreground px-4 py-2.5 font-mono font-semibold whitespace-nowrap'>{row.flag}</td>
						<td className='text-muted-foreground px-4 py-2.5 font-mono'>{row.type}</td>
						<td className='text-muted-foreground px-4 py-2.5'>{row.description}</td>
					</tr>
				))}
			</tbody>
		</DocsTable>
	);
}

export default function CliReferencePage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='CLI Reference & Commands'
				description={
					<>
						The official <code className={code}>exhuma</code> command-line interface provides autonomous framework detection, canonical component retrieval, and offline code generation.
					</>
				}
				meta={['4 commands', 'Works offline']}
			/>

			<DocsSection id='cli-overview' index={1} label='Overview' title='CLI Overview'>
				<DocsProse>
					The CLI package is published under <code className={code}>exhuma</code> on npm. It can be invoked on-demand via <code className={code}>npx</code>, <code className={code}>pnpm dlx</code>,{' '}
					<code className={code}>bunx</code>, or <code className={code}>yarn dlx</code> without requiring global installation:
				</DocsProse>
				<CodeBlock
					code={`# Display version
npx exhuma --version

# Display global help
npx exhuma --help`}
					language='bash'
					filename='Terminal'
				/>
			</DocsSection>

			<DocsSection id='command-init' index={2} label='Command' title='exhuma init'>
				<DocsProse>
					Configures Exhuma within your existing project by generating an <code className={code}>exhuma.json</code> configuration file.
				</DocsProse>
				<CodeBlock
					code={`# Interactive initialization
npx exhuma init

# Non-interactive initialization with explicit flavor
npx exhuma init --flavor=svelte --path=src/lib/components -y`}
					language='bash'
					filename='Terminal'
				/>
				<FlagTable
					label='exhuma init flags'
					rows={[
						{ flag: '--flavor, -f', type: 'string', description: 'Target framework contract (react, nextjs, svelte, vue, etc.)' },
						{ flag: '--path, -p', type: 'string', description: 'Custom destination directory for components' },
						{ flag: '--yes, -y', type: 'boolean', description: 'Skip confirmation prompts and accept defaults' },
					]}
				/>
			</DocsSection>

			<DocsSection id='command-add' index={3} label='Command' title='exhuma add <slug>'>
				<DocsProse>Retrieves and writes the canonical component implementation into your workspace.</DocsProse>
				<CodeBlock
					code={`# Add single component
npx exhuma add stacking-cards

# Override target flavor on-the-fly
npx exhuma add tilt-card --flavor=flutter

# Overwrite existing component files
npx exhuma add css-masonry --overwrite

# Add all canonical components at once
npx exhuma add --all`}
					language='bash'
					filename='Terminal'
				/>
				<FlagTable
					label='exhuma add flags'
					rows={[
						{ flag: '--all, -a', type: 'boolean', description: `Installs all ${COMPONENT_COUNT} canonical components` },
						{ flag: '--overwrite, -o', type: 'boolean', description: 'Forces file overwrite if already present' },
						{ flag: '--flavor, -f', type: 'string', description: 'Target framework contract override' },
						{ flag: '--path, -p', type: 'string', description: 'Explicit destination directory for this command' },
					]}
				/>
			</DocsSection>

			<DocsSection id='command-list' index={4} label='Command' title='exhuma list'>
				<DocsProse>Inspects available canonical components, categories, and supported frameworks:</DocsProse>
				<CodeBlock code={`npx exhuma list`} language='bash' filename='Terminal' />
			</DocsSection>

			<DocsSection id='command-build' index={5} label='Command' title='exhuma build'>
				<DocsProse>
					Generates static registry JSON files for CDN hosting (such as Vercel Edge output in <code className={code}>public/registry/*.json</code>).
				</DocsProse>
				<CodeBlock code={`npx exhuma build --output=public/registry`} language='bash' filename='Terminal' />
			</DocsSection>

			<DocsSection id='offline-guarantee' index={6} label='Offline' title='Offline Embedded Guarantee'>
				<DocsProse>
					Unlike other CLI tools that fail if internet access is interrupted or an external registry server is down, <code className={code}>exhuma</code> packages an embedded fallback dictionary directly within
					the binary.
				</DocsProse>
				<Callout type='important' title='100% Offline Capability'>
					If network access fails or no external CDN is configured, the CLI falls back seamlessly to its embedded canonical dictionary. Your builds will never fail in isolated CI/CD environments.
				</Callout>
			</DocsSection>
		</DocsPage>
	);
}
