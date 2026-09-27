import {
	IconActivity as Activity,
	IconBook2 as BookOpen,
	IconCpu as Cpu,
	IconPackage as Package,
	IconPalette as Palette,
	IconShieldCheck as ShieldCheck,
	IconStack2 as Layers,
	IconTerminal2 as Terminal,
	type Icon,
} from '@tabler/icons-react';
import { ALL_COMPONENTS, CATEGORIES } from '@/registry';

export interface DocsNavItem {
	href: string;
	title: string;
	icon: Icon;
}

export interface DocsNavSection {
	title: string;
	items: DocsNavItem[];
}

export interface DocsPagerLink {
	href: string;
	title: string;
}

/**
 * The single source of truth for docs navigation. The sidebar, the mobile nav,
 * page eyebrows and the prev/next pager all read from this, so their order and
 * page names can't drift apart again.
 */
export const DOCS_NAV: DocsNavSection[] = [
	{
		title: 'Getting Started',
		items: [
			{ href: '/docs', title: 'Introduction', icon: BookOpen },
			{ href: '/docs/installation', title: 'Installation', icon: Package },
			{ href: '/docs/theming', title: 'Theming & Dark Mode', icon: Palette },
			{ href: '/docs/cli', title: 'CLI Reference', icon: Terminal },
		],
	},
	{
		title: 'Architecture',
		items: [
			{ href: '/docs/methodology', title: 'Kinetic Methodology', icon: Activity },
			{ href: '/docs/ecosystems', title: 'Ecosystem Contracts', icon: Cpu },
			{ href: '/docs/lifecycle', title: 'Lifecycle & Memory Safety', icon: ShieldCheck },
		],
	},
	{
		title: 'Components',
		items: [{ href: '/docs/components', title: 'All Components', icon: Layers }],
	},
];

const COMPONENT_CATEGORIES = CATEGORIES.map((cat) => cat.id);

const ORDERED_COMPONENTS = COMPONENT_CATEGORIES.flatMap((category) => ALL_COMPONENTS.filter((comp) => comp.category === category));

/** Every docs page in reading order: the guides, the component index, then each component following sidebar category order. */
const READING_ORDER: DocsPagerLink[] = [
	...DOCS_NAV.flatMap((section) => section.items.map(({ href, title }) => ({ href, title }))),
	...ORDERED_COMPONENTS.map((component) => ({ href: `/docs/components/${component.slug}`, title: component.name })),
];

export function getDocsPager(href: string): { prev: DocsPagerLink | null; next: DocsPagerLink | null } {
	const index = READING_ORDER.findIndex((link) => link.href === href);
	if (index === -1) return { prev: null, next: null };
	return { prev: READING_ORDER[index - 1] ?? null, next: READING_ORDER[index + 1] ?? null };
}

/** The sidebar section a docs page belongs to, used for its eyebrow. */
export function getDocsSection(href: string): string {
	if (href.startsWith('/docs/components')) return 'Components';
	return DOCS_NAV.find((section) => section.items.some((item) => item.href === href))?.title ?? 'Docs';
}
