import React from 'react';
import { NumberTicker } from '@exhuma/core';
import { ComponentPreviewProps } from '../types';

export function NumberTickerPreview(props: ComponentPreviewProps & { tickerResetKey?: number }) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const { tickerResetKey } = props;

	const value = Number(propValues.value ?? 1000);
	const initialValue = Number(propValues.initialValue ?? 0);
	const duration = Number(propValues.duration ?? 1.5);
	const decimalPlaces = Number(propValues.decimalPlaces ?? 0);
	const prefix = String(propValues.prefix ?? '');
	const suffix = String(propValues.suffix ?? '');

	return (
		<div className='border-border/80 bg-card/95 relative mx-auto flex max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border p-4 text-center shadow-xl backdrop-blur-md sm:p-6 md:p-8'>
			<div className='mb-3 flex w-full items-center justify-between'>
				<span className='kbd border-border/70 bg-background/80 text-primary text-3xs font-mono font-bold tracking-wider uppercase'>ANALYTICAL EASING (rAF)</span>
			</div>

			<div className='text-foreground my-2 font-mono text-4xl font-black tracking-tight sm:text-5xl md:text-6xl'>
				<NumberTicker
					key={`${tickerResetKey}-${value}-${initialValue}-${duration}-${decimalPlaces}-${prefix}-${suffix}`}
					value={value}
					initialValue={initialValue}
					duration={duration}
					decimalPlaces={decimalPlaces}
					prefix={prefix}
					suffix={suffix}
					triggerOnScroll={false}
				/>
			</div>

			<p className='text-muted-foreground mt-3 font-mono text-xs leading-relaxed'>Closed-form easeOutExpo with direct DOM manipulation and zero VDOM re-rendering.</p>

			<div className='border-border/60 text-muted-foreground text-3xs mt-4 flex w-full items-center justify-between border-t pt-3 font-mono'>
				<div className='flex items-center gap-1.5'>
					<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
					<span>120 FPS DIRECT DOM</span>
				</div>
				<span className='text-foreground/80 font-medium'>{duration}s • 1-2^(-10t)</span>
			</div>
		</div>
	);
}
