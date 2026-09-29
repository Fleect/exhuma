import { describe, it, expect } from 'vitest';
import {
	calculateMarqueeOffset,
	dampFactor,
	parseGapToPx,
} from '../../packages/layouts/src/InfiniteMarquee/marquee-math';
import {
	getDiamondLayoutConfig,
	partitionDiamondItems,
} from '../../packages/layouts/src/DiamondGrid/diamond-layout';

describe('Exhuma Kinetic Methodology — Marquee Mathematical Kernel', () => {
	it('translates leftward and wraps with modulo arithmetic when offset exceeds width', () => {
		const contentWidth = 1000;
		const speed = 100; // 100 px/sec
		const dt = 0.5; // 0.5 sec -> moves 50px

		// Initial step
		const offset1 = calculateMarqueeOffset(0, dt, speed, 'left', contentWidth);
		expect(offset1).toBe(-50);

		// Step right before boundary
		const offset2 = calculateMarqueeOffset(-980, dt, speed, 'left', contentWidth);
		// -980 - 50 = -1030 <= -1000 -> wraps to -30
		expect(offset2).toBe(-30);
	});

	it('translates rightward and wraps when offset exceeds zero', () => {
		const contentWidth = 1000;
		const speed = 100;
		const dt = 0.5;

		const offset1 = calculateMarqueeOffset(-500, dt, speed, 'right', contentWidth);
		expect(offset1).toBe(-450);

		// Wraps when reaching or crossing 0
		const offset2 = calculateMarqueeOffset(-20, dt, speed, 'right', contentWidth);
		// -20 + 50 = +30 >= 0 -> wraps to -1000 + 30 = -970
		expect(offset2).toBe(-970);
	});

	it('handles zero content width without division by zero', () => {
		const offset = calculateMarqueeOffset(0, 0.016, 50, 'left', 0);
		expect(offset).toBe(0);
	});

	it('smoothly damps velocity factor during hover deceleration and acceleration', () => {
		let factor = 1.0;
		const target = 0.0;
		const lambda = 12.0;
		const dt = 0.016;

		// Deceleration towards 0
		for (let i = 0; i < 30; i++) {
			factor = dampFactor(factor, target, lambda, dt);
		}
		expect(factor).toBeLessThan(0.01);

		// Acceleration back to 1.0
		for (let i = 0; i < 30; i++) {
			factor = dampFactor(factor, 1.0, lambda, dt);
		}
		expect(factor).toBeGreaterThan(0.99);
	});

	it('parses diverse CSS gap units (px, rem, em, numbers) with fallbacks', () => {
		expect(parseGapToPx(24)).toBe(24);
		expect(parseGapToPx('24px')).toBe(24);
		expect(parseGapToPx('1.5rem')).toBe(24);
		expect(parseGapToPx('1rem')).toBe(16);
		expect(parseGapToPx('2em')).toBe(32);
		expect(parseGapToPx(undefined)).toBe(24);
		expect(parseGapToPx('invalid')).toBe(24);
	});

	it('wraps seamlessly at repeat wavelength (contentWidth + gap)', () => {
		const contentWidth = 1000;
		const gap = parseGapToPx('1.5rem'); // 24px
		const repeatWavelength = contentWidth + gap; // 1024px
		const speed = 100;
		const dt = 0.5; // moves 50px

		// Moving left: when reaching exactly -repeatWavelength (-1024), wraps to 0
		const offsetAtBoundary = calculateMarqueeOffset(-990, dt, speed, 'left', repeatWavelength);
		// -990 - 50 = -1040 <= -1024 -> -1040 % 1024 = -16
		expect(offsetAtBoundary).toBe(-16);
	});
});

describe('Exhuma Kinetic Methodology — Diamond Grid Mathematical Partitioning', () => {
	it('selects 7-column rhombic pattern [1, 2, 3, 4, 3, 2, 1] for large sets (>= 16)', () => {
		const config = getDiamondLayoutConfig(20);
		expect(config.columns).toBe(7);
		expect(config.pattern).toEqual([1, 2, 3, 4, 3, 2, 1]);
		expect(config.maxItems).toBe(16);

		const items = Array.from({ length: 20 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);

		expect(partitioned.length).toBe(7);
		expect(partitioned[0].length).toBe(1); // column 0
		expect(partitioned[1].length).toBe(2); // column 1
		expect(partitioned[2].length).toBe(3); // column 2
		expect(partitioned[3].length).toBe(4); // column 3 (apex)
		expect(partitioned[4].length).toBe(3); // column 4
		expect(partitioned[5].length).toBe(2); // column 5
		expect(partitioned[6].length).toBe(1); // column 6
	});

	it('selects 5-column rhombic pattern [1, 2, 3, 2, 1] for medium sets (9..15)', () => {
		const config = getDiamondLayoutConfig(12);
		expect(config.columns).toBe(5);
		expect(config.pattern).toEqual([1, 2, 3, 2, 1]);
		expect(config.maxItems).toBe(9);

		const items = Array.from({ length: 12 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);
		expect(partitioned.length).toBe(5);
		expect(partitioned[2].length).toBe(3); // apex
	});

	it('selects 3-column rhombic pattern [1, 2, 1] for small sets (4..8)', () => {
		const config = getDiamondLayoutConfig(6);
		expect(config.columns).toBe(3);
		expect(config.pattern).toEqual([1, 2, 1]);

		const items = Array.from({ length: 6 }, (_, i) => `item-${i}`);
		const partitioned = partitionDiamondItems(items, config);
		expect(partitioned.length).toBe(3);
		expect(partitioned[1].length).toBe(2); // apex
	});

	it('handles fallback gracefully when items < 4', () => {
		const config = getDiamondLayoutConfig(2);
		expect(config.columns).toBe(2);
		expect(config.pattern).toEqual([]);
	});
});

describe('InfiniteMarquee — Scroll Coupling & Hysteresis Math', () => {
	it('couples marquee speed with scroll velocity', async () => {
		const { calculateCoupledScrollVelocity } = await import('../../packages/layouts/src/InfiniteMarquee/marquee-math');

		expect(calculateCoupledScrollVelocity(60, 0)).toBe(60);
		expect(calculateCoupledScrollVelocity(60, 500, 0.12)).toBe(60 + 60); // 120
		expect(calculateCoupledScrollVelocity(60, -500, 0.12)).toBe(120);
		expect(calculateCoupledScrollVelocity(NaN, 100)).toBe(0);
	});

	it('filters direction changes with hysteresis threshold to prevent jitter', async () => {
		const { evaluateMarqueeDirectionHysteresis } = await import('../../packages/layouts/src/InfiniteMarquee/marquee-math');

		// Small jitter within threshold does not change direction
		expect(evaluateMarqueeDirectionHysteresis('left', 20, 50)).toBe('left');
		expect(evaluateMarqueeDirectionHysteresis('right', -30, 50)).toBe('right');

		// Exceeding threshold triggers reversal
		expect(evaluateMarqueeDirectionHysteresis('left', 80, 50)).toBe('right');
		expect(evaluateMarqueeDirectionHysteresis('right', -80, 50)).toBe('left');
	});
});

describe('BentoGrid — FLIP & Repulsion Mathematical Kernel', () => {
	it('calculates FLIP invert displacement vectors', async () => {
		const { calculateFlipDisplacement } = await import('../../packages/layouts/src/BentoGrid/bento-math');

		const oldPos = { x: 100, y: 50 };
		const newPos = { x: 250, y: 120 };
		const delta = calculateFlipDisplacement(oldPos, newPos);

		expect(delta.dx).toBe(-150);
		expect(delta.dy).toBe(-70);
	});

	it('interpolates spring positions smoothly to settled destination', async () => {
		const { solveBentoSpringPosition } = await import('../../packages/layouts/src/BentoGrid/bento-math');

		const newPos = { x: 200, y: 100 };
		const delta = { dx: -50, dy: -30 };

		// At t=0, starts at old position (newPos + delta)
		const start = solveBentoSpringPosition(0, newPos, delta);
		expect(start.x).toBe(150);
		expect(start.y).toBe(70);

		// Settles at destination
		const settled = solveBentoSpringPosition(0.8, newPos, delta);
		expect(settled.x).toBe(200);
		expect(settled.y).toBe(100);
	});

	it('calculates gaussian repulsion vector away from dragged element', async () => {
		const { calculateRepulsionVector } = await import('../../packages/layouts/src/BentoGrid/bento-math');

		const drag = { x: 100, y: 100 };
		const neighbor = { x: 150, y: 100 }; // 50px to the right
		const force = calculateRepulsionVector(drag, neighbor, 32, 120);

		// Repels along +x direction (neighbor is to the right)
		expect(force.fx).toBeGreaterThan(0);
		expect(force.fy).toBe(0);

		// Far away item has near zero repulsion
		const far = { x: 1000, y: 1000 };
		const farForce = calculateRepulsionVector(drag, far, 32, 120);
		expect(farForce.fx).toBeCloseTo(0, 1);
		expect(farForce.fy).toBeCloseTo(0, 1);
	});
});

describe('DiamondGrid — Ripple Wave & Proximity Lift Kernel', () => {
	it('calculates concentric ripple wave elevation with spatial and temporal decay', async () => {
		const { calculateConcentricRipple } = await import('../../packages/layouts/src/DiamondGrid/diamond-layout');

		expect(calculateConcentricRipple(2, 2, 2, 2, 0)).toBe(0); // at t=0

		// Wave propagates to neighbor at t > 0
		const wave = calculateConcentricRipple(2, 3, 2, 2, 0.2);
		expect(typeof wave).toBe('number');
		expect(Number.isFinite(wave)).toBe(true);

		// At long time, decays to 0
		const decayed = calculateConcentricRipple(2, 2, 2, 2, 5.0);
		expect(decayed).toBeCloseTo(0, 1);
	});

	it('calculates cursor proximity elevation lift along isometric axis', async () => {
		const { calculateIsometricLift } = await import('../../packages/layouts/src/DiamondGrid/diamond-layout');

		// Directly on tile center -> maximum lift
		const directLift = calculateIsometricLift(100, 100, 100, 100, 18, 90);
		expect(directLift).toBe(18);

		// At distance R (90px) -> lift is half (18 / (1 + 1) = 9)
		const halfLift = calculateIsometricLift(190, 100, 100, 100, 18, 90);
		expect(halfLift).toBeCloseTo(9, 0);

		// Far away -> near zero
		const farLift = calculateIsometricLift(1000, 1000, 100, 100, 18, 90);
		expect(farLift).toBeLessThan(1);
	});
});

describe('CssMasonry — Stagger Delay & Zero-CLS Aspect-Ratio Kernel', () => {
	it('calculates column-phase staggered entrance delay', async () => {
		const { calculateStaggerDelay } = await import('../../packages/layouts/src/Masonry/masonry-math');

		// 3 columns: indices 0, 3, 6 are in column 0 (0ms delay)
		expect(calculateStaggerDelay(0, 3, 0, 35)).toBe(0);
		expect(calculateStaggerDelay(1, 3, 0, 35)).toBe(35);
		expect(calculateStaggerDelay(2, 3, 0, 35)).toBe(70);
		expect(calculateStaggerDelay(3, 3, 0, 35)).toBe(0); // column 0 again
		expect(calculateStaggerDelay(4, 3, 0, 35)).toBe(35);
	});

	it('preserves aspect ratio to guarantee zero Cumulative Layout Shift', async () => {
		const { calculatePreservedAspectRatio } = await import('../../packages/layouts/src/Masonry/masonry-math');

		expect(calculatePreservedAspectRatio(1920, 1080)).toBeCloseTo(16 / 9, 3);
		expect(calculatePreservedAspectRatio(800, 600)).toBeCloseTo(4 / 3, 3);
		expect(calculatePreservedAspectRatio(500, 500)).toBe(1.0);
		expect(calculatePreservedAspectRatio(0, 100)).toBe(1.0);
		expect(calculatePreservedAspectRatio(100, 0)).toBe(1.0);
	});
});

describe('AutoGrid — Smoothstep Fluid Gap & FLIP Shuffle Kernel', () => {
	it('interpolates fluid gap using cubic smoothstep curve', async () => {
		const { calculateSmoothstepGap } = await import('../../packages/layouts/src/AutoGrid/grid-math');

		// At minWidth (320px) -> minGap (12px)
		expect(calculateSmoothstepGap(320, 320, 1440, 12, 32)).toBe(12);
		expect(calculateSmoothstepGap(200, 320, 1440, 12, 32)).toBe(12);

		// At maxWidth (1440px) -> maxGap (32px)
		expect(calculateSmoothstepGap(1440, 320, 1440, 12, 32)).toBe(32);
		expect(calculateSmoothstepGap(2000, 320, 1440, 12, 32)).toBe(32);

		// At midpoint (880px) -> midpoint gap (22px) because smoothstep(0.5) = 0.5
		expect(calculateSmoothstepGap(880, 320, 1440, 12, 32)).toBe(22);
	});

	it('computes grid cell coordinates and FLIP shuffle inversion vectors', async () => {
		const { calculateGridCellCoordinates, calculateFlipShuffleDelta } = await import(
			'../../packages/layouts/src/AutoGrid/grid-math'
		);

		// 3 columns, 100px width, 50px height, 10px gap
		const cell0 = calculateGridCellCoordinates(0, 3, 100, 50, 10);
		expect(cell0).toEqual({ x: 0, y: 0 });

		const cell1 = calculateGridCellCoordinates(1, 3, 100, 50, 10);
		expect(cell1).toEqual({ x: 110, y: 0 });

		const cell3 = calculateGridCellCoordinates(3, 3, 100, 50, 10); // row 1, col 0
		expect(cell3).toEqual({ x: 0, y: 60 });

		// Shuffle delta from cell 0 to cell 1: old (0,0) - new (110,0) = (-110, 0)
		const delta = calculateFlipShuffleDelta(0, 1, 3, 100, 50, 10);
		expect(delta).toEqual({ dx: -110, dy: 0 });
	});
});


