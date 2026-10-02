import { ECOSYSTEM_COUNT } from '@/components/docs/docs-stats';

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	readTime: string;
	author: {
		name: string;
		role: string;
		avatar: string;
		url?: string;
	};
	tags: string[];
	featured?: boolean;
	content: {
		headings: Array<{ id: string; title: string }>;
		sections: Array<{
			id: string;
			title: string;
			content: string;
			codeSnippet?: {
				code: string;
				language: 'typescript' | 'javascript' | 'tsx' | 'vue' | 'svelte' | 'bash';
				filename: string;
			};
			callout?: {
				type: 'note' | 'tip' | 'warning' | 'important';
				title: string;
				message: string;
			};
		}>;
	};
}

export const BLOG_POSTS: BlogPost[] = [
	{
		slug: 'analytical-spring-odes-vs-euler',
		title: 'Beyond Euler: Analytical Spring ODEs for Frame-Rate-Independent UI',
		description:
			'Why step-based Euler integration breaks across variable refresh rate displays (60Hz to 120Hz ProMotion), and how Exhuma solves 2nd-order differential equations in closed form for zero-allocation, drift-free kinetic motion.',
		publishedAt: 'October 2026',
		readTime: '8 min read',
		featured: true,
		tags: ['Kinetic Math', 'Physics', 'Performance'],
		author: {
			name: 'Fleect',
			role: 'A Fleect original',
			avatar: 'FL',
			url: 'https://fleect.com/',
		},
		content: {
			headings: [
				{ id: 'discretization-trap', title: 'The Discretization Trap: Why Step-Based Physics Fails' },
				{ id: 'continuous-differential-model', title: 'The Continuous Differential Model: Solving Harmonic Motion' },
				{ id: 'closed-form-solver', title: 'Closed-Form Solutions & O(1) Random Access' },
				{ id: 'seamless-interruption', title: 'Seamless Interruption & Momentum Transfer' },
			],
			sections: [
				{
					id: 'discretization-trap',
					title: 'The Discretization Trap: Why Step-Based Physics Fails',
					content:
						'Most web animation libraries simulate physical motion through numerical integration—specifically explicit forward Euler loops. Each frame tick, the engine measures the elapsed time delta (dt), computes the instantaneous spring force, and steps velocity and position sequentially:\n\nvelocity += acceleration * dt;\nposition += velocity * dt;\n\nOn a uniform 60Hz display, this approximation feels passable. But the modern web runs across heterogeneous, variable refresh rate (VRR) displays ranging from 10Hz ambient lock-screens up to 120Hz ProMotion screens. When a heavy garbage collection pause or React hydration step delays a frame by even 40 milliseconds, the discretized dt term spikes. In an explicit Euler step, this sudden timestep expansion injects phantom kinetic energy, causing springs to violently overshoot, oscillate unpredictably, or fail to settle.',
					callout: {
						type: 'warning',
						title: 'The Timestep Fragility',
						message:
							'Numerical stepping couples physics accuracy directly to frame cadence. If frame intervals fluctuate, the physics simulation diverges from physical reality, leading to visual stutter and erratic settling times.',
					},
				},
				{
					id: 'continuous-differential-model',
					title: 'The Continuous Differential Model: Solving Harmonic Motion',
					content:
						'Rather than approximating motion step-by-step, Exhuma models kinetic interactions as continuous solutions to the second-order damped harmonic oscillator differential equation:\n\nm * x″(t) + c * x′(t) + k * (x(t) - x_target) = 0\n\nBy normalizing with undamped angular frequency ω₀ = √(k / m) and damping ratio ζ = c / (2 * √(k * m)), the system’s behavior cleanly splits into three distinct analytical regimes:\n\n• Underdamped (ζ < 1): Controlled rhythmic oscillation with sinusoidal exponential decay.\n• Critically Damped (ζ = 1): The fastest non-oscillatory return to equilibrium with zero overshoot.\n• Overdamped (ζ > 1): Viscous, purely exponential return to rest.',
				},
				{
					id: 'closed-form-solver',
					title: 'Closed-Form Solutions & O(1) Random Access',
					content:
						'By solving the characteristic quadratic equation r² + 2*ζ*ω₀*r + ω₀² = 0, position x(t) and velocity v(t) become pure, closed-form functions of total elapsed time t = t_now - t_start.\n\nFor the underdamped regime (ζ < 1), with damped angular frequency ω_d = ω₀ * √(1 - ζ²):\n\nx(t) = x_target + e^(-ζ*ω₀*t) * (c₁ * cos(ω_d * t) + c₂ * sin(ω_d * t))\n\nwhere c₁ = x₀ - x_target, and c₂ = (v₀ + ζ * ω₀ * c₁) / ω_d.\n\nThis closed-form formulation delivers three decisive architectural advantages:\n\n1. O(1) Random Access: You can evaluate the spring at any arbitrary millisecond without stepping through prior frames. If a background tab wakes up after 5 seconds, the state resolves in a single CPU cycle.\n2. Zero Floating-Point Drift: Because t is measured against performance.now(), arithmetic rounding errors never compound across frames.\n3. Zero Heap Allocations: All computations use primitive scalar math. Not a single object or array is allocated during animation frames.',
					codeSnippet: {
						language: 'typescript',
						filename: 'spring-ode.ts',
						code: `// Exhuma Kinetic Methodology: Closed-Form Spring ODE Solver
export function solveAnalyticalSpring(
  t: number,           // elapsed time in seconds
  x0: number,          // initial displacement
  v0: number,          // initial velocity
  target: number,      // target equilibrium
  stiffness: number,   // spring constant k
  damping: number,     // damping coefficient c
  mass: number = 1     // mass m
): { position: number; velocity: number } {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const deltaX = x0 - target;

  if (zeta < 1) {
    // Underdamped regime: oscillatory decay
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const c1 = deltaX;
    const c2 = (v0 + zeta * w0 * deltaX) / wd;
    const envelope = Math.exp(-zeta * w0 * t);
    const cosTerm = Math.cos(wd * t);
    const sinTerm = Math.sin(wd * t);

    const position = target + envelope * (c1 * cosTerm + c2 * sinTerm);
    const velocity = envelope * (
      (-zeta * w0 * c1 + wd * c2) * cosTerm -
      (zeta * w0 * c2 + wd * c1) * sinTerm
    );
    return { position, velocity };
  } else if (zeta === 1) {
    // Critically damped regime: fastest settling, zero overshoot
    const envelope = Math.exp(-w0 * t);
    const c1 = deltaX;
    const c2 = v0 + w0 * deltaX;

    const position = target + envelope * (c1 + c2 * t);
    const velocity = envelope * (c2 - w0 * (c1 + c2 * t));
    return { position, velocity };
  } else {
    // Overdamped regime: dual exponential decay
    const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
    const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
    const c2 = (v0 - r1 * deltaX) / (r2 - r1);
    const c1 = deltaX - c2;

    const position = target + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    const velocity = c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t);
    return { position, velocity };
  }
}`,
					},
				},
				{
					id: 'seamless-interruption',
					title: 'Seamless Interruption & Momentum Transfer',
					content:
						'The defining metric of authentic tactile feel is interruptibility. If a user grabs or redirects a moving card mid-flight, the interface must neither stutter nor discard stored kinetic energy.\n\nBecause Exhuma’s closed-form equations yield both position x(t) and exact velocity v(t) analytically at any instant, interruption requires zero frame history:\n\nAt touch interception t_intercept, we sample x(t) and v(t) in O(1), terminate the previous animation frame handle, and seed the incoming spring with initial conditions x₀ = x(t_intercept) and v₀ = v(t_intercept) + v_pointer.\n\nThe transition is visually imperceptible and physically continuous—preserving momentum without a single dropped frame.',
					callout: {
						type: 'note',
						title: 'Framework Independence',
						message:
							'Because the analytical solver is pure scalar mathematics with zero DOM dependencies, the identical closed-form kernel compiles into React, Vue 3, Svelte 5, Flutter, and Web Components with zero runtime overhead.',
					},
				},
			],
		},
	},
	{
		slug: 'dynamic-greedy-row-masonry-mechanics',
		title: 'Shipping the 20-Component Beta: The Mechanics of Dynamic Greedy Row Masonry',
		description: 'How Exhuma achieved O(N log K) greedy shortest-column masonry balancing with zero layout thrashing, single-frame coalesced rAF, and universal parity across 13 ecosystems.',
		publishedAt: 'October 2026',
		readTime: '8 min read',
		featured: false,
		tags: ['Layout Engines', 'Masonry', 'Compositor', 'Milestone'],
		author: {
			name: 'Fleect',
			role: 'A Fleect original',
			avatar: 'FL',
			url: 'https://fleect.com/',
		},
		content: {
			headings: [
				{ id: 'masonry-conundrum', title: 'The Masonry Conundrum: CSS Columns vs. DOM Thrashing' },
				{ id: 'greedy-heap-mechanics', title: 'Greedy Shortest-Column Placement in O(N log K)' },
				{ id: 'single-frame-coalescing', title: 'Single-Frame Coalesced rAF & Dynamic Media Capture' },
				{ id: 'twenty-component-milestone', title: 'The 20-Component Milestone Across 13 Ecosystems' },
			],
			sections: [
				{
					id: 'masonry-conundrum',
					title: 'The Masonry Conundrum: CSS Columns vs. DOM Thrashing',
					content:
						'For years, frontend developers faced an unpleasant compromise when building masonry grids: either rely on native CSS column-count or pull in heavy JavaScript libraries like Macy.js, Masonry.js, or Isotope.\n\nNative CSS column-count is fast and zero-runtime, but it orders items vertically down Column 1, then down Column 2. In any chronological feed, blog list, or dynamic catalog, this breaks natural reading order—the second item appears far down the screen instead of adjacent to the first.\n\nConversely, traditional JavaScript masonry libraries mutate inline DOM style.top and style.left synchronously during image load events and window resize loops. This triggers continuous forced synchronous reflows—layout thrashing—that spike Interaction to Next Paint (INP) and devastate mobile performance.',
					callout: {
						type: 'important',
						title: 'The Core Layout Flaw',
						message: 'Mutating top and left in response to scroll or resize forces the browser rendering engine to recalculate the entire page render tree on every tick, dropping frame rates to sub-30 FPS.',
					},
				},
				{
					id: 'greedy-heap-mechanics',
					title: 'Greedy Shortest-Column Placement in O(N log K)',
					content:
						'Exhuma RowMasonry eliminates this tradeoff entirely through the Exhuma Kinetic Methodology (EKM). Instead of inline CSS positioning, it maintains a running vector of column heights H = [h₀, h₁, ..., h_{K-1}]. For each child item with measured height H_i, the layout engine selects the column with the minimum cumulative height and assigns absolute translation offsets.',
					codeSnippet: {
						language: 'typescript',
						filename: 'row-masonry-math.ts',
						code: `// Pure headless greedy masonry placement in O(N log K)
export function computeMasonryLayout(
  itemHeights: number[],
  containerWidth: number,
  columns: number,
  gap: number
): { items: MasonryItem[]; totalHeight: number } {
  const colWidth = (containerWidth - gap * (columns - 1)) / columns;
  const colHeights = new Array(columns).fill(0);

  const items = itemHeights.map((h, index) => {
    // Find shortest column
    let minCol = 0;
    for (let c = 1; c < columns; c++) {
      if (colHeights[c] < colHeights[minCol]) minCol = c;
    }

    const x = minCol * (colWidth + gap);
    const y = colHeights[minCol];
    colHeights[minCol] += h + gap;

    return { index, x, y, width: colWidth };
  });

  const totalHeight = Math.max(...colHeights, 0);
  return { items, totalHeight };
}`,
					},
				},
				{
					id: 'single-frame-coalescing',
					title: 'Single-Frame Coalesced rAF & Dynamic Media Capture',
					content:
						'Real-world masonry grids must handle asynchronously loading images, videos, and dynamic user cards. If 20 images resolve within 100 milliseconds, naïve listeners schedule 20 separate layout recalculations. RowMasonry solves this with two cooperating mechanisms:\n\n1. Event Capture for Media: An event listener attached to the container with capture: true intercepts the load event of every descending <img> or <video> element as soon as it arrives, without requiring per-child wrapper props.\n\n2. Single-Frame Coalescing: All resize events, observer callbacks, and image load triggers channel into a single requestAnimationFrame handle (rafIdRef). If multiple triggers fire within the same browser frame, intermediate calls coalesce into a single execution pass.\n\nAll item positions are applied directly via hardware-accelerated transform: translate3d(x, y, 0), leaving normal-flow DOM geometry intact.',
					callout: {
						type: 'tip',
						title: 'Compositor Optimization',
						message: 'Using transform: translate3d() allows browser rendering engines to composite tile repositioning entirely on the GPU thread without triggering layout or paint reflow.',
					},
				},
				{
					id: 'twenty-component-milestone',
					title: 'The 20-Component Milestone Across 13 Ecosystems',
					content:
						'The addition of RowMasonry marks the official completion of Exhuma’s 20-Component Beta milestone. From tactile cards (StackingCards, TiltCard, SpotlightCard, BorderBeam, CardSwipeStack, ComparisonSlider, ExpandableCard, HorizontalScroller) to navigation rails (MorphingTabs, FloatingDock) and kinetic layout engines (CssMasonry, RowMasonry, AutoGrid, InfiniteMarquee, BentoGrid, DiamondGrid), every primitive is available across all 13 supported frontend ecosystems.\n\nWhether you consume components via pnpm add @fleect/exhuma or generate zero-dependency copy-paste source code for React, Next.js, Vue 3, Svelte 5, Angular 19, or Flutter using npx exhuma add, you get 100% owned source code engineered for peak tactile performance.',
					codeSnippet: {
						language: 'bash',
						filename: 'terminal.sh',
						code: `# Add RowMasonry to your project with your preferred framework flavor
npx exhuma add row-masonry --flavor=react

# Or install the unified flagship engine
pnpm add @fleect/exhuma @fleect/exhuma-layouts`,
					},
				},
			],
		},
	},
	{
		slug: 'why-copy-paste-architecture-wins',
		title: 'Why Copy-Paste Headless Architecture Wins Over Monolithic NPM',
		description: 'How shadcn/ui and Exhuma proved that owning your component source code fundamentally outscales third-party npm runtime dependencies across multi-framework teams.',
		publishedAt: 'October 2026',
		readTime: '6 min read',
		featured: false,
		tags: ['Architecture', 'Philosophy', 'Ecosystems'],
		author: {
			name: 'Fleect',
			role: 'A Fleect original',
			avatar: 'FL',
			url: 'https://fleect.com/',
		},
		content: {
			headings: [
				{ id: 'monolithic-illusion', title: 'The Illusion of Monolithic Libraries' },
				{ id: 'dependency-tax', title: 'The Hidden Dependency Tax' },
				{ id: 'universal-contract', title: 'The Universal Component Contract' },
				{ id: 'zero-runtime-lockin', title: 'Zero Runtime Lock-in' },
			],
			sections: [
				{
					id: 'monolithic-illusion',
					title: 'The Illusion of Monolithic Libraries',
					content:
						'For nearly a decade, frontend development was dominated by massive, monolithic npm UI packages. You ran npm install some-ui-library, and overnight your node_modules absorbed hundreds of megabytes of nested dependencies, conflicting emotion/styled-components runtimes, and CSS-in-JS abstractions that slowed server rendering down to a crawl.',
					callout: {
						type: 'note',
						title: 'The Shift toward Code Ownership',
						message: 'When shadcn/ui popularized copy-paste component architecture, it fundamentally challenged the idea that UI components must be distributed as compiled binary npm packages.',
					},
				},
				{
					id: 'dependency-tax',
					title: 'The Hidden Dependency Tax',
					content:
						'Monolithic libraries introduce severe technical debt during major framework upgrades. When Next.js 15, React 19, or Svelte 5 release groundbreaking concurrency or compiler features, teams frequently find themselves blocked for months waiting for an upstream npm package maintainer to release compatible type definitions and peer dependency fixes.',
					codeSnippet: {
						language: 'bash',
						filename: 'terminal.sh',
						code: `# Old World: Monolithic Dependency Hell
npm install @bloated/ui-components
# npm ERR! ERESOLVE could not resolve peer dependency React 19

# Exhuma World: Direct Code Ownership
npx exhuma add tilt-card --flavor=react
# ✔ Installed TiltCard -> src/components/ui/tilt-card.tsx (100% owned, zero runtime lock-in)`,
					},
				},
				{
					id: 'universal-contract',
					title: 'The Universal Component Contract',
					content:
						'Exhuma took this concept one step further. What if you work in an enterprise organization with teams authoring applications across Next.js, Nuxt/Vue, SvelteKit, and Flutter? With Exhuma, a single canonical mathematical engine authors idiomatic, clean code natively tailored for each target platform without runtime wrappers.',
				},
				{
					id: 'zero-runtime-lockin',
					title: 'Zero Runtime Lock-in',
					content:
						'Because the code lives directly inside your repository, you possess 100% control over the DOM, styling tokens, accessibility roles, and performance optimizations. You can refactor props or change CSS variables anytime without waiting for external release cycles.',
				},
			],
		},
	},
	{
		slug: 'hardware-accelerated-spring-physics',
		title: '60 FPS Spring Physics on the GPU Compositor',
		description: 'The mathematics and DOM lifecycle engineering behind Exhuma 3D Tilt Card: achieving silky-smooth kinetic responses with zero React layout thrashing.',
		publishedAt: 'October 2026',
		readTime: '8 min read',
		featured: false,
		tags: ['Performance', 'Spring Physics', 'Math'],
		author: {
			name: 'Fleect',
			role: 'A Fleect original',
			avatar: 'FL',
			url: 'https://fleect.com/',
		},
		content: {
			headings: [
				{ id: 'layout-thrashing-trap', title: 'The Layout Thrashing Trap' },
				{ id: 'math-model', title: 'The 3D Perspective Mathematical Model' },
				{ id: 'gpu-compositing', title: 'Direct GPU Compositor Scheduling' },
				{ id: 'reduced-motion', title: 'Honoring Accessibility & Reduced Motion' },
			],
			sections: [
				{
					id: 'layout-thrashing-trap',
					title: 'The Layout Thrashing Trap',
					content:
						'Most naïve 3D tilt implementations trigger requestAnimationFrame loops that continuously query getBoundingClientRect() during mouse movements. Reading element geometries immediately before writing inline styles causes forced synchronous layout calculations—commonly called layout thrashing—which instantly drops frame rates from 60 FPS down to 24 FPS.',
				},
				{
					id: 'math-model',
					title: 'The 3D Perspective Mathematical Model',
					content:
						'Exhuma calculates normalized pointer vectors relative to the center origin of the target container. Given pointer coordinates (x, y) and element boundaries (W, H), the rotation matrices are defined with zero trigonometric overhead:',
					codeSnippet: {
						language: 'typescript',
						filename: 'physics.ts',
						code: `// Normalized rotational physics calculation
const centerX = rect.width / 2;
const centerY = rect.height / 2;
const rotateX = ((y - centerY) / centerY) * -maxTilt;
const rotateY = ((x - centerX) / centerX) * maxTilt;

// Apply single GPU-composited 3D matrix transform
element.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.04, 1.04, 1.04)\`;`,
					},
				},
				{
					id: 'gpu-compositing',
					title: 'Direct GPU Compositor Scheduling',
					content:
						'By isolating transforms strictly to transform and opacity with will-change: transform and transform-style: preserve-3d, modern browser rendering engines bypass the paint and reflow stages entirely, computing rotations directly on the GPU rasterization pipeline.',
				},
				{
					id: 'reduced-motion',
					title: 'Honoring Accessibility & Reduced Motion',
					content:
						'Performance without accessibility is a failure of craft. Exhuma components automatically detect window.matchMedia("(prefers-reduced-motion: reduce)"). When enabled by the user in their operating system, all rotational transforms collapse into a gentle, non-disorienting tactile opacity cue.',
					callout: {
						type: 'important',
						title: 'WCAG 2.1 Compliance',
						message: 'Exhuma guarantees that vestibular disorder triggers are completely neutralized whenever prefers-reduced-motion is detected.',
					},
				},
			],
		},
	},
	{
		slug: 'deterministic-lifecycle-cleanup',
		title: `Deterministic Teardown: Zero Memory Leaks Across ${ECOSYSTEM_COUNT} Frameworks`,
		description: 'How Exhuma guarantees that listeners, observers, and spring animations cleanly terminate across SPA view transitions from Svelte 5 Runes to Angular Signals and Flutter.',
		publishedAt: 'October 2026',
		readTime: '7 min read',
		featured: false,
		tags: ['Architecture', 'Memory Safety', 'Engine'],
		author: {
			name: 'Fleect',
			role: 'A Fleect original',
			avatar: 'FL',
			url: 'https://fleect.com/',
		},
		content: {
			headings: [
				{ id: 'zombie-listeners', title: 'The Problem of Zombie Listeners' },
				{ id: 'teardown-contract', title: `The ${ECOSYSTEM_COUNT}-Framework Teardown Contract` },
				{ id: 'automated-audit', title: 'Automated Lifecycle Verification' },
			],
			sections: [
				{
					id: 'zombie-listeners',
					title: 'The Problem of Zombie Listeners',
					content:
						'Single-page applications (SPAs) frequently suffer from lingering window event listeners and active ResizeObservers that retain references to unmounted DOM nodes. Over extended user sessions, these zombie closures retain megabytes of memory and degrade performance.',
				},
				{
					id: 'teardown-contract',
					title: `The ${ECOSYSTEM_COUNT}-Framework Teardown Contract`,
					content:
						'Every Exhuma component is tested against an invariant lifecycle contract: when the component unmounts, zero detached DOM references, active observers, or pending animation frames may persist. We implement this using framework-native cleanup primitives:',
					codeSnippet: {
						language: 'typescript',
						filename: 'lifecycle-matrix.ts',
						code: `// React 18/19 & Next.js 15:
useEffect(() => {
  return () => { window.removeEventListener('mousemove', onMove); };
}, []);

// Svelte 5 (Runes):
$effect(() => {
  return () => { window.removeEventListener('mousemove', onMove); };
});

// Vue 3 / Nuxt:
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove);
});

// Flutter (Dart):
@override
void dispose() {
  _animationController.dispose();
  super.dispose();
}`,
					},
				},
				{
					id: 'automated-audit',
					title: 'Automated Lifecycle Verification',
					content: 'Our automated CI test suite mounts each component into a headless browser harness, executes 1,000 rapid route transitions, and inspects heap snapshots to confirm zero memory accumulation.',
				},
			],
		},
	},
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
	return BLOG_POSTS.find((p) => p.slug === slug);
}
