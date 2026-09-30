import React from 'react';
import type { LandingLayoutProps } from '../types';

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children, header, footer, className = '', style }) => {
	return (
		<div className={`exhuma-landing-layout flex min-h-screen flex-col bg-zinc-950 text-zinc-100 ${className}`} style={style}>
			{header}
			<main className='flex-1'>{children}</main>
			{footer}
		</div>
	);
};
