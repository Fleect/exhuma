'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Stagger offset in ms, for revealing siblings in sequence. */
	delay?: number;
	/** Fraction of the element that must be visible before revealing. */
	threshold?: number;
}

/**
 * Scroll-triggered fade-up reveal.
 *
 * Deliberately hand-rolled on IntersectionObserver rather than pulling in an
 * animation library — "zero runtime animation dependencies" is one of the
 * product's stated guarantees, so the marketing site shouldn't violate it.
 * Honours prefers-reduced-motion by rendering straight to the resting state.
 */
export function Reveal({ children, className, delay = 0, threshold = 0.15, ...props }: RevealProps) {
	const ref = React.useRef<HTMLDivElement>(null);
	const [shown, setShown] = React.useState(false);

	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			setShown(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setShown(true);
						observer.disconnect();
					}
				}
			},
			{ threshold: 0.05, rootMargin: '50px 0px 50px 0px' }
		);

		observer.observe(el);

		// Fallback in case IntersectionObserver fails to trigger on mobile/virtual viewports
		const timer = setTimeout(() => {
			setShown(true);
		}, 1500);

		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
	}, [threshold]);

	return (
		<div
			ref={ref}
			className={cn('transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none', shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0', className)}
			style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
			{...props}
		>
			{children}
		</div>
	);
}

export default Reveal;
