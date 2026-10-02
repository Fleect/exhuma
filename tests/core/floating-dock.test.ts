import { describe, it, expect } from 'vitest';
import {
	FloatingDock,
	DockItem,
	DockIcon,
	DockLabel,
	calculateDockScale,
	calculateGaussianScale,
	calculateDockItemSize,
	lerpDockScale,
	dampDockScale,
	calculateDockDistance,
	isApexProximity,
	type DockDirection,
} from '@fleect/exhuma';
import { floatingDockComponent } from '@fleect/exhuma-registry';

describe('@fleect/exhuma — FloatingDock Physics & Parity Engine', () => {
	it('exports FloatingDock and all compound subcomponents from @fleect/exhuma', () => {
		expect(FloatingDock).toBeDefined();
		expect(FloatingDock.Root).toBeDefined();
		expect(FloatingDock.Item).toBeDefined();
		expect(FloatingDock.Icon).toBeDefined();
		expect(FloatingDock.Label).toBeDefined();
		expect(DockItem).toBeDefined();
		expect(DockIcon).toBeDefined();
		expect(DockLabel).toBeDefined();
	});

	it('exports Cosine Bell and Gaussian proximity mathematics', () => {
		expect(calculateDockScale).toBeDefined();
		expect(calculateGaussianScale).toBeDefined();
		expect(calculateDockItemSize).toBeDefined();
		expect(lerpDockScale).toBeDefined();
		expect(dampDockScale).toBeDefined();
	});

	describe('calculateDockScale (C1 Continuous Cosine Bell)', () => {
		it('returns maximum scale multiplier at zero distance', () => {
			const scale = calculateDockScale(0, 85, 0.65);
			expect(scale).toBeCloseTo(1.65, 4);
		});

		it('returns 1.0 when distance equals or exceeds influenceRadius', () => {
			expect(calculateDockScale(85, 85, 0.65)).toBe(1.0);
			expect(calculateDockScale(100, 85, 0.65)).toBe(1.0);
		});

		it('handles signed negative distances identically via absolute value defense', () => {
			expect(calculateDockScale(-30, 85, 0.65)).toBeCloseTo(calculateDockScale(30, 85, 0.65), 5);
			expect(calculateDockScale(-100, 85, 0.65)).toBe(1.0);
		});

		it('handles non-positive influenceRadius safely', () => {
			expect(calculateDockScale(20, 0, 0.65)).toBe(1.0);
			expect(calculateDockScale(20, -10, 0.65)).toBe(1.0);
		});
	});

	describe('calculateGaussianScale', () => {
		it('returns maximum scale multiplier at zero distance (pointer over item center)', () => {
			const scale = calculateGaussianScale(0, 70, 0.65);
			expect(scale).toBeCloseTo(1.65, 4);
		});

		it('returns 1.0 when distance exceeds asymptotic cutoff threshold (2.5 * influenceRadius)', () => {
			const scale = calculateGaussianScale(200, 70, 0.65);
			expect(scale).toBe(1.0);
		});

		it('decays monotonically as distance increases', () => {
			const s0 = calculateGaussianScale(0, 80, 0.6);
			const s20 = calculateGaussianScale(20, 80, 0.6);
			const s40 = calculateGaussianScale(40, 80, 0.6);
			const s80 = calculateGaussianScale(80, 80, 0.6);
			const s160 = calculateGaussianScale(160, 80, 0.6);

			expect(s0).toBeGreaterThan(s20);
			expect(s20).toBeGreaterThan(s40);
			expect(s40).toBeGreaterThan(s80);
			expect(s80).toBeGreaterThan(s160);
			expect(s160).toBeGreaterThanOrEqual(1.0);
		});

		it('handles edge case when influenceRadius <= 0 safely', () => {
			expect(calculateGaussianScale(10, 0, 0.6)).toBe(1.0);
			expect(calculateGaussianScale(10, -5, 0.6)).toBe(1.0);
		});
	});

	describe('calculateDockItemSize', () => {
		it('computes exact magnified item dimension in pixels', () => {
			const baseSize = 44;
			const maxMag = 0.65;
			const sizeAtZero = calculateDockItemSize(0, baseSize, 80, maxMag);
			expect(sizeAtZero).toBeCloseTo(44 * 1.65, 3);
		});

		it('returns baseSize at distant proximity', () => {
			const baseSize = 44;
			const sizeAtDistance = calculateDockItemSize(300, baseSize, 80, 0.65);
			expect(sizeAtDistance).toBe(baseSize);
		});
	});

	describe('lerpDockScale', () => {
		it('smoothly interpolates towards target', () => {
			const current = 1.0;
			const target = 1.65;
			const next = lerpDockScale(current, target, 0.2);
			expect(next).toBeGreaterThan(1.0);
			expect(next).toBeLessThan(1.65);
			expect(next).toBeCloseTo(1.0 + (1.65 - 1.0) * 0.2, 4);
		});

		it('snaps to target when within threshold delta (< 0.002)', () => {
			const snapped = lerpDockScale(1.649, 1.65, 0.2);
			expect(snapped).toBe(1.65);
		});
	});

	describe('dampDockScale (Delta-t aware decay)', () => {
		it('smoothly dampens current towards target based on dt', () => {
			const current = 1.0;
			const target = 1.65;
			const next = dampDockScale(current, target, 24, 0.016);
			expect(next).toBeGreaterThan(1.0);
			expect(next).toBeLessThan(1.65);
		});

		it('achieves frame-rate independence by decaying more on longer frame times', () => {
			const current = 1.0;
			const target = 1.65;
			const at60Hz = dampDockScale(current, target, 24, 1 / 60);
			const at30Hz = dampDockScale(current, target, 24, 1 / 30);
			expect(at30Hz).toBeGreaterThan(at60Hz);
		});

		it('snaps to target when within threshold delta (< 0.002)', () => {
			const snapped = dampDockScale(1.649, 1.65, 24, 0.016);
			expect(snapped).toBe(1.65);
		});
	});

	describe('Registry Specification & Ecosystem Parity', () => {
		it('defines direction prop with 4 valid orientations', () => {
			const dirProp = floatingDockComponent.props.find((p) => p.name === 'direction');
			expect(dirProp).toBeDefined();
			expect(dirProp?.type).toBe('select');
			expect(dirProp?.defaultValue).toBe('bottom');
			expect(dirProp?.options).toEqual([
				{ label: 'Bottom (Default)', value: 'bottom' },
				{ label: 'Top Bar', value: 'top' },
				{ label: 'Left Rail', value: 'left' },
				{ label: 'Right Rail', value: 'right' },
			]);
		});

		it('generates outer files across React and Vue with direction prop', () => {
			const reactFiles = floatingDockComponent.generateCode('react', { direction: 'left', baseSize: 48 });
			expect(reactFiles.length).toBeGreaterThan(0);
			expect(reactFiles[0].code).toContain("direction = 'left'");

			const vueFiles = floatingDockComponent.generateCode('vue', { direction: 'top' });
			expect(vueFiles.length).toBeGreaterThan(0);
			expect(vueFiles[0].code).toContain("direction: 'top'");
		});

		it('defines showLabels and panelStyle props', () => {
			const labelProp = floatingDockComponent.props.find((p) => p.name === 'showLabels');
			expect(labelProp).toBeDefined();
			expect(labelProp?.type).toBe('boolean');
			expect(labelProp?.defaultValue).toBe(true);

			const styleProp = floatingDockComponent.props.find((p) => p.name === 'panelStyle');
			expect(styleProp).toBeDefined();
			expect(styleProp?.type).toBe('select');
			expect(styleProp?.defaultValue).toBe('translucent');
		});

		it('supports all 13 supported ecosystems for outer files and usage examples', () => {
			const flavors = [
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

			for (const flavor of flavors) {
				const files = floatingDockComponent.generateCode(flavor, { direction: 'right', baseSize: 40, showLabels: true, panelStyle: 'glass' });
				expect(files.length).toBeGreaterThan(0);
				expect(files[0].code.length).toBeGreaterThan(50);
			}
		});

		it('calculates 1D dock distance along orientation axis and detects apex proximity for haptics', () => {
			// Item starting at 100 with width 40 -> center at 120
			expect(calculateDockDistance(120, 100, 40)).toBe(0);
			expect(isApexProximity(0)).toBe(true);

			// Pointer at 124 -> distance 4 (within 6px apex threshold)
			const nearDist = calculateDockDistance(124, 100, 40);
			expect(nearDist).toBe(4);
			expect(isApexProximity(nearDist, 6)).toBe(true);

			// Pointer at 140 -> distance 20 (outside apex threshold)
			const farDist = calculateDockDistance(140, 100, 40);
			expect(farDist).toBe(20);
			expect(isApexProximity(farDist, 6)).toBe(false);
		});
	});
});
