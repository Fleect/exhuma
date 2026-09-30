import type { MetadataRoute } from 'next';
import { ALL_COMPONENTS } from '@exhuma/registry';
import { BLOG_POSTS } from '@/lib/blog-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exhuma.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	// Core documentation & landing routes
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${BASE_URL}`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1.0,
		},
		{
			url: `${BASE_URL}/docs`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/docs/installation`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/docs/methodology`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/docs/theming`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/docs/cli`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/docs/ecosystems`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/docs/lifecycle`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/docs/components`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
	];

	// Canonical Component Studio pages
	const componentRoutes: MetadataRoute.Sitemap = ALL_COMPONENTS.map((comp) => ({
		url: `${BASE_URL}/docs/components/${comp.slug}`,
		lastModified: now,
		changeFrequency: 'weekly',
		priority: 0.85,
	}));

	// Blog Technical Articles
	const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
		url: `${BASE_URL}/blog/${post.slug}`,
		lastModified: now,
		changeFrequency: 'monthly',
		priority: 0.75,
	}));

	return [...staticRoutes, ...componentRoutes, ...blogRoutes];
}
