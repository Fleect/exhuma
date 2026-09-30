import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from '@tabler/icons-react';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-data';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { ArticleShareButton } from '@/components/blog/ArticleShareButton';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return BLOG_POSTS.map((p) => ({
		slug: p.slug,
	}));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug);
	if (!post) return { title: 'Post Not Found — Exhuma Journal' };

	return {
		title: { absolute: `${post.title} — Exhuma Journal` },
		description: post.description,
		openGraph: {
			title: `${post.title} — Exhuma Journal`,
			description: post.description,
			type: 'article',
			publishedTime: post.publishedAt,
			authors: [post.author.name],
		},
		twitter: {
			card: 'summary_large_image',
			title: `${post.title} — Exhuma Journal`,
			description: post.description,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
	const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
	const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

	const tocItems = post.content.headings.map((h) => ({
		id: h.id,
		title: h.title,
	}));

	return (
		<div className='anchor-offset container min-h-screen py-8 sm:py-12 lg:py-16'>
			{/* Top reading hairline progress bar */}
			<ReadingProgressBar />

			<div className='flex gap-10'>
				{/* Main Article Content matching DocsPage architecture */}
				<article className='mx-auto max-w-3xl min-w-0 flex-1 space-y-12'>
					{/* Header using DocsPageHeader specification */}
					<DocsPageHeader
						eyebrow={[{ label: 'Journal', href: '/blog' }, { label: post.tags[0] ?? 'Architecture' }]}
						title={post.title}
						description={post.description}
						actions={<ArticleShareButton title={post.title} />}
						meta={[post.readTime, post.publishedAt, `Authored by ${post.author.name}`, ...post.tags]}
					/>

					{/* Article Body Sections with DocsSection */}
					<div className='space-y-12'>
						{post.content.sections.map((section, idx) => (
							<DocsSection key={section.id} id={section.id} index={idx + 1} label={`SECTION ${String(idx + 1).padStart(2, '0')}`} title={section.title}>
								<DocsProse>{section.content}</DocsProse>

								{section.callout && (
									<Callout type={section.callout.type} title={section.callout.title}>
										{section.callout.message}
									</Callout>
								)}

								{section.codeSnippet && (
									<div className='pt-2'>
										<CodeBlock code={section.codeSnippet.code} language={section.codeSnippet.language} filename={section.codeSnippet.filename} />
									</div>
								)}
							</DocsSection>
						))}
					</div>

					{/* Prev/Next Navigation in DocsPager style */}
					<nav aria-label='Dispatch navigation' className='border-border/70 flex items-center justify-between gap-4 border-t pt-8'>
						{prevPost && (
							<Button variant='secondary' size='sm' asChild className='min-w-0'>
								<Link href={`/blog/${prevPost.slug}`} aria-label={`Previous: ${prevPost.title}`}>
									<ArrowLeft className='h-3.5 w-3.5 shrink-0' />
									<span className='truncate'>{prevPost.title}</span>
								</Link>
							</Button>
						)}

						{nextPost && (
							<Button variant='secondary' size='sm' asChild className='ml-auto min-w-0'>
								<Link href={`/blog/${nextPost.slug}`} aria-label={`Next: ${nextPost.title}`}>
									<span className='truncate'>{nextPost.title}</span>
									<ArrowRight className='h-3.5 w-3.5 shrink-0' />
								</Link>
							</Button>
						)}
					</nav>
				</article>

				{/* Desktop Sticky Table of Contents (xl+) matching DocsPage */}
				<DocsToc items={tocItems} />
			</div>
		</div>
	);
}
