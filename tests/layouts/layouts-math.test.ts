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

