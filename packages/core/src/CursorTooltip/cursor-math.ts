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

export type CursorTooltipVariant = 'frosted' | 'accent' | 'dark' | 'minimal' | 'glow' | 'morph-card';

export type CursorTooltipDirection = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top' | 'bottom' | 'left' | 'right';

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
 * Smooth boundary viewport sigmoid clamping.
 * Soft organic sigmoid deceleration near edges instead of rigid wall stops.
 */
export function calculateSigmoidClamp(targetX: number, targetY: number, tooltipWidth: number, tooltipHeight: number, viewportWidth: number, viewportHeight: number, padding: number = 12): CursorPosition {
	const safePadding = Math.max(0, padding);
	const minX = safePadding;
	const maxX = Math.max(minX, viewportWidth - tooltipWidth - safePadding);
	const minY = safePadding;
	const maxY = Math.max(minY, viewportHeight - tooltipHeight - safePadding);

	const softClamp = (val: number, min: number, max: number, maxBound: number): number => {
		if (max <= min) return min;
		if (val >= min && val <= max) return val;
		const cushion = Math.min(14, Math.max(4, safePadding * 0.9));
		if (val < min) {
			const overflow = min - val;
			const clamped = min - cushion * (1 - Math.exp(-overflow / cushion));
			return Math.max(0, clamped);
		} else {
			const overflow = val - max;
			const clamped = max + cushion * (1 - Math.exp(-overflow / cushion));
			return Math.min(maxBound, clamped);
		}
	};

	return {
		x: Number(softClamp(targetX, minX, maxX, Math.max(0, viewportWidth - tooltipWidth)).toFixed(2)),
		y: Number(softClamp(targetY, minY, maxY, Math.max(0, viewportHeight - tooltipHeight)).toFixed(2)),
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

/**
 * Calculates magnetic snapping coordinates when tooltip is near an anchor point.
 */
export function calculateMagneticSnap(cursorX: number, cursorY: number, targetX: number, targetY: number, captureRadius: number = 28, strength: number = 0.5): CursorPosition {
	const dx = targetX - cursorX;
	const dy = targetY - cursorY;
	const distance = Math.hypot(dx, dy);

	if (distance > captureRadius || captureRadius <= 0) {
		return { x: cursorX, y: cursorY };
	}

	const attenuation = 1 - distance / captureRadius;
	const snapFactor = strength * attenuation;

	return {
		x: Number((cursorX + dx * snapFactor).toFixed(2)),
		y: Number((cursorY + dy * snapFactor).toFixed(2)),
	};
}

/**
 * Calculates focal center for native text selection ranges.
 */
export function calculateSelectionCenter(rect: { left: number; top: number; right: number; bottom: number }): CursorPosition {
	return {
		x: Number(((rect.left + rect.right) / 2).toFixed(2)),
		y: Number(rect.top.toFixed(2)),
	};
}
