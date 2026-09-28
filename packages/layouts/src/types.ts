import type { CSSProperties, ReactNode } from 'react';

export interface CssMasonryProps {
	children: ReactNode;
	/**
	 * Number of columns or responsive column map.
	 * Default: 3
	 */
	columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
	/**
	 * Column count override on mobile viewports (<640px).
	 * Default: 1
	 */
	columnsSm?: number;
	/**
	 * Column count override on tablet viewports (640px-1024px).
	 * Default: 2
	 */
	columnsMd?: number;
	/**
	 * Column count override on desktop viewports (1024px-1280px).
	 * Default: 3
	 */
	columnsLg?: number;
	/**
	 * Column count override on ultra-wide viewports (>=1280px).
	 * Default: 4
	 */
	columnsXl?: number;
	/**
	 * Spacing between columns and items in px or rem.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	/**
	 * Multi-column fill mode ('balance' or 'auto').
	 * Default: 'balance'
	 */
	columnFill?: 'balance' | 'auto';
	/**
	 * Fixed or maximum container height.
	 * Required by WebKit/Blink for column-fill: auto (sequential waterfall) to trigger.
	 */
	height?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface CssMasonryItemProps {
	children: ReactNode;
	/**
	 * CSS break-inside control to prevent item splitting across columns.
	 * Default: 'avoid'
	 */
	breakInside?: 'avoid' | 'auto';
	className?: string;
	style?: CSSProperties;
}

export interface AutoGridProps {
	children: ReactNode;
	/**
	 * Minimum column width before wrapping.
	 * Default: 280
	 */
	minItemWidth?: number | string;
	/**
	 * CSS gap between items in px or rem.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	/**
	 * CSS Grid repeat track mode ('auto-fit' or 'auto-fill').
	 * Default: 'auto-fit'
	 */
	mode?: 'auto-fit' | 'auto-fill';
	/**
	 * Maximum column count ceiling (e.g. 4 for max 4 columns).
	 */
	maxColumns?: number;
	/**
	 * Cross-axis alignment of grid items.
	 * Default: 'stretch'
	 */
	alignItems?: 'start' | 'center' | 'end' | 'stretch';
	className?: string;
	style?: CSSProperties;
}

export interface AutoGridItemProps {
	children: ReactNode;
	/**
	 * Column span across grid tracks.
	 */
	colSpan?: number | 'full';
	/**
	 * Row span across grid tracks.
	 */
	rowSpan?: number;
	className?: string;
	style?: CSSProperties;
}

export interface MacyMasonryProps {
	children: ReactNode;
	/**
	 * Number of columns for Macy height balancing.
	 * Default: 3
	 */
	columns?: number;
	/**
	 * Margin between items in px.
	 * Default: 20
	 */
	margin?: number;
	/**
	 * Breakpoints object for responsive column overrides.
	 * Example: { 1024: 3, 768: 2, 480: 1 }
	 */
	breakAt?: Record<number, number>;
	className?: string;
	style?: CSSProperties;
}

export interface InfiniteMarqueeProps {
	children: ReactNode;
	/**
	 * Scroll speed in pixels per second.
	 * Default: 40
	 */
	speed?: number;
	/**
	 * Direction of marquee translation.
	 * Default: 'left'
	 */
	direction?: 'left' | 'right';
	/**
	 * Smoothly decelerate to zero when hovered.
	 * Default: true
	 */
	pauseOnHover?: boolean;
	/**
	 * Spacing between items and repeated blocks.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	/**
	 * Show subtle gradient mask at boundaries for graceful entry and exit.
	 * Default: true
	 */
	showFadeEdges?: boolean;
	/**
	 * Width of the edge gradient fade in pixels.
	 * Default: 48
	 */
	fadeWidth?: number;
	/**
	 * Custom edge gradient color for light mode (e.g. #ffffff). When empty, an alpha mask is used.
	 * Default: '#ffffff'
	 */
	fadeEdgeColor?: string;
	/**
	 * Edge gradient color when dark mode is active (e.g. #09090b). Falls back to fadeEdgeColor if not set.
	 * Default: '#09090b'
	 */
	fadeEdgeColorDark?: string;
	className?: string;
	style?: CSSProperties;
}

export interface BentoGridProps {
	children: ReactNode;
	/**
	 * Maximum column count for large screens.
	 * Default: 3
	 */
	cols?: number | { sm?: number; md?: number; lg?: number };
	/**
	 * Spacing between bento tiles in px or rem.
	 * Default: '1.5rem'
	 */
	gap?: string | number;
	/**
	 * Base auto-rows track height in px or CSS string for asymmetric vertical spans.
	 * Default: undefined
	 */
	rowHeight?: string | number;
	className?: string;
	style?: CSSProperties;
}

export interface BentoCardProps {
	children: ReactNode;
	/**
	 * Column span on desktop screens (1-4).
	 * Default: 1
	 */
	colSpan?: number;
	/**
	 * Row span on desktop screens (1-3).
	 * Default: 1
	 */
	rowSpan?: number;
	/**
	 * Enable subtle kinetic pointer hover glow.
	 * Default: true
	 */
	enableGlow?: boolean;
	/**
	 * Custom radial glow color on hover (e.g. 'rgba(99, 102, 241, 0.08)').
	 * Default: 'rgba(99, 102, 241, 0.08)'
	 */
	glowColor?: string;
	className?: string;
	style?: CSSProperties;
}

export type DiamondLayoutVariant = 'large' | 'medium' | 'small' | 'auto';
export type DiamondGridMode = 'rhombic' | 'isometric';

export interface DiamondGridProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	/**
	 * Spacing between diamond columns and elements.
	 * Can be a number (px) or string (e.g. '16px', '1rem', '0.75vw').
	 * Default: 16
	 */
	gap?: string | number;
	/**
	 * Diamond layout topology:
	 * - 'large': 7 columns [1, 2, 3, 4, 3, 2, 1] (Apex: 4)
	 * - 'medium': 5 columns [1, 2, 3, 2, 1] (Apex: 3)
	 * - 'small': 3 columns [1, 2, 1] (Apex: 2)
	 * - 'auto': Derived dynamically from children count
	 * Default: 'auto'
	 */
	layout?: DiamondLayoutVariant;
	/**
	 * Visual rendering mode:
	 * - 'rhombic': Classic signature layout from sapan.dev — upright cards arranged in a symmetrical rhombic column silhouette [1, 2, 3, 4, 3, 2, 1].
	 * - 'isometric': 45-degree diamond-tilted cards (rotate-45) with upright counter-rotated content.
	 * Default: 'rhombic'
	 */
	mode?: DiamondGridMode;
	/**
	 * Automatically apply 45-degree diamond card styling to items with counter-rotated upright content.
	 * Default: false
	 */
	diamondItems?: boolean;
	/**
	 * Enable responsive collapse to a compact grid on narrow mobile screens (< 420px).
	 * When false, preserves the authentic rhombic diamond column structure across all viewport widths.
	 * Default: false
	 */
	responsive?: boolean;
}

export interface DiamondColumnProps extends React.HTMLAttributes<HTMLDivElement> {
	columnIndex: number;
	gap?: string | number;
}

export interface DiamondItemProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Visual rendering mode for the diamond item.
	 * Default: 'rhombic'
	 */
	mode?: DiamondGridMode;
	/**
	 * Automatically apply 45-degree diamond rotation styling to the card container
	 * and counter-rotate child content so it remains upright.
	 * Default: false
	 */
	diamond?: boolean;
}
