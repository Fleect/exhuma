'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Docs pages have a sticky sidebar that fills the space below the header. A
 * sticky element can't leave its parent row, so a full-width footer after that
 * row pushes the sidebar up under the header as it scrolls in. Docs routes end
 * at their prev/next links instead, as shadcn's docs do.
 *
 * The footer is passed in as children so it stays a server component.
 */
export function FooterVisibility({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDocsRoute = pathname === '/docs' || pathname.startsWith('/docs/');

	return isDocsRoute ? null : <>{children}</>;
}

export default FooterVisibility;
