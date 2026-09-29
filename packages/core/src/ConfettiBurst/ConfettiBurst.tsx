import * as React from 'react';
import {
	CONFETTI_PARTICLE_STRIDE,
	initConfettiBuffer,
	stepConfettiBuffer,
	isConfettiBurstComplete,
} from './confetti-math';

export interface ConfettiBurstProps {
	particleCount?: number;
	spread?: number;
	colors?: string[];
	gravity?: number;
	trigger?: boolean;
	origin?: { x: number; y: number };
	onComplete?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

const DEFAULT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#06b6d4'];

export const ConfettiBurst = React.forwardRef<HTMLDivElement, ConfettiBurstProps>(
	(
		{
			particleCount = 80,
			spread = 160,
			colors = DEFAULT_COLORS,
			gravity = 800,
			trigger = false,
			origin = { x: 0.5, y: 0.5 },
			onComplete,
			className = '',
			style,
			...props
		},
		ref
	) => {
		const containerRef = React.useRef<HTMLDivElement>(null);
		const canvasRef = React.useRef<HTMLCanvasElement>(null);
		const rafRef = React.useRef<number>(0);
		const bufferRef = React.useRef<Float32Array | null>(null);
		const canvasSizeRef = React.useRef<{ w: number; h: number; dpr: number }>({ w: 0, h: 0, dpr: 1 });
		const lastFrameTimeRef = React.useRef<number>(0);

		React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

		React.useEffect(() => {
			const container = containerRef.current;
			const canvas = canvasRef.current;
			if (!container || !canvas) return;

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

			return () => resizeObserver.disconnect();
		}, []);

		React.useEffect(() => {
			if (!trigger) return;

			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (prefersReducedMotion) {
				onComplete?.();
				return;
			}

			const { w, h } = canvasSizeRef.current;

			const originX = w * origin.x;
			const originY = h * origin.y;

			bufferRef.current = initConfettiBuffer(particleCount, originX, originY, spread, 300, 800);
			lastFrameTimeRef.current = performance.now();

			const loop = (time: number) => {
				const dt = (time - lastFrameTimeRef.current) / 1000;
				lastFrameTimeRef.current = time;

				const buffer = bufferRef.current;
				if (!buffer || isConfettiBurstComplete(buffer)) {
					ctx.clearRect(0, 0, canvasSizeRef.current.w * canvasSizeRef.current.dpr, canvasSizeRef.current.h * canvasSizeRef.current.dpr);
					rafRef.current = 0;
					onComplete?.();
					return;
				}

				stepConfettiBuffer(buffer, dt, gravity, 0.015);

				const { w: width, h: height, dpr } = canvasSizeRef.current;
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				ctx.clearRect(0, 0, width, height);

				for (let i = 0; i < particleCount; i++) {
					const offset = i * CONFETTI_PARTICLE_STRIDE;
					const alpha = buffer[offset + 6];
					if (alpha <= 0) continue;

					ctx.save();
					ctx.translate(buffer[offset + 0], buffer[offset + 1]);
					ctx.rotate(buffer[offset + 4]);

					ctx.fillStyle = colors[i % colors.length];
					ctx.globalAlpha = alpha;

					ctx.fillRect(-4, -4, 8, 8);
					ctx.restore();
				}

				rafRef.current = requestAnimationFrame(loop);
			};

			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(loop);

			return () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		}, [trigger, particleCount, spread, gravity, origin.x, origin.y, colors, onComplete]);

		return (
			<div
				ref={containerRef}
				className={className}
				style={{ ...style, position: 'relative' }}
				{...props}
			>
				{trigger && (
					<span className="sr-only" aria-live="polite">
						Celebration!
					</span>
				)}
				<canvas
					ref={canvasRef}
					aria-hidden="true"
					style={{
						position: 'absolute',
						inset: 0,
						pointerEvents: 'none',
						width: '100%',
						height: '100%',
						zIndex: 50,
					}}
				/>
			</div>
		);
	}
);

ConfettiBurst.displayName = 'ConfettiBurst';
