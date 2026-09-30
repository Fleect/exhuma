'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { projectSphericalPoint, DEFAULT_SPHERE_CHARS, type ProjectedPoint } from './sphere-math';

export interface AnimatedSphereProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
	color?: string;
	speed?: number;
	radiusScale?: number;
	phiStep?: number;
	thetaStep?: number;
	charSet?: string;
	interactive?: boolean;
}

/**
 * AnimatedSphere — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev
 *
 * Big-Omega (Ω) Guarantees:
 * - Handcrafted 3D spherical trigonometry & Euler rotation matrices on 2D HTML5 Canvas.
 * - Zero Three.js / WebGL dependencies.
 * - Auto-pausing IntersectionObserver lifecycle to eliminate battery drain when offscreen.
 * - Retina DPR-aware rendering with sub-pixel text rasterization.
 */
export const AnimatedSphere = memo<AnimatedSphereProps>(
	({ color = '#6366f1', speed = 1.0, radiusScale = 0.475, phiStep = 0.15, thetaStep = 0.15, charSet = DEFAULT_SPHERE_CHARS, interactive = true, className = '', style, ...props }) => {
		const canvasRef = useRef<HTMLCanvasElement>(null);
		const mouseTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

		useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			let time = 0;
			let frameId = 0;
			let visible = false;

			const resize = () => {
				const dpr = window.devicePixelRatio || 1;
				const rect = canvas.getBoundingClientRect();
				if (rect.width === 0 || rect.height === 0) return;
				canvas.width = rect.width * dpr;
				canvas.height = rect.height * dpr;
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			};

			resize();
			window.addEventListener('resize', resize, { passive: true });

			const render = () => {
				if (!visible) {
					frameId = 0;
					return;
				}

				const rect = canvas.getBoundingClientRect();
				if (rect.width === 0 || rect.height === 0) {
					frameId = requestAnimationFrame(render);
					return;
				}

				ctx.clearRect(0, 0, rect.width, rect.height);

				const centerX = rect.width / 2;
				const centerY = rect.height / 2;
				const radius = Math.min(rect.width, rect.height) * radiusScale;

				ctx.font = `8px monospace, serif`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				const rotY = time * 0.3 * speed + mouseTiltRef.current.x * 0.5;
				const rotX = time * 0.2 * speed + mouseTiltRef.current.y * 0.5;

				const points: ProjectedPoint[] = [];

				for (let phi = 0; phi < Math.PI * 2; phi += phiStep) {
					const phiOffset = phi + time * 0.5 * speed;
					for (let theta = 0; theta < Math.PI; theta += thetaStep) {
						const pt = projectSphericalPoint(theta, phiOffset, rotX, rotY, radius, centerX, centerY, charSet);
						points.push(pt);
					}
				}

				// Depth sort: painter's algorithm (back to front)
				points.sort((a, b) => a.z - b.z);

				for (const point of points) {
					const alpha = (0.15 + point.depth * 0.85).toFixed(3);
					ctx.fillStyle = color.startsWith('#')
						? `${color}${Math.floor(Number(alpha) * 255)
								.toString(16)
								.padStart(2, '0')}`
						: color;
					ctx.fillText(point.char, point.x, point.y);
				}

				time += 0.02;
				frameId = requestAnimationFrame(render);
			};

			// Battery saver: Pause rAF while canvas is off-screen
			const observer = new IntersectionObserver(
				([entry]) => {
					const wasVisible = visible;
					visible = entry?.isIntersecting ?? false;
					if (visible && !wasVisible && !frameId) {
						frameId = requestAnimationFrame(render);
					}
				},
				{ rootMargin: '100px' }
			);

			observer.observe(canvas);

			return () => {
				window.removeEventListener('resize', resize);
				observer.disconnect();
				if (frameId) cancelAnimationFrame(frameId);
			};
		}, [color, speed, radiusScale, phiStep, thetaStep, charSet]);

		const handlePointerMove = useCallback(
			(e: React.PointerEvent<HTMLCanvasElement>) => {
				if (!interactive) return;
				const canvas = canvasRef.current;
				if (!canvas) return;
				const rect = canvas.getBoundingClientRect();
				const nx = (e.clientX - rect.left) / rect.width - 0.5;
				const ny = (e.clientY - rect.top) / rect.height - 0.5;
				mouseTiltRef.current = { x: nx * 2, y: ny * 2 };
			},
			[interactive]
		);

		const handlePointerLeave = useCallback(() => {
			mouseTiltRef.current = { x: 0, y: 0 };
		}, []);

		return (
			<canvas
				ref={canvasRef}
				aria-hidden='true'
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className={`exhuma-animated-sphere block size-full cursor-grab active:cursor-grabbing ${className}`}
				style={style}
				{...props}
			/>
		);
	}
);

AnimatedSphere.displayName = 'AnimatedSphere';
