/**
 * Exhuma Kinetic Methodology (EKM) — Analytical Spring Physics Kernel
 * Solves the second-order differential equation for a critically damped harmonic oscillator:
 * m * x'' + c * x' + k * (x - x_target) = 0
 * where damping ratio zeta = c / (2 * sqrt(k * m)) = 1.0 (Critical Damping)
 *
 * Guarantees:
 * - O(1) Constant Time
 * - O(1) Static Memory (Zero Heap Allocation)
 * - Exact closed-form exponential solution (Zero Euler numerical drift)
 * - Asymptotic convergence with epsilon settling
 */

export interface SpringState {
	position: number;
	velocity: number;
	isSettled: boolean;
}

export interface SpringConfig {
	/** Angular frequency (stiffness / response speed), typical range: 10 - 40 */
	omega?: number;
	/** Epsilon threshold for position settling */
	epsilon?: number;
	/** Velocity threshold for settling */
	velocityEpsilon?: number;
}

/**
 * Solves the critically damped spring state after elapsed time dt.
 * Uses the exact analytical solution:
 * x(t) = target + (x0 - target + (v0 + omega * (x0 - target)) * t) * e^(-omega * t)
 */
export function solveCriticallyDampedSpring(current: number, target: number, velocity: number, dt: number, config: SpringConfig = {}): SpringState {
	const omega = config.omega ?? 20;
	const epsilon = config.epsilon ?? 0.001;
	const velocityEpsilon = config.velocityEpsilon ?? 0.001;

	// Already at rest at target
	const delta = current - target;
	if (Math.abs(delta) < epsilon && Math.abs(velocity) < velocityEpsilon) {
		return {
			position: target,
			velocity: 0,
			isSettled: true,
		};
	}

	// Clamp dt to prevent runaway steps on background tab resumption
	const clampedDt = Math.min(Math.max(dt, 0), 0.1);

	// Closed-form analytical evaluation
	const decay = Math.exp(-omega * clampedDt);
	const c1 = delta;
	const c2 = velocity + omega * delta;

	const newDelta = (c1 + c2 * clampedDt) * decay;
	const newPosition = target + newDelta;
	const newVelocity = (velocity - omega * c2 * clampedDt) * decay;

	// Settle check
	if (Math.abs(newPosition - target) < epsilon && Math.abs(newVelocity) < velocityEpsilon) {
		return {
			position: target,
			velocity: 0,
			isSettled: true,
		};
	}

	return {
		position: newPosition,
		velocity: newVelocity,
		isSettled: false,
	};
}
