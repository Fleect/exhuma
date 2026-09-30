import React from 'react';
import type { DashboardLayoutProps } from '../types';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar, header, breadcrumbs, className = '', style }) => {
	return (
		<div className={`exhuma-dashboard-layout flex min-h-screen bg-zinc-950 text-zinc-100 ${className}`} style={style}>
			{sidebar && <aside className='hidden w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-900/30 md:block'>{sidebar}</aside>}
			<div className='flex flex-1 flex-col overflow-hidden'>
				{header}
				{breadcrumbs && <div className='border-b border-zinc-900 px-6 py-3 text-xs text-zinc-400'>{breadcrumbs}</div>}
				<main className='flex-1 overflow-y-auto p-6 lg:p-8'>{children}</main>
			</div>
		</div>
	);
};
