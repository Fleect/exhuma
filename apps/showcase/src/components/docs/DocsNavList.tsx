'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronRight as ChevronRight } from '@tabler/icons-react';
import { ALL_COMPONENTS, CATEGORIES } from '@/registry';
import { cn } from '@/lib/utils';
import { DOCS_NAV } from './docs-nav';

const linkClass = (active: boolean) =>
	cn(
		'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
		active ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
	);

const sectionLabelClass = 'text-foreground text-2xs px-3 font-mono font-bold tracking-wider uppercase';

const COMPONENT_CATEGORIES = CATEGORIES.map((cat) => ({
	id: cat.id,
	label: cat.id.charAt(0).toUpperCase() + cat.id.slice(1),
}));

/**
 * Docs navigation shared by the desktop sidebar and the mobile drawer.
 * Searching lives in the global ⌘K palette, so the rail is navigation only.
 */
export function DocsNavList({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	// Unique per instance: the sidebar and the mobile drawer can both be mounted.
	const idPrefix = React.useId();

	return (
		<div className='space-y-6'>
			{DOCS_NAV.map((section) => {
				const isComponents = section.title === 'Components';
				const labelId = `${idPrefix}-${section.title.toLowerCase().replace(/\W+/g, '-')}`;

				return (
					<div key={section.title} className='space-y-2'>
						<p id={labelId} className={sectionLabelClass}>
							{section.title}
						</p>
						<ul aria-labelledby={labelId} className='space-y-1'>
							{section.items.map((item) => {
								const active = pathname === item.href;
								const ItemIcon = item.icon;
								return (
									<li key={item.href}>
										<Link href={item.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={linkClass(active)}>
											<span className='flex min-w-0 items-center gap-2'>
												<ItemIcon className='h-4 w-4 shrink-0' />
												<span className='truncate'>{item.title}</span>
											</span>
											{isComponents ? (
												<span className={cn('text-3xs shrink-0 rounded-full border px-1.5 font-mono', active ? 'border-primary-foreground/40' : 'border-border')}>{ALL_COMPONENTS.length}</span>
											) : (
												active && <ChevronRight className='h-3.5 w-3.5 shrink-0' />
											)}
										</Link>
									</li>
								);
							})}
						</ul>

						{isComponents && (
							<div className='space-y-4 pt-1'>
								{COMPONENT_CATEGORIES.map((cat) => {
									const categoryComponents = ALL_COMPONENTS.filter((c) => c.category === cat.id);
									if (categoryComponents.length === 0) return null;

									return (
										<div key={cat.id} className='space-y-2.5'>
											<div className='text-muted-foreground/70 text-3xs flex items-center justify-between px-3 pt-1 font-mono font-bold tracking-wider uppercase'>
												<span>{cat.label}</span>
												<span className='border-border/60 text-muted-foreground/70 text-3xs rounded-full border px-1.5 py-0.5 font-mono leading-none'>{categoryComponents.length}</span>
											</div>
											<ul className='space-y-1'>
												{categoryComponents.map((component) => {
													const href = `/docs/components/${component.slug}`;
													const active = pathname === href;
													return (
														<li key={component.slug}>
															<Link
																href={href}
																onClick={onNavigate}
																aria-current={active ? 'page' : undefined}
																className={cn(
																	'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
																	active ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
																)}
															>
																<span className='truncate'>{component.name}</span>
																{active && <ChevronRight className='h-3.5 w-3.5 shrink-0' />}
															</Link>
														</li>
													);
												})}
											</ul>
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default DocsNavList;
