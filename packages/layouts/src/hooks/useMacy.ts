import { type RefObject, useEffect, useRef } from 'react';

export interface UseMacyOptions {
	margin?: number;
	columns?: number;
	breakAt?: Record<number, number>;
	waitForImages?: boolean;
	[key: string]: unknown;
}

export function useMacy(containerRef: RefObject<HTMLElement | null>, childCount: number, options: UseMacyOptions = {}) {
	const instanceRef = useRef<unknown>(null);

	useEffect(() => {
		if (typeof window === 'undefined' || !containerRef.current) return;

		let isMounted = true;

		// Dynamically import macy if available in browser
		import('macy')
			.then((MacyModule) => {
				if (!isMounted || !containerRef.current) return;
				const Macy = MacyModule.default || MacyModule;
				instanceRef.current = Macy({
					container: containerRef.current,
					margin: options.margin ?? 20,
					columns: options.columns ?? 3,
					breakAt: options.breakAt ?? { 1024: 3, 768: 2, 480: 1 },
					waitForImages: options.waitForImages ?? true,
					...options,
				});
			})
			.catch(() => {
				// Fallback if macy is not installed directly
			});

		return () => {
			isMounted = false;
		};
	}, [containerRef, options]);

	useEffect(() => {
		if (instanceRef.current && typeof (instanceRef.current as { reInit?: () => void }).reInit === 'function') {
			(instanceRef.current as { reInit: () => void }).reInit();
		}
	}, [childCount]);

	return { macy: instanceRef.current };
}
