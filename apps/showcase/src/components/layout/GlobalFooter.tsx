import * as React from 'react';
import Link from 'next/link';
import { IconShieldCheck as ShieldCheck, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { ExhumaLogo } from '@/components/brand/ExhumaLogo';
import { ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';

const GITHUB_URL = 'https://github.com/Fleect/exhuma';
export const APP_VERSION = '0.2.0-beta.1';

const LINK_GROUPS = [
	{
		title: 'Product',
		links: [
			{ label: 'Docs', href: '/docs' },
			{ label: 'Components', href: '/docs/components' },
			{ label: 'Ecosystems', href: '/docs/ecosystems' },
			{ label: 'Blog', href: '/blog' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ label: 'CLI Reference', href: '/docs/cli' },
			{ label: 'Theming & Dark Mode', href: '/docs/theming' },
			{ label: 'Lifecycle & Memory Safety', href: '/docs/lifecycle' },
			{ label: 'Installation', href: '/docs/installation' },
		],
	},
	{
		title: 'Community',
		links: [
			{ label: 'GitHub', href: GITHUB_URL, external: true },
			{ label: 'npm', href: 'https://npmjs.com/package/exhuma', external: true },
		],
	},
] as const;

export function GlobalFooter() {
	const flavors = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

	return (
		<footer className='border-border bg-background w-full border-t transition-colors'>
			{/* CTA Strip */}
			<div className='border-border bg-muted/30 border-b'>
				<div className='container-fluid flex flex-col items-center justify-between gap-4 py-5 text-center sm:flex-row sm:text-left'>
					<div>
						<div className='font-display text-foreground text-base font-extrabold'>Ship your first component in seconds</div>
						<div className='text-muted-foreground text-2xs'>Copy-paste, framework-native — no lock-in. {flavors.length} ecosystems supported.</div>
					</div>
					<Link
						href='/docs/installation'
						className='bg-primary text-primary-foreground inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition-opacity hover:opacity-90'
					>
						Install <ArrowRight className='h-3.5 w-3.5' />
					</Link>
				</div>
			</div>

			{/* Brand + Link Groups */}
			<div className='container grid grid-cols-1 gap-7 py-10 text-xs md:grid-cols-[34fr_66fr] md:gap-5 lg:gap-10'>
				<div className='space-y-3'>
					<div className='flex items-center gap-2'>
						<ExhumaLogo size={20} className='text-foreground shrink-0' />
						<div className='flex items-center gap-1.5'>
							<span className='font-display text-foreground text-base leading-none font-extrabold tracking-tight'>Exhuma</span>
							<span className='border-border/70 bg-muted/60 text-muted-foreground text-4xs rounded-sm border px-1.5 py-0.5 font-mono font-medium'>v{APP_VERSION}</span>
						</div>
					</div>
					<p className='text-muted-foreground text-2xs leading-relaxed'>
						Universal tactile interaction engines and layout architecture adapted natively across 13 frontend ecosystems. Free, open-source under MIT.
					</p>
					<div className='text-3xs flex items-center gap-1.5 pt-1 font-mono text-emerald-600 dark:text-emerald-400'>
						<ShieldCheck className='h-3.5 w-3.5 shrink-0' />
						<span>Zero Runtime Wrappers · 100% Offline CLI</span>
					</div>
				</div>
				<div className='flex flex-wrap gap-8 md:grid md:grid-cols-3'>
					{LINK_GROUPS.map((group) => (
						<div key={group.title} className='flex grow flex-col md:items-center'>
							<div className='space-y-2.5'>
								<div className='text-muted-foreground text-3xs font-mono font-bold tracking-wider uppercase'>{group.title}</div>
								<ul className='text-muted-foreground text-2xs space-y-2'>
									{group.links.map((link) => (
										<li key={link.label}>
											<Link
												href={link.href}
												target={'external' in link && link.external ? '_blank' : undefined}
												rel={'external' in link && link.external ? 'noreferrer' : undefined}
												className='hover:text-foreground transition-colors'
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Bottom Bar: Operational Status & Shortcuts */}
			<div className='border-border border-t'>
				<div className='container-fluid text-muted-foreground text-2xs flex flex-col items-center justify-between gap-3 py-4 md:flex-row'>
					<div className='flex flex-wrap items-center justify-center gap-2 text-center'>
						<span>MIT License © {new Date().getFullYear()}</span>
						<span className='opacity-40'>·</span>
						<span>
							A{' '}
							<Link href='https://fleect.com/' target='_blank' rel='noreferrer' className='text-foreground/80 hover:text-foreground underline-offset-3 transition-colors hover:underline'>
								Fleect
							</Link>{' '}
							Artifact.
						</span>
					</div>

					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-1'>
							<span className='text-emerald-600 dark:text-emerald-400'>⌘K</span>
							<span>Search</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='text-emerald-600 dark:text-emerald-400'>⌘⌥T</span>
							<span>Theme</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default GlobalFooter;
