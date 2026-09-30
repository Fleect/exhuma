import { describe, it, expect } from 'vitest';
import { calculateSpotlightCoordinates, generateSpotlightStyle, validateSpotlightRadius, validateSpotlightOpacity, validateSpotlightSpread, calculateGaussianIntensity, calculateRelativeSpotlightVector } from '../../packages/cards/src/SpotlightCard/spotlight-math';
import { solveCriticallyDampedSpring } from '../../packages/core/src/physics/spring';
import { exponentialSmoothing, normalizeCoordinate, clamp } from '../../packages/core/src/physics/lerp';

describe('Exhuma Kinetic Methodology — Spotlight Math & Physics', () => {
	it('normalizes pointer coordinates accurately relative to bounding rect', () => {
		const rect = { left: 100, top: 200, width: 400, height: 300 };
		const result = calculateSpotlightCoordinates(200, 350, rect);

		expect(result.x).toBe(100);
		expect(result.y).toBe(150);
		expect(result.normalizedX).toBe(0.25);
		expect(result.normalizedY).toBe(0.5);
		expect(result.isInside).toBe(true);
	});

	it('detects when pointer is outside bounding box', () => {
		const rect = { left: 100, top: 200, width: 400, height: 300 };
		const result = calculateSpotlightCoordinates(50, 600, rect);

		expect(result.isInside).toBe(false);
	});

	it('computes frame-rate independent exponential smoothing filter (Big-Omega)', () => {
		const current = 0;
		const target = 100;
		const decay = 10;
		const dt = 0.016; // 60fps frame

		const smoothed = exponentialSmoothing(current, target, decay, dt);
		expect(smoothed).toBeGreaterThan(0);
		expect(smoothed).toBeLessThan(100);

		// Multiple steps should asymptotically approach target
		let val = current;
		for (let i = 0; i < 100; i++) {
			val = exponentialSmoothing(val, target, decay, dt);
		}
		expect(Math.abs(val - target)).toBeLessThan(0.001);
	});

	it('generates valid radial gradient CSS strings with spread percentage', () => {
		const styleDefault = generateSpotlightStyle(150, 200, 350, 'rgba(99, 102, 241, 0.25)', 0.8);
		expect(styleDefault).toBe('radial-gradient(350px circle at 150px 200px, rgba(99, 102, 241, 0.25) 0%, transparent 80%)');

		const styleWithSpread = generateSpotlightStyle(150, 200, 350, 'rgba(99, 102, 241, 0.25)', 0.8, 25);
		expect(styleWithSpread).toBe('radial-gradient(350px circle at 150px 200px, rgba(99, 102, 241, 0.25) 0%, transparent 25%)');
	});

	it('validates and clamps spotlight parameters', () => {
		expect(validateSpotlightRadius(350)).toBe(350);
		expect(validateSpotlightRadius(-10)).toBe(50);
		expect(validateSpotlightRadius(5000)).toBe(2000);
		expect(validateSpotlightRadius(NaN)).toBe(350);

		expect(validateSpotlightOpacity(0.8)).toBe(0.8);
		expect(validateSpotlightOpacity(-0.5)).toBe(0);
		expect(validateSpotlightOpacity(1.5)).toBe(1);
		expect(validateSpotlightOpacity(NaN)).toBe(0.8);

		expect(validateSpotlightSpread(20)).toBe(20);
		expect(validateSpotlightSpread(-5)).toBe(10);
		expect(validateSpotlightSpread(150)).toBe(100);
		expect(validateSpotlightSpread(NaN)).toBe(80);
	});

	it('computes Gaussian radial falloff intensity across horizon distances', () => {
		// Distance 0 should yield peak opacity
		expect(calculateGaussianIntensity(0, 350, 0.8)).toBe(0.8);

		// Distance > 0 should attenuate smoothly
		const halfRadius = calculateGaussianIntensity(175, 350, 0.8);
		expect(halfRadius).toBeLessThan(0.8);
		expect(halfRadius).toBeGreaterThan(0.3);

		// Distance far outside radius should asymptotically approach zero
		const farAway = calculateGaussianIntensity(1000, 350, 0.8);
		expect(farAway).toBeLessThan(0.001);
	});

	it('computes relative vector coordinates and closest Euclidean distance to card', () => {
		const cardRect = { left: 100, top: 100, width: 200, height: 150 };

		// Point directly inside card: distance = 0
		const inside = calculateRelativeSpotlightVector(150, 150, cardRect);
		expect(inside.x).toBe(50);
		expect(inside.y).toBe(50);
		expect(inside.distance).toBe(0);

		// Point 50px to the right of card
		const right = calculateRelativeSpotlightVector(350, 150, cardRect);
		expect(right.x).toBe(250);
		expect(right.y).toBe(50);
		expect(right.distance).toBe(50);
	});
});

describe('Exhuma Kinetic Methodology — Analytical Spring Physics Kernel', () => {
	it('settles critically damped spring to target position with zero oscillation', () => {
		let current = 0;
		const target = 100;
		let velocity = 0;
		const dt = 0.016;

		let stepCount = 0;
		let isSettled = false;

		while (!isSettled && stepCount < 200) {
			const state = solveCriticallyDampedSpring(current, target, velocity, dt, { omega: 26 });
			current = state.position;
			velocity = state.velocity;
			isSettled = state.isSettled;
			stepCount++;
		}

		expect(isSettled).toBe(true);
		expect(Math.abs(current - target)).toBeLessThan(0.001);
		expect(velocity).toBe(0);
	});
});
