'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ALL_COMPONENTS, COMPONENT_REGISTRY, EcosystemFlavor, ECOSYSTEM_LABELS, CATEGORIES, UniversalComponent, PropDescriptor, ComponentFilePayload } from '@/registry';
import { ECOSYSTEM_COUNT, COMPONENT_COUNT } from '@/components/docs/docs-stats';
import { CodeBlock } from './CodeBlock';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	IconAdjustments as Sliders,
	IconSparkles as Sparkles,
	IconRefresh as RefreshCw,
	IconStack2 as Layers,
	IconCopy as Copy,
	IconCheck as Check,
	IconDeviceLaptop as Laptop,
	IconDeviceTablet as Tablet,
	IconDeviceMobile as Smartphone,
	IconDeviceDesktop as Monitor,
	IconZoomIn as ZoomIn,
	IconZoomOut as ZoomOut,
	IconDownload as Download,
	IconSearch as Search,
	IconChevronRight as ChevronRight,
	IconLayoutGrid as Grid,
	IconMaximize as Maximize2,
	IconTerminal2 as Terminal,
	IconLayoutDashboard,
	IconChartBar,
	IconFolders,
	IconDatabase,
	IconUsers,
	IconSettings,
	IconHome,
	IconBook,
	IconCreditCard,
	IconMail,
	IconBrandGithub,
	IconBrandX,
	IconBrandDiscord,
	IconBrandLinkedin,
	IconBrandYoutube,
	IconShare,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { StackingCards, HorizontalScroller, TiltCard, SpotlightCard, BorderBeam, CardSwipeStack, ComparisonSlider, ExpandableCard } from '@exhuma/cards';
import { CssMasonry, CssMasonryItem, AutoGrid, AutoGridItem, InfiniteMarquee, BentoGrid, BentoCard, BentoHeader, BentoContent, BentoVisual, DiamondGrid } from '@exhuma/layouts';
import { MorphingTabs, Accordion, FloatingDock, NumberTicker, MagneticButton, CursorTooltip } from '@exhuma/core';

const COLOR_PRESETS = [
	{ label: 'Indigo', value: '#6366f1' },
	{ label: 'Violet', value: '#8b5cf6' },
	{ label: 'Cyan', value: '#06b6d4' },
	{ label: 'Emerald', value: '#10b981' },
	{ label: 'Rose', value: '#f43f5e' },
	{ label: 'Amber', value: '#f59e0b' },
	{ label: 'White', value: '#ffffff' },
];

function toHexColor(color: unknown, fallback = '#ffffff'): string {
	if (typeof color !== 'string') return fallback;
	const str = color.trim().toLowerCase();
	if (/^#[0-9a-f]{6}$/.test(str)) return str;
	if (/^#[0-9a-f]{8}$/.test(str)) return str.slice(0, 7);
	if (/^#[0-9a-f]{3}$/.test(str)) {
		return `#${str[1]}${str[1]}${str[2]}${str[2]}${str[3]}${str[3]}`;
	}
	const rgbMatch = str.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
	if (rgbMatch) {
		const r = Math.min(255, parseInt(rgbMatch[1], 10)).toString(16).padStart(2, '0');
		const g = Math.min(255, parseInt(rgbMatch[2], 10)).toString(16).padStart(2, '0');
		const b = Math.min(255, parseInt(rgbMatch[3], 10)).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}
	return fallback;
}

// Presets per component
const COMPONENT_PRESETS: Record<string, Record<string, Record<string, unknown>>> = {
	'stacking-cards': {
		Default: { topStart: 20, topIncrement: 28, cardGap: 20, scaleThreshold: 150, minScale: 0.9, reverseScale: true },
		'Subtle Elegance': { topStart: 20, topIncrement: 16, cardGap: 24, scaleThreshold: 180, minScale: 0.94, reverseScale: true },
		'Cinematic 3D': { topStart: 24, topIncrement: 36, cardGap: 28, scaleThreshold: 120, minScale: 0.85, reverseScale: true },
		'Compact Deck': { topStart: 16, topIncrement: 14, cardGap: 12, scaleThreshold: 100, minScale: 0.92, reverseScale: false },
		'Dramatic Cascade': { topStart: 28, topIncrement: 40, cardGap: 28, scaleThreshold: 110, minScale: 0.82, reverseScale: true },
	},
	'horizontal-scroller': {
		Default: { itemGap: 28, speed: 1.0, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 48, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b', mobileMode: 'scroll' },
		'Compact Gap': { itemGap: 16, speed: 1.0, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 48, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b', mobileMode: 'scroll' },
		'Spacious Gap': { itemGap: 44, speed: 1.0, cardWidth: 340, showProgress: true, showFadeEdges: true, fadeWidth: 64, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b', mobileMode: 'scroll' },
		'High Velocity': { itemGap: 32, speed: 1.8, cardWidth: 320, showProgress: true, showFadeEdges: true, fadeWidth: 64, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b', mobileMode: 'scroll' },
	},
	'tilt-card': {
		Default: { maxTilt: 15, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'all' },
		'Subtle Float': { maxTilt: 8, perspective: 1200, scale: 1.01, speed: 0.08, reverse: false, disabled: false, axis: 'all' },
		'Aggressive 3D': { maxTilt: 30, perspective: 800, scale: 1.06, speed: 0.18, reverse: false, disabled: false, axis: 'all' },
		'Magnetic Lift (Reverse)': { maxTilt: 20, perspective: 900, scale: 1.04, speed: 0.15, reverse: true, disabled: false, axis: 'all' },
		'Pitch Only (X-Axis)': { maxTilt: 20, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'x' },
		'Yaw Only (Y-Axis)': { maxTilt: 20, perspective: 1000, scale: 1.02, speed: 0.12, reverse: false, disabled: false, axis: 'y' },
	},
	'css-masonry': {
		Default: { columns: 1, columnsSm: 2, columnsMd: 2, columnsLg: 3, columnsXl: 4, gap: 16, columnFill: 'balance', height: 0 },
		'Dense Gallery': { columns: 2, columnsSm: 3, columnsMd: 3, columnsLg: 4, columnsXl: 5, gap: 12, columnFill: 'balance', height: 0 },
		'Spacious Editorial': { columns: 1, columnsSm: 2, columnsMd: 2, columnsLg: 2, columnsXl: 3, gap: 24, columnFill: 'balance', height: 0 },
	},
	'auto-grid': {
		Default: { minItemWidth: 280, gap: 24, mode: 'auto-fit', maxColumns: 4, alignItems: 'stretch' },
		'Compact Catalog': { minItemWidth: 180, gap: 16, mode: 'auto-fill', maxColumns: 6, alignItems: 'stretch' },
		'Hero Showcase': { minItemWidth: 360, gap: 28, mode: 'auto-fit', maxColumns: 3, alignItems: 'stretch' },
	},
	'spotlight-card': {
		Default: { radius: 350, opacity: 0.85, color: '#6366f1', borderColor: '#818cf8', spread: 60, mode: 'both', smoothing: 0.2, disabled: false },
		Subtle: { radius: 250, opacity: 0.4, color: '#94a3b8', borderColor: '#cbd5e1', spread: 70, mode: 'both', smoothing: 0.15, disabled: false },
		Broad: { radius: 500, opacity: 0.95, color: '#10b981', borderColor: '#34d399', spread: 90, mode: 'both', smoothing: 0.25, disabled: false },
		BorderOnly: { radius: 300, opacity: 0.85, color: '#6366f1', borderColor: '#a855f7', spread: 80, mode: 'border', smoothing: 0.2, disabled: false },
		'Background Sheen': { radius: 420, opacity: 0.9, color: '#ec4899', borderColor: '#f43f5e', spread: 75, mode: 'background', smoothing: 0.18, disabled: false },
	},
	'morphing-tabs': {
		Default: { springStiffness: 26, variant: 'pill', size: 'md' },
		'Snappy Kinetic': { springStiffness: 42, variant: 'pill', size: 'md' },
		'Gentle Fluid': { springStiffness: 14, variant: 'pill', size: 'lg' },
		'Minimal Underline': { springStiffness: 30, variant: 'underline', size: 'md' },
		'Neon Glow': { springStiffness: 32, variant: 'glow', size: 'md' },
	},
	accordion: {
		Default: { mode: 'single', duration: 300 },
		Multiple: { mode: 'multiple', duration: 300 },
		Fast: { mode: 'single', duration: 200 },
	},
	'infinite-marquee': {
		Default: { speed: 40, direction: 'left', pauseOnHover: true, gap: 24, showFadeEdges: true, fadeWidth: 48, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b' },
		'High Velocity (Reverse)': { speed: 80, direction: 'right', pauseOnHover: true, gap: 16, showFadeEdges: true, fadeWidth: 64, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b' },
		'Gentle Float': { speed: 20, direction: 'left', pauseOnHover: false, gap: 32, showFadeEdges: false, fadeWidth: 48, fadeEdgeColor: '#ffffff', fadeEdgeColorDark: '#09090b' },
	},
	'bento-grid': {
		Default: { cols: 3, gap: 20, rowHeight: 180 },
		Dense: { cols: 4, gap: 16, rowHeight: 160 },
		Spacious: { cols: 2, gap: 24, rowHeight: 200 },
	},
	'diamond-grid': {
		Default: { mode: 'rhombic', gap: 16, layout: 'auto', responsive: false },
		Isometric: { mode: 'isometric', gap: 20, layout: 'large', responsive: false },
		Dense: { mode: 'rhombic', gap: 8, layout: 'large', responsive: false },
		Spacious: { mode: 'rhombic', gap: 24, layout: 'large', responsive: false },
		Compact: { mode: 'rhombic', gap: 12, layout: 'medium', responsive: false },
	},
	'border-beam': {
		Default: { size: 200, duration: 8, borderWidth: 2, colorFrom: '#ffaa40', colorTo: '#9c40ff', doubleBeam: false, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
		'Dual Orbital': { size: 200, duration: 8, borderWidth: 2, colorFrom: '#06b6d4', colorTo: '#3b82f6', doubleBeam: true, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
		Hyperdrive: { size: 180, duration: 4, borderWidth: 2.5, colorFrom: '#ec4899', colorTo: '#8b5cf6', doubleBeam: true, endOpacity: 0.05, opacity: 1, blur: 1, borderRadius: 16 },
		'Subtle Glow': { size: 180, duration: 12, borderWidth: 1.5, colorFrom: '#6366f1', colorTo: '#a855f7', doubleBeam: false, endOpacity: 0, opacity: 0.85, blur: 0, borderRadius: 16 },
		'Neon Emerald': { size: 200, duration: 6, borderWidth: 2, colorFrom: '#10b981', colorTo: '#06b6d4', doubleBeam: false, endOpacity: 0, opacity: 1, blur: 0, borderRadius: 16 },
	},
	'floating-dock': {
		Default: { direction: 'bottom', baseSize: 36, maxMagnification: 0.75, influenceRadius: 60, showLabels: true, panelStyle: 'translucent' },
		'Social Share': { direction: 'bottom', baseSize: 42, maxMagnification: 0.6, influenceRadius: 80, showLabels: true, panelStyle: 'glass' },
		'Compact Mobile': { direction: 'bottom', baseSize: 38, maxMagnification: 0.5, influenceRadius: 65, showLabels: true, panelStyle: 'glass' },
		'Vertical Rail': { direction: 'right', baseSize: 40, maxMagnification: 0.7, influenceRadius: 75, showLabels: true, panelStyle: 'minimal' },
		'Minimal Floating': { direction: 'bottom', baseSize: 44, maxMagnification: 0.85, influenceRadius: 90, showLabels: true, panelStyle: 'minimal' },
	},
	'number-ticker': {
		Default: { value: 1000, decimalPlaces: 0 },
		Precision: { value: 98.65, decimalPlaces: 2 },
		Large: { value: 1000000, decimalPlaces: 0 },
	},
	'magnetic-button': {
		Default: { strength: 0.35, radius: 120, springDamping: 18 },
		Strong: { strength: 0.6, radius: 160, springDamping: 22 },
		Subtle: { strength: 0.2, radius: 80, springDamping: 14 },
	},
	'card-swipe-stack': {
		Default: { thresholdDistance: 120, maxRotation: 20, scaleStep: 0.05, offsetStep: 14, preventLastCardDismiss: true },
		Snappy: { thresholdDistance: 80, maxRotation: 28, scaleStep: 0.06, offsetStep: 16, preventLastCardDismiss: true },
		'Fluid Spring': { thresholdDistance: 150, maxRotation: 24, scaleStep: 0.04, offsetStep: 12, preventLastCardDismiss: true },
		Minimalist: { thresholdDistance: 100, maxRotation: 12, scaleStep: 0.03, offsetStep: 8, preventLastCardDismiss: true },
		'Free Swipe': { thresholdDistance: 120, maxRotation: 20, scaleStep: 0.05, offsetStep: 14, preventLastCardDismiss: false },
	},
	'comparison-slider': {
		Default: { defaultPosition: 0.5, step: 0.05, orientation: 'horizontal' },
		'Split 25/75': { defaultPosition: 0.25, step: 0.05, orientation: 'horizontal' },
		'Split 75/25': { defaultPosition: 0.75, step: 0.05, orientation: 'horizontal' },
		'Micro Precision': { defaultPosition: 0.5, step: 0.01, orientation: 'horizontal' },
		'Vertical Split': { defaultPosition: 0.5, step: 0.05, orientation: 'vertical' },
	},
	'expandable-card': {
		Default: { duration: 360 },
		Snappy: { duration: 220 },
		Cinematic: { duration: 520 },
		'Ultra Fast': { duration: 160 },
		Smooth: { duration: 420 },
	},
	'cursor-tooltip': {
		Default: { springDamping: 22 },
		Elastic: { springDamping: 14 },
		Instant: { springDamping: 35 },
	},
};

const FLAVORS = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

export function StudioWorkbench({ initialSlug = 'stacking-cards' }: { initialSlug?: string }) {
	const searchParams = useSearchParams();
	const querySlug = searchParams.get('slug') || searchParams.get('component') || initialSlug;
	const [selectedSlug, setSelectedSlug] = useState(querySlug);
	const component = COMPONENT_REGISTRY[selectedSlug] || ALL_COMPONENTS[0];

	// Component search query in left catalog
	const [catalogSearch, setCatalogSearch] = useState('');

	// Dynamic prop state
	const [propValues, setPropValues] = useState<Record<string, unknown>>(() => ({
		...component.defaultProps,
	}));

	const [selectedFlavor, setSelectedFlavor] = useState<EcosystemFlavor>('react');
	const [selectedFileIdx, setSelectedFileIdx] = useState(0);
	const [viewportMode, setViewportMode] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
	const [zoomScale, setZoomScale] = useState<number>(100);
	const [copiedCli, setCopiedCli] = useState(false);
	const [canvasGrid, setCanvasGrid] = useState<'dots' | 'dense' | 'clean'>('dots');
	const [cardSwipeResetKey, setCardSwipeResetKey] = useState(0);
	const [dockIconSet, setDockIconSet] = useState<'app' | 'social'>('app');

	const studioStackingRef = React.useRef<HTMLDivElement>(null);
	const studioHorizontalRef = React.useRef<HTMLDivElement>(null);

	// Presets
	const presets = COMPONENT_PRESETS[selectedSlug] || {};
	const getInitialPreset = (slug: string) => {
		const keys = Object.keys(COMPONENT_PRESETS[slug] || {});
		return keys.includes('Default') ? 'Default' : keys[0] || 'Default';
	};
	const [activePreset, setActivePreset] = useState<string>(() => getInitialPreset(selectedSlug));

	// Synchronize with query parameter when navigating from docs / showcase
	useEffect(() => {
		if (querySlug && COMPONENT_REGISTRY[querySlug] && querySlug !== selectedSlug) {
			setSelectedSlug(querySlug);
			const newComp = COMPONENT_REGISTRY[querySlug];
			if (newComp) {
				setPropValues({ ...newComp.defaultProps });
				setActivePreset(getInitialPreset(querySlug));
				setDockIconSet('app');
			}
		}
	}, [querySlug, selectedSlug]);

	const handleSelectComponent = (slug: string) => {
		setSelectedSlug(slug);
		const newComp = COMPONENT_REGISTRY[slug];
		if (newComp) {
			setPropValues({ ...newComp.defaultProps });
			setActivePreset(getInitialPreset(slug));
			setDockIconSet('app');
		}
	};

	const applyPreset = (presetName: string) => {
		setActivePreset(presetName);
		if (presetName === 'Social Share' || presetName === 'Vertical Rail') {
			setDockIconSet('social');
		} else {
			setDockIconSet('app');
		}
		const presetValues = presets[presetName];
		if (presetValues) {
			setPropValues({ ...component.defaultProps, ...presetValues });
		}
	};

	const handlePropChange = (name: string, value: unknown) => {
		setPropValues((prev) => ({ ...prev, [name]: value }));
		setActivePreset('Custom');
	};

	const resetProps = () => {
		setPropValues({ ...component.defaultProps });
		setActivePreset(getInitialPreset(selectedSlug));
		setDockIconSet('app');
	};

	// Generate code
	const generatedFiles = useMemo(() => {
		return component.generateCode(selectedFlavor, propValues);
	}, [component, selectedFlavor, propValues]);

	const activeFile = generatedFiles[selectedFileIdx] || generatedFiles[0] || { filename: 'component.tsx', code: '' };

	const cliCommand = `npx exhuma add ${selectedSlug} --flavor=${selectedFlavor}`;

	const copyCli = () => {
		navigator.clipboard.writeText(cliCommand);
		setCopiedCli(true);
		setTimeout(() => setCopiedCli(false), 2000);
	};

	const downloadFile = () => {
		const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = activeFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	// Filtered components for sidebar
	const filteredComponents = useMemo(() => {
		if (!catalogSearch.trim()) return ALL_COMPONENTS;
		return ALL_COMPONENTS.filter((c) => c.name.toLowerCase().includes(catalogSearch.toLowerCase()) || c.category.toLowerCase().includes(catalogSearch.toLowerCase()));
	}, [catalogSearch]);

	// Viewport widths (23.4375rem/48rem/64rem = 375px/768px/1024px device breakpoints)
	const viewportWidth = viewportMode === 'mobile' ? 'max-w-[23.4375rem]' : viewportMode === 'tablet' ? 'max-w-[48rem]' : viewportMode === 'laptop' ? 'max-w-[64rem]' : 'w-full';

	// Render interactive canvas preview according to selected component
	const renderCanvasPreview = () => {
		if (selectedSlug === 'stacking-cards') {
			const rawTopStart = Number(propValues.topStart ?? 20);
			const rawTopIncrement = Number(propValues.topIncrement ?? propValues.stackOffset ?? 28);
			const rawCardGap = Number(propValues.cardGap ?? propValues.gap ?? 20);
			const rawScaleThreshold = Number(propValues.scaleThreshold ?? 150);
			const rawMinScale = Number(propValues.minScale ?? 0.9);
			const reverseScale = propValues.reverseScale !== undefined ? Boolean(propValues.reverseScale) : true;
			const rawCount = Number(propValues.cardCount ?? 4);

			const topStart = Number.isFinite(rawTopStart) && rawTopStart >= 0 ? rawTopStart : 20;
			const topIncrement = Number.isFinite(rawTopIncrement) && rawTopIncrement > 0 ? rawTopIncrement : 28;
			const cardGap = Number.isFinite(rawCardGap) && rawCardGap >= 0 ? rawCardGap : 20;
			const scaleThreshold = Number.isFinite(rawScaleThreshold) && rawScaleThreshold > 0 ? rawScaleThreshold : 150;
			const minScale = Number.isFinite(rawMinScale) && rawMinScale > 0 && rawMinScale < 1 ? rawMinScale : 0.9;
			const count = Number.isFinite(rawCount) && rawCount >= 1 ? Math.min(8, Math.round(rawCount)) : 4;

			return (
				<div ref={studioStackingRef} className='border-border bg-background/50 no-scrollbar relative mx-auto h-[31.25rem] w-full max-w-xl overflow-y-auto rounded-2xl border p-6 shadow-inner'>
					<div className='text-muted-foreground text-2xs mb-6 flex items-center justify-center gap-2 text-center font-mono'>
						<span className='kbd text-3xs'>SCROLL DOWN TO TEST DYNAMIC SCALE</span>
						<span>↓</span>
					</div>
					<StackingCards topStart={topStart} topIncrement={topIncrement} cardGap={cardGap} minScale={minScale} scaleThreshold={scaleThreshold} reverseScale={reverseScale} scrollContainerRef={studioStackingRef}>
						{Array.from({ length: count }).map((_, idx) => (
							<div key={idx} className='border-border bg-card/95 rounded-2xl border p-6 shadow-lg backdrop-blur-md'>
								<div className='text-muted-foreground mb-3 flex items-center justify-between font-mono text-xs'>
									<span className='kbd text-primary text-3xs font-bold uppercase'>STACK LAYER 0{idx + 1}</span>
									<span className='text-2xs font-semibold text-emerald-500'>Dynamic Physics</span>
								</div>
								<h4 className='text-foreground text-xl font-bold tracking-tight'>Autonomous Stacking Card</h4>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>Card stacks with dynamic mathematical scale decay. Zero layout thrashing or parent scroll locking.</p>
								<div className='border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
									<span>Offset: {topIncrement}px</span>
									<span>Layer: #{idx + 1}</span>
								</div>
							</div>
						))}
					</StackingCards>
					<div className='text-muted-foreground flex h-[17.5rem] items-center justify-center font-mono text-xs'>Terminal scroll reached — reverse scaling applied</div>
				</div>
			);
		}

		if (selectedSlug === 'horizontal-scroller') {
			const speed = Number(propValues.speed ?? 1.0);
			const itemGap = Number(propValues.itemGap ?? 28);
			const cardWidth = propValues.cardWidth !== undefined ? Number(propValues.cardWidth) : 320;
			const showProgress = propValues.showProgress !== false;
			const showFadeEdges = propValues.showFadeEdges !== false;
			const fadeWidth = Number(propValues.fadeWidth ?? 48);
			const fadeEdgeColor = String(propValues.fadeEdgeColor || '#ffffff');
			const fadeEdgeColorDark = String(propValues.fadeEdgeColorDark || '#09090b');
			const mobileMode = (propValues.mobileMode as 'scroll' | 'stack' | 'pinned') ?? 'scroll';

			const SERVICES = [
				{ num: '01', category: 'DESIGN', title: 'Web Design & UI', desc: 'High-conversion visual interfaces engineered to command attention.', cta: 'Explore', tag: 'STAGE // 01' },
				{ num: '02', category: 'DEV', title: 'Kinetic Engineering', desc: '120 FPS transitions, zero layout thrashing, and sub-pixel compositing.', cta: 'Explore', tag: 'STAGE // 02' },
				{ num: '03', category: 'BRAND', title: 'Brand Strategy', desc: 'Distinct typography and positioning frameworks that scale.', cta: 'Explore', tag: 'STAGE // 03' },
				{ num: '04', category: 'SCALE', title: 'Conversion Scale', desc: 'Data-driven landing pages and behavioral experimentation.', cta: 'Explore', tag: 'STAGE // 04' },
				{ num: '05', category: 'AI', title: 'AI Workflows', desc: 'Intelligent automation pipelines built for high leverage.', cta: 'Explore', tag: 'STAGE // 05' },
			];

			return (
				<div ref={studioHorizontalRef} className='border-border bg-background/50 no-scrollbar relative h-[36rem] w-full overflow-y-auto rounded-2xl border shadow-inner'>
					<div className='text-muted-foreground text-2xs pointer-events-none absolute top-3 right-4 z-30 flex items-center gap-2 font-mono'>
						<span className='kbd border-border/80 bg-card/90 text-foreground text-3xs font-mono font-bold shadow-xs'>VERTICAL SCROLL → HORIZONTAL RAIL</span>
						<span>↓</span>
					</div>
					<HorizontalScroller
						speed={speed}
						itemGap={itemGap}
						cardWidth={cardWidth}
						showProgress={showProgress}
						showFadeEdges={showFadeEdges}
						fadeWidth={fadeWidth}
						fadeEdgeColor={fadeEdgeColor}
						fadeEdgeColorDark={fadeEdgeColorDark}
						mobileMode={mobileMode}
						scrollContainerRef={studioHorizontalRef}
						header={
							<div className='border-border/40 mb-4 flex items-center justify-between border-b pb-3'>
								<div>
									<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Brix-Engineered Rail</span>
									<h3 className='text-foreground text-lg font-bold tracking-tight sm:text-xl'>Digital Solutions Suite</h3>
								</div>
								<span className='text-muted-foreground hidden font-mono text-xs sm:inline'>120 FPS Pinned Camera</span>
							</div>
						}
					>
						{SERVICES.map((s, idx) => (
							<div
								key={idx}
								className='group border-border/80 bg-card/95 hover:border-foreground/40 flex h-[210px] flex-col justify-between overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300'
							>
								<div>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<span className='font-mono text-xs font-bold text-emerald-500'>{s.num}</span>
											<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>{s.category}</span>
										</div>
										<span className='text-3xs border-border bg-background/60 text-muted-foreground rounded-full border px-2 py-0.5 font-mono'>{s.tag}</span>
									</div>
									<h4 className='text-foreground mt-3 text-base font-bold tracking-tight'>{s.title}</h4>
									<p className='text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed'>{s.desc}</p>
								</div>
								<div className='border-border/40 flex items-center justify-between border-t pt-3'>
									<span className='text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors group-hover:text-emerald-400'>
										{s.cta}
										<span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
									</span>
									<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
								</div>
							</div>
						))}
					</HorizontalScroller>

					{/* Subsequent Section (Unpinned Normal Flow) */}
					<div className='border-border/60 bg-muted/20 border-t px-6 py-12 sm:px-10'>
						<div className='max-w-xl'>
							<div className='flex items-center gap-2'>
								<span className='size-2 rounded-full bg-emerald-500' />
								<span className='text-3xs font-mono font-bold tracking-widest text-emerald-500 uppercase'>Traversal Complete &bull; Normal Scroll Resumed</span>
							</div>
							<h4 className='text-foreground mt-2 text-xl font-bold tracking-tight sm:text-2xl'>Next Milestone: Product Delivery &amp; Scale</h4>
							<p className='text-muted-foreground mt-2 text-xs leading-relaxed sm:text-sm'>
								Once horizontal card translation reaches 100%, the pinned camera seamlessly releases and natural vertical scrolling resumes.
							</p>
						</div>

						<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Performance</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>120 FPS</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Zero layout thrashing</p>
							</div>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Compositor</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>GPU Rail</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Hardware acceleration</p>
							</div>
							<div className='border-border/70 bg-card/80 rounded-xl border p-4'>
								<span className='text-3xs text-muted-foreground font-mono uppercase'>Exit Behavior</span>
								<div className='text-foreground mt-1 font-mono text-lg font-bold'>Seamless</div>
								<p className='text-muted-foreground text-2xs mt-0.5'>Natural scroll unpin</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'tilt-card') {
			const maxTilt = Number(propValues.maxTilt ?? 15);
			const perspective = Number(propValues.perspective ?? 1000);
			const scale = Number(propValues.scale ?? 1.02);
			const speed = Number(propValues.speed ?? 0.12);
			const reverse = Boolean(propValues.reverse ?? false);
			const disabled = Boolean(propValues.disabled ?? false);
			const axis = (propValues.axis as 'all' | 'x' | 'y') ?? 'all';

			return (
				<div className='flex items-center justify-center p-8'>
					<TiltCard
						maxTilt={maxTilt}
						perspective={perspective}
						scale={scale}
						speed={speed}
						reverse={reverse}
						disabled={disabled}
						axis={axis}
						className='bg-card border-border w-full max-w-md cursor-pointer border p-8 shadow-2xl'
					>
						<div className='mb-4 flex items-center justify-between'>
							<span className='kbd text-primary text-3xs font-bold'>3D PERSPECTIVE</span>
							<span className='text-muted-foreground font-mono text-xs'>Max Tilt: {maxTilt}°</span>
						</div>
						<h4 className='text-foreground text-2xl font-black tracking-tight'>Tactile 3D Tilt Card</h4>
						<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
							Perspective: {perspective}px | Scale: {scale}x | Axis: {axis}
						</p>
						<div className='border-border text-muted-foreground mt-6 flex items-center justify-between border-t pt-4 font-mono text-xs'>
							<span>Physics: Spring Math ({speed})</span>
							<span className='font-semibold text-emerald-500'>120 FPS Native</span>
						</div>
					</TiltCard>
				</div>
			);
		}

		if (selectedSlug === 'css-masonry') {
			const columns = Number(propValues.columns ?? 3);
			const columnsSm = Number(propValues.columnsSm ?? 1);
			const columnsMd = Number(propValues.columnsMd ?? 2);
			const columnsLg = Number(propValues.columnsLg ?? 3);
			const columnsXl = Number(propValues.columnsXl ?? 4);
			const gap = Number(propValues.gap ?? 16);
			const columnFill = (propValues.columnFill as 'balance' | 'auto') ?? 'balance';
			const height = Number(propValues.height ?? 0);

			// Studio canvas alternative view:
			// mobile (375x667) -> 'columns' (default 1)
			// tablet (640x800) -> 'columnsSm' (default 2)
			// fluid            -> 'columnsLg' (default 3)
			const studioColumns = viewportMode === 'mobile' ? Number(propValues.columns ?? 1) : viewportMode === 'tablet' ? Number(propValues.columnsSm ?? 2) : Number(propValues.columnsLg ?? 3);

			const studioHeight = columnFill === 'auto' ? (viewportMode === 'mobile' ? undefined : height || 620) : undefined;

			return (
				<div key={`${viewportMode}-${studioColumns}`} className='w-full p-2 sm:p-6'>
					<CssMasonry
						columns={studioColumns}
						columnsSm={studioColumns}
						columnsMd={studioColumns}
						columnsLg={studioColumns}
						columnsXl={studioColumns}
						gap={gap}
						columnFill={columnFill}
						height={studioHeight}
						className='w-full'
						style={{ columnCount: studioColumns }}
					>
						{/* 01. Micro Status Card (130px) - Emerald */}
						<CssMasonryItem key='01' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md'
								style={{ minHeight: '130px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-emerald-500/10 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10 flex items-center justify-between'>
									<span className='text-3xs inline-flex items-center gap-1.5 font-mono font-semibold text-emerald-400'>
										<span className='relative flex size-2'>
											<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75' />
											<span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
										</span>
										120 FPS NATIVE
									</span>
									<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#01</span>
								</div>
								<div className='relative z-10 my-auto py-1.5'>
									<h4 className='text-foreground text-xs font-bold tracking-tight'>Zero Layout Shift</h4>
									<p className='text-muted-foreground text-3xs mt-0.5 font-mono'>Deterministic layout calculation</p>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>Compositor Thread</span>
									<span className='font-semibold text-emerald-400'>0.02ms</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 02. Deep Kinetic Feature Tile (210px) - Blue */}
						<CssMasonryItem key='02' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md'
								style={{ minHeight: '210px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-blue-500/15 via-indigo-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-3xs inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-blue-400 uppercase'>
											KINEMATICS
										</span>
										<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#02</span>
									</div>
									<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Hermite Spline Acceleration</h4>
									<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Nonlinear velocity curves preserving fluid frame timing during continuous inertial scrolling.</p>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>Hermite Cubic</span>
									<span className='font-semibold text-blue-400'>3t² - 2t³</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 03. Elegant Pull Quote Tile (145px) - Purple */}
						<CssMasonryItem key='03' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md'
								style={{ minHeight: '145px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-purple-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<span className='font-serif text-xl leading-none text-purple-400/90'>“</span>
									<p className='text-foreground/90 text-2xs mt-1 leading-relaxed italic'>CSS multi-column executes directly on the compositor thread with zero JavaScript runtime overhead.</p>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span className='font-semibold text-purple-400'>Architecture Core</span>
									<span>#03</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 04. Telemetry Metric Block (255px) - Amber */}
						<CssMasonryItem key='04' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md'
								style={{ minHeight: '255px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-amber-500/15 via-orange-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-3xs inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-amber-400 uppercase'>
											PHYSICS
										</span>
										<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#04</span>
									</div>
									<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Runge-Kutta 4th Order</h4>
									<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Micro-interaction spring simulation with RK4 numerical integration.</p>
									<div className='text-3xs mt-2.5 grid grid-cols-2 gap-2 font-mono'>
										<div className='border-border/60 bg-background/60 rounded-md border p-2'>
											<span className='text-muted-foreground text-3xs block'>Stiffness</span>
											<span className='text-foreground font-semibold'>170 k</span>
										</div>
										<div className='border-border/60 bg-background/60 rounded-md border p-2'>
											<span className='text-muted-foreground text-3xs block'>Damping</span>
											<span className='text-foreground font-semibold'>26 c</span>
										</div>
									</div>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>RK4 Solver</span>
									<span className='font-semibold text-amber-400'>0.016ms Step</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 05. Framework Chips Tile (145px) - Pink */}
						<CssMasonryItem key='05' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:shadow-md'
								style={{ minHeight: '145px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-pink-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-muted-foreground text-3xs font-mono font-bold uppercase'>Universal Native</span>
										<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#05</span>
									</div>
									<div className='flex flex-wrap gap-1.5'>
										{['React', 'Vue', 'Svelte', 'Astro', 'Solid'].map((fw) => (
											<span key={fw} className='border-border/60 bg-background/80 text-foreground text-3xs rounded-md border px-2 py-0.5 font-mono font-medium'>
												{fw}
											</span>
										))}
									</div>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span className='font-semibold text-pink-400'>{ECOSYSTEM_COUNT} Ecosystems</span>
									<span className='truncate'>Universal Native</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 06. Syntax Code Window (180px) - Cyan */}
						<CssMasonryItem key='06' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-md'
								style={{ minHeight: '180px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-cyan-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<div className='mb-2 flex items-center justify-between'>
										<div className='flex items-center gap-1.5'>
											<span className='size-2 rounded-full bg-red-500/80' />
											<span className='size-2 rounded-full bg-yellow-500/80' />
											<span className='size-2 rounded-full bg-green-500/80' />
											<span className='text-muted-foreground text-3xs ml-1 font-mono'>masonry.css</span>
										</div>
										<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#06</span>
									</div>
									<pre className='border-border/50 bg-background/80 text-muted-foreground text-3xs no-scrollbar overflow-x-auto rounded-lg border p-2 font-mono leading-relaxed'>
										<code>{`column-count: ${columns};\nbreak-inside: avoid;\ncolumn-fill: ${columnFill};`}</code>
									</pre>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>CSS Multi-Column</span>
									<span className='font-semibold text-cyan-400'>Zero Script</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 07. Big Stat Metric Tile (130px) - Indigo */}
						<CssMasonryItem key='07' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md'
								style={{ minHeight: '130px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-indigo-500/15 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10 flex items-center justify-between'>
									<span className='text-muted-foreground text-3xs font-mono font-semibold uppercase'>Compositor Latency</span>
									<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#07</span>
								</div>
								<div className='relative z-10 my-auto py-1'>
									<span className='text-foreground font-mono text-2xl font-black tracking-tight'>&lt; 0.04ms</span>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>GPU Isolated</span>
									<span className='font-semibold text-indigo-400'>Zero Jitter</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 08. Void Elimination Tile (220px) - Violet */}
						<CssMasonryItem key='08' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-md'
								style={{ minHeight: '220px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-violet-500/15 via-purple-500/5 to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-3xs inline-flex items-center rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 font-mono font-semibold tracking-wider text-violet-400 uppercase'>
											RENDER PASS
										</span>
										<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#08</span>
									</div>
									<h4 className='text-foreground group-hover:text-primary text-xs font-bold tracking-tight transition-colors'>Spatial Void Elimination</h4>
									<p className='text-muted-foreground text-2xs mt-1.5 leading-relaxed'>Staggered elements interlock fluidly to eliminate vertical blank gaps across varying column heights.</p>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-3 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>Sub-Pixel Grid</span>
									<span className='font-semibold text-violet-400'>Auto Balanced</span>
								</div>
							</div>
						</CssMasonryItem>

						{/* 09. Micro WCAG A11y Ping (135px) - Emerald */}
						<CssMasonryItem key='09' className='group'>
							<div
								className='border-border/80 bg-card/90 relative flex flex-col justify-between rounded-xl border p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md'
								style={{ minHeight: '135px' }}
							>
								<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl'>
									<div className='absolute inset-0 bg-linear-to-b from-emerald-500/10 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70' />
								</div>
								<div className='relative z-10 flex items-center justify-between'>
									<span className='text-3xs font-mono font-bold text-emerald-400'>WCAG AAA COMPLIANT</span>
									<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>#09</span>
								</div>
								<div className='relative z-10 my-auto py-1.5'>
									<h4 className='text-foreground text-xs font-bold tracking-tight'>DOM Order Flow Integrity</h4>
									<p className='text-muted-foreground text-3xs mt-0.5 font-mono'>Keyboard tab sequence preserved</p>
								</div>
								<div className='border-border/60 text-muted-foreground text-3xs relative z-10 flex flex-wrap items-center justify-between gap-1 border-t pt-2 font-mono'>
									<span>Screen Reader OK</span>
									<span className='font-semibold text-emerald-400'>A11y Validated</span>
								</div>
							</div>
						</CssMasonryItem>
					</CssMasonry>
				</div>
			);
		}

		if (selectedSlug === 'auto-grid') {
			const minItemWidth = Number(propValues.minItemWidth ?? 280);
			const gap = Number(propValues.gap ?? 24);
			const mode = (propValues.mode as 'auto-fit' | 'auto-fill') ?? 'auto-fit';
			const maxColumns = Number(propValues.maxColumns ?? 4);
			const alignItems = (propValues.alignItems as 'stretch' | 'start' | 'center' | 'end') ?? 'stretch';

			const gridItems = [
				{
					id: '01',
					title: 'High-Throughput Kinetic Pipeline',
					desc: 'Automated repeat tracks expanding fluidly to consume available viewport space with zero layout thrash.',
					tag: 'PIPELINE',
					metric: '0.14ms Frame',
					colSpan: 1,
				},
				{
					id: '02',
					title: 'Dynamic MinMax Constraint Engine',
					desc: `Evaluates minmax(min(100%, ${minItemWidth}px), 1fr) to guarantee zero mobile horizontal scroll overflow.`,
					tag: 'COMPLIANCE',
					metric: `${minItemWidth}px Floor`,
					colSpan: 1,
				},
				{
					id: '03',
					title: 'Sub-Pixel Layout Stability',
					desc: 'Fractional unit distribution across browser render passes preventing cumulative layout shift (CLS = 0.00).',
					tag: 'VITALS',
					metric: 'CLS: 0.00',
					colSpan: 1,
				},
				{
					id: '04',
					title: 'Hermite Damped Track Transition',
					desc: 'Column wrapping transitions with fluid visual hierarchy and balanced element distribution.',
					tag: 'PHYSICS',
					metric: 'Hermite Smooth',
					colSpan: 1,
				},
				{
					id: '05',
					title: 'Cross-Ecosystem Universal Grid',
					desc: 'Zero-runtime pure CSS grid templates compiled for Vue, Svelte, Angular, Solid, and modern web frameworks.',
					tag: 'UNIVERSAL',
					metric: `${ECOSYSTEM_COUNT} Flavors`,
					colSpan: 1,
				},
				{
					id: '06',
					title: 'Zero Memory Leak Architecture',
					desc: 'Stateless declarative container avoiding persistent listener references or uncollected DOM observers.',
					tag: 'AUDIT',
					metric: '0 Heap Leaks',
					colSpan: 1,
				},
			];

			return (
				<div className='w-full p-2 sm:p-6'>
					<AutoGrid minItemWidth={minItemWidth} gap={gap} mode={mode} maxColumns={maxColumns} alignItems={alignItems} className='w-full'>
						{gridItems.map((item) => (
							<AutoGridItem key={item.id} colSpan={item.colSpan as any} className='group'>
								<div className='border-border/80 bg-card/90 hover:border-primary/50 relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
									<div className='from-primary/10 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-30 transition-opacity group-hover:opacity-60' />
									<div className='relative z-10'>
										<div className='mb-3 flex items-center justify-between'>
											<span className='border-primary/20 bg-primary/10 text-primary text-3xs inline-flex items-center rounded-md border px-2 py-0.5 font-mono font-semibold tracking-wider uppercase'>
												{item.tag}
											</span>
											<span className='kbd border-border bg-background/80 text-muted-foreground text-3xs font-mono font-bold'>GRID #{item.id}</span>
										</div>
										<h4 className='text-foreground group-hover:text-primary text-sm font-bold tracking-tight transition-colors'>{item.title}</h4>
										<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>{item.desc}</p>
									</div>
									<div className='border-border/60 text-muted-foreground text-3xs relative z-10 mt-5 flex items-center justify-between border-t pt-3 font-mono'>
										<span>Mode: {mode}</span>
										<span className='font-semibold text-emerald-400'>{item.metric}</span>
									</div>
								</div>
							</AutoGridItem>
						))}
					</AutoGrid>
				</div>
			);
		}

		if (selectedSlug === 'spotlight-card') {
			const rawRadius = Number(propValues.radius ?? 350);
			const rawOpacity = Number(propValues.opacity ?? 0.85);
			const color = String(propValues.color ?? '#6366f1');
			const borderColor = String(propValues.borderColor ?? '#818cf8');
			const rawSpread = Number(propValues.spread ?? 60);
			const mode = (propValues.mode as 'both' | 'border' | 'background') ?? 'both';
			const rawSmoothing = Number(propValues.smoothing ?? 0.2);
			const disabled = Boolean(propValues.disabled ?? false);

			const radius = Number.isFinite(rawRadius) && rawRadius > 0 ? rawRadius : 350;
			const opacity = Math.max(0, Math.min(1, Number.isFinite(rawOpacity) ? rawOpacity : 0.85));
			const spread = Math.max(0, Math.min(100, Number.isFinite(rawSpread) ? rawSpread : 60));
			const smoothing = Math.max(0.05, Math.min(1, Number.isFinite(rawSmoothing) ? rawSmoothing : 0.2));

			return (
				<div className='flex items-center justify-center p-2 sm:p-6'>
					<SpotlightCard
						radius={radius}
						color={color}
						borderColor={borderColor}
						opacity={opacity}
						spread={spread}
						mode={mode}
						smoothing={smoothing}
						disabled={disabled}
						className='border-border/80 bg-card/95 w-full max-w-lg cursor-pointer p-6 shadow-2xl transition-colors sm:p-8'
					>
						<div className='flex flex-col gap-6'>
							{/* Top Header */}
							<div className='flex items-center justify-between'>
								<div className='border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs'>
									<Sparkles className='size-5' />
								</div>
								<span className='kbd border-border/80 bg-muted/40 text-muted-foreground text-3xs px-2.5 py-1 font-mono font-semibold tracking-wider uppercase'>Interactive Spotlight</span>
							</div>

							{/* Title & Description */}
							<div className='space-y-2'>
								<h4 className='text-foreground text-xl font-bold tracking-tight sm:text-2xl'>Radial Illumination</h4>
								<p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>Dynamic 2D coordinate tracking with specular border illumination and fluid inertial falloff.</p>
							</div>

							{/* Clean Bottom Meta */}
							<div className='border-border/60 text-muted-foreground mt-2 flex items-center justify-between border-t pt-4 font-mono text-xs'>
								<div className='flex items-center gap-2'>
									<span className='size-2 rounded-full bg-emerald-500' />
									<span className='text-3xs tracking-wide uppercase'>120 FPS Coalesced</span>
								</div>
								<span className='text-3xs text-foreground/80 font-semibold tracking-wide uppercase'>Mode: {mode}</span>
							</div>
						</div>
					</SpotlightCard>
				</div>
			);
		}

		if (selectedSlug === 'morphing-tabs') {
			const springStiffness = typeof propValues.springStiffness === 'number' ? propValues.springStiffness : 26;
			const variant = (propValues.variant as 'pill' | 'underline' | 'glow') || 'pill';
			const size = (propValues.size as 'sm' | 'md' | 'lg') || 'md';

			return (
				<div className='mx-auto w-full max-w-lg p-4'>
					<MorphingTabs.Root defaultValue='dashboard' springStiffness={springStiffness} variant={variant} size={size}>
						<MorphingTabs.List className='w-full justify-between'>
							<MorphingTabs.Indicator springStiffness={springStiffness} variant={variant} />
							<MorphingTabs.Trigger value='dashboard' size={size} className='flex-1'>
								Dashboard
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='analytics' size={size} className='flex-1'>
								Analytics
							</MorphingTabs.Trigger>
							<MorphingTabs.Trigger value='settings' size={size} className='flex-1'>
								Settings
							</MorphingTabs.Trigger>
						</MorphingTabs.List>
						<MorphingTabs.Content value='dashboard' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Dashboard Metric Stream</div>
							<div className='text-muted-foreground text-xs'>Real-time dynamic system state with zero-jank pill transitions.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='analytics' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Kinetic Analytics Engine</div>
							<div className='text-muted-foreground text-xs'>Hardware accelerated measurements and analytical spring ODE.</div>
						</MorphingTabs.Content>
						<MorphingTabs.Content value='settings' className='border-border bg-card rounded-xl border p-6 text-sm shadow-sm'>
							<div className='text-foreground mb-1 font-bold'>Global Configuration</div>
							<div className='text-muted-foreground text-xs'>WAI-ARIA roving keyboard navigation enabled.</div>
						</MorphingTabs.Content>
					</MorphingTabs.Root>
				</div>
			);
		}

		if (selectedSlug === 'accordion') {
			const mode = (propValues.mode === 'multiple' ? 'multiple' : 'single') as 'single' | 'multiple';

			return (
				<div className='mx-auto w-full max-w-md p-4'>
					<Accordion.Root mode={mode} defaultValue='s-1'>
						<Accordion.Item value='s-1'>
							<Accordion.Trigger>
								<span>Dynamic Height Interpolation</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Using modern CSS Grid (0fr to 1fr) with zero layout reflows and zero-dependency morphing icon.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value='s-2'>
							<Accordion.Trigger>
								<span>WAI-ARIA Accessibility Standards</span>
								<Accordion.Icon />
							</Accordion.Trigger>
							<Accordion.Content>Full roving arrow keys, aria-expanded, aria-controls, and single/multiple expansion mode.</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			);
		}

		if (selectedSlug === 'infinite-marquee') {
			const speed = Number(propValues.speed ?? 40);
			const direction = (propValues.direction as 'left' | 'right') ?? 'left';
			const pauseOnHover = Boolean(propValues.pauseOnHover ?? true);
			const gap = Number(propValues.gap ?? 24);
			const showFadeEdges = Boolean(propValues.showFadeEdges ?? true);
			const fadeWidth = Number(propValues.fadeWidth ?? 48);
			const fadeEdgeColor = String(propValues.fadeEdgeColor || '#ffffff');
			const fadeEdgeColorDark = String(propValues.fadeEdgeColorDark || '#09090b');

			return (
				<div className='w-full overflow-hidden py-8'>
					<InfiniteMarquee
						speed={speed}
						direction={direction}
						pauseOnHover={pauseOnHover}
						gap={gap}
						showFadeEdges={showFadeEdges}
						fadeWidth={fadeWidth}
						fadeEdgeColor={fadeEdgeColor}
						fadeEdgeColorDark={fadeEdgeColorDark}
					>
						{[
							{ label: '120Hz ProMotion', tag: 'Kinetic', status: 'Active' },
							{ label: 'Zero External Animation Deps', tag: 'Pure', status: 'Locked' },
							{ label: 'Pure rAF Translation', tag: 'Engine', status: 'Ω(1)' },
							{ label: 'Modulo Wrapping Seam', tag: 'Math', status: 'C0/C1' },
							{ label: `${ECOSYSTEM_COUNT} Ecosystems Native`, tag: 'Universal', status: `${ECOSYSTEM_COUNT}/${ECOSYSTEM_COUNT}` },
						].map((item, idx) => (
							<div
								key={idx}
								className='border-border/80 bg-card/90 hover:border-foreground/40 flex items-center gap-3 rounded-2xl border px-5 py-3 text-xs font-semibold shadow-xs backdrop-blur-md transition-all hover:scale-[1.02]'
							>
								<span className='bg-primary/80 ring-primary/20 h-2 w-2 rounded-full ring-2' />
								<span className='text-foreground font-mono font-medium'>{item.label}</span>
								<span className='bg-secondary text-muted-foreground rounded-md px-1.5 py-0.5 font-mono text-[10px]'>{item.tag}</span>
								<span className='text-primary/80 font-mono text-[10px] font-bold'>{item.status}</span>
							</div>
						))}
					</InfiniteMarquee>
				</div>
			);
		}

		if (selectedSlug === 'bento-grid') {
			const rawCols = Number(propValues.cols ?? 3);
			const effectiveCols = viewportMode === 'mobile' ? 1 : viewportMode === 'tablet' ? Math.min(rawCols, 2) : rawCols;
			const gap = propValues.gap !== undefined ? (typeof propValues.gap === 'number' ? propValues.gap : Number(String(propValues.gap).replace('px', '')) || 20) : 20;
			const rowHeight = propValues.rowHeight !== undefined ? (typeof propValues.rowHeight === 'number' ? propValues.rowHeight : Number(String(propValues.rowHeight).replace('px', '')) || 180) : 180;

			return (
				<div className='mx-auto w-full max-w-5xl p-2 sm:p-4'>
					<BentoGrid cols={effectiveCols} gap={gap} rowHeight={rowHeight}>
						{/* 01. Hero Analytical Kinetics Card */}
						<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 3 ? 2 : 2} rowSpan={effectiveCols >= 3 ? 2 : 1}>
							<BentoHeader>
								<div className='flex items-center justify-between'>
									<span className='kbd border-border bg-background/80 text-primary text-3xs font-mono font-bold uppercase'>ANALYTICAL KINETICS</span>
									<span className='text-3xs text-muted-foreground font-mono'>#01</span>
								</div>
								<h4 className='text-foreground text-lg font-bold tracking-tight'>Continuous Math Engine</h4>
							</BentoHeader>
							<BentoVisual>
								<div className='border-primary/20 bg-background/60 w-full rounded-xl border p-3 shadow-2xs backdrop-blur-xs'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-3xs text-muted-foreground font-mono uppercase'>Live Compositor Telemetry</span>
										<span className='size-2 animate-pulse rounded-full bg-emerald-500' />
									</div>
									<svg className='text-primary fill-primary/10 h-16 w-full stroke-current' viewBox='0 0 300 60'>
										<path d='M0,45 Q50,10 100,35 T200,20 T300,30 L300,60 L0,60 Z' />
										<path d='M0,45 Q50,10 100,35 T200,20 T300,30' fill='none' strokeWidth='2' />
									</svg>
								</div>
							</BentoVisual>
							<BentoContent>Hardware-accelerated CSS custom properties driven directly by zero-allocation requestAnimationFrame loops.</BentoContent>
						</BentoCard>

						{/* 02. Big-Omega Lower Bound Metric */}
						<BentoCard colSpan={1} rowSpan={1}>
							<BentoHeader>
								<div className='flex items-center justify-between'>
									<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-emerald-500 uppercase'>BIG-OMEGA</span>
									<span className='text-3xs text-muted-foreground font-mono'>#02</span>
								</div>
								<h4 className='text-foreground text-base font-bold'>Ω(120Hz)</h4>
							</BentoHeader>
							<BentoVisual>
								<div className='flex items-baseline gap-1 font-mono text-2xl font-black text-emerald-500'>
									120<span className='text-muted-foreground text-xs font-normal'>FPS</span>
								</div>
							</BentoVisual>
							<BentoContent>Guaranteed lower-bound execution with zero layout thrashing via cached bounding geometry.</BentoContent>
						</BentoCard>

						{/* 03. GPU Isolated Latency */}
						<BentoCard colSpan={1} rowSpan={1}>
							<BentoHeader>
								<div className='flex items-center justify-between'>
									<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-indigo-400 uppercase'>COMPOSITOR</span>
									<span className='text-3xs text-muted-foreground font-mono'>#03</span>
								</div>
								<h4 className='text-foreground text-base font-bold'>&lt; 0.04ms</h4>
							</BentoHeader>
							<BentoVisual>
								<div className='flex items-baseline gap-1 font-mono text-2xl font-black text-indigo-400'>
									0.038<span className='text-muted-foreground text-xs font-normal'>ms</span>
								</div>
							</BentoVisual>
							<BentoContent>Sub-pixel compositor translation without main-thread jank or garbage collector pauses.</BentoContent>
						</BentoCard>

						{/* 04. Dense Auto-Flow Feature */}
						<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 3 ? 2 : 1} rowSpan={1}>
							<BentoHeader>
								<div className='flex items-center justify-between'>
									<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-violet-400 uppercase'>AUTO-PACKING</span>
									<span className='text-3xs text-muted-foreground font-mono'>#04</span>
								</div>
								<h4 className='text-foreground text-base font-bold'>Dense Flow Backfill</h4>
							</BentoHeader>
							<BentoVisual>
								<div className='grid max-w-[180px] grid-cols-4 gap-1.5'>
									{Array.from({ length: 8 }).map((_, i) => (
										<div key={i} className={`h-4.5 rounded-sm ${i < 6 ? 'border border-violet-500/60 bg-violet-500/30' : 'border-border/60 bg-muted/40 border'}`} />
									))}
								</div>
							</BentoVisual>
							<BentoContent>CSS Grid automatically backfills empty track pockets, eliminating layout voids.</BentoContent>
						</BentoCard>

						{/* 05. Universal Ecosystems */}
						<BentoCard colSpan={effectiveCols === 1 ? 1 : effectiveCols >= 4 ? 2 : effectiveCols === 3 ? 1 : 1} rowSpan={1}>
							<BentoHeader>
								<div className='flex items-center justify-between'>
									<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-amber-500 uppercase'>UNIVERSAL</span>
									<span className='text-3xs text-muted-foreground font-mono'>#05</span>
								</div>
								<h4 className='text-foreground text-base font-bold'>{ECOSYSTEM_COUNT} Ecosystems</h4>
							</BentoHeader>
							<BentoVisual>
								<div className='flex flex-wrap justify-center gap-1.5'>
									{['React', 'Vue', 'Svelte', 'Solid', 'Flutter'].map((f) => (
										<span key={f} className='border-border/60 bg-background/60 text-foreground text-4xs rounded-sm border px-1.5 py-0.5 font-mono font-semibold'>
											{f}
										</span>
									))}
								</div>
							</BentoVisual>
							<BentoContent>Native zero-dependency implementations compiled for all tier-1 web frameworks.</BentoContent>
						</BentoCard>

						{/* 06. Telemetry & Zero Leak Guarantee */}
						{effectiveCols >= 4 && (
							<BentoCard colSpan={2} rowSpan={1}>
								<BentoHeader>
									<div className='flex items-center justify-between'>
										<span className='kbd border-border bg-background/80 text-3xs font-mono font-bold text-cyan-400 uppercase'>AUDITED</span>
										<span className='text-3xs text-muted-foreground font-mono'>#06</span>
									</div>
									<h4 className='text-foreground text-base font-bold'>Zero Memory Leaks</h4>
								</BentoHeader>
								<BentoVisual>
									<div className='flex items-center gap-2 font-mono text-xs text-emerald-400'>
										<span className='size-2 rounded-full bg-emerald-500' />
										<span>0 Persistent Event Retainers</span>
									</div>
								</BentoVisual>
								<BentoContent>Verified through Chrome DevTools Heap Snapshots and Memlab heap retention audits.</BentoContent>
							</BentoCard>
						)}
					</BentoGrid>
				</div>
			);
		}

		if (selectedSlug === 'diamond-grid') {
			const gap = typeof propValues.gap === 'number' ? propValues.gap : Number(propValues.gap ?? 16);
			const layout = (propValues.layout as any) || 'auto';
			const mode = (propValues.mode as any) || 'rhombic';
			const responsive = Boolean(propValues.responsive ?? false);
			const isIsometric = mode === 'isometric';

			return (
				<div className='mx-auto flex w-full max-w-4xl items-center justify-center p-4 sm:p-8'>
					<DiamondGrid gap={gap} layout={layout} mode={mode} responsive={responsive} className='w-full max-w-3xl'>
						{Array.from({ length: 16 }).map((_, idx) =>
							isIsometric ? (
								<div
									key={idx}
									className='group border-border/80 bg-card/80 hover:border-primary hover:shadow-primary/20 relative flex aspect-square w-10 rotate-45 items-center justify-center rounded-xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-lg sm:w-14'
								>
									<div className='flex -rotate-45 flex-col items-center justify-center'>
										<span className='text-primary text-3xs font-mono font-bold'>#{idx + 1}</span>
									</div>
								</div>
							) : (
								<div
									key={idx}
									className='border-border bg-card/80 hover:border-primary flex aspect-square w-12 flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 sm:w-16'
								>
									<span className='text-primary text-3xs font-mono font-bold'>#{idx + 1}</span>
								</div>
							)
						)}
					</DiamondGrid>
				</div>
			);
		}

		if (selectedSlug === 'border-beam') {
			const rawSize = Number(propValues.size ?? 200);
			const rawDuration = Number(propValues.duration ?? 8);
			const rawBorderWidth = Number(propValues.borderWidth ?? 2);
			const colorFrom = String(propValues.colorFrom ?? '#ffaa40');
			const colorTo = String(propValues.colorTo ?? '#9c40ff');
			const doubleBeam = Boolean(propValues.doubleBeam ?? false);
			const rawEndOpacity = Number(propValues.endOpacity ?? 0);
			const rawOpacity = Number(propValues.opacity ?? 1);
			const rawBlur = Number(propValues.blur ?? 0);
			const rawBorderRadius = Number(propValues.borderRadius ?? 16);

			const size = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 200;
			const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 8;
			const borderWidth = Number.isFinite(rawBorderWidth) && rawBorderWidth >= 0 ? rawBorderWidth : 2;
			const borderRadius = Number.isFinite(rawBorderRadius) && rawBorderRadius >= 0 ? rawBorderRadius : 16;
			const endOpacity = Math.max(0, Math.min(1, Number.isFinite(rawEndOpacity) ? rawEndOpacity : 0));
			const opacity = Math.max(0, Math.min(1, Number.isFinite(rawOpacity) ? rawOpacity : 1));
			const blur = Math.max(0, Number.isFinite(rawBlur) ? rawBlur : 0);

			return (
				<div
					className='border-border/80 bg-card/95 relative mx-auto flex min-h-[220px] w-full max-w-md flex-col justify-between overflow-hidden border p-5 shadow-2xl backdrop-blur-xl sm:min-h-[240px] sm:p-6'
					style={{ borderRadius: `${borderRadius}px` }}
				>
					<div className='flex items-center justify-between gap-3'>
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 text-amber-500 shadow-sm'>
								<Sparkles className='size-4' />
							</div>
							<div>
								<h4 className='text-foreground text-sm font-semibold tracking-tight'>Quantum Laser Perimeter</h4>
								<p className='text-muted-foreground text-xs'>Sub-pixel hardware composite</p>
							</div>
						</div>
						<span className='border-border/80 bg-muted/40 text-muted-foreground text-3xs inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono font-medium'>
							<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
							{doubleBeam ? 'DUAL BEAM // 120 FPS' : '120 FPS'}
						</span>
					</div>

					<div className='my-auto py-3'>
						<div className='text-muted-foreground text-3xs font-mono tracking-wider uppercase'>Kinetic Orbital Vector</div>
						<div className='text-foreground mt-1 flex items-baseline gap-2 text-xl font-semibold tracking-tight sm:text-2xl'>
							<span>
								{(360 / duration).toFixed(0)} <span className='text-muted-foreground font-mono text-xs font-normal'>deg/s</span>
							</span>
							<span className='font-mono text-xs font-medium text-emerald-500'>• {doubleBeam ? 'Dual Phase (180°)' : 'Single Phase'}</span>
						</div>
					</div>

					<div className='border-border/40 text-3xs text-muted-foreground flex items-center justify-between border-t pt-3 font-mono'>
						<div className='flex items-center gap-2'>
							<span>{borderWidth}px stroke</span>
							<span>•</span>
							<span>{duration}s cycle</span>
							<span>•</span>
							<span>{size}px arc</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorFrom }} title={`From: ${colorFrom}`} />
							<span className='border-border/60 size-2.5 rounded-full border' style={{ backgroundColor: colorTo }} title={`To: ${colorTo}`} />
						</div>
					</div>

					<BorderBeam
						size={size}
						duration={duration}
						borderWidth={borderWidth}
						colorFrom={colorFrom}
						colorTo={colorTo}
						doubleBeam={doubleBeam}
						endOpacity={endOpacity}
						opacity={opacity}
						blur={blur}
						borderRadius={Number(propValues.borderRadius ?? 16)}
					/>
				</div>
			);
		}

		if (selectedSlug === 'floating-dock') {
			const direction = (propValues.direction as any) || 'bottom';
			const baseSize = Number(propValues.baseSize ?? 44);
			const maxMagnification = Number(propValues.maxMagnification ?? 0.65);
			const influenceRadius = Number(propValues.influenceRadius ?? 85);
			const showLabels = propValues.showLabels !== false;
			const panelStyle = (propValues.panelStyle as any) || 'glass';

			const dockPositionClass =
				direction === 'bottom'
					? 'bottom-3.5 left-1/2 -translate-x-1/2'
					: direction === 'top'
						? 'top-14 left-1/2 -translate-x-1/2'
						: direction === 'left'
							? 'left-3.5 top-1/2 -translate-y-1/2'
							: 'right-3.5 top-1/2 -translate-y-1/2';

			const appDockItems = [
				{
					title: 'Dashboard',
					icon: (
						<div className='border-primary/30 bg-primary/10 text-primary flex size-full items-center justify-center rounded-xl border shadow-xs'>
							<IconLayoutDashboard className='size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Projects',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconFolders className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Analytics',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconChartBar className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Database',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconDatabase className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'AI Copilot',
					icon: (
						<div className='flex size-full items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/10 text-purple-400 shadow-xs transition-colors hover:border-purple-500/50'>
							<Sparkles className='size-[60%]' />
						</div>
					),
				},
				{
					title: 'Terminal',
					icon: (
						<div className='flex size-full items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 shadow-xs transition-colors hover:border-emerald-500/50'>
							<Terminal className='size-[60%]' stroke={2} />
						</div>
					),
				},
				{
					title: 'Team',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconUsers className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Settings',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconSettings className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
			];

			const socialItems = [
				{
					title: 'GitHub',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconBrandGithub className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'X / Twitter',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconBrandX className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Discord',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconBrandDiscord className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'LinkedIn',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconBrandLinkedin className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'YouTube',
					icon: (
						<div className='border-border/80 bg-card/90 hover:border-primary/40 hover:bg-accent/40 text-foreground flex size-full items-center justify-center rounded-xl border shadow-xs transition-colors'>
							<IconBrandYoutube className='text-muted-foreground size-[60%]' stroke={1.75} />
						</div>
					),
				},
				{
					title: 'Share Link',
					icon: (
						<div className='border-primary/30 bg-primary/10 text-primary flex size-full items-center justify-center rounded-xl border shadow-xs'>
							<IconShare className='size-[60%]' stroke={1.75} />
						</div>
					),
				},
			];

			const isSocial = dockIconSet === 'social';
			const isMobile = viewportMode === 'mobile' || activePreset === 'Compact Mobile';
			const effectiveAppDockItems = isMobile ? [appDockItems[0], appDockItems[1], appDockItems[2], appDockItems[4], appDockItems[7]] : appDockItems;
			const activeDockItems = isSocial ? socialItems : effectiveAppDockItems;

			return (
				<div className='border-border/60 bg-card/40 relative mx-auto flex h-[440px] w-full max-w-4xl flex-col justify-between overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl select-none sm:h-[480px]'>
					{/* Responsive Application Shell Header */}
					<div className='border-border/50 bg-background/50 z-20 flex h-10 w-full shrink-0 items-center justify-between border-b px-3 backdrop-blur-md sm:h-11 sm:px-4'>
						<div className='flex min-w-0 items-center gap-2 sm:gap-2.5'>
							<div className='border-primary/30 bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border'>
								<Sparkles className='size-3.5' />
							</div>
							<span className='text-foreground truncate text-xs font-semibold tracking-tight'>Exhuma Workspace</span>
						</div>

						<div className='flex items-center gap-2 font-mono text-xs'>
							<div className='border-border/60 bg-muted/40 flex items-center rounded-lg border p-0.5 font-sans'>
								<button
									type='button'
									onClick={() => setDockIconSet('app')}
									className={cn(
										'text-3xs cursor-pointer rounded-md px-2 py-0.5 font-medium transition-all',
										dockIconSet === 'app' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									App Icons
								</button>
								<button
									type='button'
									onClick={() => setDockIconSet('social')}
									className={cn(
										'text-3xs cursor-pointer rounded-md px-2 py-0.5 font-medium transition-all',
										dockIconSet === 'social' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									Social Icons
								</button>
							</div>
							<span className='text-3xs inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-medium text-emerald-400'>
								<span className='size-1.5 animate-pulse rounded-full bg-emerald-400' />
								120 FPS NATIVE
							</span>
						</div>
					</div>

					{/* Responsive Application Status Body */}
					<div className='pointer-events-none my-auto flex flex-col items-center justify-center p-4 text-center sm:p-6'>
						<div className='mb-3 grid w-full max-w-lg grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-3 sm:gap-3'>
							<div className='border-border/60 bg-background/50 rounded-xl border p-2.5 text-left shadow-2xs backdrop-blur-xs sm:p-3'>
								<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>Active Node</span>
								<div className='text-foreground mt-0.5 font-mono text-sm font-bold sm:mt-1 sm:text-base'>2,840</div>
								<span className='text-3xs font-mono font-medium text-emerald-400'>+12.4% live</span>
							</div>
							<div className='border-border/60 bg-background/50 rounded-xl border p-2.5 text-left shadow-2xs backdrop-blur-xs sm:p-3'>
								<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>Compositor</span>
								<div className='text-foreground mt-0.5 font-mono text-sm font-bold sm:mt-1 sm:text-base'>0.038ms</div>
								<span className='text-primary text-3xs font-mono font-medium'>GPU Direct</span>
							</div>
							<div className='border-border/60 bg-background/50 col-span-2 rounded-xl border p-2.5 text-left shadow-2xs backdrop-blur-xs sm:col-span-1 sm:p-3'>
								<span className='text-3xs text-muted-foreground font-mono tracking-wider uppercase'>Orientation</span>
								<div className='text-foreground mt-0.5 font-mono text-sm font-bold uppercase sm:mt-1 sm:text-base'>{direction}</div>
								<span className='text-muted-foreground text-3xs font-mono font-medium'>{baseSize}px Base</span>
							</div>
						</div>

						<p className='text-muted-foreground max-w-xs text-xs leading-relaxed sm:max-w-sm'>Continuous Gaussian proximity magnification with zero layout shift and direction-aware popover tooltips.</p>
					</div>

					{/* Kinetic Application Dock Container */}
					<div className={`absolute ${dockPositionClass} z-30`}>
						<FloatingDock
							direction={direction}
							baseSize={baseSize}
							maxMagnification={maxMagnification}
							influenceRadius={influenceRadius}
							showLabels={showLabels}
							panelStyle={panelStyle}
							items={activeDockItems}
						/>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'number-ticker') {
			const value = Number(propValues.value ?? 1000);
			const decimalPlaces = Number(propValues.decimalPlaces ?? 0);
			return (
				<div className='border-border bg-card mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-lg'>
					<span className='kbd text-primary text-3xs mb-2'>ANALYTICAL EASING (rAF)</span>
					<div className='text-foreground font-mono text-6xl font-black tracking-tight'>
						$<NumberTicker value={value} decimalPlaces={decimalPlaces} />
					</div>
					<p className='text-muted-foreground mt-3 text-xs'>Continuous ease-out exponential ticker with zero Framer Motion dependencies.</p>
				</div>
			);
		}

		if (selectedSlug === 'magnetic-button') {
			const strength = Number(propValues.strength ?? 0.35);
			const radius = Number(propValues.radius ?? 120);
			const springDamping = Number(propValues.springDamping ?? 18);
			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<p className='text-muted-foreground mb-6 text-xs'>Move cursor near button to feel inverted magnetic pull field</p>
					<MagneticButton
						strength={strength}
						radius={radius}
						springDamping={springDamping}
						className='border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20 rounded-2xl border px-8 py-4 font-bold shadow-xl backdrop-blur-md transition-colors'
					>
						<span className='flex items-center gap-2'>
							<Sparkles className='text-primary h-4 w-4 shrink-0' />
							<span>Magnetic Attraction</span>
						</span>
					</MagneticButton>
				</div>
			);
		}

		if (selectedSlug === 'card-swipe-stack') {
			const thresholdDistance = Number(propValues.thresholdDistance ?? 120);
			const maxRotation = Number(propValues.maxRotation ?? 20);
			const scaleStep = Number(propValues.scaleStep ?? 0.05);
			const offsetStep = Number(propValues.offsetStep ?? 14);
			const preventLastCardDismiss = propValues.preventLastCardDismiss !== false;
			return (
				<div className='relative max-h-[480px] w-full overflow-x-hidden overflow-y-auto scroll-smooth px-4 py-2'>
					{/* Stage 01: Card Swipe Stack Section */}
					<div className='flex flex-col items-center justify-center py-2'>
						<div className='mb-2 text-center'>
							<span className='kbd text-primary text-3xs font-mono'>STAGE 01 // SWIPE STACK</span>
							<h3 className='text-foreground mt-0.5 text-sm font-bold'>Kinetic Card Swipe Stack</h3>
							<p className='text-muted-foreground mt-0.5 font-mono text-xs'>
								{preventLastCardDismiss ? 'Drag to swipe cards → last card anchors with elastic resistance' : 'Drag to swipe all cards → scroll moves to Stage 02'}
							</p>
						</div>

						<CardSwipeStack
							key={cardSwipeResetKey}
							thresholdDistance={thresholdDistance}
							maxRotation={maxRotation}
							scaleStep={scaleStep}
							offsetStep={offsetStep}
							preventLastCardDismiss={preventLastCardDismiss}
							className='w-full max-w-sm'
							items={[
								{ id: 1, title: 'Big-Omega Guarantees', tag: 'MATHEMATICS', desc: 'Guaranteed lower bound frame rate floor of 120Hz.' },
								{ id: 2, title: 'Zero Framework Locks', tag: 'COMPILERS', desc: `Pure AST universal generation targeting ${ECOSYSTEM_COUNT} ecosystems.` },
								{ id: 3, title: 'Direct GPU Pipeline', tag: 'KINETICS', desc: 'Direct translate3d writes bypassing virtual DOM reconciliation.' },
							]}
							renderCard={(item) => (
								<div className='border-border bg-card w-full rounded-2xl border p-5 shadow-2xl backdrop-blur-md'>
									<span className='kbd text-primary text-3xs font-bold'>{item.tag}</span>
									<h4 className='text-foreground mt-1 text-base font-bold'>{item.title}</h4>
									<p className='text-muted-foreground mt-1 text-xs leading-relaxed'>{item.desc}</p>
									<div className='border-border text-muted-foreground text-3xs mt-3 flex items-center justify-between border-t pt-2.5 font-mono'>
										<span>← SWIPE LEFT</span>
										<span>SWIPE RIGHT →</span>
									</div>
								</div>
							)}
							emptyState={
								<div className='border-border bg-card/80 flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-xl backdrop-blur-md'>
									<div className='bg-primary/10 text-primary mb-2 flex size-9 items-center justify-center rounded-full'>
										<RefreshCw className='size-4' />
									</div>
									<h4 className='text-foreground text-sm font-semibold'>Stack Completed</h4>
									<p className='text-muted-foreground mt-0.5 text-xs'>All cards have been swiped away.</p>
									<button
										type='button'
										onClick={() => setCardSwipeResetKey((k) => k + 1)}
										className='bg-primary text-primary-foreground hover:bg-primary/90 mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors'
									>
										<RefreshCw className='size-3.5' /> Reset Stack
									</button>
								</div>
							}
						/>

						<div className='text-muted-foreground/60 text-3xs mt-3 flex animate-bounce items-center gap-1.5 font-mono'>
							<span>SCROLL FOR NEXT SECTION</span>
							<span>↓</span>
						</div>
					</div>

					{/* Stage 02: Next Section Below Stack */}
					<div className='border-border/80 bg-card/70 mx-auto mt-4 max-w-md rounded-2xl border p-6 shadow-xl backdrop-blur-md'>
						<div className='border-border/60 flex items-center justify-between border-b pb-3'>
							<div>
								<span className='kbd text-3xs font-mono text-emerald-400'>STAGE 02 // NEXT SECTION</span>
								<h4 className='text-foreground mt-1 text-sm font-bold'>Hardware Telemetry & Runtime Invariants</h4>
							</div>
							<span className='kbd text-3xs border-emerald-500/30 bg-emerald-500/10 font-mono text-emerald-400'>PASS-THROUGH ACTIVE</span>
						</div>
						<p className='text-muted-foreground mt-3 text-xs leading-relaxed'>You have scrolled past the card stack. Drag cards to dismiss them — scroll always moves here naturally.</p>
						<div className='mt-4 grid grid-cols-3 gap-2.5'>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>FRAME FLOOR</span>
								<p className='text-foreground mt-1 text-sm font-bold'>120 FPS</p>
							</div>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>GESTURE BUFFER</span>
								<p className='text-foreground mt-1 text-sm font-bold'>Float64Array</p>
							</div>
							<div className='border-border/60 bg-muted/20 rounded-xl border p-3'>
								<span className='text-muted-foreground text-3xs font-mono'>HEAP ALLOC</span>
								<p className='text-foreground mt-1 text-sm font-bold'>Ω(1) ZERO</p>
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (selectedSlug === 'comparison-slider') {
			const defaultPosition = Number(propValues.defaultPosition ?? 0.5);
			const step = Number(propValues.step ?? 0.05);
			const orientation = (propValues.orientation as 'horizontal' | 'vertical') ?? 'horizontal';
			return (
				<div className='mx-auto w-full max-w-md py-4'>
					<ComparisonSlider
						aspectRatio='16/10'
						defaultPosition={defaultPosition}
						step={step}
						orientation={orientation}
						before={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-indigo-950 via-purple-950 to-slate-900 p-6 text-white'>
								<span className='kbd text-3xs self-start bg-white/20 text-white'>ORIGINAL MOCKUP</span>
								<div>
									<h4 className='text-xl font-bold'>Static Canvas</h4>
									<p className='text-xs opacity-70'>Unaccelerated design view</p>
								</div>
							</div>
						}
						after={
							<div className='flex size-full flex-col justify-between bg-linear-to-br from-emerald-950 via-teal-950 to-slate-900 p-6 text-white'>
								<span className='kbd text-3xs self-start bg-emerald-500/30 text-emerald-300'>EXHUMA KINETIC ENGINE</span>
								<div>
									<h4 className='text-xl font-bold'>120Hz ProMotion</h4>
									<p className='text-xs opacity-70'>Analytical physics active</p>
								</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'expandable-card') {
			const duration = Number(propValues.duration ?? 360);
			return (
				<div className='mx-auto w-full max-w-sm py-4'>
					<ExpandableCard
						duration={duration}
						cardContent={
							<div className='border-border bg-card hover:border-primary/50 rounded-2xl border p-6 shadow-lg transition-all'>
								<span className='kbd text-primary text-3xs'>CLICK TO EXPAND</span>
								<h4 className='text-foreground mt-2 text-lg font-bold'>FLIP Morphing Architecture</h4>
								<p className='text-muted-foreground mt-1 text-xs'>Mathematical geometry snapshot with zero Framer Motion.</p>
							</div>
						}
						expandedContent={
							<div className='space-y-4'>
								<span className='kbd text-primary text-3xs'>MODAL DIALOG (FLIP INVERTED)</span>
								<h3 className='text-foreground text-2xl font-black'>Hardware-Accelerated Dialog</h3>
								<p className='text-muted-foreground text-sm leading-relaxed'>
									The card morphs smoothly from its trigger bounding rect into a centered dialog snapshot using analytical FLIP transformation matrices.
								</p>
								<div className='border-border bg-background text-muted-foreground rounded-xl border p-4 font-mono text-xs'>Press ESC or click backdrop to close</div>
							</div>
						}
					/>
				</div>
			);
		}

		if (selectedSlug === 'cursor-tooltip') {
			const springDamping = Number(propValues.springDamping ?? 22);
			return (
				<div className='flex flex-col items-center justify-center p-12'>
					<CursorTooltip
						springDamping={springDamping}
						content='Exhuma Exponential Cursor Smoothing'
						className='border-border bg-card/80 hover:border-primary cursor-pointer rounded-2xl border p-8 text-center shadow-xl transition-colors'
					>
						<span className='kbd text-primary text-3xs mb-2 inline-block'>HOVER OVER CARD</span>
						<h4 className='text-foreground text-xl font-bold'>Interactive Viewport Target</h4>
						<p className='text-muted-foreground mt-1 text-xs'>Hover cursor anywhere over this card to activate the magnetic trailing tooltip.</p>
					</CursorTooltip>
				</div>
			);
		}

		return null;
	};

	return (
		<div className='w-full space-y-6'>
			{/* Xcode/Figma Top Toolbar */}
			<div className='border-border bg-card flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-sm transition-colors lg:flex-row lg:items-center'>
				{/* Breadcrumb & Component Info */}
				<div className='flex items-center gap-3'>
					<div className='bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl shadow-xs'>
						<Sliders className='h-4 w-4' />
					</div>
					<div>
						<div className='text-muted-foreground flex items-center gap-1.5 font-mono text-xs'>
							<span>Studio Workbench</span>
							<ChevronRight className='h-3 w-3 shrink-0' />
							<span className='text-foreground font-bold'>{component.name}</span>
						</div>
						<div className='mt-0.5 flex items-center gap-2'>
							<Badge variant='ecosystem' className='text-primary text-3xs font-bold uppercase'>
								{component.category}
							</Badge>
							<span className='text-muted-foreground text-xs'>· {ECOSYSTEM_COUNT} Native Idioms</span>
						</div>
					</div>
				</div>

				{/* Presets Selector Bar */}
				{Object.keys(presets).length > 0 && (
					<div className='flex items-center gap-2'>
						<span className='text-muted-foreground font-mono text-xs font-medium'>Presets:</span>
						<div className='bg-muted/60 border-border flex items-center gap-1 rounded-lg border p-1'>
							{Object.keys(presets).map((pName) => (
								<button
									key={pName}
									type='button'
									onClick={() => applyPreset(pName)}
									className={cn(
										'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-all',
										activePreset === pName ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{pName}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Right: Quick CLI & Reset */}
				<div className='flex items-center gap-2.5'>
					<div className='border-border bg-muted/40 text-foreground flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs'>
						<Terminal className='text-primary h-3.5 w-3.5 shrink-0' />
						<span className='text-muted-foreground text-2xs max-w-[11.25rem] truncate sm:max-w-none'>{cliCommand}</span>
						<button type='button' onClick={copyCli} className='text-muted-foreground hover:text-foreground cursor-pointer transition-colors' title='Copy CLI command'>
							{copiedCli ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='h-3.5 w-3.5' />}
						</button>
					</div>

					<Button variant='outline' size='sm' onClick={resetProps} className='cursor-pointer gap-1.5 text-xs' title='Reset all properties'>
						<RefreshCw className='h-3.5 w-3.5' />
						<span className='hidden sm:inline'>Reset</span>
					</Button>
				</div>
			</div>

			{/* Three-Panel Xcode/Figma IDE Stage */}
			<div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-12'>
				{/* 1. Left Component Tree (3 cols) */}
				<div className='border-border bg-card space-y-4 rounded-2xl border p-4 shadow-sm lg:col-span-3'>
					<div className='border-border flex items-center justify-between border-b pb-3'>
						<div className='flex items-center gap-2'>
							<Layers className='text-primary h-4 w-4 shrink-0' />
							<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Components</span>
						</div>
						<span className='kbd text-4xs'>{ALL_COMPONENTS.length} CANONICAL</span>
					</div>

					{/* Search input */}
					<div className='relative'>
						<Search className='text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5' />
						<input
							type='text'
							value={catalogSearch}
							onChange={(e) => setCatalogSearch(e.target.value)}
							placeholder='Filter components...'
							className='border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-1.5 pr-3 pl-8 text-xs outline-none focus:ring-1'
						/>
					</div>

					{/* Component Tree Items */}
					<div className='max-h-[32.5rem] space-y-1 overflow-y-auto pr-1'>
						{filteredComponents.map((comp) => {
							const isSelected = comp.slug === selectedSlug;
							return (
								<button
									key={comp.slug}
									type='button'
									onClick={() => handleSelectComponent(comp.slug)}
									className={cn(
										'flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-all',
										isSelected ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
									)}
								>
									<div>
										<div className='truncate font-semibold'>{comp.name}</div>
										<div className={cn('text-3xs font-mono capitalize', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{comp.category}</div>
									</div>
									<ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-40')} />
								</button>
							);
						})}
					</div>
				</div>

				{/* 2. Center Stage Viewport (6 cols) */}
				<div className='border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-6'>
					{/* Responsive Device Toolbar */}
					<div className='border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2 text-xs'>
						{/* Device Frames */}
						<div className='bg-muted/60 border-border/50 flex items-center gap-1 rounded-lg border p-1'>
							<button
								type='button'
								onClick={() => setViewportMode('desktop')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'desktop' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Desktop (100%)'
							>
								<Monitor className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Desktop</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('laptop')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'laptop' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Laptop (1024px)'
							>
								<Laptop className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Laptop</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('tablet')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'tablet' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Tablet (768px)'
							>
								<Tablet className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Tablet</span>
							</button>
							<button
								type='button'
								onClick={() => setViewportMode('mobile')}
								className={cn(
									'flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all',
									viewportMode === 'mobile' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Mobile (375px)'
							>
								<Smartphone className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Mobile</span>
							</button>
						</div>

						{/* Zoom & Canvas Texture */}
						<div className='text-muted-foreground text-2xs flex items-center gap-3 font-mono'>
							<span className='kbd text-4xs'>{viewportMode === 'mobile' ? '375 × 667 px' : viewportMode === 'tablet' ? '768 × 1024 px' : viewportMode === 'laptop' ? '1024 × 768 px' : 'Fluid 100%'}</span>

							<div className='hidden items-center gap-1 sm:flex'>
								<button type='button' onClick={() => setZoomScale((z) => Math.max(50, z - 25))} className='hover:bg-accent hover:text-foreground cursor-pointer rounded-sm p-1' title='Zoom out'>
									<ZoomOut className='h-3.5 w-3.5' />
								</button>
								<span className='w-8 text-center'>{zoomScale}%</span>
								<button type='button' onClick={() => setZoomScale((z) => Math.min(150, z + 25))} className='hover:bg-accent hover:text-foreground cursor-pointer rounded-sm p-1' title='Zoom in'>
									<ZoomIn className='h-3.5 w-3.5' />
								</button>
							</div>
						</div>
					</div>

					{/* Dot-Grid Canvas Viewport */}
					<div
						className={cn(
							'flex min-h-[30rem] items-center justify-center overflow-auto p-6 transition-colors sm:p-10',
							canvasGrid === 'dots' ? 'bg-dot-grid' : canvasGrid === 'dense' ? 'bg-dot-grid-dense' : 'bg-background'
						)}
					>
						<div
							className={cn('w-full transition-all duration-300', viewportWidth)}
							style={{
								transform: `scale(${zoomScale / 100})`,
								transformOrigin: 'center',
							}}
						>
							{renderCanvasPreview()}
						</div>
					</div>
				</div>

				{/* 3. Right Property Inspector (3 cols) */}
				<div className='border-border bg-card space-y-4 rounded-2xl border p-4 shadow-sm lg:col-span-3'>
					<div className='border-border flex items-center justify-between border-b pb-3'>
						<div className='flex items-center gap-2'>
							<Sliders className='text-primary h-4 w-4 shrink-0' />
							<span className='text-foreground font-mono text-xs font-bold tracking-wider uppercase'>Property Inspector</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='kbd text-4xs'>{component.props.length} PROPS</span>
							<button
								type='button'
								onClick={resetProps}
								className='text-muted-foreground hover:text-foreground text-3xs flex cursor-pointer items-center gap-1 font-mono transition-colors'
								title='Reset properties to default'
							>
								<RefreshCw className='h-3 w-3' />
								<span>Reset</span>
							</button>
						</div>
					</div>

					{/* Prop Controls List */}
					<div className='max-h-[32.5rem] space-y-1.5 overflow-y-auto pr-1'>
						{component.props.map((propDef) => {
							const rawVal = propValues[propDef.name];
							const val = rawVal !== undefined && rawVal !== null && rawVal !== '' ? rawVal : propDef.defaultValue;

							return (
								<div key={propDef.name} className='border-border/60 bg-muted/20 rounded-lg border px-2.5 py-1.5'>
									<div className='flex items-center justify-between text-xs'>
										<label htmlFor={`prop-${propDef.name}`} className='text-foreground text-2xs font-mono font-semibold'>
											{propDef.name}
										</label>
										{propDef.type === 'boolean' && (
											<input
												type='checkbox'
												id={`prop-${propDef.name}`}
												checked={Boolean(val)}
												onChange={(e) => handlePropChange(propDef.name, e.target.checked)}
												className='border-border accent-primary h-3.5 w-3.5 cursor-pointer rounded-sm'
											/>
										)}
									</div>

									{/* Render Control based on type */}
									{propDef.type === 'select' && propDef.options ? (
										<select
											id={`prop-${propDef.name}`}
											value={String(val)}
											onChange={(e) => handlePropChange(propDef.name, e.target.value)}
											className='border-input bg-background text-foreground text-2xs focus:ring-ring mt-1 w-full rounded-md border px-2 py-1 outline-none focus:ring-1'
										>
											{propDef.options.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
									) : propDef.type === 'number' ? (
										/* Slider + Numerical Input Sync (Big-Ω NaN-immune) */
										(() => {
											const parsed = typeof val === 'number' ? val : parseFloat(String(val));
											const min = propDef.min ?? 0;
											const max = propDef.max ?? 100;
											const step = propDef.step ?? 1;
											const num = Number.isFinite(parsed) ? parsed : min;
											return (
												<div className='flex items-center gap-2 pt-0.5'>
													<input
														type='range'
														id={`prop-${propDef.name}`}
														min={min}
														max={max}
														step={step}
														value={num}
														onChange={(e) => handlePropChange(propDef.name, Number(e.target.value))}
														className='accent-primary h-1 flex-1 cursor-pointer'
													/>
													<input
														type='number'
														min={min}
														max={max}
														step={step}
														value={Number.isFinite(parsed) ? parsed : ''}
														onChange={(e) => {
															const parsedVal = parseFloat(e.target.value);
															handlePropChange(propDef.name, Number.isFinite(parsedVal) ? parsedVal : min);
														}}
														className='border-input bg-background text-foreground text-3xs w-12 rounded-sm border px-1 py-0.5 text-right font-mono'
													/>
												</div>
											);
										})()
									) : propDef.type === 'color' ? (
										(() => {
											const colorFallback = String(propDef.defaultValue || (propDef.name.toLowerCase().includes('dark') ? '#09090b' : '#ffffff'));
											return (
												<div className='flex flex-col gap-1 pt-1'>
													<div className='flex items-center gap-1.5'>
														<input
															type='color'
															id={`prop-${propDef.name}`}
															value={toHexColor(val, colorFallback)}
															onChange={(e) => handlePropChange(propDef.name, e.target.value)}
															className='border-border/80 h-6 w-8 cursor-pointer rounded-sm border bg-transparent p-0.5'
															title='Choose color'
														/>
														<input
															type='text'
															value={String(val ?? colorFallback)}
															onChange={(e) => handlePropChange(propDef.name, e.target.value)}
															className='border-input bg-background text-foreground text-3xs h-6 flex-1 rounded-sm border px-1.5 font-mono'
															placeholder={colorFallback}
														/>
													</div>
													<div className='flex items-center gap-1 pt-0.5'>
														{COLOR_PRESETS.map((preset) => (
															<button
																key={preset.value}
																type='button'
																title={`${preset.label} (${preset.value})`}
																onClick={() => handlePropChange(propDef.name, preset.value)}
																className={`h-3 w-3 cursor-pointer rounded-full border transition-transform hover:scale-125 ${
																	toHexColor(val, colorFallback) === preset.value.toLowerCase() ? 'border-foreground ring-primary scale-110 ring-1' : 'border-border/80'
																}`}
																style={{ backgroundColor: preset.value }}
															/>
														))}
													</div>
												</div>
											);
										})()
									) : propDef.type === 'string' ? (
										<div className='pt-1'>
											<input
												type='text'
												id={`prop-${propDef.name}`}
												value={String(val ?? '')}
												onChange={(e) => handlePropChange(propDef.name, e.target.value)}
												className='border-input bg-background text-foreground text-3xs h-6 w-full rounded-sm border px-1.5 font-mono'
											/>
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Bottom Synchronizer: 13 Ecosystems Code Viewer */}
			<div className='border-border bg-card overflow-hidden rounded-2xl border shadow-sm'>
				{/* Top bar */}
				<div className='border-border bg-muted/30 flex flex-col items-stretch justify-between gap-3 border-b px-4 py-3 md:flex-row md:items-center'>
					<div className='flex items-center gap-2'>
						<Sparkles className='text-primary h-4 w-4 shrink-0' />
						<span className='text-foreground font-mono text-xs font-bold'>Universal Code Synchronizer</span>
						<Badge variant='ecosystem' className='text-3xs'>
							{selectedFlavor}
						</Badge>
					</div>

					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={downloadFile}
							className='border-border bg-background text-foreground hover:bg-accent inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors'
							title='Download component source'
						>
							<Download className='h-3.5 w-3.5 shrink-0' />
							<span>Download Source</span>
						</button>
					</div>
				</div>

				{/* 13 Ecosystem Selector Pills */}
				<div className='border-border bg-background/50 flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5'>
					{FLAVORS.map((flavor) => {
						const isSelected = selectedFlavor === flavor;
						return (
							<button
								key={flavor}
								type='button'
								onClick={() => {
									setSelectedFlavor(flavor);
									setSelectedFileIdx(0);
								}}
								className={cn(
									'cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-all',
									isSelected ? 'border-primary bg-primary text-primary-foreground font-bold shadow-xs' : 'border-border bg-card text-muted-foreground hover:border-input hover:text-foreground'
								)}
							>
								{ECOSYSTEM_LABELS[flavor]}
							</button>
						);
					})}
				</div>

				{/* Multi-File Tabs (for WordPress Gutenberg, etc.) */}
				{generatedFiles.length > 1 && (
					<div className='border-border bg-muted/20 flex items-center gap-1.5 border-b px-4 py-2'>
						<span className='text-muted-foreground text-3xs mr-2 font-mono'>Generated Files ({generatedFiles.length}):</span>
						{generatedFiles.map((file, idx) => (
							<button
								key={file.filename}
								type='button'
								onClick={() => setSelectedFileIdx(idx)}
								className={cn(
									'cursor-pointer rounded-md px-3 py-1 font-mono text-xs transition-colors',
									selectedFileIdx === idx ? 'bg-accent text-accent-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								{file.filename}
							</button>
						))}
					</div>
				)}

				{/* CodeBlock Display */}
				<div className='bg-muted/10 p-4'>
					<CodeBlock
						code={activeFile.code}
						filename={activeFile.filename}
						language={
							activeFile.filename.endsWith('.dart')
								? 'dart'
								: activeFile.filename.endsWith('.php')
									? 'php'
									: activeFile.filename.endsWith('.vue')
										? 'vue'
										: activeFile.filename.endsWith('.svelte')
											? 'svelte'
											: activeFile.filename.endsWith('.json')
												? 'json'
												: 'tsx'
						}
					/>
				</div>
			</div>
		</div>
	);
}

export default StudioWorkbench;
