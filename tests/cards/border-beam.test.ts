import { describe, it, expect } from 'vitest';
import { BorderBeam } from '../../packages/cards/src/index';
import { borderBeamComponent } from '../../packages/registry/src/components/border-beam';

describe('Exhuma Kinetic Methodology — Border Beam (Big-Ω)', () => {
	it('exports BorderBeam component from @exhuma/cards', () => {
		expect(BorderBeam).toBeDefined();
		expect(typeof BorderBeam).toBe('function');
	});

	it('validates registry definition, streamlined parameters and color picker types', () => {
		expect(borderBeamComponent.id).toBe('border-beam');
		expect(borderBeamComponent.defaultProps.size).toBe(200);
		expect(borderBeamComponent.defaultProps.duration).toBe(8);
		expect(borderBeamComponent.defaultProps.borderWidth).toBe(2);
		expect(borderBeamComponent.defaultProps.doubleBeam).toBe(false);
		expect(borderBeamComponent.defaultProps.endOpacity).toBe(0);
		expect(borderBeamComponent.defaultProps.opacity).toBe(1);
		expect(borderBeamComponent.defaultProps.blur).toBe(0);

		const sizeProp = borderBeamComponent.props.find((p) => p.name === 'size');
		expect(sizeProp?.min).toBe(50);
		expect(sizeProp?.max).toBe(400);
		expect(sizeProp?.step).toBe(10);

		const colorFromProp = borderBeamComponent.props.find((p) => p.name === 'colorFrom');
		const colorToProp = borderBeamComponent.props.find((p) => p.name === 'colorTo');
		const doubleBeamProp = borderBeamComponent.props.find((p) => p.name === 'doubleBeam');
		const endOpacityProp = borderBeamComponent.props.find((p) => p.name === 'endOpacity');
		const opacityProp = borderBeamComponent.props.find((p) => p.name === 'opacity');
		const blurProp = borderBeamComponent.props.find((p) => p.name === 'blur');
		const anchorProp = borderBeamComponent.props.find((p) => p.name === 'anchor');
		const delayProp = borderBeamComponent.props.find((p) => p.name === 'delay');

		expect(colorFromProp?.type).toBe('color');
		expect(colorToProp?.type).toBe('color');
		expect(doubleBeamProp?.type).toBe('boolean');
		expect(endOpacityProp?.type).toBe('number');
		expect(opacityProp?.type).toBe('number');
		expect(blurProp?.type).toBe('number');

		// anchor and delay are removed from the streamlined API
		expect(anchorProp).toBeUndefined();
		expect(delayProp).toBeUndefined();
	});

	it('generates React standalone ejected engine code with hardware exclusion mask, center point math, and synchronized opposing dual beams', () => {
		const files = borderBeamComponent.generateCode('react', {
			size: 180,
			duration: 6,
			doubleBeam: true,
			endOpacity: 0.3,
			opacity: 0.9,
		}, { eject: true });

		expect(files.length).toBeGreaterThan(0);
		const code = files[0]?.code ?? '';
		expect(code).toContain('export const BorderBeam');
		expect(code).toContain('exhuma-border-beam-trace');
		expect(code).toContain('color-mix(in srgb');
		expect(code).toContain('doubleBeam');
		expect(code).toContain('prefers-reduced-motion');
		// Exclusion mask prevents background bleed
		expect(code).toContain("mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)'");
		expect(code).toContain("maskComposite: 'exclude'");
		// Center point math based on size
		expect(code).toContain('offsetAnchor: `${size / 2}px ${size / 2}px`');
		expect(code).toContain('pathRadius = Math.min(size, 200)');
		// Opposing dual beam rotates in the same direction with 180° phase offset (no reverse)
		expect(code).toContain('duration / 2');
		expect(code).not.toContain('reverse');
		expect(code).toContain('offset-distance: 0%');
	});

	it('generates native Vue 3 component with dual beam in same direction and exclusion mask', () => {
		const files = borderBeamComponent.generateCode('vue', {
			size: 200,
			duration: 8,
			doubleBeam: true,
			endOpacity: 0.2,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('<script setup lang="ts">');
		expect(code).toContain('endColor = computed');
		expect(code).toContain('v-if="props.doubleBeam"');
		expect(code).toContain('color-mix(in srgb');
		expect(code).toContain("maskComposite: 'exclude'");
		expect(code).not.toContain('reverse');
	});

	it('generates native Svelte 5 component with runes and hardware exclusion mask', () => {
		const files = borderBeamComponent.generateCode('svelte', {
			size: 220,
			duration: 10,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('$props()');
		expect(code).toContain('$derived');
		expect(code).toContain('exhuma-border-beam');
		expect(code).toContain('{#if doubleBeam}');
		expect(code).toContain('mask-composite: exclude');
		expect(code).not.toContain('reverse');
	});

	it('generates native Angular 18+ component with standalone inputs', () => {
		const files = borderBeamComponent.generateCode('angular', {
			size: 200,
			duration: 8,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('@Component({');
		expect(code).toContain("selector: 'exhuma-border-beam'");
		expect(code).toContain('readonly doubleBeam = input<boolean>');
		expect(code).toContain('readonly endColor = computed');
		expect(code).toContain("[style.maskComposite]=\"'exclude'\"");
		expect(code).not.toContain('reverse');
	});

	it('generates native Astro component with pure CSS laser sweep', () => {
		const files = borderBeamComponent.generateCode('astro', {
			size: 200,
			duration: 8,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('Astro.props');
		expect(code).toContain('{doubleBeam && (');
		expect(code).toContain('@keyframes exhuma-border-beam');
		expect(code).toContain('mask-composite: exclude');
		expect(code).not.toContain('reverse');
	});

	it('generates Web Component custom element with observed attributes', () => {
		const files = borderBeamComponent.generateCode('webcomponent', {
			size: 200,
			duration: 8,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('class ExhumaBorderBeamElement extends HTMLElement');
		expect(code).toContain("customElements.define('exhuma-border-beam'");
		expect(code).toContain("this.style.maskComposite = 'exclude'");
		expect(code).not.toContain('reverse');
	});

	it('generates Vanilla JS module with dynamic injection and teardown cleanup', () => {
		const files = borderBeamComponent.generateCode('vanilla', {
			size: 200,
			duration: 8,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('export function initBorderBeam');
		expect(code).toContain('cleanups.forEach');
		expect(code).toContain("container.style.maskComposite = 'exclude'");
		expect(code).not.toContain('reverse');
	});

	it('generates Laravel Blade component with PHP blade directives and sub-pixel mask', () => {
		const files = borderBeamComponent.generateCode('blade', {
			size: 200,
			duration: 8,
			doubleBeam: true,
		});

		expect(files.length).toBe(1);
		const code = files[0]?.code ?? '';
		expect(code).toContain('@props([');
		expect(code).toContain('@if ($doubleBeam)');
		expect(code).toContain('mask-composite: exclude');
		expect(code).not.toContain('reverse');
	});
});
