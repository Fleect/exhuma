# Cards Deep Dive (@fleect/exhuma-cards)

`@fleect/exhuma-cards` delivers high-performance tactile, gesture-driven, and scroll-reactive card components engineered for the GPU compositor thread with zero layout thrashing.

---

## 1. `<StackingCards>`

Renders stacked cards that pin at sticky thresholds and progressively decrease in scale as more cards layer above them. Features reverse scaling exit cascade mechanics.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `topStart` | `number` | `20` | Sticky start offset from top of viewport in px. |
| `topIncrement` | `number` | `28` | Additional top increment for each subsequent card in px. |
| `cardGap` / `gap` | `number \| string` | `20` | Vertical gap between cards before stacking. |
| `minScale` | `number` | `0.9` | Smallest scale factor reached by underlying cards (e.g. 0.9 = 90%). |
| `scaleThreshold` | `number` | `150` | Scroll distance in px over which progressive scaling occurs. |
| `reverseScale` / `enableReverseScale` | `boolean` | `true` | Enable reverse scaling exit cascade mechanics when unstacking. |
| `enabled` | `boolean` | `true` | Toggle dynamic stacking calculations. |
| `scrollContainerRef` | `RefObject<HTMLElement>` | `undefined` | Custom scroll container reference (if inside an overflow element). |
| `className` | `string` | `''` | Wrapper class name. |

### Usage

```tsx
import { StackingCards } from '@fleect/exhuma';

export function ProjectStack() {
  return (
    <StackingCards topStart={80} topIncrement={24} minScale={0.88}>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white">Project Alpha</h3>
        <p className="text-zinc-400 mt-2">Hardware-accelerated layout engine.</p>
      </div>
      <div className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white">Project Beta</h3>
        <p className="text-zinc-400 mt-2">Zero runtime animation dependencies.</p>
      </div>
    </StackingCards>
  );
}
```

---

## 2. `<TiltCard>`

Hardware-accelerated 3D perspective tilt card driven by normalized pointer vectors with optional specular glare reflection. Caches bounding geometry to eliminate forced synchronous reflows.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maxTilt` | `number` | `15` | Maximum tilt angle in degrees. |
| `perspective` | `number` | `1000` | 3D perspective depth in pixels. |
| `scale` | `number` | `1.02` | Scale factor applied on card hover. |
| `speed` | `number` | `0.12` | Spring damping response rate (0.05 to 0.30). |
| `reverse` | `boolean` | `false` | Invert tilt direction (tilts towards cursor when true). |
| `axis` | `'all' \| 'x' \| 'y'` | `'all'` | Constrain rotation axis ('x' = pitch only, 'y' = yaw only). |
| `glare` | `boolean` | `false` | Render a specular radial glare reflection layer. |
| `maxGlareOpacity` | `number` | `0.25` | Peak opacity of specular glare reflection layer [0..1]. |
| `disabled` | `boolean` | `false` | Programmatically disable tilt animations and glare. |
| `className` | `string` | `''` | Card container class name. |

### Usage

```tsx
import { TiltCard } from '@fleect/exhuma';

export function InteractiveTilt() {
  return (
    <TiltCard maxTilt={18} glare={true} maxGlareOpacity={0.3} className="w-80 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
      <h4 className="text-xl font-bold text-white">Tactile Surface</h4>
      <p className="text-sm text-zinc-400 mt-2">Smooth 3D rotation with specular glare.</p>
    </TiltCard>
  );
}
```

---

## 3. `<SpotlightCard>` & `<SpotlightGroup>`

Pointer-tracking radial spotlight glow with decoupled surface luminance and sub-pixel border highlights. When wrapped inside `<SpotlightGroup>`, pointer coordinates seamlessly illuminate sibling cards across the grid.

### Props (`SpotlightCard`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `radius` | `number` | `350` | Radius of the spotlight in pixels. |
| `color` | `string` | `'rgba(99, 102, 241, 0.25)'` | Spotlight surface glow color. |
| `borderColor` | `string` | `'rgba(99, 102, 241, 0.5)'` | Sub-pixel border highlight color. |
| `opacity` | `number` | `0.8` | Peak spotlight opacity when active (0.0 to 1.0). |
| `spread` | `number` | `80` | Radial gradient falloff softness percentage (20 to 100). |
| `mode` | `'both' \| 'border' \| 'background'` | `'both'` | Spotlight rendering target. |
| `smoothing` | `number` | `0.2` | Kinetic exponential smoothing factor (0.05 to 1.0). |
| `disabled` | `boolean` | `false` | Programmatically disable spotlight tracking. |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { SpotlightCard, SpotlightGroup } from '@fleect/exhuma';

export function SpotlightGrid() {
  return (
    <SpotlightGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SpotlightCard color="rgba(168, 85, 247, 0.25)" className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-lg font-bold text-white">Security First</h4>
        <p className="text-sm text-zinc-400 mt-2">Continuous hardware telemetry.</p>
      </SpotlightCard>
      <SpotlightCard color="rgba(168, 85, 247, 0.25)" className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-lg font-bold text-white">Global Edge</h4>
        <p className="text-sm text-zinc-400 mt-2">Zero-latency cache distribution.</p>
      </SpotlightCard>
    </SpotlightGroup>
  );
}
```

---

## 4. `<BorderBeam>`

GPU-composited perimeter border crawler using conic gradient calculation. Supports multi-beam phase crawls, bi-directional sweep, and Gaussian neon blur effects.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `number` | `200` | Size/length of the beam in pixels. |
| `duration` | `number` | `8` | Duration of one full orbit in seconds. |
| `borderWidth` | `number` | `2` | Width of the perimeter beam in pixels. |
| `colorFrom` | `string` | `'#ffaa40'` | Gradient start color. |
| `colorTo` | `string` | `'#9c40ff'` | Gradient end color. |
| `doubleBeam` | `boolean` | `false` | Orbit two opposing beams (180° phase offset). |
| `beamCount` | `number` | `1` | Equidistant beam count (1 to 8; overrides `doubleBeam`). |
| `reverse` | `boolean` | `false` | Reverse orbit direction (counter-clockwise). |
| `borderRadius` | `number` | `16` | Corner radius in pixels matching the parent card. |
| `blur` | `number` | `0` | Gaussian blur filter in px for neon laser glow. |
| `opacity` | `number` | `1` | Overall container opacity. |
| `endOpacity` | `number` | `0` | Tail opacity of the beam (0 fades to transparent). |

### Usage

```tsx
import { BorderBeam } from '@fleect/exhuma';

export function HighlightedCard() {
  return (
    <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 p-8 overflow-hidden">
      <BorderBeam size={250} duration={6} colorFrom="#38bdf8" colorTo="#818cf8" borderRadius={16} />
      <h3 className="text-xl font-bold text-white">Pro Tier</h3>
      <p className="text-sm text-zinc-400 mt-2">Active perimeter illumination.</p>
    </div>
  );
}
```

---

## 5. `<CardSwipeStack>`

Gestural swipe deck powered by a pre-allocated $\mathcal{O}(1)$ `Float64Array` velocity ring buffer. Supports 4-way gesture commitment, programmatic undo, and infinite deck recycling.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `T[]` | *required* | Data items array to render as cards. |
| `renderCard` | `(item: T, index: number) => ReactNode` | *required* | Card render function. |
| `onSwipe` | `(item: T, direction: 'left' \| 'right') => void` | `undefined` | Callback fired when a card commits past threshold. |
| `onUndo` | `(item: T) => void` | `undefined` | Callback fired when a card is restored via undo. |
| `thresholdDistance` | `number` | `120` | Drag distance in px required to commit a swipe. |
| `thresholdVelocity` | `number` | `550` | Flick velocity in px/s required to commit regardless of distance. |
| `maxRotation` | `number` | `20` | Maximum card tilt angle during horizontal drag. |
| `scaleStep` | `number` | `0.05` | Scale decrement per stack depth level. |
| `offsetStep` | `number` | `12` | Vertical pixel offset per stack depth level. |
| `maxVisible` | `number` | `3` | Maximum number of visible cards rendered simultaneously. |
| `loop` | `boolean` | `false` | When true, swiped cards return to the bottom of the stack. |
| `mode` | `'dismiss' \| 'recycle'` | `'dismiss'` | Alternative API for infinite deck recycling. |
| `preventLastCardDismiss` | `boolean` | `false` | Disallow swiping the final remaining card. |
| `emptyState` | `ReactNode` | `undefined` | Fallback content displayed when all cards are swiped. |

### Usage

```tsx
import { CardSwipeStack } from '@fleect/exhuma';

interface Profile { id: string; name: string; role: string; }

export function SwipeDeck({ profiles }: { profiles: Profile[] }) {
  return (
    <CardSwipeStack
      items={profiles}
      loop={true}
      renderCard={(profile) => (
        <div className="w-72 h-96 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
          <h4 className="text-xl font-bold text-white">{profile.name}</h4>
          <p className="text-zinc-400 text-sm mt-1">{profile.role}</p>
        </div>
      )}
      onSwipe={(item, dir) => console.log(`Swiped ${item.name} to ${dir}`)}
    />
  );
}
```

---

## 6. `<ComparisonSlider>`

Interactive before/after comparison slider utilizing GPU polygon `clip-path` masks. Supports horizontal and vertical slicing with full WAI-ARIA keyboard navigation (`Home`, `End`, Arrow keys).

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `before` | `ReactNode` | *required* | Content or media rendered on the 'before' layer. |
| `after` | `ReactNode` | *required* | Content or media rendered on the 'after' layer. |
| `defaultPosition` | `number` | `0.5` | Initial divider position (0.0 to 1.0). |
| `step` | `number` | `0.05` | Keyboard navigation step delta. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider split orientation axis. |
| `aspectRatio` | `string` | `'16/9'` | Container aspect ratio CSS token. |
| `disabled` | `boolean` | `false` | Disable pointer dragging and keyboard interaction. |
| `onPositionChange` | `(position: number) => void` | `undefined` | Callback fired when the split position updates. |
| `handleClassName` | `string` | `''` | CSS class name for the draggable divider bar. |
| `className` | `string` | `''` | Container class name. |

### Usage

```tsx
import { ComparisonSlider } from '@fleect/exhuma';

export function ImageComparison() {
  return (
    <ComparisonSlider
      before={<img src="/raw-render.png" alt="Raw render" className="w-full h-full object-cover" />}
      after={<img src="/post-fx.png" alt="Post FX" className="w-full h-full object-cover" />}
      aspectRatio="16/9"
      defaultPosition={0.5}
    />
  );
}
```

---

## 7. `<ExpandableCard>`

Bidirectional FLIP morphing expanding dialog card. Captures first and last layout bounding snapshots and morphs seamlessly via GPU `translate3d` and `scale3d` with zero layout thrashing. Features WAI-ARIA `dialog` semantics and Escape dismissal.

### Props (`ExpandableCardProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cardContent` | `ReactNode` | `undefined` | Collapsed card content. |
| `expandedContent` | `ReactNode` | `undefined` | Fullscreen or modal expanded content. |
| `duration` | `number` | `360` | Morphing animation duration in milliseconds. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when expanded state changes. |
| `portalContainer` | `HTMLElement` | `undefined` | Custom portal mount target (defaults to `document.body`). |
| `className` | `string` | `''` | Collapsed card container class name. |
| `expandedClassName` | `string` | `''` | Expanded dialog modal class name. |

### Compound Components

For advanced layouts, `<ExpandableCard>` exports composable compound components:
- `<ExpandableCard.Root>` — Context provider managing open/closed lifecycle.
- `<ExpandableCard.Trigger>` — Element that initiates the expansion animation.
- `<ExpandableCard.Content>` — Expanded modal container with backdrop and focus trap.
- `<ExpandableCard.Close>` — Dismissal trigger button.

### Usage

```tsx
import { ExpandableCard } from '@fleect/exhuma';

export function CaseStudy() {
  return (
    <ExpandableCard
      duration={400}
      cardContent={
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl cursor-pointer">
          <h4 className="text-lg font-bold text-white">Architecture Overview</h4>
          <p className="text-zinc-400 text-sm mt-2">Click to expand details.</p>
        </div>
      }
      expandedContent={
        <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl">
          <h3 className="text-2xl font-bold text-white">Full Architecture Blueprint</h3>
          <p className="text-zinc-400 mt-4 leading-relaxed">
            Detailed technical analysis of the zero-runtime Universal Component Model.
          </p>
        </div>
      }
    />
  );
}
```

---

## 8. `<HorizontalScroller>`

Translates standard vertical window scroll into a silky-smooth horizontal rail motion. Features gradient edge masks, bottom progress tracks, and mobile fallback modes.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `speed` | `number` | `1.0` | Scroll translation distance multiplier. |
| `itemGap` | `number` | `28` | Gap in pixels between cards on the track. |
| `cardWidth` | `number \| string` | `320` | Fixed width in pixels of individual cards. |
| `showProgress` | `boolean` | `true` | Display a kinetic bottom progress indicator track. |
| `showFadeEdges` | `boolean` | `true` | Apply gradient mask fading at horizontal boundaries. |
| `fadeWidth` | `number` | `48` | Width in pixels of left and right gradient fade masks. |
| `fadeEdgeColor` | `string` | `'#ffffff'` | Custom edge gradient color for light mode. |
| `fadeEdgeColorDark` | `string` | `'#09090b'` | Custom edge gradient color for dark mode. |
| `mobileMode` | `'scroll' \| 'stack' \| 'pinned'` | `'scroll'` | Mobile fallback below 768px ('scroll' = native touch swipe). |
| `header` | `ReactNode` | `undefined` | Fixed pinned header content displayed beside scrolling cards. |
| `scrollContainerRef` | `RefObject<HTMLElement>` | `undefined` | Custom scroll container reference. |
| `trackClassName` | `string` | `''` | Inner horizontal rail track class name. |
| `className` | `string` | `''` | Outer wrapper section class name. |

### Usage

```tsx
import { HorizontalScroller } from '@fleect/exhuma';

export function ProductShowcase({ products }: { products: { id: string; title: string }[] }) {
  return (
    <HorizontalScroller speed={1.2} itemGap={32} cardWidth={360}>
      {products.map((product) => (
        <div key={product.id} className="h-96 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-white">{product.title}</h3>
        </div>
      ))}
    </HorizontalScroller>
  );
}
```
