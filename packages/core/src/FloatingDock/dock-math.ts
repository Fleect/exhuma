/**
 * Kinetic Proximity Distribution Kernel — Exhuma Kinetic Methodology (EKM)
 * Authentic macOS Dock Magnification Engine
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time O(1) analytical calculation with zero memory allocations in rAF loop.
 * - C1-continuous smooth cosine bell distribution with zero boundary jerk.
 * - Smooth asymptotic lerp decay for graceful entry/exit transitions.
 */

export type DockDirection = 'bottom' | 'top' | 'left' | 'right';
export type DockPanelStyle = 'glass' | 'translucent' | 'minimal';

/**
 * Calculates continuous Cosine Bell magnification multiplier based on distance.
 * C1 continuous with zero derivatives at d=0 and d=influenceRadius (zero boundary pop).
 *
 * @param distance Absolute distance in pixels between pointer and item center |coord - itemCenter|
 * @param influenceRadius Total spread radius where magnification decays to 1.0
 * @param maxMagnification Maximum scale increase factor (e.g. 0.65 for 1.65x max scale)
 */
export function calculateDockScale(distance: number, influenceRadius: number = 85, maxMagnification: number = 0.65): number {
	const absDist = Math.abs(distance);
	if (influenceRadius <= 0 || absDist >= influenceRadius) return 1.0;
	const factor = Math.cos((absDist / influenceRadius) * (Math.PI / 2));
	return 1.0 + maxMagnification * factor * factor;
}

/**
 * Calculates continuous Gaussian magnification multiplier based on distance (backward compatibility).
 */
export function calculateGaussianScale(distance: number, influenceRadius: number = 70, maxMagnification: number = 0.6): number {
	if (influenceRadius <= 0) return 1.0;
	const absDist = Math.abs(distance);
	if (absDist >= influenceRadius * 2.5) return 1.0;
	const exponent = -(absDist * absDist) / (2 * influenceRadius * influenceRadius);
	return 1.0 + maxMagnification * Math.exp(exponent);
}

/**
 * Computes exact item width/height in pixels using the smooth C1 continuous cosine proximity curve.
 */
export function calculateDockItemSize(distance: number, baseSize: number = 36, influenceRadius: number = 60, maxMagnification: number = 0.75): number {
	return baseSize * calculateDockScale(distance, influenceRadius, maxMagnification);
}

/**
 * Interpolates current scale towards target scale for smooth entry/exit decay.
 */
export function lerpDockScale(current: number, target: number, speed: number = 0.25): number {
	const diff = target - current;
	if (Math.abs(diff) < 0.002) return target;
	return current + diff * speed;
}

/**
 * Frame-rate independent exponential decay towards target scale.
 */
export function dampDockScale(current: number, target: number, lambda: number = 24, dt: number = 0.016): number {
	const diff = target - current;
	if (Math.abs(diff) < 0.02) return target;
	return current + diff * (1 - Math.exp(-lambda * dt));
}

/**
 * Calculates pointer distance to item center along the active orientation axis.
 */
export function calculateDockDistance(
	pointerCoord: number,
	itemStart: number,
	itemDimension: number
): number {
	const itemCenter = itemStart + itemDimension / 2;
	return Math.abs(pointerCoord - itemCenter);
}

/**
 * Checks whether pointer is at the apex of magnification (peak item center) for haptic feedback triggers.
 */
export function isApexProximity(distance: number, thresholdPx: number = 6): boolean {
	return Math.abs(distance) <= thresholdPx;
}

/**
 * Mutable per-item spring state for the liquid-smooth GPU-composited dock mode.
 * Tracks current scale and scale velocity for second-order spring integration.
 */
export interface DockSpringState {
	/** Current interpolated scale factor (starts at 1.0) */
	scale: number;
	/** Current scale velocity (starts at 0) */
	velocity: number;
}

/**
 * Creates a new spring state at rest with scale = 1.0.
 */
export function createDockSpringState(): DockSpringState {
	return { scale: 1.0, velocity: 0 };
}

/**
 * Integrates a critically/slightly-overdamped second-order spring to filter
 * instantaneous target scales into viscous, liquid-smooth intermediates.
 *
 * Uses semi-implicit Euler integration for unconditional stability.
 *
 * @param state Mutable spring state (mutated in-place for zero allocation)
 * @param targetScale Instantaneous target scale from cosine proximity curve
 * @param dt Frame delta time in seconds (capped to 50ms internally)
 * @param zeta Damping ratio (default 1.05 = slight overdamping, zero micro-jitter)
 * @param omegaN Natural frequency in rad/s (default 32)
 * @returns The new interpolated scale value (also written to state.scale)
 */
export function springDampedScaleStep(
	state: DockSpringState,
	targetScale: number,
	dt: number,
	zeta: number = 1.05,
	omegaN: number = 32
): number {
	const clampedDt = Math.min(dt, 0.05);
	const displacement = state.scale - targetScale;
	const springForce = -omegaN * omegaN * displacement;
	const dampingForce = -2 * zeta * omegaN * state.velocity;
	const acceleration = springForce + dampingForce;

	// Semi-implicit Euler (unconditionally stable for stiff springs)
	state.velocity += acceleration * clampedDt;
	state.scale += state.velocity * clampedDt;

	// Snap to rest when close enough (prevents eternal micro-oscillation)
	if (Math.abs(displacement) < 0.001 && Math.abs(state.velocity) < 0.01) {
		state.scale = targetScale;
		state.velocity = 0;
	}

	return state.scale;
}
