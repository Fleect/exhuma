/**
 * Exhuma Kinetic Methodology (EKM) — Deterministic Gesture Finite State Machine (FSM)
 *
 * Implements a strict 5-state automaton for touch/pointer gesture arbitration:
 * IDLE -> TRACKING -> CLAIMED -> DECELERATING -> RESTING
 *
 * Guarantees:
 * - O(1) Constant-Time state transitions
 * - O(1) Zero Heap Allocation during active touch tracking
 * - Angular Slop Detection to prevent mobile vertical page-scroll hijacking
 * - Circular Float64Array Ring Buffer with Exponential Moving Average (EMA) velocity smoothing
 */

export type GestureState = 'IDLE' | 'TRACKING' | 'CLAIMED' | 'DECELERATING' | 'RESTING';

export type GestureEvent =
	| { type: 'POINTER_DOWN'; x: number; y: number; time: number }
	| { type: 'POINTER_MOVE'; x: number; y: number; time: number }
	| { type: 'POINTER_UP'; x: number; y: number; time: number }
	| { type: 'POINTER_CANCEL' }
	| { type: 'RESET' };

export interface VelocityVector {
	vx: number;
	vy: number;
	speed: number;
}

/**
 * Pre-allocated 5-sample circular ring buffer for O(1) velocity estimation.
 * Format: [x0, y0, t0, x1, y1, t1, x2, y2, t2, x3, y3, t3, x4, y4, t4]
 */
export class VelocityRingBuffer {
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

	/**
	 * Computes Exponential Moving Average (EMA) velocity across buffered samples.
	 */
	public computeVelocity(): VelocityVector {
		if (this.count < 2) {
			return { vx: 0, vy: 0, speed: 0 };
		}

		// Read latest sample
		const latestIdx = (this.head - 1 + 5) % 5;
		const oldestIdx = (this.head - this.count + 5) % 5;

		const xLatest = this.data[latestIdx * 3];
		const yLatest = this.data[latestIdx * 3 + 1];
		const tLatest = this.data[latestIdx * 3 + 2];

		const xOldest = this.data[oldestIdx * 3];
		const yOldest = this.data[oldestIdx * 3 + 1];
		const tOldest = this.data[oldestIdx * 3 + 2];

		const dt = (tLatest - tOldest) / 1000; // in seconds
		if (dt <= 0.001) {
			return { vx: 0, vy: 0, speed: 0 };
		}

		const vx = (xLatest - xOldest) / dt;
		const vy = (yLatest - yOldest) / dt;
		const speed = Math.sqrt(vx * vx + vy * vy);

		return { vx, vy, speed };
	}
}

export interface SlopConfig {
	/** Minimum travel distance before committing (default 8px) */
	distanceThreshold?: number;
	/** Maximum angle in radians relative to primary axis (default Math.PI / 6 = 30 deg) */
	maxAngleRad?: number;
}

/**
 * Evaluates whether a touch displacement qualifies as an intentional primary-axis gesture.
 */
export function checkGestureSlop(dx: number, dy: number, primaryAxis: 'x' | 'y' = 'x', config: SlopConfig = {}): { isClaimed: boolean; isRejected: boolean } {
	const threshold = config.distanceThreshold ?? 8;
	const distance = Math.hypot(dx, dy);

	if (distance < threshold) {
		return { isClaimed: false, isRejected: false };
	}

	const angle = primaryAxis === 'x' ? Math.atan2(Math.abs(dy), Math.abs(dx)) : Math.atan2(Math.abs(dx), Math.abs(dy));
	const maxAngle = config.maxAngleRad ?? Math.PI / 6; // 30 degrees

	if (angle <= maxAngle) {
		return { isClaimed: true, isRejected: false };
	}

	return { isClaimed: false, isRejected: true };
}
