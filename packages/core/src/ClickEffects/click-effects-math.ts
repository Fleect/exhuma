/**
 * Click Micro-Physics Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) ripple radius: r(t) = R·(1 - e^(-λt)) in O(1)
 * - Zero layout reflow: all effects rendered on GPU-promoted canvas or CSS transforms
 * - Typed spark array: Float32Array for zero GC in spark burst mode
 */

export type ClickEffectMode = 'shockwave' | 'ripple' | 'sparks' | 'elastic';

/** Shockwave ring radius and opacity at time t */
export function calculateShockwave(t: number, maxRadius: number, lambda: number, alpha0: number): { radius: number; alpha: number } {
	const progress = Math.min(1, Math.max(0, t));
	const radius = maxRadius * (1 - Math.exp(-lambda * progress));
	const alpha = alpha0 * (1 - progress);
	return { radius, alpha };
}

/** Ripple filled circle expansion */
export function calculateRipple(t: number, maxRadius: number, duration: number): { radius: number; alpha: number } {
	const progress = Math.min(1, Math.max(0, t / duration));
	// Ease out cubic
	const easeOut = 1 - Math.pow(1 - progress, 3);
	return { radius: maxRadius * easeOut, alpha: 1 - progress };
}

/** Initialize Float32Array spark buffer [x0, y0, vx, vy, alpha] * count */
export function initSparks(count: number, originX: number, originY: number, speed: number): Float32Array {
	const buffer = new Float32Array(count * 5);
	for (let i = 0; i < count; i++) {
		const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
		const vel = speed * (0.8 + Math.random() * 0.4);
		buffer[i * 5 + 0] = originX;
		buffer[i * 5 + 1] = originY;
		buffer[i * 5 + 2] = Math.cos(angle) * vel;
		buffer[i * 5 + 3] = Math.sin(angle) * vel;
		buffer[i * 5 + 4] = 1.0; // alpha
	}
	return buffer;
}

/** Step spark buffer forward by dt seconds, returns Float32Array in-place */
export function stepSparks(sparks: Float32Array, dt: number, gravity: number): Float32Array {
	const count = sparks.length / 5;
	for (let i = 0; i < count; i++) {
		const base = i * 5;
		sparks[base + 0] += sparks[base + 2] * dt; // x += vx * dt
		sparks[base + 1] += sparks[base + 3] * dt; // y += vy * dt
		sparks[base + 3] += gravity * dt;          // vy += gravity * dt
		sparks[base + 4] -= dt * 1.5;              // fade alpha
	}
	return sparks;
}

/** Elastic scale for press/release spring */
export function calculateElasticScale(t: number, duration: number): number {
	const p = Math.min(1, Math.max(0, t / duration));
	// Basic elastic bounce
	return 1 - 0.1 * Math.sin(p * Math.PI * 3) * (1 - p);
}
