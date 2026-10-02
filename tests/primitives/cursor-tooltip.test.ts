import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	calculateTargetPosition,
	clampTooltipToViewport,
	calculateSigmoidClamp,
	dampCursorCoordinate,
	calculateMagneticSnap,
	calculateSelectionCenter,
} from '../../packages/core/src/CursorTooltip/cursor-math';
import { generateComponentUsage, getComponentBySlug, SUPPORTED_ECOSYSTEMS, type EcosystemFlavor } from '@fleect/exhuma-registry';

const component = getComponentBySlug('cursor-tooltip')!;

describe('CursorTooltip — Mathematical Foundations & Vector Kinetics', () => {
	it('calculates target position with horizontal and vertical offsets', () => {
		const target = calculateTargetPosition(200, 350, 16, 20);
		expect(target.x).toBe(216);
		expect(target.y).toBe(370);
	});

	it('handles negative or zero offsets safely', () => {
		const target = calculateTargetPosition(100, 100, 0, -10);
		expect(target.x).toBe(100);
		expect(target.y).toBe(90);
	});

	it('exponential damp decays asymptotically towards target over delta-t', () => {
		const current = 100;
		const target = 200;
		const lambda = 20;
		const dt = 1 / 60; // ~0.0166s

		const next = dampCursorCoordinate(current, target, lambda, dt);
		expect(next).toBeGreaterThan(current);
		expect(next).toBeLessThan(target);

		// Multiple steps converge
		let stepped = current;
		for (let i = 0; i < 60; i++) {
			stepped = dampCursorCoordinate(stepped, target, lambda, dt);
		}
		expect(stepped).toBeCloseTo(target, 1);
	});

	it('returns target coordinate immediately when delta-t is large or instant', () => {
		const result = dampCursorCoordinate(100, 250, 20, 10);
		expect(result).toBeCloseTo(250, 4);
	});

	it('returns current coordinate when delta-t is zero', () => {
		const result = dampCursorCoordinate(100, 250, 20, 0);
		expect(result).toBe(100);
	});

	it('handles non-finite or negative lambda safely without jumping', () => {
		expect(dampCursorCoordinate(100, 200, -5, 0.016)).toBe(200);
		expect(dampCursorCoordinate(100, 200, NaN, 0.016)).toBe(200);
	});

	it('clamps tooltip within viewport boundaries factoring collision padding', () => {
		const viewportWidth = 1920;
		const viewportHeight = 1080;
		const tooltipWidth = 160;
		const tooltipHeight = 40;
		const padding = 12;

		// Inside viewport
		const inside = clampTooltipToViewport(500, 400, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(inside.x).toBe(500);
		expect(inside.y).toBe(400);

		// Right edge overflow
		const rightOver = clampTooltipToViewport(1900, 400, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(rightOver.x).toBe(viewportWidth - tooltipWidth - padding);

		// Bottom edge overflow
		const bottomOver = clampTooltipToViewport(500, 1070, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(bottomOver.y).toBe(viewportHeight - tooltipHeight - padding);

		// Top-left negative boundary overflow
		const topOver = clampTooltipToViewport(-20, -10, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(topOver.x).toBe(padding);
		expect(topOver.y).toBe(padding);
	});

	it('cushions coordinates with smooth sigmoid boundary clamping near edges', () => {
		const tooltipWidth = 120;
		const tooltipHeight = 40;
		const viewportWidth = 1920;
		const viewportHeight = 1080;
		const padding = 12;

		// Inside safe zone -> exact 1:1 match
		const safe = calculateSigmoidClamp(500, 400, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(safe.x).toBe(500);
		expect(safe.y).toBe(400);

		// Soft cushioning outside right edge (does not jump to a rigid hard-stop)
		const rightOver = calculateSigmoidClamp(1900, 400, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		const maxSafeX = viewportWidth - tooltipWidth - padding;
		expect(rightOver.x).toBeGreaterThan(maxSafeX);
		expect(rightOver.x).toBeLessThan(maxSafeX + 16);

		// Soft cushioning outside left edge
		const leftOver = calculateSigmoidClamp(-20, 400, tooltipWidth, tooltipHeight, viewportWidth, viewportHeight, padding);
		expect(leftOver.x).toBeLessThan(padding);
		expect(leftOver.x).toBeGreaterThan(padding - 16);
	});

	it('calculates target positions across all 8 directions accurately', () => {
		const cx = 500;
		const cy = 300;
		const ox = 16;
		const oy = 16;
		const w = 120;
		const h = 40;

		expect(calculateTargetPosition(cx, cy, ox, oy, 'bottom-right', w, h)).toEqual({ x: 516, y: 316 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'bottom-left', w, h)).toEqual({ x: 500 - 16 - 120, y: 316 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'top-right', w, h)).toEqual({ x: 516, y: 300 - 16 - 40 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'top-left', w, h)).toEqual({ x: 500 - 16 - 120, y: 300 - 16 - 40 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'top', w, h)).toEqual({ x: 500 - 60, y: 300 - 16 - 40 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'bottom', w, h)).toEqual({ x: 500 - 60, y: 316 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'left', w, h)).toEqual({ x: 500 - 16 - 120, y: 300 - 20 });
		expect(calculateTargetPosition(cx, cy, ox, oy, 'right', w, h)).toEqual({ x: 516, y: 300 - 20 });
	});

	it('computes magnetic snapping vector when cursor is within capture radius', () => {
		// Cursor at (105, 105), target anchor at (100, 100), captureRadius 28, strength 0.5
		const snapped = calculateMagneticSnap(105, 105, 100, 100, 28, 0.5);
		expect(snapped.x).toBeLessThan(105);
		expect(snapped.x).toBeGreaterThan(100);
		expect(snapped.y).toBeLessThan(105);
		expect(snapped.y).toBeGreaterThan(100);

		// Cursor far outside capture radius -> no snap
		const outside = calculateMagneticSnap(200, 200, 100, 100, 28, 0.5);
		expect(outside.x).toBe(200);
		expect(outside.y).toBe(200);
	});

	it('computes focal center for native selection client rects', () => {
		const selectionRect = { left: 100, top: 250, right: 300, bottom: 270 };
		const center = calculateSelectionCenter(selectionRect);
		expect(center.x).toBe(200); // (100 + 300) / 2
		expect(center.y).toBe(250); // top of selection
	});
});

describe('CursorTooltip — 13 Ecosystems Code Generation & Packaging', () => {
	it('component exists in universal registry with valid metadata and rich props', () => {
		expect(component).toBeDefined();
		expect(component?.id).toBe('cursor-tooltip');
		expect(component?.slug).toBe('cursor-tooltip');
		expect(component?.props.some((p) => p.name === 'content')).toBe(true);
		expect(component?.props.some((p) => p.name === 'springDamping')).toBe(true);
		expect(component?.props.some((p) => p.name === 'direction')).toBe(true);
		expect(component?.props.some((p) => p.name === 'offsetX')).toBe(true);
		expect(component?.props.some((p) => p.name === 'offsetY')).toBe(true);
		expect(component?.props.some((p) => p.name === 'variant')).toBe(true);
		expect(component?.props.some((p) => p.name === 'collisionPadding')).toBe(true);
	});

	const customProps = {
		content: 'Live Inspector Active',
		springDamping: 24,
		direction: 'top-right',
		offsetX: 18,
		offsetY: 18,
		variant: 'glow',
		collisionPadding: 16,
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

describe('CursorTooltip — Canonical JSON Synchronization', () => {
	it('canonical.json contains updated cursor-tooltip standard and ejected files', () => {
		const canonicalPath = resolve(__dirname, '../../packages/cli/src/registry/canonical.json');
		const canonicalData = JSON.parse(readFileSync(canonicalPath, 'utf-8'));
		const standard = canonicalData['cursor-tooltip'];
		const ejected = canonicalData['cursor-tooltip:ejected'];

		expect(standard).toBeDefined();
		expect(ejected).toBeDefined();
		expect(standard.react.length).toBeGreaterThan(0);
		expect(ejected.react.length).toBeGreaterThan(0);
	});

	it('showcase public registry JSON matches component metadata and generated files', () => {
		const publicPath = resolve(__dirname, '../../apps/showcase/public/registry/cursor-tooltip.json');
		const publicData = JSON.parse(readFileSync(publicPath, 'utf-8'));

		expect(publicData.slug).toBe('cursor-tooltip');
		expect(publicData.props.some((p: { name: string }) => p.name === 'content')).toBe(true);
		expect(publicData.props.some((p: { name: string }) => p.name === 'springDamping')).toBe(true);
		expect(publicData.props.some((p: { name: string }) => p.name === 'direction')).toBe(true);
		expect(publicData.props.some((p: { name: string }) => p.name === 'variant')).toBe(true);

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
