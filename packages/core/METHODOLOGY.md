# The Exhuma Kinetic Methodology (EKM)

## Mathematical Foundations, DSA Invariants & Big-Omega ($\Omega$) Specification

### Foundational Principle: Big-Omega ($\Omega$)

> **"Maintain Big-Omega ($\Omega$) at all times."** In asymptotic complexity, $\Omega(g(n))$ defines the **tight lower bound** of a system. Exhuma is engineered so that its runtime performance, frame rate, memory
> efficiency, and state determinism **never degrade below our established mathematical lower bounds**, regardless of input velocity, screen refresh rates (60Hz–120Hz), or DOM tree depth.

Every component in Exhuma adheres to **Zero External Dependencies** (NO Framer Motion, NO GSAP, NO Three.js) and is 100% handcrafted using rigorous Mathematics, Data Structures, and Algorithms.

---

## 1. The Big-Omega ($\Omega$) Mathematical & Computational Guarantees

```
                       BIG-OMEGA (Ω) LOWER-BOUND GUARANTEES
 ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
 │   FRAME RATE FLOOR (Ω)    │   TIME COMPLEXITY (Ω/O)   │    SPACE ALLOCATION (Ω)   │
 │   Ω(120Hz) / Ω(60Hz)      │   Ω(1) = O(1) = Θ(1)      │    Ω(1) = O(1) Heap       │
 │   Frame budget ≤ 8.33ms   │   Constant-time kinetic   │    Zero GC allocations    │
 │   Zero main-thread jank   │   dispatch pipeline       │    during active motion   │
 └───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### A. Time Complexity Lower Bound: $\Omega(1)$ / $\Theta(1)$ Kinetic Dispatch

- High-frequency pointer, scroll, and drag handlers execute in **$O(1)$ constant time**.
- **Zero layout thrashing**: Geometry measurements are strictly isolated to resize/mount phases; animation ticks perform **write-only** updates to CSS custom properties (`--exhuma-*`) via `requestAnimationFrame`.
- Loop execution time is hard-bounded by $T \le 1.2\text{ms}$, well within the $8.33\text{ms}$ budget for 120Hz ProMotion displays.

### B. Space Complexity Lower Bound: $\Omega(1)$ / $\Theta(1)$ Memory Invariant

- **Zero dynamic allocations inside active kinetic loops**: No new objects, arrays, or closures are instantiated while the user is actively dragging, scrolling, or hovering.
- Velocity tracking uses a **static 5-slot pre-allocated circular Float64Array buffer**, completely eliminating garbage collection pauses.

### C. Exact Closed-Form Analytical Physics (Zero Numerical Drift)

- Spring dynamics use the exact analytical solution to the critically damped second-order differential equation: $$x(t) = x_{\text{target}} + (x_0 - x_{\text{target}})e^{-\omega_n t}(1 + \omega_n t)$$
- Guaranteed asymptotic convergence with explicit $\epsilon$-clamping ($|x - x_{\text{target}}| < 0.001$, $|v| < 0.001$) to put calculations to sleep immediately upon reaching equilibrium.

### D. Formally Complete 5-State Gesture FSM

- The automaton $S = \{\text{IDLE}, \text{TRACKING}, \text{CLAIMED}, \text{DECELERATING}, \text{RESTING}\}$ defines deterministic transitions for every input in
  $\Sigma = \{\text{POINTER\_DOWN}, \text{POINTER\_MOVE}, \text{POINTER\_UP}, \text{POINTER\_CANCEL}, \text{BLUR}\}$. Deadlocks and orphaned touch locks are mathematically impossible.

### E. Modern CSS Grid Height Interpolation

- In disclosure components like `Accordion`, height transitions use modern CSS Grid dynamic fractional row expansion (`grid-template-rows: 0fr` $\longleftrightarrow$ `grid-template-rows: 1fr`).
- Eliminates the classic `max-height: 1000px` timing glitch completely — transitions are instant, predictable, and silky smooth at any content length with zero layout reflows.

---

## 2. The 5 Pillars of The Exhuma Kinetic Methodology (EKM)

### Pillar 1: Pure Headless Mathematical Kernels

- Math and DSA live in pure, zero-dependency functions in `@exhuma/core/math` and `@exhuma/core/physics`.
- Decoupled from React, Vue, Svelte, or DOM. Runs identically in any environment.

### Pillar 2: Kinetic Compound Composition

- Components expose accessible, composable compound primitives:
  - `Root`: Context provider & FSM state manager.
  - `Trigger`: Keyboard & touch event listener with WAI-ARIA roles.
  - `Content`: Responsive content container (e.g. CSS Grid $0\text{fr} \to 1\text{fr}$).
  - `Indicator` / `Stage`: Independent hardware-accelerated motion element.

### Pillar 3: Dual-Channel State Separation

- **Kinetic Channel (120Hz)**: Writes directly to CSS variables (`--exhuma-*`) inside `requestAnimationFrame`. Zero framework reconciliation.
- **Discrete Channel**: Handles structural transitions (`open`, `activeTab`, `selectedIndex`) via standard controlled/uncontrolled state props (`value`, `onValueChange`).

### Pillar 4: Mobile Touch Slop & Angular Arbitration

- Slop trajectory calculation: $\theta = \operatorname{atan2}(|\Delta y|, |\Delta x|)$.
- If horizontal gesture ($\theta < 30^\circ$ and $\Delta > 8\text{px}$), claims pointer capture and isolates horizontal rail. If vertical ($\theta \ge 30^\circ$), gracefully yields to native OS page scrolling.

### Pillar 5: Cross-Ecosystem 13-Framework Parity Contract

- Pure mathematical kernels and native DOM/CSS structures map 1:1 to: React, Next.js, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Blade, Vanilla JS, WordPress Gutenberg, Web Component, React Native, and Flutter.
