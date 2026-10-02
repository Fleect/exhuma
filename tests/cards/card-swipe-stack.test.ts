import { describe, it, expect } from 'vitest';
import {
	CardSwipeStack,
	calculateCardRotation,
	evaluateSwipeDecision,
	calculateStackedCardTransform,
	calculateFlingDuration,
	calculateElasticDamping,
	SwipeVelocityRingBuffer,
	evaluateMultiAxisSwipeDecision,
	calculateUndoTrajectory,
} from '../../packages/cards/src/index';
import { cardSwipeStackComponent } from '../../packages/registry/src/components/card-swipe-stack';
import { generateComponentUsage } from '../../packages/registry/src/templates/usage-generator';

describe('Exhuma Kinetic Methodology — Card Swipe Stack (Big-Ω)', () => {
	it('exports CardSwipeStack and mathematical kernel from @fleect/exhuma-cards', () => {
		expect(CardSwipeStack).toBeDefined();
		expect(typeof CardSwipeStack).toBe('function');
		expect(calculateCardRotation).toBeDefined();
		expect(evaluateSwipeDecision).toBeDefined();
		expect(calculateStackedCardTransform).toBeDefined();
		expect(calculateFlingDuration).toBeDefined();
		expect(calculateElasticDamping).toBeDefined();
		expect(SwipeVelocityRingBuffer).toBeDefined();
	});

	it('validates pre-allocated circular ring buffer for O(1) velocity estimation without heap allocations', () => {
		const buffer = new SwipeVelocityRingBuffer();
		expect(buffer.computeVelocityX()).toBe(0);

		// Push sample sequence with time in ms
		buffer.push(0, 0, 1000);
		buffer.push(50, 0, 1050); // dx = 50, dt = 0.05s -> vel = 1000 px/s

		const vel = buffer.computeVelocityX();
		expect(vel).toBeCloseTo(1000, 0);

		// Push more samples to test circular wrap-around
		buffer.push(120, 0, 1100);
		buffer.push(200, 0, 1150);
		buffer.push(300, 0, 1200);
		buffer.push(420, 0, 1250); // wraps head around

		const wrappedVel = buffer.computeVelocityX();
		expect(wrappedVel).toBeGreaterThan(0);

		// Clear buffer
		buffer.clear();
		expect(buffer.computeVelocityX()).toBe(0);
	});

	it('computes card rotation proportional to displacement and clamped to maximum angle', () => {
		// Centered (dx = 0)
		expect(calculateCardRotation(0, 20, 180)).toBe(0);

		// Halfway right
		expect(calculateCardRotation(90, 20, 180)).toBeCloseTo(10, 1);

		// Full threshold right
		expect(calculateCardRotation(180, 20, 180)).toBeCloseTo(20, 1);

		// Over threshold right (clamped)
		expect(calculateCardRotation(300, 20, 180)).toBe(20);

		// Full threshold left (negative)
		expect(calculateCardRotation(-180, 20, 180)).toBeCloseTo(-20, 1);

		// Over threshold left (clamped)
		expect(calculateCardRotation(-400, 20, 180)).toBe(-20);
	});

	it('evaluates dismiss swipe decision based on distance or velocity thresholds', () => {
		// Resting state
		const resting = evaluateSwipeDecision(0, 0, 120, 550);
		expect(resting.isDismissed).toBe(false);
		expect(resting.direction).toBeNull();

		// Dismiss by distance right
		const distRight = evaluateSwipeDecision(130, 100, 120, 550);
		expect(distRight.isDismissed).toBe(true);
		expect(distRight.direction).toBe('right');

		// Dismiss by distance left
		const distLeft = evaluateSwipeDecision(-140, -50, 120, 550);
		expect(distLeft.isDismissed).toBe(true);
		expect(distLeft.direction).toBe('left');

		// Dismiss by momentum fling velocity right (low distance, high velocity)
		const velRight = evaluateSwipeDecision(40, 600, 120, 550);
		expect(velRight.isDismissed).toBe(true);
		expect(velRight.direction).toBe('right');

		// Dismiss by momentum fling velocity left
		const velLeft = evaluateSwipeDecision(-30, -700, 120, 550);
		expect(velLeft.isDismissed).toBe(true);
		expect(velLeft.direction).toBe('left');
	});

	it('calculates background card stacked transform with Hermite smoothstep layer elevation', () => {
		// Index 1 (immediate next card behind) at rest (progress = 0)
		const rest = calculateStackedCardTransform(1, 0, 0.05, 14);
		expect(rest.scale).toBeCloseTo(0.95, 2);
		expect(rest.translateY).toBe(14);
		expect(rest.opacity).toBeCloseTo(0.85, 2);

		// Index 1 when top card is fully swiped away (progress = 1) -> elevates to top position
		const elevated = calculateStackedCardTransform(1, 1, 0.05, 14);
		expect(elevated.scale).toBeCloseTo(1.0, 2);
		expect(elevated.translateY).toBe(0);
		expect(elevated.opacity).toBeCloseTo(1.0, 2);

		// Halfway progress (progress = 0.5) utilizes Hermite smoothstep 3t^2 - 2t^3 = 0.5
		const halfway = calculateStackedCardTransform(1, 0.5, 0.05, 14);
		expect(halfway.scale).toBeCloseTo(0.975, 2);
		expect(halfway.translateY).toBeCloseTo(7, 1);
	});

	it('calculates dynamic fling animation duration preserving momentum', () => {
		// Zero or low velocity -> max duration
		expect(calculateFlingDuration(600, 50, 160, 300)).toBe(300);

		// High velocity fling -> faster exit clamped to minDuration
		expect(calculateFlingDuration(600, 4000, 160, 300)).toBe(160);

		// Medium velocity fling -> natural proportional duration
		const med = calculateFlingDuration(500, 2000, 160, 300);
		expect(med).toBe(250);
	});

	it('applies elastic damping to last-card rubber-band resistance', () => {
		// Zero drag → zero resistance
		expect(calculateElasticDamping(0, 80)).toBe(0);

		// Positive drag: damped value is positive and never exceeds maxDistance
		const posDamped = calculateElasticDamping(100, 80);
		expect(posDamped).toBeGreaterThan(0);
		expect(posDamped).toBeLessThanOrEqual(80); // clamped to maxDistance

		// Negative drag: damped value is negative and clamped
		const negDamped = calculateElasticDamping(-100, 80);
		expect(negDamped).toBeLessThan(0);
		expect(negDamped).toBeGreaterThanOrEqual(-80);

		// Large drag (≥ maxDistance): output is clamped to maxDistance
		const largeDamped = calculateElasticDamping(500, 80);
		expect(largeDamped).toBe(80);

		// Symmetry: |damped(dx)| === |damped(-dx)|
		const pos = calculateElasticDamping(60, 80);
		const neg = calculateElasticDamping(-60, 80);
		expect(Math.abs(pos)).toBeCloseTo(Math.abs(neg), 5);

		// Custom exponent & scale: verify power-law reduces large values
		const custom = calculateElasticDamping(200, 200, 0.5, 1.0); // sqrt(200) ≈ 14.1
		expect(custom).toBeCloseTo(Math.sqrt(200), 1);
	});

	it('validates card-swipe-stack registry component definition, new props, and defaults', () => {
		expect(cardSwipeStackComponent.id).toBe('card-swipe-stack');
		expect(cardSwipeStackComponent.defaultProps.thresholdDistance).toBe(120);
		expect(cardSwipeStackComponent.defaultProps.maxRotation).toBe(20);
		expect(cardSwipeStackComponent.defaultProps.scaleStep).toBe(0.05);
		expect(cardSwipeStackComponent.defaultProps.offsetStep).toBe(14);
		expect(cardSwipeStackComponent.defaultProps.preventLastCardDismiss).toBe(true);

		const offsetProp = cardSwipeStackComponent.props.find((p) => p.name === 'offsetStep');
		const lastCardProp = cardSwipeStackComponent.props.find((p) => p.name === 'preventLastCardDismiss');
		expect(offsetProp).toBeDefined();
		expect(offsetProp?.type).toBe('number');
		expect(offsetProp?.min).toBe(4);
		expect(offsetProp?.max).toBe(32);

		expect(lastCardProp).toBeDefined();
		expect(lastCardProp?.type).toBe('boolean');
		expect(lastCardProp?.defaultValue).toBe(true);
	});

	it('generates component code across all 13 supported ecosystems without errors', () => {
		const ecosystems = [
			'react',
			'nextjs',
			'vue',
			'svelte',
			'angular',
			'solid',
			'astro',
			'blade',
			'vanilla',
			'wordpress',
			'webcomponent',
			'react-native',
			'flutter',
		] as const;

		for (const flavor of ecosystems) {
			const files = cardSwipeStackComponent.generateCode(flavor, cardSwipeStackComponent.defaultProps);
			expect(files.length).toBeGreaterThan(0);
			for (const file of files) {
				expect(file.code.length).toBeGreaterThan(50);
			}
		}
	});

	it('generates rich copy-paste Quick Start usage examples across all 13 ecosystems', () => {
		const ecosystems = [
			'react',
			'nextjs',
			'vue',
			'svelte',
			'angular',
			'solid',
			'astro',
			'blade',
			'vanilla',
			'wordpress',
			'webcomponent',
			'react-native',
			'flutter',
		] as const;

		for (const flavor of ecosystems) {
			const usage = generateComponentUsage(cardSwipeStackComponent, flavor, {
				thresholdDistance: 120,
				maxRotation: 20,
				scaleStep: 0.05,
				offsetStep: 14,
				preventLastCardDismiss: true,
			});

			expect(usage.filename).toBeDefined();
			expect(usage.language).toBeDefined();
			expect(usage.code.toLowerCase()).toMatch(/card-?swipe-?stack/);
			expect(usage.code.length).toBeGreaterThan(100);
		}
	});

	it('evaluates 4-way multi-axis swipe decision (left, right, up, down)', () => {
		// Horizontal dominance
		expect(evaluateMultiAxisSwipeDecision(150, 20, 0, 0, 120, 550)).toEqual({ isDismissed: true, direction: 'right' });
		expect(evaluateMultiAxisSwipeDecision(-150, 20, 0, 0, 120, 550)).toEqual({ isDismissed: true, direction: 'left' });

		// Vertical dominance
		expect(evaluateMultiAxisSwipeDecision(20, -150, 0, 0, 120, 550)).toEqual({ isDismissed: true, direction: 'up' });
		expect(evaluateMultiAxisSwipeDecision(20, 150, 0, 0, 120, 550)).toEqual({ isDismissed: true, direction: 'down' });

		// Within threshold
		expect(evaluateMultiAxisSwipeDecision(40, 50, 0, 0, 120, 550)).toEqual({ isDismissed: false, direction: null });
	});

	it('calculates smooth undo restoration trajectory back to origin', () => {
		// Progress 0: at exit position
		expect(calculateUndoTrajectory(0, 400, 100)).toEqual({ x: 400, y: 100 });

		// Progress 0.5: midway smoothly returning
		const mid = calculateUndoTrajectory(0.5, 400, 100);
		expect(mid.x).toBeLessThan(400);
		expect(mid.x).toBeGreaterThan(0);

		// Progress 1.0: fully settled at (0, 0)
		expect(calculateUndoTrajectory(1.0, 400, 100)).toEqual({ x: 0, y: 0 });
	});
});
