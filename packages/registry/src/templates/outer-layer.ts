import { ComponentFilePayload, EcosystemFlavor } from '../schema';
import { getComparisonSliderOuterFiles } from './generators/comparison-slider-generator';
import { getExpandableCardOuterFiles } from './generators/expandable-card-generator';
import { getCardSwipeStackOuterFiles } from './generators/card-swipe-stack-generator';
import { getAutoGridOuterFiles } from './generators/auto-grid-generator';
import { getCssMasonryOuterFiles } from './generators/css-masonry-generator';
import { getInfiniteMarqueeOuterFiles } from './generators/infinite-marquee-generator';
import { getHorizontalScrollerOuterFiles } from './generators/horizontal-scroller-generator';
import { getBentoGridOuterFiles } from './generators/bento-grid-generator';
import { getDiamondGridOuterFiles } from './generators/diamond-grid-generator';
import { getMorphingTabsOuterFiles } from './generators/morphing-tabs-generator';
import { getFloatingDockOuterFiles } from './generators/floating-dock-generator';
import { getAccordionOuterFiles } from './generators/accordion-generator';
import { getNumberTickerOuterFiles } from './generators/number-ticker-generator';
import { getStackingCardsOuterFiles } from './generators/stacking-cards-generator';
import { getSpotlightCardOuterFiles } from './generators/spotlight-card-generator';
import { getBorderBeamOuterFiles } from './generators/border-beam-generator';
import { getMagneticButtonOuterFiles } from './generators/magnetic-button-generator';
import { getCursorTooltipOuterFiles } from './generators/cursor-tooltip-generator';
import { getTiltCardOuterFiles } from './generators/tilt-card-generator';
import { getGenericOuterFiles } from './generic-fallback';

export interface CompoundPart {
	name: string;
	primitiveExport?: string;
	defaultClass?: string;
}

export interface ComponentOuterSpec {
	id: string;
	name: string;
	slug: string;
	category: 'cards' | 'layouts' | 'navigation' | 'primitives';
	pascalName: string;
	snakeName: string;
	description: string;
	propsInterface?: string;
	defaultTailwindClass?: string;
	compoundParts?: CompoundPart[];
}

export function generateOuterLayerFiles(
	spec: ComponentOuterSpec,
	flavor: EcosystemFlavor,
	props: Record<string, unknown>,
	options?: { eject?: boolean }
): ComponentFilePayload[] {
	const {
		name,
		slug,
		pascalName,
		defaultTailwindClass = 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
		compoundParts = [],
	} = spec;

	const isEjected = options?.eject === true;

	if (slug === 'stacking-cards') {
		const files = getStackingCardsOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'spotlight-card') {
		const files = getSpotlightCardOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'border-beam') {
		const files = getBorderBeamOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'comparison-slider') {
		const files = getComparisonSliderOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'expandable-card') {
		const files = getExpandableCardOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'card-swipe-stack') {
		const files = getCardSwipeStackOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'auto-grid') {
		const files = getAutoGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'css-masonry') {
		const files = getCssMasonryOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'infinite-marquee') {
		const files = getInfiniteMarqueeOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'horizontal-scroller') {
		const files = getHorizontalScrollerOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'bento-grid') {
		const files = getBentoGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'diamond-grid') {
		const files = getDiamondGridOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'morphing-tabs') {
		const files = getMorphingTabsOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'floating-dock') {
		const files = getFloatingDockOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'accordion') {
		const files = getAccordionOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'number-ticker') {
		const files = getNumberTickerOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'magnetic-button') {
		const files = getMagneticButtonOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'cursor-tooltip') {
		const files = getCursorTooltipOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	if (slug === 'tilt-card') {
		const files = getTiltCardOuterFiles(flavor, props, isEjected);
		if (files) return files;
	}

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) {
				const isNext = flavor === 'nextjs';
				const partsCode =
					compoundParts.length > 0
						? `\n\n${compoundParts
								.map(
									(part) => `export const ${part.name} = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${part.primitiveExport || part.name}
      ref={ref}
      className={clsx('${part.defaultClass || ''}', className)}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${part.primitiveExport || part.name}>
  )
);
${part.name}.displayName = '${part.name}';`
								)
								.join('\n\n')}`
						: '';

				return [
					{
						filename: `${pascalName}.tsx`,
						language: 'tsx',
						description: `${name} — Clean Shadcn-style outer layer powered by @exhuma/core kinetic primitives.`,
						code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import * as ${pascalName}Primitive from '@exhuma/core';
import { clsx } from 'clsx';

export interface ${pascalName}Props extends React.ComponentPropsWithoutRef<typeof ${pascalName}Primitive.${pascalName}> {
  className?: string;
}

export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => (
    <${pascalName}Primitive.${pascalName}
      ref={ref}
      className={clsx(
        '${defaultTailwindClass}',
        className
      )}
      {...props}
    >
      {children}
    </${pascalName}Primitive.${pascalName}>
  )
);
${pascalName}.displayName = '${pascalName}';${partsCode}
`,
					},
				];
			}
			return getGenericOuterFiles(spec, flavor, props, options);
		}

		default:
			return getGenericOuterFiles(spec, flavor, props, options);
	}
}
