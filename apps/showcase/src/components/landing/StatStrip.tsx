'use client';

import * as React from 'react';
import { NumberTicker } from '@exhuma/core';
import { Reveal } from '@/components/motion/Reveal';

interface Stat {
	value: number;
	suffix?: string;
	label: string;
	note: string;
}

export function StatStrip({ stats }: { stats: Stat[] }) {
	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
			{stats.map((stat, idx) => {
				return (
					<Reveal key={stat.label} delay={idx * 80}>
						<div className='border-border/80 bg-card/60 hover:border-foreground/30 group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
							{/* Precision corner crosshair indicators */}
							<div className='text-foreground/20 pointer-events-none absolute top-2 left-2 font-mono text-[9px] select-none'>+</div>
							<div className='text-foreground/20 pointer-events-none absolute top-2 right-2 font-mono text-[9px] select-none'>+</div>

							{/* Hairline top highlight */}
							<div className='via-foreground/25 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

							<div className='text-foreground font-mono text-4xl font-black tracking-tight sm:text-5xl'>
								<NumberTicker value={stat.value} suffix={stat.suffix ?? ''} />
							</div>
							<div className='mt-3'>
								<div className='text-foreground text-sm font-bold tracking-tight'>{stat.label}</div>
								<div className='text-muted-foreground text-2xs mt-0.5 font-mono'>{stat.note}</div>
							</div>
						</div>
					</Reveal>
				);
			})}
		</div>
	);
}

export default StatStrip;
