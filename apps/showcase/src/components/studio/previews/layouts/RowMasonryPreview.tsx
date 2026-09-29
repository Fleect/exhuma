import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { RowMasonry } from '@exhuma/layouts';

const DEMO_CARDS = [
	{ h: 120, bg: '#6366f1' },
	{ h: 200, bg: '#f43f5e' },
	{ h: 150, bg: '#10b981' },
	{ h: 180, bg: '#f59e0b' },
	{ h: 140, bg: '#06b6d4' },
	{ h: 220, bg: '#8b5cf6' },
	{ h: 160, bg: '#ec4899' },
	{ h: 130, bg: '#14b8a6' },
];

export default function RowMasonryPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="w-full h-full p-8 overflow-y-auto bg-zinc-950 rounded-xl">
			<RowMasonry
				columns={props.columns as number}
				gap={props.gap as number}
				animateTransitions={props.animateTransitions as boolean}
			>
				{DEMO_CARDS.map((card, i) => (
					<div
						key={i}
						style={{ height: card.h, backgroundColor: card.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					>
						<span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{i + 1}</span>
					</div>
				))}
			</RowMasonry>
		</div>
	);
}
