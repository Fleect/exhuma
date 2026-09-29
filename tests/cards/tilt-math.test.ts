import { describe, it, expect } from 'vitest';
import { calculateTilt, calculateGlare, generateTiltTransform, generateGlareStyle, lerp, calculateParallaxOffset, generateParallaxTransform } from '../../packages/cards/src/TiltCard/tilt-math';

describe('Exhuma Kinetic Methodology — Tilt Card Mathematical Kernel', () => {
	const CARD_WIDTH = 400;
	const CARD_HEIGHT = 300;
	const MAX_TILT = 20;

	describe('calculateTilt() — Euler Matrix Angle Projection', () => {
		it('returns zero rotation when pointer is dead center', () => {
			const tilt = calculateTilt(CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(tilt.rotX).toBe(0);
			expect(tilt.rotY).toBe(0);
		});

		it('projects exact Euler angles for card boundary midpoints', () => {
			// Top-center (x = 200, y = 0)
			const top = calculateTilt(CARD_WIDTH / 2, 0, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(top.rotX).toBeCloseTo(MAX_TILT * 0.5, 5);
			expect(top.rotY).toBe(0);

			// Bottom-center (x = 200, y = 300)
			const bottom = calculateTilt(CARD_WIDTH / 2, CARD_HEIGHT, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(bottom.rotX).toBeCloseTo(-MAX_TILT * 0.5, 5);
			expect(bottom.rotY).toBe(0);

			// Left-center (x = 0, y = 150)
			const left = calculateTilt(0, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(left.rotX).toBe(0);
			expect(left.rotY).toBeCloseTo(-MAX_TILT * 0.5, 5);

			// Right-center (x = 400, y = 150)
			const right = calculateTilt(CARD_WIDTH, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(right.rotX).toBe(0);
			expect(right.rotY).toBeCloseTo(MAX_TILT * 0.5, 5);
		});

		it('clamps rotation when pointer moves outside element bounding box', () => {
			const farTopLeft = calculateTilt(-500, -500, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(farTopLeft.rotX).toBeCloseTo(MAX_TILT * 0.5, 5);
			expect(farTopLeft.rotY).toBeCloseTo(-MAX_TILT * 0.5, 5);

			const farBottomRight = calculateTilt(2000, 2000, CARD_WIDTH, CARD_HEIGHT, MAX_TILT);
			expect(farBottomRight.rotX).toBeCloseTo(-MAX_TILT * 0.5, 5);
			expect(farBottomRight.rotY).toBeCloseTo(MAX_TILT * 0.5, 5);
		});

		it('inverts rotation vectors when reverse is enabled', () => {
			const normal = calculateTilt(CARD_WIDTH, 0, CARD_WIDTH, CARD_HEIGHT, MAX_TILT, false);
			const reversed = calculateTilt(CARD_WIDTH, 0, CARD_WIDTH, CARD_HEIGHT, MAX_TILT, true);

			expect(reversed.rotX).toBeCloseTo(-normal.rotX, 5);
			expect(reversed.rotY).toBeCloseTo(-normal.rotY, 5);
		});

		it('constrains rotation to pitch only when axis is x', () => {
			const tilt = calculateTilt(CARD_WIDTH, 0, CARD_WIDTH, CARD_HEIGHT, MAX_TILT, false, 'x');
			expect(tilt.rotX).toBeCloseTo(MAX_TILT * 0.5, 5);
			expect(tilt.rotY).toBe(0);
		});

		it('constrains rotation to yaw only when axis is y', () => {
			const tilt = calculateTilt(CARD_WIDTH, 0, CARD_WIDTH, CARD_HEIGHT, MAX_TILT, false, 'y');
			expect(tilt.rotX).toBe(0);
			expect(tilt.rotY).toBeCloseTo(MAX_TILT * 0.5, 5);
		});

		it('safely handles zero or negative dimensions without throwing', () => {
			const zeroW = calculateTilt(100, 100, 0, CARD_HEIGHT, MAX_TILT);
			expect(zeroW).toEqual({ rotX: 0, rotY: 0 });

			const zeroH = calculateTilt(100, 100, CARD_WIDTH, 0, MAX_TILT);
			expect(zeroH).toEqual({ rotX: 0, rotY: 0 });

			const negativeDim = calculateTilt(100, 100, -100, -100, MAX_TILT);
			expect(negativeDim).toEqual({ rotX: 0, rotY: 0 });
		});
	});

	describe('calculateGlare() — Specular Radial Coordinates', () => {
		it('places glare hotspot at dead center (50%, 50%)', () => {
			const glare = calculateGlare(CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, 0.4);
			expect(glare.glareX).toBe(50);
			expect(glare.glareY).toBe(50);
			expect(glare.glareOpacity).toBe(0.4);
		});

		it('places glare hotspot at normalized corners [0%, 100%]', () => {
			const topLeft = calculateGlare(0, 0, CARD_WIDTH, CARD_HEIGHT, 0.3);
			expect(topLeft.glareX).toBe(0);
			expect(topLeft.glareY).toBe(0);

			const bottomRight = calculateGlare(CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH, CARD_HEIGHT, 0.3);
			expect(bottomRight.glareX).toBe(100);
			expect(bottomRight.glareY).toBe(100);
		});

		it('clamps glare coordinates when pointer moves outside card bounds', () => {
			const outside = calculateGlare(-100, 500, CARD_WIDTH, CARD_HEIGHT, 0.3);
			expect(outside.glareX).toBe(0);
			expect(outside.glareY).toBe(100);
		});

		it('clamps opacity within valid [0, 1] range', () => {
			const clampedHigh = calculateGlare(100, 100, CARD_WIDTH, CARD_HEIGHT, 1.8);
			expect(clampedHigh.glareOpacity).toBe(1.0);

			const clampedLow = calculateGlare(100, 100, CARD_WIDTH, CARD_HEIGHT, -0.5);
			expect(clampedLow.glareOpacity).toBe(0);
		});

		it('handles zero or negative dimensions safely', () => {
			const zeroDim = calculateGlare(100, 100, 0, 0, 0.3);
			expect(zeroDim).toEqual({ glareX: 50, glareY: 50, glareOpacity: 0 });
		});
	});

	describe('generateTiltTransform() & generateGlareStyle() — CSS Synthesizers', () => {
		it('synthesizes valid CSS 3D perspective transform string', () => {
			const transform = generateTiltTransform(1000, 8.5, -6.2, 1.05);
			expect(transform).toBe('perspective(1000px) rotateX(8.50deg) rotateY(-6.20deg) scale3d(1.050, 1.050, 1.050)');
		});

		it('synthesizes valid CSS glare style object', () => {
			const style = generateGlareStyle(75.5, 25.0, 0.35);
			expect(style.opacity).toBe('0.350');
			expect(style.background).toBe('radial-gradient(circle at 75.5% 25.0%, rgba(255,255,255,0.8), transparent 60%)');
		});
	});

	describe('lerp() — Linear Interpolation & Asymptotic Convergence', () => {
		it('interpolates intermediate points precisely', () => {
			expect(lerp(0, 100, 0)).toBe(0);
			expect(lerp(0, 100, 0.5)).toBe(50);
			expect(lerp(0, 100, 1)).toBe(100);
			expect(lerp(10, 20, 0.25)).toBe(12.5);
		});

		it('asymptotically converges to target over sequential rAF steps', () => {
			let current = 0;
			const target = 15;
			const speed = 0.12;

			// Run 60 frames
			for (let frame = 0; frame < 60; frame++) {
				current = lerp(current, target, speed);
			}

			// After 60 frames with speed 0.12, remaining delta should be < 0.01
			expect(Math.abs(target - current)).toBeLessThan(0.01);
		});
	});

	describe('calculateParallaxOffset() & generateParallaxTransform() — Diorama 3D Parallax', () => {
		it('returns zero offset when rotation is zero or depth is zero', () => {
			expect(calculateParallaxOffset(0, 0, MAX_TILT, 20)).toEqual({ x: 0, y: 0 });
			expect(calculateParallaxOffset(10, 10, MAX_TILT, 0)).toEqual({ x: 0, y: 0 });
			expect(calculateParallaxOffset(10, 10, 0, 20)).toEqual({ x: 0, y: 0 });
		});

		it('calculates exact diorama translation offsets proportional to tilt and depth', () => {
			// Yaw rotY = 10, maxTilt = 20 -> normRotY = 0.5; Pitch rotX = 5, maxTilt = 20 -> normRotX = 0.25; depth = 20
			// x = 0.5 * 20 = 10; y = -0.25 * 20 = -5
			const offset = calculateParallaxOffset(5, 10, MAX_TILT, 20);
			expect(offset.x).toBe(10);
			expect(offset.y).toBe(-5);
		});

		it('supports negative depth for recessed background layers', () => {
			// rotY = 10, rotX = 5, depth = -10
			// x = 0.5 * -10 = -5; y = -0.25 * -10 = 2.5
			const offset = calculateParallaxOffset(5, 10, MAX_TILT, -10);
			expect(offset.x).toBe(-5);
			expect(offset.y).toBe(2.5);
		});

		it('synthesizes hardware-composited translate3d transform string', () => {
			expect(generateParallaxTransform(12.5, -6.2)).toBe('translate3d(12.50px, -6.20px, 0)');
		});
	});
});
