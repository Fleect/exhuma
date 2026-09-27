import React from 'react';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BlogFeed } from '@/components/blog/BlogFeed';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection } from '@/components/docs/DocsSection';
import { StatStrip } from '@/components/showcase/StatStrip';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export const metadata: Metadata = {
	title: 'Engineering Journal',
	description: 'Technical deep dives on kinetic interaction physics, multi-framework design contracts, and the future of copy-paste component architecture.',
	openGraph: {
		title: 'Exhuma Engineering Journal',
		description: 'Technical deep dives on kinetic interaction physics, multi-framework design contracts, and copy-paste component architecture.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exhuma Engineering Journal',
		description: 'Technical deep dives on kinetic interaction physics, multi-framework design contracts, and copy-paste component architecture.',
	},
};

const TELEMETRY_STATS = [
	{ label: 'Published Essays', value: BLOG_POSTS.length, note: 'Deep architectural audits' },
	{ label: 'Compositor Target', value: 120, suffix: 'Hz', note: 'Hardware-accelerated floor' },
	{ label: 'Animation Runtimes', value: 0, note: 'No external runtime dependencies' },
	{ label: 'Ecosystem Parity', value: ECOSYSTEM_COUNT, note: 'Native non-transpiled files' },
];

export default function BlogIndexPage() {
	return (
		<div className='anchor-offset container min-h-screen py-10 sm:py-14 lg:py-18'>
			<div className='space-y-14 sm:space-y-18'>
				<DocsPageHeader
					eyebrow={[{ label: 'Engineering Journal' }]}
					title='Engineering Journal'
					description={`First-principles analyses of kinetic interaction physics, compositor thread scheduling, memory-safe observer lifecycles, and copy-paste architecture across ${ECOSYSTEM_COUNT} frontend ecosystems.`}
					meta={[`${BLOG_POSTS.length} dispatches`, `${ECOSYSTEM_COUNT} ecosystems`, '0 runtime deps', '120Hz target']}
				/>

				{/* Telemetry Stat Grid matching StatStrip from homepage */}
				<StatStrip stats={TELEMETRY_STATS} />

				<DocsSection
					id='dispatches'
					index={1}
					label='Feed'
					title='Technical Dispatches'
					description='Long-form architectural audits, mathematical breakdowns, and compositor runtime analysis.'
					className='border-border/70 space-y-8 border-t pt-12 sm:space-y-10 sm:pt-16'
				>
					<BlogFeed posts={BLOG_POSTS} />
				</DocsSection>
			</div>
		</div>
	);
}
