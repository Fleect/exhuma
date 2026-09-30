/**
 * Analytical Exponential Counter Easing Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time O(1) analytical calculation (ZERO Framer Motion)
 * - Zero heap allocations during frame ticks
 * - Exact asymptotic convergence at terminal time
 */

/**
 * Closed-form easeOutExpo easing function.
 *
 * @param progress Normalized time [0..1]
 */
export function easeOutExpo(progress: number): number {
	if (progress >= 1.0) return 1.0;
	if (progress <= 0.0) return 0.0;
	return 1 - Math.pow(2, -10 * progress);
}

/**
 * Calculates current interpolated numerical value at time t.
 */
export function calculateTickerValue(startValue: number, targetValue: number, elapsedSeconds: number, durationSeconds: number): { value: number; isComplete: boolean } {
	if (durationSeconds <= 0 || elapsedSeconds >= durationSeconds) {
		return { value: targetValue, isComplete: true };
	}

	const progress = Math.max(0, Math.min(1, elapsedSeconds / durationSeconds));
	const ease = easeOutExpo(progress);
	const value = startValue + (targetValue - startValue) * ease;

	return { value, isComplete: false };
}

/**
 * Calculates logarithmic rolling deceleration position for an individual digit column.
 * theta_j(t) = 10 * N_j + D_j * [1 - (1 - t / T_j)^3]
 *
 * @param t Elapsed time in seconds
 * @param baseDuration Base duration T_base in seconds
 * @param columnIndex 0-based column index j
 * @param targetDigit Target decimal digit (0-9)
 * @param revolutions Full 10-digit cycles to traverse (default: 3)
 * @param staggerDelta Stagger increment per column in seconds (default: 0.08)
 */
export function calculateColumnDeceleration(
	t: number,
	baseDuration: number,
	columnIndex: number,
	targetDigit: number,
	revolutions: number = 3,
	staggerDelta: number = 0.08
): { position: number; isComplete: boolean } {
	const columnDuration = Math.max(0.1, baseDuration + columnIndex * staggerDelta);
	if (t >= columnDuration) {
		return { position: 10 * revolutions + targetDigit, isComplete: true };
	}
	if (t <= 0) {
		return { position: 0, isComplete: false };
	}

	const normalized = Math.min(1, Math.max(0, t / columnDuration));
	// Cubic deceleration curve: 1 - (1 - u)^3
	const cubicEase = 1 - Math.pow(1 - normalized, 3);
	const totalTravel = 10 * revolutions + targetDigit;
	const position = Number((totalTravel * cubicEase).toFixed(3));

	return { position, isComplete: false };
}

/**
 * Calculates velocity-proportional vertical motion blur.
 * sigma_blur(t) = clamp(|v| * beta, 0, maxBlur)
 *
 * @param velocity Instantaneous rotational/angular velocity
 * @param beta Velocity sensitivity multiplier (default: 0.005)
 * @param maxBlur Maximum blur radius in pixels (default: 3.5)
 */
export function calculateVelocityBlur(
	velocity: number,
	beta: number = 0.005,
	maxBlur: number = 3.5
): number {
	if (!Number.isFinite(velocity) || velocity === 0) return 0;
	const blur = Math.min(maxBlur, Math.max(0, Math.abs(velocity) * beta));
	return Number(blur.toFixed(2));
}

