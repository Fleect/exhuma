import * as React from 'react';
import { ComponentPreviewProps } from '../types';
import { ScratchCard } from '@exhuma/cards';

export default function ScratchCardPreview({ props = {} }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center p-8 w-full h-full min-h-[400px]">
			<ScratchCard
				width={props.width as number ?? 300}
				height={props.height as number ?? 200}
				coverColor={props.coverColor as string}
				brushSize={props.brushSize as number}
				threshold={props.threshold as number}
				className="rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800"
				revealContent={
					<div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
						<h3 className="text-2xl font-bold text-rose-500">50% OFF!</h3>
						<p className="text-sm text-neutral-500 mt-1">Scratch to reveal your reward</p>
					</div>
				}
			/>
		</div>
	);
}
