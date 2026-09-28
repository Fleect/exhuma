'use client';

import * as React from 'react';
import {
	IconAdjustments as Sliders,
	IconTerminal2 as Terminal,
	IconCheck as Check,
	IconCopy as Copy,
	IconCpu as Cpu,
	IconSparkles as Sparkles,
	IconShieldCheck as ShieldCheck,
	IconAccessible as Accessibility,
	IconDeviceTablet as Tablet,
	IconDeviceMobile as Smartphone,
	IconDeviceDesktop as Monitor,
	IconZoomIn as ZoomIn,
	IconZoomOut as ZoomOut,
	IconDownload as Download,
	IconRefresh as RefreshCw,
	IconArrowsMaximize as Maximize,
	IconArrowsMinimize as Minimize,
	IconStack2 as Layers,
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
	IconSearch,
} from '@tabler/icons-react';
import { COMPONENT_REGISTRY, ALL_COMPONENTS, EcosystemFlavor, ECOSYSTEM_LABELS, generateComponentUsage } from '@/registry';
import { ECOSYSTEM_COUNT, COMPONENT_COUNT } from '@/components/docs/docs-stats';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { DocsTable, docsTableHeadClass } from '@/components/docs/DocsTable';
import { cn } from '@/lib/utils';
import { COMPONENT_PREVIEWS } from '@/components/studio/previews';
import { COMPONENT_PRESETS, COLOR_PRESETS, toHexColor } from '@/components/studio/StudioPresets';
import { StudioCanvas } from '@/components/studio/StudioCanvas';
import { StudioInspector } from '@/components/studio/StudioInspector';
import { StudioCodeExport } from '@/components/studio/StudioCodeExport';

const FLAVORS = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

const ECOSYSTEM_SHORT_NAMES: Record<EcosystemFlavor, string> = {
	react: 'React',
	nextjs: 'Next.js 15',
	vue: 'Vue 3',
	svelte: 'Svelte 5',
	angular: 'Angular 18+',
	solid: 'SolidJS',
	astro: 'Astro',
	blade: 'Laravel Blade',
	vanilla: 'Vanilla JS',
	wordpress: 'WordPress',
	webcomponent: 'Web Components',
	'react-native': 'React Native',
	flutter: 'Flutter',
};

const ECOSYSTEM_EXTENSIONS: Record<EcosystemFlavor, string> = {
	react: '.tsx',
	nextjs: 'App Router',
	vue: '.vue',
	svelte: '.svelte',
	angular: 'Standalone',
	solid: '.tsx',
	astro: '.astro',
	blade: '.blade.php',
	vanilla: 'ESM / CSS',
	wordpress: 'Gutenberg',
	webcomponent: 'Custom Element',
	'react-native': 'Expo / TSX',
	flutter: 'Dart',
};

const ECOSYSTEM_GROUPS: { label: string; flavors: EcosystemFlavor[] }[] = [
	{
		label: 'Web & Full-Stack',
		flavors: ['nextjs', 'react', 'vue', 'svelte', 'angular', 'solid', 'astro'],
	},
	{
		label: 'Backend & CMS',
		flavors: ['blade', 'wordpress'],
	},
	{
		label: 'Universal Standards',
		flavors: ['webcomponent', 'vanilla'],
	},
	{
		label: 'Mobile & Native',
		flavors: ['react-native', 'flutter'],
	},
];

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

const PKG_MANAGERS: { id: PackageManager; label: string; prefix: string }[] = [
	{ id: 'pnpm', label: 'pnpm', prefix: 'pnpm dlx' },
	{ id: 'npm', label: 'npm', prefix: 'npx' },
	{ id: 'bun', label: 'bun', prefix: 'bunx --bun' },
	{ id: 'yarn', label: 'yarn', prefix: 'yarn dlx' },
];

interface ComponentDocViewProps {
	slug: string;
}

export function ComponentDocView({ slug }: ComponentDocViewProps) {
	const component = COMPONENT_REGISTRY[slug] || ALL_COMPONENTS[0];

	const [selectedFlavor, setSelectedFlavor] = React.useState<EcosystemFlavor>('react');
	const [selectedFileIdx, setSelectedFileIdx] = React.useState(0);
	const [codeMode, setCodeMode] = React.useState<'clean' | 'ejected'>('clean');
	const [copiedCli, setCopiedCli] = React.useState(false);
	const [copiedUsage, setCopiedUsage] = React.useState(false);
	const [copiedSource, setCopiedSource] = React.useState(false);
	const [pkgManager, setPkgManager] = React.useState<PackageManager>('pnpm');

	// Studio Viewport & Canvas Controls
	const [viewportMode, setViewportMode] = React.useState<'fluid' | 'tablet' | 'mobile'>('fluid');
	const [zoomScale, setZoomScale] = React.useState<number>(100);
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
	const [cardSwipeResetKey, setCardSwipeResetKey] = React.useState<number>(0);
	const [dockIconSet, setDockIconSet] = React.useState<'app' | 'social'>('app');
	const [tickerResetKey, setTickerResetKey] = React.useState<number>(0);

	// Presets
	const presets = COMPONENT_PRESETS[component.slug] || {};
	const getInitialPreset = (slug: string) => {
		const keys = Object.keys(COMPONENT_PRESETS[slug] || {});
		return keys.includes('Default') ? 'Default' : keys[0] || 'Default';
	};
	const [activePreset, setActivePreset] = React.useState<string>(() => getInitialPreset(component.slug));

	// Dynamic prop values state, initialized with component.defaultProps
	const [propValues, setPropValues] = React.useState<Record<string, unknown>>({
		...component.defaultProps,
	});

	// Synchronize propValues when component changes
	React.useEffect(() => {
		setPropValues({ ...component.defaultProps });
		setActivePreset(getInitialPreset(component.slug));
		setDockIconSet('app');
	}, [component]);

	// Sticky dock elevation observer with exact header clearance offset (Big-Ω rAF batching)
	const stickyDockRef = React.useRef<HTMLDivElement>(null);
	const [isDockSticky, setIsDockSticky] = React.useState(false);

	React.useEffect(() => {
		const dock = stickyDockRef.current;
		if (!dock) return;

		let rafId: number | null = null;

		// Calculate sticky position dynamically based on current header offset with zero layout thrashing
		const checkSticky = () => {
			if (rafId !== null) return;
			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (!dock) return;
				const dockTop = dock.getBoundingClientRect().top;
				const root = document.documentElement;
				const rootFontSize = parseFloat(getComputedStyle(root).fontSize) || 16;
				const rawHeaderHeight = getComputedStyle(root).getPropertyValue('--header-height').trim();
				const headerRem = parseFloat(rawHeaderHeight) || 5.4375;
				const isMobile = window.innerWidth < 1024;
				// Match CSS top offsets: top-header-mobile-gap (header + 3.75rem) vs lg:top-header-gap (header + 0.75rem)
				const gapRem = isMobile ? 3.75 : 0.75;
				const targetTopPx = (headerRem + gapRem) * rootFontSize;

				// If dock has reached or stuck at its target top position (within 1.5px tolerance)
				const isStuck = dockTop <= targetTopPx + 1.5;
				setIsDockSticky((prev) => (prev !== isStuck ? isStuck : prev));
			});
		};

		checkSticky();
		window.addEventListener('scroll', checkSticky, { passive: true });
		window.addEventListener('resize', checkSticky, { passive: true });

		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', checkSticky);
			window.removeEventListener('resize', checkSticky);
		};
	}, []);

	// Scroll refs for container-based kinetic components
	const stackingScrollRef = React.useRef<HTMLDivElement>(null);
	const horizontalScrollRef = React.useRef<HTMLDivElement>(null);

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

	const handlePropChange = (propName: string, value: unknown) => {
		setPropValues((prev) => ({
			...prev,
			[propName]: value,
		}));
		setActivePreset('Custom');
	};

	const resetProps = () => {
		setPropValues({ ...component.defaultProps });
		setActivePreset(getInitialPreset(component.slug));
		setDockIconSet('app');
	};

	// 1. Synthesize Usage Example snippet for consumer application
	const usageFile = React.useMemo(() => {
		return generateComponentUsage(component, selectedFlavor, propValues);
	}, [component, selectedFlavor, propValues]);

	// 2. Synthesize internal Component Source files (Clean vs Ejected Engine)
	const cleanFiles = React.useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: false });
	}, [component, selectedFlavor, propValues]);

	const ejectedFiles = React.useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: true });
	}, [component, selectedFlavor, propValues]);

	const hasEjectedDifference = React.useMemo(() => {
		if (cleanFiles.length !== ejectedFiles.length) return true;
		return cleanFiles.some((cf, i) => {
			const ef = ejectedFiles[i];
			return !ef || cf.code !== ef.code || cf.filename !== ef.filename;
		});
	}, [cleanFiles, ejectedFiles]);

	const generatedFiles = hasEjectedDifference && codeMode === 'ejected' ? ejectedFiles : cleanFiles;

	const activeSourceFile = generatedFiles[selectedFileIdx] || generatedFiles[0] || { filename: 'component.tsx', code: '' };

	const activePkg = React.useMemo(() => PKG_MANAGERS.find((p) => p.id === pkgManager) || PKG_MANAGERS[0], [pkgManager]);

	const cliCommand = `${activePkg.prefix} exhuma add ${component.slug} --flavor=${selectedFlavor}`;

	const copyCli = async () => {
		try {
			await navigator.clipboard.writeText(cliCommand);
			setCopiedCli(true);
			setTimeout(() => setCopiedCli(false), 2000);
		} catch {
			setCopiedCli(false);
		}
	};

	const copyUsageCode = async () => {
		try {
			await navigator.clipboard.writeText(usageFile.code);
			setCopiedUsage(true);
			setTimeout(() => setCopiedUsage(false), 2000);
		} catch {
			setCopiedUsage(false);
		}
	};

	const downloadUsageFile = () => {
		const blob = new Blob([usageFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = usageFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const copySourceCode = async () => {
		try {
			await navigator.clipboard.writeText(activeSourceFile.code);
			setCopiedSource(true);
			setTimeout(() => setCopiedSource(false), 2000);
		} catch {
			setCopiedSource(false);
		}
	};

	const downloadSourceFile = () => {
		const blob = new Blob([activeSourceFile.code], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = activeSourceFile.filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const getCodeLanguage = (filename: string) => {
		if (filename.endsWith('.dart')) return 'dart';
		if (filename.endsWith('.php')) return 'php';
		if (filename.endsWith('.vue')) return 'vue';
		if (filename.endsWith('.svelte')) return 'svelte';
		if (filename.endsWith('.astro')) return 'astro';
		if (filename.endsWith('.json')) return 'json';
		if (filename.endsWith('.css')) return 'css';
		if (filename.endsWith('.html')) return 'html';
		if (filename.endsWith('.js')) return 'js';
		if (filename.endsWith('.ts')) return 'typescript';
		return 'tsx';
	};

	// Render interactive canvas preview with real-time prop tweaking across all canonical components
	// Render interactive canvas preview with real-time prop tweaking across all canonical components
	const renderCanvasPreview = () => {
		const PreviewComponent = COMPONENT_PREVIEWS[component.slug];
		if (!PreviewComponent) return null;
		return (
			<PreviewComponent
				props={propValues}
				viewportMode={viewportMode}
				cardSwipeResetKey={cardSwipeResetKey}
				tickerResetKey={tickerResetKey}
				dockIconSet={dockIconSet}
				setDockIconSet={setDockIconSet}
				activePreset={activePreset}
			/>
		);
	};

	return (
		<div className='space-y-12'>
			{/* Page Header */}
			<DocsPageHeader
				eyebrow={[
					{ label: 'Components', href: '/docs/components' },
					{ label: component.category.charAt(0).toUpperCase() + component.category.slice(1), href: `/docs/components#${component.category}` },
				]}
				title={component.name}
				description={component.description}
			/>

			{/* Sticky Target Environment Chooser Floating Mission Control Bar */}
			<div ref={stickyDockRef} className='top-header-mobile-gap lg:top-header-gap sticky z-30 mb-5! transition-all duration-300'>
				<div
					className={cn(
						'relative flex flex-col gap-2.5 overflow-hidden rounded-2xl transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-3',
						isDockSticky
							? 'border-primary/25 shadow-sticky-dock ring-primary/10 bg-card/60 supports-[backdrop-filter]:bg-background/60 scale-[1.01] border-2 p-2.5 shadow-xl ring-2 backdrop-blur-sm sm:p-3'
							: 'border-border/60 bg-muted/20 hover:border-border/80 border p-2.5 backdrop-blur-xs sm:p-3'
					)}
				>
					{/* Active laser accent beam across top edge: only appears when sticky */}
					{isDockSticky && <div className='via-primary/25 absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent to-transparent' />}
					{isDockSticky && <div className='via-primary/25 absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent to-transparent' />}

					{/* Left: Icon & Label */}
					<div className='flex min-w-0 items-center justify-between gap-2.5 sm:justify-start sm:gap-3'>
						<div className='flex min-w-0 items-center gap-2.5 sm:gap-3'>
							<div
								className={cn(
									'flex shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
									isDockSticky
										? 'border-primary/50 bg-primary text-primary-foreground h-7.5 w-7.5 shadow-sm sm:h-8 sm:w-8'
										: 'border-border/70 bg-background/60 text-muted-foreground h-7 w-7 sm:h-7.5 sm:w-7.5'
								)}
							>
								<Cpu className='h-3.5 w-3.5' />
							</div>
							<div className='flex min-w-0 flex-col gap-0.5'>
								<div className='flex items-center gap-2'>
									<span className={cn('text-xs font-semibold tracking-tight whitespace-nowrap transition-colors sm:text-sm', isDockSticky ? 'text-foreground font-bold' : 'text-foreground/90')}>
										Target Environment
									</span>
									{isDockSticky && (
										<div className='flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 shadow-xs'>
											<span className='relative flex h-1.5 w-1.5'>
												<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75' />
												<span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500' />
											</span>
											<span className='text-3xs font-mono font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400'>Pinned</span>
										</div>
									)}
								</div>
								{isDockSticky && <span className='text-muted-foreground text-3xs hidden font-mono md:inline-block'>Adapts interactive workbench, props contract & CLI commands below</span>}
							</div>
						</div>
					</div>

					{/* Right: Select Trigger */}
					<div className='flex w-full items-center gap-2 sm:w-auto sm:shrink-0'>
						<Select
							value={selectedFlavor}
							onValueChange={(val) => {
								setSelectedFlavor(val as EcosystemFlavor);
								setSelectedFileIdx(0);
							}}
						>
							<SelectTrigger
								className={cn(
									'h-9 w-full cursor-pointer rounded-xl px-3 font-mono text-xs transition-all sm:h-9.5 sm:w-44',
									isDockSticky
										? 'border-primary/60 bg-background/95 hover:bg-background hover:border-primary focus:ring-primary/30 shadow-md focus:ring-2'
										: 'border-border/70 bg-background/80 hover:bg-background hover:border-foreground/30 focus:ring-foreground/10 shadow-2xs focus:ring-1'
								)}
							>
								<div className='flex w-full items-center justify-between gap-2 truncate'>
									<div className='flex items-center gap-2 truncate'>
										<span className='text-foreground text-xs font-bold sm:text-sm'>{ECOSYSTEM_SHORT_NAMES[selectedFlavor]}</span>
										<span className='border-border/80 bg-muted/80 text-muted-foreground text-3xs hidden rounded-sm px-1.5 py-0.5 font-mono sm:inline'>{ECOSYSTEM_EXTENSIONS[selectedFlavor]}</span>
									</div>
									<span
										className={cn(
											'text-3xs shrink-0 rounded-sm px-1.5 py-0.5 font-mono font-bold tracking-wider uppercase sm:hidden',
											isDockSticky ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
										)}
									>
										Switch
									</span>
								</div>
							</SelectTrigger>
							<SelectContent className='max-h-96 min-w-64 sm:min-w-68'>
								{ECOSYSTEM_GROUPS.map((group, groupIdx) => (
									<React.Fragment key={group.label}>
										{groupIdx > 0 && <SelectSeparator />}
										<SelectGroup>
											<SelectLabel className='text-3xs text-muted-foreground/80 font-mono tracking-wider'>{group.label}</SelectLabel>
											{group.flavors.map((flavor) => (
												<SelectItem key={flavor} value={flavor} className='cursor-pointer py-2 font-mono text-xs'>
													<div className='flex w-full items-center justify-between gap-3'>
														<span className='font-semibold'>{ECOSYSTEM_LABELS[flavor]}</span>
														<span className='text-3xs text-muted-foreground/70 bg-muted rounded-sm px-1.5 py-0.5 font-mono'>{ECOSYSTEM_EXTENSIONS[flavor]}</span>
													</div>
												</SelectItem>
											))}
										</SelectGroup>
									</React.Fragment>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* CLI Quick Install Command Bar */}
			<div className='border-border/80 bg-card/85 relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3.5 shadow-xs backdrop-blur-xl transition-all sm:p-4'>
				{/* Top hairline highlight & registration marks */}
				<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-1.5 left-2 font-mono select-none'>+</div>
				<div className='text-foreground/20 text-4xs pointer-events-none absolute top-1.5 right-2 font-mono select-none'>+</div>

				{/* Header Row: Terminal Identity & Package Manager Switcher */}
				<div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex items-center gap-2'>
						{/* macOS Terminal window dots */}
						<div className='flex items-center gap-1.5 pr-1'>
							<div className='h-2.5 w-2.5 rounded-full bg-red-500/70' />
							<div className='h-2.5 w-2.5 rounded-full bg-amber-500/70' />
							<div className='h-2.5 w-2.5 rounded-full bg-emerald-500/70' />
						</div>
						<span className='text-foreground font-mono text-xs font-bold tracking-tight'>CLI Installation</span>
						<Badge variant='outline' className='text-3xs border-emerald-500/30 bg-emerald-500/10 font-mono font-medium text-emerald-600 dark:text-emerald-400'>
							{ECOSYSTEM_SHORT_NAMES[selectedFlavor]}
						</Badge>
					</div>

					{/* Package Manager Selector: pnpm, npm, bun, yarn */}
					<div className='border-border/60 bg-muted/50 flex w-full items-center gap-1 rounded-lg border p-0.5 sm:w-auto'>
						{PKG_MANAGERS.map((pm) => {
							const isSelected = pkgManager === pm.id;
							return (
								<button
									key={pm.id}
									type='button'
									onClick={() => setPkgManager(pm.id)}
									className={cn(
										'text-2xs flex-1 cursor-pointer rounded-md px-2.5 py-1 text-center font-mono font-semibold transition-all sm:flex-none sm:px-2 sm:py-0.5',
										isSelected ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{pm.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Terminal Viewport Row */}
				<div className='flex flex-col gap-2.5 sm:flex-row sm:items-center'>
					<div
						onClick={copyCli}
						title='Click to copy install command'
						className='group/cli border-muted-foreground/50! dark:border-border! relative flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl border bg-zinc-950/90 px-3.5 py-2.5 shadow-inner transition-colors hover:border-zinc-600 dark:bg-black/90'
					>
						<Terminal className='h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover/cli:text-emerald-400' />
						<div className='no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto font-mono text-xs whitespace-nowrap select-all'>
							<span className='font-bold text-emerald-400 select-none'>$</span>
							<span className='font-semibold text-sky-400'>{activePkg.prefix}</span>
							<span className='font-bold text-zinc-100'>exhuma</span>
							<span className='text-zinc-400'>add</span>
							<span className='font-bold text-amber-400'>{component.slug}</span>
							<span className='inline-flex items-center'>
								<span className='text-zinc-500'>--flavor=</span>
								<span className='font-bold text-emerald-400 underline decoration-emerald-500/40 decoration-dotted'>{selectedFlavor}</span>
							</span>
						</div>
					</div>

					<Button
						variant='default'
						size='sm'
						onClick={copyCli}
						className={cn(
							'h-9.5 shrink-0 cursor-pointer gap-1.5 rounded-xl px-4 font-mono text-xs font-semibold shadow-xs transition-all max-sm:w-full max-sm:justify-center',
							copiedCli ? 'bg-emerald-600 text-white hover:bg-emerald-600 dark:bg-emerald-500 dark:text-white' : 'bg-foreground text-background hover:bg-foreground/90'
						)}
					>
						{copiedCli ? (
							<>
								<Check className='h-3.5 w-3.5' />
								<span>Copied!</span>
							</>
						) : (
							<>
								<Copy className='h-3.5 w-3.5' />
								<span>Copy Command</span>
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Studio Workbench Interactive Specification Section */}
			<DocsSection id='interactive-stage' index={1} label='Workbench' title='Interactive Specification & Studio' reveal={false}>
				<div className='w-full space-y-6'>
					{/* 1. Studio Stage Header Toolbar */}
					<div className='border-border/80 bg-card/75 relative flex flex-col flex-wrap justify-between gap-3 overflow-hidden rounded-2xl border p-3.5 shadow-xs backdrop-blur-md transition-colors sm:flex-row sm:items-center'>
						<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />

						{/* Left: Component Category & Presets Selector */}
						<div className='flex max-w-full min-w-0 flex-wrap items-center gap-2 sm:gap-3'>
							<Badge variant='outline' className='text-3xs bg-background/90 text-foreground shrink-0 font-mono font-bold tracking-wider uppercase'>
								{component.category}
							</Badge>

							{Object.keys(presets).length > 0 && (
								<div className='flex max-w-full min-w-0 items-center gap-2'>
									<span className='text-muted-foreground text-3xs hidden font-mono font-semibold uppercase sm:inline'>Preset:</span>
									<div className='border-border/70 bg-background/80 no-scrollbar flex max-w-full min-w-0 items-center gap-1 overflow-x-auto rounded-lg border p-0.5 whitespace-nowrap'>
										{Object.keys(presets).map((pName) => (
											<button
												key={pName}
												type='button'
												onClick={() => applyPreset(pName)}
												className={cn(
													'shrink-0 cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-all',
													activePreset === pName ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
												)}
											>
												{pName}
											</button>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Right: Stage Zoom & Expand/Collapse Split */}
						<div className='flex items-center gap-2 font-mono text-xs'>
							<div className='border-border/70 bg-background/80 flex items-center gap-1 rounded-lg border p-0.5'>
								<button
									type='button'
									onClick={() => setZoomScale((z) => Math.max(50, z - 25))}
									className='hover:bg-accent hover:text-foreground text-muted-foreground cursor-pointer rounded-sm p-1'
									title='Zoom Out'
								>
									<ZoomOut className='h-3.5 w-3.5' />
								</button>
								<button
									type='button'
									onClick={() => setZoomScale(100)}
									className='hover:text-foreground text-3xs text-muted-foreground w-9 cursor-pointer text-center transition-colors'
									title='Reset zoom to 100%'
								>
									{zoomScale}%
								</button>
								<button
									type='button'
									onClick={() => setZoomScale((z) => Math.min(150, z + 25))}
									className='hover:bg-accent hover:text-foreground text-muted-foreground cursor-pointer rounded-sm p-1'
									title='Zoom In'
								>
									<ZoomIn className='h-3.5 w-3.5' />
								</button>
							</div>

							<Button
								variant='outline'
								size='sm'
								onClick={() => setIsExpanded(!isExpanded)}
								className='border-border/80 hover:border-foreground/40 hidden h-7 cursor-pointer gap-1.5 font-mono text-xs xl:inline-flex'
								title={isExpanded ? 'Restore side-by-side view' : 'Expand stage to full width'}
							>
								{isExpanded ? <Minimize className='h-3.5 w-3.5' /> : <Maximize className='h-3.5 w-3.5' />}
								<span>{isExpanded ? 'Split View' : 'Full Width'}</span>
							</Button>
						</div>
					</div>

					{/* 2. Responsive Stage & Parameter Inspector Grid */}
					<div className='grid grid-cols-1 items-start gap-6 xl:grid-cols-12'>
						<StudioCanvas viewportMode={viewportMode} setViewportMode={setViewportMode} zoomScale={zoomScale} setZoomScale={setZoomScale} isExpanded={isExpanded}>
							{renderCanvasPreview()}
						</StudioCanvas>

						<StudioInspector props={component.props} propValues={propValues} onPropChange={handlePropChange} onReset={resetProps} isExpanded={isExpanded} />
					</div>
				</div>
			</DocsSection>

			{/* 2. Quick Start & Usage Example Section */}
			<DocsSection
				id='usage-example'
				index={2}
				label='Usage'
				title='Quick Start & Consumer Example'
				description={`Copy-paste ready implementation for ${ECOSYSTEM_LABELS[selectedFlavor]}. Automatically updates when you modify parameters in the Workbench above.`}
			>
				<div className='border-border/80 bg-card/75 relative overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl'>
					<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
					<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

					{/* File Header Bar */}
					<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5'>
						<div className='flex items-center gap-2'>
							<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>{usageFile.filename}</span>
							<Badge variant='outline' className='text-3xs font-mono'>
								{ECOSYSTEM_LABELS[selectedFlavor]}
							</Badge>
						</div>

						<div className='flex items-center gap-1.5'>
							<TooltipProvider delayDuration={150}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={downloadUsageFile}
											className='border-border/80 hover:border-foreground/40 h-8 w-8 cursor-pointer'
											aria-label={`Download ${usageFile.filename}`}
										>
											<Download className='h-3.5 w-3.5 shrink-0' />
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>Download {usageFile.filename}</TooltipContent>
								</Tooltip>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											onClick={copyUsageCode}
											className='border-border/80 hover:border-foreground/40 h-8 cursor-pointer gap-1.5 font-mono text-xs'
											aria-label='Copy usage code'
										>
											{copiedUsage ? (
												<>
													<Check className='h-3.5 w-3.5 text-emerald-500' />
													<span className='font-semibold text-emerald-600 dark:text-emerald-400'>Copied!</span>
												</>
											) : (
												<>
													<Copy className='h-3.5 w-3.5' />
													<span>Copy Code</span>
												</>
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>{copiedUsage ? 'Copied to clipboard' : 'Copy code snippet'}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* Code Preview */}
					<div className='bg-muted/10 p-3 sm:p-4'>
						<CodeBlock code={usageFile.code} filename={usageFile.filename} language={getCodeLanguage(usageFile.filename)} showHeader={false} className='border-0 bg-transparent shadow-none' />
					</div>
				</div>
			</DocsSection>

			{/* 3. API Contract: Focused Props & Configuration Section */}
			<DocsSection
				id='props-api'
				index={3}
				label='API Contract'
				title='Props & Configuration'
				description={`Exhaustive parameter contract for ${component.name}. Validated in the live Studio workbench above and statically checked across all ${ECOSYSTEM_COUNT} ecosystem templates.`}
			>
				{/* Desktop View: Dense Data Table */}
				<div className='hidden md:block'>
					<DocsTable label={`${component.name} props`}>
						<thead className={docsTableHeadClass}>
							<tr>
								<th className='px-4 py-3 font-mono'>Prop</th>
								<th className='px-4 py-3 font-mono'>Type</th>
								<th className='px-4 py-3 font-mono'>Default</th>
								<th className='px-4 py-3 font-mono'>Description</th>
							</tr>
						</thead>
						<tbody className='divide-border divide-y'>
							{component.props.map((p) => {
								const isCustom = propValues[p.name] !== undefined && propValues[p.name] !== p.defaultValue;
								return (
									<tr key={p.name} className='hover:bg-muted/30 transition-colors'>
										<td className='text-foreground px-4 py-3 font-mono font-bold whitespace-nowrap'>
											<div className='flex items-center gap-2'>
												<span>{p.name}</span>
												{isCustom && <span className='bg-foreground/10 text-foreground text-4xs rounded-sm px-1.5 py-0.5 font-mono uppercase'>live</span>}
											</div>
										</td>
										<td className='px-4 py-3 font-mono'>
											<span
												className={cn(
													'text-3xs rounded-md border px-2 py-0.5 font-mono font-semibold',
													p.type === 'number'
														? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
														: p.type === 'boolean'
															? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
															: p.type === 'string'
																? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
																: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
												)}
											>
												{p.type}
											</span>
										</td>
										<td className='text-foreground px-4 py-3 font-mono font-semibold'>
											<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono'>
												{p.defaultValue !== undefined && p.defaultValue !== null && p.defaultValue !== '' ? String(p.defaultValue) : '—'}
											</span>
										</td>
										<td className='text-muted-foreground px-4 py-3 font-mono text-xs leading-relaxed'>{p.description || 'Configures dynamic calculation parameters.'}</td>
									</tr>
								);
							})}
						</tbody>
					</DocsTable>
				</div>

				{/* Mobile View: Dedicated Parameter Cards (Zero Horizontal Overflow) */}
				<div className='space-y-3 md:hidden'>
					{component.props.map((p) => {
						const isCustom = propValues[p.name] !== undefined && propValues[p.name] !== p.defaultValue;
						return (
							<div key={p.name} className='border-border/80 bg-card/80 space-y-2 rounded-xl border p-3.5 shadow-xs'>
								<div className='flex items-center justify-between gap-2'>
									<div className='flex items-center gap-1.5'>
										<span className='text-foreground font-mono text-xs font-bold'>{p.name}</span>
										{isCustom && <span className='bg-foreground/10 text-foreground text-4xs rounded-sm px-1.5 py-0.5 font-mono uppercase'>live</span>}
									</div>
									<span
										className={cn(
											'text-3xs rounded-md border px-2 py-0.5 font-mono font-semibold',
											p.type === 'number'
												? 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
												: p.type === 'boolean'
													? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
													: p.type === 'string'
														? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
														: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
										)}
									>
										{p.type}
									</span>
								</div>
								<p className='text-muted-foreground text-2xs font-mono leading-relaxed'>{p.description || 'Configures dynamic calculation parameters.'}</p>
								<div className='border-border/60 text-muted-foreground text-2xs flex items-center justify-between border-t pt-2 font-mono'>
									<span>Default:</span>
									<span className='kbd border-border bg-background/80 text-foreground text-3xs font-mono font-bold'>
										{p.defaultValue !== undefined && p.defaultValue !== null && p.defaultValue !== '' ? String(p.defaultValue) : '—'}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</DocsSection>

			{/* 4. Component Source Code Section */}
			<DocsSection
				id='source-code'
				index={4}
				label='Source Code'
				title='Component Source'
				description={`Component source definition for ${ECOSYSTEM_LABELS[selectedFlavor]}. ${
					hasEjectedDifference ? 'Toggle between the clean wrapper and the standalone ejected engine micro-kernel.' : 'Direct drop-in implementation for your project.'
				}`}
			>
				<StudioCodeExport
					selectedFlavor={selectedFlavor}
					hasEjectedDifference={hasEjectedDifference}
					codeMode={codeMode}
					onCodeModeChange={(mode) => {
						setCodeMode(mode);
						setSelectedFileIdx(0);
					}}
					generatedFiles={generatedFiles}
					selectedFileIdx={selectedFileIdx}
					onSelectFileIdx={setSelectedFileIdx}
					activeSourceFile={activeSourceFile}
					onCopySource={copySourceCode}
					copiedSource={copiedSource}
					onDownloadSource={downloadSourceFile}
					getCodeLanguage={getCodeLanguage}
				/>
			</DocsSection>

			{/* 5. Lifecycle & Performance Guarantees */}
			<DocsSection id='lifecycle-safety' index={5} label='Architecture' title='Lifecycle Safety & Performance' description='Engineered for high-frequency user interactions with zero memory leaks.'>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<DocsSpecCard icon={ShieldCheck} tag='Teardown' title='Deterministic Cleanup'>
						All pointer event listeners, scroll handlers, and resize observers are cleanly destroyed on component unmount, preventing lingering background processes.
					</DocsSpecCard>
					<DocsSpecCard icon={Sparkles} tag='Compositor' title='GPU Compositor Acceleration'>
						Transform and opacity modifications run directly on the GPU compositor thread using <code className='text-foreground font-mono'>will-change: transform</code> without triggering browser layout
						recalculations.
					</DocsSpecCard>
				</div>
			</DocsSection>

			{/* 6. Accessibility Considerations */}
			<DocsSection id='accessibility' index={6} label='a11y' title='Accessibility Considerations' description='Fully compliant with WCAG guidelines and respects user motion preferences.'>
				<DocsSpecCard icon={Accessibility} tag='Motion' title='prefers-reduced-motion Support'>
					When a user has <code className='text-foreground font-mono'>prefers-reduced-motion: reduce</code> enabled in their operating system, Exhuma components automatically disable 3D gyroscope tilt and
					spring animations, rendering static accessible content.
				</DocsSpecCard>
			</DocsSection>
		</div>
	);
}

export default ComponentDocView;
