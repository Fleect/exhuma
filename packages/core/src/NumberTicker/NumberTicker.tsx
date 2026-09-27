'use client';

import React, { useRef, useEffect, useCallback, memo, forwardRef, useImperativeHandle } from 'react';
import { calculateTickerValue } from './ticker-math';

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
	value: number;
	initialValue?: number;
	duration?: number;
	decimalPlaces?: number;
	prefix?: string;
	suffix?: string;
	triggerOnScroll?: boolean;
}

/**
 * NumberTicker — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Direct DOM textContent manipulation via rAF (ZERO React VDOM re-renders during counting).
 * - Closed-form analytical easeOutExpo function (ZERO external motion libraries).
 * - Unconditional lifecycle teardown (ZERO rAF leaks on unmount).
 * - WCAG Accessible: aria-hidden animated glyphs paired with sr-only target readout.
 * - Battery-friendly IntersectionObserver trigger.
 */
export const NumberTicker = memo(
	forwardRef<HTMLSpanElement, NumberTickerProps>(function NumberTicker(
		{
			value,
			initialValue = 0,
			duration = 1.5,
			decimalPlaces = 0,
			prefix = '',
			suffix = '',
			triggerOnScroll = true,
			className = '',
			style,
			...props
		},
		forwardedRef
	) {
		const containerRef = useRef<HTMLSpanElement>(null);
		const tickerRef = useRef<HTMLSpanElement>(null);
		const rafIdRef = useRef<number | null>(null);
		const startTimeRef = useRef<number | null>(null);
		const hasStartedRef = useRef<boolean>(false);

		useImperativeHandle(forwardedRef, () => containerRef.current as HTMLSpanElement);

		const safeDecimals = Math.max(0, Math.min(20, Math.floor(decimalPlaces ?? 0)));

		const formatNumber = useCallback(
			(val: number): string => {
				const formatted = val.toLocaleString(undefined, {
					minimumFractionDigits: safeDecimals,
					maximumFractionDigits: safeDecimals,
				});
				return `${prefix}${formatted}${suffix}`;
			},
			[safeDecimals, prefix, suffix]
		);

		const startTicker = useCallback(() => {
			if (hasStartedRef.current) return;
			hasStartedRef.current = true;
			startTimeRef.current = null;

			const tick = (now: number) => {
				if (startTimeRef.current === null) {
					startTimeRef.current = now;
				}

				const elapsed = (now - startTimeRef.current) / 1000;
				const { value: currentVal, isComplete } = calculateTickerValue(initialValue, value, elapsed, duration);

				if (tickerRef.current) {
					tickerRef.current.textContent = formatNumber(currentVal);
				}

				if (!isComplete) {
					rafIdRef.current = requestAnimationFrame(tick);
				} else {
					rafIdRef.current = null;
				}
			};

			rafIdRef.current = requestAnimationFrame(tick);
		}, [initialValue, value, duration, formatNumber]);

		useEffect(() => {
			const el = tickerRef.current;
			if (!el) return;

			hasStartedRef.current = false;
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}

			// Honor prefers-reduced-motion: reduce
			const prefersReducedMotion =
				typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			if (prefersReducedMotion) {
				el.textContent = formatNumber(value);
				return;
			}

			// Initial display
			el.textContent = formatNumber(initialValue);

			let observer: IntersectionObserver | null = null;

			if (!triggerOnScroll) {
				startTicker();
			} else {
				observer = new IntersectionObserver(
					([entry]) => {
						if (entry?.isIntersecting) {
							startTicker();
							observer?.disconnect();
						}
					},
					{ threshold: 0.1 }
				);

				if (containerRef.current) {
					observer.observe(containerRef.current);
				}
			}

			// Unconditional teardown (fixes unmount rAF leak when triggerOnScroll is false)
			return () => {
				if (observer) {
					observer.disconnect();
				}
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
					rafIdRef.current = null;
				}
			};
		}, [triggerOnScroll, startTicker, formatNumber, initialValue, value]);

		return (
			<span
				ref={containerRef}
				className={`exhuma-number-ticker font-mono tracking-tight tabular-nums ${className}`}
				style={style}
				{...props}
			>
				<span ref={tickerRef} aria-hidden="true">
					{formatNumber(initialValue)}
				</span>
				<span className="sr-only">{formatNumber(value)}</span>
			</span>
		);
	})
);

NumberTicker.displayName = 'NumberTicker';
