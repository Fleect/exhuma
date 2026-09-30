import React from 'react';
import type { AuthLayoutProps } from '../types';

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, heroContent, brand, split = false, className = '', style }) => {
	if (split) {
		return (
			<div className={`exhuma-auth-layout grid min-h-screen grid-cols-1 bg-zinc-950 text-zinc-100 lg:grid-cols-2 ${className}`} style={style}>
				<div className='flex flex-col justify-between border-r border-zinc-900 p-8 sm:p-12 lg:p-16'>
					{brand && <div>{brand}</div>}
					<div className='m-auto w-full max-w-md'>
						{title && <h1 className='text-3xl font-bold tracking-tight text-white'>{title}</h1>}
						{subtitle && <p className='mt-2 text-sm text-zinc-400'>{subtitle}</p>}
						<div className='mt-8'>{children}</div>
					</div>
					<div className='text-xs text-zinc-600'>Exhuma Secure Authentication</div>
				</div>
				<div className='relative hidden flex-col items-center justify-center overflow-hidden bg-zinc-900/50 p-12 lg:flex'>
					<div className='pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl' />
					<div className='relative z-10 max-w-md text-center'>
						{heroContent || (
							<div>
								<h2 className='text-2xl font-bold text-white'>Unearth the depths</h2>
								<p className='mt-3 text-sm text-zinc-400'>Autonomous tactile components, micro-interactions, and architecture for modern React.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`exhuma-auth-layout flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 lg:px-8 ${className}`} style={style}>
			<div className='w-full max-w-md space-y-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-xl'>
				{brand && <div className='flex justify-center'>{brand}</div>}
				<div className='text-center'>
					{title && <h2 className='text-2xl font-bold tracking-tight text-white'>{title}</h2>}
					{subtitle && <p className='mt-2 text-sm text-zinc-400'>{subtitle}</p>}
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};
