/**
 * Card Swipe Stack Mathematical Kernel & Gesture Ring Buffer
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) transform and swipe decision math.
 * - Zero heap allocations: Float64Array circular ring buffer for velocity tracking.
 */

export interface SwipeDecision {
	isDismissed: boolean;
	direction: 'left' | 'right' | null;
}

/**
 * Pre-allocated 5-sample circular ring buffer for O(1) velocity estimation.
 * Format: [x0, y0, t0, x1, y1, t1, x2, y2, t2, x3, y3, t3, x4, y4, t4]
 */
export class SwipeVelocityRingBuffer {
	private readonly data = new Float64Array(15);
	private count = 0;
	private head = 0;

	public clear(): void {
		this.count = 0;
		this.head = 0;
		this.data.fill(0);
	}

	public push(x: number, y: number, time: number): void {
		const offset = this.head * 3;
		this.data[offset] = x;
		this.data[offset + 1] = y;
		this.data[offset + 2] = time;

		this.head = (this.head + 1) % 5;
		if (this.count < 5) {
			this.count++;
		}
	}

	public computeVelocityX(): number {
		if (this.count < 2) return 0;
		const newestIdx = (this.head - 1 + 5) % 5;
		const oldestIdx = (this.head - this.count + 5) % 5;

		const dx = this.data[newestIdx * 3] - this.data[oldestIdx * 3];
		const dt = (this.data[newestIdx * 3 + 2] - this.data[oldestIdx * 3 + 2]) / 1000;

		if (dt <= 0.0001) return 0;
		return dx / dt;
	}
}

/**
 * Calculates card rotation angle in degrees coupled to horizontal displacement.
 */
export function calculateCardRotation(dx: number, maxRotation: number = 22, threshold: number = 180): number {
	const ratio = Math.max(-1, Math.min(1, dx / threshold));
	return ratio * maxRotation;
}

/**
 * Evaluates whether a gesture qualifies as a dismiss swipe based on distance or velocity.
 */
export function evaluateSwipeDecision(dx: number, velocity: number, thresholdDistance: number = 120, thresholdVelocity: number = 550): SwipeDecision {
	if (dx > thresholdDistance || velocity > thresholdVelocity) {
		return { isDismissed: true, direction: 'right' };
	}
	if (dx < -thresholdDistance || velocity < -thresholdVelocity) {
		return { isDismissed: true, direction: 'left' };
	}
	return { isDismissed: false, direction: null };
}

/**
 * Calculates scale and translation for background cards in stack during drag progress.
 * Uses Hermite cubic smoothstep (3t^2 - 2t^3) for zero-discontinuity layer elevation.
 */
export function calculateStackedCardTransform(index: number, progress: number, scaleStep: number = 0.05, offsetStep: number = 14, baseOpacityStep: number = 0.15): { scale: number; translateY: number; opacity: number } {
	// Base values at rest
	const baseScale = Math.max(0.6, 1 - index * scaleStep);
	const baseOffset = index * offsetStep;
	const baseOpacity = Math.max(0.3, 1 - index * baseOpacityStep);

	// Interpolate towards the position of card (index - 1) as top card is swiped away
	const targetScale = Math.max(0.6, 1 - (index - 1) * scaleStep);
	const targetOffset = Math.max(0, (index - 1) * offsetStep);
	const targetOpacity = Math.max(0.3, 1 - (index - 1) * baseOpacityStep);

	// Hermite cubic smoothstep: 3t^2 - 2t^3
	const clamped = Math.min(1, Math.max(0, progress));
	const smoothProgress = clamped * clamped * (3 - 2 * clamped);

	return {
		scale: baseScale + (targetScale - baseScale) * smoothProgress,
		translateY: baseOffset + (targetOffset - baseOffset) * smoothProgress,
		opacity: baseOpacity + (targetOpacity - baseOpacity) * smoothProgress,
	};
}

/**
 * Calculates dynamic fling animation duration based on release velocity and remaining travel distance.
 */
export function calculateFlingDuration(distanceRemaining: number, velocityX: number, minDuration: number = 160, maxDuration: number = 300): number {
	const absVel = Math.abs(velocityX);
	if (absVel <= 150) return maxDuration;
	const natural = (distanceRemaining / absVel) * 1000;
	return Math.max(minDuration, Math.min(maxDuration, natural));
}

/**
 * Applies non-linear elastic damping to a drag displacement.
 * Used for the last card resistance: finger can feel the rubber-band but the card
 * never travels far enough to trigger a dismiss.
 *
 * Formula: sign(dx) * |dx|^exponent * scale
 * Default exponent = 0.78 gives a natural rubber-band feel.
 * Returned value is always ≤ maxDistance.
 */
export function calculateElasticDamping(dx: number, maxDistance: number = 80, exponent: number = 0.78, scale: number = 2.2): number {
	if (dx === 0) return 0;
	const sign = dx > 0 ? 1 : -1;
	const damped = Math.pow(Math.abs(dx), exponent) * scale;
	return sign * Math.min(damped, maxDistance);
}

export type SwipeDirection4Way = 'left' | 'right' | 'up' | 'down' | null;

export interface SwipeDecision4Way {
	isDismissed: boolean;
	direction: SwipeDirection4Way;
}

/**
 * Evaluates 4-way gesture swipe decision (Left/Right/Up/Down) based on orthogonal energy dominance.
 */
export function evaluateMultiAxisSwipeDecision(dx: number, dy: number, vx: number, vy: number, thresholdDistance: number = 120, thresholdVelocity: number = 550): SwipeDecision4Way {
	const isHorizontal = Math.abs(dx) >= Math.abs(dy);

	if (isHorizontal) {
		if (dx > thresholdDistance || vx > thresholdVelocity) {
			return { isDismissed: true, direction: 'right' };
		}
		if (dx < -thresholdDistance || vx < -thresholdVelocity) {
			return { isDismissed: true, direction: 'left' };
		}
	} else {
		if (dy > thresholdDistance || vy > thresholdVelocity) {
			return { isDismissed: true, direction: 'down' };
		}
		if (dy < -thresholdDistance || vy < -thresholdVelocity) {
			return { isDismissed: true, direction: 'up' };
		}
	}

	return { isDismissed: false, direction: null };
}

/**
 * Calculates reverse trajectory coordinates for undo restitution spring.
 */
export function calculateUndoTrajectory(progress: number, exitX: number, exitY: number): { x: number; y: number } {
	const t = Math.max(0, Math.min(1, progress));
	const factor = 1 - t * t * (3 - 2 * t);
	return {
		x: Number((exitX * factor).toFixed(2)),
		y: Number((exitY * factor).toFixed(2)),
	};
}
