'use client';

import * as React from 'react';
import { IconCopy as Copy, IconCheck as Check, IconDownload as Download } from '@tabler/icons-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ComponentFilePayload, EcosystemFlavor, ECOSYSTEM_LABELS } from '@/registry';
import { cn } from '@/lib/utils';

export interface StudioCodeExportProps {
	selectedFlavor: EcosystemFlavor;
	hasEjectedDifference: boolean;
	codeMode: 'clean' | 'ejected';
	onCodeModeChange: (mode: 'clean' | 'ejected') => void;
	generatedFiles: ComponentFilePayload[];
	selectedFileIdx: number;
	onSelectFileIdx: (idx: number) => void;
	activeSourceFile: ComponentFilePayload;
	onCopySource: () => void;
	copiedSource: boolean;
	onDownloadSource: () => void;
	getCodeLanguage: (filename: string) => string;
}

export function StudioCodeExport({
	selectedFlavor,
	hasEjectedDifference,
	codeMode,
	onCodeModeChange,
	generatedFiles,
	selectedFileIdx,
	onSelectFileIdx,
	activeSourceFile,
	onCopySource,
	copiedSource,
	onDownloadSource,
	getCodeLanguage,
}: StudioCodeExportProps) {
	return (
		<div className='border-border/80 bg-card/75 relative overflow-hidden rounded-2xl border shadow-xs backdrop-blur-xl'>
			<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent' />
			<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
			<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

			{/* File Header Bar */}
			<div className='border-border/70 bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='kbd border-border bg-background/90 text-foreground text-3xs font-mono font-bold uppercase'>{activeSourceFile.filename}</span>

					{/* Clean vs Ejected Mode Switcher - only rendered when there is an actual difference */}
					{hasEjectedDifference && (
						<div className='border-border/70 bg-background/80 flex items-center gap-0.5 rounded-lg border p-0.5'>
							<button
								type='button'
								onClick={() => {
									onCodeModeChange('clean');
									onSelectFileIdx(0);
								}}
								className={cn(
									'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
									codeMode === 'clean' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								Clean
							</button>
							<button
								type='button'
								onClick={() => {
									onCodeModeChange('ejected');
									onSelectFileIdx(0);
								}}
								className={cn(
									'text-2xs cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
									codeMode === 'ejected' ? 'bg-foreground text-background font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
								)}
								title='Standalone zero-dependency code with raw math/physics inlined'
							>
								Ejected Engine
							</button>
						</div>
					)}

					{/* Multi-file Tabs */}
					{generatedFiles.length > 1 && (
						<div className='no-scrollbar flex items-center gap-1 overflow-x-auto'>
							{generatedFiles.map((file, idx) => (
								<button
									key={file.filename}
									type='button'
									onClick={() => onSelectFileIdx(idx)}
									className={cn(
										'text-2xs shrink-0 cursor-pointer rounded-md px-2.5 py-1 font-mono transition-colors',
										selectedFileIdx === idx ? 'bg-muted text-foreground font-bold shadow-xs' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{file.filename}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Action Buttons: Download & Copy */}
				<div className='flex items-center gap-1.5'>
					<TooltipProvider delayDuration={150}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									onClick={onDownloadSource}
									className='border-border/80 hover:border-foreground/40 h-8 w-8 cursor-pointer'
									aria-label={`Download ${activeSourceFile.filename}`}
								>
									<Download className='h-3.5 w-3.5 shrink-0' />
								</Button>
							</TooltipTrigger>
							<TooltipContent side='bottom'>Download {activeSourceFile.filename}</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									onClick={onCopySource}
									className='border-border/80 hover:border-foreground/40 h-8 cursor-pointer gap-1.5 font-mono text-xs'
									aria-label='Copy component code'
								>
									{copiedSource ? (
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
							<TooltipContent side='bottom'>{copiedSource ? 'Copied to clipboard' : 'Copy source code'}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Code Preview */}
			<div className='bg-muted/10 p-3 sm:p-4'>
				<CodeBlock code={activeSourceFile.code} filename={activeSourceFile.filename} language={getCodeLanguage(activeSourceFile.filename)} showHeader={false} className='border-0 bg-transparent shadow-none' />
			</div>
		</div>
	);
}
