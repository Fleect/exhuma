import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocsPage } from '@/components/docs/DocsPage';
import { DocsPageHeader } from '@/components/docs/DocsPageHeader';
import { DocsSection, DocsProse } from '@/components/docs/DocsSection';
import { DocsSpecCard } from '@/components/docs/DocsSpecCard';
import { DocsInvariantCard } from '@/components/docs/DocsInvariantCard';
import { DocsWindow } from '@/components/docs/DocsWindow';
import { DocsFormula } from '@/components/docs/DocsFormula';
import { getDocsSection } from '@/components/docs/docs-nav';
import { ECOSYSTEM_COUNT, getEcosystemTargets } from '@/components/docs/docs-stats';

const HREF = '/docs/methodology';

export const metadata: Metadata = {
	title: 'Kinetic Methodology',
	description: 'The Exhuma Kinetic Methodology: Big-Omega (Ω) lower-bound guarantees, dual-channel state, a deterministic gesture FSM, and closed-form spring physics.',
};

const toc = [
	{ id: 'principle', title: 'The Big-Omega (Ω) Invariant' },
	{ id: 'pillars', title: 'The 5 EKM Architectural Pillars' },
	{ id: 'dual-channel', title: 'Dual-Channel State Pipeline' },
	{ id: 'fsm', title: 'Deterministic 5-State Gesture FSM' },
	{ id: 'spring-math', title: 'Closed-Form Analytical Springs' },
];

const code = 'text-foreground font-mono';

const FSM_TRANSITIONS = [
	['IDLE', 'PointerDown', 'TRACKING'],
	['TRACKING', 'Angle < 30° & Δ > 8px', 'CLAIMED (Capture Touch)'],
	['TRACKING', 'Angle ≥ 30°', 'IDLE (Yield to Page Scroll)'],
	['CLAIMED', 'PointerUp', 'DECELERATING'],
	['DECELERATING', 'v → 0', 'IDLE'],
] as const;

export default function MethodologyPage() {
	const ecosystemNames = new Intl.ListFormat('en', { type: 'conjunction' }).format(getEcosystemTargets().map((target) => target.name));

	const pillars = [
		{ title: 'Decoupled Mathematical Kernels', body: 'All physics, coordinate normalization, and layout math are isolated into pure TypeScript functions with zero framework dependencies.' },
		{
			title: 'Kinetic Compound Composition',
			body: (
				<>
					Radix-style composable slots (<code className={code}>Root</code>, <code className={code}>Trigger</code>, <code className={code}>Content</code>) paired with independent hardware-accelerated{' '}
					<code className={code}>Indicator</code> primitives.
				</>
			),
		},
		{ title: 'Dual-Channel State Separation', body: 'High-frequency 120Hz continuous inputs bypass virtual DOM reconciliation entirely, writing directly to element style variables.' },
		{ title: 'Deterministic 5-State Gesture FSM', body: 'Formally complete automaton with slop-angle trajectory filtering to guarantee zero mobile page scroll hijacking.' },
		{ title: 'Universal Cross-Ecosystem Parity Contract', body: `Zero external animation runtimes. Identical behavioral contracts compiled to ${ecosystemNames}.` },
	];

	return (
		<DocsPage href={HREF} toc={toc}>
			<DocsPageHeader
				eyebrow={[{ label: getDocsSection(HREF) }]}
				title='The Exhuma Kinetic Methodology (EKM)'
				description='Mathematical foundations, algorithmic complexity invariants, and Big-Omega (Ω) lower-bound guarantees across all Exhuma primitives.'
				meta={['Ω(120Hz) frame floor', 'O(1) dispatch', 'Ω(1) heap']}
			/>

			<DocsSection id='principle' index={1} label='Complexity Theory' title='The Big-Omega (Ω) Lower-Bound Invariant'>
				<DocsProse>
					In computational complexity theory, <span className={code}>Ω(g(n))</span> defines the <strong className='text-foreground'>tight lower bound</strong> of a system. Most UI component libraries only
					describe their best-case scenarios (<span className={code}>O</span>), degrading rapidly under high-frequency inputs or on mobile devices.
				</DocsProse>
				<DocsProse>
					Exhuma is engineered so that runtime performance, frame rates, memory stability, and state determinism{' '}
					<strong className='text-foreground'>are mathematically guaranteed never to drop below our established lower bounds</strong>.
				</DocsProse>
				<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
					<DocsInvariantCard tag='Ω · Frames' title='Frame Rate Floor' value={120} prefix='Ω(' suffix='Hz)'>
						Frame computation budget ≤ 8.33ms. Never drops a single frame due to main-thread blockage.
					</DocsInvariantCard>
					<DocsSpecCard tag='Ω · Time' title='Time Complexity' value='Ω(1) = O(1)'>
						Constant-time kinetic dispatch pipeline directly mutating CSS variables via rAF. Zero DOM tree traversals.
					</DocsSpecCard>
					<DocsSpecCard tag='Ω · Memory' title='Memory Invariant' value='Ω(1) Heap'>
						Zero dynamic allocations in motion loops. Static circular ring buffers eliminate Garbage Collection pauses.
					</DocsSpecCard>
				</div>
			</DocsSection>

			<DocsSection id='pillars' index={2} label='Architecture' title='The 5 EKM Architectural Pillars'>
				<DocsProse>Every component in Exhuma adheres to these 5 architectural pillars, ensuring uniform developer experience and bulletproof quality across all {ECOSYSTEM_COUNT} ecosystems.</DocsProse>
				<div className='grid grid-cols-1 gap-3'>
					{pillars.map((pillar, i) => (
						<DocsSpecCard key={pillar.title} tag={`Pillar ${String(i + 1).padStart(2, '0')}`} title={pillar.title}>
							{pillar.body}
						</DocsSpecCard>
					))}
				</div>
			</DocsSection>

			<DocsSection id='dual-channel' index={3} label='State' title='Dual-Channel State Pipeline'>
				<DocsProse>
					Why do standard React animation libraries stutter? Because they pass mouse coordinates through React state (<code className={code}>setState</code>), triggering 120 virtual DOM diffs per second. Exhuma
					strictly bifurcates state into two isolated channels:
				</DocsProse>
				<CodeBlock
					code={`// EXHUMA DUAL-CHANNEL STATE PATTERN
// Channel 1: Kinetic GPU Channel (Continuous 120Hz — Zero Re-renders)
const handlePointerMove = (e: React.PointerEvent) => {
  const coords = calculateSpotlightCoordinates(e.clientX, e.clientY, rect);
  targetX.current = coords.x;
  targetY.current = coords.y;

  // Directly writes to GPU custom properties on requestAnimationFrame
  el.style.setProperty('--exhuma-spotlight-x', \`\${coords.x}px\`);
};

// Channel 2: Discrete Logical Channel (On Action Only)
const handleSelectTab = (tabId: string) => {
  setActiveTab(tabId); // Standard controlled/uncontrolled state
  onValueChange?.(tabId);
};`}
					language='tsx'
					filename='DualChannelPipeline.tsx'
				/>
			</DocsSection>

			<DocsSection id='fsm' index={4} label='Gestures' title='Deterministic 5-State Gesture FSM'>
				<DocsProse>Mobile touch interactions fail when horizontal gestures fight native vertical page scroll. Exhuma implements a provably complete automaton with an angular slop filter:</DocsProse>
				<DocsWindow filename='gesture-fsm.ts' status='5 STATES'>
					<ol aria-label='State transitions' className='space-y-2.5 font-mono text-xs'>
						{FSM_TRANSITIONS.map(([from, event, to]) => (
							<li key={`${from}-${event}`} className='flex flex-wrap items-center gap-x-2 gap-y-1'>
								<span className='text-foreground font-bold'>{from}</span>
								<span className='text-muted-foreground'>──({event})──►</span>
								<span className='text-foreground font-bold'>{to}</span>
							</li>
						))}
					</ol>
				</DocsWindow>
			</DocsSection>

			<DocsSection id='spring-math' index={5} label='Physics' title='Closed-Form Analytical Spring Physics'>
				<DocsProse>
					Euler numerical integration approximations accumulate floating-point error over time. Exhuma uses the exact closed-form solution to the second-order differential equation for critical damping (ζ =
					1.0):
				</DocsProse>
				<DocsFormula label='Critical damping · ζ = 1.0' caption='closed-form, no numerical integration'>
					x(t) = x<sub>target</sub> + (x<sub>0</sub> − x<sub>target</sub>) · e
					<sup>
						−ω<sub>n</sub>t
					</sup>{' '}
					· (1 + ω<sub>n</sub>t)
				</DocsFormula>
				<DocsProse>This provides instantaneous position calculation with provable asymptotic convergence, zero oscillation, and zero external physics libraries.</DocsProse>
			</DocsSection>
		</DocsPage>
	);
}
