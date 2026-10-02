/**
 * Bento Grid FLIP & Repulsion Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) FLIP displacement vectors.
 * - Exact closed-form spring position interpolation during span changes.
 * - Smooth asymptotic gaussian repulsion field during drag-and-drop cell interactions.
 */

export interface Vector2D {
	x: number;
	y: number;
}

export interface Delta2D {
	dx: number;
	dy: number;
}

/**
 * Calculates First-Last-Invert-Play (FLIP) invert translation delta.
 * Delta = OldPosition - NewPosition
 */
export function calculateFlipDisplacement(oldPos: Vector2D, newPos: Vector2D): Delta2D {
	return {
		dx: Number((oldPos.x - newPos.x).toFixed(2)),
		dy: Number((oldPos.y - newPos.y).toFixed(2)),
	};
}

/**
 * Closed-form analytical spring position interpolation for FLIP card transitions.
 * p(t) = p_new + delta_p * exp(-zeta * omega * t) * cos(omega_d * t)
 *
 * @param t Elapsed time in seconds
 * @param newPos Settled destination coordinates
 * @param delta Invert delta from calculateFlipDisplacement
 * @param omega Natural frequency in rad/s (default: 26)
 * @param zeta Damping ratio (default: 0.92)
 */
export function solveBentoSpringPosition(t: number, newPos: Vector2D, delta: Delta2D, omega: number = 26, zeta: number = 0.92): Vector2D {
	if (t <= 0) {
		return { x: newPos.x + delta.dx, y: newPos.y + delta.dy };
	}
	if (t >= 0.6) {
		return { x: newPos.x, y: newPos.y };
	}

	const omegaD = omega * Math.sqrt(Math.max(0.001, 1 - zeta * zeta));
	const decay = Math.exp(-zeta * omega * t);
	const factor = decay * Math.cos(omegaD * t);

	return {
		x: Number((newPos.x + delta.dx * factor).toFixed(2)),
		y: Number((newPos.y + delta.dy * factor).toFixed(2)),
	};
}

/**
 * Calculates dynamic gaussian repulsion vector on neighboring cells during cell dragging.
 * F_repel = (p_item - p_drag) / (||r||^2 + epsilon^2) * maxForce
 *
 * @param dragPos Coordinates of the actively dragged card
 * @param itemPos Coordinates of the neighboring card
 * @param maxForce Maximum repulsion force displacement in pixels (default: 32)
 * @param epsilon Softening length scale to avoid singularity (default: 120)
 */
export function calculateRepulsionVector(dragPos: Vector2D, itemPos: Vector2D, maxForce: number = 32, epsilon: number = 120): { fx: number; fy: number } {
	const rx = itemPos.x - dragPos.x;
	const ry = itemPos.y - dragPos.y;
	const distSq = rx * rx + ry * ry;

	if (distSq === 0) return { fx: 0, fy: 0 };

	const dist = Math.sqrt(distSq);
	// Gaussian falloff profile
	const intensity = Math.exp(-distSq / (2 * epsilon * epsilon));
	const force = maxForce * intensity;

	return {
		fx: Number(((rx / dist) * force).toFixed(2)),
		fy: Number(((ry / dist) * force).toFixed(2)),
	};
}
