export { HorizontalScroller, calculateHorizontalDistance, calculateSectionHeight, calculateScrollProgress } from './HorizontalScroller/HorizontalScroller';
export { StackingCards, calculateScaleValue, generateDefaultScaleValues, getReverseScale, smoothstep } from './StackingCards/StackingCards';
export { TiltCard } from './TiltCard/TiltCard';
export { calculateTilt, calculateGlare, generateTiltTransform, generateGlareStyle, calculateParallaxOffset, generateParallaxTransform } from './TiltCard/tilt-math';
export type { TiltAxis, TiltRotation, GlareCoordinates, ParallaxOffset } from './TiltCard/tilt-math';
export { SpotlightCard, SpotlightGroup, Spotlight } from './SpotlightCard/SpotlightCard';
export type { SpotlightGroupProps } from './SpotlightCard/SpotlightCard';
export {
	calculateSpotlightCoordinates,
	generateSpotlightStyle,
	validateSpotlightRadius,
	validateSpotlightOpacity,
	validateSpotlightSpread,
	calculateGaussianIntensity,
	calculateRelativeSpotlightVector,
} from './SpotlightCard/spotlight-math';
export type { SpotlightCoordinates, RectBounds } from './SpotlightCard/spotlight-math';
export { BorderBeam } from './BorderBeam/BorderBeam';
export { calculateBeamDelays, resolveEffectiveBeamCount } from './BorderBeam/beam-math';
export { CardSwipeStack } from './CardSwipeStack/CardSwipeStack';
export {
	calculateCardRotation,
	evaluateSwipeDecision,
	calculateStackedCardTransform,
	calculateFlingDuration,
	calculateElasticDamping,
	SwipeVelocityRingBuffer,
	evaluateMultiAxisSwipeDecision,
	calculateUndoTrajectory,
} from './CardSwipeStack/swipe-math';
export type { SwipeDirection4Way, SwipeDecision4Way } from './CardSwipeStack/swipe-math';
export { ComparisonSlider } from './ComparisonSlider/ComparisonSlider';
export {
	calculateSplitPosition,
	calculateVerticalSplitPosition,
	generateClipPath,
	generateVerticalClipPath,
	stepSliderPosition,
	calculateIdleBreathingOffset,
	generateLoupeClipPath,
} from './ComparisonSlider/slider-math';
export { ExpandableCard, ExpandableRoot, ExpandableTrigger, ExpandableContent, ExpandableClose } from './ExpandableCard/ExpandableCard';
export { calculateFLIPDelta, generateInvertTransform, calculateRubberBandPull, calculateModalProgressTransform } from './ExpandableCard/flip-math';
export type {
	HorizontalScrollerProps,
	StackingCardItemProps,
	StackingCardsProps,
	TiltCardProps,
	SpotlightCardProps,
	BorderBeamProps,
	CardSwipeStackProps,
	CardSwipeStackHandle,
	ComparisonSliderProps,
	ExpandableCardProps,
} from './types';
