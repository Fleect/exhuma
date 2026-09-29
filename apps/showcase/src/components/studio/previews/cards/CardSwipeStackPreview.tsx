import * as React from 'react';
import { IconStack2 as Layers } from '@tabler/icons-react';
import { CardSwipeStack, type CardSwipeStackHandle } from '@exhuma/cards';
import { ComponentPreviewProps } from '../types';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export default function CardSwipeStackPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const [cardSwipeResetKey, setCardSwipeResetKey] = React.useState<number>(0);
	const stackRef = React.useRef<CardSwipeStackHandle>(null);

	const thresholdDistance = Number(propValues.thresholdDistance ?? 120);
	const maxRotation = Number(propValues.maxRotation ?? 20);
	const scaleStep = Number(propValues.scaleStep ?? 0.05);
	const offsetStep = Number(propValues.offsetStep ?? 14);
	const preventLastCardDismiss = propValues.preventLastCardDismiss !== false;
	const loop = Boolean(propValues.loop ?? false);

	return (
		<div className='relative max-h-[480px] w-full overflow-x-hidden overflow-y-auto scroll-smooth px-4 py-2'>
			{/* Stage 01: Card Swipe Stack Section */}
			<div className='flex flex-col items-center justify-center py-2'>
				<div className='mb-2 text-center'>
					<span className='kbd text-primary text-3xs font-mono'>STAGE 01 // SWIPE STACK</span>
					<h3 className='text-foreground mt-0.5 text-sm font-bold'>Kinetic Card Swipe Stack</h3>
					<p className='text-muted-foreground mt-0.5 font-mono text-xs'>
						{loop
							? 'Infinite Deck Recycling → swiped cards curve back under the stack'
							: preventLastCardDismiss
								? 'Drag to swipe cards → last card anchors with elastic resistance'
								: 'Drag to swipe all cards → scroll moves to Stage 02'}
					</p>
				</div>

				<CardSwipeStack
					ref={stackRef}
					key={cardSwipeResetKey}
					thresholdDistance={thresholdDistance}
					maxRotation={maxRotation}
					scaleStep={scaleStep}
					offsetStep={offsetStep}
					preventLastCardDismiss={preventLastCardDismiss}
					loop={loop}
					className='w-full max-w-sm'
					items={[
						{ id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
						{ id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: `Pure AST universal generation targeting ${ECOSYSTEM_COUNT} ecosystems.` },
						{ id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
					]}
					renderCard={(item) => (
						<div className='border-border/80 bg-card flex min-h-[190px] w-full flex-col justify-between rounded-2xl border p-5 shadow-2xl backdrop-blur-md'>
							<div>
								<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>{item.tag}</span>
								<h4 className='text-foreground mt-1 text-base font-bold'>{item.title}</h4>
								<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{item.desc}</p>
							</div>
							<div className='border-border/60 text-muted-foreground text-3xs mt-3 flex items-center justify-between border-t pt-2.5 font-mono'>
								<span>← SWIPE LEFT</span>
								<span>SWIPE RIGHT →</span>
							</div>
						</div>
					)}
					emptyState={
						<div className='border-border bg-card/80 flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-xl backdrop-blur-md'>
							<div className='bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-full'>
								<Layers className='size-4' />
							</div>
							<h4 className='text-foreground text-sm font-semibold'>Stack Completed</h4>
							<p className='text-muted-foreground mt-0.5 text-xs'>All cards have been swiped away.</p>
						</div>
					}
				/>

				{/* Programmatic Controls (Undo / Swipe Left / Swipe Right) */}
				<div className='mt-3 flex items-center justify-center gap-2.5'>
					<button
						type='button'
						onClick={() => stackRef.current?.undo()}
						className='border-border/70 bg-card hover:bg-muted/50 text-foreground flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs transition-colors'
					>
						<span>↺</span> Undo
					</button>
					<button
						type='button'
						onClick={() => stackRef.current?.swipe('left')}
						className='flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs text-rose-400 transition-colors hover:bg-rose-500/20'
					>
						<span>✕</span> Left
					</button>
					<button
						type='button'
						onClick={() => stackRef.current?.swipe('right')}
						className='flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400 transition-colors hover:bg-emerald-500/20'
					>
						<span>♥</span> Right
					</button>
				</div>

				<div className='text-muted-foreground/60 text-3xs mt-3 flex animate-bounce items-center gap-1.5 font-mono'>
					<span>SCROLL FOR NEXT SECTION</span>
					<span>↓</span>
				</div>
			</div>

			{/* Stage 02: Next Section Below Stack */}
			<div className='border-border/80 bg-card/70 mx-auto mt-4 max-w-md rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
				<div className='border-border/60 flex items-center justify-between border-b pb-3'>
					<div>
						<span className='kbd text-3xs font-mono text-emerald-400'>STAGE 02 // NEXT SECTION</span>
						<h4 className='text-foreground mt-1 text-sm font-bold'>Hardware Telemetry & Runtime Invariants</h4>
					</div>
					<span className='kbd text-3xs border-emerald-500/30 bg-emerald-500/10 font-mono text-emerald-400'>PASS-THROUGH ACTIVE</span>
				</div>
				<p className='text-muted-foreground mt-3 text-xs leading-relaxed'>You have scrolled past the card stack. Drag cards to dismiss them — scroll always moves here naturally.</p>
				<div className='mt-4 grid grid-cols-3 gap-2.5'>
					<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
						<span className='text-muted-foreground text-3xs font-mono'>FRAME FLOOR</span>
						<p className='text-foreground mt-1 text-sm font-bold'>120 FPS</p>
					</div>
					<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
						<span className='text-muted-foreground text-3xs font-mono'>GESTURE BUFFER</span>
						<p className='text-foreground mt-1 text-sm font-bold'>Float64Array</p>
					</div>
					<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
						<span className='text-muted-foreground text-3xs font-mono'>HEAP ALLOC</span>
						<p className='text-foreground mt-1 text-sm font-bold'>Ω(1) ZERO</p>
					</div>
				</div>
			</div>
		</div>
	);
}
