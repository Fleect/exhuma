'use client';

import * as React from 'react';
import { IconShare as Share2, IconCheck as Check } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface ArticleShareButtonProps {
	title: string;
}

export function ArticleShareButton({ title }: ArticleShareButtonProps) {
	const [copied, setCopied] = React.useState(false);

	const handleShare = async () => {
		try {
			if (typeof window !== 'undefined' && navigator.clipboard) {
				await navigator.clipboard.writeText(window.location.href);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		} catch {
			// Fallback: silently ignore or retry
		}
	};

	return (
		<Button
			variant='outline'
			size='sm'
			onClick={handleShare}
			className='border-border bg-background text-2xs text-muted-foreground hover:border-foreground/30 hover:bg-muted/40 hover:text-foreground h-8 gap-1.5 rounded-lg px-2.5 font-mono transition-colors'
			aria-label='Share article link'
		>
			{copied ? (
				<>
					<Check className='text-foreground h-3.5 w-3.5' />
					<span className='text-foreground font-medium'>Copied Link</span>
				</>
			) : (
				<>
					<Share2 className='h-3.5 w-3.5' />
					<span>Share</span>
				</>
			)}
		</Button>
	);
}
