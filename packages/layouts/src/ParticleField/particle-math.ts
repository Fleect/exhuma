/**
 * Particle Field Brownian Motion & Repulsion Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Zero GC: all state in pre-allocated Float32Array(count * 6)
 * - Ω(1) per-particle integration: O(1) arithmetic per particle
 * - Auto-suspension: IntersectionObserver halts rAF when offscreen
 */

export const PARTICLE_STRIDE = 6;

/** Initialize particle buffer with random positions within [w, h] */
export function initParticleBuffer(count: number, w: number, h: number): Float32Array {
  const buf = new Float32Array(count * PARTICLE_STRIDE);
  for (let i = 0; i < count; i++) {
    const base = i * PARTICLE_STRIDE;
    const x = Math.random() * w;
    const y = Math.random() * h;
    buf[base + 0] = x; // x
    buf[base + 1] = y; // y
    buf[base + 2] = (Math.random() - 0.5) * 2; // vx
    buf[base + 3] = (Math.random() - 0.5) * 2; // vy
    buf[base + 4] = x; // x0
    buf[base + 5] = y; // y0
  }
  return buf;
}

/** Step particle buffer: apply Brownian drift + pointer repulsion. Mutates in-place. */
export function stepParticleBuffer(
  buf: Float32Array,
  dt: number,
  w: number,
  h: number,
  pointerX: number,
  pointerY: number,
  repulsionRadius: number,
  repulsionStrength: number,
  returnStrength: number,
  speed: number
): void {
  const count = buf.length / PARTICLE_STRIDE;
  for (let i = 0; i < count; i++) {
    const base = i * PARTICLE_STRIDE;
    let x = buf[base + 0];
    let y = buf[base + 1];
    let vx = buf[base + 2];
    let vy = buf[base + 3];
    const x0 = buf[base + 4];
    const y0 = buf[base + 5];

    // Pointer repulsion
    if (pointerX >= 0 && pointerY >= 0) {
      const dx = x - pointerX;
      const dy = y - pointerY;
      const distSq = dx * dx + dy * dy;
      const repRadSq = repulsionRadius * repulsionRadius;
      if (distSq < repRadSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (repulsionRadius - dist) / repulsionRadius * repulsionStrength;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
      }
    }

    // Return to origin force
    vx += (x0 - x) * returnStrength;
    vy += (y0 - y) * returnStrength;

    // Apply velocity
    x += vx * speed;
    y += vy * speed;

    // Boundary wrap/bounce
    if (x < 0 || x > w) { vx = -vx; x = x < 0 ? 0 : w; }
    if (y < 0 || y > h) { vy = -vy; y = y < 0 ? 0 : h; }

    // Damping
    vx *= 0.95;
    vy *= 0.95;

    // Add some brownian noise to keep them moving if they settle
    vx += (Math.random() - 0.5) * 0.1;
    vy += (Math.random() - 0.5) * 0.1;

    buf[base + 0] = x;
    buf[base + 1] = y;
    buf[base + 2] = vx;
    buf[base + 3] = vy;
  }
}
