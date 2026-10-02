import { describe, it, expect } from 'vitest';
import {
	ComparisonSlider,
	calculateSplitPosition,
	calculateVerticalSplitPosition,
	generateClipPath,
	generateVerticalClipPath,
	stepSliderPosition,
	calculateIdleBreathingOffset,
	generateLoupeClipPath,
} from '../../packages/cards/src/index';
import { comparisonSliderComponent } from '../../packages/registry/src/components/comparison-slider';
import { generateComponentUsage } from '../../packages/registry/src/templates/usage-generator';

describe('Exhuma Kinetic Methodology — Comparison Slider (Big-Ω)', () => {
	it('exports ComparisonSlider and mathematical kernel from @fleect/exhuma-cards', () => {
		expect(ComparisonSlider).toBeDefined();
		expect(calculateSplitPosition).toBeDefined();
		expect(calculateVerticalSplitPosition).toBeDefined();
		expect(generateClipPath).toBeDefined();
		expect(generateVerticalClipPath).toBeDefined();
		expect(stepSliderPosition).toBeDefined();
	});

	it('computes horizontal split position with zero-width safe fallback and strict [0, 1] clamping', () => {
		// Zero width fallback
		expect(calculateSplitPosition(50, 0, 0)).toBe(0.5);

		// Center (500px wide, containerLeft 100, pointer at 350 -> dx = 250 -> 0.5)
		expect(calculateSplitPosition(350, 100, 500)).toBe(0.5);

		// 25% (pointer at 225 -> dx = 125 -> 0.25)
		expect(calculateSplitPosition(225, 100, 500)).toBe(0.25);

		// Clamp left bound (< 0)
		expect(calculateSplitPosition(50, 100, 500)).toBe(0);

		// Clamp right bound (> 1)
		expect(calculateSplitPosition(700, 100, 500)).toBe(1);
	});

	it('computes vertical split position with zero-height safe fallback and strict [0, 1] clamping', () => {
		// Zero height fallback
		expect(calculateVerticalSplitPosition(50, 0, 0)).toBe(0.5);

		// Center (400px tall, containerTop 100, pointer at 300 -> dy = 200 -> 0.5)
		expect(calculateVerticalSplitPosition(300, 100, 400)).toBe(0.5);

		// 75% (pointer at 400 -> dy = 300 -> 0.75)
		expect(calculateVerticalSplitPosition(400, 100, 400)).toBe(0.75);

		// Clamp top bound (< 0)
		expect(calculateVerticalSplitPosition(50, 100, 400)).toBe(0);

		// Clamp bottom bound (> 1)
		expect(calculateVerticalSplitPosition(600, 100, 400)).toBe(1);
	});

	it('generates mathematically precise GPU clip-path polygons for horizontal and vertical splits', () => {
		expect(generateClipPath(0.5)).toBe('polygon(0 0, 50.000% 0, 50.000% 100%, 0 100%)');
		expect(generateClipPath(0.33333)).toBe('polygon(0 0, 33.333% 0, 33.333% 100%, 0 100%)');

		expect(generateVerticalClipPath(0.5)).toBe('polygon(0 0, 100% 0, 100% 50.000%, 0 50.000%)');
		expect(generateVerticalClipPath(0.8)).toBe('polygon(0 0, 100% 0, 100% 80.000%, 0 80.000%)');
	});

	it('steps slider position discrete increments with default and custom delta steps', () => {
		// Increase
		expect(stepSliderPosition(0.5, 0.05)).toBeCloseTo(0.55, 5);
		expect(stepSliderPosition(0.5, 0.1)).toBeCloseTo(0.6, 5);

		// Decrease
		expect(stepSliderPosition(0.5, -0.05)).toBeCloseTo(0.45, 5);
		expect(stepSliderPosition(0.5, -0.1)).toBeCloseTo(0.4, 5);

		// Boundary clamps
		expect(stepSliderPosition(0.98, 0.05)).toBe(1);
		expect(stepSliderPosition(0.02, -0.05)).toBe(0);
	});

	it('validates comparison-slider registry component definition and default props', () => {
		expect(comparisonSliderComponent.id).toBe('comparison-slider');
		expect(comparisonSliderComponent.defaultProps.defaultPosition).toBe(0.5);
		expect(comparisonSliderComponent.defaultProps.step).toBe(0.05);
		expect(comparisonSliderComponent.defaultProps.orientation).toBe('horizontal');

		const orientationProp = comparisonSliderComponent.props.find((p) => p.name === 'orientation');
		expect(orientationProp).toBeDefined();
		expect(orientationProp?.type).toBe('select');
		const optionValues = orientationProp?.options?.map((o) => (typeof o === 'string' ? o : o.value));
		expect(optionValues).toContain('horizontal');
		expect(optionValues).toContain('vertical');
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
			const files = comparisonSliderComponent.generateCode(flavor, comparisonSliderComponent.defaultProps);
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
			const usage = generateComponentUsage(comparisonSliderComponent, flavor, {
				defaultPosition: 0.5,
				step: 0.05,
				orientation: 'horizontal',
			});

			expect(usage.filename).toBeDefined();
			expect(usage.language).toBeDefined();
			expect(usage.code.toLowerCase()).toMatch(/comparison-?slider/);
			expect(usage.code.length).toBeGreaterThan(100);
		}
	});

	it('computes sinusoidal idle breathing offset', () => {
		// At t = 0, sin(0) = 0
		expect(calculateIdleBreathingOffset(0, 0.05, 0.5)).toBe(0);

		// At t = 0.5s with freq = 0.5Hz: 2*PI*0.5*0.5 = 0.5*PI -> sin(PI/2) = 1 -> peak amplitude
		expect(calculateIdleBreathingOffset(0.5, 0.05, 0.5)).toBeCloseTo(0.05, 4);

		// At t = 1.0s: sin(PI) = 0
		expect(calculateIdleBreathingOffset(1.0, 0.05, 0.5)).toBeCloseTo(0, 4);

		// At t = 1.5s: sin(3PI/2) = -1 -> negative peak amplitude
		expect(calculateIdleBreathingOffset(1.5, 0.05, 0.5)).toBeCloseTo(-0.05, 4);
	});

	it('generates circular magnifying loupe clip-path polygon', () => {
		const loupe = generateLoupeClipPath(50, 40, 120);
		expect(loupe).toBe('circle(120px at 50.00% 40.00%)');
	});
});
