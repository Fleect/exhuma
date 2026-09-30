import React from 'react';
import type { FooterProps } from '../types';

export const Footer: React.FC<FooterProps> = ({ brand, links = [], copyright, className = '', style }) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={`exhuma-footer border-t border-zinc-900 bg-zinc-950 py-12 text-zinc-400 ${className}`} style={style}>
			<div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8'>
				{brand ? <div>{brand}</div> : <div className='text-sm font-semibold text-zinc-300'>Exhuma</div>}
				{links.length > 0 && (
					<div className='flex flex-wrap items-center gap-6 text-sm'>
						{links.map((link, idx) => (
							<a key={idx} href={link.href} className='transition-colors hover:text-white'>
								{link.label}
							</a>
						))}
					</div>
				)}
				<div className='text-xs text-zinc-500'>{copyright || `© ${currentYear} Exhuma. All rights reserved.`}</div>
			</div>
		</footer>
	);
};
