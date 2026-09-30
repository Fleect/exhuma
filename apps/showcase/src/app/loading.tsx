import React from 'react';

export default function RootLoading() {
	return (
		<div className='container mx-auto min-h-[calc(100vh-8rem)] max-w-5xl animate-pulse space-y-8 px-4 py-12'>
			{/* Header Skeleton */}
			<div className='space-y-4'>
				<div className='bg-muted/60 h-6 w-32 rounded-full' />
				<div className='bg-muted/80 h-10 w-2/3 max-w-md rounded-xl sm:h-12' />
				<div className='bg-muted/50 h-5 w-full max-w-xl rounded-lg' />
			</div>

			{/* Content Area Skeleton Wireframe */}
			<div className='border-border/60 bg-card/30 rounded-2xl border p-6 sm:p-8'>
				<div className='space-y-6'>
					<div className='bg-muted/70 h-40 w-full rounded-xl sm:h-64' />
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
						<div className='bg-muted/50 h-24 rounded-xl' />
						<div className='bg-muted/50 h-24 rounded-xl' />
						<div className='bg-muted/50 h-24 rounded-xl' />
					</div>
				</div>
			</div>
		</div>
	);
}
