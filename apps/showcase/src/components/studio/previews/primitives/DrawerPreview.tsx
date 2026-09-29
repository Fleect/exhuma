import * as React from 'react';
import { useState } from 'react';
import { ComponentPreviewProps } from '../types';
import { Drawer } from '@exhuma/core';

export default function DrawerPreview({ props = {} }: ComponentPreviewProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex w-full h-full min-h-[400px] items-center justify-center">
			<button
				onClick={() => setIsOpen(true)}
				className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg transition-transform active:scale-95"
			>
				Open Drawer
			</button>

			<Drawer
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				backdropOpacity={props.backdropOpacity as number}
				backdropBlur={props.backdropBlur as boolean}
				dismissThreshold={props.dismissThreshold as number}
				className="bg-white text-gray-900 h-[60vh]"
			>
				<div className="p-6 flex flex-col gap-4">
					<h2 className="text-2xl font-bold">Kinetic Drawer</h2>
					<p className="text-gray-500 text-sm leading-relaxed">
						Drag down to dismiss. Flick velocity triggers instant close.
						Rubber-band damping on over-drag. All at 120 Hz via rAF.
					</p>
					<div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
						Content Area
					</div>
				</div>
			</Drawer>
		</div>
	);
}
