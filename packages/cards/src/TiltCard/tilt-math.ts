/**
 * Tilt Card Pure Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Invariants:
 * - Pure arithmetic projection functions (zero heap allocation, zero DOM access).
 * - Exact Euler angle conversion [-maxTilt, +maxTilt].
 * - Deterministic radial glare specular mapping.
 */

export type TiltAxis = 'all' | 'x' | 'y';

export interface TiltRotation {
	rotX: number;
	rotY: number;
}

export interface GlareCoordinates {
	glareX: number;
	glareY: number;
	glareOpacity: number;
}

/**
 * Standard linear interpolation function.
 */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/**
 * Calculates 3D Euler rotation angles (rotX, rotY) from pointer coordinates relative to card bounds.
 *
 * @param x Pointer X relative to card top-left
 * @param y Pointer Y relative to card top-left
 * @param width Card bounding width
 * @param height Card bounding height
 * @param maxTilt Maximum tilt in degrees
 * @param reverse If true, inverts rotation (tilts toward cursor instead of sinking away)
 * @param axis Constrain to 'all', pitch only ('x'), or yaw only ('y')
 */
export function calculateTilt(x: number, y: number, width: number, height: number, maxTilt: number, reverse: boolean = false, axis: TiltAxis = 'all'): TiltRotation {
	if (width <= 0 || height <= 0) {
		return { rotX: 0, rotY: 0 };
	}

	// Normalized coordinates from center: [-0.5, 0.5]
	const normX = Math.max(-0.5, Math.min(0.5, x / width - 0.5));
	const normY = Math.max(-0.5, Math.min(0.5, y / height - 0.5));

	// Default behavior: pointer on top makes top sink (rotX < 0), pointer on right makes right sink (rotY > 0)
	const sign = reverse ? -1 : 1;

	const rawRotX = normY * -maxTilt * sign;
	const rawRotY = normX * maxTilt * sign;

	const rotX = axis === 'y' ? 0 : rawRotX;
	const rotY = axis === 'x' ? 0 : rawRotY;

	return {
		rotX: rotX === 0 ? 0 : rotX,
		rotY: rotY === 0 ? 0 : rotY,
	};
}

/**
 * Calculates glare specular coordinates and opacity from relative pointer position.
 *
 * @param x Pointer X relative to card top-left
 * @param y Pointer Y relative to card top-left
 * @param width Card bounding width
 * @param height Card bounding height
 * @param maxGlareOpacity Peak specular opacity [0..1]
 */
export function calculateGlare(x: number, y: number, width: number, height: number, maxGlareOpacity: number = 0.3): GlareCoordinates {
	if (width <= 0 || height <= 0) {
		return { glareX: 50, glareY: 50, glareOpacity: 0 };
	}

	const clampedX = Math.max(0, Math.min(width, x));
	const clampedY = Math.max(0, Math.min(height, y));

	return {
		glareX: (clampedX / width) * 100,
		glareY: (clampedY / height) * 100,
		glareOpacity: Math.max(0, Math.min(1, maxGlareOpacity)),
	};
}

/**
 * Generates the 3D CSS perspective transform string.
 */
export function generateTiltTransform(perspective: number, rotX: number, rotY: number, scale: number = 1.0): string {
	return `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, ${scale.toFixed(3)})`;
}

/**
 * Generates the CSS radial gradient style for the glare reflection layer.
 */
export function generateGlareStyle(glareX: number, glareY: number, glareOpacity: number): { opacity: string; background: string } {
	return {
		opacity: glareOpacity.toFixed(3),
		background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.8), transparent 60%)`,
	};
}

export interface ParallaxOffset {
	x: number;
	y: number;
}

/**
 * Calculates 2D diorama parallax translation offsets for nested child layers declaring data-depth.
 *
 * @param rotX Current pitch Euler angle in degrees
 * @param rotY Current yaw Euler angle in degrees
 * @param maxTilt Maximum tilt range in degrees
 * @param depth Relative depth coefficient (e.g. -20 to 50)
 */
export function calculateParallaxOffset(rotX: number, rotY: number, maxTilt: number, depth: number): ParallaxOffset {
	if (maxTilt <= 0 || depth === 0) {
		return { x: 0, y: 0 };
	}

	const normRotY = Math.max(-1, Math.min(1, rotY / maxTilt));
	const normRotX = Math.max(-1, Math.min(1, rotX / maxTilt));

	return {
		x: Number((normRotY * depth).toFixed(2)),
		y: Number((-normRotX * depth).toFixed(2)),
	};
}

/**
 * Generates hardware-composited 2D translation for parallax child layers.
 */
export function generateParallaxTransform(x: number, y: number): string {
	return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
}
