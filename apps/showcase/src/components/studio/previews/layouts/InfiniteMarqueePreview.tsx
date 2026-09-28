import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { InfiniteMarquee } from '@exhuma/layouts';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function InfiniteMarqueePreview(props: ComponentPreviewProps) {
	const propValues = props;

	const speed = Number(propValues.speed ?? 40);
	const direction = (propValues.direction as 'left' | 'right') ?? 'left';
	const pauseOnHover = Boolean(propValues.pauseOnHover ?? true);
	const gap = Number(propValues.gap ?? 24);
	const showFadeEdges = Boolean(propValues.showFadeEdges ?? true);
	const fadeWidth = Number(propValues.fadeWidth ?? 48);
	const fadeEdgeColor = String(propValues.fadeEdgeColor || '#ffffff');
	const fadeEdgeColorDark = String(propValues.fadeEdgeColorDark || '#09090b');

	return (
		<div className='w-full overflow-hidden py-6'>
			<InfiniteMarquee
				speed={speed}
				direction={direction}
				pauseOnHover={pauseOnHover}
				gap={gap}
				showFadeEdges={showFadeEdges}
				fadeWidth={fadeWidth}
				fadeEdgeColor={fadeEdgeColor}
				fadeEdgeColorDark={fadeEdgeColorDark}
			>
				{[
					{ label: '120Hz ProMotion', tag: 'Kinetic', status: 'Active' },
					{ label: 'Zero Runtime Deps', tag: 'Pure', status: 'Locked' },
					{ label: 'Modulo Wrap Seam', tag: 'Math', status: 'C0/C1' },
					{ label: `${ECOSYSTEM_COUNT} Targets`, tag: 'Universal', status: '13/13' },
					{ label: 'Sub-pixel Translation', tag: 'EKM', status: 'Hardware' },
				].map((item, idx) => (
					<div
						key={idx}
						className='border-border/80 bg-card/90 hover:border-foreground/40 flex items-center gap-3 rounded-2xl border px-5 py-3 text-xs font-semibold shadow-xs backdrop-blur-md transition-all hover:scale-[1.02]'
					>
						<span className='bg-primary/80 ring-primary/20 h-2 w-2 rounded-full ring-2' />
						<span className='text-foreground font-mono font-medium'>{item.label}</span>
						<span className='bg-secondary text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px]'>{item.tag}</span>
						<span className='text-primary/80 font-mono text-[10px] font-bold'>{item.status}</span>
					</div>
				))}
			</InfiniteMarquee>
		</div>
	);
}
