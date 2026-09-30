import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { getDocsSection } from '@/components/docs/docs-nav';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

const HREF = '/docs/ecosystems';

export const metadata: Metadata = {
	title: 'Ecosystem Contracts',
	description: 'How each Exhuma component is re-authored natively for React, Vue, Svelte, Angular, Solid, Astro, Blade, Vanilla JS, WordPress, Web Components, React Native, and Flutter.',
};

const toc = [
	{ id: 'contract-standards', title: 'Universal Engineering Standards' },
	{ id: 'react-nextjs', title: 'React 18/19 & Next.js 15' },
	{ id: 'vue-svelte', title: 'Vue 3 & Svelte 5' },
	{ id: 'angular-solid', title: 'Angular 18+ & SolidJS' },
	{ id: 'astro-blade', title: 'Astro & Laravel Blade' },
	{ id: 'vanilla-webcomponents', title: 'Vanilla JS & Web Components' },
	{ id: 'wordpress', title: 'WordPress Gutenberg Blocks' },
	{ id: 'mobile-native', title: 'React Native & Flutter' },
];

const code = 'text-foreground font-mono';

const STANDARDS = [
	{ title: 'Zero CSS Leakage', body: 'Scoped styles or unique class prefixes prevent collision with host applications.' },
	{ title: 'Teardown Safety', body: 'Every event listener and requestAnimationFrame handle is properly canceled during unmount or destroy.' },
	{ title: 'Idiomatic Reactivity', body: "Uses the framework's first-class state primitives (Runes, Signals, Composition, StatefulWidget)." },
	{ title: 'Zero Runtime Overhead', body: 'No proprietary middleman library. Pure self-contained component source code.' },
];

export default function EcosystemsDocPage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title={`The ${ECOSYSTEM_COUNT} Ecosystem Contracts`}
				description='Exhuma avoids polyfills or cross-compilation abstraction layers. Every canonical component is re-authored from fundamental mathematical models into the native idioms of each target platform.'
				meta={[`${ECOSYSTEM_COUNT} native targets`, 'No polyfills']}
			/>

			<DocsSection id='contract-standards' index={1} label='Standards' title='Universal Engineering Standards'>
				<DocsProse>Every implementation across the {ECOSYSTEM_COUNT} supported ecosystems must satisfy four non-negotiable guarantees:</DocsProse>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
					{STANDARDS.map((standard, i) => (
						<DocsSpecCard key={standard.title} tag={`Guarantee ${String(i + 1).padStart(2, '0')}`} title={standard.title}>
							{standard.body}
						</DocsSpecCard>
					))}
				</div>
			</DocsSection>

			<DocsSection id='react-nextjs' index={2} label='Web' title='React 18/19 & Next.js 15'>
				<DocsProse>
					Next.js components include the <code className={code}>&quot;use client&quot;</code> directive to seamlessly support the React Server Components (RSC) App Router. They utilize{' '}
					<code className={code}>useRef</code> for direct DOM manipulation to maintain 60 FPS animation performance without triggering React re-render cycles.
				</DocsProse>
				<CodeBlock
					code={`'use client';

import React, { useRef, useEffect } from 'react';

export function TiltCard({ children, maxTilt = 20 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Zero-lag pointer listener with proper cleanup
    const node = cardRef.current;
    if (!node) return;
    // ...
    return () => { /* Memory teardown */ };
  }, [maxTilt]);

  return <div ref={cardRef}>{children}</div>;
}`}
					language='tsx'
					filename='TiltCard.tsx'
				/>
			</DocsSection>

			<DocsSection id='vue-svelte' index={3} label='Modern Reactive' title='Vue 3 & Svelte 5'>
				<DocsProse>
					Vue 3 uses the <code className={code}>&lt;script setup lang=&quot;ts&quot;&gt;</code> Composition API with <code className={code}>onBeforeUnmount</code> cleanup. Svelte 5 leverages the newest{' '}
					<strong className='text-foreground'>Runes</strong> system (<code className={code}>$state</code>, <code className={code}>$derived</code>, and <code className={code}>$effect</code>) with destructor
					return cleanup.
				</DocsProse>
				<CodeBlock
					code={`<script lang="ts">
  let { children, maxTilt = 20 } = $props();
  let cardElement: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!cardElement) return;
    // Active pointer math...
    return () => {
      // Svelte 5 rune teardown guarantee
    };
  });
</script>

<div bind:this={cardElement}>
  {@render children?.()}
</div>`}
					language='svelte'
					filename='TiltCard.svelte'
				/>
			</DocsSection>

			<DocsSection id='angular-solid' index={4} label='Enterprise & Performance' title='Angular 18+ & SolidJS'>
				<DocsProse>
					Angular components use <strong className='text-foreground'>Standalone Components</strong> with modern Signals (<code className={code}>input()</code> and <code className={code}>effect()</code>) and{' '}
					<code className={code}>ngOnDestroy</code> lifecycle safety. SolidJS utilizes fine-grained primitives (<code className={code}>createSignal</code>, <code className={code}>createEffect</code>,{' '}
					<code className={code}>onCleanup</code>).
				</DocsProse>
			</DocsSection>

			<DocsSection id='astro-blade' index={5} label='Server First' title='Astro & Laravel Blade'>
				<DocsProse>
					Astro components render zero runtime client JavaScript by default or mount via client directives. Laravel Blade components output standard PHP component templates integrating with Alpine.js or scoped
					inline JS.
				</DocsProse>
			</DocsSection>

			<DocsSection id='vanilla-webcomponents' index={6} label='Universal Standards' title='Vanilla JS & Web Components'>
				<DocsProse>
					Vanilla JS outputs clean ES modules exposing factory functions (<code className={code}>createTiltCard(element, options)</code>) with an explicit <code className={code}>destroy()</code> method. Web
					Components extend <code className={code}>HTMLElement</code> with Custom Elements v1 and <code className={code}>disconnectedCallback()</code>.
				</DocsProse>
			</DocsSection>

			<DocsSection id='wordpress' index={7} label='CMS' title='WordPress Gutenberg Blocks'>
				<DocsProse>
					Outputs full Gutenberg block definitions: <code className={code}>block.json</code> metadata, React <code className={code}>edit.tsx</code> for the WP Admin editor canvas,{' '}
					<code className={code}>save.tsx</code> for database serialization, and <code className={code}>render.php</code> for server-side dynamic rendering.
				</DocsProse>
			</DocsSection>

			<DocsSection id='mobile-native' index={8} label='Mobile Native' title='React Native & Flutter'>
				<DocsProse>
					React Native components use <code className={code}>Animated</code> with <code className={code}>PanResponder</code> driving the native UI thread. Flutter components output Dart{' '}
					<code className={code}>StatefulWidget</code> classes calculating 3D perspective transforms with <code className={code}>Matrix4</code> and <code className={code}>Transform</code>.
				</DocsProse>
			</DocsSection>
		</DocsPage>
	);
}
