/**
 * Magnetic Button Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) vector pull calculation.
 * - Zero heap allocations per frame: static return coordinates.
 */

export interface MagneticCoordinates {
	x: number;
	y: number;
	distance: number;
	isInside: boolean;
}

/**
 * Calculates inverted spring magnetic pull displacement.
 * When pointer is within radius R of center:
 *   displacement = (pointer - center) * strength * (1 - distance / R)
 */
export function calculateMagneticPull(pointerX: number, pointerY: number, centerX: number, centerY: number, radius: number, strength: number = 0.4, maxDisplacement: number = 40): MagneticCoordinates {
	if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY) || !Number.isFinite(centerX) || !Number.isFinite(centerY) || radius <= 0) {
		return { x: 0, y: 0, distance: 0, isInside: false };
	}

	const dx = pointerX - centerX;
	const dy = pointerY - centerY;
	const distance = Math.hypot(dx, dy);

	if (distance > radius) {
		return { x: 0, y: 0, distance, isInside: false };
	}

	const safeStrength = Number.isFinite(strength) ? strength : 0.4;
	const attenuation = 1 - distance / radius;
	let pullX = dx * safeStrength * attenuation;
	let pullY = dy * safeStrength * attenuation;

	if (maxDisplacement > 0) {
		const pullDist = Math.hypot(pullX, pullY);
		if (pullDist > maxDisplacement) {
			const scale = maxDisplacement / pullDist;
			pullX *= scale;
			pullY *= scale;
		}
	}

	return {
		x: pullX,
		y: pullY,
		distance,
		isInside: true,
	};
}
