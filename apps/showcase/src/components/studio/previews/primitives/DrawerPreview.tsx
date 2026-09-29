import React, { useState } from 'react';
import { Drawer } from '@exhuma/core';

export default function DrawerPreview(props: any) {
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
				{...props}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				className="bg-white text-gray-900 h-[60vh]"
			>
				<div className="p-4 flex flex-col space-y-4">
					<h2 className="text-2xl font-bold">Interactive Drawer</h2>
					<p className="text-gray-600">
						This drawer implements the Exhuma Kinetic Methodology (EKM) with O(1)
						rubber-banding, flick dismiss projection, and zero GC allocation in
						the hot path.
					</p>
					<div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
						Content Area
					</div>
				</div>
			</Drawer>
		</div>
	);
}
