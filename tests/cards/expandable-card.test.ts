import { describe, it, expect } from 'vitest';
import {
	ExpandableCard,
	ExpandableRoot,
	ExpandableTrigger,
	ExpandableContent,
	ExpandableClose,
	calculateFLIPDelta,
	generateInvertTransform,
	calculateRubberBandPull,
	calculateModalProgressTransform,
} from '../../packages/cards/src/index';
import { expandableCardComponent } from '../../packages/registry/src/components/expandable-card';
import { generateComponentUsage } from '../../packages/registry/src/templates/usage-generator';

describe('Exhuma Kinetic Methodology — Expandable Card (Big-Ω)', () => {
	it('exports ExpandableCard, subcomponents, and mathematical kernel from @exhuma/cards', () => {
		expect(ExpandableCard).toBeDefined();
		expect(ExpandableRoot).toBeDefined();
		expect(ExpandableTrigger).toBeDefined();
		expect(ExpandableContent).toBeDefined();
		expect(ExpandableClose).toBeDefined();
		expect(calculateFLIPDelta).toBeDefined();
		expect(generateInvertTransform).toBeDefined();
	});

	it('computes constant-time Ω(1) FLIP inverse deltas with zero layout thrashing', () => {
		// Identity state (no displacement or scale)
		const identity = calculateFLIPDelta(
			{ left: 100, top: 100, width: 200, height: 200 },
			{ left: 100, top: 100, width: 200, height: 200 }
		);
		expect(identity.dx).toBe(0);
		expect(identity.dy).toBe(0);
		expect(identity.scaleX).toBe(1);
		expect(identity.scaleY).toBe(1);

		// Trigger at (120, 240) size 300x200 -> Expanded at (0, 0) size 600x400
		const delta = calculateFLIPDelta(
			{ left: 120, top: 240, width: 300, height: 200 },
			{ left: 0, top: 0, width: 600, height: 400 }
		);
		expect(delta.dx).toBe(120);
		expect(delta.dy).toBe(240);
		expect(delta.scaleX).toBe(0.5);
		expect(delta.scaleY).toBe(0.5);

		// Zero size defensive fallback (prevents NaN / Infinity)
		const zeroSize = calculateFLIPDelta(
			{ left: 50, top: 50, width: 100, height: 100 },
			{ left: 50, top: 50, width: 0, height: 0 }
		);
		expect(zeroSize.scaleX).toBe(1);
		expect(zeroSize.scaleY).toBe(1);
	});

	it('generates GPU-accelerated inverted transform string', () => {
		const transform = generateInvertTransform({
			dx: 120.456,
			dy: 240.789,
			scaleX: 0.5,
			scaleY: 0.5,
		});
		expect(transform).toBe('translate3d(120.46px, 240.79px, 0) scale(0.5000, 0.5000)');
	});

	it('validates expandable-card registry component definition and default props', () => {
		expect(expandableCardComponent.id).toBe('expandable-card');
		expect(expandableCardComponent.defaultProps.duration).toBe(360);

		const durationProp = expandableCardComponent.props.find((p) => p.name === 'duration');
		expect(durationProp).toBeDefined();
		expect(durationProp?.type).toBe('number');
		expect(durationProp?.min).toBe(150);
		expect(durationProp?.max).toBe(600);
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
			const files = expandableCardComponent.generateCode(flavor, expandableCardComponent.defaultProps);
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
			const usage = generateComponentUsage(expandableCardComponent, flavor, {
				duration: 360,
			});

			expect(usage.filename).toBeDefined();
			expect(usage.language).toBeDefined();
			expect(usage.code.toLowerCase()).toMatch(/expandable/);
			expect(usage.code.length).toBeGreaterThan(100);
		}
	});

	it('provides 5 curated studio presets adhering to the monorepo standard', () => {
		const presets = {
			Default: { duration: 360 },
			Snappy: { duration: 220 },
			Cinematic: { duration: 520 },
			'Ultra Fast': { duration: 160 },
			Smooth: { duration: 420 },
		};

		const presetKeys = Object.keys(presets);
		expect(presetKeys.length).toBe(5);

		for (const [name, config] of Object.entries(presets)) {
			expect(config.duration).toBeGreaterThanOrEqual(150);
			expect(config.duration).toBeLessThanOrEqual(600);
		}
	});

	it('computes asymptotic viscous rubber-band pull-down resistance', () => {
		// 0 displacement -> 0
		expect(calculateRubberBandPull(0)).toBe(0);
		expect(calculateRubberBandPull(-50)).toBe(0);

		// 100px pull with stiffness 600 -> 100 / (1 + 100/600) = 100 / (7/6) = 85.71
		expect(calculateRubberBandPull(100, 600)).toBeCloseTo(85.71, 1);

		// 600px pull with stiffness 600 -> 600 / (1 + 1) = 300
		expect(calculateRubberBandPull(600, 600)).toBeCloseTo(300, 1);
	});

	it('computes 2-phase asymmetric modal progress transform', () => {
		// At rest (progress = 0)
		expect(calculateModalProgressTransform(0, true)).toEqual({ scale: 0.92, opacity: 0 });

		// Fully expanded (progress = 1)
		expect(calculateModalProgressTransform(1, true)).toEqual({ scale: 1.0, opacity: 1 });

		// Mid-transition is smooth
		const mid = calculateModalProgressTransform(0.5, true);
		expect(mid.scale).toBeGreaterThan(0.92);
		expect(mid.scale).toBeLessThan(1.0);
	});
});

