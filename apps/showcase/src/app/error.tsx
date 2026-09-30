'use client';

import React from 'react';
import Link from 'next/link';
import { IconAlertTriangle as AlertTriangle, IconRefresh as Refresh, IconHome as Home, IconBook2 as BookOpen } from '@tabler/icons-react';

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	React.useEffect(() => {
		// Log exception to local telemetry or monitoring
		// eslint-disable-next-line no-console
		console.error('[Exhuma Runtime Error]:', error);
	}, [error]);

	return (
		<div className='container mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24'>
			{/* System Alert Eyebrow */}
			<div className='border-border bg-destructive/10 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs font-semibold'>
				<AlertTriangle className='h-3.5 w-3.5 shrink-0' />
				<span>ERR_RUNTIME // UNHANDLED_EXCEPTION</span>
			</div>

			{/* Main Typography */}
			<h1 className='font-display text-foreground mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl'>Kinetic Runtime Disrupted</h1>
			<p className='text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed sm:text-base'>An unexpected execution halt occurred while rendering this view. The compositor state has been captured safely.</p>

			{/* Error Digest Block */}
			<div className='border-border bg-muted/50 mt-6 w-full max-w-md rounded-xl border p-4 text-left font-mono text-xs'>
				<div className='text-muted-foreground text-3xs flex items-center justify-between tracking-wider uppercase'>
					<span>Diagnostic Digest</span>
					<span>{error.digest ? `ID: ${error.digest}` : 'LOCAL_DEV'}</span>
				</div>
				<div className='text-foreground mt-2 font-medium wrap-break-word'>{error.message || 'An unknown runtime fault occurred.'}</div>
			</div>

			{/* Actions */}
			<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
				<button
					type='button'
					onClick={() => reset()}
					className='border-border bg-foreground text-background hover:bg-foreground/90 inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-opacity'
				>
					<Refresh className='h-3.5 w-3.5' />
					<span>Retry Execution</span>
				</button>

				<Link href='/' className='border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-colors'>
					<Home className='h-3.5 w-3.5' />
					<span>Return Home</span>
				</Link>

				<Link href='/docs' className='border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs transition-colors'>
					<BookOpen className='h-3.5 w-3.5' />
					<span>Documentation</span>
				</Link>
			</div>
		</div>
	);
}
