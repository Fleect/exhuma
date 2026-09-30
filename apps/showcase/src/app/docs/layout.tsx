import React from 'react';
import type { Metadata } from 'next';
import { DocsSidebar } from '@/components/layout/DocsSidebar';
import { DocsMobileNav } from '@/components/docs/DocsMobileNav';

export const metadata: Metadata = {
	title: {
		template: '%s — Exhuma Docs',
		default: 'Exhuma Docs',
	},
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='container-fluid anchor-offset min-h-screen'>
			<DocsMobileNav />
			<div className='flex flex-col gap-8 pt-6 lg:flex-row lg:pt-0'>
				<DocsSidebar />
				{/* A div, not <main>: the root layout already provides the page's one <main>. */}
				<div className='min-w-0 flex-1 pt-2 pb-16 lg:pt-6'>{children}</div>
			</div>
		</div>
	);
}
