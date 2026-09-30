import { NextResponse } from 'next/server';
import { ALL_COMPONENTS, ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';

const ALL_FLAVORS = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

export async function GET() {
	const index = ALL_COMPONENTS.map((c) => ({
		id: c.id,
		name: c.name,
		slug: c.slug,
		category: c.category,
		description: c.description,
		version: c.version,
		flavors: ALL_FLAVORS,
	}));

	return NextResponse.json(index, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
