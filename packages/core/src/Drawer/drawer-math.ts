/**
 * Drawer Gesture Physics Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) rubber band: y' = limit + c*sqrt(max(0, y - limit)) in O(1)
 * - Ω(1) flick dismiss projection: v/lambda in O(1)
 * - Zero GC: pure number operations, no object creation in hot path
 */

/** Applies square-root rubber banding for over-drag resistance */
export function applyRubberBand(y: number, limit: number, coefficient: number): number {
	if (y >= limit) return y;
	return limit - coefficient * Math.sqrt(Math.max(0, limit - y));
}

/** Projects final position based on current velocity for flick detection */
export function projectFinalPosition(currentY: number, velocityPx: number, decayLambda: number): number {
	return currentY + velocityPx / decayLambda;
}

/** Returns snap point closest to current Y from an array of snap points */
export function findNearestSnapPoint(currentY: number, snapPoints: number[], containerHeight: number): number {
	let nearest = Infinity;
	let bestPoint = 1;
	for (let i = 0; i < snapPoints.length; i++) {
		const pointY = containerHeight * (1 - snapPoints[i]);
		const dist = Math.abs(currentY - pointY);
		if (dist < nearest) {
			nearest = dist;
			bestPoint = snapPoints[i];
		}
	}
	return bestPoint;
}

/** Calculates backdrop opacity based on drawer openness (0=closed, 1=fully open) */
export function calculateBackdropOpacity(openness: number, maxOpacity: number): number {
	return Math.min(1, Math.max(0, openness)) * maxOpacity;
}
