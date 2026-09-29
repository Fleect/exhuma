/**
 * DOM Prop Sanitizer — Exhuma Kinetic Methodology
 *
 * Strips props that are not valid HTML attributes before spreading onto DOM elements.
 * Prevents React "unknown prop" warnings when Studio injects control props like
 * `viewportMode`, `cardSwipeResetKey`, `tickerResetKey`, etc.
 */

// Studio-injected props that must never reach the DOM
const STUDIO_PROP_KEYS = new Set([
	'viewportMode',
	'cardSwipeResetKey',
	'tickerResetKey',
	'dockIconSet',
	'onResetCardSwipe',
	'onResetTicker',
	'onChangeDockIconSet',
]);

/**
 * Returns a copy of props with all non-DOM-safe Studio keys removed.
 * Call this before spreading onto any HTML element.
 *
 * @example
 * <div {...sanitizeDomProps(props)} />
 */
export function sanitizeDomProps<T extends Record<string, unknown>>(
	props: T
): Omit<T, keyof typeof STUDIO_PROP_KEYS> {
	const safe: Record<string, unknown> = {};
	for (const key in props) {
		if (!STUDIO_PROP_KEYS.has(key)) {
			safe[key] = props[key];
		}
	}
	return safe as Omit<T, keyof typeof STUDIO_PROP_KEYS>;
}
