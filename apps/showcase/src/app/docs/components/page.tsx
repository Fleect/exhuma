import React from 'react';
import type { Metadata } from 'next';
import { ALL_COMPONENTS, CATEGORIES } from '@/registry';
import { ComponentCard } from '@/components/docs/ComponentCard';
import { PackageManagerTabs } from '@/components/docs/PackageManagerTabs';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection } from '@/components/docs/DocsSection';
import { getDocsSection } from '@/components/docs/docs-nav';
import { COMPONENT_COUNT, ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

const HREF = '/docs/components';

export const metadata: Metadata = {
	title: 'Components',
	description: 'Every Exhuma component, grouped by category, each authored natively for every supported ecosystem.',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	cards: 'High-frequency pointer mathematics, 3D perspective gyroscopes, and sticky depth interpolation.',
	layouts: 'CSS multi-column masonry with zero layout thrashing, and mathematical auto-fit minmax responsive grid systems.',
	navigation: 'Dynamic momentum horizontal rail scrolling with native snap points and wheel-scroll translation.',
	primitives: 'Self-contained dynamic primitives, mathematical springs, coordinate projections, and zero-layout-shift kinetic transitions.',
};

export default function ComponentsHubPage() {
	return (
		<DocsPage href={HREF} toc={[]} showToc={false} wide>
			<DocsPageHeader
				id='overview'
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='Canonical Components'
				description={`${COMPONENT_COUNT} core interaction systems, layout engines, and kinetic primitives. Every component is authored natively into ${ECOSYSTEM_COUNT} production framework contracts.`}
				meta={[`${COMPONENT_COUNT} components`, `${CATEGORIES.length} categories`, `${ECOSYSTEM_COUNT} ecosystems`]}
			/>

			<DocsSection id='quick-add' index={1} label='CLI' title='Install Any Component' description={`One command, ${ECOSYSTEM_COUNT} targets supported.`}>
				<PackageManagerTabs command='exhuma add tilt-card' />
			</DocsSection>

			{CATEGORIES.map((category, i) => (
				<DocsSection key={category.id} id={category.id} index={i + 2} label='Category' title={category.label} description={CATEGORY_DESCRIPTIONS[category.id]}>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						{ALL_COMPONENTS.filter((component) => component.category === category.id).map((component) => (
							<ComponentCard key={component.slug} slug={component.slug} name={component.name} category={component.category} description={component.description} />
						))}
					</div>
				</DocsSection>
			))}
		</DocsPage>
	);
}
