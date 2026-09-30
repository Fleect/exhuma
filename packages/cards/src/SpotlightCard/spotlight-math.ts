/**
 * Exhuma Kinetic Methodology (EKM) — Spotlight Card Mathematics
 * O(1) coordinate normalization and radial illumination computation.
 */

export interface SpotlightCoordinates {
	x: number;
	y: number;
	normalizedX: number;
	normalizedY: number;
	isInside: boolean;
}

export interface RectBounds {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Computes exact normalized coordinates relative to element bounding rect.
 */
export function calculateSpotlightCoordinates(clientX: number, clientY: number, rect: DOMRect | RectBounds): SpotlightCoordinates {
	const x = clientX - rect.left;
	const y = clientY - rect.top;

	const normalizedX = rect.width > 0 ? x / rect.width : 0;
	const normalizedY = rect.height > 0 ? y / rect.height : 0;

	const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

	return {
		x,
		y,
		normalizedX,
		normalizedY,
		isInside,
	};
}

/**
 * Validates and clamps spotlight radius in pixels (min: 50, max: 2000).
 */
export function validateSpotlightRadius(radius: number, fallback = 350): number {
	if (typeof radius !== 'number' || isNaN(radius)) return fallback;
	return Math.max(50, Math.min(2000, radius));
}

/**
 * Validates and clamps spotlight opacity (min: 0.0, max: 1.0).
 */
export function validateSpotlightOpacity(opacity: number, fallback = 0.8): number {
	if (typeof opacity !== 'number' || isNaN(opacity)) return fallback;
	return Math.max(0, Math.min(1, opacity));
}

/**
 * Validates and clamps spotlight spread falloff percentage (min: 10, max: 100).
 */
export function validateSpotlightSpread(spread: number, fallback = 80): number {
	if (typeof spread !== 'number' || isNaN(spread)) return fallback;
	return Math.max(10, Math.min(100, spread));
}

/**
 * Constructs the radial illumination gradient string.
 */
export function generateSpotlightStyle(x: number, y: number, radius: number, color: string, _opacity?: number, spread = 80): string {
	const validRadius = validateSpotlightRadius(radius);
	const validSpread = validateSpotlightSpread(spread);
	return `radial-gradient(${validRadius}px circle at ${x}px ${y}px, ${color} 0%, transparent ${validSpread}%)`;
}

/**
 * Calculates Gaussian illumination intensity at radial distance d.
 * I(d) = peak * exp(-d^2 / (2 * sigma^2))
 */
export function calculateGaussianIntensity(distance: number, radius: number, peakOpacity: number = 1.0): number {
	if (radius <= 0 || distance < 0) return 0;
	const sigma = radius / 2.5;
	const intensity = peakOpacity * Math.exp(-(distance * distance) / (2 * sigma * sigma));
	return Number(Math.max(0, Math.min(1, intensity)).toFixed(4));
}

/**
 * Computes vector distance and coordinates from global pointer to card origin.
 */
export function calculateRelativeSpotlightVector(clientX: number, clientY: number, cardRect: RectBounds): { x: number; y: number; distance: number } {
	const x = clientX - cardRect.left;
	const y = clientY - cardRect.top;
	const dx = Math.max(0, Math.max(cardRect.left - clientX, clientX - (cardRect.left + cardRect.width)));
	const dy = Math.max(0, Math.max(cardRect.top - clientY, clientY - (cardRect.top + cardRect.height)));
	const distance = Math.sqrt(dx * dx + dy * dy);
	return { x, y, distance };
}
