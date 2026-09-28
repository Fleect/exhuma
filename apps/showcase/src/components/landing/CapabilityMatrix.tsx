import * as React from 'react';
import { IconCheck as Check, IconShieldCheck as ShieldCheck, IconFileCode as FileCode, IconStack2 as Layers, IconCpu as Cpu } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

interface EcosystemCapability {
	id: string;
	name: string;
	extension: string;
	reactivity: string;
	hydration: string;
	teardown: string;
	path: string;
}

const CAPABILITIES: EcosystemCapability[] = [
	{
		id: 'react',
		name: 'React 18 / 19',
		extension: '.tsx',
		reactivity: 'Hooks & Refs (useRef)',
		hydration: 'Standard Client Mount',
		teardown: 'useEffect cleanup return',
		path: 'src/components/ui',
	},
	{
		id: 'nextjs',
		name: 'Next.js 15 (App Router)',
		extension: '.tsx',
		reactivity: 'RSC + "use client" Directive',
		hydration: 'Server Hydrated Island',
		teardown: 'useEffect unmount',
		path: 'components/ui',
	},
	{
		id: 'vue',
		name: 'Vue 3 / Nuxt 3',
		extension: '.vue',
		reactivity: 'Composition API (ref, computed)',
		hydration: 'Client Island (<ClientOnly>)',
		teardown: 'onBeforeUnmount lifecycle',
		path: 'components',
	},
	{
		id: 'svelte',
		name: 'Svelte 5',
		extension: '.svelte',
		reactivity: 'Svelte 5 Runes ($state, $effect)',
		hydration: 'Micro-Island Hydration',
		teardown: '$effect destructor return',
		path: 'src/lib/components',
	},
	{
		id: 'angular',
		name: 'Angular 18+',
		extension: '.component.ts',
		reactivity: 'Signals (signal, computed)',
		hydration: 'Standalone Hydration',
		teardown: 'ngOnDestroy lifecycle',
		path: 'src/app/components',
	},
	{
		id: 'solid',
		name: 'SolidJS',
		extension: '.tsx',
		reactivity: 'Fine-grained Signals (createSignal)',
		hydration: 'Reactive Primitive Hydration',
		teardown: 'onCleanup handler',
		path: 'src/components',
	},
	{
		id: 'astro',
		name: 'Astro',
		extension: '.astro',
		reactivity: 'Zero-JS SSR or Client Script',
		hydration: 'Client Directives (client:load)',
		teardown: 'window/DOM event detachment',
		path: 'src/components',
	},
	{
		id: 'blade',
		name: 'Laravel Blade',
		extension: '.blade.php',
		reactivity: 'Alpine.js (x-data) / Vanilla',
		hydration: 'Server-Rendered PHP View',
		teardown: 'DOM observer teardown',
		path: 'resources/views/components',
	},
	{
		id: 'vanilla',
		name: 'Vanilla JS + CSS',
		extension: '.js + .css',
		reactivity: 'Direct DOM MutationObserver',
		hydration: 'Immediate DOM Attachment',
		teardown: 'Explicit instance.destroy()',
		path: 'src/components',
	},
	{
		id: 'wordpress',
		name: 'WordPress Gutenberg',
		extension: 'block.json / edit.tsx',
		reactivity: 'Block Attributes & State',
		hydration: 'Gutenberg Editor / PHP Save',
		teardown: 'Unmount block handler',
		path: 'src/blocks',
	},
	{
		id: 'webcomponent',
		name: 'Web Components',
		extension: '<exhuma-*>.js',
		reactivity: 'Custom Elements v1 + Shadow DOM',
		hydration: 'Custom Element Definition',
		teardown: 'disconnectedCallback()',
		path: 'src/components',
	},
	{
		id: 'react-native',
		name: 'React Native / Expo',
		extension: '.tsx',
		reactivity: 'Animated API / PanResponder',
		hydration: 'Native UI Thread Driver',
		teardown: 'useEffect unmount cleanup',
		path: 'components',
	},
	{
		id: 'flutter',
		name: 'Flutter',
		extension: '.dart',
		reactivity: 'StatefulWidget (setState)',
		hydration: 'Flutter Engine Render Tree',
		teardown: 'dispose() lifecycle method',
		path: 'lib/widgets',
	},
];

export function CapabilityMatrix() {
	return (
		<div className='border-border/80 bg-card/70 hover:border-foreground/30 w-full overflow-hidden rounded-2xl border shadow-xl backdrop-blur-xl transition-colors'>
			<div className='border-border/60 bg-muted/40 border-b p-6'>
				<div className='text-foreground text-3xs mb-1.5 flex items-center gap-2 font-mono font-bold tracking-wider uppercase'>
					<Cpu className='text-foreground/70 h-3.5 w-3.5 shrink-0' />
					<span>Universal Architecture Matrix</span>
				</div>
				<h3 className='text-foreground text-xl font-bold tracking-tight'>The {ECOSYSTEM_COUNT}-Ecosystem Engineering Contract</h3>
				<p className='text-muted-foreground mt-1 max-w-2xl text-xs leading-relaxed'>
					Every Exhuma canonical component is re-authored from fundamental mathematical principles for each target framework. No polyfills, no cross-compilation overhead, no memory leaks.
				</p>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full border-collapse text-left text-xs'>
					<thead>
						<tr className='border-border/60 bg-muted/20 text-muted-foreground text-3xs border-b font-mono'>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>Ecosystem</th>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>File Format</th>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>Reactivity Engine</th>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>Hydration Model</th>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>Memory Teardown</th>
							<th className='px-4 py-3 font-bold tracking-wider uppercase'>Default Destination</th>
						</tr>
					</thead>
					<tbody className='divide-border/60 divide-y'>
						{CAPABILITIES.map((cap) => (
							<tr key={cap.id} className='hover:bg-muted/30 text-2xs font-mono transition-colors'>
								<td className='text-foreground px-4 py-3.5 font-sans font-semibold whitespace-nowrap'>{cap.name}</td>
								<td className='px-4 py-3.5 whitespace-nowrap'>
									<span className='kbd border-border bg-background text-foreground text-3xs font-mono font-bold'>{cap.extension}</span>
								</td>
								<td className='text-muted-foreground px-4 py-3.5 font-sans whitespace-nowrap'>{cap.reactivity}</td>
								<td className='text-muted-foreground px-4 py-3.5 font-sans whitespace-nowrap'>{cap.hydration}</td>
								<td className='px-4 py-3.5 whitespace-nowrap'>
									<div className='text-foreground flex items-center gap-1.5 font-mono font-semibold'>
										<ShieldCheck className='text-foreground/80 h-3.5 w-3.5 shrink-0' />
										<span>{cap.teardown}</span>
									</div>
								</td>
								<td className='text-muted-foreground/80 text-3xs px-4 py-3.5 font-mono whitespace-nowrap'>{cap.path}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default CapabilityMatrix;
