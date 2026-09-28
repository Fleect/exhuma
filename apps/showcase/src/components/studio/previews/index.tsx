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

// Layouts
import CssMasonryPreview from './layouts/CssMasonryPreview';
import AutoGridPreview from './layouts/AutoGridPreview';
import InfiniteMarqueePreview from './layouts/InfiniteMarqueePreview';
import BentoGridPreview from './layouts/BentoGridPreview';
import DiamondGridPreview from './layouts/DiamondGridPreview';

// Primitives
import { MorphingTabsPreview } from './primitives/MorphingTabsPreview';
import { AccordionPreview } from './primitives/AccordionPreview';
import { FloatingDockPreview } from './primitives/FloatingDockPreview';
import { NumberTickerPreview } from './primitives/NumberTickerPreview';
import { MagneticButtonPreview } from './primitives/MagneticButtonPreview';
import { CursorTooltipPreview } from './primitives/CursorTooltipPreview';

export const COMPONENT_PREVIEWS: Record<string, React.ComponentType<any>> = {
	'stacking-cards': StackingCardsPreview,
	'horizontal-scroller': HorizontalScrollerPreview,
	'tilt-card': TiltCardPreview,
	'spotlight-card': SpotlightCardPreview,
	'border-beam': BorderBeamPreview,
	'card-swipe-stack': CardSwipeStackPreview,
	'comparison-slider': ComparisonSliderPreview,
	'expandable-card': ExpandableCardPreview,
	'css-masonry': CssMasonryPreview,
	'auto-grid': AutoGridPreview,
	'infinite-marquee': InfiniteMarqueePreview,
	'bento-grid': BentoGridPreview,
	'diamond-grid': DiamondGridPreview,
	'morphing-tabs': MorphingTabsPreview,
	accordion: AccordionPreview,
	'floating-dock': FloatingDockPreview,
	'number-ticker': NumberTickerPreview,
	'magnetic-button': MagneticButtonPreview,
	'cursor-tooltip': CursorTooltipPreview,
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
	CssMasonryPreview,
	AutoGridPreview,
	InfiniteMarqueePreview,
	BentoGridPreview,
	DiamondGridPreview,
	MorphingTabsPreview,
	AccordionPreview,
	FloatingDockPreview,
	NumberTickerPreview,
	MagneticButtonPreview,
	CursorTooltipPreview,
};

export type { ComponentPreviewProps };
