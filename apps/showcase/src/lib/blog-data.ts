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
		slug: 'why-copy-paste-architecture-wins',
		title: 'Why Copy-Paste Headless Architecture Wins Over Monolithic NPM',
		description: 'How shadcn/ui and Exhuma proved that owning your component source code fundamentally outscales third-party npm runtime dependencies across multi-framework teams.',
		publishedAt: 'March 2025',
		readTime: '6 min read',
		featured: true,
		tags: ['Architecture', 'Philosophy', 'Ecosystems'],
		author: {
			name: 'Sapan Mozammel',
			role: 'Creator of Exhuma',
			avatar: 'SM',
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
		publishedAt: 'February 2025',
		readTime: '8 min read',
		tags: ['Performance', 'Spring Physics', 'Math'],
		author: {
			name: 'Exhuma Core Team',
			role: 'Kinetic Motion Systems',
			avatar: 'EC',
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
		publishedAt: 'January 2025',
		readTime: '7 min read',
		tags: ['Architecture', 'Memory Safety', 'Engine'],
		author: {
			name: 'Sapan Mozammel',
			role: 'Creator of Exhuma',
			avatar: 'SM',
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
