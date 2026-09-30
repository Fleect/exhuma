'use client';

import * as React from 'react';
import { NumberTicker } from '@exhuma/core';
import { DocsSpecCard } from './DocsSpecCard';

interface DocsInvariantCardProps {
	tag: string;
	title: string;
	/** Counts up from zero when scrolled into view. */
	value: number;
	prefix?: string;
	suffix?: string;
	children: React.ReactNode;
}

/**
 * A spec card whose figure runs on Exhuma's own NumberTicker. Client-only
 * because @exhuma/core's built barrel uses hooks without a "use client" directive.
 */
export function DocsInvariantCard({ tag, title, value, prefix, suffix, children }: DocsInvariantCardProps) {
	return (
		<DocsSpecCard tag={tag} title={title} value={<NumberTicker value={value} prefix={prefix} suffix={suffix} />}>
			{children}
		</DocsSpecCard>
	);
}

export default DocsInvariantCard;
