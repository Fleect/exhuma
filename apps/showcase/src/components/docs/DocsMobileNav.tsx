'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconMenu2 as Menu, IconX as X, IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { COMPONENT_REGISTRY } from '@/registry';
import { DOCS_NAV, getDocsSection } from './docs-nav';
import { DocsNavList } from './DocsNavList';

function getPageTitle(pathname: string): string {
	const slug = pathname.startsWith('/docs/components/') ? pathname.slice('/docs/components/'.length) : null;
	if (slug) return COMPONENT_REGISTRY[slug]?.name ?? 'Component';
	return DOCS_NAV.flatMap((section) => section.items).find((item) => item.href === pathname)?.title ?? 'Docs';
}

/**
 * Phones get a slim bar under the header that opens the docs nav as a drawer,
 * instead of the full sidebar stacked above every page's content.
 */
export function DocsMobileNav() {
	const pathname = usePathname();
	const [open, setOpen] = React.useState(false);

	return (
		<div className='bg-background/85 border-border top-header sticky z-30 -mx-4 flex h-12 items-center border-b px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:hidden'>
			<DialogPrimitive.Root open={open} onOpenChange={setOpen}>
				<DialogPrimitive.Trigger
					aria-label={`Open docs navigation. Current page: ${getPageTitle(pathname)}`}
					className='text-muted-foreground hover:text-foreground flex min-w-0 cursor-pointer items-center gap-2 text-xs font-medium transition-colors'
				>
					<Menu aria-hidden='true' className='h-4 w-4 shrink-0' />
					<span className='text-3xs shrink-0 font-mono font-bold tracking-wider uppercase'>{getDocsSection(pathname)}</span>
					<ChevronRight aria-hidden='true' className='h-3 w-3 shrink-0' />
					<span className='text-foreground truncate'>{getPageTitle(pathname)}</span>
				</DialogPrimitive.Trigger>

				<DialogPrimitive.Portal>
					<DialogPrimitive.Overlay className='animate-overlay-in fixed inset-0 z-50 bg-black/60 backdrop-blur-sm' />
					<DialogPrimitive.Content
						aria-describedby={undefined}
						className='bg-background border-border animate-drawer-in fixed inset-y-0 left-0 z-50 flex w-80 max-w-full flex-col border-r shadow-2xl outline-none motion-reduce:animate-none'
					>
						<div className='border-border flex h-14 shrink-0 items-center justify-between border-b px-4'>
							<DialogPrimitive.Title className='text-3xs text-foreground font-mono font-bold tracking-wider'>{'// DOCS'}</DialogPrimitive.Title>
							<DialogPrimitive.Close className='text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-pointer rounded-md p-1 outline-none focus-visible:ring-2'>
								<X className='h-4 w-4' />
								<span className='sr-only'>Close navigation</span>
							</DialogPrimitive.Close>
						</div>
						<div className='flex-1 overflow-y-auto overscroll-contain px-3 py-5'>
							<DocsNavList onNavigate={() => setOpen(false)} />
						</div>
					</DialogPrimitive.Content>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</div>
	);
}

export default DocsMobileNav;
