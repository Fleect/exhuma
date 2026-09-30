import React from 'react';
import type { HeaderProps } from '../types';

export const Header: React.FC<HeaderProps> = ({ brand, navItems = [], actions, className = '', style }) => {
	return (
		<header className={`exhuma-header sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md ${className}`} style={style}>
			<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center gap-8'>
					{brand && <div className='text-lg font-bold text-zinc-100'>{brand}</div>}
					<nav className='hidden items-center gap-6 md:flex'>
						{navItems.map((item, idx) => (
							<a key={idx} href={item.href} className={`text-sm font-medium transition-colors hover:text-white ${item.active ? 'text-white' : 'text-zinc-400'}`}>
								{item.label}
								{item.badge && <span className='ml-1.5 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300'>{item.badge}</span>}
							</a>
						))}
					</nav>
				</div>
				{actions && <div className='flex items-center gap-3'>{actions}</div>}
			</div>
		</header>
	);
};
