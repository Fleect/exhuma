import React from 'react';
import { MagneticButton } from '@exhuma/core';
import { IconSparkles as Sparkles } from '@tabler/icons-react';
import { ComponentPreviewProps } from '../types';

export function MagneticButtonPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const strength = Number(propValues.strength ?? 0.35);
	const radius = Number(propValues.radius ?? 120);
	const springDamping = Number(propValues.springDamping ?? 18);
	const maxDisplacement = Number(propValues.maxDisplacement ?? 36);
	const text = String(propValues.text ?? 'Magnetic Attraction');
	const dualTier = Boolean(propValues.dualTier ?? false);
	const shockwave = Boolean(propValues.shockwave ?? false);

	const fieldDiameter = Math.max(120, Math.min(300, radius * 2));

	return (
		<div className='border-border/80 bg-card/90 relative mx-auto flex w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-3xl border p-4 text-center shadow-2xl backdrop-blur-xl sm:p-8 md:p-10'>
			<div className='mb-4 flex w-full flex-wrap items-center justify-between gap-2 text-left'>
				<span className='kbd border-border/70 bg-background/80 text-foreground text-3xs font-mono font-bold tracking-wider uppercase'>
					<span className='hidden sm:inline'>MAGNETIC </span>GAUSSIAN FIELD
				</span>
				<span className='border-border/80 bg-background/90 text-foreground text-3xs inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-semibold shadow-xs'>
					<span className='bg-foreground h-1.5 w-1.5 animate-pulse rounded-full' />
					<span className='hidden sm:inline'>120 FPS </span>COMPOSITOR
				</span>
			</div>

			<p className='text-muted-foreground mb-4 max-w-xs text-xs leading-relaxed sm:max-w-sm'>Move cursor inside the field rings to engage the physics attractor with invariant reference frame coordinates.</p>

			{/* Magnetic Field Visualization Stage */}
			<div className='relative flex h-56 w-full items-center justify-center overflow-hidden sm:h-68'>
				{/* Magnetic attraction radius visualization rings */}
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div
						style={{ width: `${fieldDiameter}px`, height: `${fieldDiameter}px` }}
						className='border-foreground/15 absolute max-h-[85%] max-w-[85%] animate-[spin_60s_linear_infinite] rounded-full border border-dashed sm:max-h-none sm:max-w-none'
					/>
					<div
						style={{ width: `${fieldDiameter * 0.75}px`, height: `${fieldDiameter * 0.75}px` }}
						className='border-foreground/15 absolute max-h-[65%] max-w-[65%] rounded-full border border-dotted sm:max-h-none sm:max-w-none'
					/>
					<div
						style={{ width: `${fieldDiameter * 0.5}px`, height: `${fieldDiameter * 0.5}px` }}
						className='border-foreground/10 absolute max-h-[45%] max-w-[45%] rounded-full border sm:max-h-none sm:max-w-none'
					/>
				</div>

				{/* Ambient attraction halo */}
				<div className='bg-foreground/5 pointer-events-none absolute -inset-6 rounded-full blur-2xl' />

				{/* High-Contrast Tactile Magnetic Button */}
				<MagneticButton
					strength={strength}
					radius={radius}
					springDamping={springDamping}
					maxDisplacement={maxDisplacement}
					dualTier={dualTier}
					shockwave={shockwave}
					className='group bg-foreground text-background relative z-10 cursor-pointer rounded-2xl px-6 py-3.5 text-xs font-black shadow-2xl transition-transform will-change-transform select-none hover:scale-105 active:scale-95 sm:px-8 sm:py-4 sm:text-sm'
				>
					<span className='flex items-center gap-2 sm:gap-2.5'>
						<Sparkles className='h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-12 sm:h-4 sm:w-4' />
						<span className='truncate'>{text}</span>
					</span>
				</MagneticButton>
			</div>

			<div className='border-border/60 text-muted-foreground text-3xs mt-4 flex w-full flex-wrap items-center justify-between gap-2 border-t pt-4 font-mono'>
				<div className='flex flex-wrap items-center gap-2'>
					<span>R: {radius}px</span>
					<span>•</span>
					<span>K: {strength}</span>
					<span>•</span>
					<span>Clamp: ±{maxDisplacement}px</span>
				</div>
				<span className='text-foreground/80 font-medium'>Spring: λ={springDamping}</span>
			</div>
		</div>
	);
}
