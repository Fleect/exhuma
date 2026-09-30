import { EcosystemFlavor } from '../schema';

export const CORE_COMPONENT_DEPENDENCIES: Partial<Record<EcosystemFlavor, string[]>> = {
	react: ['@exhuma/core'],
	nextjs: ['@exhuma/core'],
	vue: ['clsx'],
	svelte: ['clsx'],
	solid: ['clsx'],
	angular: [],
	astro: [],
	blade: [],
	vanilla: [],
	wordpress: [],
	webcomponent: [],
	'react-native': [],
	flutter: [],
};
