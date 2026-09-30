'use client';

import { useRef, useCallback, useEffect } from 'react';
import { GestureState, GestureEvent, VelocityRingBuffer, checkGestureSlop, SlopConfig, VelocityVector } from './fsm';

export interface GestureTrackerOptions {
	primaryAxis?: 'x' | 'y';
	slopConfig?: SlopConfig;
	onGestureStart?: (x: number, y: number) => void;
	onGestureMove?: (dx: number, dy: number, state: GestureState) => void;
	onGestureRelease?: (velocity: VelocityVector) => void;
	onGestureCancel?: () => void;
}

/**
 * Exhuma Kinetic Methodology (EKM) — Universal Gesture Tracker Hook
 *
 * Implements the 5-State Gesture FSM with Big-Omega (Ω) guarantees:
 * - Constant-time state transitions
 * - Zero GC allocations during active drag (pre-allocated VelocityRingBuffer)
 * - Trajectory slop filtering to prevent mobile vertical scroll hijacking
 */
export function useGestureTracker(options: GestureTrackerOptions = {}) {
	const stateRef = useRef<GestureState>('IDLE');
	const startX = useRef<number>(0);
	const startY = useRef<number>(0);
	const ringBuffer = useRef<VelocityRingBuffer>(new VelocityRingBuffer());

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			stateRef.current = 'TRACKING';
			startX.current = e.clientX;
			startY.current = e.clientY;

			ringBuffer.current.clear();
			ringBuffer.current.push(e.clientX, e.clientY, performance.now());

			options.onGestureStart?.(e.clientX, e.clientY);
		},
		[options]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			if (stateRef.current === 'IDLE') return;

			const now = performance.now();
			const dx = e.clientX - startX.current;
			const dy = e.clientY - startY.current;

			ringBuffer.current.push(e.clientX, e.clientY, now);

			if (stateRef.current === 'TRACKING') {
				const slop = checkGestureSlop(dx, dy, options.primaryAxis ?? 'x', options.slopConfig);
				if (slop.isClaimed) {
					stateRef.current = 'CLAIMED';
					// Claim pointer capture if element supports it
					try {
						e.currentTarget.setPointerCapture(e.pointerId);
					} catch {
						// Ignored if capture unsupported
					}
				} else if (slop.isRejected) {
					stateRef.current = 'IDLE';
					options.onGestureCancel?.();
					return;
				}
			}

			if (stateRef.current === 'CLAIMED') {
				options.onGestureMove?.(dx, dy, stateRef.current);
			}
		},
		[options]
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent<HTMLElement>) => {
			if (stateRef.current === 'CLAIMED') {
				try {
					e.currentTarget.releasePointerCapture(e.pointerId);
				} catch {
					// Ignored
				}
				stateRef.current = 'DECELERATING';
				const velocity = ringBuffer.current.computeVelocity();
				options.onGestureRelease?.(velocity);
			}

			stateRef.current = 'IDLE';
			ringBuffer.current.clear();
		},
		[options]
	);

	const handlePointerCancel = useCallback(() => {
		stateRef.current = 'IDLE';
		ringBuffer.current.clear();
		options.onGestureCancel?.();
	}, [options]);

	return {
		pointerHandlers: {
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			onPointerCancel: handlePointerCancel,
		},
		getState: () => stateRef.current,
	};
}
