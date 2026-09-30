'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard(timeout = 2000) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(
		async (text: string) => {
			if (!navigator?.clipboard) {
				return false;
			}

			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), timeout);
				return true;
			} catch {
				setCopied(false);
				return false;
			}
		},
		[timeout]
	);

	return { copied, copy };
}
