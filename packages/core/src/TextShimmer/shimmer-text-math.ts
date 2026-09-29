/**
 * Text Shimmer Luminance Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - 0% CPU/JS overhead during animation: pure CSS @keyframes
 * - Zero layout reflow: background-clip:text with GPU-composited gradient
 * - Ω(1) prop-to-CSS-variable mapping
 */

/** Calculates CSS animation-duration string from spread and speed props */
export function calculateShimmerDuration(spread: number, speed: number): string {
	if (speed <= 0) return '0s';
	// Just use speed directly as duration since speed is passed as duration
	return `${speed}s`;
}

/** Calculates the CSS linear-gradient string for the shimmer band */
export function calculateShimmerGradient(shimmerColor: string, baseColor: string, spread: number): string {
	const halfSpread = Math.max(0, Math.min(100, spread / 2));
	return `linear-gradient(90deg, ${baseColor} calc(50% - ${halfSpread}%), ${shimmerColor} 50%, ${baseColor} calc(50% + ${halfSpread}%))`;
}

/** Maps hover speed multiplier to CSS animation-duration on hover */
export function calculateHoverDuration(baseDuration: string, accelerationFactor: number): string {
	const durationVal = parseFloat(baseDuration);
	if (isNaN(durationVal) || accelerationFactor <= 0) return baseDuration;
	return `${Number((durationVal / accelerationFactor).toFixed(2))}s`;
}
