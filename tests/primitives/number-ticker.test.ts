import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { easeOutExpo, calculateTickerValue } from '../../packages/core/src/NumberTicker/ticker-math';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@exhuma/registry';

describe('NumberTicker — Mathematical Foundations & Analytical Easing', () => {
	it('easeOutExpo strictly conforms to closed-form asymptotic curve 1 - 2^(-10t)', () => {
		expect(easeOutExpo(0)).toBe(0);
		expect(easeOutExpo(1)).toBe(1);
		expect(easeOutExpo(-0.5)).toBe(0);
		expect(easeOutExpo(1.5)).toBe(1);

		// Midpoints
		expect(easeOutExpo(0.5)).toBeCloseTo(1 - Math.pow(2, -5), 5); // 1 - 0.03125 = 0.96875
		expect(easeOutExpo(0.1)).toBeCloseTo(1 - Math.pow(2, -1), 5); // 0.5
	});

	it('strictly guarantees monotonic convergence without overshoot', () => {
		let prev = -1;
		for (let i = 0; i <= 100; i++) {
			const t = i / 100;
			const v = easeOutExpo(t);
			expect(v).toBeGreaterThanOrEqual(prev);
			expect(v).toBeLessThanOrEqual(1.0);
			prev = v;
		}
	});

	it('calculates count-up interpolation correctly', () => {
		const start = 0;
		const target = 1000;
		const duration = 2.0;

		const startStep = calculateTickerValue(start, target, 0, duration);
		expect(startStep.value).toBe(0);
		expect(startStep.isComplete).toBe(false);

		const midStep = calculateTickerValue(start, target, 0.2, duration); // 10% of duration => ease = 0.5 => 500
		expect(midStep.value).toBeCloseTo(500, 0);
		expect(midStep.isComplete).toBe(false);

		const endStep = calculateTickerValue(start, target, 2.0, duration);
		expect(endStep.value).toBe(1000);
		expect(endStep.isComplete).toBe(true);

		const overshootStep = calculateTickerValue(start, target, 3.5, duration);
		expect(overshootStep.value).toBe(1000);
		expect(overshootStep.isComplete).toBe(true);
	});

	it('calculates count-down interpolation correctly', () => {
		const start = 100;
		const target = 0;
		const duration = 1.0;

		const midStep = calculateTickerValue(start, target, 0.1, duration); // t=0.1 => ease=0.5 => 100 + (0 - 100)*0.5 = 50
		expect(midStep.value).toBeCloseTo(50, 0);
		expect(midStep.isComplete).toBe(false);

		const endStep = calculateTickerValue(start, target, 1.0, duration);
		expect(endStep.value).toBe(0);
		expect(endStep.isComplete).toBe(true);
	});

	it('handles zero and negative duration gracefully without division-by-zero or NaN', () => {
		expect(calculateTickerValue(100, 500, 0, 0).isComplete).toBe(true);
		expect(calculateTickerValue(100, 500, 0, 0).value).toBe(500);

		expect(calculateTickerValue(100, 500, 0, -1).isComplete).toBe(true);
		expect(calculateTickerValue(100, 500, 0, -1).value).toBe(500);
	});

	it('interpolates across negative number spans symmetrically', () => {
		const step = calculateTickerValue(-100, 100, 0.1, 1.0); // t=0.1 => ease=0.5 => -100 + 200*0.5 = 0
		expect(step.value).toBeCloseTo(0, 0);
		expect(step.isComplete).toBe(false);
	});

	it('interpolates fractional target values without drift', () => {
		const floatStep = calculateTickerValue(0, 99.94, 1.0, 1.0);
		expect(floatStep.value).toBe(99.94);
		expect(floatStep.isComplete).toBe(true);
	});
});

describe('NumberTicker — 13-Ecosystem Code Generation Parity', () => {
	const component = getComponentBySlug('number-ticker');
	if (!component) throw new Error('number-ticker component must be registered');

	const expectedFilenames: Record<EcosystemFlavor, string[]> = {
		react: ['NumberTicker.tsx'],
		nextjs: ['NumberTicker.tsx'],
		vue: ['NumberTicker.vue'],
		svelte: ['NumberTicker.svelte'],
		angular: ['number-ticker.component.ts'],
		solid: ['NumberTicker.tsx'],
		astro: ['NumberTicker.astro'],
		blade: ['number-ticker.blade.php'],
		vanilla: ['number-ticker.js'],
		wordpress: ['block.json', 'render.php', 'view.js'],
		webcomponent: ['exhuma-number-ticker.ts'],
		'react-native': ['NumberTicker.tsx'],
		flutter: ['number_ticker.dart'],
	};

	it('exposes correct prop schema with prefix and suffix', () => {
		const propNames = component.props.map((p) => p.name);
		expect(propNames).toContain('value');
		expect(propNames).toContain('initialValue');
		expect(propNames).toContain('duration');
		expect(propNames).toContain('decimalPlaces');
		expect(propNames).toContain('prefix');
		expect(propNames).toContain('suffix');
	});

	it('generates Angular 18+ component utilizing ngAfterViewInit for safe signal queries', () => {
		const angularCode = component.generateCode('angular', component.defaultProps)[0]?.code ?? '';
		expect(angularCode).toContain('ngAfterViewInit');
		expect(angularCode).not.toContain('ngOnInit(): void');
		expect(angularCode).toContain('AfterViewInit');
	});

	it('generates Flutter code formatted with valid Dart double literals', () => {
		const flutterCode = component.generateCode('flutter', { value: 99.94, initialValue: 0.5 })[0]?.code ?? '';
		expect(flutterCode).not.toContain('99.94.0');
		expect(flutterCode).not.toContain('0.5.0');
	});

	for (const flavor of SUPPORTED_ECOSYSTEMS) {
		it(`generates clean and ejected files for ${flavor}`, () => {
			const cleanFiles = component.generateCode(flavor, component.defaultProps, { eject: false });
			const ejectedFiles = component.generateCode(flavor, component.defaultProps, { eject: true });

			expect(cleanFiles.map((f) => f.filename)).toEqual(expectedFilenames[flavor]);
			expect(ejectedFiles.map((f) => f.filename)).toEqual(expectedFilenames[flavor]);

			for (const file of [...cleanFiles, ...ejectedFiles]) {
				expect(file.code.trim().length).toBeGreaterThan(50);
			}
		});

		it(`generates valid usage snippet for ${flavor}`, () => {
			const usage = generateComponentUsage(component, flavor, {
				value: 148500,
				prefix: '$',
				suffix: ' ARR',
				duration: 2.0,
				decimalPlaces: 0,
			});

			expect(usage.filename.length).toBeGreaterThan(0);
			expect(usage.code).toContain('148500');
			expect(usage.code).toContain('$');
			expect(usage.code).toContain('ARR');
		});
	}

	it('keeps non-React framework sources independent from @exhuma/core', () => {
		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((f) => f !== 'react' && f !== 'nextjs')) {
			const files = component.generateCode(flavor, component.defaultProps, { eject: true });
			for (const file of files) {
				expect(file.code).not.toContain('@exhuma/core');
			}
		}
	});

	it('keeps published registry artifact synchronized for both standard and ejected variants', () => {
		const artifactPath = resolve(process.cwd(), 'apps/showcase/public/registry/number-ticker.json');
		const artifact = JSON.parse(readFileSync(artifactPath, 'utf8')) as {
			flavors: Record<EcosystemFlavor, Array<{ filename: string; code: string }>>;
			ejected: Record<EcosystemFlavor, Array<{ filename: string; code: string }>>;
		};

		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(artifact.flavors[flavor]).toEqual(component.generateCode(flavor, component.defaultProps, { eject: false }));
			expect(artifact.ejected[flavor]).toEqual(component.generateCode(flavor, component.defaultProps, { eject: true }));
		}
	});
});
