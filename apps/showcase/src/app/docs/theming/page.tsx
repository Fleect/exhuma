import React from 'react';
import type { Metadata } from 'next';
import { IconSun as Sun, IconMoon as Moon, IconDeviceLaptop as Laptop } from '@tabler/icons-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { getDocsSection } from '@/components/docs/docs-nav';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

const HREF = '/docs/theming';

export const metadata: Metadata = {
	title: 'Theming & Dark Mode',
	description: 'How Exhuma components inherit light, dark, and system themes through semantic CSS variables and Tailwind CSS v4 tokens.',
};

const toc = [
	{ id: 'dual-engine', title: 'Dual-Theme Architecture' },
	{ id: 'css-variables', title: 'Semantic CSS Variables' },
	{ id: 'tailwind-v4', title: 'Tailwind CSS v4 Integration' },
	{ id: 'next-themes', title: 'NextThemes Hydration Setup' },
	{ id: 'palette-customization', title: 'Customizing Theme Palettes' },
];

const code = 'text-foreground font-mono';

export default function ThemingPage() {
	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='Theming & Dark Mode'
				description='Exhuma features an unopinionated, high-contrast dual-theme engine built on semantic CSS variables and Tailwind CSS v4 design tokens.'
				meta={['Light · Dark · System', 'HSL tokens']}
			/>

			<DocsSection id='dual-engine' index={1} label='Themes' title='Dual-Theme Architecture'>
				<DocsProse>
					Every component in Exhuma automatically respects your application&apos;s current theme state. We avoid hardcoded hex codes like <code className={code}>#000000</code> or{' '}
					<code className={code}>#ffffff</code>, instead linking all backgrounds, borders, typography, and accents to CSS variables declared in HSL.
				</DocsProse>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
					<DocsSpecCard icon={Sun} tag='Light' title='Light Theme'>
						Optimized for crisp readability in high-ambient lighting with gentle contrast borders.
					</DocsSpecCard>
					<DocsSpecCard icon={Moon} tag='Dark' title='Dark Theme'>
						OLED-tuned true blacks and deep neutral slates matching Raycast and shadcn/ui.
					</DocsSpecCard>
					<DocsSpecCard icon={Laptop} tag='System' title='System Sync'>
						Automatic synchronization with operating system dark mode preferences with zero layout flash.
					</DocsSpecCard>
				</div>
				<Callout type='tip' title='Global Keyboard Shortcut'>
					You can cycle themes instantly anywhere on this documentation site by pressing <kbd className='kbd border-border bg-card/80 text-foreground text-3xs font-mono font-bold'>⌘⌥T</kbd> (or Alt+T on
					Windows/Linux).
				</Callout>
			</DocsSection>

			<DocsSection id='css-variables' index={2} label='Tokens' title='Semantic CSS Variables'>
				<DocsProse>
					Themes are declared in <code className={code}>src/styles/themes.scss</code>:
				</DocsProse>
				<CodeBlock
					code={`:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 9%;
  --radius: 0.75rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 4.8%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 4.8%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}`}
					language='css'
					filename='themes.scss'
				/>
			</DocsSection>

			<DocsSection id='tailwind-v4' index={3} label='Tailwind v4' title='Tailwind CSS v4 Integration'>
				<DocsProse>
					In Tailwind CSS v4, tokens are declared directly using the <code className={code}>@theme</code> directive without needing a legacy <code className={code}>tailwind.config.js</code> file:
				</DocsProse>
				<CodeBlock
					code={`@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
}`}
					language='css'
					filename='themes.scss (@theme)'
				/>
			</DocsSection>

			<DocsSection id='next-themes' index={4} label='Hydration' title='NextThemes Hydration Setup'>
				<DocsProse>To guarantee seamless theme switching without hydration mismatch warnings in Next.js 15 App Router:</DocsProse>
				<CodeBlock
					code={`// src/providers/theme-provider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}`}
					language='tsx'
					filename='theme-provider.tsx'
				/>
			</DocsSection>

			<DocsSection id='palette-customization' index={5} label='Branding' title='Customizing Theme Palettes'>
				<DocsProse>
					Want an emerald, violet, or amber brand identity? Simply override the <code className={code}>--primary</code> variable in your root CSS. Exhuma components will instantly inherit your brand styling
					across all {ECOSYSTEM_COUNT} framework contracts.
				</DocsProse>
			</DocsSection>
		</DocsPage>
	);
}
