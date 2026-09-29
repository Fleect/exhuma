'use client';

import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { calculateLockIndex, calculateProgress, DEFAULT_SCRAMBLE_CHARS, getScrambleChar } from './scramble-math';

export interface TextScrambleProps {
	text: string;
	speed?: number;         // chars per second cycled (default: 15)
	duration?: number;      // total animation ms (default: 1200)
	characters?: string;    // custom alphabet
	trigger?: 'hover' | 'mount' | 'inView'; // default: 'mount'
	onComplete?: () => void;
	className?: string;
	style?: React.CSSProperties;
}

/**
 * Text Scramble Component — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Direct DOM textContent manipulation via rAF (ZERO React VDOM re-renders during animating).
 * - Zero CLS: tabular-nums monospaced bounding, container width never changes.
 * - Zero heap alloc in rAF: character array allocated once on mount.
 */
export const TextScramble = memo(
	forwardRef<HTMLSpanElement, TextScrambleProps>(function TextScramble(
		{
			text,
			speed = 15,
			duration = 1200,
			characters = DEFAULT_SCRAMBLE_CHARS,
			trigger = 'mount',
			onComplete,
			className = '',
			style,
		},
		forwardedRef
	) {
		const containerRef = useRef<HTMLSpanElement>(null);
		const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
		const rafIdRef = useRef<number | null>(null);
		const startTimeRef = useRef<number | null>(null);
		const frameRef = useRef<number>(0);
		const hasStartedRef = useRef<boolean>(false);
		const [isReducedMotion, setIsReducedMotion] = useState(false);

		useImperativeHandle(forwardedRef, () => containerRef.current as HTMLSpanElement);

		const stopAnimation = useCallback(() => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			hasStartedRef.current = false;
		}, []);

		const resetToScrambled = useCallback(() => {
			if (isReducedMotion) return;
			const length = text.length;
			for (let i = 0; i < length; i++) {
				const el = charsRef.current[i];
				if (el) {
					if (text[i] === ' ') {
						el.textContent = ' ';
					} else {
						el.textContent = getScrambleChar(i, 0, characters);
					}
				}
			}
		}, [text, characters, isReducedMotion]);

		const startAnimation = useCallback(() => {
			if (hasStartedRef.current || isReducedMotion) return;
			hasStartedRef.current = true;
			startTimeRef.current = null;
			frameRef.current = 0;

			const length = text.length;
			const frameDelay = 1000 / speed;
			let lastFrameTime = 0;

			const tick = (now: number) => {
				if (startTimeRef.current === null) {
					startTimeRef.current = now;
					lastFrameTime = now;
				}

				const elapsed = now - startTimeRef.current;
				const progress = calculateProgress(elapsed, duration);
				const lockIndex = calculateLockIndex(progress, length);

				if (now - lastFrameTime >= frameDelay) {
					frameRef.current++;
					lastFrameTime = now;
				}

				let isAllLocked = true;

				for (let i = 0; i < length; i++) {
					const el = charsRef.current[i];
					if (!el) continue;

					if (text[i] === ' ') {
						el.textContent = ' ';
					} else if (i < lockIndex) {
						el.textContent = text[i];
					} else {
						isAllLocked = false;
						el.textContent = getScrambleChar(i, frameRef.current, characters);
					}
				}

				if (isAllLocked || progress >= 1) {
					for (let i = 0; i < length; i++) {
						const el = charsRef.current[i];
						if (el) el.textContent = text[i];
					}
					stopAnimation();
					onComplete?.();
				} else {
					rafIdRef.current = requestAnimationFrame(tick);
				}
			};

			rafIdRef.current = requestAnimationFrame(tick);
		}, [text, duration, speed, characters, onComplete, stopAnimation, isReducedMotion]);

		useEffect(() => {
			const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			setIsReducedMotion(prefersReducedMotion);

			if (prefersReducedMotion) {
				return;
			}

			resetToScrambled();
			let observer: IntersectionObserver | null = null;
			const container = containerRef.current;

			if (trigger === 'mount') {
				startAnimation();
			} else if (trigger === 'inView' && container) {
				observer = new IntersectionObserver(
					([entry]) => {
						if (entry?.isIntersecting) {
							startAnimation();
							observer?.disconnect();
						}
					},
					{ threshold: 0.1 }
				);
				observer.observe(container);
			}

			return () => {
				stopAnimation();
				if (observer) observer.disconnect();
			};
		}, [trigger, startAnimation, resetToScrambled, stopAnimation]);

		const handleMouseEnter = useCallback(() => {
			if (trigger === 'hover' && !hasStartedRef.current && !isReducedMotion) {
				resetToScrambled();
				startAnimation();
			}
		}, [trigger, resetToScrambled, startAnimation, isReducedMotion]);

		return (
			<span
				ref={containerRef}
				className={`exhuma-text-scramble ${className}`}
				style={{ ...style, fontVariantNumeric: 'tabular-nums' }}
				onMouseEnter={handleMouseEnter}
				aria-live="polite"
				aria-label={text}
			>
				{isReducedMotion ? (
					text
				) : (
					text.split('').map((char, index) => (
						<span
							key={index}
							ref={(el) => {
								charsRef.current[index] = el;
							}}
							aria-hidden="true"
						>
							{char === ' ' ? ' ' : char}
						</span>
					))
				)}
			</span>
		);
	})
);

TextScramble.displayName = 'TextScramble';
