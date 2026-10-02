'use client';

import React, { useRef, useEffect, useCallback, memo, type ButtonHTMLAttributes } from 'react';
import { calculateMagneticPull, calculateMultiLayerDetachment, calculateShockwaveProgress, calculateShockwaveOrigin } from './magnetic-math';
import { damp } from '../physics/lerp';

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	dualTier?: boolean;
	shockwave?: boolean;
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
				dualTier = false,
				shockwave = false,
				onPointerMove,
				onPointerLeave,
				onPointerDown,
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
			const contentRef = useRef<HTMLSpanElement>(null);
			const shockwaveRef = useRef<HTMLSpanElement>(null);
			const targetContentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
			const currentContentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
			const shockwaveStartRef = useRef<number>(0);
			const shockwaveOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
			const shockwaveMaxRadiusRef = useRef<number>(56);

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
					if (dualTier) {
						const cCur = currentContentRef.current;
						const cTar = targetContentRef.current;
						cCur.x = damp(cCur.x, cTar.x, springDamping, dt);
						cCur.y = damp(cCur.y, cTar.y, springDamping, dt);
						if (contentRef.current) {
							contentRef.current.style.transform = `translate3d(${cCur.x.toFixed(2)}px, ${cCur.y.toFixed(2)}px, 0)`;
						}
					}
					if (shockwave && shockwaveStartRef.current > 0) {
						const elapsed = timestamp - shockwaveStartRef.current;
						const { radius, opacity } = calculateShockwaveProgress(elapsed, shockwaveMaxRadiusRef.current);
						if (shockwaveRef.current) {
							const ox = shockwaveOriginRef.current.x;
							const oy = shockwaveOriginRef.current.y;
							shockwaveRef.current.style.width = `${radius * 2}px`;
							shockwaveRef.current.style.height = `${radius * 2}px`;
							shockwaveRef.current.style.opacity = `${opacity}`;
							shockwaveRef.current.style.transform = `translate3d(${ox}px, ${oy}px, 0) translate(-50%, -50%)`;
						}
						if (opacity <= 0 || elapsed >= 350) {
							shockwaveStartRef.current = 0;
							if (shockwaveRef.current) {
								shockwaveRef.current.style.opacity = '0';
							}
						}
					}

					// Keep running if moving, hovered, or shockwave active
					const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);
					const isShockwaveActive = shockwave && shockwaveStartRef.current > 0;
					if (isHoveredRef.current || distToTarget > 0.1 || isShockwaveActive) {
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
				[springDamping, dualTier, shockwave]
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

					if (dualTier) {
						const result = calculateMultiLayerDetachment(e.clientX, e.clientY, baseCenterX, baseCenterY, radius, 0.25, 0.65);
						targetRef.current.x = result.housing.x;
						targetRef.current.y = result.housing.y;
						targetContentRef.current.x = result.content.x;
						targetContentRef.current.y = result.content.y;
					} else {
						const result = calculateMagneticPull(e.clientX, e.clientY, baseCenterX, baseCenterY, radius, strength, maxDisplacement);
						targetRef.current.x = result.x;
						targetRef.current.y = result.y;
					}
					isHoveredRef.current = true;
					startRafIfNeeded();
				},
				[radius, strength, maxDisplacement, onPointerMove, startRafIfNeeded, dualTier]
			);

			const handlePointerDown = useCallback(
				(e: React.PointerEvent<HTMLButtonElement>) => {
					onPointerDown?.(e);
					if (shockwave && buttonRef.current) {
						const el = buttonRef.current;
						const rect = el.getBoundingClientRect();
						const scaleX = el.offsetWidth > 0 ? rect.width / el.offsetWidth : 1;
						const scaleY = el.offsetHeight > 0 ? rect.height / el.offsetHeight : 1;
						const origin = calculateShockwaveOrigin(e.clientX, e.clientY, rect.left, rect.top, el.offsetWidth, el.offsetHeight, 56, scaleX, scaleY);
						shockwaveOriginRef.current = { x: origin.x, y: origin.y };
						shockwaveMaxRadiusRef.current = origin.maxRadius;
						shockwaveStartRef.current = performance.now();

						if (shockwaveRef.current) {
							shockwaveRef.current.style.width = '0px';
							shockwaveRef.current.style.height = '0px';
							shockwaveRef.current.style.opacity = '0.8';
							shockwaveRef.current.style.transform = `translate3d(${origin.x}px, ${origin.y}px, 0) translate(-50%, -50%)`;
						}
						startRafIfNeeded();
					}
				},
				[shockwave, startRafIfNeeded, onPointerDown]
			);

			const handlePointerLeave = useCallback(
				(e: React.PointerEvent<HTMLButtonElement>) => {
					onPointerLeave?.(e);
					isHoveredRef.current = false;
					targetRef.current.x = 0;
					targetRef.current.y = 0;
					if (dualTier) {
						targetContentRef.current.x = 0;
						targetContentRef.current.y = 0;
					}
					startRafIfNeeded();
				},
				[onPointerLeave, startRafIfNeeded, dualTier]
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
					onPointerDown={handlePointerDown}
					className={className}
					style={{
						position: 'relative',
						...(shockwave ? { overflow: 'hidden' } : {}),
						willChange: 'transform',
						...style,
					}}
					{...props}
				>
					{shockwave && (
						<span
							ref={shockwaveRef}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: 0,
								height: 0,
								borderRadius: '50%',
								background: 'currentColor',
								pointerEvents: 'none',
								opacity: 0,
								transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
								willChange: 'width, height, opacity, transform',
							}}
						/>
					)}
					{dualTier ? (
						<span ref={contentRef} style={{ display: 'inline-flex', willChange: 'transform' }}>
							{children}
						</span>
					) : (
						children
					)}
				</button>
			);
		}
	)
);

MagneticButton.displayName = 'MagneticButton';
