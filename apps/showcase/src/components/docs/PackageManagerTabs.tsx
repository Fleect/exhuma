'use client';

import * as React from 'react';
import { IconCheck as Check, IconCopy as Copy, IconTerminal2 as Terminal } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type PackageManager = 'pnpm dlx' | 'npx' | 'bunx' | 'yarn dlx';

interface PackageManagerTabsProps {
	command?: string;
	className?: string;
}

export function PackageManagerTabs({ command = 'exhuma add tilt-card', className }: PackageManagerTabsProps) {
	const [activeManager, setActiveManager] = React.useState<PackageManager>('pnpm dlx');
	const [copied, setCopied] = React.useState(false);

	const fullCommand = `${activeManager} ${command}`;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(fullCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	const managers: { id: PackageManager; label: string }[] = [
		{ id: 'pnpm dlx', label: 'pnpm' },
		{ id: 'npx', label: 'npm' },
		{ id: 'bunx', label: 'bun' },
		{ id: 'yarn dlx', label: 'yarn' },
	];

	return (
		<div
			className={cn(
				'border-border/80 bg-card/70 hover:border-foreground/40 flex max-w-xl flex-col items-stretch rounded-2xl border p-1.5 shadow-lg shadow-black/5 backdrop-blur-md transition-all sm:flex-row sm:items-center sm:rounded-full',
				className
			)}
		>
			{/* Manager Selector Segment */}
			<div className='bg-muted/50 border-border/40 flex shrink-0 items-center gap-1 rounded-xl border p-1 sm:rounded-full'>
				{managers.map((m) => {
					const isSelected = activeManager === m.id;
					return (
						<button
							key={m.id}
							type='button'
							onClick={() => setActiveManager(m.id)}
							className={cn(
								'cursor-pointer rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-all sm:rounded-full',
								isSelected ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							{m.label}
						</button>
					);
				})}
			</div>

			{/* Command Display with Prompt & Copy */}
			<div className='mt-1 flex flex-1 items-center justify-between overflow-hidden py-1 pr-1 pl-3 font-mono text-xs sm:mt-0 sm:py-0'>
				<div className='text-muted-foreground flex items-center gap-2 truncate select-all'>
					<Terminal className='text-foreground h-3.5 w-3.5 shrink-0' />
					<span className='text-foreground truncate font-medium'>{fullCommand}</span>
				</div>
				<button
					type='button'
					onClick={copyToClipboard}
					className='border-border/80 bg-background text-foreground hover:bg-foreground hover:text-background ml-2 inline-flex h-7.5 w-7.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border shadow-xs transition-all active:scale-95 sm:rounded-full'
					title='Copy command'
				>
					{copied ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='text-muted-foreground h-3.5 w-3.5' />}
				</button>
			</div>
		</div>
	);
}

export default PackageManagerTabs;

export function StepCodeBlock({ code }: { code: string }) {
	const [copied, setCopied] = React.useState(false);

	const copyToClipboard = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className='border-border/80 bg-background/90 text-foreground text-2xs group/code mt-auto flex items-center justify-between gap-2 overflow-hidden rounded-lg border py-1.5 pr-2 pl-3 font-mono shadow-xs backdrop-blur-xs'>
			<div className='no-scrollbar overflow-x-auto whitespace-nowrap select-all'>{code}</div>
			<button
				type='button'
				onClick={copyToClipboard}
				className='border-border/80 bg-muted/60 text-muted-foreground hover:bg-foreground hover:text-background flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-all active:scale-95'
				title='Copy to clipboard'
			>
				{copied ? <Check className='h-3 w-3 text-emerald-500' /> : <Copy className='h-3 w-3' />}
			</button>
		</div>
	);
}
