'use client';

import React, { useRef, useEffect, useCallback, memo, type ButtonHTMLAttributes } from 'react';
import { calculateMagneticPull } from './magnetic-math';
import { damp } from '../physics/lerp';

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	strength?: number;
	radius?: number;
	springDamping?: number;
	maxDisplacement?: number;
	asChild?: boolean;
}

/**
 * MagneticButton — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Handcrafted inverted spring pull field (ZERO Framer Motion).
 * - 120Hz rAF continuous transform writes directly to element style.
 * - Zero React state updates / zero VDOM re-renders during cursor tracking.
 * - Critically damped spring return on pointer leave.
 * - Invariant origin reference frame subtraction (eliminating negative feedback damping).
 */
export const MagneticButton = memo(
	React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
		(
			{
				children,
				strength = 0.35,
				radius = 120,
				springDamping = 18,
				maxDisplacement = 36,
				className = '',
				style,
				type = 'button',
				asChild,
				onPointerMove,
				onPointerLeave,
				...props
			},
			forwardedRef
		) => {
			const buttonRef = useRef<HTMLButtonElement>(null);
			React.useImperativeHandle(forwardedRef, () => buttonRef.current as HTMLButtonElement);

			const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
			const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
			const isHoveredRef = useRef<boolean>(false);
			const rafIdRef = useRef<number | null>(null);
			const lastTimeRef = useRef<number>(0);

			const updateLoop = useCallback(
				(timestamp: number) => {
					if (!lastTimeRef.current) lastTimeRef.current = timestamp;
					const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
					lastTimeRef.current = timestamp;

					const current = currentRef.current;
					const target = targetRef.current;

					// Damp current coordinates toward target
					current.x = damp(current.x, target.x, springDamping, dt);
					current.y = damp(current.y, target.y, springDamping, dt);

					if (buttonRef.current) {
						buttonRef.current.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
					}

					// Keep running if moving or hovered
					const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
					if (isHoveredRef.current || distToTarget > 0.1) {
						rafIdRef.current = requestAnimationFrame(updateLoop);
					} else {
						current.x = 0;
						current.y = 0;
						if (buttonRef.current) {
							buttonRef.current.style.transform = 'translate3d(0, 0, 0)';
						}
						rafIdRef.current = null;
						lastTimeRef.current = 0;
					}
				},
				[springDamping]
			);

			const startRafIfNeeded = useCallback(() => {
				if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					return;
				}
				if (!rafIdRef.current) {
					lastTimeRef.current = 0;
					rafIdRef.current = requestAnimationFrame(updateLoop);
				}
			}, [updateLoop]);

			const handlePointerMove = useCallback(
				(e: React.PointerEvent<HTMLButtonElement>) => {
					onPointerMove?.(e);
					if (e.defaultPrevented) return;

					const el = buttonRef.current;
					if (!el) return;

					if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
						return;
					}

					// Invariant reference frame: subtract active transform offset to find unshifted center
					const rect = el.getBoundingClientRect();
					const baseCenterX = rect.left - currentRef.current.x + rect.width / 2;
					const baseCenterY = rect.top - currentRef.current.y + rect.height / 2;

					const result = calculateMagneticPull(
						e.clientX,
						e.clientY,
						baseCenterX,
						baseCenterY,
						radius,
						strength,
						maxDisplacement
					);

					targetRef.current.x = result.x;
					targetRef.current.y = result.y;
					isHoveredRef.current = true;
					startRafIfNeeded();
				},
				[radius, strength, maxDisplacement, onPointerMove, startRafIfNeeded]
			);

			const handlePointerLeave = useCallback(
				(e: React.PointerEvent<HTMLButtonElement>) => {
					onPointerLeave?.(e);
					isHoveredRef.current = false;
					targetRef.current.x = 0;
					targetRef.current.y = 0;
					startRafIfNeeded();
				},
				[onPointerLeave, startRafIfNeeded]
			);

			useEffect(() => {
				return () => {
					if (rafIdRef.current) {
						cancelAnimationFrame(rafIdRef.current);
						rafIdRef.current = null;
					}
				};
			}, []);

			return (
				<button
					ref={buttonRef}
					type={type}
					onPointerMove={handlePointerMove}
					onPointerLeave={handlePointerLeave}
					className={className}
					style={{
						willChange: 'transform',
						...style,
					}}
					{...props}
				>
					{children}
				</button>
			);
		}
	)
);

MagneticButton.displayName = 'MagneticButton';

