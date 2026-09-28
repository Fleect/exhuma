import * as React from 'react';
import { ExpandableCard } from '@exhuma/cards';
import { ComponentPreviewProps } from '../types';

export default function ExpandableCardPreview(props: ComponentPreviewProps) {
	const propValues = props;
	const duration = Number(propValues.duration ?? 360);
	return (
		<div className='mx-auto w-full max-w-sm py-4'>
			<ExpandableCard
				duration={duration}
				cardContent={
					<div className='border-border/80 bg-card hover:border-foreground/40 rounded-2xl border p-6 shadow-lg transition-all'>
						<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>CLICK TO EXPAND</span>
						<h4 className='text-foreground mt-2 text-lg font-bold'>FLIP Morphing Architecture</h4>
						<p className='text-muted-foreground mt-1 text-xs'>Mathematical geometry snapshot with zero Framer Motion.</p>
					</div>
				}
				expandedContent={
					<div className='space-y-4'>
						<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold uppercase'>MODAL DIALOG (FLIP INVERTED)</span>
						<h3 className='text-foreground text-2xl font-black'>Hardware-Accelerated Dialog</h3>
						<p className='text-muted-foreground text-sm leading-relaxed'>
							The card morphs smoothly from its trigger bounding rect into a centered dialog snapshot using analytical FLIP transformation matrices.
						</p>
						<div className='border-border/60 bg-background text-muted-foreground rounded-xl border p-4 font-mono text-xs'>Press ESC or click backdrop to close</div>
					</div>
				}
			/>
		</div>
	);
}
