import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getAccordionOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const mode = (props.mode as string) || 'single';
	const collapsible = props.collapsible !== false;
	const gap = Number(props.gap ?? 12);
	const bordered = props.bordered !== false;
	const shadow = props.shadow !== false;
	const showNumbers = props.showNumbers !== false;
	const showIcon = props.showIcon !== false;
	const duration = Number(props.duration ?? 300);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';

			if (!isEjected) {
				return [
					{
						filename: 'Accordion.tsx',
						language: 'tsx',
						description: 'Accordion — Clean compound component powered by @exhuma/core kinetic primitives.',
						code: `${header}import * as React from 'react';
import {
  Accordion as CoreAccordion,
  AccordionRoot as CoreAccordionRoot,
  AccordionItem as CoreAccordionItem,
  AccordionTrigger as CoreAccordionTrigger,
  AccordionIcon as CoreAccordionIcon,
  AccordionContent as CoreAccordionContent,
  type AccordionRootProps as CoreAccordionRootProps,
  type AccordionItemProps as CoreAccordionItemProps,
  type AccordionTriggerProps as CoreAccordionTriggerProps,
  type AccordionIconProps as CoreAccordionIconProps,
  type AccordionContentProps as CoreAccordionContentProps,
  type AccordionMode,
} from '@exhuma/core';
import { clsx } from 'clsx';

export type { AccordionMode };

export interface AccordionRootProps extends CoreAccordionRootProps {
  className?: string;
}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  (
    {
      mode = '${mode}',
      collapsible = ${collapsible},
      gap = ${gap},
      bordered = ${bordered},
      shadow = ${shadow},
      showNumbers = ${showNumbers},
      showIcon = ${showIcon},
      duration = ${duration},
      className,
      ...props
    },
    ref
  ) => (
    <CoreAccordionRoot
      ref={ref}
      mode={mode}
      collapsible={collapsible}
      gap={gap}
      bordered={bordered}
      shadow={shadow}
      showNumbers={showNumbers}
      showIcon={showIcon}
      duration={duration}
      className={clsx('w-full', className)}
      {...props}
    />
  )
);
AccordionRoot.displayName = 'AccordionRoot';

export interface AccordionItemProps extends CoreAccordionItemProps {
  className?: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <CoreAccordionItem ref={ref} className={clsx(className)} {...props} />
  )
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends CoreAccordionTriggerProps {
  className?: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, ...props }, ref) => (
    <CoreAccordionTrigger ref={ref} className={clsx(className)} {...props} />
  )
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionIconProps extends CoreAccordionIconProps {
  className?: string;
}

export const AccordionIcon: React.FC<AccordionIconProps> = ({ className, ...props }) => (
  <CoreAccordionIcon className={clsx(className)} {...props} />
);
AccordionIcon.displayName = 'AccordionIcon';

export interface AccordionContentProps extends CoreAccordionContentProps {
  className?: string;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, ref) => (
    <CoreAccordionContent ref={ref} className={clsx(className)} {...props} />
  )
);
AccordionContent.displayName = 'AccordionContent';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Content: AccordionContent,
};

export default Accordion;
`,
					},
				];
			}

			// Ejected React / Next.js implementation
			return [
				{
					filename: 'Accordion.tsx',
					language: 'tsx',
					description: 'Accordion — Ejected zero-dependency implementation with CSS Grid 0fr/1fr height interpolation and roving keyboard navigation.',
					code: `${header}import * as React from 'react';
import { clsx } from 'clsx';

export type AccordionMode = 'single' | 'multiple';

interface AccordionContextValue {
  expandedValues: Set<string>;
  toggleItem: (value: string) => void;
  registerItem: (value: string, element: HTMLElement | null) => void;
  baseId: string;
  items: string[];
  mode: AccordionMode;
  collapsible: boolean;
  gap: number;
  bordered: boolean;
  shadow: boolean;
  showNumbers: boolean;
  showIcon: boolean;
  duration: number;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion subcomponents must be used within an <Accordion.Root>');
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  panelId: string;
  index: number;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem subcomponents must be used within an <Accordion.Item>');
  }
  return context;
}

export interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: AccordionMode;
  collapsible?: boolean;
  gap?: number;
  bordered?: boolean;
  shadow?: boolean;
  showNumbers?: boolean;
  showIcon?: boolean;
  duration?: number;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  (
    {
      mode = '${mode}',
      collapsible = ${collapsible},
      gap = ${gap},
      bordered = ${bordered},
      shadow = ${shadow},
      showNumbers = ${showNumbers},
      showIcon = ${showIcon},
      duration = ${duration},
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId();
    const [items, setItems] = React.useState<string[]>([]);

    const [uncontrolledValues, setUncontrolledValues] = React.useState<Set<string>>(() => {
      if (defaultValue) {
        return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
      }
      return new Set();
    });

    const isControlled = controlledValue !== undefined;
    const expandedValues = React.useMemo(() => {
      if (isControlled) {
        return new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue]);
      }
      return uncontrolledValues;
    }, [isControlled, controlledValue, uncontrolledValues]);

    const registerItem = React.useCallback((itemValue: string, element: HTMLElement | null) => {
      setItems((prev) => {
        if (element) {
          return prev.includes(itemValue) ? prev : [...prev, itemValue];
        }
        return prev.filter((id) => id !== itemValue);
      });
    }, []);

    const toggleItem = React.useCallback(
      (itemValue: string) => {
        const next = new Set(expandedValues);
        const isOpen = next.has(itemValue);

        if (isOpen) {
          if (collapsible || next.size > 1) {
            next.delete(itemValue);
          }
        } else {
          if (mode === 'single') {
            next.clear();
          }
          next.add(itemValue);
        }

        if (!isControlled) {
          setUncontrolledValues(next);
        }

        if (onValueChange) {
          const result = Array.from(next);
          onValueChange(mode === 'single' ? (result[0] ?? '') : result);
        }
      },
      [expandedValues, collapsible, mode, isControlled, onValueChange]
    );

    const contextValue = React.useMemo<AccordionContextValue>(
      () => ({
        expandedValues,
        toggleItem,
        registerItem,
        baseId,
        items,
        mode,
        collapsible,
        gap,
        bordered,
        shadow,
        showNumbers,
        showIcon,
        duration,
      }),
      [expandedValues, toggleItem, registerItem, baseId, items, mode, collapsible, gap, bordered, shadow, showNumbers, showIcon, duration]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="presentation"
          style={{ gap: \`\${gap}px\`, ...style }}
          className={clsx('exhuma-accordion-root flex w-full flex-col', className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
AccordionRoot.displayName = 'AccordionRoot';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  bordered?: boolean;
  shadow?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, bordered: itemBordered, shadow: itemShadow, children, className, style, ...props }, ref) => {
    const context = useAccordionContext();
    const { expandedValues, registerItem, baseId, items, duration } = context;
    const isOpen = expandedValues.has(value);
    const itemRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => itemRef.current as HTMLDivElement);

    const bordered = itemBordered ?? context.bordered;
    const shadow = itemShadow ?? context.shadow;
    const index = items.indexOf(value);

    React.useEffect(() => {
      registerItem(value, itemRef.current);
      return () => registerItem(value, null);
    }, [value, registerItem]);

    const triggerId = \`\${baseId}-trigger-\${value}\`;
    const panelId = \`\${baseId}-panel-\${value}\`;

    const borderClasses = bordered
      ? isOpen
        ? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10'
        : 'border border-border/80 dark:border-neutral-800'
      : 'border-0 ring-0';

    const shadowClasses = shadow
      ? isOpen
        ? 'shadow-lg shadow-black/5 dark:shadow-white/5'
        : 'shadow-sm'
      : 'shadow-none';

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, triggerId, panelId, index }}>
        <div
          ref={itemRef}
          style={{ transitionDuration: \`\${duration}ms\`, ...style }}
          className={clsx(
            'exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all',
            borderClasses,
            shadowClasses,
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showIcon?: boolean;
  showNumbers?: boolean;
  className?: string;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, showIcon: triggerShowIcon, showNumbers: triggerShowNumbers, className, ...props }, ref) => {
    const { value, isOpen, triggerId, panelId, index } = useAccordionItemContext();
    const { toggleItem, items, baseId, showIcon: ctxShowIcon, showNumbers: ctxShowNumbers } = useAccordionContext();

    const showIcon = triggerShowIcon ?? ctxShowIcon;
    const showNumbers = triggerShowNumbers ?? ctxShowNumbers;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (items.length === 0) return;
      const currentIndex = items.indexOf(value);

      let nextIndex = currentIndex;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowUp') {
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
        const targetTrigger = document.getElementById(\`\${baseId}-trigger-\${items[nextIndex]}\`);
        targetTrigger?.focus();
      }
    };

    const hasIconChild = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && ((child.type as any)?.displayName === 'AccordionIcon' || child.type === AccordionIcon)
    );

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => toggleItem(value)}
        onKeyDown={handleKeyDown}
        className={clsx(
          'exhuma-accordion-trigger group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5',
          className
        )}
        {...props}
      >
        <span className="flex flex-1 items-center gap-3.5">
          {showNumbers && (
            <span className="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
              {String((index >= 0 ? index : items.indexOf(value)) + 1).padStart(2, '0')}
            </span>
          )}
          <span className="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
            {children}
          </span>
        </span>

        {!hasIconChild && showIcon && <AccordionIcon />}
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export const AccordionIcon: React.FC<AccordionIconProps> = ({ className, ...props }) => {
  const { isOpen } = useAccordionItemContext();
  const { duration, showIcon } = useAccordionContext();

  if (!showIcon) return null;

  return (
    <span
      aria-hidden="true"
      className={clsx('relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none', className)}
      {...props}
    >
      <span
        style={{ transitionDuration: \`\${duration}ms\` }}
        className={clsx(
          'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
          isOpen ? 'rotate-0' : '-rotate-180'
        )}
      />
      <span
        style={{ transitionDuration: \`\${duration}ms\` }}
        className={clsx(
          'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
          isOpen ? 'rotate-0' : '-rotate-90'
        )}
      />
    </span>
  );
};
AccordionIcon.displayName = 'AccordionIcon';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, style, ...props }, ref) => {
    const { isOpen, triggerId, panelId } = useAccordionItemContext();
    const { duration } = useAccordionContext();

    return (
      <div
        ref={ref}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        inert={!isOpen || undefined}
        style={{ transitionDuration: \`\${duration}ms\`, ...style }}
        className={clsx(
          'grid transition-[grid-template-rows,opacity] ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          className
        )}
        {...props}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pt-1 pb-5 lg:px-7">
            <div className="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Icon: AccordionIcon,
  Content: AccordionContent,
};

export default Accordion;
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'Accordion.vue',
					language: 'vue',
					description: 'Accordion — Vue 3 SFC with CSS Grid 0fr/1fr height interpolation and roving keyboard navigation.',
					code: `<script setup lang="ts">
import { ref, computed } from 'vue';

export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

const props = withDefaults(
  defineProps<{
    items: AccordionItemData[];
    mode?: 'single' | 'multiple';
    collapsible?: boolean;
    gap?: number;
    bordered?: boolean;
    shadow?: boolean;
    showNumbers?: boolean;
    showIcon?: boolean;
    duration?: number;
    defaultValue?: string | string[];
  }>(),
  {
    mode: '${mode}',
    collapsible: ${collapsible},
    gap: ${gap},
    bordered: ${bordered},
    shadow: ${shadow},
    showNumbers: ${showNumbers},
    showIcon: ${showIcon},
    duration: ${duration},
  }
);

const emit = defineEmits<{
  (e: 'change', value: string | string[]): void;
}>();

const baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);
const activeValues = ref<Set<string>>(
  new Set(
    props.defaultValue
      ? Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [props.defaultValue]
      : props.items[0]?.value ? [props.items[0].value] : []
  )
);

function isOpen(val: string) {
  return activeValues.value.has(val);
}

function toggleItem(val: string) {
  const next = new Set(activeValues.value);
  if (next.has(val)) {
    if (props.collapsible || next.size > 1) {
      next.delete(val);
    }
  } else {
    if (props.mode === 'single') {
      next.clear();
    }
    next.add(val);
  }
  activeValues.value = next;
  emit('change', props.mode === 'single' ? (Array.from(next)[0] ?? '') : Array.from(next));
}

function handleKeyDown(e: KeyboardEvent, currentIndex: number) {
  const count = props.items.length;
  if (count === 0) return;

  let nextIndex = currentIndex;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    nextIndex = (currentIndex + 1) % count;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    nextIndex = (currentIndex - 1 + count) % count;
  } else if (e.key === 'Home') {
    e.preventDefault();
    nextIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    nextIndex = count - 1;
  }

  if (nextIndex !== currentIndex) {
    const el = document.getElementById(\`\${baseId}-trigger-\${props.items[nextIndex].value}\`);
    el?.focus();
  }
}
</script>

<template>
  <div class="exhuma-accordion flex w-full flex-col" :style="{ gap: \`\${gap}px\` }">
    <div
      v-for="(item, idx) in items"
      :key="item.value"
      :style="{ transitionDuration: \`\${duration}ms\` }"
      :class="[
        'exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all',
        bordered
          ? isOpen(item.value)
            ? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10'
            : 'border border-border/80 dark:border-neutral-800'
          : 'border-0 ring-0',
        shadow
          ? isOpen(item.value)
            ? 'shadow-lg shadow-black/5 dark:shadow-white/5'
            : 'shadow-sm'
          : 'shadow-none'
      ]"
    >
      <button
        type="button"
        :id="\`\${baseId}-trigger-\${item.value}\`"
        :aria-expanded="isOpen(item.value)"
        :aria-controls="\`\${baseId}-panel-\${item.value}\`"
        @click="toggleItem(item.value)"
        @keydown="handleKeyDown($event, idx)"
        class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
      >
        <span class="flex flex-1 items-center gap-3.5">
          <span
            v-if="showNumbers"
            class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider"
          >
            {{ String(idx + 1).padStart(2, '0') }}
          </span>
          <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
            {{ item.title }}
          </span>
        </span>

        <span
          v-if="showIcon"
          aria-hidden="true"
          class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none"
        >
          <span
            :style="{ transitionDuration: \`\${duration}ms\` }"
            :class="[
              'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
              isOpen(item.value) ? 'rotate-0' : '-rotate-180'
            ]"
          />
          <span
            :style="{ transitionDuration: \`\${duration}ms\` }"
            :class="[
              'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
              isOpen(item.value) ? 'rotate-0' : '-rotate-90'
            ]"
          />
        </span>
      </button>

      <div
        :id="\`\${baseId}-panel-\${item.value}\`"
        role="region"
        :aria-labelledby="\`\${baseId}-trigger-\${item.value}\`"
        :inert="!isOpen(item.value) ? true : undefined"
        :style="{ transitionDuration: \`\${duration}ms\` }"
        :class="[
          'grid transition-[grid-template-rows,opacity] ease-in-out',
          isOpen(item.value) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        ]"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="px-5 pt-1 pb-5 lg:px-7">
            <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
              <slot :name="item.value">
                {{ item.content }}
              </slot>
            </div>
          </div>
        </div>
      </div>
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
					filename: 'Accordion.svelte',
					language: 'svelte',
					description: 'Accordion — Svelte 5 component with Runes, CSS Grid 0fr/1fr height interpolation, and roving keyboard navigation.',
					code: `<script lang="ts">
export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

let {
  items = [],
  mode = '${mode}',
  collapsible = ${collapsible},
  gap = ${gap},
  bordered = ${bordered},
  shadow = ${shadow},
  showNumbers = ${showNumbers},
  showIcon = ${showIcon},
  duration = ${duration},
  defaultValue = undefined,
}: {
  items: AccordionItemData[];
  mode?: 'single' | 'multiple';
  collapsible?: boolean;
  gap?: number;
  bordered?: boolean;
  shadow?: boolean;
  showNumbers?: boolean;
  showIcon?: boolean;
  duration?: number;
  defaultValue?: string | string[];
} = $props();

const baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);
let activeValues = $state<Set<string>>(
  new Set(
    defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : items[0]?.value ? [items[0].value] : []
  )
);

function isOpen(val: string) {
  return activeValues.has(val);
}

function toggleItem(val: string) {
  const next = new Set(activeValues);
  if (next.has(val)) {
    if (collapsible || next.size > 1) {
      next.delete(val);
    }
  } else {
    if (mode === 'single') {
      next.clear();
    }
    next.add(val);
  }
  activeValues = next;
}

function handleKeyDown(e: KeyboardEvent, currentIndex: number) {
  const count = items.length;
  if (count === 0) return;

  let nextIndex = currentIndex;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    nextIndex = (currentIndex + 1) % count;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    nextIndex = (currentIndex - 1 + count) % count;
  } else if (e.key === 'Home') {
    e.preventDefault();
    nextIndex = 0;
  } else if (e.key === 'End') {
    e.preventDefault();
    nextIndex = count - 1;
  }

  if (nextIndex !== currentIndex) {
    const el = document.getElementById(\`\${baseId}-trigger-\${items[nextIndex].value}\`);
    el?.focus();
  }
}
</script>

<div class="exhuma-accordion flex w-full flex-col" style="gap: {gap}px;">
  {#each items as item, idx (item.value)}
    {@const open = isOpen(item.value)}
    <div
      style="transition-duration: {duration}ms;"
      class="exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all {bordered
        ? open
          ? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10'
          : 'border border-border/80 dark:border-neutral-800'
        : 'border-0 ring-0'} {shadow
        ? open
          ? 'shadow-lg shadow-black/5 dark:shadow-white/5'
          : 'shadow-sm'
        : 'shadow-none'}"
    >
      <button
        type="button"
        id="{baseId}-trigger-{item.value}"
        aria-expanded={open}
        aria-controls="{baseId}-panel-{item.value}"
        onclick={() => toggleItem(item.value)}
        onkeydown={(e) => handleKeyDown(e, idx)}
        class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
      >
        <span class="flex flex-1 items-center gap-3.5">
          {#if showNumbers}
            <span class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
              {String(idx + 1).padStart(2, '0')}
            </span>
          {/if}
          <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
            {item.title}
          </span>
        </span>

        {#if showIcon}
          <span
            aria-hidden="true"
            class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none"
          >
            <span
              style="transition-duration: {duration}ms;"
              class="bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform {open ? 'rotate-0' : '-rotate-180'}"
            ></span>
            <span
              style="transition-duration: {duration}ms;"
              class="bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform {open ? 'rotate-0' : '-rotate-90'}"
            ></span>
          </span>
        {/if}
      </button>

      <div
        id="{baseId}-panel-{item.value}"
        role="region"
        aria-labelledby="{baseId}-trigger-{item.value}"
        inert={!open ? true : undefined}
        style="transition-duration: {duration}ms;"
        class="grid transition-[grid-template-rows,opacity] ease-in-out {open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="px-5 pt-1 pb-5 lg:px-7">
            <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'accordion.component.ts',
					language: 'typescript',
					description: 'Accordion — Standalone Angular 18+ component with Signals, CSS Grid 0fr/1fr height interpolation, and roving keyboard navigation.',
					code: `import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

@Component({
  selector: 'exhuma-accordion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="exhuma-accordion flex w-full flex-col" [style.gap.px]="gap()">
      @for (item of items(); track item.value; let idx = $index) {
        @let open = isOpen(item.value);
        <div
          [style.transition-duration.ms]="duration()"
          [class]="'exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all ' +
            (bordered()
              ? (open ? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10 ' : 'border border-border/80 dark:border-neutral-800 ')
              : 'border-0 ring-0 ') +
            (shadow()
              ? (open ? 'shadow-lg shadow-black/5 dark:shadow-white/5 ' : 'shadow-sm ')
              : 'shadow-none ')"
        >
          <button
            type="button"
            [id]="baseId + '-trigger-' + item.value"
            [attr.aria-expanded]="open"
            [attr.aria-controls]="baseId + '-panel-' + item.value"
            (click)="toggleItem(item.value)"
            (keydown)="handleKeyDown($event, idx)"
            class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
          >
            <span class="flex flex-1 items-center gap-3.5">
              @if (showNumbers()) {
                <span class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
                  {{ (idx + 1 < 10 ? '0' : '') + (idx + 1) }}
                </span>
              }
              <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
                {{ item.title }}
              </span>
            </span>

            @if (showIcon()) {
              <span
                aria-hidden="true"
                class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none"
              >
                <span
                  [style.transition-duration.ms]="duration()"
                  [class]="'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform ' +
                    (open ? 'rotate-0' : '-rotate-180')"
                ></span>
                <span
                  [style.transition-duration.ms]="duration()"
                  [class]="'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform ' +
                    (open ? 'rotate-0' : '-rotate-90')"
                ></span>
              </span>
            }
          </button>

          <div
            [id]="baseId + '-panel-' + item.value"
            role="region"
            [attr.aria-labelledby]="baseId + '-trigger-' + item.value"
            [attr.inert]="!open ? true : null"
            [style.transition-duration.ms]="duration()"
            [class]="'grid transition-[grid-template-rows,opacity] ease-in-out ' +
              (open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="px-5 pt-1 pb-5 lg:px-7">
                <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  \`
})
export class AccordionComponent {
  items = input<AccordionItemData[]>([]);
  mode = input<'single' | 'multiple'>('${mode}');
  collapsible = input<boolean>(${collapsible});
  gap = input<number>(${gap});
  bordered = input<boolean>(${bordered});
  shadow = input<boolean>(${shadow});
  showNumbers = input<boolean>(${showNumbers});
  showIcon = input<boolean>(${showIcon});
  duration = input<number>(${duration});

  baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);
  activeValues = signal<string[]>([]);

  isOpen(val: string): boolean {
    return this.activeValues().includes(val);
  }

  toggleItem(val: string): void {
    const current = this.activeValues();
    const has = current.includes(val);

    if (has) {
      if (this.collapsible() || current.length > 1) {
        this.activeValues.set(current.filter((v) => v !== val));
      }
    } else {
      if (this.mode() === 'single') {
        this.activeValues.set([val]);
      } else {
        this.activeValues.set([...current, val]);
      }
    }
  }

  handleKeyDown(e: KeyboardEvent, currentIndex: number): void {
    const count = this.items().length;
    if (count === 0) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % count;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== currentIndex) {
      const el = document.getElementById(\`\${this.baseId}-trigger-\${this.items()[nextIndex].value}\`);
      el?.focus();
    }
  }
}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'Accordion.tsx',
					language: 'tsx',
					description: 'Accordion — SolidJS component with createSignal, CSS Grid 0fr/1fr height interpolation, and roving keyboard navigation.',
					code: `import { createSignal, For, Component } from 'solid-js';

export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  mode?: 'single' | 'multiple';
  collapsible?: boolean;
  gap?: number;
  bordered?: boolean;
  shadow?: boolean;
  showNumbers?: boolean;
  showIcon?: boolean;
  duration?: number;
  defaultValue?: string | string[];
}

export const Accordion: Component<AccordionProps> = (props) => {
  const mode = () => props.mode ?? '${mode}';
  const collapsible = () => props.collapsible ?? ${collapsible};
  const gap = () => props.gap ?? ${gap};
  const bordered = () => props.bordered ?? ${bordered};
  const shadow = () => props.shadow ?? ${shadow};
  const showNumbers = () => props.showNumbers ?? ${showNumbers};
  const showIcon = () => props.showIcon ?? ${showIcon};
  const duration = () => props.duration ?? ${duration};

  const baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);
  const [activeValues, setActiveValues] = createSignal<Set<string>>(
    new Set(
      props.defaultValue
        ? Array.isArray(props.defaultValue)
          ? props.defaultValue
          : [props.defaultValue]
        : props.items[0]?.value ? [props.items[0].value] : []
    )
  );

  const isOpen = (val: string) => activeValues().has(val);

  const toggleItem = (val: string) => {
    const next = new Set(activeValues());
    if (next.has(val)) {
      if (collapsible() || next.size > 1) {
        next.delete(val);
      }
    } else {
      if (mode() === 'single') {
        next.clear();
      }
      next.add(val);
    }
    setActiveValues(next);
  };

  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    const count = props.items.length;
    if (count === 0) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % count;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== currentIndex) {
      const el = document.getElementById(\`\${baseId}-trigger-\${props.items[nextIndex].value}\`);
      el?.focus();
    }
  };

  return (
    <div class="exhuma-accordion flex w-full flex-col" style={{ gap: \`\${gap()}px\` }}>
      <For each={props.items}>
        {(item, idx) => {
          const open = () => isOpen(item.value);
          return (
            <div
              style={{ 'transition-duration': \`\${duration()}ms\` }}
              classList={{
                'exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all': true,
                'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10': bordered() && open(),
                'border border-border/80 dark:border-neutral-800': bordered() && !open(),
                'border-0 ring-0': !bordered(),
                'shadow-lg shadow-black/5 dark:shadow-white/5': shadow() && open(),
                'shadow-sm': shadow() && !open(),
                'shadow-none': !shadow(),
              }}
            >
              <button
                type="button"
                id={\`\${baseId}-trigger-\${item.value}\`}
                aria-expanded={open()}
                aria-controls={\`\${baseId}-panel-\${item.value}\`}
                onClick={() => toggleItem(item.value)}
                onKeyDown={(e) => handleKeyDown(e, idx())}
                class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
              >
                <span class="flex flex-1 items-center gap-3.5">
                  {showNumbers() && (
                    <span class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
                      {String(idx() + 1).padStart(2, '0')}
                    </span>
                  )}
                  <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
                    {item.title}
                  </span>
                </span>

                {showIcon() && (
                  <span
                    aria-hidden="true"
                    class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none"
                  >
                    <span
                      style={{ 'transition-duration': \`\${duration()}ms\` }}
                      classList={{
                        'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform': true,
                        'rotate-0': open(),
                        '-rotate-180': !open(),
                      }}
                    />
                    <span
                      style={{ 'transition-duration': \`\${duration()}ms\` }}
                      classList={{
                        'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform': true,
                        'rotate-0': open(),
                        '-rotate-90': !open(),
                      }}
                    />
                  </span>
                )}
              </button>

              <div
                id={\`\${baseId}-panel-\${item.value}\`}
                role="region"
                aria-labelledby={\`\${baseId}-trigger-\${item.value}\`}
                inert={!open() ? true : undefined}
                style={{ 'transition-duration': \`\${duration()}ms\` }}
                classList={{
                  'grid transition-[grid-template-rows,opacity] ease-in-out': true,
                  'grid-rows-[1fr] opacity-100': open(),
                  'grid-rows-[0fr] opacity-0': !open(),
                }}
              >
                <div class="min-h-0 overflow-hidden">
                  <div class="px-5 pt-1 pb-5 lg:px-7">
                    <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default Accordion;
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'Accordion.astro',
					language: 'astro',
					description: 'Accordion — Astro component with client-side progressive disclosure and zero bundle overhead.',
					code: `---
export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

export interface Props {
  items: AccordionItemData[];
  mode?: 'single' | 'multiple';
  collapsible?: boolean;
  gap?: number;
  bordered?: boolean;
  shadow?: boolean;
  showNumbers?: boolean;
  showIcon?: boolean;
  duration?: number;
}

const {
  items = [],
  mode = '${mode}',
  collapsible = ${collapsible},
  gap = ${gap},
  bordered = ${bordered},
  shadow = ${shadow},
  showNumbers = ${showNumbers},
  showIcon = ${showIcon},
  duration = ${duration},
} = Astro.props;

const baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);
---

<div
  class="exhuma-accordion flex w-full flex-col"
  style={\`gap: \${gap}px;\`}
  data-accordion-root
  data-mode={mode}
  data-collapsible={String(collapsible)}
  data-duration={String(duration)}
>
  {items.map((item, idx) => {
    const isFirst = idx === 0;
    return (
      <div
        class:list={[
          'exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all',
          bordered
            ? isFirst
              ? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10'
              : 'border border-border/80 dark:border-neutral-800'
            : 'border-0 ring-0',
          shadow
            ? isFirst
              ? 'shadow-lg shadow-black/5 dark:shadow-white/5'
              : 'shadow-sm'
            : 'shadow-none'
        ]}
        style={\`transition-duration: \${duration}ms;\`}
        data-accordion-item={item.value}
        data-open={isFirst ? 'true' : 'false'}
      >
        <button
          type="button"
          id={\`\${baseId}-trigger-\${item.value}\`}
          aria-expanded={isFirst ? 'true' : 'false'}
          aria-controls={\`\${baseId}-panel-\${item.value}\`}
          class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
          data-accordion-trigger
        >
          <span class="flex flex-1 items-center gap-3.5">
            {showNumbers && (
              <span class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
                {String(idx + 1).padStart(2, '0')}
              </span>
            )}
            <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
              {item.title}
            </span>
          </span>

          {showIcon && (
            <span
              aria-hidden="true"
              class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none"
            >
              <span
                style={\`transition-duration: \${duration}ms;\`}
                class:list={[
                  'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
                  isFirst ? 'rotate-0' : '-rotate-180'
                ]}
                data-bar-h
              />
              <span
                style={\`transition-duration: \${duration}ms;\`}
                class:list={[
                  'bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform',
                  isFirst ? 'rotate-0' : '-rotate-90'
                ]}
                data-bar-v
              />
            </span>
          )}
        </button>

        <div
          id={\`\${baseId}-panel-\${item.value}\`}
          role="region"
          aria-labelledby={\`\${baseId}-trigger-\${item.value}\`}
          style={\`transition-duration: \${duration}ms;\`}
          class:list={[
            'grid transition-[grid-template-rows,opacity] ease-in-out',
            isFirst ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          ]}
          data-accordion-panel
        >
          <div class="min-h-0 overflow-hidden">
            <div class="px-5 pt-1 pb-5 lg:px-7">
              <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

<script>
  function setupAccordions() {
    document.querySelectorAll('[data-accordion-root]').forEach((root) => {
      const mode = root.getAttribute('data-mode') || 'single';
      const collapsible = root.getAttribute('data-collapsible') === 'true';
      const items = Array.from(root.querySelectorAll('[data-accordion-item]'));

      items.forEach((item, index) => {
        const trigger = item.querySelector('[data-accordion-trigger]') as HTMLButtonElement | null;
        const panel = item.querySelector('[data-accordion-panel]') as HTMLElement | null;
        const barH = item.querySelector('[data-bar-h]') as HTMLElement | null;
        const barV = item.querySelector('[data-bar-v]') as HTMLElement | null;

        if (!trigger || !panel) return;

        const toggle = () => {
          const isOpen = item.getAttribute('data-open') === 'true';

          if (isOpen) {
            if (collapsible || items.filter(it => it.getAttribute('data-open') === 'true').length > 1) {
              setClosed(item, trigger, panel, barH, barV);
            }
          } else {
            if (mode === 'single') {
              items.forEach(other => {
                if (other !== item) {
                  const oTrig = other.querySelector('[data-accordion-trigger]') as HTMLButtonElement | null;
                  const oPan = other.querySelector('[data-accordion-panel]') as HTMLElement | null;
                  const oH = other.querySelector('[data-bar-h]') as HTMLElement | null;
                  const oV = other.querySelector('[data-bar-v]') as HTMLElement | null;
                  if (oTrig && oPan) setClosed(other, oTrig, oPan, oH, oV);
                }
              });
            }
            setOpen(item, trigger, panel, barH, barV);
          }
        };

        trigger.addEventListener('click', toggle);

        trigger.addEventListener('keydown', (e: KeyboardEvent) => {
          let nextIndex = index;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (index + 1) % items.length;
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (index - 1 + items.length) % items.length;
          } else if (e.key === 'Home') {
            e.preventDefault();
            nextIndex = 0;
          } else if (e.key === 'End') {
            e.preventDefault();
            nextIndex = items.length - 1;
          }

          if (nextIndex !== index) {
            const nextTrigger = items[nextIndex]?.querySelector('[data-accordion-trigger]') as HTMLButtonElement | null;
            nextTrigger?.focus();
          }
        });
      });

      function setOpen(it: Element, trig: HTMLButtonElement, pan: HTMLElement, bH: HTMLElement | null, bV: HTMLElement | null) {
        it.setAttribute('data-open', 'true');
        trig.setAttribute('aria-expanded', 'true');
        pan.classList.remove('grid-rows-[0fr]', 'opacity-0');
        pan.classList.add('grid-rows-[1fr]', 'opacity-100');
        it.classList.add('border-primary/50', 'ring-1', 'ring-primary/20', 'z-10', 'shadow-lg');
        it.classList.remove('border-border/80', 'shadow-sm');
        if (bH) { bH.classList.add('rotate-0'); bH.classList.remove('-rotate-180'); }
        if (bV) { bV.classList.add('rotate-0'); bV.classList.remove('-rotate-90'); }
      }

      function setClosed(it: Element, trig: HTMLButtonElement, pan: HTMLElement, bH: HTMLElement | null, bV: HTMLElement | null) {
        it.setAttribute('data-open', 'false');
        trig.setAttribute('aria-expanded', 'false');
        pan.classList.remove('grid-rows-[1fr]', 'opacity-100');
        pan.classList.add('grid-rows-[0fr]', 'opacity-0');
        it.classList.remove('border-primary/50', 'ring-1', 'ring-primary/20', 'z-10', 'shadow-lg');
        it.classList.add('border-border/80', 'shadow-sm');
        if (bH) { bH.classList.remove('rotate-0'); bH.classList.add('-rotate-180'); }
        if (bV) { bV.classList.remove('rotate-0'); bV.classList.add('-rotate-90'); }
      }
    });
  }

  setupAccordions();
  document.addEventListener('astro:page-load', setupAccordions);
</script>
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'accordion.blade.php',
					language: 'php',
					description: 'Accordion — Laravel Blade component with Alpine.js reactivity and CSS Grid 0fr/1fr disclosure.',
					code: `@props([
  'items' => [],
  'mode' => '${mode}',
  'collapsible' => ${collapsible},
  'gap' => ${gap},
  'bordered' => ${bordered},
  'shadow' => ${shadow},
  'showNumbers' => ${showNumbers},
  'showIcon' => ${showIcon},
  'duration' => ${duration},
])

<div
  x-data="{
    active: ['{{ $items[0]['value'] ?? '' }}'],
    mode: '{{ $mode }}',
    collapsible: {{ $collapsible ? 'true' : 'false' }},
    isOpen(val) {
      return this.active.includes(val);
    },
    toggle(val) {
      if (this.isOpen(val)) {
        if (this.collapsible || this.active.length > 1) {
          this.active = this.active.filter(v => v !== val);
        }
      } else {
        if (this.mode === 'single') {
          this.active = [val];
        } else {
          this.active.push(val);
        }
      }
    }
  }"
  class="exhuma-accordion flex w-full flex-col"
  style="gap: {{ $gap }}px;"
>
  @foreach ($items as $idx => $item)
    <div
      :class="{
        'border border-primary/50 ring-1 ring-primary/20 z-10 shadow-lg': isOpen('{{ $item['value'] }}') && {{ $bordered ? 'true' : 'false' }},
        'border border-border/80 shadow-sm': !isOpen('{{ $item['value'] }}') && {{ $bordered ? 'true' : 'false' }},
      }"
      style="transition-duration: {{ $duration }}ms;"
      class="exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all"
    >
      <button
        type="button"
        @click="toggle('{{ $item['value'] }}')"
        :aria-expanded="isOpen('{{ $item['value'] }}')"
        class="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5"
      >
        <span class="flex flex-1 items-center gap-3.5">
          @if ($showNumbers)
            <span class="text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider">
              {{ str_pad($idx + 1, 2, '0', STR_PAD_LEFT) }}
            </span>
          @endif
          <span class="text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
            {{ $item['title'] }}
          </span>
        </span>

        @if ($showIcon)
          <span aria-hidden="true" class="relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none">
            <span
              style="transition-duration: {{ $duration }}ms;"
              :class="isOpen('{{ $item['value'] }}') ? 'rotate-0' : '-rotate-180'"
              class="bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform"
            ></span>
            <span
              style="transition-duration: {{ $duration }}ms;"
              :class="isOpen('{{ $item['value'] }}') ? 'rotate-0' : '-rotate-90'"
              class="bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform"
            ></span>
          </span>
        @endif
      </button>

      <div
        role="region"
        style="transition-duration: {{ $duration }}ms;"
        :class="isOpen('{{ $item['value'] }}') ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        class="grid transition-[grid-template-rows,opacity] ease-in-out"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="px-5 pt-1 pb-5 lg:px-7">
            <div class="border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed">
              {{ $item['content'] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  @endforeach
</div>
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'accordion.js',
					language: 'javascript',
					description: 'Accordion — Autonomous Vanilla ESM class with CSS Grid 0fr/1fr height interpolation and roving keyboard navigation.',
					code: `export class ExhumaAccordion {
  constructor(rootElement, options = {}) {
    this.root = typeof rootElement === 'string' ? document.querySelector(rootElement) : rootElement;
    if (!this.root) return;

    this.options = {
      mode: '${mode}',
      collapsible: ${collapsible},
      gap: ${gap},
      bordered: ${bordered},
      shadow: ${shadow},
      duration: ${duration},
      ...options
    };

    this.items = Array.from(this.root.querySelectorAll('[data-accordion-item]'));
    this.init();
  }

  init() {
    this.root.style.gap = \`\${this.options.gap}px\`;
    this.root.classList.add('flex', 'flex-col', 'w-full');

    this.items.forEach((item, index) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const panel = item.querySelector('[data-accordion-panel]');

      if (trigger) {
        trigger.addEventListener('click', () => this.toggle(item));
        trigger.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
      }
    });
  }

  toggle(targetItem) {
    const isOpen = targetItem.getAttribute('data-open') === 'true';

    if (isOpen) {
      if (this.options.collapsible || this.getOpenItems().length > 1) {
        this.close(targetItem);
      }
    } else {
      if (this.options.mode === 'single') {
        this.items.forEach(item => {
          if (item !== targetItem) this.close(item);
        });
      }
      this.open(targetItem);
    }
  }

  open(item) {
    item.setAttribute('data-open', 'true');
    const trigger = item.querySelector('[data-accordion-trigger]');
    const panel = item.querySelector('[data-accordion-panel]');
    const barH = item.querySelector('[data-bar-h]');
    const barV = item.querySelector('[data-bar-v]');

    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (panel) {
      panel.classList.remove('grid-rows-[0fr]', 'opacity-0');
      panel.classList.add('grid-rows-[1fr]', 'opacity-100');
    }
    if (this.options.bordered) {
      item.classList.add('border-primary/50', 'ring-1', 'ring-primary/20', 'z-10');
      item.classList.remove('border-border/80');
    }
    if (this.options.shadow) {
      item.classList.add('shadow-lg');
      item.classList.remove('shadow-sm');
    }
    if (barH) { barH.classList.add('rotate-0'); barH.classList.remove('-rotate-180'); }
    if (barV) { barV.classList.add('rotate-0'); barV.classList.remove('-rotate-90'); }
  }

  close(item) {
    item.setAttribute('data-open', 'false');
    const trigger = item.querySelector('[data-accordion-trigger]');
    const panel = item.querySelector('[data-accordion-panel]');
    const barH = item.querySelector('[data-bar-h]');
    const barV = item.querySelector('[data-bar-v]');

    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (panel) {
      panel.classList.remove('grid-rows-[1fr]', 'opacity-100');
      panel.classList.add('grid-rows-[0fr]', 'opacity-0');
    }
    if (this.options.bordered) {
      item.classList.remove('border-primary/50', 'ring-1', 'ring-primary/20', 'z-10');
      item.classList.add('border-border/80');
    }
    if (this.options.shadow) {
      item.classList.remove('shadow-lg');
      item.classList.add('shadow-sm');
    }
    if (barH) { barH.classList.remove('rotate-0'); barH.classList.add('-rotate-180'); }
    if (barV) { barV.classList.remove('rotate-0'); barV.classList.add('-rotate-90'); }
  }

  getOpenItems() {
    return this.items.filter(item => item.getAttribute('data-open') === 'true');
  }

  handleKeyDown(e, currentIndex) {
    const count = this.items.length;
    let nextIndex = currentIndex;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % count;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = count - 1;
    }

    if (nextIndex !== currentIndex) {
      const targetTrigger = this.items[nextIndex]?.querySelector('[data-accordion-trigger]');
      targetTrigger?.focus();
    }
  }
}

export function initAccordion(selector, options) {
  return new ExhumaAccordion(selector, options);
}
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: 'Accordion — Gutenberg block manifest definition.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/accordion",
  "version": "1.0.0",
  "title": "Exhuma Accordion",
  "category": "design",
  "description": "Zero-jank dynamic height disclosure with CSS Grid 0fr/1fr interpolation and morphing plus/minus icon.",
  "attributes": {
    "mode": { "type": "string", "default": "${mode}" },
    "collapsible": { "type": "boolean", "default": ${collapsible} },
    "gap": { "type": "number", "default": ${gap} },
    "bordered": { "type": "boolean", "default": ${bordered} },
    "shadow": { "type": "boolean", "default": ${shadow} },
    "duration": { "type": "number", "default": ${duration} }
  },
  "viewScript": "file:./view.js",
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'Accordion — Server-side Gutenberg block renderer.',
					code: `<?php
/**
 * Exhuma Accordion Block Template.
 */
$mode = $attributes['mode'] ?? '${mode}';
$collapsible = $attributes['collapsible'] ?? ${collapsible ? 'true' : 'false'};
$gap = $attributes['gap'] ?? ${gap};
$bordered = $attributes['bordered'] ?? ${bordered ? 'true' : 'false'};
$shadow = $attributes['shadow'] ?? ${shadow ? 'true' : 'false'};
$duration = $attributes['duration'] ?? ${duration};
?>

<div
  class="exhuma-accordion flex w-full flex-col"
  style="gap: <?php echo esc_attr($gap); ?>px;"
  data-exhuma-accordion
  data-mode="<?php echo esc_attr($mode); ?>"
  data-collapsible="<?php echo $collapsible ? 'true' : 'false'; ?>"
  data-duration="<?php echo esc_attr($duration); ?>"
>
  <?php echo $content; ?>
</div>
`,
				},
				{
					filename: 'view.js',
					language: 'javascript',
					description: 'Accordion — Client-side interactive script for WordPress front-end.',
					code: `document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-exhuma-accordion]').forEach((root) => {
    const mode = root.dataset.mode || '${mode}';
    const collapsible = root.dataset.collapsible !== 'false';
    const items = root.querySelectorAll('[data-accordion-item]');

    items.forEach((item, index) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const panel = item.querySelector('[data-accordion-panel]');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.dataset.open === 'true';
        if (isOpen) {
          if (collapsible) {
            item.dataset.open = 'false';
            trigger.setAttribute('aria-expanded', 'false');
            panel.classList.replace('grid-rows-[1fr]', 'grid-rows-[0fr]');
            panel.classList.replace('opacity-100', 'opacity-0');
          }
        } else {
          if (mode === 'single') {
            items.forEach(other => {
              other.dataset.open = 'false';
              other.querySelector('[data-accordion-trigger]')?.setAttribute('aria-expanded', 'false');
              const oPan = other.querySelector('[data-accordion-panel]');
              oPan?.classList.replace('grid-rows-[1fr]', 'grid-rows-[0fr]');
              oPan?.classList.replace('opacity-100', 'opacity-0');
            });
          }
          item.dataset.open = 'true';
          trigger.setAttribute('aria-expanded', 'true');
          panel.classList.replace('grid-rows-[0fr]', 'grid-rows-[1fr]');
          panel.classList.replace('opacity-0', 'opacity-100');
        }
      });
    });
  });
});
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-accordion.ts',
					language: 'typescript',
					description: 'Accordion — Standard W3C Custom Element (<exhuma-accordion>) with roving keyboard navigation and CSS Grid 0fr/1fr disclosure.',
					code: `export class ExhumaAccordionElement extends HTMLElement {
  private baseId = 'exhuma-acc-' + Math.random().toString(36).substring(2, 9);

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  private render() {
    const gap = this.getAttribute('gap') || '${gap}';
    this.classList.add('flex', 'flex-col', 'w-full');
    this.style.gap = \`\${gap}px\`;
  }

  private bindEvents() {
    const mode = this.getAttribute('mode') || '${mode}';
    const collapsible = this.getAttribute('collapsible') !== 'false';
    const items = Array.from(this.querySelectorAll('[data-accordion-item]'));

    items.forEach((item, index) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const panel = item.querySelector('[data-accordion-panel]');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-open') === 'true';

        if (isOpen) {
          if (collapsible || items.filter(i => i.getAttribute('data-open') === 'true').length > 1) {
            item.setAttribute('data-open', 'false');
            trigger.setAttribute('aria-expanded', 'false');
            panel.classList.remove('grid-rows-[1fr]', 'opacity-100');
            panel.classList.add('grid-rows-[0fr]', 'opacity-0');
          }
        } else {
          if (mode === 'single') {
            items.forEach(other => {
              other.setAttribute('data-open', 'false');
              other.querySelector('[data-accordion-trigger]')?.setAttribute('aria-expanded', 'false');
              const oPan = other.querySelector('[data-accordion-panel]');
              oPan?.classList.remove('grid-rows-[1fr]', 'opacity-100');
              oPan?.classList.add('grid-rows-[0fr]', 'opacity-0');
            });
          }
          item.setAttribute('data-open', 'true');
          trigger.setAttribute('aria-expanded', 'true');
          panel.classList.remove('grid-rows-[0fr]', 'opacity-0');
          panel.classList.add('grid-rows-[1fr]', 'opacity-100');
        }
      });

      trigger.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        const count = items.length;
        let nextIndex = index;

        if (keyEvent.key === 'ArrowDown') {
          keyEvent.preventDefault();
          nextIndex = (index + 1) % count;
        } else if (keyEvent.key === 'ArrowUp') {
          keyEvent.preventDefault();
          nextIndex = (index - 1 + count) % count;
        } else if (keyEvent.key === 'Home') {
          keyEvent.preventDefault();
          nextIndex = 0;
        } else if (keyEvent.key === 'End') {
          keyEvent.preventDefault();
          nextIndex = count - 1;
        }

        if (nextIndex !== index) {
          const nextTrigger = items[nextIndex]?.querySelector('[data-accordion-trigger]') as HTMLElement | null;
          nextTrigger?.focus();
        }
      });
    });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('exhuma-accordion')) {
  customElements.define('exhuma-accordion', ExhumaAccordionElement);
}
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'Accordion.tsx',
					language: 'tsx',
					description: 'Accordion — React Native component with smooth LayoutAnimation and rotating dual-bar icon.',
					code: `import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  mode?: 'single' | 'multiple';
  collapsible?: boolean;
  gap?: number;
  bordered?: boolean;
  showNumbers?: boolean;
  showIcon?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  mode = '${mode}',
  collapsible = ${collapsible},
  gap = ${gap},
  bordered = ${bordered},
  showNumbers = ${showNumbers},
  showIcon = ${showIcon},
}) => {
  const [activeValues, setActiveValues] = useState<string[]>([items[0]?.value ?? '']);

  const toggle = (val: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const isOpen = activeValues.includes(val);

    if (isOpen) {
      if (collapsible || activeValues.length > 1) {
        setActiveValues(activeValues.filter((v) => v !== val));
      }
    } else {
      if (mode === 'single') {
        setActiveValues([val]);
      } else {
        setActiveValues([...activeValues, val]);
      }
    }
  };

  return (
    <View style={[styles.root, { gap }]}>
      {items.map((item, idx) => {
        const isOpen = activeValues.includes(item.value);
        return (
          <View
            key={item.value}
            style={[
              styles.item,
              bordered && styles.bordered,
              isOpen && bordered && styles.itemActive,
            ]}
          >
            <Pressable
              onPress={() => toggle(item.value)}
              style={styles.trigger}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <View style={styles.titleContainer}>
                {showNumbers && (
                  <Text style={styles.badge}>
                    {String(idx + 1).padStart(2, '0')}
                  </Text>
                )}
                <Text style={styles.title}>{item.title}</Text>
              </View>

              {showIcon && (
                <View style={styles.iconContainer}>
                  <View style={[styles.bar, styles.barH]} />
                  <View
                    style={[
                      styles.bar,
                      styles.barV,
                      isOpen && { transform: [{ rotate: '0deg' }] },
                    ]}
                  />
                </View>
              )}
            </Pressable>

            {isOpen && (
              <View style={styles.contentContainer}>
                <View style={styles.contentDivider} />
                <Text style={styles.contentText}>{item.content}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemActive: {
    borderColor: '#6366f1',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  badge: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
    width: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    backgroundColor: '#6366f1',
    borderRadius: 99,
  },
  barH: {
    width: 14,
    height: 2,
  },
  barV: {
    width: 2,
    height: 14,
    transform: [{ rotate: '90deg' }],
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
  },
});

export default Accordion;
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'accordion.dart',
					language: 'dart',
					description: 'Accordion — Flutter StatefulWidget with AnimatedSize, clean card elevation, and morphing plus/minus icon.',
					code: `import 'package:flutter/material.dart';

class AccordionItemData {
  final String value;
  final String title;
  final String content;

  const AccordionItemData({
    required this.value,
    required this.title,
    required this.content,
  });
}

class ExhumaAccordion extends StatefulWidget {
  final List<AccordionItemData> items;
  final bool multiple;
  final bool collapsible;
  final double gap;
  final bool bordered;
  final bool showNumbers;
  final bool showIcon;
  final Duration duration;

  const ExhumaAccordion({
    super.key,
    required this.items,
    this.multiple = ${mode === 'multiple'},
    this.collapsible = ${collapsible},
    this.gap = ${gap}.0,
    this.bordered = ${bordered},
    this.showNumbers = ${showNumbers},
    this.showIcon = ${showIcon},
    this.duration = const Duration(milliseconds: ${duration}),
  });

  @override
  State<ExhumaAccordion> createState() => _ExhumaAccordionState();
}

class _ExhumaAccordionState extends State<ExhumaAccordion> {
  late Set<String> _expandedValues;

  @override
  void initState() {
    super.initState();
    _expandedValues = widget.items.isNotEmpty ? {widget.items.first.value} : {};
  }

  void _toggle(String val) {
    setState(() {
      if (_expandedValues.contains(val)) {
        if (widget.collapsible || _expandedValues.length > 1) {
          _expandedValues.remove(val);
        }
      } else {
        if (!widget.multiple) {
          _expandedValues.clear();
        }
        _expandedValues.add(val);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (int i = 0; i < widget.items.length; i++) ...[
          _buildItem(widget.items[i], i),
          if (i < widget.items.length - 1) SizedBox(height: widget.gap),
        ],
      ],
    );
  }

  Widget _buildItem(AccordionItemData item, int index) {
    final isOpen = _expandedValues.contains(item.value);
    final theme = Theme.of(context);

    return Container(
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: widget.bordered
            ? Border.all(
                color: isOpen
                    ? theme.colorScheme.primary.withValues(alpha: 0.5)
                    : theme.dividerColor.withValues(alpha: 0.3),
                width: isOpen ? 1.5 : 1.0,
              )
            : null,
        boxShadow: isOpen
            ? [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                )
              ]
            : null,
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => _toggle(item.value),
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  if (widget.showNumbers) ...[
                    Text(
                      '\${(index + 1).toString().padLeft(2, '0')}',
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(width: 14),
                  ],
                  Expanded(
                    child: Text(
                      item.title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (widget.showIcon)
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 14,
                            height: 2,
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          AnimatedRotation(
                            turns: isOpen ? 0.0 : 0.25,
                            duration: widget.duration,
                            child: Container(
                              width: 2,
                              height: 14,
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary,
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          AnimatedSize(
            duration: widget.duration,
            curve: Curves.easeInOut,
            child: isOpen
                ? Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Divider(
                          color: theme.dividerColor.withValues(alpha: 0.2),
                          height: 1,
                        ),
                        const SizedBox(height: 14),
                        Text(
                          item.content,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
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

export function getAccordionUsage(flavor: EcosystemFlavor, props: Record<string, unknown>): ComponentFilePayload {
	const mode = (props.mode as string) || 'single';
	const collapsible = props.collapsible !== false;
	const gap = Number(props.gap ?? 12);
	const bordered = props.bordered !== false;
	const shadow = props.shadow !== false;
	const showNumbers = props.showNumbers !== false;
	const showIcon = props.showIcon !== false;
	const duration = Number(props.duration ?? 300);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			const header = isNext ? "'use client';\n\n" : '';
			return {
				filename: 'AccordionDemo.tsx',
				language: 'tsx',
				description: 'Accordion usage demonstration with realistic FAQ questions.',
				code: `${header}import * as React from 'react';
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const FAQ_ITEMS = [
  {
    value: 'item-1',
    question: 'How does Exhuma achieve zero-jank height transitions?',
    answer: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
  },
  {
    value: 'item-2',
    question: 'Is it fully accessible and WCAG 2.1 AA compliant?',
    answer: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, inert panel states, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
  },
  {
    value: 'item-3',
    question: 'Can I customize the signature counter-rotating icon?',
    answer: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies. You can pass showIcon={false} or provide custom children to the trigger to customize its appearance.',
  },
];

export function AccordionDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <AccordionRoot
        mode="${mode}"
        collapsible={${collapsible}}
        gap={${gap}}
        bordered={${bordered}}
        shadow={${shadow}}
        showNumbers={${showNumbers}}
        showIcon={${showIcon}}
        duration={${duration}}
        defaultValue="item-1"
      >
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </div>
  );
}
`,
			};
		}

		case 'vue': {
			return {
				filename: 'AccordionDemo.vue',
				language: 'vue',
				description: 'Vue 3 Accordion usage demo with FAQ data.',
				code: `<script setup lang="ts">
import Accordion, { type AccordionItemData } from './Accordion.vue';

const faqItems: AccordionItemData[] = [
  {
    value: 'item-1',
    title: 'How does Exhuma achieve zero-jank height transitions?',
    content: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
  },
  {
    value: 'item-2',
    title: 'Is it fully accessible and WCAG 2.1 AA compliant?',
    content: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
  },
  {
    value: 'item-3',
    title: 'Can I customize the signature counter-rotating icon?',
    content: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies. You can configure showIcon or provide custom template slots.',
  },
];
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-4">
    <Accordion
      :items="faqItems"
      mode="${mode}"
      :collapsible="${collapsible}"
      :gap="${gap}"
      :bordered="${bordered}"
      :shadow="${shadow}"
      :showNumbers="${showNumbers}"
      :showIcon="${showIcon}"
      :duration="${duration}"
      defaultValue="item-1"
    />
  </div>
</template>
`,
			};
		}

		case 'svelte': {
			return {
				filename: 'AccordionDemo.svelte',
				language: 'svelte',
				description: 'Svelte 5 Accordion usage demo with FAQ data.',
				code: `<script lang="ts">
  import Accordion, { type AccordionItemData } from './Accordion.svelte';

  const faqItems: AccordionItemData[] = [
    {
      value: 'item-1',
      title: 'How does Exhuma achieve zero-jank height transitions?',
      content: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
    },
    {
      value: 'item-2',
      title: 'Is it fully accessible and WCAG 2.1 AA compliant?',
      content: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
    },
    {
      value: 'item-3',
      title: 'Can I customize the signature counter-rotating icon?',
      content: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies. You can configure showIcon or customize styling.',
    },
  ];
</script>

<div class="w-full max-w-2xl mx-auto p-4">
  <Accordion
    items={faqItems}
    mode="${mode}"
    collapsible={${collapsible}}
    gap={${gap}}
    bordered={${bordered}}
    shadow={${shadow}}
    showNumbers={${showNumbers}}
    showIcon={${showIcon}}
    duration={${duration}}
    defaultValue="item-1"
  />
</div>
`,
			};
		}

		case 'angular': {
			return {
				filename: 'accordion-demo.component.ts',
				language: 'typescript',
				description: 'Angular 18+ Accordion usage demo with Standalone component.',
				code: `import { Component } from '@angular/core';
import { AccordionComponent, type AccordionItemData } from './accordion.component';

@Component({
  selector: 'app-accordion-demo',
  standalone: true,
  imports: [AccordionComponent],
  template: \`
    <div class="w-full max-w-2xl mx-auto p-4">
      <exhuma-accordion
        [items]="faqItems"
        mode="${mode}"
        [collapsible]="${collapsible}"
        [gap]="${gap}"
        [bordered]="${bordered}"
        [shadow]="${shadow}"
        [showNumbers]="${showNumbers}"
        [showIcon]="${showIcon}"
        [duration]="${duration}"
      />
    </div>
  \`
})
export class AccordionDemoComponent {
  faqItems: AccordionItemData[] = [
    {
      value: 'item-1',
      title: 'How does Exhuma achieve zero-jank height transitions?',
      content: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
    },
    {
      value: 'item-2',
      title: 'Is it fully accessible and WCAG 2.1 AA compliant?',
      content: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
    },
    {
      value: 'item-3',
      title: 'Can I customize the signature counter-rotating icon?',
      content: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies.',
    },
  ];
}
`,
			};
		}

		case 'solid': {
			return {
				filename: 'AccordionDemo.tsx',
				language: 'tsx',
				description: 'SolidJS Accordion usage demo with FAQ data.',
				code: `import { Accordion, type AccordionItemData } from './Accordion';

const faqItems: AccordionItemData[] = [
  {
    value: 'item-1',
    title: 'How does Exhuma achieve zero-jank height transitions?',
    content: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
  },
  {
    value: 'item-2',
    title: 'Is it fully accessible and WCAG 2.1 AA compliant?',
    content: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
  },
  {
    value: 'item-3',
    title: 'Can I customize the signature counter-rotating icon?',
    content: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies.',
  },
];

export function AccordionDemo() {
  return (
    <div class="w-full max-w-2xl mx-auto p-4">
      <Accordion
        items={faqItems}
        mode="${mode}"
        collapsible={${collapsible}}
        gap={${gap}}
        bordered={${bordered}}
        shadow={${shadow}}
        showNumbers={${showNumbers}}
        showIcon={${showIcon}}
        duration={${duration}}
        defaultValue="item-1"
      />
    </div>
  );
}
`,
			};
		}

		case 'astro': {
			return {
				filename: 'AccordionDemo.astro',
				language: 'astro',
				description: 'Astro Accordion usage demo.',
				code: `---
import Accordion from './Accordion.astro';

const faqItems = [
  {
    value: 'item-1',
    title: 'How does Exhuma achieve zero-jank height transitions?',
    content: 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
  },
  {
    value: 'item-2',
    title: 'Is it fully accessible and WCAG 2.1 AA compliant?',
    content: 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation (ArrowUp, ArrowDown, Home, End).',
  },
  {
    value: 'item-3',
    title: 'Can I customize the signature counter-rotating icon?',
    content: 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies.',
  },
];
---

<div class="w-full max-w-2xl mx-auto p-4">
  <Accordion
    items={faqItems}
    mode="${mode}"
    collapsible={${collapsible}}
    gap={${gap}}
    bordered={${bordered}}
    shadow={${shadow}}
    showNumbers={${showNumbers}}
    showIcon={${showIcon}}
    duration={${duration}}
  />
</div>
`,
			};
		}

		case 'blade': {
			return {
				filename: 'accordion-demo.blade.php',
				language: 'php',
				description: 'Laravel Blade Accordion usage demo.',
				code: `@php
$faqItems = [
  [
    'value' => 'item-1',
    'title' => 'How does Exhuma achieve zero-jank height transitions?',
    'content' => 'Exhuma uses CSS Grid row-interpolation from 0fr to 1fr. Unlike max-height approximations or continuous JS height measurements, this guarantees 120fps GPU compositing with zero layout thrashing or hitching.',
  ],
  [
    'value' => 'item-2',
    'title' => 'Is it fully accessible and WCAG 2.1 AA compliant?',
    'content' => 'Yes. Full WAI-ARIA Accordion Pattern compliance is built-in: aria-expanded, aria-controls, aria-labelledby, region roles, and roving focus keyboard navigation.',
  ],
  [
    'value' => 'item-3',
    'title' => 'Can I customize the signature counter-rotating icon?',
    'content' => 'The icon uses kinetic dual-bar geometry with zero SVG or icon library dependencies.',
  ],
];
@endphp

<div class="w-full max-w-2xl mx-auto p-4">
  <x-accordion
    :items="$faqItems"
    mode="${mode}"
    :collapsible="${collapsible ? 'true' : 'false'}"
    :gap="${gap}"
    :bordered="${bordered ? 'true' : 'false'}"
    :shadow="${shadow ? 'true' : 'false'}"
    :showNumbers="${showNumbers ? 'true' : 'false'}"
    :showIcon="${showIcon ? 'true' : 'false'}"
    :duration="${duration}"
  />
</div>
`,
			};
		}

		case 'vanilla': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Vanilla HTML/JS Accordion setup demo.',
				code: `<!-- Include Accordion HTML Markup -->
<div id="faq-accordion">
  <div data-accordion-item="item-1" data-open="true" class="rounded-2xl border border-primary/50 ring-1 ring-primary/20 bg-card">
    <button type="button" data-accordion-trigger class="flex w-full justify-between items-center px-5 py-4 font-medium">
      <span>01 How does Exhuma achieve zero-jank transitions?</span>
      <span aria-hidden="true" class="relative inline-flex h-6 w-6 items-center justify-center">
        <span data-bar-h class="bg-primary absolute h-0.5 w-3.5 rounded-full rotate-0 transition-transform"></span>
        <span data-bar-v class="bg-primary absolute h-0.5 w-3.5 rounded-full rotate-0 transition-transform"></span>
      </span>
    </button>
    <div data-accordion-panel class="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity]">
      <div class="min-h-0 overflow-hidden px-5 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/60">
        Exhuma uses CSS Grid row-interpolation from 0fr to 1fr for perfectly smooth GPU disclosure.
      </div>
    </div>
  </div>
</div>

<script type="module">
  import { initAccordion } from './accordion.js';

  initAccordion('#faq-accordion', {
    mode: '${mode}',
    collapsible: ${collapsible},
    gap: ${gap},
    bordered: ${bordered},
    shadow: ${shadow},
    duration: ${duration}
  });
</script>
`,
			};
		}

		case 'wordpress': {
			return {
				filename: 'example-page.php',
				language: 'php',
				description: 'WordPress template Accordion demo.',
				code: `<?php
/**
 * Template Name: Accordion FAQ Example
 */
get_header();
?>

<div class="entry-content max-w-2xl mx-auto py-12 px-4">
  <!-- Insert Gutenberg block: <!-- wp:exhuma/accordion {"mode":"${mode}","collapsible":${collapsible},"gap":${gap},"bordered":${bordered},"shadow":${shadow},"duration":${duration}} -->
  <?php echo do_blocks('<!-- wp:exhuma/accordion --> ... <!-- /wp:exhuma/accordion -->'); ?>
</div>

<?php get_footer(); ?>
`,
			};
		}

		case 'webcomponent': {
			return {
				filename: 'index.html',
				language: 'html',
				description: 'Web Component <exhuma-accordion> usage demonstration.',
				code: `<script type="module" src="./exhuma-accordion.ts"></script>

<div class="w-full max-w-2xl mx-auto p-4">
  <exhuma-accordion
    mode="${mode}"
    collapsible="${collapsible}"
    gap="${gap}"
    bordered="${bordered}"
    shadow="${shadow}"
    duration="${duration}"
  >
    <div data-accordion-item="item-1" data-open="true" class="rounded-2xl border border-primary/50 ring-1 ring-primary/20 bg-card overflow-hidden">
      <button type="button" data-accordion-trigger class="flex w-full justify-between items-center px-5 py-4 font-semibold">
        <span>How does Exhuma achieve zero-jank height transitions?</span>
      </button>
      <div data-accordion-panel class="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity]">
        <div class="min-h-0 overflow-hidden px-5 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/60">
          CSS Grid row interpolation from 0fr to 1fr guarantees 120fps GPU animations with zero layout thrashing.
        </div>
      </div>
    </div>
  </exhuma-accordion>
</div>
`,
			};
		}

		case 'react-native': {
			return {
				filename: 'AccordionDemo.tsx',
				language: 'tsx',
				description: 'React Native Accordion usage demonstration.',
				code: `import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Accordion, type AccordionItemData } from './Accordion';

const faqItems: AccordionItemData[] = [
  {
    value: 'item-1',
    title: 'How does Exhuma achieve zero-jank height transitions?',
    content: 'Using fluid spring kinetics and LayoutAnimation, achieving smooth 60/120fps disclosure without layout hitching.',
  },
  {
    value: 'item-2',
    title: 'Is it fully accessible on mobile devices?',
    content: 'Yes, fully supporting screen readers with accessibilityRole and accessibilityState={ expanded }.',
  },
  {
    value: 'item-3',
    title: 'Can I customize the rotating icon?',
    content: 'The dual-bar cross icon is rendered with pure native View components with zero vector asset dependencies.',
  },
];

export function AccordionDemo() {
  return (
    <SafeAreaView style={styles.container}>
      <Accordion
        items={faqItems}
        mode="${mode}"
        collapsible={${collapsible}}
        gap={${gap}}
        bordered={${bordered}}
        showNumbers={${showNumbers}}
        showIcon={${showIcon}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
});
`,
			};
		}

		case 'flutter': {
			return {
				filename: 'accordion_demo.dart',
				language: 'dart',
				description: 'Flutter Accordion usage demonstration.',
				code: `import 'package:flutter/material.dart';
import 'accordion.dart';

class AccordionDemoPage extends StatelessWidget {
  const AccordionDemoPage({super.key});

  static const List<AccordionItemData> faqItems = [
    AccordionItemData(
      value: 'item-1',
      title: 'How does Exhuma achieve zero-jank height transitions?',
      content: 'Using AnimatedSize with easeInOut kinetic curves and dual-bar counter-rotating icons.',
    ),
    AccordionItemData(
      value: 'item-2',
      title: 'Is it accessible on iOS and Android?',
      content: 'Fully compliant with Semantics and platform accessibility standards.',
    ),
    AccordionItemData(
      value: 'item-3',
      title: 'Can I customize the rotating icon?',
      content: 'The signature morphing icon is drawn with zero SVG assets, perfectly matching Material 3 typography.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Accordion FAQ Demo')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: const ExhumaAccordion(
              items: faqItems,
              multiple: ${mode === 'multiple'},
              collapsible: ${collapsible},
              gap: ${gap}.0,
              bordered: ${bordered},
              showNumbers: ${showNumbers},
              showIcon: ${showIcon},
              duration: Duration(milliseconds: ${duration}),
            ),
          ),
        ),
      ),
    );
  }
}
`,
			};
		}

		default:
			return {
				filename: 'Accordion.tsx',
				language: 'tsx',
				description: 'Accordion component.',
				code: '// Accordion component',
			};
	}
}
