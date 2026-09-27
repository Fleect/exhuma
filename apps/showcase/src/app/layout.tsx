import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import '@/styles/global.scss';

import { Providers } from '@/providers';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';
import { FooterVisibility } from '@/components/layout/FooterVisibility';
import { CommandPalette } from '@/components/command/CommandPalette';
import { ECOSYSTEM_LABELS } from '@/registry';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ['latin'],
	weight: ['700', '800'],
	variable: '--font-display',
	display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exhuma.vercel.app';

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `Exhuma — Universal Component Architecture for ${ECOSYSTEM_COUNT} Ecosystems`,
		template: '%s — Exhuma',
	},
	description:
		'Autonomous tactile interactions, dynamic layout engines, and zero-runtime-dependency physics components adapted natively for React, Next.js, Vue, Svelte, Angular, Solid, Astro, Blade, Vanilla, WordPress, Web Components, React Native, and Flutter.',
	keywords: [
		'kinetic primitives',
		'physics-driven components',
		'zero runtime dependencies',
		'copy-paste components',
		'multi-framework',
		'react',
		'nextjs',
		'vue',
		'svelte',
		'angular',
		'solidjs',
		'astro',
		'tailwind css',
		'clsx',
	],
	authors: [{ name: 'Sapan Mozammel', url: 'https://github.com/SapanMozammel' }],
	creator: 'Sapan Mozammel',
	publisher: 'Exhuma',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	icons: {
		icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
		apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: siteUrl,
		siteName: 'Exhuma',
		title: `Exhuma — Universal Component Architecture for ${ECOSYSTEM_COUNT} Ecosystems`,
		description: `Autonomous tactile interactions, dynamic layout engines, and zero-runtime-dependency physics components adapted natively across ${ECOSYSTEM_COUNT} frontend ecosystems.`,
		images: [
			{
				url: '/og.png',
				width: 1200,
				height: 630,
				alt: `Exhuma — Universal Component Architecture for ${ECOSYSTEM_COUNT} Ecosystems`,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: `Exhuma — Universal Component Architecture for ${ECOSYSTEM_COUNT} Ecosystems`,
		description: `Autonomous tactile interactions, dynamic layout engines, and zero-runtime-dependency physics components adapted natively across ${ECOSYSTEM_COUNT} frontend ecosystems.`,
		images: ['/og.png'],
		creator: '@sapanmozammel',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className={bricolageGrotesque.variable}>
			<body suppressHydrationWarning className='bg-background text-foreground selection:bg-primary/10 selection:text-primary min-h-screen antialiased'>
				<Providers>
					<div className='relative flex min-h-screen flex-col'>
						<GlobalHeader />
						<main className='flex-1'>{children}</main>
						<FooterVisibility>
							<GlobalFooter />
						</FooterVisibility>
						<CommandPalette />
					</div>
				</Providers>
			</body>
		</html>
	);
}
