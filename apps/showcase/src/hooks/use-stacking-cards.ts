'use client';

import { useMemo, useRef } from 'react';

export interface StackingCardConfig {
	stickyTop: number;
	indexOffset: number;
	topIncrement: number;
	zIndex: number;
	targetScale: number;
	range: [number, number];
	isLast: boolean;
}

export interface UseStackingCardsOptions {
	topStart?: number;
	topIncrement?: number;
	defaultMinScale?: number;
	enabled?: boolean;
}

const DEFAULT_TOP_START = 120;
const DEFAULT_TOP_INCREMENT = 24;
const DEFAULT_MIN_SCALE = 0.9;
const DEFAULT_ENABLED = true;

export function useStackingCards(count: number, options: UseStackingCardsOptions = {}) {
	const { topStart = DEFAULT_TOP_START, topIncrement = DEFAULT_TOP_INCREMENT, defaultMinScale = DEFAULT_MIN_SCALE, enabled = DEFAULT_ENABLED } = options;

	const containerRef = useRef<HTMLDivElement>(null);

	const cardConfigs = useMemo<StackingCardConfig[]>(() => {
		const scaleValues = generateScaleValues(count, defaultMinScale);
		const step = count > 0 ? 1 / count : 0;

		return Array.from({ length: count }, (_, i) => ({
			stickyTop: topStart,
			indexOffset: i * topIncrement,
			topIncrement,
			zIndex: i + 1,
			targetScale: scaleValues[i] ?? 1,
			range: [i * step, 1] as [number, number],
			isLast: i === count - 1,
		}));
	}, [count, topStart, topIncrement, defaultMinScale]);

	return {
		containerRef,
		cardConfigs,
		enabled,
	};
}

function generateScaleValues(count: number, minScale: number): number[] {
	if (count === 0) return [];
	if (count === 1) return [1.0];

	const values: number[] = [];
	for (let i = 0; i < count; i++) {
		const progress = i / (count - 1);
		const scale = minScale + progress * (1.0 - minScale);
		values.push(Number(scale.toPrecision(6)));
	}
	return values;
}
