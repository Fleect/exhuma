/**
 * DOM Prop Sanitizer — Exhuma Kinetic Methodology
 * Strips Studio-injected control props before spreading onto HTML elements.
 */
const STUDIO_PROP_KEYS = new Set(['viewportMode', 'cardSwipeResetKey', 'tickerResetKey', 'dockIconSet', 'onResetCardSwipe', 'onResetTicker', 'onChangeDockIconSet']);

export function sanitizeDomProps<T extends Record<string, unknown>>(props: T): Partial<T> {
	const safe: Record<string, unknown> = {};
	for (const key in props) {
		if (!STUDIO_PROP_KEYS.has(key)) safe[key] = props[key];
	}
	return safe as Partial<T>;
}
