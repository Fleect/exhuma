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
export {
	calculateMarqueeOffset,
	dampFactor,
	parseGapToPx,
	calculateCoupledScrollVelocity,
	evaluateMarqueeDirectionHysteresis,
} from './InfiniteMarquee/marquee-math';
export {
	getDiamondLayoutConfig,
	partitionDiamondItems,
	calculateConcentricRipple,
	calculateIsometricLift,
} from './DiamondGrid/diamond-layout';
export {
	calculateFlipDisplacement,
	solveBentoSpringPosition,
	calculateRepulsionVector,
} from './BentoGrid/bento-math';
export {
	calculateStaggerDelay,
	calculatePreservedAspectRatio,
} from './Masonry/masonry-math';
export {
	calculateSmoothstepGap,
	calculateGridCellCoordinates,
	calculateFlipShuffleDelta,
} from './AutoGrid/grid-math';

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

export { KineticGrid } from './KineticGrid/KineticGrid';
export * from './KineticGrid/kinetic-grid-math';
export { RowMasonry } from './RowMasonry/RowMasonry';
export * from './RowMasonry/row-masonry-math';
export { ParticleField } from './ParticleField/ParticleField';
export * from './ParticleField/particle-math';
