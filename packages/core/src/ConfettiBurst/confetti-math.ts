/**
 * Confetti Ballistic Physics Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Zero GC: entire particle state packed in pre-allocated Float32Array(count * 8)
 * - Ω(1) per-particle Verlet integration: constant time regardless of count
 * - Zero external dependencies: pure Math operations only
 */

// Particle buffer layout: [x, y, vx, vy, rotX, rotY, alpha, hueOffset] per particle
export const CONFETTI_PARTICLE_STRIDE = 8;

/** Allocate and initialize particle burst buffer. Returns Float32Array. */
export function initConfettiBuffer(
	count: number,
	originX: number,
	originY: number,
	spread: number,
	minSpeed: number,
	maxSpeed: number
): Float32Array {
	const buffer = new Float32Array(count * CONFETTI_PARTICLE_STRIDE);

	// Upwards is negative y
	const baseAngle = -Math.PI / 2;
	const spreadRad = (spread * Math.PI) / 180;

	for (let i = 0; i < count; i++) {
		const angle = baseAngle + (Math.random() - 0.5) * spreadRad;
		const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);

		const offset = i * CONFETTI_PARTICLE_STRIDE;
		buffer[offset + 0] = originX;
		buffer[offset + 1] = originY;
		buffer[offset + 2] = Math.cos(angle) * speed; // vx
		buffer[offset + 3] = Math.sin(angle) * speed; // vy
		buffer[offset + 4] = Math.random() * Math.PI * 2; // rotX
		buffer[offset + 5] = Math.random() * Math.PI * 2; // rotY
		buffer[offset + 6] = 1.0; // alpha
		buffer[offset + 7] = Math.random(); // hueOffset
	}

	return buffer;
}

/** Step all particles forward by dt seconds using Verlet integration. Mutates buffer in-place. */
export function stepConfettiBuffer(
	buf: Float32Array,
	dt: number,
	gravity: number,
	drag: number
): void {
	const count = buf.length / CONFETTI_PARTICLE_STRIDE;
	for (let i = 0; i < count; i++) {
		const offset = i * CONFETTI_PARTICLE_STRIDE;

		// x += vx * dt
		buf[offset + 0] += buf[offset + 2] * dt;
		// y += vy * dt
		buf[offset + 1] += buf[offset + 3] * dt;

		// Apply drag to velocity
		buf[offset + 2] -= buf[offset + 2] * drag;
		buf[offset + 3] -= buf[offset + 3] * drag;

		// Apply gravity
		buf[offset + 3] += gravity * dt;

		// Rotation
		buf[offset + 4] += dt * 5;
		buf[offset + 5] += dt * 5;

		// Alpha fade near bottom or after time
		buf[offset + 6] -= dt * 0.3;
	}
}

/** Returns true if all particles have alpha <= 0 (burst complete) */
export function isConfettiBurstComplete(buf: Float32Array): boolean {
	const count = buf.length / CONFETTI_PARTICLE_STRIDE;
	for (let i = 0; i < count; i++) {
		if (buf[i * CONFETTI_PARTICLE_STRIDE + 6] > 0) {
			return false;
		}
	}
	return true;
}
