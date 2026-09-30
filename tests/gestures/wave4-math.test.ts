import { describe, it, expect } from 'vitest';
import { calculateMagneticPull } from '../../packages/core/src/MagneticButton/magnetic-math';
import {
	calculateCardRotation,
	evaluateSwipeDecision,
	calculateStackedCardTransform,
	SwipeVelocityRingBuffer,
} from '../../packages/cards/src/CardSwipeStack/swipe-math';
import {
	calculateSplitPosition,
	generateClipPath,
	stepSliderPosition,
} from '../../packages/cards/src/ComparisonSlider/slider-math';
import {
	calculateFLIPDelta,
	generateInvertTransform,
} from '../../packages/cards/src/ExpandableCard/flip-math';
import {
	calculateElementCenter,
	clampTooltipToViewport,
} from '../../packages/core/src/CursorTooltip/cursor-math';

describe('Wave 4 Mathematical Kernels — Magnetic Button', () => {
	it('calculates inverted spring magnetic displacement within radius', () => {
		const res = calculateMagneticPull(150, 150, 100, 100, 100, 0.4);
		expect(res.isInside).toBe(true);
		expect(res.x).toBeGreaterThan(0);
		expect(res.y).toBeGreaterThan(0);
		expect(res.distance).toBeCloseTo(Math.hypot(50, 50), 2);
	});

	it('returns zero displacement when pointer is outside radius', () => {
		const res = calculateMagneticPull(300, 300, 100, 100, 100, 0.4);
		expect(res.isInside).toBe(false);
		expect(res.x).toBe(0);
		expect(res.y).toBe(0);
	});
});

describe('Wave 4 Mathematical Kernels — Card Swipe Stack', () => {
	it('calculates rotational coupling bounded by maxRotation', () => {
		const rotRight = calculateCardRotation(180, 20, 180);
		expect(rotRight).toBeCloseTo(20, 2);

		const rotLeft = calculateCardRotation(-180, 20, 180);
		expect(rotLeft).toBeCloseTo(-20, 2);

		const rotBeyond = calculateCardRotation(500, 20, 180);
		expect(rotBeyond).toBe(20);
	});

	it('evaluates dismiss swipe threshold by distance or velocity', () => {
		expect(evaluateSwipeDecision(150, 100, 120, 550)).toEqual({
			isDismissed: true,
			direction: 'right',
		});
		expect(evaluateSwipeDecision(-150, -100, 120, 550)).toEqual({
			isDismissed: true,
			direction: 'left',
		});
		expect(evaluateSwipeDecision(50, 600, 120, 550)).toEqual({
			isDismissed: true,
			direction: 'right',
		});
		expect(evaluateSwipeDecision(50, 100, 120, 550)).toEqual({
			isDismissed: false,
			direction: null,
		});
	});

	it('tracks fling velocity using circular ring buffer with zero allocations', () => {
		const ring = new SwipeVelocityRingBuffer();
		ring.push(0, 0, 0);
		ring.push(50, 0, 100);
		ring.push(120, 0, 200);

		const vx = ring.computeVelocityX();
		expect(vx).toBeGreaterThan(0);
		expect(vx).toBeCloseTo(600, 0);
	});

	it('interpolates stacked background cards based on progress', () => {
		const t0 = calculateStackedCardTransform(1, 0);
		const t1 = calculateStackedCardTransform(1, 1);

		expect(t0.scale).toBeLessThan(1.0);
		expect(t1.scale).toBeCloseTo(1.0, 3);
		expect(t1.translateY).toBeCloseTo(0, 3);
	});
});

describe('Wave 4 Mathematical Kernels — Comparison Slider', () => {
	it('calculates split position clamped within [0, 1]', () => {
		expect(calculateSplitPosition(250, 100, 200)).toBeCloseTo(0.75, 2);
		expect(calculateSplitPosition(50, 100, 200)).toBe(0);
		expect(calculateSplitPosition(400, 100, 200)).toBe(1);
	});

	it('generates valid CSS clip-path polygon', () => {
		const polygon = generateClipPath(0.5);
		expect(polygon).toBe('polygon(0 0, 50.000% 0, 50.000% 100%, 0 100%)');
	});

	it('steps position forward and backward with bounds checking', () => {
		expect(stepSliderPosition(0.5, 0.1)).toBeCloseTo(0.6, 2);
		expect(stepSliderPosition(0.95, 0.1)).toBe(1);
		expect(stepSliderPosition(0.05, -0.1)).toBe(0);
	});
});

describe('Wave 4 Mathematical Kernels — Expandable Card FLIP', () => {
	it('computes exact FLIP inverse delta transform', () => {
		const first = { left: 100, top: 100, width: 200, height: 100 };
		const last = { left: 50, top: 50, width: 400, height: 300 };

		const delta = calculateFLIPDelta(first, last);
		expect(delta.dx).toBe(50);
		expect(delta.dy).toBe(50);
		expect(delta.scaleX).toBeCloseTo(0.5, 2);
		expect(delta.scaleY).toBeCloseTo(0.3333, 2);

		const transformStr = generateInvertTransform(delta);
		expect(transformStr).toContain('translate3d(50.00px, 50.00px, 0)');
		expect(transformStr).toContain('scale(0.5000, 0.3333)');
	});
});

describe('Wave 4 Mathematical Kernels — Cursor Tooltip', () => {
	it('calculates element center coordinates', () => {
		const center = calculateElementCenter({ left: 100, top: 200, width: 80, height: 40 });
		expect(center.x).toBe(140);
		expect(center.y).toBe(220);
	});

	it('clamps tooltip within browser viewport boundaries', () => {
		const clamped = clampTooltipToViewport(1900, 1050, 150, 60, 1920, 1080, 12);
		expect(clamped.x).toBeLessThanOrEqual(1920 - 150 - 12);
		expect(clamped.y).toBeLessThanOrEqual(1080 - 60 - 12);

		const clampedMin = clampTooltipToViewport(-50, -20, 150, 60, 1920, 1080, 12);
		expect(clampedMin.x).toBe(12);
		expect(clampedMin.y).toBe(12);
	});
});
