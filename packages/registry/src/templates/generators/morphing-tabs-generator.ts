import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getMorphingTabsOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const springStiffness = typeof props.springStiffness === 'number' ? props.springStiffness : Number(props.springStiffness ?? 26);
	const variant = String(props.variant || 'pill');
	const size = String(props.size || 'md');

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			if (!isEjected) {
				return [
					{
						filename: 'MorphingTabs.tsx',
						language: 'tsx',
						description: 'Morphing Tabs — Clean Shadcn-style compound component powered by @exhuma/core kinetic primitives.',
						code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import {
  TabsRoot as CoreTabsRoot,
  TabsList as CoreTabsList,
  TabsIndicator as CoreTabsIndicator,
  TabsTrigger as CoreTabsTrigger,
  TabsContent as CoreTabsContent,
  type TabsRootProps as CoreTabsRootProps,
  type TabsListProps as CoreTabsListProps,
  type TabsIndicatorProps as CoreTabsIndicatorProps,
  type TabsTriggerProps as CoreTabsTriggerProps,
  type TabsContentProps as CoreTabsContentProps,
} from '@exhuma/core';
import { clsx } from 'clsx';

export interface TabsRootProps extends CoreTabsRootProps {
  className?: string;
}

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, springStiffness = ${springStiffness}, variant = '${variant}', size = '${size}', ...props }, _ref) => (
    <CoreTabsRoot
      className={clsx('flex flex-col', className)}
      springStiffness={springStiffness}
      variant={variant as 'pill' | 'underline' | 'glow'}
      size={size as 'sm' | 'md' | 'lg'}
      {...props}
    />
  )
);
TabsRoot.displayName = 'TabsRoot';

export interface TabsListProps extends CoreTabsListProps {
  className?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, _ref) => (
    <CoreTabsList
      className={clsx(className)}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

export interface TabsIndicatorProps extends CoreTabsIndicatorProps {
  className?: string;
}

export const TabsIndicator = React.forwardRef<HTMLDivElement, TabsIndicatorProps>(
  ({ className, ...props }, _ref) => (
    <CoreTabsIndicator
      className={clsx(className)}
      {...props}
    />
  )
);
TabsIndicator.displayName = 'TabsIndicator';

export interface TabsTriggerProps extends CoreTabsTriggerProps {
  className?: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, _ref) => (
    <CoreTabsTrigger
      className={clsx(className)}
      {...props}
    />
  )
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends CoreTabsContentProps {
  className?: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, _ref) => (
    <CoreTabsContent
      className={clsx('mt-4 focus-visible:outline-none', className)}
      {...props}
    />
  )
);
TabsContent.displayName = 'TabsContent';

export const MorphingTabs = {
  Root: TabsRoot,
  List: TabsList,
  Indicator: TabsIndicator,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

export default MorphingTabs;
`,
					},
				];
			}

			// Ejected React / Next.js implementation
			return [
				{
					filename: 'MorphingTabs.tsx',
					language: 'tsx',
					description: 'Morphing Tabs — Standalone Ejected Engine (Zero Dependencies). Inlines exact analytical spring ODE, active rect geometry tracking, and circular modulo WAI-ARIA roving focus.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { clsx } from 'clsx';

/**
 * Analytical Critically Damped Spring Solver (EKM Big-Omega)
 * Closed-form analytical solution: x(t) = target + (c1 + c2*t) * e^(-omega*t)
 */
export function solveCriticallyDampedSpring(
  current: number,
  target: number,
  velocity: number,
  dt: number,
  config: { omega?: number; restThreshold?: number } = {}
) {
  const omega = config.omega ?? 26;
  const restThreshold = config.restThreshold ?? 0.001;

  const x0 = current - target;
  const c1 = x0;
  const c2 = velocity + omega * x0;

  const decay = Math.exp(-omega * dt);
  const position = target + (c1 + c2 * dt) * decay;
  const newVelocity = (c2 - omega * (c1 + c2 * dt)) * decay;

  const isSettled = Math.abs(position - target) < restThreshold && Math.abs(newVelocity) < restThreshold;

  return {
    position: isSettled ? target : position,
    velocity: isSettled ? 0 : newVelocity,
    isSettled,
  };
}

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  registerTrigger: (val: string, el: HTMLElement | null) => void;
  activeRect: { x: number; y: number; width: number; height: number } | null;
  baseId: string;
  triggers: string[];
  springStiffness?: number;
  variant?: 'pill' | 'underline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error('MorphingTabs compound components must be rendered inside <MorphingTabs.Root>');
  }
  return ctx;
}

export interface TabsRootProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  springStiffness?: number;
  variant?: 'pill' | 'underline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const TabsRoot: React.FC<TabsRootProps> = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className = '',
  springStiffness = ${springStiffness},
  variant = '${variant}',
  size = '${size}',
}) => {
  const baseId = React.useId();
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const triggerElements = React.useRef<Map<string, HTMLElement>>(new Map());
  const [triggersList, setTriggersList] = React.useState<string[]>([]);
  const [activeRect, setActiveRect] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
    },
    [isControlled, onValueChange]
  );

  const registerTrigger = React.useCallback((val: string, el: HTMLElement | null) => {
    if (el) {
      triggerElements.current.set(val, el);
    } else {
      triggerElements.current.delete(val);
    }
    setTriggersList(Array.from(triggerElements.current.keys()));
  }, []);

  const measureActive = React.useCallback(() => {
    const el = triggerElements.current.get(activeValue);
    if (!el) {
      setActiveRect(null);
      return;
    }

    const listEl = el.parentElement;
    if (!listEl) return;

    setActiveRect({
      x: el.offsetLeft,
      y: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  }, [activeValue]);

  React.useEffect(() => {
    let rafId: number | null = requestAnimationFrame(measureActive);

    const handleResize = () => {
      measureActive();
    };

    window.addEventListener('resize', handleResize);

    const el = triggerElements.current.get(activeValue);
    const listEl = el?.parentElement;
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && listEl) {
      observer = new ResizeObserver(() => {
        measureActive();
      });
      observer.observe(listEl);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, [measureActive, size, variant, activeValue]);

  return (
    <TabsContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleValueChange,
        registerTrigger,
        activeRect,
        baseId,
        triggers: triggersList,
        springStiffness,
        variant,
        size,
      }}
    >
      <div className={clsx('exhuma-tabs-root flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '', ...props }) => {
  const { value, onValueChange, triggers, variant } = useTabsContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (triggers.length === 0) return;
    const currentIndex = triggers.indexOf(value);

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = triggers.length - 1;
    }

    if (nextIndex !== currentIndex && triggers[nextIndex]) {
      const nextVal = triggers[nextIndex]!;
      onValueChange(nextVal);
      const nextTrigger = e.currentTarget.querySelector<HTMLButtonElement>(\`[data-value="\${nextVal}"]\`) ?? e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex] ?? null;
      nextTrigger?.focus();
    }
  };

  const listVariantStyles =
    variant === 'underline'
      ? 'border-b border-neutral-200/80 dark:border-neutral-800/80 bg-transparent rounded-none p-0 pb-1 gap-2'
      : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm';

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={clsx('exhuma-tabs-list relative flex items-center gap-1', listVariantStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  springStiffness?: number;
  variant?: 'pill' | 'underline' | 'glow';
}

export const TabsIndicator: React.FC<TabsIndicatorProps> = ({
  className = '',
  style,
  springStiffness: propSpringStiffness,
  variant: propVariant,
  ...props
}) => {
  const ctx = useTabsContext();
  const activeRect = ctx.activeRect;
  const variant = propVariant ?? ctx.variant ?? 'pill';
  const omega = propSpringStiffness ?? ctx.springStiffness ?? 26;

  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const activeRectRef = React.useRef(activeRect);
  activeRectRef.current = activeRect;

  const omegaRef = React.useRef(omega);
  omegaRef.current = omega;

  const variantRef = React.useRef(variant);
  variantRef.current = variant;

  const currentX = React.useRef(0);
  const currentW = React.useRef(0);
  const velX = React.useRef(0);
  const velW = React.useRef(0);
  const rafIdRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number>(0);

  const updateSpring = React.useCallback((timestamp: number) => {
    const rect = activeRectRef.current;
    if (!indicatorRef.current || !rect) return;

    const dt = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = timestamp;

    const currentOmega = omegaRef.current;
    const currentVariant = variantRef.current;

    let targetY = rect.y;
    let targetH = rect.height;
    if (currentVariant === 'underline') {
      targetY = rect.y + rect.height - 2;
      targetH = 2;
    }

    const springX = solveCriticallyDampedSpring(currentX.current, rect.x, velX.current, dt, { omega: currentOmega });
    const springW = solveCriticallyDampedSpring(currentW.current, rect.width, velW.current, dt, { omega: currentOmega });

    currentX.current = springX.position;
    velX.current = springX.velocity;
    currentW.current = springW.position;
    velW.current = springW.velocity;

    indicatorRef.current.style.transform = \`translate3d(\${currentX.current.toFixed(2)}px, \${targetY.toFixed(2)}px, 0)\`;
    indicatorRef.current.style.width = \`\${currentW.current.toFixed(2)}px\`;
    indicatorRef.current.style.height = \`\${targetH}px\`;

    if (!springX.isSettled || !springW.isSettled) {
      rafIdRef.current = requestAnimationFrame(updateSpring);
    } else {
      rafIdRef.current = null;
      lastTimeRef.current = 0;
    }
  }, []);

  // Immediate geometry synchronizer when variant or activeRect changes
  React.useEffect(() => {
    if (!indicatorRef.current || !activeRect) return;

    let targetY = activeRect.y;
    let targetH = activeRect.height;
    if (variant === 'underline') {
      targetY = activeRect.y + activeRect.height - 2;
      targetH = 2;
    }

    indicatorRef.current.style.height = \`\${targetH}px\`;
    indicatorRef.current.style.transform = \`translate3d(\${(currentX.current || activeRect.x).toFixed(2)}px, \${targetY.toFixed(2)}px, 0)\`;

    if (currentW.current === 0) {
      currentX.current = activeRect.x;
      currentW.current = activeRect.width;
      indicatorRef.current.style.width = \`\${activeRect.width}px\`;
    } else if (rafIdRef.current === null) {
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(updateSpring);
    }
  }, [variant, activeRect, updateSpring]);

  React.useEffect(() => {
    if (!activeRect) return;

    if (rafIdRef.current === null) {
      lastTimeRef.current = 0;
      rafIdRef.current = requestAnimationFrame(updateSpring);
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [activeRect, updateSpring]);

  if (!activeRect) return null;

  const variantStyles =
    variant === 'underline'
      ? 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
      : variant === 'glow'
        ? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]'
        : 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md';

  return (
    <div
      ref={indicatorRef}
      aria-hidden="true"
      className={clsx('exhuma-tabs-indicator pointer-events-none absolute top-0 left-0', variantStyles, className)}
      style={{
        willChange: 'transform, width',
        transition: 'height 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease',
        ...style,
      }}
      {...props}
    />
  );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '', size: propSize, ...props }) => {
  const ctx = useTabsContext();
  const activeValue = ctx.value;
  const isSelected = activeValue === value;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const size = propSize ?? ctx.size ?? 'md';
  const variant = ctx.variant ?? 'pill';

  React.useEffect(() => {
    ctx.registerTrigger(value, triggerRef.current);
    return () => ctx.registerTrigger(value, null);
  }, [value, ctx.registerTrigger]);

  const id = \`\${ctx.baseId}-trigger-\${value}\`;
  const panelId = \`\${ctx.baseId}-panel-\${value}\`;

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : size === 'lg'
        ? 'px-6 py-3 text-base'
        : 'px-4 py-2 text-sm';

  const activeTextClasses =
    isSelected
      ? variant === 'underline'
        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
        : variant === 'glow'
          ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
          : 'text-neutral-900 dark:text-white font-semibold'
      : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200';

  return (
    <button
      ref={triggerRef}
      role="tab"
      id={id}
      data-value={value}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      type="button"
      onClick={() => ctx.onValueChange(value)}
      className={clsx(
        'exhuma-tabs-trigger focus-visible:ring-primary relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl',
        sizeClasses,
        activeTextClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '', ...props }) => {
  const { value: activeValue, baseId } = useTabsContext();
  const isSelected = activeValue === value;

  const id = \`\${baseId}-panel-\${value}\`;
  const triggerId = \`\${baseId}-trigger-\${value}\`;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={triggerId}
      tabIndex={0}
      className={clsx('exhuma-tabs-content focus-visible:ring-primary mt-4 focus-visible:ring-2 focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const MorphingTabs = {
  Root: TabsRoot,
  List: TabsList,
  Indicator: TabsIndicator,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

export default MorphingTabs;
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'MorphingTabs.vue',
					language: 'vue',
					description: 'Morphing Tabs — Vue 3 SFC with dynamic active rect tracking, spring physics, and roving keyboard focus.',
					code: `<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

export interface TabItem {
  id: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    items?: TabItem[];
    springStiffness?: number;
    variant?: 'pill' | 'underline' | 'glow';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    modelValue: '',
    items: () => [],
    springStiffness: ${springStiffness},
    variant: '${variant}',
    size: '${size}',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const listRef = ref<HTMLElement | null>(null);
const activeTab = ref(props.modelValue || (props.items[0]?.id ?? ''));
const indicatorStyle = ref<Record<string, string>>({});

function measureActiveTab() {
  if (!listRef.value) return;
  const activeEl = listRef.value.querySelector<HTMLElement>(\`[data-tab-id="\${activeTab.value}"]\`);
  if (!activeEl) return;

  const x = activeEl.offsetLeft;
  const w = activeEl.offsetWidth;
  const h = props.variant === 'underline' ? 2 : activeEl.offsetHeight;
  const y = props.variant === 'underline' ? activeEl.offsetTop + activeEl.offsetHeight - 2 : activeEl.offsetTop;

  indicatorStyle.value = {
    transform: \`translate3d(\${x}px, \${y}px, 0)\`,
    width: \`\${w}px\`,
    height: \`\${h}px\`,
    transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  };
}

function selectTab(id: string) {
  activeTab.value = id;
  emit('update:modelValue', id);
  nextTick(measureActiveTab);
}

function handleKeyDown(e: KeyboardEvent) {
  const items = props.items;
  if (!items || items.length === 0) return;
  const currentIndex = items.findIndex((item) => item.id === activeTab.value);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    nextIndex = (currentIndex + 1) % items.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    nextIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (e.key === 'Home') {
    e.preventDefault();
    nextIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    nextIndex = items.length - 1;
  }

  if (nextIndex !== currentIndex && items[nextIndex]) {
    selectTab(items[nextIndex].id);
    const targetBtn = listRef.value?.querySelector<HTMLButtonElement>(\`[data-tab-id="\${items[nextIndex].id}"]\`);
    targetBtn?.focus();
  }
}

watch([() => props.modelValue, () => props.variant, () => props.size], () => {
  if (props.modelValue && props.modelValue !== activeTab.value) {
    activeTab.value = props.modelValue;
  }
  nextTick(measureActiveTab);
});

onMounted(() => {
  measureActiveTab();
  window.addEventListener('resize', measureActiveTab);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureActiveTab);
});
</script>

<template>
  <div class="exhuma-morphing-tabs flex flex-col">
    <div
      ref="listRef"
      role="tablist"
      aria-orientation="horizontal"
      @keydown="handleKeyDown"
      :class="[
        'relative flex items-center gap-1',
        variant === 'underline'
          ? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80'
          : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm'
      ]"
    >
      <!-- Kinetic Morphing Indicator -->
      <div
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute top-0 left-0',
          variant === 'underline'
            ? 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
            : variant === 'glow'
              ? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]'
              : 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md'
        ]"
        :style="indicatorStyle"
      />

      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        role="tab"
        :data-tab-id="item.id"
        :aria-selected="activeTab === item.id"
        :tabindex="activeTab === item.id ? 0 : -1"
        @click="selectTab(item.id)"
        :class="[
          'relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl',
          size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm',
          activeTab === item.id
            ? (variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold')
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
        ]"
      >
        {{ item.label }}
      </button>
    </div>

    <!-- Tab Content Slot -->
    <div class="mt-4">
      <slot :activeTab="activeTab" />
    </div>
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'MorphingTabs.svelte',
					language: 'svelte',
					description: 'Morphing Tabs — Svelte 5 component with runes, active rect tracking, and WAI-ARIA roving focus.',
					code: `<script lang="ts">
  import { onMount } from 'svelte';

  interface TabItem {
    id: string;
    label: string;
  }

  let {
    items = [] as TabItem[],
    value = $bindable(items[0]?.id ?? ''),
    springStiffness = ${springStiffness},
    variant = '${variant}',
    size = '${size}',
    children
  } = $props<{
    items?: TabItem[];
    value?: string;
    springStiffness?: number;
    variant?: 'pill' | 'underline' | 'glow';
    size?: 'sm' | 'md' | 'lg';
    children?: any;
  }>();

  let listEl: HTMLElement | null = $state(null);
  let indicatorStyle = $state('');

  function measureActiveTab() {
    if (!listEl) return;
    const activeEl = listEl.querySelector<HTMLElement>(\`[data-tab-id="\${value}"]\`);
    if (!activeEl) return;

    const x = activeEl.offsetLeft;
    const w = activeEl.offsetWidth;
    const h = variant === 'underline' ? 2 : activeEl.offsetHeight;
    const y = variant === 'underline' ? activeEl.offsetTop + activeEl.offsetHeight - 2 : activeEl.offsetTop;

    indicatorStyle = \`transform: translate3d(\${x}px, \${y}px, 0); width: \${w}px; height: \${h}px; transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);\`;
  }

  function selectTab(id: string) {
    value = id;
    requestAnimationFrame(measureActiveTab);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!items || items.length === 0) return;
    const currentIndex = items.findIndex((item) => item.id === value);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== currentIndex && items[nextIndex]) {
      selectTab(items[nextIndex].id);
      const targetBtn = listEl?.querySelector<HTMLButtonElement>(\`[data-tab-id="\${items[nextIndex].id}"]\`);
      targetBtn?.focus();
    }
  }

  $effect(() => {
    if (value || variant || size) {
      requestAnimationFrame(measureActiveTab);
    }
  });

  onMount(() => {
    measureActiveTab();
    window.addEventListener('resize', measureActiveTab);
    return () => window.removeEventListener('resize', measureActiveTab);
  });
</script>

<div class="exhuma-morphing-tabs flex flex-col">
  <div
    bind:this={listEl}
    role="tablist"
    aria-orientation="horizontal"
    onkeydown={handleKeyDown}
    class="relative flex items-center gap-1 {variant === 'underline' ? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80' : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm'}"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-0 left-0 {variant === 'underline' ? 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : variant === 'glow' ? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]' : 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md'}"
      style={indicatorStyle}
    ></div>

    {#each items as item (item.id)}
      <button
        type="button"
        role="tab"
        data-tab-id={item.id}
        aria-selected={value === item.id}
        tabindex={value === item.id ? 0 : -1}
        onclick={() => selectTab(item.id)}
        class="relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl {size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} {value === item.id ? (variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold') : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
      >
        {item.label}
      </button>
    {/each}
  </div>

  <div class="mt-4">
    {@render children?.()}
  </div>
</div>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'MorphingTabs.tsx',
					language: 'tsx',
					description: 'Morphing Tabs — SolidJS component with reactive signals and roving focus.',
					code: `import { createSignal, onMount, onCleanup, createEffect, For, JSX } from 'solid-js';

export interface TabItem {
  id: string;
  label: string;
}

export interface MorphingTabsProps {
  items: TabItem[];
  value?: string;
  onValueChange?: (val: string) => void;
  springStiffness?: number;
  variant?: 'pill' | 'underline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  children?: JSX.Element;
}

export function MorphingTabs(props: MorphingTabsProps) {
  let listRef: HTMLDivElement | undefined;
  const [activeTab, setActiveTab] = createSignal(props.value || props.items[0]?.id || '');
  const [indicatorStyle, setIndicatorStyle] = createSignal<JSX.CSSProperties>({});

  const measureActiveTab = () => {
    if (!listRef) return;
    const activeEl = listRef.querySelector<HTMLElement>(\`[data-tab-id="\${activeTab()}"]\`);
    if (!activeEl) return;

    const x = activeEl.offsetLeft;
    const w = activeEl.offsetWidth;
    const isUnderline = (props.variant || '${variant}') === 'underline';
    const h = isUnderline ? 2 : activeEl.offsetHeight;
    const y = isUnderline ? activeEl.offsetTop + activeEl.offsetHeight - 2 : activeEl.offsetTop;

    setIndicatorStyle({
      transform: \`translate3d(\${x}px, \${y}px, 0)\`,
      width: \`\${w}px\`,
      height: \`\${h}px\`,
      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  createEffect(() => {
    activeTab();
    props.variant;
    props.size;
    requestAnimationFrame(measureActiveTab);
  });

  const selectTab = (id: string) => {
    setActiveTab(id);
    props.onValueChange?.(id);
    requestAnimationFrame(measureActiveTab);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = props.items;
    if (!items || items.length === 0) return;
    const currentIndex = items.findIndex((item) => item.id === activeTab());
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== currentIndex && items[nextIndex]) {
      selectTab(items[nextIndex].id);
      const targetBtn = listRef?.querySelector<HTMLButtonElement>(\`[data-tab-id="\${items[nextIndex].id}"]\`);
      targetBtn?.focus();
    }
  };

  onMount(() => {
    measureActiveTab();
    window.addEventListener('resize', measureActiveTab);
  });

  onCleanup(() => {
    window.removeEventListener('resize', measureActiveTab);
  });

  const variantClass = () => {
    const v = props.variant || '${variant}';
    if (v === 'underline') return 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]';
    if (v === 'glow') return 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]';
    return 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md';
  };

  const listClass = () => {
    const v = props.variant || '${variant}';
    if (v === 'underline') return 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80';
    return 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm';
  };

  const sizeClass = () => {
    const s = props.size || '${size}';
    if (s === 'sm') return 'px-3 py-1.5 text-xs';
    if (s === 'lg') return 'px-6 py-3 text-base';
    return 'px-4 py-2 text-sm';
  };

  return (
    <div class="exhuma-morphing-tabs flex flex-col">
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        class={\`relative flex items-center gap-1 \${listClass()}\`}
      >
        <div
          aria-hidden="true"
          class={\`pointer-events-none absolute top-0 left-0 \${variantClass()}\`}
          style={indicatorStyle()}
        />

        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              role="tab"
              data-tab-id={item.id}
              aria-selected={activeTab() === item.id}
              tabIndex={activeTab() === item.id ? 0 : -1}
              onClick={() => selectTab(item.id)}
              class={\`relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl \${sizeClass()} \${
                activeTab() === item.id
                  ? (props.variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : props.variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold')
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }\`}
            >
              {item.label}
            </button>
          )}
        </For>
      </div>

      <div class="mt-4">{props.children}</div>
    </div>
  );
}

export default MorphingTabs;
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'morphing-tabs.component.ts',
					language: 'typescript',
					description: 'Morphing Tabs — Angular 18+ standalone component with signals and keyboard roving focus.',
					code: `import { Component, Input, Output, EventEmitter, signal, ElementRef, ViewChild, AfterViewInit, HostListener, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
}

@Component({
  selector: 'exhuma-morphing-tabs',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="exhuma-morphing-tabs flex flex-col">
      <div
        #listRef
        role="tablist"
        aria-orientation="horizontal"
        (keydown)="handleKeyDown($event)"
        class="relative flex items-center gap-1"
        [ngClass]="listClass()"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-0 left-0"
          [ngClass]="indicatorClass()"
          [ngStyle]="indicatorStyle()"
        ></div>

        <button
          *ngFor="let item of items"
          type="button"
          role="tab"
          [attr.data-tab-id]="item.id"
          [attr.aria-selected]="activeTab() === item.id"
          [attr.tabindex]="activeTab() === item.id ? 0 : -1"
          (click)="selectTab(item.id)"
          class="relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl"
          [ngClass]="[
            sizeClass(),
            activeTab() === item.id
              ? (variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold')
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
          ]"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="mt-4">
        <ng-content></ng-content>
      </div>
    </div>
  \`,
})
export class MorphingTabsComponent implements AfterViewInit, OnChanges {
  @Input() items: TabItem[] = [];
  @Input() springStiffness = ${springStiffness};
  @Input() variant: 'pill' | 'underline' | 'glow' = '${variant}';
  @Input() size: 'sm' | 'md' | 'lg' = '${size}';

  @Output() tabChange = new EventEmitter<string>();
  @ViewChild('listRef') listRef!: ElementRef<HTMLDivElement>;

  activeTab = signal<string>('');
  indicatorStyle = signal<Record<string, string>>({});

  indicatorClass = computed(() => {
    if (this.variant === 'underline') return 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]';
    if (this.variant === 'glow') return 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]';
    return 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md';
  });

  listClass = computed(() => {
    if (this.variant === 'underline') return 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80';
    return 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm';
  });

  sizeClass = computed(() => {
    if (this.size === 'sm') return 'px-3 py-1.5 text-xs';
    if (this.size === 'lg') return 'px-6 py-3 text-base';
    return 'px-4 py-2 text-sm';
  });

  ngAfterViewInit() {
    if (this.items.length > 0 && !this.activeTab()) {
      this.activeTab.set(this.items[0]!.id);
    }
    setTimeout(() => this.measureActiveTab(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variant'] || changes['size'] || changes['items']) {
      setTimeout(() => this.measureActiveTab(), 0);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.measureActiveTab();
  }

  selectTab(id: string) {
    this.activeTab.set(id);
    this.tabChange.emit(id);
    setTimeout(() => this.measureActiveTab(), 0);
  }

  measureActiveTab() {
    if (!this.listRef) return;
    const listEl = this.listRef.nativeElement;
    const activeEl = listEl.querySelector<HTMLElement>(\`[data-tab-id="\${this.activeTab()}"]\`);
    if (!activeEl) return;

    const x = activeEl.offsetLeft;
    const w = activeEl.offsetWidth;
    const isUnderline = this.variant === 'underline';
    const h = isUnderline ? 2 : activeEl.offsetHeight;
    const y = isUnderline ? activeEl.offsetTop + activeEl.offsetHeight - 2 : activeEl.offsetTop;

    this.indicatorStyle.set({
      transform: \`translate3d(\${x}px, \${y}px, 0)\`,
      width: \`\${w}px\`,
      height: \`\${h}px\`,
      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  }

  handleKeyDown(e: KeyboardEvent) {
    if (this.items.length === 0) return;
    const currentIndex = this.items.findIndex((item) => item.id === this.activeTab());
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % this.items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + this.items.length) % this.items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = this.items.length - 1;
    }

    if (nextIndex !== currentIndex && this.items[nextIndex]) {
      this.selectTab(this.items[nextIndex]!.id);
      const targetBtn = this.listRef.nativeElement.querySelector<HTMLButtonElement>(\`[data-tab-id="\${this.items[nextIndex]!.id}"]\`);
      targetBtn?.focus();
    }
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'MorphingTabs.astro',
					language: 'astro',
					description: 'Morphing Tabs — Astro component with client-side progressive enhancement.',
					code: `---
export interface TabItem {
  id: string;
  label: string;
}

interface Props {
  items: TabItem[];
  defaultTab?: string;
  springStiffness?: number;
  variant?: 'pill' | 'underline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const {
  items = [],
  defaultTab = items[0]?.id ?? '',
  springStiffness = ${springStiffness},
  variant = '${variant}',
  size = '${size}',
  class: className = '',
} = Astro.props;

const variantClass =
  variant === 'underline'
    ? 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
    : variant === 'glow'
      ? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]'
      : 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md';

const listClass =
  variant === 'underline'
    ? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80'
    : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm';

const sizeClass =
  size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';
---

<div class:list={['exhuma-morphing-tabs flex flex-col', className]} data-variant={variant}>
  <div
    role="tablist"
    aria-orientation="horizontal"
    class:list={['morphing-tabs-list relative flex items-center gap-1', listClass]}
  >
    <div
      aria-hidden="true"
      class:list={['morphing-tabs-indicator pointer-events-none absolute top-0 left-0', variantClass]}
      style="will-change: transform, width; transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);"
    ></div>

    {items.map((item) => (
      <button
        type="button"
        role="tab"
        data-tab-id={item.id}
        aria-selected={item.id === defaultTab ? 'true' : 'false'}
        tabindex={item.id === defaultTab ? 0 : -1}
        class:list={[
          'morphing-tab-btn relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl',
          sizeClass,
          item.id === defaultTab
            ? (variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold')
            : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
        ]}
      >
        {item.label}
      </button>
    ))}
  </div>

  <div class="morphing-tabs-panels mt-4">
    <slot />
  </div>
</div>

<script>
  function initTabs() {
    document.querySelectorAll<HTMLElement>('.exhuma-morphing-tabs').forEach((tabsEl) => {
      const listEl = tabsEl.querySelector<HTMLElement>('.morphing-tabs-list');
      const indicator = tabsEl.querySelector<HTMLElement>('.morphing-tabs-indicator');
      const buttons = Array.from(tabsEl.querySelectorAll<HTMLButtonElement>('.morphing-tab-btn'));
      const variant = tabsEl.dataset.variant || 'pill';

      if (!listEl || !indicator || buttons.length === 0) return;

      function updateIndicator(activeBtn: HTMLElement) {
        const x = activeBtn.offsetLeft;
        const w = activeBtn.offsetWidth;
        const isUnderline = variant === 'underline';
        const h = isUnderline ? 2 : activeBtn.offsetHeight;
        const y = isUnderline ? activeBtn.offsetTop + activeBtn.offsetHeight - 2 : activeBtn.offsetTop;

        indicator.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
        indicator.style.width = \`\${w}px\`;
        indicator.style.height = \`\${h}px\`;
      }

      function setActive(activeBtn: HTMLButtonElement) {
        buttons.forEach((btn) => {
          const isSelected = btn === activeBtn;
          btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
          btn.setAttribute('tabindex', isSelected ? '0' : '-1');
          btn.classList.toggle('text-neutral-900', isSelected && variant === 'pill');
          btn.classList.toggle('dark:text-white', isSelected && variant === 'pill');
          btn.classList.toggle('text-indigo-600', isSelected && variant !== 'pill');
          btn.classList.toggle('dark:text-indigo-400', isSelected && variant !== 'pill');
          btn.classList.toggle('font-semibold', isSelected);
          btn.classList.toggle('text-neutral-500', !isSelected);
          btn.classList.toggle('dark:text-neutral-400', !isSelected);
        });
        updateIndicator(activeBtn);
      }

      buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => setActive(btn));
        btn.addEventListener('keydown', (e) => {
          let nextIndex = index;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (index + 1) % buttons.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (index - 1 + buttons.length) % buttons.length;
          } else if (e.key === 'Home') {
            e.preventDefault();
            nextIndex = 0;
          } else if (e.key === 'End') {
            e.preventDefault();
            nextIndex = buttons.length - 1;
          }

          if (nextIndex !== index && buttons[nextIndex]) {
            const nextBtn = buttons[nextIndex]!;
            setActive(nextBtn);
            nextBtn.focus();
          }
        });
      });

      const initialActive = buttons.find((b) => b.getAttribute('aria-selected') === 'true') || buttons[0];
      if (initialActive) updateIndicator(initialActive);

      window.addEventListener('resize', () => {
        const current = buttons.find((b) => b.getAttribute('aria-selected') === 'true');
        if (current) updateIndicator(current);
      });
    });
  }

  initTabs();
  document.addEventListener('astro:page-load', initTabs);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'morphing-tabs.blade.php',
					language: 'php',
					description: 'Morphing Tabs — Laravel Blade component with Alpine.js or native JS active rect tracking.',
					code: `@props([
    'items' => [],
    'defaultTab' => '',
    'variant' => '${variant}',
    'size' => '${size}',
])

@php
    $activeTab = $defaultTab ?: ($items[0]['id'] ?? '');
    $variantClass = match($variant) {
        'underline' => 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]',
        'glow' => 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]',
        default => 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md',
    };
    $listClass = match($variant) {
        'underline' => 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80',
        default => 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm',
    };
    $sizeClass = match($size) {
        'sm' => 'px-3 py-1.5 text-xs',
        'lg' => 'px-6 py-3 text-base',
        default => 'px-4 py-2 text-sm',
    };
@endphp

<div
    x-data="{
        activeTab: '{{ $activeTab }}',
        variant: '{{ $variant }}',
        indicatorStyle: '',
        updateIndicator() {
            const activeEl = this.$refs.tablist.querySelector('[data-tab-id=\&quot;' + this.activeTab + '\&quot;]');
            if (!activeEl) return;
            const x = activeEl.offsetLeft;
            const w = activeEl.offsetWidth;
            const isUnderline = this.variant === 'underline';
            const h = isUnderline ? 2 : activeEl.offsetHeight;
            const y = isUnderline ? activeEl.offsetTop + activeEl.offsetHeight - 2 : activeEl.offsetTop;
            this.indicatorStyle = \`transform: translate3d(\${x}px, \${y}px, 0); width: \${w}px; height: \${h}px; transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1);\`;
        },
        selectTab(id) {
            this.activeTab = id;
            this.$nextTick(() => this.updateIndicator());
        }
    }"
    x-init="updateIndicator(); window.addEventListener('resize', () => updateIndicator())"
    class="exhuma-morphing-tabs flex flex-col {{ $attributes->get('class') }}"
>
    <div
        x-ref="tablist"
        role="tablist"
        aria-orientation="horizontal"
        class="relative flex items-center gap-1 {{ $listClass }}"
    >
        <div
            aria-hidden="true"
            class="pointer-events-none absolute top-0 left-0 {{ $variantClass }}"
            :style="indicatorStyle"
        ></div>

        @foreach ($items as $item)
            <button
                type="button"
                role="tab"
                data-tab-id="{{ $item['id'] }}"
                :aria-selected="activeTab === '{{ $item['id'] }}'"
                :tabindex="activeTab === '{{ $item['id'] }}' ? 0 : -1"
                @click="selectTab('{{ $item['id'] }}')"
                class="relative z-10 inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none rounded-xl {{ $sizeClass }}"
                :class="activeTab === '{{ $item['id'] }}' ? (variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : variant === 'glow' ? 'text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-neutral-900 dark:text-white font-semibold') : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'"
            >
                {{ $item['label'] }}
            </button>
        @endforeach
    </div>

    <div class="mt-4">
        {{ $slot }}
    </div>
</div>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'morphing-tabs.js',
					language: 'javascript',
					description: 'Morphing Tabs — Vanilla JavaScript with active rect tracking and circular modulo roving focus.',
					code: `/**
 * Exhuma Morphing Tabs — Vanilla JavaScript (Zero Dependencies)
 */
export function initMorphingTabs(containerSelector = '.exhuma-morphing-tabs') {
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach((container) => {
    const list = container.querySelector('[role="tablist"]');
    const indicator = container.querySelector('.morphing-tabs-indicator');
    const buttons = Array.from(container.querySelectorAll('[role="tab"]'));
    const variant = container.dataset.variant || '${variant}';

    if (!list || !indicator || buttons.length === 0) return;

    function updateIndicator(activeBtn) {
      const x = activeBtn.offsetLeft;
      const w = activeBtn.offsetWidth;
      const isUnderline = variant === 'underline';
      const h = isUnderline ? 2 : activeBtn.offsetHeight;
      const y = isUnderline ? activeBtn.offsetTop + activeBtn.offsetHeight - 2 : activeBtn.offsetTop;

      indicator.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
      indicator.style.width = \`\${w}px\`;
      indicator.style.height = \`\${h}px\`;
      indicator.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    function setActive(activeBtn) {
      buttons.forEach((btn) => {
        const isSelected = btn === activeBtn;
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        btn.setAttribute('tabindex', isSelected ? '0' : '-1');
        btn.classList.toggle('text-neutral-900', isSelected && variant === 'pill');
        btn.classList.toggle('dark:text-white', isSelected && variant === 'pill');
        btn.classList.toggle('text-indigo-600', isSelected && variant !== 'pill');
        btn.classList.toggle('dark:text-indigo-400', isSelected && variant !== 'pill');
        btn.classList.toggle('font-semibold', isSelected);
        btn.classList.toggle('text-neutral-500', !isSelected);
        btn.classList.toggle('dark:text-neutral-400', !isSelected);
      });
      updateIndicator(activeBtn);

      const tabId = activeBtn.getAttribute('data-tab-id');
      const panels = container.querySelectorAll('[role="tabpanel"]');
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute('data-tab-id') !== tabId;
      });
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => setActive(btn));
      btn.addEventListener('keydown', (e) => {
        let nextIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (index + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (index - 1 + buttons.length) % buttons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = buttons.length - 1;
        }

        if (nextIndex !== index && buttons[nextIndex]) {
          const nextBtn = buttons[nextIndex];
          setActive(nextBtn);
          nextBtn.focus();
        }
      });
    });

    const active = buttons.find((b) => b.getAttribute('aria-selected') === 'true') || buttons[0];
    if (active) updateIndicator(active);

    window.addEventListener('resize', () => {
      const cur = buttons.find((b) => b.getAttribute('aria-selected') === 'true');
      if (cur) updateIndicator(cur);
    });
  });
}
`,
				},
				{
					filename: 'morphing-tabs.html',
					language: 'html',
					description: 'Morphing Tabs — Accessible semantic HTML markup.',
					code: `<div class="exhuma-morphing-tabs flex flex-col" data-variant="${variant}">
  <div
    role="tablist"
    aria-orientation="horizontal"
    class="relative flex items-center gap-1 ${
		variant === 'underline'
			? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80'
			: 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm'
	}"
  >
    <div
      aria-hidden="true"
      class="morphing-tabs-indicator pointer-events-none absolute top-0 left-0 ${
			variant === 'underline'
				? 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
				: variant === 'glow'
					? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]'
					: 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md'
		}"
    ></div>

    <button
      type="button"
      role="tab"
      data-tab-id="overview"
      aria-selected="true"
      tabindex="0"
      class="relative z-10 inline-flex items-center justify-center font-medium transition-colors rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} ${variant === 'underline' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-neutral-900 dark:text-white font-semibold'}"
    >
      Overview
    </button>
    <button
      type="button"
      role="tab"
      data-tab-id="analytics"
      aria-selected="false"
      tabindex="-1"
      class="relative z-10 inline-flex items-center justify-center font-medium transition-colors rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
    >
      Analytics
    </button>
    <button
      type="button"
      role="tab"
      data-tab-id="reports"
      aria-selected="false"
      tabindex="-1"
      class="relative z-10 inline-flex items-center justify-center font-medium transition-colors rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
    >
      Reports
    </button>
  </div>

  <div class="mt-4">
    <div role="tabpanel" data-tab-id="overview" class="rounded-xl border border-neutral-200/80 p-6 dark:border-neutral-800/80">
      Overview metrics and real-time dashboard data.
    </div>
    <div role="tabpanel" data-tab-id="analytics" hidden class="rounded-xl border border-neutral-200/80 p-6 dark:border-neutral-800/80">
      Deep-dive telemetry and latency analytics.
    </div>
    <div role="tabpanel" data-tab-id="reports" hidden class="rounded-xl border border-neutral-200/80 p-6 dark:border-neutral-800/80">
      Automated compliance and weekly reports.
    </div>
  </div>
</div>
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'WordPress Gutenberg block definition.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/morphing-tabs",
  "version": "1.0.0",
  "title": "Exhuma Morphing Tabs",
  "category": "navigation",
  "icon": "index-card",
  "description": "Dynamic active rect geometry tracking with a floating kinetic spring indicator.",
  "attributes": {
    "springStiffness": {
      "type": "number",
      "default": ${springStiffness}
    },
    "variant": {
      "type": "string",
      "default": "${variant}"
    },
    "size": {
      "type": "string",
      "default": "${size}"
    }
  },
  "viewScript": "file:./view.js",
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg server-side render template.',
					code: `<?php
$variant = $attributes['variant'] ?? '${variant}';
$size = $attributes['size'] ?? '${size}';
$variant_class = match($variant) {
    'underline' => 'rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]',
    'glow' => 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)] dark:bg-neutral-800/95 dark:border-indigo-400/50 dark:shadow-[0_0_24px_rgba(99,102,241,0.6),0_0_50px_rgba(168,85,247,0.35)]',
    default => 'rounded-xl bg-white shadow-sm border border-neutral-200/60 dark:bg-neutral-800 dark:border-neutral-700/60 dark:shadow-md',
};
$list_class = match($variant) {
    'underline' => 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2 dark:border-neutral-800/80',
    default => 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 shadow-sm',
};
?>
<div class="exhuma-morphing-tabs flex flex-col" data-variant="<?php echo esc_attr($variant); ?>">
  <div role="tablist" class="relative flex items-center gap-1 <?php echo esc_attr($list_class); ?>">
    <div aria-hidden="true" class="morphing-tabs-indicator pointer-events-none absolute top-0 left-0 <?php echo esc_attr($variant_class); ?>"></div>
    <?php echo $content; ?>
  </div>
</div>
`,
				},
				{
					filename: 'view.js',
					language: 'javascript',
					description: 'WordPress Gutenberg frontend script.',
					code: `document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.exhuma-morphing-tabs').forEach((container) => {
    const indicator = container.querySelector('.morphing-tabs-indicator');
    const buttons = container.querySelectorAll('[role="tab"]');
    const variant = container.dataset.variant || '${variant}';

    function update(activeBtn) {
      if (!indicator || !activeBtn) return;
      const x = activeBtn.offsetLeft;
      const w = activeBtn.offsetWidth;
      const isUnderline = variant === 'underline';
      const h = isUnderline ? 2 : activeBtn.offsetHeight;
      const y = isUnderline ? activeBtn.offsetTop + activeBtn.offsetHeight - 2 : activeBtn.offsetTop;

      indicator.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
      indicator.style.width = \`\${w}px\`;
      indicator.style.height = \`\${h}px\`;
      indicator.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
        update(btn);
      });
    });

    const active = container.querySelector('[role="tab"][aria-selected="true"]') || buttons[0];
    if (active) update(active);
  });
});
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'MorphingTabsElement.ts',
					language: 'typescript',
					description: 'Morphing Tabs — W3C Custom Element (<exhuma-morphing-tabs>) with roving focus.',
					code: `export class MorphingTabsElement extends HTMLElement {
  private listEl: HTMLElement | null = null;
  private indicatorEl: HTMLElement | null = null;
  private buttons: HTMLButtonElement[] = [];

  connectedCallback() {
    this.classList.add('flex', 'flex-col');
    this.listEl = this.querySelector('[role="tablist"]');
    this.indicatorEl = this.querySelector('.morphing-tabs-indicator');
    this.buttons = Array.from(this.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

    this.buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => this.selectTab(btn));
      btn.addEventListener('keydown', (e) => this.handleKeyDown(e, idx));
    });

    const active = this.buttons.find((b) => b.getAttribute('aria-selected') === 'true') || this.buttons[0];
    if (active) this.updateIndicator(active);

    window.addEventListener('resize', this.onResize);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    const active = this.buttons.find((b) => b.getAttribute('aria-selected') === 'true');
    if (active) this.updateIndicator(active);
  };

  private selectTab(btn: HTMLButtonElement) {
    const variant = this.getAttribute('variant') || '${variant}';
    this.buttons.forEach((b) => {
      const isSelected = b === btn;
      b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      b.tabIndex = isSelected ? 0 : -1;
      b.classList.toggle('text-indigo-600', isSelected && variant !== 'pill');
      b.classList.toggle('text-neutral-900', isSelected && variant === 'pill');
      b.classList.toggle('font-semibold', isSelected);
    });
    this.updateIndicator(btn);
  }

  private updateIndicator(activeBtn: HTMLButtonElement) {
    if (!this.indicatorEl) return;
    const variant = this.getAttribute('variant') || '${variant}';
    const isUnderline = variant === 'underline';

    const x = activeBtn.offsetLeft;
    const w = activeBtn.offsetWidth;
    const h = isUnderline ? 2 : activeBtn.offsetHeight;
    const y = isUnderline ? activeBtn.offsetTop + activeBtn.offsetHeight - 2 : activeBtn.offsetTop;

    this.indicatorEl.style.transform = \`translate3d(\${x}px, \${y}px, 0)\`;
    this.indicatorEl.style.width = \`\${w}px\`;
    this.indicatorEl.style.height = \`\${h}px\`;
    this.indicatorEl.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  private handleKeyDown(e: KeyboardEvent, currentIndex: number) {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % this.buttons.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + this.buttons.length) % this.buttons.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = this.buttons.length - 1;
    }

    if (nextIndex !== currentIndex && this.buttons[nextIndex]) {
      const nextBtn = this.buttons[nextIndex]!;
      this.selectTab(nextBtn);
      nextBtn.focus();
    }
  }
}

if (!customElements.get('exhuma-morphing-tabs')) {
  customElements.define('exhuma-morphing-tabs', MorphingTabsElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'MorphingTabs.tsx',
					language: 'tsx',
					description: 'Morphing Tabs — React Native with Animated spring indicator.',
					code: `import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, LayoutChangeEvent } from 'react-native';

export interface TabItem {
  id: string;
  label: string;
}

export interface MorphingTabsProps {
  items: TabItem[];
  value?: string;
  onValueChange?: (id: string) => void;
  variant?: 'pill' | 'underline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const MorphingTabs: React.FC<MorphingTabsProps> = ({
  items,
  value,
  onValueChange,
  variant = '${variant}',
  size = '${size}',
}) => {
  const [activeTab, setActiveTab] = useState(value || items[0]?.id || '');
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number; height: number }>>({});

  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const onTabLayout = (id: string, e: LayoutChangeEvent) => {
    const { x, width, height } = e.nativeEvent.layout;
    setLayouts((prev) => {
      const next = { ...prev, [id]: { x, width, height } };
      if (id === activeTab) {
        animateTo(x, width);
      }
      return next;
    });
  };

  const animateTo = (x: number, width: number) => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: x,
        useNativeDriver: false,
        tension: ${springStiffness * 3},
        friction: 20,
      }),
      Animated.spring(indicatorWidth, {
        toValue: width,
        useNativeDriver: false,
        tension: ${springStiffness * 3},
        friction: 20,
      }),
    ]).start();
  };

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onValueChange?.(id);
    const layout = layouts[id];
    if (layout) {
      animateTo(layout.x, layout.width);
    }
  };

  useEffect(() => {
    const layout = layouts[activeTab];
    if (layout) {
      animateTo(layout.x, layout.width);
    }
  }, [variant, size]);

  const padH = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
  const padV = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

  return (
    <View style={styles.container}>
      <View style={[styles.list, variant === 'underline' && styles.listUnderline]}>
        <Animated.View
          style={[
            styles.indicator,
            variant === 'underline' && styles.indicatorUnderline,
            variant === 'glow' && styles.indicatorGlow,
            {
              transform: [{ translateX }],
              width: indicatorWidth,
            },
          ]}
        />
        {items.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <Pressable
              key={item.id}
              onLayout={(e) => onTabLayout(item.id, e)}
              onPress={() => handleSelect(item.id)}
              style={[styles.tab, { paddingHorizontal: padH, paddingVertical: padV }]}
            >
              <Text
                style={[
                  styles.tabText,
                  { fontSize },
                  isSelected && (variant === 'underline' ? styles.tabTextUnderlineActive : styles.tabTextActive),
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  list: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 16,
    padding: 6,
  },
  listUnderline: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    borderRadius: 0,
    padding: 0,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    left: 0,
    bottom: 6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  indicatorUnderline: {
    top: undefined,
    bottom: 0,
    height: 2,
    backgroundColor: '#6366f1',
    borderRadius: 1,
    shadowColor: '#6366f1',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  indicatorGlow: {
    backgroundColor: '#ffffff',
    borderColor: '#6366f1',
    borderWidth: 1,
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  tab: {
    zIndex: 1,
  },
  tabText: {
    color: '#71717a',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#18181b',
    fontWeight: '700',
  },
  tabTextUnderlineActive: {
    color: '#6366f1',
    fontWeight: '700',
  },
});

export default MorphingTabs;
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'morphing_tabs.dart',
					language: 'dart',
					description: 'Morphing Tabs — Flutter StatefulWidget with AnimatedAlign and kinetic pill styling.',
					code: `import 'package:flutter/material.dart';

class TabItem {
  final String id;
  final String label;

  const TabItem({required this.id, required this.label});
}

class ExhumaMorphingTabs extends StatefulWidget {
  final List<TabItem> items;
  final String? initialValue;
  final ValueChanged<String>? onTabChanged;
  final String variant;
  final String size;

  const ExhumaMorphingTabs({
    Key? key,
    required this.items,
    this.initialValue,
    this.onTabChanged,
    this.variant = '${variant}',
    this.size = '${size}',
  }) : super(key: key);

  @override
  State<ExhumaMorphingTabs> createState() => _ExhumaMorphingTabsState();
}

class _ExhumaMorphingTabsState extends State<ExhumaMorphingTabs> {
  late String _activeTab;

  @override
  void initState() {
    super.initState();
    _activeTab = widget.initialValue ?? (widget.items.isNotEmpty ? widget.items.first.id : '');
  }

  @override
  Widget build(BuildContext context) {
    final activeIndex = widget.items.indexWhere((item) => item.id == _activeTab);
    final count = widget.items.length;
    final alignmentX = count > 1 ? -1.0 + (2.0 * activeIndex / (count - 1)) : 0.0;
    final isUnderline = widget.variant == 'underline';
    final isGlow = widget.variant == 'glow';
    final tabHeight = widget.size == 'sm' ? 30.0 : widget.size == 'lg' ? 44.0 : 36.0;

    return Container(
      padding: EdgeInsets.all(isUnderline ? 0 : 6),
      decoration: isUnderline
          ? const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0xFFE4E4E7), width: 1)),
            )
          : BoxDecoration(
              color: const Color(0xFFF4F4F5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE4E4E7)),
            ),
      child: Stack(
        children: [
          AnimatedAlign(
            duration: const Duration(milliseconds: 280),
            curve: Curves.fastLinearToSlowEaseIn,
            alignment: isUnderline ? Alignment(alignmentX, 1.0) : Alignment(alignmentX, 0.0),
            child: FractionallySizedBox(
              widthFactor: count > 0 ? 1.0 / count : 1.0,
              child: Container(
                height: isUnderline ? 2.0 : tabHeight,
                decoration: BoxDecoration(
                  color: isUnderline ? const Color(0xFF6366F1) : Colors.white,
                  borderRadius: BorderRadius.circular(isUnderline ? 1 : 12),
                  border: isGlow ? Border.all(color: const Color(0xFF6366F1).withOpacity(0.4)) : null,
                  boxShadow: [
                    BoxShadow(
                      color: isGlow
                          ? const Color(0xFF6366F1).withOpacity(0.35)
                          : Colors.black.withOpacity(0.06),
                      blurRadius: isGlow ? 12 : 4,
                      offset: Offset(0, isUnderline ? 0 : 2),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Row(
            children: widget.items.map((item) {
              final isSelected = item.id == _activeTab;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      _activeTab = item.id;
                    });
                    widget.onTabChanged?.call(item.id);
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    height: tabHeight,
                    alignment: Alignment.center,
                    child: Text(
                      item.label,
                      style: TextStyle(
                        fontSize: widget.size == 'sm' ? 12 : widget.size == 'lg' ? 16 : 14,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected
                            ? (isUnderline ? const Color(0xFF6366F1) : const Color(0xFF18181B))
                            : const Color(0xFF71717A),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
`,
				},
			];
		}

		default:
			return null;
	}
}

export function getMorphingTabsUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const springStiffness = typeof props.springStiffness === 'number' ? props.springStiffness : Number(props.springStiffness ?? 26);
	const variant = String(props.variant || 'pill');
	const size = String(props.size || 'md');

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			return {
				filename: 'MorphingTabsDemo.tsx',
				language: 'tsx',
				description: 'Dynamic kinetic morphing tabs with spring-driven indicator and roving focus.',
				code: `import * as React from 'react';
import { MorphingTabs } from '@/components/ui/MorphingTabs';

export default function MorphingTabsDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <MorphingTabs.Root
        defaultValue="overview"
        springStiffness={${springStiffness}}
        variant="${variant}"
        size="${size}"
      >
        <MorphingTabs.List>
          <MorphingTabs.Indicator />
          <MorphingTabs.Trigger value="overview">Overview</MorphingTabs.Trigger>
          <MorphingTabs.Trigger value="analytics">Analytics</MorphingTabs.Trigger>
          <MorphingTabs.Trigger value="reports">Reports</MorphingTabs.Trigger>
          <MorphingTabs.Trigger value="settings">Settings</MorphingTabs.Trigger>
        </MorphingTabs.List>

        <MorphingTabs.Content value="overview" className="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
        </MorphingTabs.Content>

        <MorphingTabs.Content value="analytics" className="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">System Analytics</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">P99 latency distribution, cache hit ratios, and edge worker health.</p>
        </MorphingTabs.Content>

        <MorphingTabs.Content value="reports" className="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Compliance Reports</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Automated ISO 27001 audit trails and SOC 2 export logs.</p>
        </MorphingTabs.Content>

        <MorphingTabs.Content value="settings" className="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Workspace Settings</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">API credentials, notification hooks, and team RBAC permissions.</p>
        </MorphingTabs.Content>
      </MorphingTabs.Root>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'MorphingTabsDemo.vue',
				language: 'vue',
				description: 'Vue 3 kinetic morphing tabs demo.',
				code: `<script setup lang="ts">
import { ref } from 'vue';
import MorphingTabs, { type TabItem } from '@/components/ui/MorphingTabs.vue';

const selectedTab = ref('overview');

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <MorphingTabs
      v-model="selectedTab"
      :items="tabs"
      :spring-stiffness="${springStiffness}"
      variant="${variant}"
      size="${size}"
    >
      <template #default="{ activeTab }">
        <div v-if="activeTab === 'overview'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
        </div>
        <div v-else-if="activeTab === 'analytics'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">System Analytics</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">P99 latency distribution, cache hit ratios, and edge worker health.</p>
        </div>
        <div v-else-if="activeTab === 'reports'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Compliance Reports</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Automated ISO 27001 audit trails and SOC 2 export logs.</p>
        </div>
        <div v-else-if="activeTab === 'settings'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Workspace Settings</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">API credentials, notification hooks, and team RBAC permissions.</p>
        </div>
      </template>
    </MorphingTabs>
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'MorphingTabsDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 kinetic morphing tabs demo.',
				code: `<script lang="ts">
  import MorphingTabs from '@/components/ui/MorphingTabs.svelte';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  let activeTab = $state('overview');
</script>

<div class="w-full max-w-2xl mx-auto p-6">
  <MorphingTabs
    items={tabs}
    bind:value={activeTab}
    springStiffness={${springStiffness}}
    variant="${variant}"
    size="${size}"
  >
    {#if activeTab === 'overview'}
      <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
        <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
      </div>
    {:else if activeTab === 'analytics'}
      <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
        <h3 class="text-base font-semibold text-neutral-900 dark:text-white">System Analytics</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">P99 latency distribution, cache hit ratios, and edge worker health.</p>
      </div>
    {:else if activeTab === 'reports'}
      <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
        <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Compliance Reports</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Automated ISO 27001 audit trails and SOC 2 export logs.</p>
      </div>
    {:else if activeTab === 'settings'}
      <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
        <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Workspace Settings</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">API credentials, notification hooks, and team RBAC permissions.</p>
      </div>
    {/if}
  </MorphingTabs>
</div>
`,
			};
		}

		case 'solid': {
			return {
				filename: 'MorphingTabsDemo.tsx',
				language: 'tsx',
				description: 'SolidJS kinetic morphing tabs demo.',
				code: `import { createSignal, Switch, Match } from 'solid-js';
import { MorphingTabs } from '@/components/ui/MorphingTabs';

export default function MorphingTabsDemo() {
  const [activeTab, setActiveTab] = createSignal('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div class="w-full max-w-2xl mx-auto p-6">
      <MorphingTabs
        items={tabs}
        value={activeTab()}
        onValueChange={setActiveTab}
        springStiffness={${springStiffness}}
        variant="${variant}"
        size="${size}"
      >
        <Switch>
          <Match when={activeTab() === 'overview'}>
            <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
              <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
            </div>
          </Match>
          <Match when={activeTab() === 'analytics'}>
            <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white">System Analytics</h3>
              <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">P99 latency distribution, cache hit ratios, and edge worker health.</p>
            </div>
          </Match>
          <Match when={activeTab() === 'reports'}>
            <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Compliance Reports</h3>
              <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Automated ISO 27001 audit trails and SOC 2 export logs.</p>
            </div>
          </Match>
          <Match when={activeTab() === 'settings'}>
            <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Workspace Settings</h3>
              <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">API credentials, notification hooks, and team RBAC permissions.</p>
            </div>
          </Match>
        </Switch>
      </MorphingTabs>
    </div>
  );
}
`,
			};
		}

		case 'angular': {
			return {
				filename: 'morphing-tabs-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ kinetic morphing tabs demo.',
				code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MorphingTabsComponent, type TabItem } from './morphing-tabs.component';

@Component({
  selector: 'app-morphing-tabs-demo',
  standalone: true,
  imports: [CommonModule, MorphingTabsComponent],
  template: \`
    <div class="w-full max-w-2xl mx-auto p-6">
      <exhuma-morphing-tabs
        [items]="tabs"
        [springStiffness]="${springStiffness}"
        variant="${variant}"
        size="${size}"
        (tabChange)="currentTab = $event"
      >
        <div *ngIf="currentTab === 'overview'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
        </div>
        <div *ngIf="currentTab === 'analytics'" class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">System Analytics</h3>
          <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">P99 latency distribution, cache hit ratios, and edge worker health.</p>
        </div>
      </exhuma-morphing-tabs>
    </div>
  \`,
})
export class MorphingTabsDemoComponent {
  currentTab = 'overview';

  tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'MorphingTabsDemo.astro',
				language: 'astro',
				description: 'Astro kinetic morphing tabs demo.',
				code: `---
import MorphingTabs from '@/components/ui/MorphingTabs.astro';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];
---

<div class="w-full max-w-2xl mx-auto p-6">
  <MorphingTabs
    items={tabs}
    defaultTab="overview"
    springStiffness={${springStiffness}}
    variant="${variant}"
    size="${size}"
  >
    <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
      <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Kinetic Workspace</h3>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Zero-dependency analytical spring indicator tracking active tab dimensions.</p>
    </div>
  </MorphingTabs>
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'demo.blade.php',
				language: 'php',
				description: 'Laravel Blade kinetic morphing tabs demo.',
				code: `@php
$tabs = [
    ['id' => 'overview', 'label' => 'Overview'],
    ['id' => 'analytics', 'label' => 'Analytics'],
    ['id' => 'reports', 'label' => 'Reports'],
    ['id' => 'settings', 'label' => 'Settings'],
];
@endphp

<div class="w-full max-w-2xl mx-auto p-6">
    <x-morphing-tabs :items="$tabs" defaultTab="overview" variant="${variant}" size="${size}">
        <div class="rounded-2xl border border-neutral-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <h3 class="text-base font-semibold text-neutral-900 dark:text-white">Executive Overview</h3>
            <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">High-level KPIs, operational status, and real-time throughput metrics.</p>
        </div>
    </x-morphing-tabs>
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla JavaScript kinetic morphing tabs demo.',
				code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-50 dark:bg-neutral-950 p-12 flex justify-center">
  <div class="w-full max-w-2xl">
    <div class="exhuma-morphing-tabs flex flex-col" data-variant="${variant}">
      <div
        role="tablist"
        class="relative flex items-center gap-1 ${
			variant === 'underline' ? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2' : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md shadow-sm'
		}"
      >
        <div class="morphing-tabs-indicator pointer-events-none absolute top-0 left-0 ${
			variant === 'underline'
				? 'rounded-full bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
				: variant === 'glow'
					? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)]'
					: 'rounded-xl bg-white shadow-sm border border-neutral-200/60'
		}"></div>

        <button type="button" role="tab" data-tab-id="overview" aria-selected="true" tabindex="0" class="relative z-10 inline-flex items-center justify-center font-semibold rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} ${variant === 'underline' ? 'text-indigo-600' : 'text-neutral-900'}">Overview</button>
        <button type="button" role="tab" data-tab-id="analytics" aria-selected="false" tabindex="-1" class="relative z-10 inline-flex items-center justify-center font-medium rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} text-neutral-500">Analytics</button>
        <button type="button" role="tab" data-tab-id="reports" aria-selected="false" tabindex="-1" class="relative z-10 inline-flex items-center justify-center font-medium rounded-xl ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} text-neutral-500">Reports</button>
      </div>

      <div class="mt-4 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
        <h3 class="text-base font-semibold text-neutral-900">Overview Panel</h3>
        <p class="mt-1 text-sm text-neutral-500">Kinetic analytical spring physics morphing tabs.</p>
      </div>
    </div>
  </div>

  <script type="module">
    import { initMorphingTabs } from './morphing-tabs.js';
    initMorphingTabs();
  </script>
</body>
</html>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'example-page.php',
				language: 'php',
				description: 'WordPress Gutenberg morphing tabs usage.',
				code: `<!-- wp:exhuma/morphing-tabs {"springStiffness":${springStiffness},"variant":"${variant}","size":"${size}"} -->
<button role="tab" aria-selected="true" class="px-4 py-2 text-sm font-semibold">Overview</button>
<button role="tab" aria-selected="false" class="px-4 py-2 text-sm text-neutral-500">Analytics</button>
<button role="tab" aria-selected="false" class="px-4 py-2 text-sm text-neutral-500">Settings</button>
<!-- /wp:exhuma/morphing-tabs -->
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Custom element <exhuma-morphing-tabs> usage.',
				code: `<script type="module" src="./MorphingTabsElement.js"></script>

<div class="w-full max-w-2xl mx-auto p-6">
  <exhuma-morphing-tabs variant="${variant}" size="${size}">
    <div role="tablist" class="relative flex items-center gap-1 ${
		variant === 'underline' ? 'border-b border-neutral-200/80 bg-transparent rounded-none p-0 pb-1 gap-2' : 'rounded-2xl border border-neutral-200/80 bg-neutral-100/80 p-1.5 backdrop-blur-md shadow-sm'
	}">
      <div class="morphing-tabs-indicator pointer-events-none absolute top-0 left-0 ${
			variant === 'underline'
				? 'rounded-full bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
				: variant === 'glow'
					? 'rounded-xl bg-white/95 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.5),0_0_40px_rgba(168,85,247,0.3)]'
					: 'rounded-xl bg-white shadow-sm border border-neutral-200/60'
		}"></div>

      <button type="button" role="tab" aria-selected="true" class="relative z-10 ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} ${variant === 'underline' ? 'text-indigo-600 font-semibold' : 'text-neutral-900 font-semibold'}">Overview</button>
      <button type="button" role="tab" aria-selected="false" class="relative z-10 ${
			size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
		} text-neutral-500">Analytics</button>
      <button type="button" role="tab" aria-selected="false" class="relative z-10 ${size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'} text-neutral-500">Settings</button>
    </div>
  </exhuma-morphing-tabs>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'MorphingTabsDemo.tsx',
				language: 'tsx',
				description: 'React Native morphing tabs usage.',
				code: `import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MorphingTabs } from './MorphingTabs';

export default function MorphingTabsDemo() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <View style={styles.container}>
      <MorphingTabs
        items={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
        variant="${variant}"
        size="${size}"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'morphing_tabs_demo.dart',
				language: 'dart',
				description: 'Flutter morphing tabs usage.',
				code: `import 'package:flutter/material.dart';
import 'morphing_tabs.dart';

class MorphingTabsDemo extends StatelessWidget {
  const MorphingTabsDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final tabs = [
      const TabItem(id: 'overview', label: 'Overview'),
      const TabItem(id: 'analytics', label: 'Analytics'),
      const TabItem(id: 'reports', label: 'Reports'),
    ];

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: ExhumaMorphingTabs(
            items: tabs,
            variant: '${variant}',
            size: '${size}',
            onTabChanged: (tabId) {
              debugPrint('Active tab: \$tabId');
            },
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default: {
			return {
				filename: 'MorphingTabsDemo.tsx',
				language: 'tsx',
				description: 'Generic MorphingTabs demo.',
				code: `import { MorphingTabs } from '@/components/ui/MorphingTabs';

export default function MorphingTabsDemo() {
  return (
    <MorphingTabs.Root defaultValue="overview" springStiffness={${springStiffness}} variant="${variant}" size="${size}">
      <MorphingTabs.List>
        <MorphingTabs.Indicator />
        <MorphingTabs.Trigger value="overview">Overview</MorphingTabs.Trigger>
        <MorphingTabs.Trigger value="analytics">Analytics</MorphingTabs.Trigger>
      </MorphingTabs.List>
      <MorphingTabs.Content value="overview">Overview content</MorphingTabs.Content>
      <MorphingTabs.Content value="analytics">Analytics content</MorphingTabs.Content>
    </MorphingTabs.Root>
  );
}
`,
			};
		}
	}
}
