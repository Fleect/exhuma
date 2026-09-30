import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_COMPONENTS, COMPONENT_REGISTRY } from '@/registry';
import { ComponentDocView } from '@/components/showcase/ComponentDocView';
import { DocsPage } from '@/components/docs/DocsPage';

interface ComponentPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return ALL_COMPONENTS.map((comp) => ({
		slug: comp.slug,
	}));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
	const { slug } = await params;
	const comp = COMPONENT_REGISTRY[slug];
	if (!comp) return { title: 'Component Not Found' };

	return {
		title: comp.name,
		description: comp.description,
		openGraph: {
			title: `${comp.name} — Exhuma Component`,
			description: comp.description,
			type: 'article',
		},
		twitter: {
			card: 'summary_large_image',
			title: `${comp.name} — Exhuma Component`,
			description: comp.description,
		},
	};
}

export default async function ComponentDocPage({ params }: ComponentPageProps) {
	const { slug } = await params;
	const component = COMPONENT_REGISTRY[slug];

	if (!component) {
		notFound();
	}

	return (
		<DocsPage href={`/docs/components/${slug}`} toc={[]} showToc={false} wide>
			<ComponentDocView slug={slug} />
		</DocsPage>
	);
}
