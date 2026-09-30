'use client';

import React from 'react';
import { DocsNavList } from '@/components/docs/DocsNavList';

/** Desktop docs rail. On phones the same nav lives in DocsMobileNav's drawer instead. */
export function DocsSidebar() {
	return (
		<aside aria-label='Docs navigation' className='no-scrollbar lg:top-header lg:h-below-header hidden lg:sticky lg:-mx-1 lg:block lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:py-6'>
			<DocsNavList />
		</aside>
	);
}

export default DocsSidebar;
