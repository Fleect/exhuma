import React from 'react';
import { MorphingTabs } from '@fleect/exhuma';
import { ComponentPreviewProps } from '../types';

export function MorphingTabsPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const springStiffness = typeof propValues.springStiffness === 'number' ? propValues.springStiffness : 26;
	const variant = (propValues.variant as 'pill' | 'underline' | 'glow') || 'pill';
	const size = (propValues.size as 'sm' | 'md' | 'lg') || 'md';
	const liquidStretch = Boolean(propValues.liquidStretch ?? false);

	return (
		<div className='mx-auto w-full max-w-lg p-4'>
			<MorphingTabs.Root defaultValue='dashboard' springStiffness={springStiffness} variant={variant} size={size} liquidStretch={liquidStretch}>
				<MorphingTabs.List className='w-full justify-between'>
					<MorphingTabs.Indicator springStiffness={springStiffness} variant={variant} />
					<MorphingTabs.Trigger value='dashboard' size={size} className='flex-1'>
						Dashboard
					</MorphingTabs.Trigger>
					<MorphingTabs.Trigger value='analytics' size={size} className='flex-1'>
						Analytics
					</MorphingTabs.Trigger>
					<MorphingTabs.Trigger value='settings' size={size} className='flex-1'>
						Settings
					</MorphingTabs.Trigger>
				</MorphingTabs.List>
				<MorphingTabs.Content value='dashboard' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
					<div className='text-foreground mb-1 font-bold'>Dashboard Metric Stream</div>
					<div className='text-muted-foreground text-xs'>Real-time system state with zero-jank floating indicator.</div>
				</MorphingTabs.Content>
				<MorphingTabs.Content value='analytics' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
					<div className='text-foreground mb-1 font-bold'>Kinetic Analytics Engine</div>
					<div className='text-muted-foreground text-xs'>Analytical spring differential equations driving indicator geometry.</div>
				</MorphingTabs.Content>
				<MorphingTabs.Content value='settings' className='border-border/80 bg-card rounded-xl border p-6 text-sm shadow-sm'>
					<div className='text-foreground mb-1 font-bold'>Global Configuration</div>
					<div className='text-muted-foreground text-xs'>WAI-ARIA roving keyboard navigation enabled.</div>
				</MorphingTabs.Content>
			</MorphingTabs.Root>
		</div>
	);
}
