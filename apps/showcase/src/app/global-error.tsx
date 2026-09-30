'use client';

import React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang='en'>
			<body className='flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center text-neutral-100 antialiased'>
				<div className='max-w-md space-y-6'>
					<div className='inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1 font-mono text-xs font-semibold text-neutral-400'>CRITICAL_LAYOUT_FAULT</div>
					<h1 className='text-3xl font-extrabold tracking-tight text-white'>Root Application Disruption</h1>
					<p className='text-sm leading-relaxed text-neutral-400'>A fatal exception disrupted the root document layout. Compositor state was preserved.</p>
					{error.digest && <div className='rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 font-mono text-xs text-neutral-500'>Digest: {error.digest}</div>}
					<div>
						<button
							type='button'
							onClick={() => reset()}
							className='inline-flex cursor-pointer items-center justify-center rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-neutral-950 transition-opacity hover:opacity-90'
						>
							Reload Application
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
