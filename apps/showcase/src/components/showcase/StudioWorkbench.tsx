'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ALL_COMPONENTS, COMPONENT_REGISTRY, EcosystemFlavor, ECOSYSTEM_LABELS, CATEGORIES, UniversalComponent, PropDescriptor, ComponentFilePayload } from '@/registry';
import { ECOSYSTEM_COUNT, COMPONENT_COUNT } from '@/components/docs/docs-stats';
import { CodeBlock } from '@/components/docs/CodeBlock';

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
import { COMPONENT_PREVIEWS } from '@/components/studio/previews';
import { COMPONENT_PRESETS, COLOR_PRESETS, toHexColor } from '@/components/studio/StudioPresets';
import { StudioInspector } from '@/components/studio/StudioInspector';
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
	const [codeMode, setCodeMode] = useState<'clean' | 'ejected'>('clean');
	const [viewportMode, setViewportMode] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
	const [zoomScale, setZoomScale] = useState<number>(100);
	const [copiedCli, setCopiedCli] = useState(false);
	const [canvasGrid, setCanvasGrid] = useState<'dots' | 'dense' | 'clean'>('dots');
	const [cardSwipeResetKey, setCardSwipeResetKey] = useState(0);
	const [tickerResetKey, setTickerResetKey] = useState(0);
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

	// Generate code (Clean vs Standalone Ejected Engine)
	const cleanFiles = useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: false });
	}, [component, selectedFlavor, propValues]);

	const ejectedFiles = useMemo(() => {
		return component.generateCode(selectedFlavor, propValues, { eject: true });
	}, [component, selectedFlavor, propValues]);

	const hasEjectedDifference = useMemo(() => {
		if (cleanFiles.length !== ejectedFiles.length) return true;
		return cleanFiles.some((cf, i) => {
			const ef = ejectedFiles[i];
			return !ef || cf.code !== ef.code || cf.filename !== ef.filename;
		});
	}, [cleanFiles, ejectedFiles]);

	const generatedFiles = hasEjectedDifference && codeMode === 'ejected' ? ejectedFiles : cleanFiles;

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
	// Render interactive canvas preview according to selected component
	const renderCanvasPreview = () => {
		const PreviewComponent = COMPONENT_PREVIEWS[selectedSlug];
		if (!PreviewComponent) return null;
		return (
			<PreviewComponent
				{...propValues}
				props={propValues}
				viewportMode={viewportMode === 'desktop' ? 'fluid' : viewportMode}
				cardSwipeResetKey={cardSwipeResetKey}
				tickerResetKey={tickerResetKey}
				dockIconSet={dockIconSet}
				setDockIconSet={setDockIconSet}
				activePreset={activePreset}
			/>
		);
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
					<div className='flex max-w-full items-center gap-2 overflow-hidden'>
						<span className='text-muted-foreground hidden font-mono text-xs font-medium sm:inline'>Presets:</span>
						<div className='bg-muted/60 border-border no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border p-1 whitespace-nowrap'>
							{Object.keys(presets).map((pName) => (
								<button
									key={pName}
									type='button'
									onClick={() => applyPreset(pName)}
									className={cn(
										'shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-all',
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
								<button
									type='button'
									onClick={() => setZoomScale(100)}
									className='hover:text-foreground text-3xs text-muted-foreground w-9 cursor-pointer text-center font-mono transition-colors'
									title='Reset zoom to 100%'
								>
									{zoomScale}%
								</button>
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
								transformOrigin: 'top center',
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
											const hasRange = propDef.min !== undefined && propDef.max !== undefined;
											const min = propDef.min ?? 0;
											const max = propDef.max ?? 100;
											const step = propDef.step ?? 1;
											const num = Number.isFinite(parsed) ? parsed : min;
											return (
												<div className='flex items-center gap-2 pt-0.5'>
													{hasRange && (
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
													)}
													<input
														type='number'
														min={propDef.min}
														max={propDef.max}
														step={propDef.step}
														value={Number.isFinite(parsed) ? parsed : ''}
														onChange={(e) => {
															const parsedVal = parseFloat(e.target.value);
															handlePropChange(propDef.name, Number.isFinite(parsedVal) ? parsedVal : 0);
														}}
														className={cn('border-input bg-background text-foreground text-3xs rounded-sm border px-1 py-0.5 text-right font-mono', hasRange ? 'w-12' : 'w-full')}
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
						{hasEjectedDifference && (
							<div className='border-border/80 bg-background/80 flex items-center rounded-lg border p-0.5 shadow-2xs'>
								<button
									type='button'
									onClick={() => {
										setCodeMode('clean');
										setSelectedFileIdx(0);
									}}
									className={cn(
										'text-3xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
										codeMode === 'clean' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
									title='Clean Shadcn-style wrapper'
								>
									Clean
								</button>
								<button
									type='button'
									onClick={() => {
										setCodeMode('ejected');
										setSelectedFileIdx(0);
									}}
									className={cn(
										'text-3xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
										codeMode === 'ejected' ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
									title='Standalone zero-dependency code with raw math/physics inlined'
								>
									Ejected Engine
								</button>
							</div>
						)}
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
