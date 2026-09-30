'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseTiltOptions {
	maxTilt?: number;
	glare?: boolean;
	scale?: number;
	perspective?: number;
	speed?: number;
	disabled?: boolean;
}

export function useTilt<T extends HTMLElement = HTMLDivElement>(options: UseTiltOptions = {}) {
	const { maxTilt = 20, glare = true, scale = 1.04, perspective = 1000, speed = 300, disabled = false } = options;

	const elementRef = useRef<T>(null);
	const [transform, setTransform] = useState('');
	const [glareState, setGlareState] = useState({ opacity: 0, x: 50, y: 50 });
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		setReducedMotion(mediaQuery.matches);

		const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mediaQuery.addEventListener('change', listener);
		return () => mediaQuery.removeEventListener('change', listener);
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<T>) => {
			if (disabled || reducedMotion || !elementRef.current) return;

			const rect = elementRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateX = ((y - centerY) / centerY) * -maxTilt;
			const rotateY = ((x - centerX) / centerX) * maxTilt;

			setTransform(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);

			if (glare) {
				setGlareState({
					opacity: 0.4,
					x: (x / rect.width) * 100,
					y: (y / rect.height) * 100,
				});
			}
		},
		[disabled, reducedMotion, maxTilt, glare, scale, perspective]
	);

	const handleMouseLeave = useCallback(() => {
		if (disabled || reducedMotion) return;
		setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
		setGlareState({ opacity: 0, x: 50, y: 50 });
	}, [disabled, reducedMotion, perspective]);

	const containerStyle: React.CSSProperties = {
		transform: disabled || reducedMotion ? undefined : transform,
		transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
		transformStyle: 'preserve-3d',
	};

	const glareStyle: React.CSSProperties = {
		opacity: glareState.opacity,
		background: `radial-gradient(circle at ${glareState.x}% ${glareState.y}%, rgba(255,255,255,0.45) 0%, transparent 60%)`,
	};

	return {
		elementRef,
		containerProps: {
			ref: elementRef,
			onMouseMove: handleMouseMove,
			onMouseLeave: handleMouseLeave,
			style: containerStyle,
		},
		glareProps: {
			style: glareStyle,
		},
		transform,
		glareState,
		isReducedMotion: reducedMotion,
	};
}
