import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { getDocsSection } from '@/components/docs/docs-nav';
import { COMPONENT_COUNT, ECOSYSTEM_COUNT, getEcosystemTargets } from '@/components/docs/docs-stats';

const HREF = '/docs';

export const metadata: Metadata = {
	title: { absolute: 'Introduction — Exhuma Docs' },
	description: 'Why Exhuma ships physics-driven components as source you own, re-authored natively for every supported frontend ecosystem.',
	openGraph: {
		title: 'Introduction — Exhuma Docs',
		description: 'Why Exhuma ships physics-driven components as source you own, re-authored natively for every supported frontend ecosystem.',
		type: 'article',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Introduction — Exhuma Docs',
		description: 'Why Exhuma ships physics-driven components as source you own, re-authored natively for every supported frontend ecosystem.',
	},
};

const toc = [
	{ id: 'philosophy', title: 'Philosophy & Motivation' },
	{ id: 'why-copy-paste', title: 'Why Copy-Paste Wins' },
	{ id: 'ecosystem-contract', title: 'The Ecosystem Contract' },
	{ id: 'ucm-model', title: 'Universal Component Model' },
];

export default function DocsOverviewPage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='Universal Component Architecture'
				description={`Exhuma is an unopinionated, copy-paste headless engineering system. It authors high-performance tactile interactions from fundamental mathematical principles and adapts them into ${ECOSYSTEM_COUNT} native frontend framework idioms.`}
				meta={[`${COMPONENT_COUNT} components`, `${ECOSYSTEM_COUNT} ecosystems`, '0 runtime deps']}
			/>

			<DocsSection id='philosophy' index={1} label='Philosophy' title='Philosophy & Motivation'>
				<DocsProse>
					Modern frontend development has been fragmented into isolated package ecosystems. A rich layout engine written in React cannot be cleanly used in Vue 3 or Svelte 5 without bundling multiple megabytes
					of runtime adapters or polyfills.
				</DocsProse>
				<DocsProse>
					Exhuma inverts this relationship. Rather than shipping a monolithic NPM library, Exhuma maintains a canonical mathematical specification for each component and re-synthesizes it into native code.
				</DocsProse>
				<Callout type='note' title='Zero Runtime Wrappers'>
					When you add an Exhuma component, you receive 100% pure idiomatic code for your framework. A Svelte 5 component uses Svelte 5 runes (<code className='text-foreground font-mono'>$state</code>,{' '}
					<code className='text-foreground font-mono'>$effect</code>); an Angular component uses Angular 18 signals; a Flutter component uses Dart StatefulWidget.
				</Callout>
			</DocsSection>

			<DocsSection id='why-copy-paste' index={2} label='Ownership' title='Why Copy-Paste Wins Over Monolithic NPM'>
				<DocsProse>
					Inspired by the triumph of <strong className='text-foreground'>shadcn/ui</strong> and Tailwind CSS, we believe developers should <strong className='text-foreground'>own their code</strong>. Monolithic
					component packages introduce:
				</DocsProse>
				<ul className='text-muted-foreground list-disc space-y-1.5 pl-5 text-sm'>
					<li>
						<strong className='text-foreground'>Dependency Hell:</strong> Conflicting peer dependencies during major framework upgrades.
					</li>
					<li>
						<strong className='text-foreground'>CSS Leaks:</strong> Global class collisions and un-overrideable styles.
					</li>
					<li>
						<strong className='text-foreground'>Bundle Bloat:</strong> Unused features bundled into your client bundle.
					</li>
				</ul>
				<DocsProse>With Exhuma, the code lives in your repository. You can modify physics, rename props, adjust colors, and tune performance without submitting an upstream PR.</DocsProse>
			</DocsSection>

			<DocsSection id='ecosystem-contract' index={3} label='Contracts' title='The Ecosystem Contract'>
				<DocsProse>Every canonical component adheres to {ECOSYSTEM_COUNT} strict contracts:</DocsProse>
				<ul className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
					{getEcosystemTargets().map((target) => (
						<li key={target.flavor} className='border-border/80 bg-card/60 hover:border-foreground/30 rounded-xl border p-3 transition-colors'>
							<div className='text-foreground text-2xs font-semibold'>{target.name}</div>
							{target.ext && <div className='text-muted-foreground text-3xs mt-0.5 font-mono'>{target.ext}</div>}
						</li>
					))}
				</ul>
			</DocsSection>

			<DocsSection id='ucm-model' index={4} label='Schema' title='Universal Component Model (UCM)'>
				<DocsProse>To guarantee mathematical consistency, each component is implemented against the UCM schema:</DocsProse>
				<CodeBlock
					code={`export interface UniversalComponent {
  id: string;
  name: string;
  slug: string;
  category: 'cards' | 'layouts' | 'navigation' | 'primitives';
  description: string;
  version: string;
  props: PropDescriptor[];
  defaultProps: Record<string, unknown>;
  dependencies?: Partial<Record<EcosystemFlavor, string[]>>;
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }) => ComponentFilePayload[];
}`}
					language='ts'
					filename='schema.ts'
				/>
			</DocsSection>
		</DocsPage>
	);
}
