import * as React from 'react';
import {
	ClickEffectMode,
	calculateShockwave,
	calculateRipple,
	initSparks,
	stepSparks,
	calculateElasticScale,
} from './click-effects-math';

export interface ClickEffectsProps extends React.HTMLAttributes<HTMLDivElement> {
	mode?: ClickEffectMode;
	color?: string;
	duration?: number;
	sparkCount?: number;
	disabled?: boolean;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

type ActiveEffect = {
	id: number;
	startTime: number;
	x: number;
	y: number;
	mode: ClickEffectMode;
	sparks?: Float32Array;
};

export const ClickEffects = React.forwardRef<HTMLDivElement, ClickEffectsProps>(
	(
		{
			mode = 'shockwave',
			color = '#6366f1',
			duration = 600,
			sparkCount = 12,
			disabled = false,
			children,
			className = '',
			style,
			...props
		},
		ref
	) => {
		const containerRef = React.useRef<HTMLDivElement>(null);
		const canvasRef = React.useRef<HTMLCanvasElement>(null);
		const activeEffects = React.useRef<ActiveEffect[]>([]);
		const rafRef = React.useRef<number>(0);
		const nextId = React.useRef<number>(0);
		// Ω(1) cached canvas dimensions — updated ONLY by ResizeObserver, never in rAF loop
		const canvasSizeRef = React.useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
		const lastFrameTimeRef = React.useRef<number>(0);

		React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

		React.useEffect(() => {
			const canvas = canvasRef.current;
			const container = containerRef.current;
			if (!canvas || !container) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// ResizeObserver updates buffer dimensions — never called inside rAF
			const resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const { width, height } = entry.contentRect;
					const dpr = window.devicePixelRatio || 1;
					canvas.width = width * dpr;
					canvas.height = height * dpr;
					canvasSizeRef.current = { w: width, h: height, dpr };
				}
			});
			resizeObserver.observe(container);

			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			// rAF loop — ZERO DOM reads, uses cached canvasSizeRef only
			const loop = (time: number) => {
				const dt = lastFrameTimeRef.current > 0 ? (time - lastFrameTimeRef.current) / 1000 : 0.016;
				lastFrameTimeRef.current = time;

				const { w, h, dpr } = canvasSizeRef.current;
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				ctx.clearRect(0, 0, w, h);

				const maxRadius = Math.max(w, h) * 1.5;
				let alive = false;

				for (let i = activeEffects.current.length - 1; i >= 0; i--) {
					const effect = activeEffects.current[i];
					const elapsed = time - effect.startTime;

					if (elapsed > duration) {
						activeEffects.current.splice(i, 1);
						continue;
					}

					alive = true;
					ctx.save();

					if (effect.mode === 'shockwave') {
						const { radius, alpha } = calculateShockwave(elapsed / duration, maxRadius, 5, 1);
						ctx.beginPath();
						ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
						ctx.strokeStyle = color;
						ctx.globalAlpha = Math.max(0, alpha);
						ctx.lineWidth = 4;
						ctx.stroke();
					} else if (effect.mode === 'ripple') {
						const { radius, alpha } = calculateRipple(elapsed, maxRadius, duration);
						ctx.beginPath();
						ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
						ctx.fillStyle = color;
						ctx.globalAlpha = Math.max(0, alpha * 0.4);
						ctx.fill();
					} else if (effect.mode === 'sparks' && effect.sparks) {
						// Advance Float32Array buffer in-place — zero GC allocation
						stepSparks(effect.sparks, dt, 400);

						const count = effect.sparks.length / 5;
						ctx.fillStyle = color;
						for (let s = 0; s < count; s++) {
							const alpha = effect.sparks[s * 5 + 4];
							if (alpha <= 0) continue;
							ctx.globalAlpha = alpha;
							ctx.beginPath();
							ctx.arc(effect.sparks[s * 5 + 0], effect.sparks[s * 5 + 1], 3, 0, Math.PI * 2);
							ctx.fill();
						}
					} else if (effect.mode === 'elastic') {
						// Elastic: no canvas drawing, handled below via container transform
					}

					ctx.restore(); // Always restore — matches every ctx.save()
				}

				// Elastic scale applies to the container transform (GPU compositor only)
				if (containerRef.current) {
					const elasticEffect = activeEffects.current.find((e) => e.mode === 'elastic');
					if (elasticEffect) {
						const scale = calculateElasticScale(time - elasticEffect.startTime, duration);
						containerRef.current.style.transform = `scale(${scale})`;
					} else if (activeEffects.current.length === 0) {
						containerRef.current.style.transform = '';
					}
				}

				if (alive) {
					rafRef.current = requestAnimationFrame(loop);
				} else {
					rafRef.current = 0;
					lastFrameTimeRef.current = 0;
				}
			};

			const startLoop = () => {
				if (!rafRef.current) {
					lastFrameTimeRef.current = 0;
					rafRef.current = requestAnimationFrame(loop);
				}
			};

			const handleClick = (e: MouseEvent) => {
				if (disabled || prefersReducedMotion) return;

				// getBoundingClientRect ONLY on user event (not in rAF loop) — Ω(1) guard
				const targetRect = containerRef.current?.getBoundingClientRect();
				if (!targetRect) return;

				const x = e.clientX - targetRect.left;
				const y = e.clientY - targetRect.top;

				let sparks: Float32Array | undefined;
				if (mode === 'sparks') {
					// Allocated ONCE per click, advanced in-place in the rAF loop
					sparks = initSparks(sparkCount, x, y, 300);
				}

				activeEffects.current.push({
					id: nextId.current++,
					startTime: performance.now(),
					x,
					y,
					mode,
					sparks,
				});

				startLoop();
			};

			const el = containerRef.current;
			if (el) el.addEventListener('click', handleClick);

			return () => {
				resizeObserver.disconnect();
				if (el) el.removeEventListener('click', handleClick);
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		}, [mode, color, duration, sparkCount, disabled]);

		return (
			<div
				ref={containerRef}
				className={className}
				style={{ ...style, position: 'relative' }}
				{...props}
			>
				{children}
				<canvas
					ref={canvasRef}
					aria-hidden="true"
					style={{
						position: 'absolute',
						inset: 0,
						pointerEvents: 'none',
						width: '100%',
						height: '100%',
						zIndex: 10,
					}}
				/>
			</div>
		);
	}
);

ClickEffects.displayName = 'ClickEffects';
