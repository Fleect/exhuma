import * as React from 'react';
import { calculateShimmerAngle, calculatePressScale, buildConicGradient } from './shimmer-button-math';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	shimmerColor?: string;
	shimmerSize?: number;
	shimmerSpeed?: number;
	backgroundColor?: string;
	borderRadius?: string;
	borderWidth?: number;
	tactilePress?: boolean;
	children?: React.ReactNode;
	className?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
	(
		{
			shimmerColor = '#ffffff',
			shimmerSize = 20,
			shimmerSpeed = 30,
			backgroundColor = '#000000',
			borderRadius = '8px',
			borderWidth = 1,
			tactilePress = true,
			children,
			className = '',
			style,
			...props
		},
		ref
	) => {
		const internalRef = React.useRef<HTMLButtonElement>(null);
		const rafRef = React.useRef<number>(0);
		const startMsRef = React.useRef<number>(0);
		const isPressedRef = React.useRef<boolean>(false);

		// Expose ref
		React.useImperativeHandle(ref, () => internalRef.current as HTMLButtonElement);

		React.useEffect(() => {
			const button = internalRef.current;
			if (!button) return;

			const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
			if (mql.matches) {
				// Static gradient
				const staticGrad = buildConicGradient(0, shimmerColor, 'transparent', shimmerSize);
				button.style.setProperty('--shimmer-bg', staticGrad);
				return;
			}

			startMsRef.current = performance.now();

			const loop = (time: number) => {
				const elapsed = time - startMsRef.current;
				const angle = calculateShimmerAngle(elapsed, shimmerSpeed);
				const grad = buildConicGradient(angle, shimmerColor, 'transparent', shimmerSize);
				
				if (button) {
					button.style.setProperty('--shimmer-bg', grad);
					
					if (tactilePress) {
						const scale = calculatePressScale(isPressedRef.current, 0.96);
						button.style.transform = `scale(${scale})`;
					} else {
						button.style.transform = 'scale(1)';
					}
				}
				
				rafRef.current = requestAnimationFrame(loop);
			};

			rafRef.current = requestAnimationFrame(loop);

			return () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		}, [shimmerColor, shimmerSize, shimmerSpeed, tactilePress]);

		const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
			isPressedRef.current = true;
			if (props.onPointerDown) props.onPointerDown(e);
		};

		const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
			isPressedRef.current = false;
			if (props.onPointerUp) props.onPointerUp(e);
		};

		const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
			isPressedRef.current = false;
			if (props.onPointerLeave) props.onPointerLeave(e);
		};

		return (
			<button
				ref={internalRef}
				type="button"
				role="button"
				className={className}
				style={
					{
						...style,
						position: 'relative',
						padding: borderWidth,
						borderRadius,
						background: 'transparent',
						border: 'none',
						outline: 'none',
						cursor: 'pointer',
						overflow: 'hidden',
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						'--shimmer-bg': 'transparent',
					} as React.CSSProperties
				}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerLeave}
				{...props}
			>
				{/* The rotating gradient layer */}
				<div
					aria-hidden="true"
					style={{
						position: 'absolute',
						inset: 0,
						background: 'var(--shimmer-bg)',
						borderRadius: 'inherit',
						pointerEvents: 'none',
						zIndex: 0,
					}}
				/>
				
				{/* The solid inner surface */}
				<div
					style={{
						position: 'relative',
						background: backgroundColor,
						borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
						width: '100%',
						height: '100%',
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1,
					}}
				>
					{children}
				</div>
			</button>
		);
	}
);

ShimmerButton.displayName = 'ShimmerButton';
