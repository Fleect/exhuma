import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
	IconAdjustments as Sliders,
	IconArrowRight as ArrowRight,
	IconBook2 as BookOpen,
	IconSparkles as Sparkles,
	IconCommand as Command,
	IconBolt as Zap,
	IconStack2 as Layers,
	IconShieldCheck as ShieldCheck,
} from '@tabler/icons-react';
import { ALL_COMPONENTS, ECOSYSTEM_LABELS } from '@/registry';
import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';
import { PackageManagerTabs, StepCodeBlock } from '@/components/docs/PackageManagerTabs';
import { StatStrip } from '@/components/landing/StatStrip';
import { HeroBackdrop } from '@/components/landing/HeroBackdrop';
import { EcosystemMarquee } from '@/components/landing/EcosystemMarquee';
import { LiveShowcase } from '@/components/landing/LiveShowcase';
import { ComponentCatalog } from '@/components/landing/ComponentCatalog';
import { CapabilityMatrix } from '@/components/landing/CapabilityMatrix';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
	title: { absolute: 'Exhuma — Universal Kinetic Primitives & Layout Engines' },
	description: 'Zero external animation runtimes, 120 FPS compositor execution, and 100% source ownership. Native implementations for React, Next.js, Vue, Svelte, Angular, Solid, Astro, and more.',
	openGraph: {
		title: 'Exhuma — Universal Kinetic Primitives & Layout Engines',
		description: `Zero external animation runtimes, 120 FPS compositor execution, and 100% source ownership across ${ECOSYSTEM_COUNT} frontend ecosystems.`,
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exhuma — Universal Kinetic Primitives & Layout Engines',
		description: `Zero external animation runtimes, 120 FPS compositor execution, and 100% source ownership across ${ECOSYSTEM_COUNT} frontend ecosystems.`,
	},
};

const STEPS = [
	{
		step: '01',
		title: 'Run the CLI',
		body: 'One command pulls the canonical primitive directly into your project. No runtime packages to install, zero lock-in.',
		code: 'npx exhuma add tilt-card',
	},
	{
		step: '02',
		title: 'Pick your ecosystem',
		body: 'The exact mathematical contract authored natively for your framework — Svelte gets runes, Angular gets signals, Vue gets composition.',
		code: 'npx exhuma add tilt-card --flavor=svelte',
	},
	{
		step: '03',
		title: 'Own the source code',
		body: 'The file lands directly in your repository. Retune the spring velocity, customize styles, or delete what you do not need.',
		code: 'src/components/ui/tilt-card.svelte',
	},
];

export default function HomePage() {
	const ecosystemCount = Object.keys(ECOSYSTEM_LABELS).length;
	const componentCount = ALL_COMPONENTS.length;

	return (
		<div className='relative min-h-screen overflow-x-hidden'>
			{/* ─────────────────────────── 1. HERO ─────────────────────────── */}
			<section className='relative pt-16 pb-14 sm:pt-24 sm:pb-20'>
				<HeroBackdrop />

				<div className='relative container text-center'>
					{/* Eyebrow Announcement Pill */}
					<Reveal>
						<Link
							href='/docs/components'
							className='border-border/80 bg-card/75 text-foreground/80 hover:text-foreground hover:border-foreground/40 hover:bg-card group text-2xs inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border p-1 pr-3.5 font-mono font-medium shadow-xs backdrop-blur-md transition-all sm:max-w-max'
						>
							<span className='bg-foreground text-background text-3xs flex items-center gap-1 rounded-full px-2 py-0.5 font-sans font-bold tracking-wider uppercase'>
								<Sparkles className='h-3 w-3 shrink-0' />
								<span>NEW</span>
							</span>
							<span className='truncate text-left'>
								<span className='hidden sm:inline'>{componentCount} Kinetic Primitives · </span>
								<span>{ecosystemCount} Native Ecosystems</span>
							</span>
							<ArrowRight className='text-muted-foreground group-hover:text-foreground h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5' />
						</Link>
					</Reveal>

					{/* Display Headline with Metallic Grayscale Gradient */}
					<Reveal delay={60}>
						<h1 className='text-foreground mx-auto mt-8 max-w-4xl text-4xl font-black tracking-tight text-balance sm:text-6xl lg:text-7xl'>
							Physics you can feel.
							<br />
							<span className='from-foreground via-foreground/85 to-foreground/40 bg-linear-to-b bg-clip-text text-transparent'>Code you actually own.</span>
						</h1>
					</Reveal>

					{/* Subtitle */}
					<Reveal delay={120}>
						<p className='text-muted-foreground mx-auto mt-6 max-w-[62ch] text-base leading-relaxed sm:text-lg'>
							Autonomous kinetic primitives engineered natively across {ecosystemCount} frontend ecosystems. Zero external animation runtimes, 120 FPS compositor execution, and 100% source ownership.
						</p>
					</Reveal>

					{/* CLI Copy Bar */}
					<Reveal delay={180}>
						<div className='mt-8 flex justify-center'>
							<PackageManagerTabs command='exhuma add tilt-card' />
						</div>
					</Reveal>

					{/* Hero CTAs */}
					<Reveal delay={240}>
						<div className='mt-7 flex flex-wrap items-center justify-center gap-3.5'>
							<Link href='#components'>
								<Button size='lg' className='bg-foreground text-background hover:bg-foreground/90 gap-2 border-none font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95'>
									<span>Explore Components</span>
									<ArrowRight className='h-4 w-4 shrink-0' />
								</Button>
							</Link>
							<Link href='/docs/components'>
								<Button variant='outline' size='lg' className='border-border/80 bg-card/60 hover:border-foreground/40 hover:bg-card/90 gap-2 backdrop-blur-sm'>
									<Sliders className='text-foreground/70 h-4 w-4 shrink-0' />
									<span>Explore Playground</span>
								</Button>
							</Link>
						</div>
					</Reveal>
				</div>

				{/* Framework ticker ribbon */}
				<div className='mt-14 sm:mt-18'>
					<EcosystemMarquee />
				</div>
			</section>

			{/* ─────────────────── 2. NUMBERS THAT MATTER ─────────────────── */}
			<section className='border-border/70 container border-t py-14'>
				<div className='text-3xs text-muted-foreground mb-6 flex items-center justify-between font-mono'>
					<span className='flex items-center gap-1.5'>
						<span className='text-foreground font-bold'>{'// 01'}</span>
						<span>·</span>
						<span className='tracking-wider uppercase'>TELEMETRY</span>
					</span>
					<span className='hidden sm:inline-block'>SPECIFICATION BASELINE</span>
				</div>
				<StatStrip
					stats={[
						{ value: componentCount, label: 'Canonical components', note: 'Every one physics-driven' },
						{ value: ecosystemCount, label: 'Native ecosystems', note: 'Idiomatic, not transpiled' },
						{ value: 0, label: 'Animation runtimes', note: 'No Framer Motion or GSAP' },
						{ value: 120, suffix: 'Hz', label: 'Frame rate floor', note: 'Guaranteed lower bound' },
					]}
				/>
			</section>

			{/* ─────────────────────── 3. LIVE PROOF BLOCK ─────────────────────── */}
			<section className='border-border/70 container border-t py-16 sm:py-24'>
				<Reveal className='mb-10 max-w-2xl'>
					<div className='text-3xs text-muted-foreground mb-3 flex items-center gap-2 font-mono'>
						<span className='text-foreground font-bold'>{'// 02'}</span>
						<span>·</span>
						<span className='tracking-wider uppercase'>KINETICS LAB</span>
					</div>
					<h2 className='text-heading-large text-foreground mt-1'>Physics you can feel, not a screenshot.</h2>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
						Every interaction below is the shipped component running in this page — analytic springs and pointer fields written against native primitives, with no animation library underneath.
					</p>
				</Reveal>

				<Reveal delay={120}>
					<LiveShowcase />
				</Reveal>
			</section>

			{/* ────────────────── 4. ARCHITECTURAL GUARANTEES ────────────────── */}
			<section className='border-border/70 container border-t py-16 sm:py-24'>
				<Reveal className='mb-10 max-w-2xl'>
					<div className='text-3xs text-muted-foreground mb-3 flex items-center gap-2 font-mono'>
						<span className='text-foreground font-bold'>{'// 03'}</span>
						<span>·</span>
						<span className='tracking-wider uppercase'>ARCHITECTURAL GUARANTEES</span>
					</div>
					<h2 className='text-heading-large text-foreground mt-1'>Engineered for absolute ownership.</h2>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
						Stop fighting bloated NPM dependency trees. Exhuma adapts idiomatic component code directly into your repository with zero runtime debt.
					</p>
				</Reveal>

				<div className='flex flex-wrap gap-6'>
					{/* Card 1: Zero Animation Debt */}
					<Reveal delay={60} className='min-w-0 grow basis-64'>
						<div className='border-border/80 bg-card/60 hover:border-foreground/40 group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10'>
							{/* Precision corner ticks */}
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
							<div>
								<div className='border-border bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs'>
									<Zap className='h-5 w-5' />
								</div>
								<h3 className='text-foreground mt-4 text-base font-bold tracking-tight'>Zero Animation Debt</h3>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
									No Framer Motion or GSAP runtime dependencies. Spring math executes directly on the browser compositor thread with a guaranteed 120 FPS floor.
								</p>
							</div>
							<div className='border-border/60 text-3xs text-foreground mt-5 flex items-center gap-1.5 border-t pt-3 font-mono font-semibold'>
								<ShieldCheck className='h-3.5 w-3.5 shrink-0' />
								<span>0.00 KB ANIMATION RUNTIME</span>
							</div>
						</div>
					</Reveal>

					{/* Card 2: 13 Native Ecosystems */}
					<Reveal delay={120} className='min-w-0 grow basis-64'>
						<div className='border-border/80 bg-card/60 hover:border-foreground/40 group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10'>
							{/* Precision corner ticks */}
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
							<div>
								<div className='border-border bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs'>
									<Layers className='h-5 w-5' />
								</div>
								<h3 className='text-foreground mt-4 text-base font-bold tracking-tight'>{ecosystemCount} Native Ecosystems</h3>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
									Svelte gets Runes ($state), Angular gets Signals, Vue gets Composition, React gets direct DOM refs. Never cross-compiled through an AST bridge.
								</p>
							</div>
							<div className='border-border/60 text-4xs text-muted-foreground mt-5 flex flex-wrap gap-1 border-t pt-3 font-mono'>
								<span>SVELTE 5</span> · <span>ANGULAR 18</span> · <span>VUE 3</span> · <span>REACT 19</span> · <span>SOLIDJS</span>
							</div>
						</div>
					</Reveal>

					{/* Card 3: Memory & Lifecycle Safe */}
					<Reveal delay={180} className='min-w-0 grow basis-64'>
						<div className='border-border/80 bg-card/60 hover:border-foreground/40 group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10'>
							{/* Precision corner ticks */}
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
							<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

							<div className='via-foreground/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
							<div>
								<div className='border-border bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs'>
									<ShieldCheck className='h-5 w-5' />
								</div>
								<h3 className='text-foreground mt-4 text-base font-bold tracking-tight'>Memory & Lifecycle Safe</h3>
								<p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
									Guaranteed listener detaching, ResizeObserver disconnects, and spring physics cancellation on component unmount. Zero memory leaks across client transitions.
								</p>
							</div>
							<div className='border-border/60 text-3xs text-foreground mt-5 flex items-center gap-1.5 border-t pt-3 font-mono font-semibold'>
								<ShieldCheck className='h-3.5 w-3.5 shrink-0' />
								<span>CLEAN UNMOUNTS GUARANTEED</span>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ─────────────────── 5. COMPONENT CATALOG ─────────────────── */}
			<section id='components' className='border-border/70 container scroll-mt-20 border-t py-16 sm:py-24'>
				<Reveal className='mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
					<div>
						<div className='text-3xs text-muted-foreground mb-3 flex items-center gap-2 font-mono'>
							<span className='text-foreground font-bold'>{'// 04'}</span>
							<span>·</span>
							<span className='tracking-wider uppercase'>COMPONENT REGISTRY</span>
						</div>
						<h2 className='text-heading-large text-foreground mt-1'>Canonical Component Catalog</h2>
						<p className='text-muted-foreground mt-1.5 text-xs sm:text-sm'>
							All {componentCount} components engineered under the Exhuma Kinetic Methodology across {ecosystemCount} target ecosystems.
						</p>
					</div>

					<Link href='/docs/components'>
						<Button variant='outline' size='sm' className='border-border/80 bg-card/60 hover:border-foreground/40 gap-1.5 shadow-xs'>
							<Sliders className='text-foreground/70 h-3.5 w-3.5' />
							<span>Open Playground</span>
						</Button>
					</Link>
				</Reveal>

				<div>
					<ComponentCatalog />
				</div>
			</section>

			{/* ─────────────────────── 6. HOW IT WORKS ─────────────────────── */}
			<section className='border-border/70 container border-t py-16 sm:py-24'>
				<Reveal className='mb-10 max-w-2xl'>
					<div className='text-3xs text-muted-foreground mb-3 flex items-center gap-2 font-mono'>
						<span className='text-foreground font-bold'>{'// 05'}</span>
						<span>·</span>
						<span className='tracking-wider uppercase'>INTEGRATION PIPELINE</span>
					</div>
					<h2 className='text-heading-large text-foreground mt-1'>Three steps, then it&apos;s yours.</h2>
					<p className='text-muted-foreground mt-2 text-sm leading-relaxed'>Copy canonical components into your codebase with one command. Read the source, tweak the springs, and ship.</p>
				</Reveal>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
					{STEPS.map((item, idx) => (
						<Reveal key={item.step} delay={idx * 100}>
							<div className='border-border/80 bg-card/60 hover:border-foreground/40 group relative flex h-full flex-col rounded-2xl border p-6 shadow-xs backdrop-blur-sm transition-all hover:shadow-md'>
								{/* Precision corner ticks */}
								<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 left-2 font-mono select-none'>+</div>
								<div className='text-foreground/20 text-4xs pointer-events-none absolute top-2 right-2 font-mono select-none'>+</div>

								<div className='text-foreground font-mono text-xs font-black'>{item.step}</div>
								<h3 className='text-foreground mt-3 text-base font-bold tracking-tight'>{item.title}</h3>
								<p className='text-muted-foreground mt-2 mb-5 text-xs leading-relaxed'>{item.body}</p>
								<StepCodeBlock code={item.code} />
							</div>
						</Reveal>
					))}
				</div>
			</section>

			{/* ──────────────────── 7. CAPABILITY MATRIX ──────────────────── */}
			<section className='border-border/70 container border-t py-16 sm:py-24'>
				<div className='text-3xs text-muted-foreground mb-6 flex items-center justify-between font-mono'>
					<span className='flex items-center gap-1.5'>
						<span className='text-foreground font-bold'>{'// 06'}</span>
						<span>·</span>
						<span className='tracking-wider uppercase'>CROSS-FRAMEWORK COMPILATION MATRIX</span>
					</span>
					<span className='hidden sm:inline-block'>{ecosystemCount} NATIVE TARGETS</span>
				</div>
				<Reveal>
					<CapabilityMatrix />
				</Reveal>
			</section>

			{/* ──────────────────────── 8. CLOSING CTA ──────────────────────── */}
			<section className='border-border/70 container border-t py-20 text-center sm:py-28'>
				<Reveal>
					<div className='border-border/80 bg-card/75 relative mx-auto max-w-4xl overflow-hidden rounded-3xl border p-8 shadow-2xl backdrop-blur-xl sm:p-14'>
						{/* Subtle grayscale ambient spotlight cone */}
						<div className='from-foreground/10 via-foreground/5 pointer-events-none absolute -top-28 left-1/2 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl' />
						<div className='relative'>
							<span className='kbd border-border bg-background text-foreground text-3xs mb-4 inline-flex font-mono tracking-wider'>
								<Command className='mr-1.5 h-3 w-3' />
								<span>PRESS ⌘K FOR COMMAND PALETTE</span>
							</span>
							<h2 className='text-heading-large text-foreground'>Start with one primitive.</h2>
							<p className='text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed'>
								Pull a single primitive into your project and read the source code. If it earns its place, take the rest — it all belongs to you either way.
							</p>
							<div className='mt-8 flex flex-wrap items-center justify-center gap-3.5'>
								<Link href='/docs/components'>
									<Button size='lg' className='bg-foreground text-background hover:bg-foreground/90 gap-2 border-none font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95'>
										<Sliders className='h-4 w-4 shrink-0' />
										<span>Explore Components</span>
									</Button>
								</Link>
								<Link href='/docs'>
									<Button variant='outline' size='lg' className='border-border/80 bg-card/60 hover:border-foreground/40 gap-2 backdrop-blur-sm'>
										<BookOpen className='text-foreground/70 h-4 w-4 shrink-0' />
										<span>Read Documentation</span>
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</Reveal>
			</section>
		</div>
	);
}
