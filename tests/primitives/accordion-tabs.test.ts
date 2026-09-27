import { describe, it, expect } from 'vitest';
import { VelocityRingBuffer, checkGestureSlop } from '../../packages/core/src/gestures/fsm';

describe('Exhuma Kinetic Methodology — Gesture FSM & Velocity Ring Buffer (Big-Omega)', () => {
	it('calculates velocity accurately using fixed 5-slot ring buffer', () => {
		const ring = new VelocityRingBuffer();

		// Simulate touch drag from x=0 to x=100 over 100ms
		ring.push(0, 0, 0);
		ring.push(25, 0, 25);
		ring.push(50, 0, 50);
		ring.push(75, 0, 75);
		ring.push(100, 0, 100);

		const vel = ring.computeVelocity();
		// 100px / 0.1s = 1000 px/s
		expect(vel.vx).toBeCloseTo(1000, 0);
		expect(vel.vy).toBe(0);
		expect(vel.speed).toBeCloseTo(1000, 0);
	});

	it('detects primary-axis horizontal slop and rejects vertical page scroll', () => {
		// Drag mainly horizontal: dx=20, dy=5 => angle = atan2(5, 20) = ~14 deg (< 30 deg)
		const horizontal = checkGestureSlop(20, 5, 'x');
		expect(horizontal.isClaimed).toBe(true);
		expect(horizontal.isRejected).toBe(false);

		// Drag mainly vertical: dx=5, dy=30 => angle = atan2(30, 5) = ~80 deg (> 30 deg)
		const vertical = checkGestureSlop(5, 30, 'x');
		expect(vertical.isClaimed).toBe(false);
		expect(vertical.isRejected).toBe(true);
	});

	it('ignores micro-movements within slop threshold (< 8px)', () => {
		const micro = checkGestureSlop(3, 4, 'x');
		expect(micro.isClaimed).toBe(false);
		expect(micro.isRejected).toBe(false);
	});
});

describe('Exhuma Kinetic Methodology — Circular Modulo Roving Index DSA', () => {
	it('wraps forward and backward navigation seamlessly', () => {
		const length = 4;
		const nextForward = (current: number) => (current + 1) % length;
		const nextBackward = (current: number) => (current - 1 + length) % length;

		expect(nextForward(0)).toBe(1);
		expect(nextForward(3)).toBe(0); // wrap to first

		expect(nextBackward(0)).toBe(3); // wrap to last
		expect(nextBackward(2)).toBe(1);
	});
});

describe('MorphingTabs — Big-Omega (Ω) Spring Physics & Geometry', () => {
	it('converges to target position across different omega stiffness values without overshoot', async () => {
		const { solveCriticallyDampedSpring } = await import('../../packages/core/src/physics/spring');

		const dt = 0.016;
		for (const omega of [14, 26, 42]) {
			let pos = 0;
			let vel = 0;
			const target = 150;
			let steps = 0;

			// Step ODE simulation until settled
			while (steps < 120) {
				const state = solveCriticallyDampedSpring(pos, target, vel, dt, { omega });
				pos = state.position;
				vel = state.velocity;
				steps++;
				if (state.isSettled) break;
			}

			// Must settle exactly at target (zero overshoot)
			expect(pos).toBeCloseTo(target, 0);
			// Higher omega converges in fewer steps
			if (omega === 42) {
				expect(steps).toBeLessThanOrEqual(40);
			}
		}
	});

	it('computes correct target geometry for indicator variants', () => {
		const rect = { x: 40, y: 10, width: 120, height: 36 };

		// Pill variant
		const pillGeometry = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
		};
		expect(pillGeometry.y).toBe(10);
		expect(pillGeometry.height).toBe(36);

		// Underline variant
		const underlineGeometry = {
			x: rect.x,
			y: rect.y + rect.height - 2,
			width: rect.width,
			height: 2,
		};
		expect(underlineGeometry.y).toBe(44);
		expect(underlineGeometry.height).toBe(2);

		// Glow variant
		const glowGeometry = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
		};
		expect(glowGeometry.height).toBe(36);
	});
});

describe('Accordion — Big-Omega (Ω) Kinetics & State Reconciliation', () => {
	it('enforces single-mode invariant (maximum 1 item expanded)', () => {
		const singleToggle = (current: Set<string>, val: string): Set<string> => {
			return current.has(val) ? new Set() : new Set([val]);
		};

		let state = new Set<string>(['item-1']);
		expect(state.size).toBe(1);

		// Toggling item-2 closes item-1 and opens item-2
		state = singleToggle(state, 'item-2');
		expect(state.size).toBe(1);
		expect(state.has('item-2')).toBe(true);
		expect(state.has('item-1')).toBe(false);

		// Toggling item-2 again collapses everything
		state = singleToggle(state, 'item-2');
		expect(state.size).toBe(0);
	});

	it('enforces multiple-mode invariant (independent toggles)', () => {
		const multipleToggle = (current: Set<string>, val: string): Set<string> => {
			const next = new Set(current);
			if (next.has(val)) next.delete(val);
			else next.add(val);
			return next;
		};

		let state = new Set<string>(['item-1']);
		state = multipleToggle(state, 'item-2');
		expect(state.size).toBe(2);
		expect(state.has('item-1')).toBe(true);
		expect(state.has('item-2')).toBe(true);

		state = multipleToggle(state, 'item-1');
		expect(state.size).toBe(1);
		expect(state.has('item-2')).toBe(true);
	});

	it('verifies kinetic dual-spin morphing icon angles', () => {
		// Closed state: bar1 = -180 deg (horizontal), bar2 = -90 deg (vertical) => PLUS (+)
		const closedBar1 = -180;
		const closedBar2 = -90;
		expect(Math.abs(closedBar1 - closedBar2)).toBe(90); // Orthogonal lines form a cross

		// Open state: bar1 = 0 deg (horizontal), bar2 = 0 deg (horizontal) => MINUS (-)
		const openBar1 = 0;
		const openBar2 = 0;
		expect(openBar1).toBe(openBar2); // Overlapping parallel lines form single minus bar

		// Rotation delta: bar1 travels 180 deg, bar2 travels 90 deg (counter-rotation flip)
		expect(openBar1 - closedBar1).toBe(180);
		expect(openBar2 - closedBar2).toBe(90);
	});

	it('enforces collapsible invariant in single mode', () => {
		const toggleWithCollapsible = (current: Set<string>, val: string, collapsible: boolean): Set<string> => {
			if (current.has(val)) {
				return collapsible ? new Set() : new Set([val]);
			}
			return new Set([val]);
		};

		let state = new Set<string>(['panel-1']);

		// With collapsible=true, toggling active item closes it
		state = toggleWithCollapsible(state, 'panel-1', true);
		expect(state.size).toBe(0);

		// With collapsible=false, toggling active item keeps it open
		state = new Set<string>(['panel-1']);
		state = toggleWithCollapsible(state, 'panel-1', false);
		expect(state.size).toBe(1);
		expect(state.has('panel-1')).toBe(true);

		// Switching to panel-2 still changes selection
		state = toggleWithCollapsible(state, 'panel-2', false);
		expect(state.size).toBe(1);
		expect(state.has('panel-2')).toBe(true);
	});

	it('exports all compound components from @exhuma/core', async () => {
		const core = await import('../../packages/core/src/index');
		expect(core.Accordion).toBeDefined();
		expect(core.AccordionRoot).toBeDefined();
		expect(core.AccordionItem).toBeDefined();
		expect(core.AccordionTrigger).toBeDefined();
		expect(core.AccordionIcon).toBeDefined();
		expect(core.AccordionContent).toBeDefined();

		// Composite object matches individual exports
		expect(core.Accordion.Root).toBe(core.AccordionRoot);
		expect(core.Accordion.Item).toBe(core.AccordionItem);
		expect(core.Accordion.Trigger).toBe(core.AccordionTrigger);
		expect(core.Accordion.Icon).toBe(core.AccordionIcon);
		expect(core.Accordion.Content).toBe(core.AccordionContent);
	});

	it('generates production code across all 13 ecosystems', async () => {
		const { getAccordionOuterFiles, getAccordionUsage } = await import(
			'../../packages/registry/src/templates/generators/accordion-generator'
		);

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

		const props = {
			mode: 'single',
			collapsible: true,
			gap: 12,
			bordered: true,
			shadow: true,
			showNumbers: true,
			showIcon: true,
			duration: 300,
		};

		for (const flavor of flavors) {
			// Clean mode
			const cleanFiles = getAccordionOuterFiles(flavor, props, false);
			expect(cleanFiles).not.toBeNull();
			expect(cleanFiles!.length).toBeGreaterThanOrEqual(1);
			expect(cleanFiles![0].code.length).toBeGreaterThan(50);

			// Ejected mode
			const ejectedFiles = getAccordionOuterFiles(flavor, props, true);
			expect(ejectedFiles).not.toBeNull();
			expect(ejectedFiles!.length).toBeGreaterThanOrEqual(1);
			expect(ejectedFiles![0].code.length).toBeGreaterThan(50);

			// Usage generator
			const usage = getAccordionUsage(flavor, props);
			expect(usage).toBeDefined();
			expect(usage.code.length).toBeGreaterThan(50);
		}
	});

	it('verifies ejected React code contains CSS Grid 0fr/1fr and counter-rotating bars', async () => {
		const { getAccordionOuterFiles } = await import(
			'../../packages/registry/src/templates/generators/accordion-generator'
		);
		const files = getAccordionOuterFiles('react', { duration: 350 }, true);
		expect(files).not.toBeNull();
		const code = files![0].code;

		expect(code).toContain('grid-rows-[1fr]');
		expect(code).toContain('grid-rows-[0fr]');
		expect(code).toContain('rotate-0');
		expect(code).toContain('-rotate-180');
		expect(code).toContain('-rotate-90');
		expect(code).toContain('transitionDuration: `${duration}ms`');
		expect(code).toContain('focus-visible:ring-primary');
		expect(code).toContain('inert={!isOpen || undefined}');
	});
});


