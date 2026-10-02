'use client';

import * as React from 'react';
import { InfiniteMarquee } from '@fleect/exhuma';
import { ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';

/**
 * The "logo strip" equivalent for a framework-agnostic library: every target
 * ecosystem, scrolling. Uses Exhuma's own InfiniteMarquee rather than a
 * third-party ticker.
 */
export function EcosystemMarquee() {
	const flavors = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

	return (
		<div className='relative mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]'>
			<InfiniteMarquee speed={28} pauseOnHover gap='0.75rem' showFadeEdges={false}>
				{flavors.map((flavor) => (
					<div
						key={flavor}
						className='border-border/80 bg-card/60 hover:border-foreground/40 hover:text-foreground text-muted-foreground flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs font-medium whitespace-nowrap backdrop-blur-md transition-colors'
					>
						<span className='bg-foreground/50 h-1.5 w-1.5 shrink-0 rounded-full' />
						<span>{ECOSYSTEM_LABELS[flavor]}</span>
					</div>
				))}
			</InfiniteMarquee>
		</div>
	);
}

export default EcosystemMarquee;
