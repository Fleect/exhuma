/**
 * Accordion Analytical Physics & Cascade Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) closed-form spring ODE evaluation.
 * - Deterministic cascade stagger calculation for multi-panel disclosure.
 * - Mathematical preservation of signature counter-rotating morphing icon angles.
 */

/**
 * Calculates continuous height displacement via analytical second-order spring ODE.
 *
 * For critically damped (zeta = 1.0):
 *   y(t) = H * [1 - (1 + omega * t) * exp(-omega * t)]
 * For underdamped (zeta < 1.0):
 *   omega_d = omega * sqrt(1 - zeta^2)
 *   y(t) = H * [1 - exp(-zeta * omega * t) * (cos(omega_d * t) + (zeta / sqrt(1 - zeta^2)) * sin(omega_d * t))]
 *
 * @param t Elapsed time in seconds (t >= 0)
 * @param targetHeight Total expanded panel content height
 * @param omega Natural frequency in rad/s (default: 28)
 * @param zeta Damping ratio (default: 1.0)
 */
export function solveAccordionSpring(
	t: number,
	targetHeight: number,
	omega: number = 28,
	zeta: number = 1.0
): number {
	if (t <= 0 || targetHeight <= 0) return 0;
	if (!Number.isFinite(t) || !Number.isFinite(targetHeight)) return 0;

	if (zeta >= 0.999) {
		// Critically damped closed form
		const envelope = Math.exp(-omega * t);
		const pos = targetHeight * (1 - (1 + omega * t) * envelope);
		return Number(pos.toFixed(2));
	}

	// Underdamped closed form
	const omegaD = omega * Math.sqrt(1 - zeta * zeta);
	const envelope = Math.exp(-zeta * omega * t);
	const dampingFactor = zeta / Math.sqrt(1 - zeta * zeta);
	const oscillation = Math.cos(omegaD * t) + dampingFactor * Math.sin(omegaD * t);
	const pos = targetHeight * (1 - envelope * oscillation);

	return Number(pos.toFixed(2));
}

/**
 * Calculates cascading stagger delay for multi-panel sequential disclosure.
 *
 * @param index 0-based index of the accordion item
 * @param cascadeDelayMs Delay per item in milliseconds (default: 35ms)
 */
export function calculateCascadeDelay(index: number, cascadeDelayMs: number = 35): number {
	if (index <= 0 || cascadeDelayMs <= 0) return 0;
	return index * cascadeDelayMs;
}

/**
 * Returns signature dual-spin kinetic morphing icon angles.
 * Closed: bar1 = -180deg (horizontal), bar2 = -90deg (vertical) => orthogonal PLUS (+)
 * Open: bar1 = 0deg (horizontal), bar2 = 0deg (horizontal) => parallel MINUS (-)
 */
export function calculateMorphingIconAngles(isOpen: boolean): { bar1: number; bar2: number } {
	return isOpen ? { bar1: 0, bar2: 0 } : { bar1: -180, bar2: -90 };
}
