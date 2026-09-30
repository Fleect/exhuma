'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconClock as Clock, IconCalendar as Calendar, IconSparkles as Sparkles, IconArrowUpRight as ArrowUpRight } from '@tabler/icons-react';
import type { BlogPost } from '@/lib/blog-data';
import { CornerTicks } from '@/components/docs/CornerTicks';
import { cn } from '@/lib/utils';

interface BlogFeedProps {
	posts: BlogPost[];
}

export function BlogFeed({ posts }: BlogFeedProps) {
	const [activeTag, setActiveTag] = React.useState<string>('all');

	// Extract unique tags across all posts
	const allTags = React.useMemo(() => {
		const tagSet = new Set<string>();
		posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
		return ['all', ...Array.from(tagSet)];
	}, [posts]);

	// Filter posts based on active tag
	const filteredPosts = React.useMemo(() => {
		return posts.filter((p) => {
			return activeTag === 'all' || p.tags.includes(activeTag);
		});
	}, [posts, activeTag]);

	const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
	const feedPosts = featuredPost ? filteredPosts.filter((p) => p.slug !== featuredPost.slug) : filteredPosts;

	return (
		<div className='space-y-8 sm:space-y-10'>
			{/* Category Pill Tabs */}
			<div className='no-scrollbar flex items-center gap-2 overflow-x-auto pb-1'>
				{allTags.map((tag) => {
					const isSelected = activeTag === tag;
					const count = tag === 'all' ? posts.length : posts.filter((p) => p.tags.includes(tag)).length;

					if (count === 0) return null;

					return (
						<button
							key={tag}
							type='button'
							onClick={() => setActiveTag(tag)}
							className={cn(
								'flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
								isSelected ? 'bg-foreground text-background shadow-xs' : 'border-border/80 bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 border'
							)}
						>
							<span className='whitespace-nowrap capitalize'>{tag === 'all' ? 'All Dispatches' : tag}</span>
							<span className={cn('text-3xs rounded-full px-2 py-0.5 font-mono font-bold', isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground')}>{count}</span>
						</button>
					);
				})}
			</div>

			{/* Featured Dispatch Card */}
			{featuredPost && (
				<div className='border-border/80 bg-card/60 hover:border-foreground/40 group relative overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 sm:p-8'>
					<CornerTicks />
					<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

					<div className='space-y-4'>
						{/* Metadata Bar */}
						<div className='flex flex-wrap items-center justify-between gap-2'>
							<div className='flex flex-wrap items-center gap-1.5'>
								<span className='kbd border-border bg-background text-foreground text-3xs font-mono font-bold tracking-wider uppercase'>
									<Sparkles className='mr-1 inline-block h-3 w-3 align-middle' />
									Featured Dispatch
								</span>
								{featuredPost.tags.map((tag) => (
									<span key={tag} className='kbd border-border bg-background text-muted-foreground text-3xs font-mono uppercase'>
										{tag}
									</span>
								))}
							</div>
							<div className='text-muted-foreground text-3xs flex items-center gap-2 font-mono'>
								<span className='flex items-center gap-1'>
									<Calendar className='h-3 w-3 shrink-0' />
									<span>{featuredPost.publishedAt}</span>
								</span>
								<span>·</span>
								<span className='flex items-center gap-1'>
									<Clock className='h-3 w-3 shrink-0' />
									<span>{featuredPost.readTime}</span>
								</span>
							</div>
						</div>

						{/* Headline & Abstract */}
						<Link href={`/blog/${featuredPost.slug}`} className='block space-y-2'>
							<h3 className='text-foreground text-xl font-bold tracking-tight transition-colors sm:text-2xl lg:text-3xl'>{featuredPost.title}</h3>
							<p className='text-muted-foreground text-sm leading-relaxed'>{featuredPost.description}</p>
						</Link>

						{/* Footer / Author */}
						<div className='border-border/60 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'>
							<div className='flex items-center gap-2.5'>
								<div className='border-border bg-background text-foreground text-2xs flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono font-bold'>
									{featuredPost.author.avatar}
								</div>
								<div>
									<div className='text-foreground text-xs font-semibold'>
										{featuredPost.author.url ? (
											<Link href={featuredPost.author.url} target='_blank' rel='noreferrer' className='hover:text-primary transition-colors hover:underline'>
												{featuredPost.author.name}
											</Link>
										) : (
											featuredPost.author.name
										)}
									</div>
									<div className='text-muted-foreground text-3xs font-mono'>{featuredPost.author.role}</div>
								</div>
							</div>

							<Link href={`/blog/${featuredPost.slug}`} className='text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 font-mono text-xs transition-colors'>
								<span>Read Dispatch</span>
								<ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
							</Link>
						</div>
					</div>
				</div>
			)}

			{/* Grid of Archived Dispatches in Exact ComponentCard style */}
			{feedPosts.length > 0 && (
				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					{feedPosts.map((post) => (
						<div
							key={post.slug}
							className='border-border/80 bg-card/60 hover:border-foreground/30 group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10'
						>
							<CornerTicks />
							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

							<div>
								{/* Header: Tag + Explore Link */}
								<div className='mb-3.5 flex items-center justify-between gap-2'>
									<div className='flex flex-wrap gap-1'>
										{post.tags.slice(0, 2).map((tag) => (
											<span key={tag} className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold tracking-wider uppercase'>
												{tag}
											</span>
										))}
									</div>
									<Link href={`/blog/${post.slug}`} className='text-muted-foreground group-hover:text-foreground text-2xs inline-flex items-center gap-1 font-mono transition-colors'>
										<span>Read</span>
										<ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
									</Link>
								</div>

								{/* Title & Description */}
								<Link href={`/blog/${post.slug}`} className='block'>
									<h3 className='text-foreground text-base font-bold tracking-tight transition-colors sm:text-lg'>{post.title}</h3>
									<p className='text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed'>{post.description}</p>
								</Link>
							</div>

							{/* Bottom Author & Timing */}
							<div className='border-border/60 mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs'>
								<div className='flex items-center gap-2'>
									<div className='border-border bg-background text-foreground text-3xs flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border font-mono font-bold'>{post.author.avatar}</div>
									{post.author.url ? (
										<Link href={post.author.url} target='_blank' rel='noreferrer' className='text-muted-foreground hover:text-foreground text-2xs font-mono transition-colors hover:underline'>
											{post.author.name}
										</Link>
									) : (
										<span className='text-muted-foreground text-2xs font-mono'>{post.author.name}</span>
									)}
								</div>
								<span className='text-muted-foreground text-3xs flex items-center gap-1 font-mono'>
									<Clock className='h-3 w-3' />
									<span>{post.readTime}</span>
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
