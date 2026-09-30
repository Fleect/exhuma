# Exhuma Component Roadmap & Future Wishlist

This document outlines the expanded component roadmap, curated from an exhaustive analysis of high-performing kinetic interaction design patterns (including the 406 interactive components from Framer University and the user's curated wishlist) and benchmarked against Exhuma's non-negotiable **Big-Omega $\Omega(1)$ compositor invariants and 13-ecosystem universal parity guarantees**.

---

## 🌟 The 4 Golden Rules of User Delight in Kinetic UI

To build components that truly delight real humans, every primitive in this design cycle adheres to 4 foundational rules:

1. **Uninterrupted Interruptibility**:
   - If an animation is playing and the user touches or clicks it, the animation must **never freeze, jump, or ignore the input**.
   - Current velocity $\mathbf{v}(t)$ must be sampled instantaneously and injected as the initial velocity $\mathbf{v}_0$ of the subsequent spring.

2. **Zero Cumulative Layout Shift ($\Omega(1) \text{ CLS} = 0$)**:
   - Visual effects (scrambling text, expanding cards, border beams, 3D tilts) must **never cause surrounding content to bounce or reflow**. Dimensions are strictly locked to hardware-composited layout slots.

3. **Authentic Boundary Viscosity (Rubber-Banding)**:
   - When a user pulls past the end of a carousel, sheet, or card stack, the interface must not hit a rigid brick wall. It must dynamically resist with square-root or asymptotic viscous damping:
     $$y_{\text{rubber}} = \frac{y}{1 + \frac{y}{k}}$$
   - Upon release, stored elastic potential energy snaps the interface back with critical damping ($\zeta = 1.0$).

4. **Multi-Sensory Haptic & Specular Feedback**:
   - Interfaces feel digital when they are purely flat pixels. They feel physical when pointer coordinates drive **subtle specular glare highlights, magnetic depth detachment, and optional micro-haptic clicks** (`navigator.vibrate(6)`).

---

## 📋 Master Wishlist Inventory (23 Future Components)

Here is the complete wishlist inventory combining our **original 4 deferred components**, the **Row Masonry (Macy-style EKM)**, and the **unified interactive components synthesized from the curated Framer library**:

|   #    | Slug                     | Component Name                    | Category               |        Origin         |   Target Horizon   |
| :----: | :----------------------- | :-------------------------------- | :--------------------- | :-------------------: | :----------------: |
| **1**  | **`scroll-timeline`**    | Scroll Timeline                   | Layouts / Rails        | **Original Wishlist** | Post-Beta (v1.1+)  |
| **2**  | **`sticky-parallax`**    | Sticky Parallax Scroll            | Layouts / Viewports    | **Original Wishlist** | Post-Beta (v1.1+)  |
| **3**  | **`interactive-grid`**   | Interactive Grid Pattern          | Layouts / Backgrounds  | **Original Wishlist** | **Beta Candidate** |
| **4**  | **`animated-sphere`**    | 3D Animated Sphere                | 3D / Creative Canvas   | **Original Wishlist** | Post-Beta (v1.2+)  |
| **5**  | **`row-masonry`**        | Kinetic Row Masonry (Macy EKM)    | Layout Engines         |   **User Request**    | **Shipped (Beta 20)** |
| **6**  | **`text-scramble`**      | Cyberpunk Text Decrypt            | Kinetic Typography     | **Framer University** | **Beta Candidate** |
| **7**  | **`text-shimmer`**       | Specular Gradient Shimmer         | Kinetic Typography     | **Framer University** | **Beta Candidate** |
| **8**  | **`shimmer-button`**     | Rotating Laser Glow Button        | Kinetic Actions        | **Framer University** | **Beta Candidate** |
| **9**  | **`particle-field`**     | Ambient Floating Particles        | Ambient Motion / Media | **Framer University** | **Beta Candidate** |
| **10** | **`drawer`**             | Vaul-Style Touch Drawer           | Disclosures / Overlays | **Framer University** | **Beta Candidate** |
| **11** | **`text-roll`**          | 3D Character Cylinder Flip        | Kinetic Typography     | **Framer University** | **Beta Candidate** |
| **12** | **`x-ray-lens`**         | X-Ray Dual-Layer Reveal Lens      | Interactive Media / FX | **Framer University** | **Beta Candidate** |
| **13** | **`scratch-card`**       | Interactive Reveal Scratch Card   | Gamification / Media   | **Framer University** | **Beta Candidate** |
| **14** | **`dynamic-island`**     | Morphing Action Pill              | Navigation / Widgets   | **Framer University** | **Beta Candidate** |
| **15** | **`sticker-peel`**       | 3D Corner Peel Sticker            | Tactile Micro-Physics  | **Framer University** | **Beta Candidate** |
| **16** | **`swipe-button`**       | Slide-to-Confirm Action Button    | Kinetic Actions        | **Framer University** | **Beta Candidate** |
| **17** | **`confetti-burst`**     | Physics Particle Explosion        | Celebration & Feedback | **Framer University** | **Beta Candidate** |
| **18** | **`coverflow-carousel`** | Unified 3D Coverflow & Carousel   | Media & Carousels      | **Curated Synthesis** | **Beta Candidate** |
| **19** | **`path-marquee`**       | Curved / Vector Path Ticker       | Layouts / Typography   | **Curated Synthesis** | **Beta Candidate** |
| **20** | **`tactile-switch`**     | Skeuomorphic Fluid Toggle Switch  | Form Controls          | **Curated Synthesis** | **Beta Candidate** |
| **21** | **`flip-card`**          | 3D Metallic Dual-Sided Flip Card  | Cards & Displays       | **Curated Synthesis** | **Beta Candidate** |
| **22** | **`toast-stack`**        | Sonner-Style Gestural Toast Stack | Disclosures & Feedback | **Curated Synthesis** | Post-Beta (v1.1+)  |
| **23** | **`radial-intro`**       | Circular Iris & Orbital Revealer  | Layouts & Hero Intros  | **Curated Synthesis** | Post-Beta (v1.1+)  |
| **24** | **`click-effects`**      | Kinetic Click & Shockwave Canvas  | Actions / Micro-FX     | **Curated Framer**    | **Beta Candidate** |
| **25** | **`kinetic-grid`**       | Gravitational Repulsion Grid      | Layouts / Surfaces     | **Curated Framer**    | **Beta Candidate** |
| **26** | **`shimmer-grid`**       | Harmonic Wave Shimmer Grid        | Layouts / Backgrounds  | **Curated Framer**    | **Beta Candidate** |
| **27** | **`svg-path-shimmer`**   | Arbitrary SVG Path Laser Crawler  | Visual FX / Vectors    | **Curated Framer**    | **Beta Candidate** |
| **28** | **`gradient-border-button`**| Dual Conic Border Glow Button  | Actions / Controls     | **Curated Framer**    | **Beta Candidate** |
| **29** | **`ticker-scroll`**      | Inertial Scrubbing Ticker Track   | Typography / Media     | **Curated Framer**    | **Beta Candidate** |
| **30** | **`huly-effect`**        | Translucent Specular Radar Glow   | Cards / Illumination   | **Curated Framer**    | **Beta Candidate** |
| **31** | **`card-scroll-animation`**| 3D Perspective Card Conveyor    | Carousels / Displays   | **Curated Framer**    | **Beta Candidate** |
| **32** | **`isometric-hero`**     | Multi-Plane Isometric Stage       | 3D / Hero Canvases     | **Curated Framer**    | Post-Beta (v1.1+)  |

---

## 🎯 Target Beta Expansion Candidates (To Reach 25+ Components)

To expand Exhuma's Beta catalog from **20 to 25+ production-grade primitives** (+5 needed), we select from the deep architectural specifications below based on visual punch, mathematical rigor, zero layout thrashing, and universal cross-framework portability:

---

### 1. Kinetic Row Masonry (`row-masonry` / `macy-masonry`) — *Shipped in 20-Component Beta*

- **Category**: Responsive Layout Engines
- **Visual & Engineering Inspiration**: Macy.js, Pinterest, Packery, Unsplash dynamic feeds.
- **The Problem with Existing Solutions**:
  - Native CSS `column-count` stacks items **vertically down Column 1, then Column 2**. When users read a blog or gallery, Item 2 appears midway down the screen instead of beside Item 1, breaking natural chronological reading order.
  - Macy.js and Isotope mutate DOM `top` and `left` styles synchronously on every image load and window resize, triggering continuous forced synchronous layouts (layout thrashing) that drop frame rates on mobile devices.
- **The Exhuma Mathematical Solution (EKM)**:
  - **Greedy Min-Heap Placement Algorithm**: Maintain a running state vector of column heights:
    $$\mathbf{H} = [h_0, h_1, \dots, h_{k-1}]$$
    For each child $i \in [0, N-1]$ with height $H_i$:
    $$c_i = \arg\min_j(\mathbf{H}_j)$$
    $$x_i = c_i \cdot (W_{\text{col}} + \text{gap})$$
    $$y_i = \mathbf{H}_{c_i}$$
    $$\mathbf{H}_{c_i} \leftarrow \mathbf{H}_{c_i} + H_i + \text{gap}$$
  - **GPU-Composited Placement**: Items are positioned via hardware-accelerated `transform: translate3d(x_i px, y_i px, 0)`. The container height is committed once: $H_{\text{container}} = \max_j(\mathbf{H}_j)$.
  - **FLIP Layout Resize Transitions**: When the viewport resizes or columns change ($k = 3 \to 2$):
    1. Capture previous item positions $(x_{\text{prev}}, y_{\text{prev}})$.
    2. Compute new positions $(x_{\text{next}}, y_{\text{next}})$.
    3. Invert with delta: $\Delta x = x_{\text{prev}} - x_{\text{next}}$, $\Delta y = y_{\text{prev}} - y_{\text{next}}$.
    4. Play analytical spring translation $\mathbf{p}(t) \to 0$ with staggered delays.
    5. Result: Cards glide seamlessly into their new positions like liquid cards!
  - **$\Omega(1)$ Layout Thrashing Protection**: Batches container dimension reads inside a single throttled `ResizeObserver`; style updates are executed in a single `requestAnimationFrame` write step.
- **Developer API**:
  ```tsx
  <RowMasonry columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={24} animateResize={true} transitionDuration={0.4}>
    {items.map((item) => (
      <RowMasonry.Item key={item.id} defaultHeight={item.height}>
        <Card content={item} />
      </RowMasonry.Item>
    ))}
  </RowMasonry>
  ```
- **13-Ecosystem Portability**: Headless math engine coordinates across React, Next.js, Vue, Svelte, Angular, Solid, Astro, Blade, Vanilla, Gutenberg, Web Components, React Native, and Flutter.

---

### 2. Text Scramble (`text-scramble`)

- **Category**: Kinetic Typography / Disclosures
- **Visual Inspiration**: Raycast, David Haz, Vercel, Matrix / Cyberpunk deciphering.
- **The Problem with Existing Solutions**:
  - Naïve implementations replace strings of varying character widths (e.g. `'i'` vs `'W'`), causing the entire paragraph and container to rapidly jitter horizontally (massive CLS layout thrashing).
  - Often use `setInterval(..., 50)` which desynchronizes with display refresh rates and leaks timers on unmount.
- **The Exhuma Mathematical Solution**:
  - **Monospace Tabular Metric Preservation**: Injects `font-variant-numeric: tabular-nums` and character-slot isolation so every glyph occupies a fixed sub-pixel bounding box. Width variance $\Delta W = 0$, guaranteeing **$\Omega(1) \text{ CLS} = 0$**.
  - **Staggered Probability Resolution Curve**: For target string $S$ of length $L$ over duration $T$: Each character index $i$ has an individual resolution threshold:
    $$t_{\text{resolve}}(i) = T \cdot \left(\frac{i}{L}\right)^\gamma$$
    For $t < t_{\text{resolve}}(i)$: character displays a random glyph from a specialized charset ($\Sigma = \text{"!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}$).
    For $t \ge t_{\text{resolve}}(i)$: character locks permanently into $S[i]$.
  - **Triggering Modes**:
    - `trigger="hover"`: Decrypts when pointer enters, reverses or stays on leave.
    - `trigger="view"`: IntersectionObserver triggers upon scrolling into view.
    - `trigger="change"`: Smoothly morphs from `previousText` to `newText`.
- **Developer API**:
  ```tsx
  <TextScramble
    text='SECURE MAINFRAME ACCESSED'
    duration={800}
    characterSet='cyber'
    trigger='hover'
    onComplete={() => playAudioCue('access-granted')}
    className='font-mono text-emerald-400'
  />
  ```
- **13-Ecosystem Portability**: 100% pure string-manipulation math with zero dependencies. Runs identical logic from React to Svelte 5 runes, Angular Signals, and Flutter.

---

### 3. Text Shimmer (`text-shimmer`)

- **Category**: Kinetic Typography
- **Visual Inspiration**: Apple Keynote headers, Supercut, Linear marketing typography.
- **Kinetic Behavior**: An ultra-clean, iridescent specular luminance band continuously sweeps across typographic content, with configurable angle, spread, and hover speed acceleration.
- **Mathematical Invariant**:
  - **100% GPU Compositor Execution**: Implemented via CSS `background-clip: text` and GPU-accelerated gradient translation.
  - **Zero CPU main-thread budget ($\Omega(1)$ CPU usage)**: Zero JavaScript running during animation loops.
- **13-Ecosystem Portability**: Pure CSS variables and HTML markup for all web runtimes; native `ShaderMask` / `LinearGradient` in Flutter and React Native.

---

### 4. Shimmer Button (`shimmer-button`)

- **Category**: Kinetic Buttons & Actions
- **Visual Inspiration**: Magic UI, Linear, Vercel "Sweep Light" button.
- **The Exhuma Mathematical Solution**:
  - **Conic Laser Beam Geometry**: Uses a masked CSS pseudo-element with `background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--shimmer-color) 45deg, transparent 90deg)`. Rotates at sustained 60/120Hz GPU compositor rate. Conic angle vector:
    $$\theta(t) = (\omega \cdot t) \pmod{360^\circ}$$
  - **Tactile Spring Press**: On pointer down, scales to $0.96$ with dynamic radial shadow compression. On release, overshoots to $1.02$ before resting at $1.0$.
  - **Compositor Guarantee**: Zero layout thrashing: uses `transform: scale3d()` and pure compositor layers.
- **Developer API**:
  ```tsx
  <ShimmerButton shimmerColor='#6366f1' shimmerDuration='2.5s' borderRadius='9999px'>
    <span>Deploy Application</span>
  </ShimmerButton>
  ```
- **13-Ecosystem Portability**: Universal CSS border-masking across web targets; `CustomPainter` / path sweep in Flutter.

---

### 5. Unified 3D Coverflow & Carousel (`coverflow-carousel`)

- **Category**: Media & Carousels
- **Visual Inspiration**: Apple iTunes Coverflow, 3D Image Carousel, Tickets Viewer Carousel, Klarna Carousel.
- **The Problem with Existing Solutions**:
  - Most 3D carousels rely on heavy Three.js runtimes (200KB+) or clumsy jQuery-era hacks with fixed pixel coordinates.
  - Touch scrubbing feels robotic because inertial swipe momentum is not conserved when releasing a drag.
- **The Exhuma Mathematical Solution**:
  - **Parametric 3D Projection Engine**: Given normalized index offset $\delta = i - \text{currentIndex}$ (where $\delta \in \mathbb{R}$ during dragging):
    1. **Coverflow Mode**:
       $$x(\delta) = \text{sign}(\delta) \cdot (\text{cardWidth} \cdot 0.5 + |\delta| \cdot \text{spacing})$$
       $$z(\delta) = -|\delta| \cdot z_{\text{depth}}$$
       $$\theta_y(\delta) = -\text{clamp}(\delta \cdot \text{maxAngle}, -\text{maxAngle}, \text{maxAngle})$$
    2. **Cylinder / Rotary Wheel Mode**:
       $$\theta(\delta) = \delta \cdot \Delta\theta$$
       $$x(\delta) = R \cdot \sin(\theta)$$
       $$z(\delta) = R \cdot (1 - \cos(\theta))$$
       $$\theta_y(\delta) = -\theta$$
  - **Inertial Momentum Transfer**: On pointer release, track velocity $v_x$. The target snap index is determined by kinetic energy:
    $$\Delta \text{index} = \text{round}\left(\frac{v_x \cdot \tau}{\text{itemWidth}}\right)$$
    The snap transition is animated via a critically damped closed-form spring ($\zeta = 1.0$).
- **Developer API**:
  ```tsx
  <CoverflowCarousel
    projection='coverflow' // 'coverflow' | 'cylinder' | 'ticket-stack' | 'flat'
    spacing={80}
    maxAngle={45}
    depth={160}
    loop={true}
    perspective={1000}
  >
    {projects.map((p) => (
      <CoverflowCarousel.Card key={p.id}>
        <ProjectCard project={p} />
      </CoverflowCarousel.Card>
    ))}
  </CoverflowCarousel>
  ```
- **13-Ecosystem Portability**: Hardware transforms across all web engines and mobile platforms.

---

### 6. Mobile Gesture Drawer (`drawer`)

- **Category**: Kinetic Disclosures & Overlays
- **Visual Inspiration**: Emil Kowalski's Vaul, iOS native sheet modals.
- **The Problem with Existing Solutions**:
  - Modals on mobile feel clumsy when they cannot be naturally swiped down to dismiss.
  - Many drawer libraries fail to manage nested scrollables (dragging a scrollable list inside the drawer accidentally pulls the whole drawer down).
- **The Exhuma Mathematical Solution**:
  - **Nested Scroll Priority Arbiter**:
    - If content is scrolled down ($y_{\text{scroll}} > 0$), drag gestures are passed exclusively to native element scrolling.
    - When $y_{\text{scroll}} == 0$ and the user pulls downwards, gesture focus transitions to the drawer sheet with capture lock.
  - **Velocity-Threshold Commit**: Let $H$ be sheet height, $\Delta y$ be drag distance down, and $v_y$ be downward release velocity:
    $$\text{shouldDismiss} = \Delta y > 0.35 \cdot H \quad \lor \quad v_y > 450\text{ px/s}$$
    If dismissed, sheet translates to $+H$ with current velocity $v_y$. If aborted, snaps back to $y = 0$ with spring restitution.
  - **Background Scaling Decay**: Parent page background translates down $8\text{px}$ and scales to $0.94$ with border radius rounding ($12\text{px}$), reproducing the native iOS modal sheet aesthetic.
- **Developer API**:
  ```tsx
  <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
    <Drawer.Trigger asChild>
      <button className='btn'>Open Profile</button>
    </Drawer.Trigger>
    <Drawer.Overlay className='bg-black/60 backdrop-blur-sm' />
    <Drawer.Content className='rounded-t-3xl bg-zinc-900 p-6'>
      <Drawer.Handle className='mx-auto h-1.5 w-12 rounded-full bg-zinc-700' />
      <ProfileDetails />
    </Drawer.Content>
  </Drawer.Root>
  ```
- **13-Ecosystem Portability**: Idiomatic modal framing and gesture listeners across all 13 platforms.

---

### 7. Skeuomorphic Fluid Toggle Switch (`tactile-switch`)

- **Category**: Form Controls & Micro-Interactions
- **Visual Inspiration**: Satisfying Checkbox, Fluid Switches, Voicu's tactile toggles.
- **The Exhuma Mathematical Solution**:
  - **Liquid Thumb Stretch**: While dragging or toggling, the thumb pill stretches horizontally in the direction of motion:
    $$\text{scaleX} = 1 + \min\left(0.4, \frac{|\Delta x|}{W} \cdot 0.6\right)$$
  - **Tactile Snap**: Upon reaching the toggle threshold, snaps into place with a subtle spring bounce and optional micro-haptic click (`navigator.vibrate(6)`).
  - **Dual-Phase Spring Damping**: Uses critical damping ($\zeta = 1.0$) upon state commit for crisp, non-wobbly state lock.
- **13-Ecosystem Portability**: Accessible ARIA `role="switch"` and native form bindings across all 13 platforms.

---

### 8. Interactive Grid Pattern (`interactive-grid`)

- **Category**: Responsive Layouts & Backgrounds
- **Visual Inspiration**: Vercel, Resend, Clerk background grid patterns.
- **Kinetic Behavior**: An elegant orthogonal or isometric vector grid where individual tiles illuminate dynamically based on pointer proximity and velocity, masked by a smooth radial spotlight falloff.
- **Mathematical Invariant**:
  - Proximity falloff: $I(x, y) = \max\left(0, 1 - \frac{\sqrt{(x - x_0)^2 + (y - y_0)^2}}{R}\right)^\gamma$.
  - CSS custom properties (`--grid-x`, `--grid-y`) with hardware-accelerated radial masks.
  - Geometry cached on enter ($\Omega(1)$ DOM measurement guarantee).
- **13-Ecosystem Portability**: Dual-mode rendering: CSS SVG pattern with CSS variables for web; lightweight Canvas 2D buffer for native mobile.

---

### 9. Ambient Particle Field (`particle-field`)

- **Category**: Ambient Motion & Media
- **Visual Inspiration**: TSParticles, Benjamin's interactive canvas particles, Apple event ambient backdrops.
- **Kinetic Behavior**: Weightless floating dust motes or glowing particles drift through a container, elastically repelling when the pointer slices through them, with spring-driven return trajectories and velocity decay.
- **Mathematical Invariant**:
  - Flat typed array buffer (`Float32Array(6N)`) storing $[x, y, v_x, v_y, x_0, y_0]$ for zero GC pauses.
  - Spring-damper integration: $a = -\frac{k}{m}(p - p_0) - c \cdot v$.
  - Adaptive 60/120Hz rAF loop with automatic visibility pause via `IntersectionObserver`.
- **13-Ecosystem Portability**: Clean Canvas 2D context across all web runtimes, HTML5 canvas for Web Components, and `CustomPainter` for Flutter.

---

### 10. Curved / Vector Path Ticker (`path-marquee`)

- **Category**: Layouts & Typography
- **Visual Inspiration**: Curved Text Ticker, Ticker Path Component, Text Logo Loop Animation.
- **Kinetic Behavior**: Content or logos flow continuously along an arbitrary SVG vector path (circle, wave, arch, or custom bezier spine) using sub-pixel interpolation.
- **Mathematical Invariant**:
  - Pure SVG `textPath` `startOffset` or CSS `offset-path: path(...)` hardware-composited animation.
  - Zero layout calculation during active motion loop.
- **13-Ecosystem Portability**: Universal SVG for web targets, `PathMetric` in Flutter.

---

### 11. 3D Metallic Dual-Sided Flip Card (`flip-card`)

- **Category**: Cards & Displays
- **Visual Inspiration**: 3D Flipping Project Card, Airbnb 3D Card Flip, Metal Card Open.
- **Kinetic Behavior**: Dual-sided card with physical $180^\circ$ perspective flip on hover or trigger, specular metallic glare sweep, and backface visibility culling.
- **Mathematical Invariant**:
  - 3D Euler matrix flip with CSS `transform-style: preserve-3d` and `backface-visibility: hidden`.
- **13-Ecosystem Portability**: Standard CSS 3D across web; Matrix4 transform in Flutter.

---

### 12. X-Ray Dual-Layer Reveal Lens (`x-ray-lens`)

- **Category**: Interactive Media & Inspection
- **Visual Inspiration**: Cullen Webber, Apple hardware tear-downs, Stripe developer mode.
- **Kinetic Behavior**: An interactive circular flashlight lens following the cursor that reveals a hidden underlying layer (e.g. dark mode, wireframe, blueprints) beneath the surface.
- **Mathematical Invariant**:
  - Pure GPU compositor clipping: `clip-path: circle(var(--lens-radius, 120px) at var(--lens-x) var(--lens-y))`.
  - Zero DOM reflow ($\Omega(1)$ layout budget).
- **13-Ecosystem Portability**: Standard CSS clip-path mask for web; custom canvas mask in Flutter.

---

### 13. Interactive Reveal Scratch Card (`scratch-card`)

- **Category**: Gamification & Media
- **Visual Inspiration**: Josh Puckett, lottery scratch reveals, promotional coupon unlocks.
- **Kinetic Behavior**: An interactive foil mask that rubs away upon pointer/touch drag using HTML5 2D Canvas clipping (`destination-out`), with particle dust shavings and threshold event dispatch.
- **Mathematical Invariant**:
  - Incremental area calculation sampled on a coarse $16 \times 16$ grid to avoid heavy per-pixel CPU checks.
- **13-Ecosystem Portability**: Canvas 2D context in web targets; `CustomPainter` path erasure in Flutter.

---

### 14. Morphing Action Pill (`dynamic-island`)

- **Category**: Navigation & Status Widgets
- **Visual Inspiration**: Apple Dynamic Island, Raycast mini-status bar.
- **Kinetic Behavior**: A compact floating black pill that fluidly morphs its dimensions, border-radius, and interior content between compact, expanded, and minimal states with continuous spring physics.
- **Mathematical Invariant**:
  - Closed-form analytical spring integration on width/height/border-radius with pure CSS variables and state machine across all 13 platforms.

---

### 15. 3D Corner Peel Sticker (`sticker-peel`)

- **Category**: Tactile Micro-Physics
- **Visual Inspiration**: Framer Sticker Pack, Apple sticker sheets.
- **Kinetic Behavior**: A tactile sticker whose corner peels up based on pointer proximity or touch drag, curling in 3D with dynamic cast shadows and elastic spring snap-back.
- **Mathematical Invariant**:
  - Corner curl angle and shadow projection derived from drag distance and vector dot product.

---

### 16. Slide-to-Confirm Action Button (`swipe-button`)

- **Category**: Kinetic Actions
- **Visual Inspiration**: Jitter swipe button, iOS Slide-to-Power-Off.
- **Kinetic Behavior**: A horizontal swipe track where dragging an action thumb past a threshold ($x \ge 0.85 \cdot W$) triggers the confirmed action, featuring resistance rubber-banding at the right edge and instant spring snap-back.
- **Mathematical Invariant**:
  - Formally complete Exhuma gesture FSM with strict touch slop filtering to avoid capturing normal vertical page scroll.

---

### 17. Physics Particle Explosion (`confetti-burst`)

- **Category**: Celebration & Feedback
- **Visual Inspiration**: Canvas Confetti, Framer Exploding Tap.
- **Kinetic Behavior**: On-demand emission of confetti flakes from a click origin or element center with randomized initial velocities, gravity, air resistance, and 3D tumbling rotation.
- **Mathematical Invariant**:
  - Flat typed array buffer (`Float32Array`) with bounded lifespan and automatic loop termination.

---

### 18. Kinetic Click & Shockwave Canvas (`click-effects`)

- **Category**: Actions / Micro-FX
- **Visual Inspiration**: "Click Effects for Framer Websites", Stripe ripple taps, Material 3 tactile feedbacks.
- **Kinetic Behavior**: When the user clicks anywhere inside the target boundary or button, high-fidelity physical feedback is generated: expanding acoustic shockwave rings, directional particle splash, and dynamic surface depression.
- **Mathematical Invariant**:
  - Ring propagation uses exponential expansion: $r(t) = R_{\max} \cdot (1 - e^{-t/\tau})$, with opacity decaying as $\alpha(t) = \alpha_0 \cdot e^{-t/\tau_{\text{decay}}}$.
  - Micro-particles follow ballistic equations with air resistance: $\mathbf{v}(t) = \mathbf{v}_0 e^{-\gamma t}$, $\mathbf{p}(t) = \mathbf{p}_0 + \frac{\mathbf{v}_0}{\gamma}(1 - e^{-\gamma t}) + \frac{1}{2}\mathbf{g}t^2$.
  - Executed on a zero-overhead lightweight HTML5 `<canvas>` or GPU compositor CSS pseudo-elements to guarantee $\Omega(1)$ zero heap allocation.

---

### 19. Gravitational Repulsion Grid (`kinetic-grid`)

- **Category**: Layouts / Surfaces
- **Visual Inspiration**: Framer's "Kinetic Grid Component".
- **Kinetic Behavior**: A responsive grid of interactive cards or tiles that react to cursor proximity. Cells within an influence horizon elastically deflect away from the cursor along radial vectors, creating an authentic magnetic gravitational repulsion field.
- **Mathematical Invariant**:
  - Radial repulsion vector:
    $$\mathbf{F}_{\text{repel}}(\mathbf{r}) = \frac{\mathbf{r}_{\text{cell}} - \mathbf{r}_{\text{cursor}}}{\|\mathbf{r}_{\text{cell}} - \mathbf{r}_{\text{cursor}}\|^2 + \epsilon^2} \cdot K_{\text{force}}$$
  - Elastic restitution: each cell relaxes back to its rest coordinate via an analytical damped harmonic oscillator ($\zeta = 0.88, \omega_n = 24\text{ rad/s}$).

---

### 20. Harmonic Wave Shimmer Grid (`shimmer-grid`)

- **Category**: Layouts / Backgrounds
- **Visual Inspiration**: Framer's "Shimmer Grid Component".
- **Kinetic Behavior**: A 2D matrix of fine coordinate grid lines where continuous harmonic waves of luminescence sweep across orthogonal axes, creating an ambient living background for dark-mode interfaces.
- **Mathematical Invariant**:
  - 2D wave equation interference:
    $$I(x, y, t) = I_{\text{base}} + \Delta I \cdot \left[\sin(\omega t - k_x x) + \cos(\omega t - k_y y)\right]^2$$
  - Pure CSS / SVG stroke-dasharray and mask-image implementation for 100% GPU compositor offload with zero JavaScript animation tick budget.

---

### 21. Arbitrary SVG Path Laser Crawler (`svg-path-shimmer`)

- **Category**: Visual FX / Vector Kinetics
- **Visual Inspiration**: Framer's "SVG Path Shimmer Component".
- **Kinetic Behavior**: Generalizes Exhuma's `border-beam` from rectangular cards to any arbitrary SVG `<path>` (logos, icons, organic shapes, button contours). A sharp laser beam crawls continuously along the perimeter path at constant linear speed.
- **Mathematical Invariant**:
  - Arc-length parameterization:
    $$s(t) = (v \cdot t) \pmod L$$
    Where $L = \text{path.getTotalLength}()$. The beam head and tail coordinates are sampled in $O(1)$ constant time via `path.getPointAtLength(s)`.

---

### 22. Dual Conic Border Glow Button (`gradient-border-button`)

- **Category**: Actions / Kinetic Controls
- **Visual Inspiration**: Framer's "Gradient Border Button", Vercel / Linear glowing call-to-actions.
- **Kinetic Behavior**: An ultra-premium button featuring dual counter-rotating conic gradients trapped within a 1px border mask, coupled with an ambient drop-shadow glow and a tactile spring press response.
- **Mathematical Invariant**:
  - Counter-rotating angular velocities: $\theta_1(t) = \omega_1 t \pmod{360^\circ}$, $\theta_2(t) = -\omega_2 t \pmod{360^\circ}$.
  - On hover, angular velocity accelerates smoothly: $\omega(t) = \omega_{\text{rest}} + (\omega_{\text{hover}} - \omega_{\text{rest}})(1 - e^{-t/\tau})$.
  - Press compression: $\text{scale}(t) = 0.96$ with instantaneous elastic rebound overshoot on release ($1.02 \to 1.0$).

---

### 23. Inertial Scrubbing Ticker Track (`ticker-scroll`)

- **Category**: Typography / Media Marquees
- **Visual Inspiration**: Framer's "Ticker Scroll Component".
- **Kinetic Behavior**: An advanced ticker loop that seamlessly supports continuous auto-scroll, mouse grab-and-drag scrubbing, touch dragging, and momentum inertial fling release.
- **Mathematical Invariant**:
  - Multi-phase FSM: `AutoScrolling` ➔ `UserDragging` ➔ `InertialDecay` ➔ `AutoScrolling`.
  - Inertial decay velocity: $v(t) = v_{\text{release}} \cdot e^{-\gamma t}$. Once $|v(t)| \le v_{\text{base}}$, seamlessly transitions back to base speed with zero discontinuity.

---

### 24. Translucent Specular Radar Glow (`huly-effect`)

- **Category**: Cards / Ambient Illumination
- **Visual Inspiration**: "Huly Effect for Framer", Huly.io dark-mode interfaces.
- **Kinetic Behavior**: Dark translucent cards layered with frosted glass backdrop filters. As the cursor approaches, a radar glow pulse emanates outward from the cursor focus, casting dynamic specular highlights across glass borders and ambient textures.
- **Mathematical Invariant**:
  - Dual-layer light cone:
    $$I_{\text{surface}}(\mathbf{r}) = I_0 \cdot \exp\left(-\frac{\|\mathbf{r}\|^2}{2\sigma_{\text{ambient}}^2}\right)$$
    $$I_{\text{radar}}(\mathbf{r}, t) = A_{\text{pulse}} \cdot \exp\left(-\frac{(\|\mathbf{r}\| - v_{\text{pulse}}t)^2}{2\sigma_{\text{ring}}^2}\right) \cdot e^{-\lambda t}$$

---

### 25. 3D Perspective Card Conveyor (`card-scroll-animation`)

- **Category**: Carousels / Display Engines
- **Visual Inspiration**: Framer's "Card Animation On Scroll" & "Card Scroll Animation".
- **Architectural Rationale**: Kept strictly as an **independent, standalone future component** (leaving our existing production `stacking-cards` 100% stable, clean, and dedicated to pinned sticky stacks without risk of bloat or behavioral regression).
- **Kinetic Behavior**: An expansive 3D card conveyor where cards approach along the $Z$-axis, fold into view with authentic 3D spatial perspective rotation along the $X$-axis as the user scrolls, stay pinned during reading, and fold away as new cards enter.
- **Mathematical Invariant**:
  - As each card crosses the scroll intersection boundary, its normalized viewport progression $\phi_i(y) \in [0, 1]$ drives synchronous 3D un-folding, scale normalization, and blur dissipation:
    $$\theta_{x, i}(y) = 35^\circ \cdot (1 - \phi_i(y))^2 \quad (\text{rotates from } 35^\circ \to 0^\circ)$$
    $$s_i(y) = 0.92 + 0.08 \cdot \phi_i(y) \quad (\text{scales from } 0.92 \to 1.0)$$
    $$\sigma_{\text{blur}, i}(y) = 6\text{px} \cdot (1 - \phi_i(y)) \quad (\text{clears blur to } 0\text{px})$$
  - Full 3D spatial transformation matrix:
    $$\mathbf{T}(y) = \text{translate3d}(0, y_{\text{progress}}, z_{\text{depth}}) \cdot \text{rotateX}(\theta_{x, i}(y)) \cdot \text{scale}(s_i(y))$$
    Where $z_{\text{depth}} \in [-400\text{px}, 0\text{px}]$, executed on the GPU compositor thread with `transform-origin: 50% 0%` (top hinge).

---

### 26. Multi-Plane Isometric Stage (`isometric-hero`)

- **Category**: 3D / Hero Canvases
- **Visual Inspiration**: "Interactive Isometric 3D Hero" from Framer.
- **Kinetic Behavior**: An isometric 2.5D hero staging area where multi-layered UI mockups, icons, and graphic elements float in isometric space ($30^\circ$ pitch, $45^\circ$ yaw). Moving the cursor across the canvas causes layers to shift differentially based on their isometric depth plane, producing a physical miniature architectural diorama.
- **Mathematical Invariant**:
  - Isometric coordinate projection:
    $$x_{\text{iso}} = (x - y) \cdot \cos(30^\circ)$$
    $$y_{\text{iso}} = (x + y) \cdot \sin(30^\circ) - z$$
  - Cursor parallax displacement: $\Delta\mathbf{p}_k = (\Delta x_{\text{ptr}} \cdot \lambda_k, \Delta y_{\text{ptr}} \cdot \lambda_k)$, where $\lambda_k \propto z_k$ is the layer depth multiplier.

---

## 🔮 Post-Beta Wishlist & Expansion Suite (v1.1+)

These components are preserved on the post-beta roadmap due to external specification fragmentation or specialized graphics requirements:

### 1. Scroll Timeline (`scroll-timeline`)
- **Overview**: Continuous cubic-bezier SVG timeline connecting alternating milestone cards with a progress laser beam tied to page scroll.
- **Target**: v1.1+ (pending wider adoption of CSS `animation-timeline: scroll()` across older mobile WebViews).

### 2. Sticky Parallax Scroll (`sticky-parallax`)
- **Overview**: Pinned kinetic viewport staging rail driving differential speed planes ($y = \text{scroll} \times v_i$).
- **Target**: v1.1+ (mobile dynamic address bar `dvh` synchronization).

### 3. Sonner-Style Gestural Toast Stack (`toast-stack`)
- **Overview**: Tactile bottom-corner notification stack with auto-collapse, swipe-to-dismiss, expanding hover fan-out, and auto-dismiss countdown rails.
- **Target**: v1.1+

### 4. Circular Iris & Orbital Revealer (`radial-intro`)
- **Overview**: Expanding circular iris reveal / radial orbital node generation for hero sections and product intros.
- **Target**: v1.1+

### 5. Animated 3D Sphere (`animated-sphere`)
- **Overview**: 3D spherical particle system rendered via polar-to-Cartesian trigonometry and Euler rotation matrices.
- **Target**: v1.2+ (part of the upcoming `@exhuma/creative` 3D WebGL package).

---

## 🗺️ Phased Implementation Roadmap

```
Phase 1: High-Impact Core Primitives (Beta Expansion 20 → 25)
  ├── 1. row-masonry        (Macy EKM chronological layout engine - SHIPPED)
  ├── 2. text-scramble      (Cyberpunk/Raycast tabular decrypt typography)
  ├── 3. text-shimmer       (Linear/Apple 100% GPU specular gradient text)
  ├── 4. coverflow-carousel (Parametric 3D spatial carousel engine)
  ├── 5. shimmer-button     (Rotating laser glow action button)
  └── 6. drawer             (Vaul-style gestural bottom sheet modal)

Phase 2: Flagship Upgrades to Current 20 Components (Subject to User Review)
  ├── tilt-card diorama multi-plane depth (data-depth)
  ├── magnetic-button multi-layer label detachment
  ├── spotlight-card shared horizon grid bleed (SpotlightGroup)
  └── floating-dock vertical rail mode & haptics

Phase 3: Post-Beta Advanced Suite (v1.1+)
  ├── scroll-timeline (Bezier timeline laser trace)
  ├── sticky-parallax (Differential speed viewports)
  └── toast-stack (Sonner gestural notification stack)
```
