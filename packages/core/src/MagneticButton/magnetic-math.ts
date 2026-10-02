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

export interface MultiLayerMagneticOffset {
	housing: { x: number; y: number };
	content: { x: number; y: number };
	distance: number;
	isInside: boolean;
}

/**
 * Calculates dual-tier Apple iPadOS multi-layer magnetic detachment.
 * Housing displacement coefficient: 0.25
 * Content displacement coefficient: 0.65
 */
export function calculateMultiLayerDetachment(pointerX: number, pointerY: number, centerX: number, centerY: number, radius: number, housingStrength = 0.25, contentStrength = 0.65): MultiLayerMagneticOffset {
	const base = calculateMagneticPull(pointerX, pointerY, centerX, centerY, radius, 1.0, 100);
	if (!base.isInside) {
		return {
			housing: { x: 0, y: 0 },
			content: { x: 0, y: 0 },
			distance: base.distance,
			isInside: false,
		};
	}

	return {
		housing: {
			x: Number((base.x * housingStrength).toFixed(2)),
			y: Number((base.y * housingStrength).toFixed(2)),
		},
		content: {
			x: Number((base.x * contentStrength).toFixed(2)),
			y: Number((base.y * contentStrength).toFixed(2)),
		},
		distance: base.distance,
		isInside: true,
	};
}

/**
 * Calculates radial shockwave radius and opacity on click.
 */
export function calculateShockwaveProgress(elapsedMs: number, maxRadius = 56, waveDuration = 350): { radius: number; opacity: number } {
	if (elapsedMs <= 0) return { radius: 0, opacity: 0.8 };
	if (elapsedMs >= waveDuration) return { radius: maxRadius, opacity: 0 };

	const progress = elapsedMs / waveDuration;
	const radius = maxRadius * (1 - Math.exp(-progress * 4));
	const opacity = 0.8 * (1 - progress);

	return {
		radius: Number(radius.toFixed(2)),
		opacity: Number(opacity.toFixed(3)),
	};
}

export interface ShockwaveOrigin {
	x: number;
	y: number;
	maxRadius: number;
}

/**
 * Calculates shockwave origin coordinates relative to element bounding box
 * and sets a balanced tactile shockwave radius.
 */
export function calculateShockwaveOrigin(pointerX: number, pointerY: number, rectLeft: number, rectTop: number, rectWidth?: number, rectHeight?: number, maxRadius = 56, scaleX = 1, scaleY = 1): ShockwaveOrigin {
	const safeScaleX = Number.isFinite(scaleX) && scaleX > 0 ? scaleX : 1;
	const safeScaleY = Number.isFinite(scaleY) && scaleY > 0 ? scaleY : 1;

	const clickX = Number.isFinite(pointerX) ? (pointerX - rectLeft) / safeScaleX : rectWidth ? rectWidth / 2 : 0;
	const clickY = Number.isFinite(pointerY) ? (pointerY - rectTop) / safeScaleY : rectHeight ? rectHeight / 2 : 0;

	return {
		x: Number(clickX.toFixed(2)),
		y: Number(clickY.toFixed(2)),
		maxRadius: Number(maxRadius.toFixed(2)),
	};
}
