import { SUPPORTED_ECOSYSTEMS, type EcosystemFlavor, ECOSYSTEM_LABELS, ALL_COMPONENTS } from '@exhuma/registry';

export { SUPPORTED_ECOSYSTEMS, type EcosystemFlavor, ECOSYSTEM_LABELS };

export const DEFAULT_PATHS: Record<EcosystemFlavor, string> = {
	react: 'components/ui',
	nextjs: 'components/ui',
	vue: 'components',
	svelte: 'src/lib/components',
	angular: 'src/app/components',
	solid: 'src/components',
	astro: 'src/components',
	blade: 'resources/views/components',
	vanilla: 'src/components',
	wordpress: 'src/blocks',
	webcomponent: 'src/components',
	'react-native': 'components',
	flutter: 'lib/widgets',
};

export const CANONICAL_COMPONENTS = ALL_COMPONENTS.map((comp) => ({
	name: comp.name,
	slug: comp.slug,
	category: comp.category,
	description: comp.description,
}));

export const REGISTRY_BASE_URL = 'https://exhuma.dev/api/registry';
