import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { HorizontalScrollerProps } from '../types';

/**
 * Calculates the total horizontal translation required to traverse all items.
 *
 * @param trackWidth Full scroll width of the horizontal item track.
 * @param containerWidth Visible viewport / wrapper width.
 * @param extraPadding Buffer margin in pixels (default: 60).
 */
export const calculateHorizontalDistance = (trackWidth: number, containerWidth: number, extraPadding = 60): number => {
	return Math.max(0, trackWidth - containerWidth + extraPadding);
};

/**
 * Calculates the required vertical section height to afford smooth kinetic translation.
 *
 * @param viewportHeight Height of the viewport or scroll container.
 * @param horizontalDistance Total horizontal travel distance in pixels.
 * @param speed Scroll translation speed multiplier (default: 1.0).
 */
export const calculateSectionHeight = (viewportHeight: number, horizontalDistance: number, speed = 1.0): number => {
	const safeSpeed = Math.max(0.1, speed);
	return Math.round(viewportHeight + horizontalDistance / safeSpeed);
};

/**
 * Normalizes vertical scroll depth into a clamped [0, 1] progression ratio.
 *
 * @param scrolledInto Distance scrolled past the section start.
 * @param totalScrollable Total scroll travel available.
 */
export const calculateScrollProgress = (scrolledInto: number, totalScrollable: number): number => {
	if (totalScrollable <= 0) return 0;
	return Math.min(Math.max(scrolledInto / totalScrollable, 0), 1);
};


/**
 * HorizontalScroller — Pinned Kinetic Translation Primitive (Brix Agency Style)
 *
 * Pins the viewport camera while seamlessly translating a multi-card track along the
 * horizontal axis in direct 1:1 synchronization with vertical page scroll.
 */
export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
	children,
	speed = 1.0,
	itemGap = 28,
	cardWidth = 320,
	showProgress = true,
	showFadeEdges = true,
	fadeWidth = 48,
	fadeEdgeColor = '#ffffff',
	fadeEdgeColorDark = '#09090b',
	mobileMode = 'scroll',
	header,
	scrollContainerRef,
	className = '',
	trackClassName = '',
	style,
}) => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const progressTextRef = useRef<HTMLSpanElement>(null);

	const [sectionHeight, setSectionHeight] = useState<number | undefined>(undefined);
	const [cameraHeight, setCameraHeight] = useState<number | undefined>(() => {
		if (typeof window !== 'undefined' && scrollContainerRef?.current) {
			return scrollContainerRef.current.clientHeight;
		}
		return undefined;
	});
	const [isReducedMotion, setIsReducedMotion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const isCustomContainer = Boolean(scrollContainerRef);

	const parsedCardWidth = useMemo(() => {
		if (typeof cardWidth === 'number') return `${cardWidth}px`;
		if (typeof cardWidth === 'string') {
			if (/^\d+$/.test(cardWidth.trim())) return `${cardWidth.trim()}px`;
			return cardWidth;
		}
		return '320px';
	}, [cardWidth]);

	const useColorOverlay = Boolean(showFadeEdges && (fadeEdgeColor || fadeEdgeColorDark));

	const maskStyle = useMemo<React.CSSProperties>(() => {
		if (!showFadeEdges || useColorOverlay) return {};
		const maskGradient = `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`;
		return {
			WebkitMaskImage: maskGradient,
			maskImage: maskGradient,
		};
	}, [showFadeEdges, fadeWidth, useColorOverlay]);

	useEffect(() => {
		const section = sectionRef.current;
		const camera = cameraRef.current;
		const track = trackRef.current;
		if (!section || !camera || !track || typeof window === 'undefined') return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		setIsReducedMotion(prefersReducedMotion);

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();

		if (prefersReducedMotion) {
			track.style.removeProperty('--scroll-offset-x');
			return;
		}

		let cachedHorizontalDistance = 0;
		let isIntersecting = false;
		let rafId: number | null = null;

		const scrollTarget: HTMLElement | Window = scrollContainerRef?.current ?? window;

		const recalculateDimensions = () => {
			const viewportHeight = scrollContainerRef?.current ? scrollContainerRef.current.clientHeight : window.innerHeight;
			setCameraHeight(viewportHeight);
			const containerWidth = camera.clientWidth;
			camera.style.setProperty('--camera-width', `${containerWidth}px`);
			const trackWidth = track.scrollWidth;

			const horizontalDistance = calculateHorizontalDistance(trackWidth, containerWidth, itemGap * 2);
			cachedHorizontalDistance = horizontalDistance;

			const computedSectionHeight = calculateSectionHeight(viewportHeight, horizontalDistance, speed);
			setSectionHeight(computedSectionHeight);
		};

		recalculateDimensions();

		const resizeObserver = new ResizeObserver(() => {
			recalculateDimensions();
			handleScroll();
		});

		resizeObserver.observe(camera);
		resizeObserver.observe(track);

		const handleScroll = () => {
			if (!isIntersecting && !scrollContainerRef?.current) return;

			const sectionRect = section.getBoundingClientRect();
			let containerTop = 0;
			let viewportHeight = window.innerHeight;

			if (scrollContainerRef?.current) {
				const cRect = scrollContainerRef.current.getBoundingClientRect();
				containerTop = cRect.top;
				viewportHeight = scrollContainerRef.current.clientHeight;
			}

			const relativeTop = sectionRect.top - containerTop;
			const totalScrollable = section.offsetHeight - viewportHeight;

			const scrolledInto = -relativeTop;
			const progress = calculateScrollProgress(scrolledInto, totalScrollable);
			const currentTranslate = -(progress * cachedHorizontalDistance);

			track.style.setProperty('--scroll-offset-x', `${Number(currentTranslate.toFixed(2))}px`);
			track.style.setProperty('--scroll-progress', `${Number(progress.toFixed(4))}`);

			if (progressBarRef.current) {
				progressBarRef.current.style.width = `${Number((progress * 100).toFixed(1))}%`;
			}
			if (progressTextRef.current) {
				progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
			}
		};

		const onScroll = () => {
			if (rafId === null) {
				rafId = window.requestAnimationFrame(() => {
					handleScroll();
					rafId = null;
				});
			}
		};

		let observer: IntersectionObserver | null = null;
		if (!scrollContainerRef?.current) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						isIntersecting = entry.isIntersecting;
						if (isIntersecting) {
							handleScroll();
						}
					});
				},
				{ rootMargin: '100px 0px 100px 0px', threshold: 0 }
			);
			observer.observe(section);
		} else {
			isIntersecting = true;
		}

		scrollTarget.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', recalculateDimensions, { passive: true });
		window.addEventListener('resize', checkMobile, { passive: true });

		// Initial render frame
		handleScroll();

		return () => {
			scrollTarget.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', recalculateDimensions);
			window.removeEventListener('resize', checkMobile);
			resizeObserver.disconnect();
			if (observer) observer.disconnect();
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId);
			}
		};
	}, [speed, itemGap, cardWidth, showProgress, showFadeEdges, fadeWidth, mobileMode, scrollContainerRef]);

	// Reduced Motion Fallback
	if (isReducedMotion) {
		return (
			<div className={`exhuma-horizontal-scroller-fallback w-full overflow-x-auto py-8 ${className}`} style={style}>
				{header && <div className='mb-6 px-6 sm:px-10'>{header}</div>}
				<div
					className={`flex px-6 sm:px-10 ${trackClassName}`}
					style={{
						gap: `${itemGap}px`,
						['--card-width' as string]: parsedCardWidth,
					}}
				>
					{React.Children.map(children, (child) => (
						<div className='exhuma-horizontal-card-item shrink-0' style={{ width: parsedCardWidth }}>
							{child}
						</div>
					))}
				</div>
			</div>
		);
	}

	// Native Mobile Swipe Mode (if mobileMode === 'scroll' and viewport < 768px without container ref)
	if (isMobile && mobileMode === 'scroll' && !scrollContainerRef) {
		return (
			<div className={`exhuma-horizontal-scroller-mobile w-full py-8 ${className}`} style={style}>
				{header && <div className='mb-6 px-6 sm:px-10'>{header}</div>}
				<div
					className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-6 sm:px-10 ${trackClassName}`}
					style={{
						gap: `${itemGap}px`,
						['--card-width' as string]: '85vw',
					}}
				>
					{React.Children.map(children, (child) => (
						<div className='shrink-0 snap-center' style={{ width: '85vw' }}>
							{child}
						</div>
					))}
				</div>
			</div>
		);
	}

	if (isMobile && mobileMode === 'stack' && !scrollContainerRef) {
		return (
			<div className={`exhuma-horizontal-scroller-stack flex w-full flex-col px-6 py-8 sm:px-10 ${className}`} style={{ gap: `${itemGap}px`, ...style }}>
				{header && <div className='mb-2'>{header}</div>}
				{React.Children.map(children, (child) => (
					<div className='w-full'>{child}</div>
				))}
			</div>
		);
	}

	return (
		<div
			ref={sectionRef}
			className={`exhuma-horizontal-scroller-section relative w-full ${className}`}
			style={{
				height: sectionHeight ? `${sectionHeight}px` : '200vh',
				...style,
			}}
		>
			<div
				ref={cameraRef}
				className='exhuma-horizontal-camera sticky top-0 flex w-full flex-col justify-center overflow-hidden'
				style={{
					height: isCustomContainer && cameraHeight ? `${cameraHeight}px` : '100vh',
				}}
			>
				{/* Pinned Section Header (Title, Subtitle, CTA) */}
				{header && <div className='exhuma-horizontal-header pointer-events-auto mb-6 w-full shrink-0 px-6 sm:px-10'>{header}</div>}

				{/* Horizontal Rail Mask Wrapper */}
				<div className='exhuma-horizontal-track-wrapper relative w-full overflow-hidden' style={maskStyle}>
					{useColorOverlay && (
						<>
							<style>{`
								.exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right {
									--exhuma-horizontal-fade: var(--fade-light, ${fadeEdgeColor || '#ffffff'});
								}
								:is(.dark, [data-theme='dark']) :is(.exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right),
								:is(.dark, [data-theme='dark']).exhuma-horizontal-fade-left,
								:is(.dark, [data-theme='dark']).exhuma-horizontal-fade-right {
									--exhuma-horizontal-fade: var(--fade-dark, ${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
								}
								@media (prefers-color-scheme: dark) {
									:root:not(.light) :is(.exhuma-horizontal-fade-left, .exhuma-horizontal-fade-right) {
										--exhuma-horizontal-fade: var(--fade-dark, ${fadeEdgeColorDark || fadeEdgeColor || '#09090b'});
									}
								}
							`}</style>
							<div
								aria-hidden='true'
								className='exhuma-horizontal-fade-left pointer-events-none absolute inset-y-0 left-0 z-10'
								style={{
									width: `${fadeWidth}px`,
									['--fade-light' as string]: fadeEdgeColor,
									['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
									background: 'linear-gradient(to right, var(--exhuma-horizontal-fade, var(--fade-light)), transparent)',
								}}
							/>
							<div
								aria-hidden='true'
								className='exhuma-horizontal-fade-right pointer-events-none absolute inset-y-0 right-0 z-10'
								style={{
									width: `${fadeWidth}px`,
									['--fade-light' as string]: fadeEdgeColor,
									['--fade-dark' as string]: fadeEdgeColorDark || fadeEdgeColor,
									background: 'linear-gradient(to left, var(--exhuma-horizontal-fade, var(--fade-light)), transparent)',
								}}
							/>
						</>
					)}
					<div
						ref={trackRef}
						className={`flex items-stretch px-6 will-change-transform select-none sm:px-10 ${trackClassName}`}
						style={{
							gap: `${itemGap}px`,
							transform: 'translate3d(var(--scroll-offset-x, 0px), 0px, 0px)',
							['--card-width' as string]: parsedCardWidth,
						}}
					>
						{React.Children.map(children, (child) => (
							<div
								className='exhuma-horizontal-card-item shrink-0'
								style={{
									width: parsedCardWidth,
									flexShrink: 0,
								}}
							>
								{child}
							</div>
						))}
					</div>
				</div>

				{/* Kinetic Telemetry Progress Bar */}
				{showProgress && (
					<div className='exhuma-horizontal-progress-bar mt-6 flex w-full items-center justify-between gap-4 px-6 sm:px-10'>
						<div className='bg-foreground/10 relative h-1.5 w-full overflow-hidden rounded-full'>
							<div ref={progressBarRef} className='bg-foreground h-full rounded-full transition-all duration-75' style={{ width: '0%' }} />
						</div>
						<span ref={progressTextRef} className='text-muted-foreground text-3xs shrink-0 font-mono tabular-nums'>
							0%
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default HorizontalScroller;
