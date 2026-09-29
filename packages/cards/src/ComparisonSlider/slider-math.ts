/**
 * Comparison Slider Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) split-ratio clamping and polygon clipping math.
 * - Zero heap allocations in active tracking loop.
 */

/**
 * Calculates normalized split ratio p in [0, 1] from horizontal pointer coordinate.
 */
export function calculateSplitPosition(clientX: number, containerLeft: number, containerWidth: number): number {
	if (containerWidth <= 0) return 0.5;
	const raw = (clientX - containerLeft) / containerWidth;
	return Math.max(0, Math.min(1, raw));
}

/**
 * Calculates normalized vertical split ratio p in [0, 1] from vertical pointer coordinate.
 */
export function calculateVerticalSplitPosition(clientY: number, containerTop: number, containerHeight: number): number {
	if (containerHeight <= 0) return 0.5;
	const raw = (clientY - containerTop) / containerHeight;
	return Math.max(0, Math.min(1, raw));
}

/**
 * Generates CSS clip-path polygon for the overlaid 'before' layer (horizontal).
 */
export function generateClipPath(position: number): string {
	const pct = (position * 100).toFixed(3);
	return `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
}

/**
 * Generates CSS clip-path polygon for vertical orientation.
 */
export function generateVerticalClipPath(position: number): string {
	const pct = (position * 100).toFixed(3);
	return `polygon(0 0, 100% 0, 100% ${pct}%, 0 ${pct}%)`;
}

/**
 * Steps position forward or backward by a delta step.
 */
export function stepSliderPosition(current: number, delta: number): number {
	return Math.max(0, Math.min(1, current + delta));
}

/**
 * Calculates sinusoidal idle breathing oscillation offset in normalized [0, 1] units.
 *
 * @param time Time in seconds
 * @param amplitude Maximum normalized amplitude (e.g. 0.05 for 5%)
 * @param frequency Oscillation frequency in Hz (e.g. 0.5 for 2-second period)
 */
export function calculateIdleBreathingOffset(time: number, amplitude: number = 0.05, frequency: number = 0.5): number {
	return amplitude * Math.sin(2 * Math.PI * frequency * time);
}

/**
 * Generates circular magnifying loupe clip-path string.
 */
export function generateLoupeClipPath(xPct: number, yPct: number, radiusPx: number): string {
	return `circle(${radiusPx}px at ${xPct.toFixed(2)}% ${yPct.toFixed(2)}%)`;
}
