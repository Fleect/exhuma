import * as React from 'react';
import { IconSparkles as Sparkles } from '@tabler/icons-react';
import { SpotlightCard } from '@exhuma/cards';
import { ComponentPreviewProps } from '../types';

export default function SpotlightCardPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const rawRadius = Number(propValues.radius ?? 350);
	const rawOpacity = Number(propValues.opacity ?? 0.85);
	const color = String(propValues.color ?? '#6366f1');
	const borderColor = String(propValues.borderColor ?? '#818cf8');
	const rawSpread = Number(propValues.spread ?? 60);
	const mode = (propValues.mode as 'both' | 'border' | 'background') ?? 'both';
	const rawSmoothing = Number(propValues.smoothing ?? 0.2);
	const disabled = Boolean(propValues.disabled ?? false);

	const radius = Number.isFinite(rawRadius) && rawRadius > 0 ? rawRadius : 350;
	const opacity = Math.max(0, Math.min(1, Number.isFinite(rawOpacity) ? rawOpacity : 0.85));
	const spread = Math.max(0, Math.min(100, Number.isFinite(rawSpread) ? rawSpread : 60));
	const smoothing = Math.max(0.05, Math.min(1, Number.isFinite(rawSmoothing) ? rawSmoothing : 0.2));

	return (
		<div className='flex items-center justify-center p-2 sm:p-6'>
			<SpotlightCard
				radius={radius}
				color={color}
				borderColor={borderColor}
				opacity={opacity}
				spread={spread}
				mode={mode}
				smoothing={smoothing}
				disabled={disabled}
				className='border-border/80 bg-card/95 w-full max-w-lg cursor-pointer p-6 shadow-2xl transition-colors sm:p-8'
			>
				<div className='flex flex-col gap-6'>
					{/* Top Header */}
					<div className='flex items-center justify-between'>
						<div className='border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs'>
							<Sparkles className='size-5' />
						</div>
						<span className='kbd border-border/80 bg-muted/40 text-muted-foreground text-3xs px-2.5 py-1 font-mono font-semibold tracking-wider uppercase'>Interactive Spotlight</span>
					</div>

					{/* Title & Description */}
					<div className='space-y-2'>
						<h4 className='text-foreground text-xl font-bold tracking-tight sm:text-2xl'>Radial Illumination</h4>
						<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Dynamic 2D coordinate tracking with specular border illumination and fluid inertial falloff.</p>
					</div>

					{/* Clean Bottom Meta */}
					<div className='border-border/60 text-muted-foreground mt-2 flex items-center justify-between border-t pt-4 font-mono text-xs'>
						<div className='flex items-center gap-2'>
							<span className='size-2 rounded-full bg-emerald-500' />
							<span className='text-3xs tracking-wide uppercase'>120 FPS Coalesced</span>
						</div>
						<span className='text-3xs text-foreground/80 font-semibold tracking-wide uppercase'>Mode: {mode}</span>
					</div>
				</div>
			</SpotlightCard>
		</div>
	);
}
