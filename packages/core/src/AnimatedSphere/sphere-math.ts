/**
 * 3D Spherical Trigonometry & Euler Rotation Kernel — Exhuma Kinetic Methodology (EKM)
 * Elevated from sapan.dev
 *
 * Big-Omega (Ω) Guarantees:
 * - Deterministic O(N) 3D coordinate projection
 * - Zero external 3D libraries (Zero Three.js / WebGL)
 * - Pure CPU 2D projection with analytical trigonometric functions
 */

export interface ProjectedPoint {
	x: number;
	y: number;
	z: number;
	depth: number;
	char: string;
}

export const DEFAULT_SPHERE_CHARS = '░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯';

/**
 * Projects a spherical surface point rotated by Euler angles (rotX, rotY) onto 2D canvas coordinates.
 */
export function projectSphericalPoint(theta: number, phi: number, rotX: number, rotY: number, radius: number, centerX: number, centerY: number, chars: string = DEFAULT_SPHERE_CHARS): ProjectedPoint {
	const cosY = Math.cos(rotY);
	const sinY = Math.sin(rotY);
	const cosX = Math.cos(rotX);
	const sinX = Math.sin(rotX);

	const sinTheta = Math.sin(theta);
	const cosTheta = Math.cos(theta);
	const cosPhi = Math.cos(phi);
	const sinPhi = Math.sin(phi);

	// Unit sphere 3D coordinates
	const x = sinTheta * cosPhi;
	const y = sinTheta * sinPhi;
	const z = cosTheta;

	// Rotation around Y axis
	const newX = x * cosY - z * sinY;
	const newZ = x * sinY + z * cosY;

	// Rotation around X axis
	const newY = y * cosX - newZ * sinX;
	const finalZ = y * sinX + newZ * cosX;

	// Normalized depth [0..1]
	const depth = Math.max(0, Math.min(1, (finalZ + 1) / 2));
	const charIndex = Math.min(chars.length - 1, Math.floor(depth * (chars.length - 1)));

	return {
		x: centerX + newX * radius,
		y: centerY + newY * radius,
		z: finalZ,
		depth,
		char: chars[charIndex] || '·',
	};
}
