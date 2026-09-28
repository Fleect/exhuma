export { AutoGrid, AutoGridItem } from './AutoGrid/AutoGrid';
export { useMacy } from './hooks/useMacy';
export type { UseMacyOptions } from './hooks/useMacy';
export { CssMasonry, CssMasonryItem } from './Masonry/CssMasonry';
export { MacyMasonry } from './Masonry/MacyMasonry';

// Wave 2: Responsive Layout Engines & Momentum
export { InfiniteMarquee, MarqueeRoot, MarqueeTrack, MarqueeItem } from './InfiniteMarquee/InfiniteMarquee';
export { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoVisual } from './BentoGrid/BentoGrid';
export { DiamondGrid, DiamondColumn, DiamondItem } from './DiamondGrid/DiamondGrid';

// Mathematical Kernels
export { calculateMarqueeOffset, dampFactor, parseGapToPx } from './InfiniteMarquee/marquee-math';
export { getDiamondLayoutConfig, partitionDiamondItems } from './DiamondGrid/diamond-layout';

export type {
	AutoGridProps,
	AutoGridItemProps,
	CssMasonryProps,
	CssMasonryItemProps,
	MacyMasonryProps,
	InfiniteMarqueeProps,
	BentoGridProps,
	BentoCardProps,
	DiamondGridProps,
	DiamondColumnProps,
	DiamondItemProps,
	DiamondLayoutVariant,
} from './types';
