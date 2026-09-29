import React from 'react';
import { Accordion } from '@exhuma/core';
import { ComponentPreviewProps } from '../types';

export function AccordionPreview(props: ComponentPreviewProps) {
	const propValues = (props.props ?? props) as Record<string, any>;
	const mode = (propValues.mode === 'multiple' ? 'multiple' : 'single') as 'single' | 'multiple';
	const collapsible = propValues.collapsible !== false;
	const gap = Number(propValues.gap ?? 12);
	const duration = Number(propValues.duration ?? 300);
	const showIcon = propValues.showIcon !== false;
	const showNumbers = propValues.showNumbers !== false;
	const bordered = propValues.bordered !== false;
	const shadow = propValues.shadow !== false;

	return (
		<div className='mx-auto w-full max-w-lg p-4'>
			<Accordion.Root
				key={`${mode}-${collapsible}-${gap}-${duration}-${showIcon}-${showNumbers}-${bordered}-${shadow}`}
				mode={mode}
				collapsible={collapsible}
				gap={gap}
				duration={duration}
				showIcon={showIcon}
				showNumbers={showNumbers}
				bordered={bordered}
				shadow={shadow}
				defaultValue='faq-1'
			>
				<Accordion.Item value='faq-1'>
					<Accordion.Trigger>How does Exhuma eliminate animation jank?</Accordion.Trigger>
					<Accordion.Content>Exhuma uses modern CSS Grid 0fr to 1fr interpolation with exact analytical spring differential equations, eliminating layout reflows and DOM thrashing.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value='faq-2'>
					<Accordion.Trigger>Does this require Framer Motion or GSAP?</Accordion.Trigger>
					<Accordion.Content>Zero external dependencies. Every component is 100% handcrafted with pure mathematics and native browser APIs.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value='faq-3'>
					<Accordion.Trigger>Which platforms are supported?</Accordion.Trigger>
					<Accordion.Content>
						All 13 major ecosystems including React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	);
}
