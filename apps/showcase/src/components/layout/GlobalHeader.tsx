'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconSearch as Search, IconStack2 as Layers, IconBook2 as BookOpen, IconArrowRight as ArrowRight, IconStar as Star, IconMenu2 as Menu, IconX as X } from '@tabler/icons-react';
import { ExhumaLogo } from '@/components/brand/ExhumaLogo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const BANNER_DISMISSED_KEY = 'exhuma-repo-star-request-banner';

export function GlobalHeader() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
	const [bannerDismissed, setBannerDismissed] = React.useState(false);
	const stickyHeaderRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		setMobileMenuOpen(false);
	}, [pathname]);

	// Publish the sticky header's real height as --header-height so sticky rails
	// and anchor jumps sit exactly below it. It changes when the banner is
	// dismissed or wraps, so it's measured rather than hardcoded.
	React.useEffect(() => {
		const header = stickyHeaderRef.current;
		if (!header) return;
		const root = document.documentElement;
		const observer = new ResizeObserver(() => {
			const rootFontSize = parseFloat(getComputedStyle(root).fontSize) || 16;
			root.style.setProperty('--header-height', `${header.getBoundingClientRect().height / rootFontSize}rem`);
		});
		observer.observe(header);
		return () => {
			observer.disconnect();
			root.style.removeProperty('--header-height');
		};
	}, []);

	React.useEffect(() => {
		try {
			if (localStorage.getItem(BANNER_DISMISSED_KEY) === 'true') {
				setBannerDismissed(true);
			}
		} catch {
			// localStorage unavailable (SSR, private browsing, disabled storage) — banner just stays visible
		}
	}, []);

	const dismissBanner = () => {
		setBannerDismissed(true);
		try {
			localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
		} catch {
			// localStorage unavailable — dismissal just won't persist across visits
		}
	};

	const navLinks = [
		{ href: '/docs', label: 'Docs', icon: BookOpen },
		{ href: '/docs/components', label: 'Components', icon: Layers },
		{ href: '/blog', label: 'Blog', icon: BookOpen },
	];

	const triggerCommandPalette = () => {
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			metaKey: true,
			bubbles: true,
		});
		window.dispatchEvent(event);
	};

	const isLinkActive = (href: string) => (href === '/docs' ? pathname === '/docs' || (pathname.startsWith('/docs/') && !pathname.startsWith('/docs/components')) : pathname.startsWith(href));

	return (
		<div ref={stickyHeaderRef} className='sticky top-0 z-40 w-full'>
			{/* Top Announcement Banner (shadcn / Vercel style) */}
			{!bannerDismissed && (
				<div className='border-border bg-muted text-2xs relative border-b py-1.5 pr-10 pl-4 text-center font-medium transition-colors'>
					<Link href='https://github.com/SapanMozammel/exhuma' target='_blank' rel='noreferrer' className='text-foreground/80 hover:text-foreground group inline transition-colors'>
						<Star className='-mt-0.5 mr-1.5 inline-block h-3 w-3 fill-emerald-500/20 align-middle text-emerald-500' />
						<span>Free &amp; open source, built for every frontend stack.</span> <span className='text-foreground font-semibold'>Star Exhuma on GitHub</span>{' '}
						<ArrowRight className='text-primary -mt-0.5 ml-0.5 inline-block h-3 w-3 align-middle transition-transform group-hover:translate-x-0.5' />
					</Link>
					<button
						type='button'
						onClick={dismissBanner}
						aria-label='Dismiss announcement'
						className='text-muted-foreground hover:bg-accent hover:text-foreground absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors'
					>
						<X className='h-3.5 w-3.5' />
					</button>
				</div>
			)}

			{/* Main Navigation Bar */}
			<header className='border-border bg-background/85 w-full border-b backdrop-blur-xl transition-colors'>
				<div className='container-fluid flex h-14 items-center justify-between gap-4'>
					{/* Brand Mark */}
					<div className='flex items-center gap-3 lg:gap-6'>
						<Link href='/' className='group flex items-center gap-2'>
							<ExhumaLogo size={22} className='text-foreground shrink-0' />
							<div className='flex items-center gap-1.5'>
								<span className='font-display text-foreground group-hover:text-foreground/85 text-[16.5px] leading-none font-extrabold tracking-tight transition-colors'>Exhuma</span>
								<span className='border-border/70 bg-muted/60 text-muted-foreground text-4xs hidden rounded-sm border px-1 py-0.5 font-mono font-medium sm:inline-block'>Beta</span>
							</div>
						</Link>

						{/* Navigation Links */}
						<nav className='hidden items-center gap-1 md:flex'>
							{navLinks.map((link) => {
								const isActive = isLinkActive(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors lg:px-3',
											isActive ? 'bg-accent text-accent-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
										)}
									>
										<span>{link.label}</span>
									</Link>
								);
							})}
						</nav>
					</div>

					{/* Right Actions: Command Trigger, Theme Switcher, GitHub, Mobile Menu */}
					<div className='flex items-center gap-2'>
						{/* Search Trigger Button (Raycast style; icon-only below md) */}
						<button
							type='button'
							onClick={triggerCommandPalette}
							aria-label='Search'
							className='border-border bg-background text-muted-foreground hover:border-input hover:bg-accent hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center gap-2 rounded-md border shadow-xs transition-all md:w-auto md:rounded-lg md:px-3'
						>
							<Search className='h-4 w-4 shrink-0' />
							<span className='hidden text-xs whitespace-nowrap md:inline lg:hidden'>Search...</span>
							<span className='hidden text-xs whitespace-nowrap lg:inline'>Search docs & components...</span>
							<span className='ml-2 hidden text-xs font-semibold text-emerald-700 md:inline dark:text-emerald-400'>⌘K</span>
						</button>

						{/* Theme Switcher */}
						<ThemeSwitcher />

						{/* GitHub Repository */}
						<Link
							href='https://github.com/SapanMozammel/exhuma'
							target='_blank'
							rel='noreferrer'
							className='border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-xs transition-colors'
							aria-label='GitHub repository'
						>
							<svg className='h-4 w-4 fill-current' viewBox='0 0 24 24'>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
								/>
							</svg>
						</Link>

						{/* Mobile Navigation Menu (right corner) */}
						<Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
							<PopoverTrigger asChild>
								<button
									type='button'
									className='border-border bg-background text-foreground hover:bg-accent inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-xs transition-colors md:hidden'
									aria-label='Toggle navigation menu'
								>
									<Menu className='h-4 w-4' />
								</button>
							</PopoverTrigger>
							<PopoverContent align='end' className='border-border bg-popover w-56 border p-1.5 shadow-xl'>
								<div className='flex flex-col gap-0.5'>
									{navLinks.map((link) => {
										const isActive = isLinkActive(link.href);
										const Icon = link.icon;
										return (
											<Link
												key={link.href}
												href={link.href}
												className={cn(
													'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
													isActive ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
												)}
											>
												<Icon className='h-4 w-4' />
												<span>{link.label}</span>
											</Link>
										);
									})}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</header>
		</div>
	);
}

export default GlobalHeader;
