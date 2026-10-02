import * as React from 'react';
import { IconSparkles as Sparkles } from '@tabler/icons-react';
import { BorderBeam } from '@fleect/exhuma-cards';
import { ComponentPreviewProps } from '../types';

export default function BorderBeamPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;

	const rawSize = Number(propValues.size ?? 200);
	const rawDuration = Number(propValues.duration ?? 8);
	const rawBorderWidth = Number(propValues.borderWidth ?? 2);
	const colorFrom = String(propValues.colorFrom ?? '#ffaa40');
	const colorTo = String(propValues.colorTo ?? '#9c40ff');
	const doubleBeam = Boolean(propValues.doubleBeam ?? false);
	const rawEndOpacity = Number(propValues.endOpacity ?? 0);
	const rawOpacity = Number(propValues.opacity ?? 1);
	const rawBlur = Number(propValues.blur ?? 0);
	const rawBorderRadius = Number(propValues.borderRadius ?? 16);

	const size = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 200;
	const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 8;
	const borderWidth = Number.isFinite(rawBorderWidth) && rawBorderWidth >= 0 ? rawBorderWidth : 2;
	const borderRadius = Number.isFinite(rawBorderRadius) && rawBorderRadius >= 0 ? rawBorderRadius : 16;
	const endOpacity = Math.max(0, Math.min(1, Number.isFinite(rawEndOpacity) ? rawEndOpacity : 0));
	const opacity = Math.max(0, Math.min(1, Number.isFinite(rawOpacity) ? rawOpacity : 1));
	const blur = Math.max(0, Number.isFinite(rawBlur) ? rawBlur : 0);

	return (
		<div
			className='border-border/80 bg-card/95 relative mx-auto flex min-h-[220px] w-full max-w-md flex-col justify-between overflow-hidden border p-5 shadow-2xl backdrop-blur-xl sm:min-h-[240px] sm:p-6'
			style={{ borderRadius: `${borderRadius}px` }}
		>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-3'>
					<div className='flex size-9 items-center justify-center rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 text-amber-500 shadow-sm'>
						<Sparkles className='size-4' />
					</div>
					<div>
						<h4 className='text-foreground text-sm font-semibold tracking-tight'>Quantum Laser Perimeter</h4>
						<p className='text-muted-foreground text-xs'>Sub-pixel hardware composite</p>
					</div>
				</div>
				<span className='border-border/80 bg-muted/40 text-muted-foreground text-3xs inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-medium'>
					<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
					{doubleBeam ? 'DUAL BEAM // 120 FPS' : '120 FPS'}
				</span>
			</div>

			<div className='my-auto py-3'>
				<div className='text-muted-foreground text-3xs font-mono tracking-wider uppercase'>Kinetic Orbital Vector</div>
				<div className='text-foreground mt-1 flex items-baseline gap-2 text-xl font-semibold tracking-tight sm:text-2xl'>
					<span>
						{(360 / duration).toFixed(0)} <span className='text-muted-foreground font-mono text-xs font-normal'>deg/s</span>
					</span>
					<span className='font-mono text-xs font-medium text-emerald-500'>• {doubleBeam ? 'Dual Phase (180°)' : 'Single Phase'}</span>
				</div>
			</div>

			<div className='border-border/40 text-3xs text-muted-foreground flex items-center justify-between border-t pt-3 font-mono'>
				<div className='flex items-center gap-2'>
					<span>{borderWidth}px stroke</span>
					<span>•</span>
					<span>{duration}s cycle</span>
					<span>•</span>
					<span>{size}px arc</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorFrom }} title={`From: ${colorFrom}`} />
					<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorTo }} title={`To: ${colorTo}`} />
				</div>
			</div>

			<BorderBeam
				size={size}
				duration={duration}
				borderWidth={borderWidth}
				colorFrom={colorFrom}
				colorTo={colorTo}
				doubleBeam={doubleBeam}
				endOpacity={endOpacity}
				opacity={opacity}
				blur={blur}
				borderRadius={Number(propValues.borderRadius ?? 16)}
			/>
		</div>
	);
}
