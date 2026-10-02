/**
 * Marquee Mathematical Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) / O(1) Constant-time modulo translation
 * - Zero dynamic object allocation during rAF execution
 * - Frame-rate independent exponential velocity damping
 */

/**
 * Calculates continuous wrapped translation offset.
 *
 * @param currentOffset Current translation in pixels (typically negative for 'left')
 * @param deltaSeconds Time elapsed since last frame in seconds
 * @param speed Speed in pixels per second
 * @param direction 'left' translates towards negative x, 'right' towards positive x
 * @param contentWidth Total width of a single un-duplicated track
 */
export function calculateMarqueeOffset(currentOffset: number, deltaSeconds: number, speed: number, direction: 'left' | 'right', contentWidth: number): number {
	if (contentWidth <= 0) return 0;

	const deltaMove = speed * deltaSeconds;
	let newOffset = currentOffset;

	if (direction === 'left') {
		newOffset -= deltaMove;
		// Modulo wrap when track has completely scrolled past
		if (newOffset <= -contentWidth) {
			newOffset = newOffset % contentWidth;
		}
	} else {
		newOffset += deltaMove;
		if (newOffset >= 0) {
			newOffset = -contentWidth + (newOffset % contentWidth);
		}
	}

	return newOffset;
}

/**
 * Frame-rate independent exponential velocity smoother.
 *
 * @param current Current kinetic factor [0..1]
 * @param target Target factor (0 when hovering, 1 when running)
 * @param lambda Smoothing factor (e.g. 10.0 for snappy deceleration)
 * @param dt Delta time in seconds
 */
export function dampFactor(current: number, target: number, lambda: number, dt: number): number {
	return target + (current - target) * Math.exp(-lambda * dt);
}

/**
 * Normalizes CSS gap string or numeric value to pixel number.
 * Defaults to 24px if invalid or not resolvable.
 */
export function parseGapToPx(gap: string | number | undefined): number {
	if (typeof gap === 'number') return Number.isFinite(gap) ? gap : 24;
	if (typeof gap !== 'string') return 24;
	const str = gap.trim();
	if (str.endsWith('rem')) {
		const rem = parseFloat(str);
		return Number.isFinite(rem) ? rem * 16 : 24;
	}
	if (str.endsWith('em')) {
		const em = parseFloat(str);
		return Number.isFinite(em) ? em * 16 : 24;
	}
	const px = parseFloat(str);
	return Number.isFinite(px) ? px : 24;
}

/**
 * Calculates scroll-velocity coupled marquee speed.
 * v(t) = v_base + kappa_scroll * |v_scroll|
 *
 * @param baseSpeed Base marquee speed (px/s)
 * @param scrollVelocity Current window or container scroll velocity (px/s)
 * @param kappa Scroll-velocity coupling coefficient (default: 0.12)
 */
export function calculateCoupledScrollVelocity(baseSpeed: number, scrollVelocity: number, kappa: number = 0.12): number {
	if (!Number.isFinite(baseSpeed)) return 0;
	if (!Number.isFinite(scrollVelocity) || scrollVelocity === 0) return Math.abs(baseSpeed);
	return Math.abs(baseSpeed) + kappa * Math.abs(scrollVelocity);
}

/**
 * Direction hysteresis filter preventing high-frequency jitter upon scroll reversal.
 *
 * @param currentDirection Current active direction ('left' or 'right')
 * @param scrollVelocity Instantaneous vertical or horizontal scroll velocity
 * @param threshold Velocity threshold needed to trigger reversal (default: 50 px/s)
 */
export function evaluateMarqueeDirectionHysteresis(currentDirection: 'left' | 'right', scrollVelocity: number, threshold: number = 50): 'left' | 'right' {
	if (!Number.isFinite(scrollVelocity)) return currentDirection;
	if (scrollVelocity > threshold) return 'right';
	if (scrollVelocity < -threshold) return 'left';
	return currentDirection;
}
