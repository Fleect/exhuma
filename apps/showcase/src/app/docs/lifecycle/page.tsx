import React from 'react';
import type { Metadata } from 'next';
import { IconShieldCheck as ShieldCheck, IconActivity as Activity } from '@tabler/icons-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { DocsTable, docsTableHeadClass } from '@/components/docs/DocsTable';
import { getDocsSection } from '@/components/docs/docs-nav';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

const HREF = '/docs/lifecycle';

export const metadata: Metadata = {
	title: 'Lifecycle & Memory Safety',
	description: 'How Exhuma guarantees zero leaked listeners, cancelled animation frames, and disconnected observers on every unmount.',
};

const toc = [
	{ id: 'guarantee', title: 'The Zero-Leak Guarantee' },
	{ id: 'listener-cleanup', title: 'Deterministic Listener Teardown' },
	{ id: 'resize-observers', title: 'ResizeObserver Disconnection' },
	{ id: 'teardown-matrix', title: 'Framework Teardown Matrix' },
];

const code = 'text-foreground font-mono';

const TEARDOWN_MATRIX = [
	{ fw: 'React 18 / 19', hook: 'useEffect() return () => {}', obs: 'disconnect()' },
	{ fw: 'Next.js 15', hook: 'useEffect() return () => {}', obs: 'disconnect()' },
	{ fw: 'Vue 3 / Nuxt', hook: 'onUnmounted(() => {})', obs: 'disconnect()' },
	{ fw: 'Svelte 5', hook: '$effect(() => { return () => {} })', obs: 'disconnect()' },
	{ fw: 'Angular 18+', hook: 'DestroyRef.onDestroy(() => {})', obs: 'disconnect()' },
	{ fw: 'SolidJS', hook: 'onCleanup(() => {})', obs: 'disconnect()' },
	{ fw: 'Astro', hook: 'disconnectedCallback()', obs: 'disconnect()' },
	{ fw: 'Vanilla JS', hook: 'destroy() instance method', obs: 'disconnect()' },
	{ fw: 'Flutter', hook: '@override void dispose()', obs: '_controller.dispose()' },
];

export default function LifecycleSafetyPage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='Lifecycle & Memory Safety'
				description={`How Exhuma guarantees zero memory leaks, deterministic event listener teardowns, and observer unregistrations across all ${ECOSYSTEM_COUNT} supported frontend runtimes.`}
				meta={['0 leaked listeners', '0 heap slope']}
			/>

			<DocsSection id='guarantee' index={1} label='Guarantee' title='The Zero-Leak Guarantee'>
				<DocsProse>
					Interactive UI components that calculate spring physics, mouse trajectories, and horizontal scroll snaps continuously register event listeners on <code className={code}>window</code>,{' '}
					<code className={code}>document</code>, or parent containers. In long-running Single Page Applications, failure to unregister these listeners on component unmount causes runaway memory growth.
				</DocsProse>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					<DocsSpecCard icon={ShieldCheck} tag='DOM' title='Detached DOM Prevention'>
						Every listener holds an ephemeral reference. On unmount, all references are nulled to allow browser garbage collection immediately.
					</DocsSpecCard>
					<DocsSpecCard icon={Activity} tag='rAF' title='Animation Frame Cancellation'>
						Active requestAnimationFrame loops are cleanly canceled via <code className={code}>cancelAnimationFrame</code> before component destruction.
					</DocsSpecCard>
				</div>
				<Callout type='important' title='Invariant Specification'>
					A component passes Exhuma certification only if 1,000 rapid route transitions produce exactly 0 leaked listeners and zero memory slope on Chrome V8 heap profiler.
				</Callout>
			</DocsSection>

			<DocsSection id='listener-cleanup' index={2} label='Listeners' title='Deterministic Listener Teardown'>
				<DocsProse>
					In React and Next.js, teardowns are anchored in the return callback of <code className={code}>useEffect</code> with strict AbortController or removeEventListener pairing:
				</DocsProse>
				<CodeBlock
					code={`useEffect(() => {
  const handlePointerMove = (e: MouseEvent) => {
    // 60 FPS transform calculation
  };

  window.addEventListener('mousemove', handlePointerMove, { passive: true });

  // Mandatory Teardown:
  return () => {
    window.removeEventListener('mousemove', handlePointerMove);
  };
}, [maxTilt]);`}
					language='ts'
					filename='React / Next.js Teardown'
				/>
			</DocsSection>

			<DocsSection id='resize-observers' index={3} label='Observers' title='ResizeObserver Disconnection'>
				<DocsProse>Components like CSS Masonry and Auto-Fit Grid monitor container width changes to dynamically recalculate column tracks. We guarantee immediate disconnection:</DocsProse>
				<CodeBlock
					code={`const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    updateColumnCount(entry.contentRect.width);
  }
});

observer.observe(containerRef.current);

// Teardown:
return () => observer.disconnect();`}
					language='ts'
					filename='observer-cleanup.ts'
				/>
			</DocsSection>

			<DocsSection id='teardown-matrix' index={4} label='Matrix' title='Framework Teardown Matrix'>
				<DocsProse>How each target framework contract implements lifecycle safety:</DocsProse>
				<DocsTable label='Framework teardown matrix'>
					<thead className={docsTableHeadClass}>
						<tr>
							<th className='px-4 py-3'>Framework</th>
							<th className='px-4 py-3'>Lifecycle Cleanup Hook</th>
							<th className='px-4 py-3'>Observer Disposal</th>
						</tr>
					</thead>
					<tbody className='divide-border text-2xs divide-y font-mono'>
						{TEARDOWN_MATRIX.map((row) => (
							<tr key={row.fw} className='hover:bg-muted/30 transition-colors'>
								<td className='text-foreground px-4 py-2.5 font-sans font-bold whitespace-nowrap'>{row.fw}</td>
								<td className='text-foreground px-4 py-2.5 whitespace-nowrap'>{row.hook}</td>
								<td className='text-muted-foreground px-4 py-2.5'>{row.obs}</td>
							</tr>
						))}
					</tbody>
				</DocsTable>
			</DocsSection>
		</DocsPage>
	);
}
