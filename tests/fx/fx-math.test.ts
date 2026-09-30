import { describe, it, expect } from 'vitest';
import {
	calculateGaussianScale,
	calculateDockItemSize,
} from '../../packages/core/src/FloatingDock/dock-math';
import {
	projectSphericalPoint,
	DEFAULT_SPHERE_CHARS,
} from '../../packages/core/src/AnimatedSphere/sphere-math';
import {
	easeOutExpo,
	calculateTickerValue,
} from '../../packages/core/src/NumberTicker/ticker-math';

describe('Exhuma Kinetic Methodology — Gaussian Dock Proximity Math', () => {
	it('evaluates maximum magnification boost at zero distance', () => {
		const scale = calculateGaussianScale(0, 70, 0.6);
		expect(scale).toBeCloseTo(1.6, 4);

		const size = calculateDockItemSize(0, 44, 70, 0.6);
		expect(size).toBeCloseTo(70.4, 2);
	});

	it('asymptotically decays towards baseline scale (1.0) as distance increases', () => {
		const scaleNear = calculateGaussianScale(50, 70, 0.6);
		const scaleFar = calculateGaussianScale(250, 70, 0.6);

		expect(scaleNear).toBeGreaterThan(1.0);
		expect(scaleNear).toBeLessThan(1.6);

		expect(scaleFar).toBeCloseTo(1.0, 2);
	});

	it('safely handles non-positive influence radius without NaN', () => {
		expect(calculateGaussianScale(10, 0, 0.6)).toBe(1.0);
		expect(calculateGaussianScale(10, -5, 0.6)).toBe(1.0);
	});
});

describe('Exhuma Kinetic Methodology — 3D Spherical Trigonometry Kernel', () => {
	it('projects 3D spherical coordinates onto 2D canvas with depth bounds', () => {
		const pt = projectSphericalPoint(
			Math.PI / 2, // equator
			0,           // prime meridian
			0,           // no X rotation
			0,           // no Y rotation
			100,         // radius
			200,         // centerX
			200          // centerY
		);

		expect(pt.x).toBeCloseTo(300, 1);
		expect(pt.y).toBeCloseTo(200, 1);
		expect(pt.depth).toBeGreaterThanOrEqual(0);
		expect(pt.depth).toBeLessThanOrEqual(1);
		expect(typeof pt.char).toBe('string');
		expect(pt.char.length).toBeGreaterThan(0);
	});

	it('applies 3D Euler rotation around Y and X axes', () => {
		const ptUnrotated = projectSphericalPoint(Math.PI / 2, 0, 0, 0, 100, 200, 200);
		const ptRotatedY = projectSphericalPoint(Math.PI / 2, 0, 0, Math.PI / 2, 100, 200, 200);

		// Rotating 90 deg around Y should rotate front point to the side/back
		expect(ptRotatedY.x).not.toBeCloseTo(ptUnrotated.x, 0);
	});
});

describe('Exhuma Kinetic Methodology — Exponential Number Ticker Easing', () => {
	it('converges from initial to target value using closed-form easeOutExpo', () => {
		expect(easeOutExpo(0)).toBe(0);
		expect(easeOutExpo(1)).toBe(1);
		expect(easeOutExpo(0.5)).toBeCloseTo(1 - Math.pow(2, -5), 4);

		// Ticker intermediate value
		const mid = calculateTickerValue(0, 1000, 0.75, 1.5);
		expect(mid.value).toBeGreaterThan(500);
		expect(mid.isComplete).toBe(false);

		// Ticker terminal value
		const end = calculateTickerValue(0, 1000, 1.5, 1.5);
		expect(end.value).toBe(1000);
		expect(end.isComplete).toBe(true);
	});
});
