import { z } from 'zod';

export const SUPPORTED_ECOSYSTEMS = ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'wordpress', 'webcomponent', 'react-native', 'flutter'] as const;

export const ECOSYSTEM_COUNT = SUPPORTED_ECOSYSTEMS.length;

export const EcosystemFlavorSchema = z.enum(SUPPORTED_ECOSYSTEMS);

export type EcosystemFlavor = z.infer<typeof EcosystemFlavorSchema>;

export const ECOSYSTEM_LABELS: Record<EcosystemFlavor, string> = {
	react: 'React (.tsx)',
	nextjs: 'Next.js 15 (App Router)',
	vue: 'Vue 3 / Nuxt (.vue)',
	svelte: 'Svelte 5 / SvelteKit (.svelte)',
	angular: 'Angular 18+ Standalone (.ts)',
	solid: 'SolidJS (.tsx)',
	astro: 'Astro (.astro)',
	blade: 'Laravel Blade (.blade.php)',
	vanilla: 'Vanilla JS & Scoped CSS',
	wordpress: 'WordPress Gutenberg Block',
	webcomponent: 'Universal Web Component (<exhuma-*>)',
	'react-native': 'React Native / Expo (.tsx)',
	flutter: 'Flutter / Dart (.dart)',
};

export type PropType = 'number' | 'string' | 'boolean' | 'select' | 'color';

export interface PropDescriptor {
	name: string;
	label: string;
	type: PropType;
	defaultValue: unknown;
	min?: number;
	max?: number;
	step?: number;
	options?: Array<{ label: string; value: string }>;
	description?: string;
}

export interface ComponentFilePayload {
	filename: string;
	language: 'typescript' | 'javascript' | 'tsx' | 'vue' | 'svelte' | 'astro' | 'php' | 'html' | 'css' | 'json' | 'dart';
	code: string;
	description?: string;
}

export interface UniversalComponent {
	id: string;
	name: string;
	slug: string;
	category: 'cards' | 'layouts' | 'navigation' | 'primitives' | 'typography' | 'buttons' | 'interactive';
	description: string;
	version: string;
	props: PropDescriptor[];
	defaultProps: Record<string, unknown>;
	dependencies?: Partial<Record<EcosystemFlavor, string[]>>;
	devDependencies?: Partial<Record<EcosystemFlavor, string[]>>;
	generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }) => ComponentFilePayload[];
}
