import { redirect } from 'next/navigation';
import { ALL_COMPONENTS } from '@/registry';

export async function generateStaticParams() {
	return ALL_COMPONENTS.map((comp) => ({
		category: comp.category,
		slug: comp.slug,
	}));
}

export default async function LegacyComponentRedirect({ params }: { params: Promise<{ category: string; slug: string }> }) {
	const { slug } = await params;
	redirect(`/docs/components/${slug}`);
}
