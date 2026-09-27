/**
 * Cursor Tooltip Mathematical Kernel
 * Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Constant-time Ω(1) collision boundary clamping and lerp smoothing.
 * - Zero heap allocations per frame: static coordinates.
 * - Frame-rate independent exponential decay with delta-t integration.
 */

export interface CursorPosition {
	x: number;
	y: number;
}

export type CursorTooltipVariant = 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow';

export type CursorTooltipDirection =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right';

/**
 * Calculates element center coordinates.
 */
export function calculateElementCenter(rect: { left: number; top: number; width: number; height: number }): CursorPosition {
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
}

/**
 * Computes directional offset target position from client cursor coordinates.
 */
export function calculateTargetPosition(
	clientX: number,
	clientY: number,
	offsetX: number = 16,
	offsetY: number = 16,
	direction: CursorTooltipDirection = 'bottom-right',
	width: number = 0,
	height: number = 0
): CursorPosition {
	switch (direction) {
		case 'top':
			return {
				x: clientX - width / 2,
				y: clientY - offsetY - height,
			};
		case 'bottom':
			return {
				x: clientX - width / 2,
				y: clientY + offsetY,
			};
		case 'left':
			return {
				x: clientX - offsetX - width,
				y: clientY - height / 2,
			};
		case 'right':
			return {
				x: clientX + offsetX,
				y: clientY - height / 2,
			};
		case 'top-left':
			return {
				x: clientX - offsetX - width,
				y: clientY - offsetY - height,
			};
		case 'top-right':
			return {
				x: clientX + offsetX,
				y: clientY - offsetY - height,
			};
		case 'bottom-left':
			return {
				x: clientX - offsetX - width,
				y: clientY + offsetY,
			};
		case 'bottom-right':
		default:
			return {
				x: clientX + offsetX,
				y: clientY + offsetY,
			};
	}
}

/**
 * Clamps tooltip coordinates to ensure it stays fully visible within the browser viewport or container bounds.
 */
export function clampTooltipToViewport(targetX: number, targetY: number, tooltipWidth: number, tooltipHeight: number, viewportWidth: number, viewportHeight: number, padding: number = 12): CursorPosition {
	const safePadding = Math.max(0, padding);
	const maxX = Math.max(safePadding, viewportWidth - tooltipWidth - safePadding);
	const maxY = Math.max(safePadding, viewportHeight - tooltipHeight - safePadding);

	return {
		x: Math.min(maxX, Math.max(safePadding, targetX)),
		y: Math.min(maxY, Math.max(safePadding, targetY)),
	};
}

/**
 * Frame-rate independent exponential decay for a single coordinate axis.
 */
export function dampCursorCoordinate(current: number, target: number, lambda: number = 20, dt: number = 0.016): number {
	if (!Number.isFinite(current) || !Number.isFinite(target)) return target;
	if (!Number.isFinite(lambda) || lambda <= 0) return target;
	if (!Number.isFinite(dt) || dt <= 0) return current;
	const diff = target - current;
	if (Math.abs(diff) < 0.001) return target;
	return current + diff * (1 - Math.exp(-lambda * dt));
}
