'use client';

import * as React from 'react';

export function ReadingProgressBar() {
	const [progress, setProgress] = React.useState(0);

	React.useEffect(() => {
		const handleScroll = () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (totalHeight <= 0) return;
			const current = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
			setProgress(current * 100);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className='pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-transparent'>
			<div className='bg-foreground h-full transition-[width] duration-75 ease-out' style={{ width: `${progress}%` }} />
		</div>
	);
}
