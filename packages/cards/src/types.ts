import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';

export interface HorizontalScrollerProps {
	children: ReactNode;
	/**
	 * Speed factor for scroll translation distance multiplier.
	 * Default: 1.0
	 */
	speed?: number;
	/**
	 * Gap in pixels between horizontal track cards.
	 * Default: 28
	 */
	itemGap?: number;
	/**
	 * Fixed width in pixels of individual cards.
	 * Default: 320
	 */
	cardWidth?: number | string;
	/**
	 * Whether to display a kinetic bottom progress indicator track.
	 * Default: true
	 */
	showProgress?: boolean;
	/**
	 * Whether to apply gradient mask fading at horizontal boundaries.
	 * Default: true
	 */
	showFadeEdges?: boolean;
	/**
	 * Width in pixels of the left and right gradient fade masks.
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
	/**
	 * Mobile fallback behavior below 768px ('scroll' = native horizontal swipe with snap, 'stack' = vertical list, 'pinned' = keep pin).
	 * Default: 'scroll'
	 */
	mobileMode?: 'scroll' | 'stack' | 'pinned';
	/**
	 * Optional pinned header content (title, eyebrow, CTA) that remains fixed while cards scroll.
	 */
	header?: ReactNode;
	/**
	 * Optional scroll container reference (if inside an overflow scroll element rather than window).
	 */
	scrollContainerRef?: React.RefObject<HTMLElement | null>;
	/**
	 * Additional CSS class for outer container
	 */
	className?: string;
	/**
	 * Additional CSS class for the track/canvas
	 */
	trackClassName?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface StackingCardsProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Sticky start offset from top of viewport in px.
	 * Default: 20
	 */
	topStart?: number;
	/**
	 * Additional top increment for each subsequent card in px.
	 * Default: 28
	 */
	topIncrement?: number;
	/**
	 * Minimum scale for auto-generated values (e.g. 0.9 = 90% size).
	 * Default: 0.9
	 */
	minScale?: number;
	/**
	 * Threshold in px from top to trigger progressive scaling.
	 * Default: 150
	 */
	scaleThreshold?: number;
	/**
	 * Optional scroll container reference (if inside an overflow scroll element rather than window).
	 */
	scrollContainerRef?: React.RefObject<HTMLElement | null>;
	/**
	 * Whether the dynamic stacking calculations are enabled.
	 * Default: true
	 */
	enabled?: boolean;
	/**
	 * Vertical gap between cards before they stack over one another (in px or CSS string).
	 * Default: 20
	 */
	cardGap?: number | string;
	/**
	 * Alias for `cardGap`.
	 * Default: 20
	 */
	gap?: number | string;
	/**
	 * Whether reverse scaling exit cascade mechanics are enabled.
	 * Default: true
	 */
	reverseScale?: boolean;
	/**
	 * Alias for `reverseScale`.
	 * Default: true
	 */
	enableReverseScale?: boolean;
	/**
	 * Additional CSS class for wrapper container
	 */
	className?: string;
	/**
	 * Inline styles for the wrapper
	 */
	style?: CSSProperties;
}

export interface StackingCardItemProps {
	children: ReactNode;
	index: number;
	className?: string;
	style?: CSSProperties;
}

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Maximum tilt angle in degrees.
	 * Default: 15
	 */
	maxTilt?: number;
	/**
	 * 3D perspective depth in pixels.
	 * Default: 1000
	 */
	perspective?: number;
	/**
	 * Scale factor applied on card hover.
	 * Default: 1.02
	 */
	scale?: number;
	/**
	 * Spring damping response rate (0.05 - 0.30).
	 * Default: 0.12
	 */
	speed?: number;
	/**
	 * Invert tilt direction (tilts towards cursor when true).
	 * Default: false
	 */
	reverse?: boolean;
	/**
	 * Programmatically disable tilt animations and glare.
	 * Default: false
	 */
	disabled?: boolean;
	/**
	 * Constrain tilt rotation axis ('all' = 3D, 'x' = pitch only, 'y' = yaw only).
	 * Default: 'all'
	 */
	axis?: 'all' | 'x' | 'y';
	/**
	 * Whether to render a specular radial glare reflection layer.
	 * Default: false
	 */
	glare?: boolean;
	/**
	 * Peak opacity of specular glare reflection layer [0..1].
	 * Default: 0.25
	 */
	maxGlareOpacity?: number;
	/**
	 * Additional CSS class for card container
	 */
	className?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/**
	 * Radius of the spotlight in pixels.
	 * Default: 350
	 */
	radius?: number;
	/**
	 * Color of the spotlight glow (hex, rgb, or rgba).
	 * Default: 'rgba(99, 102, 241, 0.25)'
	 */
	color?: string;
	/**
	 * Spotlight opacity when active (0.0 to 1.0).
	 * Default: 0.8
	 */
	opacity?: number;
	/**
	 * Sub-pixel border glow color.
	 * Default: 'rgba(99, 102, 241, 0.5)'
	 */
	borderColor?: string;
	/**
	 * Radial gradient falloff softness / spread percentage (20 to 100).
	 * Default: 80
	 */
	spread?: number;
	/**
	 * Spotlight rendering mode: 'both' | 'border' | 'background'.
	 * Default: 'both'
	 */
	mode?: 'both' | 'border' | 'background';
	/**
	 * Kinetic exponential smoothing factor (0.05 to 1.0).
	 * Default: 0.2
	 */
	smoothing?: number;
	/**
	 * Programmatically disable pointer tracking and spotlight illumination.
	 * Default: false
	 */
	disabled?: boolean;
	/**
	 * Additional CSS class for card container
	 */
	className?: string;
	/**
	 * Inline styling overrides
	 */
	style?: CSSProperties;
}

export interface BorderBeamProps {
	/**
	 * Size/length of the beam in pixels.
	 * Default: 200
	 */
	size?: number;
	/**
	 * Duration of one full loop in seconds.
	 * Default: 8
	 */
	duration?: number;
	/**
	 * Width of the perimeter border beam in pixels.
	 * Default: 2
	 */
	borderWidth?: number;
	/**
	 * Start gradient color.
	 * Default: '#ffaa40'
	 */
	colorFrom?: string;
	/**
	 * End gradient color.
	 * Default: '#9c40ff'
	 */
	colorTo?: string;
	/**
	 * Whether to render a secondary beam on the opposite side of the perimeter, orbiting in the same direction (180° phase offset).
	 * Default: false
	 */
	doubleBeam?: boolean;
	/**
	 * Opacity at the tail/end of the beam (0 to 1). 0 fades to fully transparent.
	 * Default: 0
	 */
	endOpacity?: number;
	/**
	 * Overall opacity of the border beam container (0 to 1).
	 * Default: 1
	 */
	opacity?: number;
	/**
	 * Optional blur filter in pixels for extra laser neon glow.
	 * Default: 0
	 */
	blur?: number;
	/**
	 * Corner radius of the perimeter path in pixels to match card borders.
	 * Default: 16
	 */
	borderRadius?: number;
	/**
	 * Number of equidistant beams sweeping the perimeter path (1 to 8).
	 * Overrides doubleBeam when provided.
	 */
	beamCount?: number;
	/**
	 * Reverse the direction of the beam perimeter sweep (counter-clockwise).
	 * Default: false
	 */
	reverse?: boolean;
	className?: string;
	style?: CSSProperties;
}

export type { CardSwipeStackProps, CardSwipeStackHandle } from './CardSwipeStack/CardSwipeStack';
export type { ComparisonSliderProps } from './ComparisonSlider/ComparisonSlider';
export type { ExpandableCardProps } from './ExpandableCard/ExpandableCard';
