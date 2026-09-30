'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface UseHorizontalScrollOptions {
	speed?: number;
	snapToItem?: boolean;
	disabled?: boolean;
}

export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>(options: UseHorizontalScrollOptions = {}) {
	const { speed = 1.0, disabled = false } = options;
	const containerRef = useRef<T>(null);

	const handleWheel = useCallback(
		(e: WheelEvent) => {
			if (disabled || !containerRef.current) return;

			// If scrolling vertically, convert deltaY into horizontal scrollLeft
			if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
				e.preventDefault();
				containerRef.current.scrollLeft += e.deltaY * speed;
			}
		},
		[disabled, speed]
	);

	useEffect(() => {
		const node = containerRef.current;
		if (!node || disabled) return;

		// Attach passive: false to allow e.preventDefault()
		node.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			node.removeEventListener('wheel', handleWheel);
		};
	}, [handleWheel, disabled]);

	return {
		containerRef,
	};
}
