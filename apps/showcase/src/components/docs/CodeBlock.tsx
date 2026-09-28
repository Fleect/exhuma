'use client';

import React, { useState, useEffect } from 'react';
import { IconCheck as Check, IconCopy as Copy, IconTerminal2 as Terminal } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { WindowDots } from '@/components/docs/DocsWindow';

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	showHeader?: boolean;
	showCopy?: boolean;
	className?: string;
}

// Global highlight cache to prevent redundant re-renders
const htmlCache = new Map<string, string>();

export function CodeBlock({ code, language = 'tsx', filename, showLineNumbers = true, showHeader = true, showCopy = true, className }: CodeBlockProps) {
	const [copied, setCopied] = useState(false);
	const [highlightedHtml, setHighlightedHtml] = useState<string>(() => {
		const cacheKey = `${language}:${code}`;
		return htmlCache.get(cacheKey) || '';
	});

	useEffect(() => {
		let isMounted = true;
		const cacheKey = `${language}:${code}`;
		if (htmlCache.has(cacheKey)) {
			setHighlightedHtml(htmlCache.get(cacheKey)!);
			return;
		}

		// Dynamically import shiki for client-side rendering
		import('shiki')
			.then(async ({ codeToHtml }) => {
				const supportedLangs = ['tsx', 'ts', 'jsx', 'js', 'vue', 'svelte', 'astro', 'php', 'dart', 'html', 'css', 'json', 'bash', 'sh'];
				const lang = supportedLangs.includes(language.toLowerCase()) ? language.toLowerCase() : 'tsx';

				const html = await codeToHtml(code, {
					lang,
					themes: {
						light: 'github-light-default',
						dark: 'github-dark-default',
					},
				});

				if (isMounted) {
					htmlCache.set(cacheKey, html);
					setHighlightedHtml(html);
				}
			})
			.catch(() => {
				// Fallback to plain text on any bundle limitation
			});

		return () => {
			isMounted = false;
		};
	}, [code, language]);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className={cn('border-border bg-card relative overflow-hidden rounded-xl border font-mono text-xs shadow-sm transition-colors', !showHeader && 'rounded-none border-0 bg-transparent shadow-none', className)}>
			{/* Code Header Bar */}
			{showHeader && (
				<div className='border-border bg-muted/40 flex items-center justify-between border-b px-4 py-2 text-xs'>
					<div className='flex min-w-0 items-center gap-2'>
						<WindowDots />
						{filename ? (
							<span className='text-foreground ml-1.5 truncate font-sans text-xs font-medium tracking-tight'>{filename}</span>
						) : (
							<span className='text-muted-foreground text-2xs ml-1.5 flex items-center gap-1.5'>
								<Terminal className='h-3 w-3 shrink-0' />
								<span>Snippet</span>
							</span>
						)}
					</div>

					<div className='flex shrink-0 items-center gap-2'>
						<span className='kbd text-3xs font-semibold uppercase'>{language}</span>
						{showCopy && (
							<button
								type='button'
								onClick={copyToClipboard}
								className={cn(
									'border-border bg-background text-foreground hover:bg-accent text-2xs flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium transition-all active:scale-95'
								)}
								title='Copy code to clipboard'
							>
								{copied ? (
									<>
										<Check className='h-3.5 w-3.5 text-emerald-500' />
										<span className='font-semibold text-emerald-700 dark:text-emerald-400'>Copied</span>
									</>
								) : (
									<>
										<Copy className='text-muted-foreground h-3.5 w-3.5' />
										<span>Copy</span>
									</>
								)}
							</button>
						)}
					</div>
				</div>
			)}

			{/* Code Content Viewport */}
			<div className='max-h-125 overflow-auto p-4 text-xs leading-relaxed'>
				{highlightedHtml ? (
					<div dangerouslySetInnerHTML={{ __html: highlightedHtml }} className='shiki-container' />
				) : (
					<pre className='text-foreground'>
						<code>{code}</code>
					</pre>
				)}
			</div>
		</div>
	);
}

export default CodeBlock;
