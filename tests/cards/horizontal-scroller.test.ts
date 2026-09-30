import { describe, it, expect } from 'vitest';
import {
	calculateHorizontalDistance,
	calculateSectionHeight,
	calculateScrollProgress,
	HorizontalScroller,
} from '@exhuma/cards';
import * as core from '@exhuma/core';

describe('@exhuma/cards — HorizontalScroller Physics & Geometry', () => {
	it('exports HorizontalScroller and mathematical functions from @exhuma/cards', () => {
		expect(HorizontalScroller).toBeDefined();
		expect(calculateHorizontalDistance).toBeDefined();
		expect(calculateSectionHeight).toBeDefined();
		expect(calculateScrollProgress).toBeDefined();
	});

	it('re-exports calculation functions through @exhuma/core', () => {
		expect(core.calculateHorizontalDistance).toBeDefined();
		expect(core.calculateSectionHeight).toBeDefined();
		expect(core.calculateScrollProgress).toBeDefined();
		expect(core.HorizontalScroller).toBeDefined();
	});

	describe('calculateHorizontalDistance', () => {
		it('computes exact scrollable overflow plus padding', () => {
			// trackWidth: 3200px, containerWidth: 1200px, extraPadding: 60px
			const dist = calculateHorizontalDistance(3200, 1200, 60);
			expect(dist).toBe(2060);
		});

		it('uses default extraPadding = 60 when omitted', () => {
			const dist = calculateHorizontalDistance(2400, 1000);
			expect(dist).toBe(1460);
		});

		it('returns extraPadding when trackWidth equals containerWidth', () => {
			const dist = calculateHorizontalDistance(1000, 1000, 50);
			expect(dist).toBe(50);
		});

		it('never returns negative distance even if track is smaller than container', () => {
			const dist = calculateHorizontalDistance(800, 1200, 0);
			expect(dist).toBe(0);
		});
	});

	describe('calculateSectionHeight', () => {
		it('computes pinned section height inversely proportional to speed', () => {
			const viewportHeight = 800;
			const distance = 1200;

			// speed = 1.0 -> 800 + 1200 = 2000
			expect(calculateSectionHeight(viewportHeight, distance, 1.0)).toBe(2000);

			// speed = 2.0 (faster horizontal scroll = shorter vertical pinning) -> 800 + 600 = 1400
			expect(calculateSectionHeight(viewportHeight, distance, 2.0)).toBe(1400);

			// speed = 0.5 (slower horizontal scroll = longer vertical pinning) -> 800 + 2400 = 3200
			expect(calculateSectionHeight(viewportHeight, distance, 0.5)).toBe(3200);
		});

		it('defaults speed to 1.0 when unspecified', () => {
			const viewportHeight = 1000;
			const distance = 1000;
			const expected = 1000 + 1000;
			expect(calculateSectionHeight(viewportHeight, distance)).toBe(expected);
		});

		it('handles edge case of zero distance', () => {
			expect(calculateSectionHeight(800, 0, 1.0)).toBe(800);
		});

		it('guards against non-positive speed by clamping to 0.1 safe minimum', () => {
			const viewportHeight = 900;
			const distance = 850;
			// 900 + 850 / 0.1 = 9400
			expect(calculateSectionHeight(viewportHeight, distance, 0)).toBe(9400);
			expect(calculateSectionHeight(viewportHeight, distance, -1)).toBe(9400);
		});
	});

	describe('calculateScrollProgress', () => {
		it('calculates 0 progress at top of container', () => {
			expect(calculateScrollProgress(0, 1000)).toBe(0);
		});

		it('calculates 0.5 progress midway through scroll', () => {
			expect(calculateScrollProgress(500, 1000)).toBe(0.5);
		});

		it('calculates 1.0 progress at terminal scroll', () => {
			expect(calculateScrollProgress(1000, 1000)).toBe(1.0);
		});

		it('clamps overscroll up (negative scrolled) to 0', () => {
			expect(calculateScrollProgress(-150, 1000)).toBe(0);
		});

		it('clamps overscroll down (scrolled > maxScroll) to 1.0', () => {
			expect(calculateScrollProgress(1250, 1000)).toBe(1.0);
		});

		it('safely returns 0 when maxScroll is 0 or negative', () => {
			expect(calculateScrollProgress(100, 0)).toBe(0);
			expect(calculateScrollProgress(100, -50)).toBe(0);
		});
	});
});
