/**
 * Exhuma Kinetic Methodology (EKM) — Motion & Accessibility Sensor
 * Evaluates WCAG 2.2 AA user preference for reduced motion.
 * O(1) evaluation with SSR-safe checks.
 */

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return false;
	}
	try {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch {
		return false;
	}
}
