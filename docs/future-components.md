# Future Components Roadmap (Post-Beta)

This document outlines components planned for future releases following the Exhuma v1.0 Beta. These components were deliberately deferred from the core Beta release to protect Exhuma's core guarantee of **100% production readiness, zero layout thrashing, and flawless multi-framework parity across all 13 supported ecosystems**.

---

## 1. Scroll Timeline (`scroll-timeline`)

### Overview
An organic, serpentine cubic-bezier SVG timeline component that connects alternating milestone cards with a continuous, hardware-composited progress beam synchronized to page scroll.

### Planned Capabilities
* **Dynamic Hermite Spline Engine**: Generates continuous cubic-bezier paths connecting milestone coordinates dynamically across viewport resizes.
* **Bi-directional Traversal**: Smooth forward and reverse laser trace animations using SVG `stroke-dashoffset` interpolation.
* **Compound Architecture**: Semantic `TimelineRoot`, `TimelineTrack`, `TimelineItem`, `TimelinePoint`, and `TimelineContent` sub-primitives.

### Why Deferred from Beta
1. **CSS Scroll-Driven Spec Fragmentation**: The native CSS `animation-timeline: scroll()` and `view()` specifications are in Working Draft status, with inconsistent support across mobile Safari (< iOS 18) and older Android WebViews.
2. **Responsive Node Reflow & Layout Thrashing**: Milestones shift vertically as text wraps differently across screen widths. Recalculating SVG control points dynamically requires continuous DOM measurements (`getBoundingClientRect`), violating Exhuma's $\Omega(1)$ constant-time guarantee unless isolated inside a dedicated virtualized layout engine.
3. **Multi-Ecosystem Vector Parity**: Requires distinct native vector drawing engines in non-web targets (Flutter `CustomPainter` + `ScrollController` vs React Native `react-native-svg` + `Reanimated`), requiring extensive dedicated cross-platform stabilization.

---

## 2. Sticky Parallax Scroll (`sticky-parallax`)

### Overview
A pinned kinetic viewport staging rail that drives multi-layer depth planes at differential speeds ($y = \text{scroll} \times \text{speed}_i$), creating an authentic 3D optical parallax experience during vertical page progression.

### Planned Capabilities
* **Differential Speed Staging**: Independent layer velocities (e.g. background at $-0.4\times$, midground at $0.8\times$, foreground at $1.5\times$).
* **Hardware Compositing**: Pure `transform: translate3d` and GPU layer promotion with zero main-thread layout recalculation.
* **Compound Architecture**: `ParallaxRoot`, `ParallaxSticky`, `ParallaxLayer`, and `ParallaxContent`.

### Why Deferred from Beta
1. **Mobile Viewport Inconsistencies**: Dynamic browser UI chrome (address bar collapsing and expanding between `100vh` and `100dvh`) introduces visual jitter during sticky scroll pinning on mobile WebKit and Blink.
2. **Touch Momentum Desync**: Mobile inertial flick scrolling causes differential layers to tear or lag behind sticky viewports without complex rubber-banding compensation.
3. **Core Redundancy**: Exhuma already ships two world-class, fully audited sticky scroll components in Beta: **`stacking-cards`** (3D sticky stack scale decay) and **`horizontal-scroller`** (pinned horizontal camera translation).

---

## 3. Interactive Grid Pattern (`interactive-grid`)

### Overview
A sub-pixel vector background grid pattern featuring pointer-proximity square illumination, ambient radial gradient masking, and energetic hover transitions.

### Planned Capabilities
* **Proximity Activation**: Square highlighting based on pointer distance and velocity vectors.
* **Ambient Masking**: Hardware-accelerated radial masks (`radial-gradient`) with configurable spread and opacity falloff.
* **Dual Rendering Engines**: Lightweight SVG pattern mode for desktop dashboards and high-performance HTML5 `<canvas>` / WebGL mode for ultra-dense grids.

### Why Deferred from Beta
1. **DOM Node Bloat**: Large SVG grids with hundreds of individual `<rect>` elements trigger excessive memory consumption and touch event thrashing on low-powered mobile devices.
2. **Cross-Framework Canvas Complexity**: Delivering an identical interactive canvas buffer across 13 distinct template targets (including SSR runtimes like Astro, Laravel Blade, and WordPress Gutenberg) requires a unified zero-dependency headless graphics kernel that warrants a dedicated release cycle.

---

## 4. Animated Sphere (`animated-sphere`)

### Overview
A sub-pixel 3D spherical particle system rendered via trigonometric polar coordinates and Euler rotation matrices onto an HTML5 2D Canvas buffer, with dynamic depth sorting and ambient particle illumination.

### Planned Capabilities
* **3D Spherical Trigonometry Kernel**: Native continuous polar-to-Cartesian coordinate transforms ($x = r \sin\theta \cos\phi, y = r \sin\theta \sin\phi, z = r \cos\theta$) with 3D Euler matrix rotation ($\mathbf{R}_x(\alpha) \cdot \mathbf{R}_y(\beta)$).
* **Depth-Sorted Particle Density**: Real-time Z-buffer depth sorting mapping character opacity and scaling dynamically from back-face to front-face.
* **Dual Rendering Backends**: Lightweight Canvas 2D ASCII character field mode and hardware-accelerated WebGL / Three.js particle mesh mode.

### Why Deferred from Beta
1. **Graphics Runtime Fragmentation**: Delivering identical 3D spherical particle mathematics across 13 diverse ecosystem targets (especially static server environments like Laravel Blade, WordPress Gutenberg, and native runtimes like Flutter `CustomPainter` and React Native Skia) requires dedicated headless graphics kernel abstractions.
2. **Mobile Thermal & GPU Battery Protection**: Continuous high-frequency canvas rasterization loops on mobile devices require strict intersection gating, reduced-motion frame throttling, and worker-offloaded math to protect battery life and prevent thermal throttling on entry-level mobile hardware.
3. **Core Library Scope Alignment**: Exhuma v1.0 Beta focuses on high-impact tactile cards, interactive layout engines, and kinetic navigation disclosures. 3D procedural particle simulations are slated for the Exhuma Creative / FX expansion suite.

---

## Target Release Horizon
These components are scheduled for **Exhuma v1.1+** once the core components have established baseline stability in production environments.
