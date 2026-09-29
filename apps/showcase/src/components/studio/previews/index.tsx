import * as React from 'react';
import { ComponentPreviewProps } from './types';

// Cards
import StackingCardsPreview from './cards/StackingCardsPreview';
import HorizontalScrollerPreview from './cards/HorizontalScrollerPreview';
import TiltCardPreview from './cards/TiltCardPreview';
import SpotlightCardPreview from './cards/SpotlightCardPreview';
import BorderBeamPreview from './cards/BorderBeamPreview';
import CardSwipeStackPreview from './cards/CardSwipeStackPreview';
import ComparisonSliderPreview from './cards/ComparisonSliderPreview';
import ExpandableCardPreview from './cards/ExpandableCardPreview';
import ScratchCardPreview from './cards/ScratchCardPreview';

// Layouts
import CssMasonryPreview from './layouts/CssMasonryPreview';
import AutoGridPreview from './layouts/AutoGridPreview';
import InfiniteMarqueePreview from './layouts/InfiniteMarqueePreview';
import BentoGridPreview from './layouts/BentoGridPreview';
import DiamondGridPreview from './layouts/DiamondGridPreview';
import KineticGridPreview from './layouts/KineticGridPreview';
import RowMasonryPreview from './layouts/RowMasonryPreview';
import ParticleFieldPreview from './layouts/ParticleFieldPreview';

// Primitives / interactive
import { MorphingTabsPreview } from './primitives/MorphingTabsPreview';
import { AccordionPreview } from './primitives/AccordionPreview';
import { FloatingDockPreview } from './primitives/FloatingDockPreview';
import { NumberTickerPreview } from './primitives/NumberTickerPreview';
import { MagneticButtonPreview } from './primitives/MagneticButtonPreview';
import { CursorTooltipPreview } from './primitives/CursorTooltipPreview';
import TextScramblePreview from './primitives/TextScramblePreview';
import TextShimmerPreview from './primitives/TextShimmerPreview';
import ShimmerButtonPreview from './primitives/ShimmerButtonPreview';
import ClickEffectsPreview from './primitives/ClickEffectsPreview';
import ConfettiBurstPreview from './primitives/ConfettiBurstPreview';
import DrawerPreview from './primitives/DrawerPreview';
import HulyEffectPreview from './primitives/HulyEffectPreview';

export const COMPONENT_PREVIEWS: Record<string, React.ComponentType<any>> = {
	// Cards
	'stacking-cards': StackingCardsPreview,
	'horizontal-scroller': HorizontalScrollerPreview,
	'tilt-card': TiltCardPreview,
	'spotlight-card': SpotlightCardPreview,
	'border-beam': BorderBeamPreview,
	'card-swipe-stack': CardSwipeStackPreview,
	'comparison-slider': ComparisonSliderPreview,
	'expandable-card': ExpandableCardPreview,
	'scratch-card': ScratchCardPreview,
	// Layouts
	'css-masonry': CssMasonryPreview,
	'auto-grid': AutoGridPreview,
	'infinite-marquee': InfiniteMarqueePreview,
	'bento-grid': BentoGridPreview,
	'diamond-grid': DiamondGridPreview,
	'kinetic-grid': KineticGridPreview,
	'row-masonry': RowMasonryPreview,
	'particle-field': ParticleFieldPreview,
	// Primitives / interactive effects
	'morphing-tabs': MorphingTabsPreview,
	accordion: AccordionPreview,
	'floating-dock': FloatingDockPreview,
	'number-ticker': NumberTickerPreview,
	'magnetic-button': MagneticButtonPreview,
	'cursor-tooltip': CursorTooltipPreview,
	'text-scramble': TextScramblePreview,
	'text-shimmer': TextShimmerPreview,
	'shimmer-button': ShimmerButtonPreview,
	'click-effects': ClickEffectsPreview,
	'confetti-burst': ConfettiBurstPreview,
	drawer: DrawerPreview,
	'huly-effect': HulyEffectPreview,
};

export {
	StackingCardsPreview,
	HorizontalScrollerPreview,
	TiltCardPreview,
	SpotlightCardPreview,
	BorderBeamPreview,
	CardSwipeStackPreview,
	ComparisonSliderPreview,
	ExpandableCardPreview,
	ScratchCardPreview,
	CssMasonryPreview,
	AutoGridPreview,
	InfiniteMarqueePreview,
	BentoGridPreview,
	DiamondGridPreview,
	KineticGridPreview,
	RowMasonryPreview,
	ParticleFieldPreview,
	MorphingTabsPreview,
	AccordionPreview,
	FloatingDockPreview,
	NumberTickerPreview,
	MagneticButtonPreview,
	CursorTooltipPreview,
	TextScramblePreview,
	TextShimmerPreview,
	ShimmerButtonPreview,
	ClickEffectsPreview,
	ConfettiBurstPreview,
	DrawerPreview,
	HulyEffectPreview,
};

export type { ComponentPreviewProps };
