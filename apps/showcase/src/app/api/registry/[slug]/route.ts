import { NextRequest, NextResponse } from 'next/server';
import { getComponentBySlug, EcosystemFlavor, ECOSYSTEM_LABELS } from '@/registry';

const ALL_FLAVORS = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const component = getComponentBySlug(slug);

	if (!component) {
		return NextResponse.json({ error: 'Component not found' }, { status: 404 });
	}

	const requestedFlavor = request.nextUrl.searchParams.get('flavor') as EcosystemFlavor | null;
	const isEjected = request.nextUrl.searchParams.get('eject') === 'true';

	// Single-flavor query response for CLI: fetchComponentFromRegistry
	if (requestedFlavor && ALL_FLAVORS.includes(requestedFlavor)) {
		return NextResponse.json(
			{
				id: component.id,
				name: component.name,
				slug: component.slug,
				category: component.category,
				description: component.description,
				version: component.version,
				files: component.generateCode(requestedFlavor, component.defaultProps, { eject: isEjected }),
			},
			{
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Cache-Control': 'public, max-age=3600',
				},
			}
		);
	}

	// Full multi-flavor bundle response
	const payload: Record<string, unknown> = {
		id: component.id,
		name: component.name,
		slug: component.slug,
		version: component.version,
		category: component.category,
		description: component.description,
		props: component.props,
		defaultProps: component.defaultProps,
		flavors: {} as Record<string, unknown>,
	};

	for (const flavor of ALL_FLAVORS) {
		(payload.flavors as Record<string, unknown>)[flavor] = {
			files: component.generateCode(flavor, component.defaultProps),
		};
	}

	return NextResponse.json(payload, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
