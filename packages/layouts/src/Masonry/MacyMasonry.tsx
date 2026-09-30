import React, { Children, useEffect, useRef, useState } from 'react';
import type { MacyMasonryProps } from '../types';

export const MacyMasonry: React.FC<MacyMasonryProps> = ({ children, columns = 3, margin = 20, breakAt = { 1024: 3, 768: 2, 480: 1 }, className = '', style }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeCols, setActiveCols] = useState(columns);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const updateCols = () => {
			const width = window.innerWidth;
			const breakpoints = Object.keys(breakAt)
				.map(Number)
				.sort((a, b) => b - a);

			let matched = columns;
			for (const bp of breakpoints) {
				if (width <= bp) {
					matched = breakAt[bp] || columns;
				}
			}
			setActiveCols(matched);
		};

		updateCols();
		window.addEventListener('resize', updateCols);
		return () => window.removeEventListener('resize', updateCols);
	}, [columns, breakAt]);

	const childArray = Children.toArray(children);

	// Distribute items into columns round-robin / balanced
	const columnBuckets: React.ReactNode[][] = Array.from({ length: activeCols }, () => []);

	childArray.forEach((child, index) => {
		columnBuckets[index % activeCols].push(child);
	});

	return (
		<div
			ref={containerRef}
			className={`exhuma-macy-masonry flex w-full ${className}`}
			style={{
				gap: `${margin}px`,
				...style,
			}}
		>
			{columnBuckets.map((bucket, colIdx) => (
				<div key={colIdx} className='flex flex-1 flex-col' style={{ gap: `${margin}px` }}>
					{bucket.map((item, itemIdx) => (
						<div key={itemIdx} className='w-full'>
							{item}
						</div>
					))}
				</div>
			))}
		</div>
	);
};
