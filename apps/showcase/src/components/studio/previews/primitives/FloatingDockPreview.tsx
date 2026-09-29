import React from 'react';
import {
	IconTerminal2 as Terminal,
	IconSparkles as Sparkles,
	IconLayoutDashboard,
	IconChartBar,
	IconFolders,
	IconDatabase,
	IconUsers,
	IconSettings,
	IconBrandGithub,
	IconBrandX,
	IconBrandDiscord,
	IconBrandLinkedin,
	IconBrandYoutube,
	IconShare,
} from '@tabler/icons-react';
import { FloatingDock } from '@exhuma/core';
import { cn } from '@/lib/utils';
import { ComponentPreviewProps } from '../types';

export function FloatingDockPreview(props: ComponentPreviewProps & { dockIconSet?: string; setDockIconSet?: (val: string) => void; viewportMode?: string; activePreset?: string }) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const { dockIconSet, setDockIconSet, viewportMode, activePreset } = props;

	const direction = (propValues.direction as any) || 'bottom';
	const baseSize = Number(propValues.baseSize ?? 36);
	const maxMagnification = Number(propValues.maxMagnification ?? 0.75);
	const influenceRadius = Number(propValues.influenceRadius ?? 60);
	const showLabels = propValues.showLabels !== false;
	const panelStyle = (propValues.panelStyle as any) || 'translucent';
	const hapticFeedback = Boolean(propValues.hapticFeedback ?? false);

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
	const isMobile = viewportMode === 'mobile' || activePreset === 'Compact Mobile' || (typeof window !== 'undefined' && window.innerWidth < 640);
	const effectiveAppDockItems = isMobile ? [appDockItems[0], appDockItems[1], appDockItems[2], appDockItems[4], appDockItems[7]] : appDockItems;
	const activeDockItems = isSocial ? socialItems : effectiveAppDockItems;

	return (
		<div className='border-border/60 bg-card/40 relative mx-auto flex h-[440px] w-full max-w-4xl flex-col justify-between overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl select-none sm:h-[480px]'>
			{/* Responsive Application Shell Header */}
			<div className='border-border/50 bg-background/50 z-20 flex h-10 w-full shrink-0 items-center justify-between border-b px-2.5 backdrop-blur-md sm:h-11 sm:px-4'>
				<div className='flex min-w-0 items-center gap-1.5 sm:gap-2.5'>
					<div className='border-primary/30 bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-lg border sm:size-6'>
						<Sparkles className='size-3 sm:size-3.5' />
					</div>
					<span className='text-foreground truncate text-xs font-semibold tracking-tight'>
						{isMobile ? (
							'Dock Studio'
						) : (
							<>
								<span className='hidden sm:inline'>Exhuma </span>Workspace
							</>
						)}
					</span>
				</div>

				<div className='flex shrink-0 items-center gap-1.5 font-mono text-xs sm:gap-2'>
					<div className='border-border/60 bg-muted/40 flex items-center rounded-lg border p-0.5 font-sans'>
						<button
							type='button'
							onClick={() => setDockIconSet?.('app')}
							className={cn(
								'text-3xs cursor-pointer rounded-md px-1.5 py-0.5 font-medium transition-all sm:px-2.5',
								dockIconSet === 'app' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							{isMobile ? (
								'Apps'
							) : (
								<>
									<span className='sm:hidden'>Apps</span>
									<span className='hidden sm:inline'>App Icons</span>
								</>
							)}
						</button>
						<button
							type='button'
							onClick={() => setDockIconSet?.('social')}
							className={cn(
								'text-3xs cursor-pointer rounded-md px-1.5 py-0.5 font-medium transition-all sm:px-2.5',
								dockIconSet === 'social' ? 'bg-background text-foreground font-semibold shadow-2xs' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							{isMobile ? (
								'Social'
							) : (
								<>
									<span className='sm:hidden'>Social</span>
									<span className='hidden sm:inline'>Social Icons</span>
								</>
							)}
						</button>
					</div>
					<span
						className={cn(
							'text-3xs shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400 sm:px-2.5',
							isMobile ? 'hidden' : 'hidden sm:inline-flex'
						)}
					>
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
					hapticFeedback={hapticFeedback}
					items={activeDockItems}
				/>
			</div>
		</div>
	);
}
