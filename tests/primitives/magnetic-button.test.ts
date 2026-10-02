import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { calculateMagneticPull, calculateMultiLayerDetachment, calculateShockwaveProgress, calculateShockwaveOrigin } from '../../packages/core/src/MagneticButton/magnetic-math';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@fleect/exhuma-registry';

const component = getComponentBySlug('magnetic-button')!;

describe('MagneticButton — Mathematical Foundations & Vector Kinetics', () => {
	it('calculates zero pull displacement when pointer is outside influence radius', () => {
		const res = calculateMagneticPull(300, 300, 100, 100, 120, 0.4, 40);
		expect(res.isInside).toBe(false);
		expect(res.x).toBe(0);
		expect(res.y).toBe(0);
	});

	it('calculates zero pull displacement when pointer is exactly at element center', () => {
		const res = calculateMagneticPull(100, 100, 100, 100, 120, 0.4, 40);
		expect(res.isInside).toBe(true);
		expect(res.x).toBe(0);
		expect(res.y).toBe(0);
		expect(res.distance).toBe(0);
	});

	it('calculates smooth attenuated pull when pointer is within radius', () => {
		// dx = 60, dy = 0, distance = 60, radius = 120
		// attenuation = 1 - 60/120 = 0.5
		// pullX = 60 * 0.4 * 0.5 = 12
		const res = calculateMagneticPull(160, 100, 100, 100, 120, 0.4, 40);
		expect(res.isInside).toBe(true);
		expect(res.distance).toBe(60);
		expect(res.x).toBeCloseTo(12, 4);
		expect(res.y).toBeCloseTo(0, 4);
	});

	it('strictly clamps vector displacement to maxDisplacement ceiling', () => {
		// dx = 100, dy = 0, radius = 200, strength = 0.8, maxDisplacement = 25
		// attenuation = 1 - 100/200 = 0.5
		// raw pullX = 100 * 0.8 * 0.5 = 40 (> maxDisplacement of 25)
		const res = calculateMagneticPull(200, 100, 100, 100, 200, 0.8, 25);
		expect(res.isInside).toBe(true);
		expect(Math.hypot(res.x, res.y)).toBeCloseTo(25, 4);
		expect(res.x).toBeCloseTo(25, 4);
		expect(res.y).toBeCloseTo(0, 4);
	});

	it('handles diagonal vector displacement clamping uniformly across x and y', () => {
		// dx = 100, dy = 100, maxDisplacement = 30
		const res = calculateMagneticPull(200, 200, 100, 100, 300, 0.8, 30);
		expect(res.isInside).toBe(true);
		const totalMagnitude = Math.hypot(res.x, res.y);
		expect(totalMagnitude).toBeCloseTo(30, 4);
		expect(res.x).toBeCloseTo(res.y, 4);
	});

	it('handles non-finite, NaN, and negative radius gracefully without throwing', () => {
		expect(calculateMagneticPull(NaN, 100, 100, 100, 120, 0.4, 40).isInside).toBe(false);
		expect(calculateMagneticPull(100, 100, 100, 100, -50, 0.4, 40).isInside).toBe(false);
		expect(calculateMagneticPull(100, 100, 100, 100, 0, 0.4, 40).isInside).toBe(false);
	});

	it('computes dual-tier Apple iPadOS multi-layer magnetic detachment', () => {
		// Pointer at (160, 100), center at (100, 100), radius = 120
		// Base pull displacement: dx = 60, attenuation = 0.5 -> pull = 30
		// Housing displacement: 30 * 0.25 = 7.5
		// Content displacement: 30 * 0.65 = 19.5
		const res = calculateMultiLayerDetachment(160, 100, 100, 100, 120, 0.25, 0.65);
		expect(res.isInside).toBe(true);
		expect(res.housing.x).toBe(7.5);
		expect(res.housing.y).toBe(0);
		expect(res.content.x).toBe(19.5);
		expect(res.content.y).toBe(0);

		// Outside radius
		const out = calculateMultiLayerDetachment(300, 300, 100, 100, 120, 0.25, 0.65);
		expect(out.isInside).toBe(false);
		expect(out.housing).toEqual({ x: 0, y: 0 });
		expect(out.content).toEqual({ x: 0, y: 0 });
	});

	it('computes radial shockwave radius expansion and opacity decay on click', () => {
		// At t = 0
		expect(calculateShockwaveProgress(0)).toEqual({ radius: 0, opacity: 0.8 });

		// At t = 175ms (halfway of 350ms)
		const mid = calculateShockwaveProgress(175, 60, 350);
		expect(mid.radius).toBeGreaterThan(0);
		expect(mid.radius).toBeLessThan(60);
		expect(mid.opacity).toBeCloseTo(0.4, 1);

		// At t = 350ms (complete)
		expect(calculateShockwaveProgress(350, 60, 350)).toEqual({ radius: 60, opacity: 0 });
	});

	it('calculates shockwave origin coordinates at the exact click point and compensates for scale', () => {
		// Button rect: left = 100, top = 50, width = 200, height = 40
		// Pointer click at (150, 60) -> clickX = 50, clickY = 10
		const origin = calculateShockwaveOrigin(150, 60, 100, 50, 200, 40);
		expect(origin.x).toBe(50);
		expect(origin.y).toBe(10);
		expect(origin.maxRadius).toBe(56);

		// With active scale compression (scale = 0.95):
		// Pointer click at (147.5, 59.5) -> clickX = 47.5 / 0.95 = 50, clickY = 9.5 / 0.95 = 10
		const scaled = calculateShockwaveOrigin(147.5, 59.5, 100, 50, 200, 40, 56, 0.95, 0.95);
		expect(scaled.x).toBe(50);
		expect(scaled.y).toBe(10);

		// Non-finite fallback defaults to center (width / 2, height / 2)
		const fallback = calculateShockwaveOrigin(NaN, NaN, 100, 50, 200, 40);
		expect(fallback.x).toBe(100);
		expect(fallback.y).toBe(20);
		expect(fallback.maxRadius).toBe(56);
	});
});

describe('MagneticButton — 13 Ecosystems Code Generation & Packaging', () => {
	it('component exists in universal registry with valid metadata and props', () => {
		expect(component).toBeDefined();
		expect(component?.id).toBe('magnetic-button');
		expect(component?.slug).toBe('magnetic-button');
		expect(component?.props.some((p) => p.name === 'maxDisplacement')).toBe(true);
		expect(component?.props.some((p) => p.name === 'text')).toBe(true);
	});

	const customProps = {
		strength: 0.5,
		radius: 150,
		springDamping: 22,
		maxDisplacement: 45,
		text: 'Launch Console',
	};

	SUPPORTED_ECOSYSTEMS.forEach((flavor) => {
		it(`generates clean wrapper for ${flavor}`, () => {
			const files = component!.generateCode(flavor as EcosystemFlavor, customProps, { eject: false });
			expect(files.length).toBeGreaterThan(0);
			expect(files[0].code.length).toBeGreaterThan(50);
		});

		it(`generates ejected engine for ${flavor}`, () => {
			const files = component!.generateCode(flavor as EcosystemFlavor, customProps, { eject: true });
			expect(files.length).toBeGreaterThan(0);
			expect(files[0].code.length).toBeGreaterThan(50);
		});

		it(`generates idiomatic usage documentation for ${flavor}`, () => {
			const usage = generateComponentUsage(component!, flavor as EcosystemFlavor, customProps);
			expect(usage).toBeDefined();
			expect(usage.code.length).toBeGreaterThan(50);
		});
	});
});

describe('MagneticButton — Canonical JSON Synchronization', () => {
	it('canonical.json contains updated magnetic-button standard and ejected files', () => {
		const canonicalPath = resolve(__dirname, '../../packages/cli/src/registry/canonical.json');
		const canonicalData = JSON.parse(readFileSync(canonicalPath, 'utf-8'));
		const standard = canonicalData['magnetic-button'];
		const ejected = canonicalData['magnetic-button:ejected'];

		expect(standard).toBeDefined();
		expect(ejected).toBeDefined();
		expect(standard.react.length).toBeGreaterThan(0);
		expect(ejected.react.length).toBeGreaterThan(0);
	});

	it('showcase public registry JSON matches component metadata and generated files', () => {
		const publicPath = resolve(__dirname, '../../apps/showcase/public/registry/magnetic-button.json');
		const publicData = JSON.parse(readFileSync(publicPath, 'utf-8'));

		expect(publicData.slug).toBe('magnetic-button');
		expect(publicData.props.some((p: { name: string }) => p.name === 'maxDisplacement')).toBe(true);
		expect(publicData.props.some((p: { name: string }) => p.name === 'text')).toBe(true);

		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(publicData.flavors[flavor].length).toBeGreaterThan(0);
			expect(publicData.ejected[flavor].length).toBeGreaterThan(0);
		}
	});

	it('keeps non-React framework sources independent from @fleect/exhuma in ejected mode', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((f) => f !== 'react' && f !== 'nextjs')) {
			const files = component!.generateCode(flavor as EcosystemFlavor, component!.defaultProps, { eject: true });
			for (const file of files) {
				expect(file.code).not.toContain('@fleect/exhuma');
			}
		}
	});
});

