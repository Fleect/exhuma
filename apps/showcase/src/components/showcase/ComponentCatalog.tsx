'use client';

import * as React from 'react';
import { ALL_COMPONENTS, CATEGORIES as REGISTRY_CATEGORIES } from '@/registry';
import { ComponentCard } from './ComponentCard';
import { cn } from '@/lib/utils';

const CATEGORY_DISPLAY_LABELS: Record<string, string> = {
	cards: 'Cards & Depth',
	layouts: 'Layout Engines',
	primitives: 'Kinetic Primitives',
	navigation: 'Navigation',
};

const CATEGORIES = [
	{ id: 'all', label: 'All Components' },
	...REGISTRY_CATEGORIES.map((cat) => ({
		id: cat.id,
		label: CATEGORY_DISPLAY_LABELS[cat.id] ?? cat.label,
	})),
];

export function ComponentCatalog() {
	const [activeCategory, setActiveCategory] = React.useState<string>('all');

	const filteredComponents = React.useMemo(() => {
		return ALL_COMPONENTS.filter((comp) => {
			return activeCategory === 'all' || comp.category === activeCategory;
		});
	}, [activeCategory]);

	return (
		<div className='space-y-4 sm:space-y-6'>
			{/* Category Pill Tabs */}
			<div className='no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1'>
				{CATEGORIES.map((cat) => {
					const isSelected = activeCategory === cat.id;
					const count = cat.id === 'all' ? ALL_COMPONENTS.length : ALL_COMPONENTS.filter((c) => c.category === cat.id).length;

					if (count === 0) return null;

					return (
						<button
							key={cat.id}
							type='button'
							onClick={() => setActiveCategory(cat.id)}
							className={cn(
								'flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
								isSelected ? 'bg-foreground text-background shadow-xs' : 'border-border/80 bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 border'
							)}
						>
							<span className='whitespace-nowrap'>{cat.label}</span>
							<span className={cn('text-3xs rounded-full px-2 py-0.5 font-mono font-bold', isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground')}>{count}</span>
						</button>
					);
				})}
			</div>

			{/* Component Grid */}
			<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{filteredComponents.map((component) => (
					<ComponentCard key={component.slug} slug={component.slug} name={component.name} category={component.category} description={component.description} className='h-full' />
				))}
			</div>
		</div>
	);
}

export default ComponentCatalog;
