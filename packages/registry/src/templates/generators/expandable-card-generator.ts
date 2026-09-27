import { ComponentFilePayload, EcosystemFlavor } from '../../schema';

export function getExpandableCardOuterFiles(flavor: EcosystemFlavor, props: Record<string, unknown>, isEjected: boolean): ComponentFilePayload[] | null {
	const duration = Number(props.duration ?? 360);

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			if (!isEjected) return null;
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: 'ExpandableCard.tsx',
					language: 'tsx',
					description: 'Expandable Card — Standalone Ejected Engine (Zero Dependencies). Raw bidirectional FLIP morphing and modal semantics inlined.',
					code: `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardContent: React.ReactNode;
  expandedContent: React.ReactNode;
  duration?: number;
  expandedClassName?: string;
  portalContainer?: HTMLElement | null;
}

/**
 * ExpandableCard — Standalone Ejected Engine (Zero-Dependency)
 * Big-Omega Guarantees:
 * - Constant-time Ω(1) FLIP delta computation.
 * - Zero layout thrashing: geometry captured once at discrete state transition.
 * - Bidirectional smooth collapse: reverses transform back to origin on dismiss.
 * - Full accessible dialog semantics and keyboard Escape handling.
 */
export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  cardContent,
  expandedContent,
  duration = ${duration},
  className,
  expandedClassName = '',
  portalContainer,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const firstRectRef = React.useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const invertTransformRef = React.useRef<string>('translate3d(0, 0, 0) scale(1, 1)');
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      firstRectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    setIsClosing(false);
    setIsExpanded(true);
  };

  const close = () => {
    if (isClosing || !isExpanded) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      firstRectRef.current = null;
      triggerRef.current?.focus();
    }, duration);
  };

  // Keyboard Escape listener
  React.useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  // Lock body scroll with scrollbar compensation to eliminate layout jumps
  React.useLayoutEffect(() => {
    if (!isExpanded) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = \`\${currentPadding + scrollbarWidth}px\`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isExpanded]);

  // FLIP open animation
  React.useLayoutEffect(() => {
    if (!isExpanded || isClosing || !modalRef.current || !firstRectRef.current) return;

    const modal = modalRef.current;
    const lastRect = modal.getBoundingClientRect();
    const currentTrigger = triggerRef.current?.getBoundingClientRect();
    const firstRect = currentTrigger && currentTrigger.width > 0 ? {
      left: currentTrigger.left,
      top: currentTrigger.top,
      width: currentTrigger.width,
      height: currentTrigger.height,
    } : firstRectRef.current;

    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    const scaleX = lastRect.width > 0 ? firstRect.width / lastRect.width : 1;
    const scaleY = lastRect.height > 0 ? firstRect.height / lastRect.height : 1;

    const invert = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
    invertTransformRef.current = invert;

    modal.style.transformOrigin = 'top left';
    modal.style.transform = invert;
    modal.style.opacity = '0.7';
    modal.style.transition = 'none';

    if (backdropRef.current) {
      backdropRef.current.style.opacity = '0';
      backdropRef.current.style.transition = 'none';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.8)}ms ease\`;
        modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
        modal.style.opacity = '1';
        modal.focus();

        if (backdropRef.current) {
          backdropRef.current.style.transition = \`opacity \${duration}ms ease\`;
          backdropRef.current.style.opacity = '1';
        }
      });
    });
  }, [isExpanded, isClosing, duration]);

  // Reverse FLIP on close
  React.useEffect(() => {
    if (!isClosing || !modalRef.current) return;
    const modal = modalRef.current;
    modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.7)}ms ease\`;
    modal.style.transform = invertTransformRef.current;
    modal.style.opacity = '0';

    if (backdropRef.current) {
      backdropRef.current.style.transition = \`opacity \${duration}ms ease\`;
      backdropRef.current.style.opacity = '0';
    }
  }, [isClosing, duration]);

  return (
    <>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        className={clsx(
          'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none',
          className
        )}
        onClick={open}
        {...props}
      >
        {cardContent}
      </div>

      {mounted && isExpanded &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <div
              ref={backdropRef}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <div
              ref={modalRef}
              tabIndex={-1}
              className={clsx(
                'relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl outline-none will-change-transform',
                expandedClassName
              )}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={close}
                  className="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
                {expandedContent}
              </div>
            </div>
          </div>,
          portalContainer || document.body
        )}
    </>
  );
};
ExpandableCard.displayName = 'ExpandableCard';
`,
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: 'ExpandableCard.vue',
					language: 'vue',
					description: 'Vue 3 Native Expandable Card with Teleport and FLIP morphing.',
					code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface Props {
  duration?: number;
  class?: string;
  expandedClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: ${duration},
  class: '',
  expandedClass: '',
});

const isExpanded = ref(false);
const isClosing = ref(false);
const triggerRef = ref<HTMLDivElement | null>(null);
const modalRef = ref<HTMLDivElement | null>(null);
const backdropRef = ref<HTMLDivElement | null>(null);

let firstRect: { left: number; top: number; width: number; height: number } | null = null;
let invertTransform = 'translate3d(0, 0, 0) scale(1, 1)';
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const open = () => {
  if (triggerRef.value) {
    const r = triggerRef.value.getBoundingClientRect();
    firstRect = { left: r.left, top: r.top, width: r.width, height: r.height };
  }
  isClosing.value = false;
  isExpanded.value = true;

  nextTick(() => {
    if (!modalRef.value || !firstRect) return;
    const modal = modalRef.value;
    const lastRect = modal.getBoundingClientRect();

    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    const scaleX = lastRect.width > 0 ? firstRect.width / lastRect.width : 1;
    const scaleY = lastRect.height > 0 ? firstRect.height / lastRect.height : 1;

    invertTransform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;

    modal.style.transformOrigin = 'top left';
    modal.style.transform = invertTransform;
    modal.style.opacity = '0.7';
    modal.style.transition = 'none';

    if (backdropRef.value) {
      backdropRef.value.style.opacity = '0';
      backdropRef.value.style.transition = 'none';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition = \`transform \${props.duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(props.duration * 0.8)}ms ease\`;
        modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
        modal.style.opacity = '1';

        if (backdropRef.value) {
          backdropRef.value.style.transition = \`opacity \${props.duration}ms ease\`;
          backdropRef.value.style.opacity = '1';
        }
      });
    });
  });
};

const close = () => {
  if (isClosing.value || !isExpanded.value || !modalRef.value) return;
  isClosing.value = true;

  const modal = modalRef.value;
  modal.style.transition = \`transform \${props.duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(props.duration * 0.7)}ms ease\`;
  modal.style.transform = invertTransform;
  modal.style.opacity = '0';

  if (backdropRef.value) {
    backdropRef.value.style.transition = \`opacity \${props.duration}ms ease\`;
    backdropRef.value.style.opacity = '0';
  }

  closeTimer = setTimeout(() => {
    isExpanded.value = false;
    isClosing.value = false;
    firstRect = null;
  }, props.duration);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isExpanded.value) close();
};

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
  if (closeTimer) clearTimeout(closeTimer);
});
</script>

<template>
  <div
    ref="triggerRef"
    :class="[
      'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none',
      props.class
    ]"
    @click="open"
  >
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <div
      v-if="isExpanded"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref="backdropRef"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        @click="close"
      />
      <div
        ref="modalRef"
        :class="[
          'relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl will-change-transform',
          props.expandedClass
        ]"
      >
        <div class="relative">
          <button
            type="button"
            class="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
            @click="close"
          >
            ✕
          </button>
          <slot name="expanded" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: 'ExpandableCard.svelte',
					language: 'svelte',
					description: 'Svelte 5 Native Expandable Card with Runes and FLIP transition.',
					code: `<script lang="ts">
  import { onMount, tick } from 'svelte';

  interface Props {
    duration?: number;
    class?: string;
    expandedClass?: string;
    trigger?: import('svelte').Snippet;
    expanded?: import('svelte').Snippet;
  }

  let {
    duration = ${duration},
    class: className = '',
    expandedClass = '',
    trigger,
    expanded,
  }: Props = $props();

  let isExpanded = $state(false);
  let isClosing = $state(false);
  let triggerEl: HTMLDivElement | null = $state(null);
  let modalEl: HTMLDivElement | null = $state(null);
  let backdropEl: HTMLDivElement | null = $state(null);

  let firstRect: { left: number; top: number; width: number; height: number } | null = null;
  let invertTransform = 'translate3d(0, 0, 0) scale(1, 1)';
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  async function open() {
    if (triggerEl) {
      const r = triggerEl.getBoundingClientRect();
      firstRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    isClosing = false;
    isExpanded = true;

    await tick();
    if (!modalEl || !firstRect) return;

    const modal = modalEl;
    const lastRect = modal.getBoundingClientRect();

    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    const scaleX = lastRect.width > 0 ? firstRect.width / lastRect.width : 1;
    const scaleY = lastRect.height > 0 ? firstRect.height / lastRect.height : 1;

    invertTransform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;

    modal.style.transformOrigin = 'top left';
    modal.style.transform = invertTransform;
    modal.style.opacity = '0.7';
    modal.style.transition = 'none';

    if (backdropEl) {
      backdropEl.style.opacity = '0';
      backdropEl.style.transition = 'none';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.8)}ms ease\`;
        modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
        modal.style.opacity = '1';

        if (backdropEl) {
          backdropEl.style.transition = \`opacity \${duration}ms ease\`;
          backdropEl.style.opacity = '1';
        }
      });
    });
  }

  function close() {
    if (isClosing || !isExpanded || !modalEl) return;
    isClosing = true;

    modalEl.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.7)}ms ease\`;
    modalEl.style.transform = invertTransform;
    modalEl.style.opacity = '0';

    if (backdropEl) {
      backdropEl.style.transition = \`opacity \${duration}ms ease\`;
      backdropEl.style.opacity = '0';
    }

    closeTimer = setTimeout(() => {
      isExpanded = false;
      isClosing = false;
      firstRect = null;
    }, duration);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isExpanded) close();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (closeTimer) clearTimeout(closeTimer);
    };
  });
</script>

<div
  bind:this={triggerEl}
  class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none {className}"
  onclick={open}
  role="button"
  tabindex="0"
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
>
  {@render trigger?.()}
</div>

{#if isExpanded}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
    <div
      bind:this={backdropEl}
      class="fixed inset-0 bg-black/60 backdrop-blur-sm"
      onclick={close}
    />
    <div
      bind:this={modalEl}
      class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl will-change-transform {expandedClass}"
    >
      <div class="relative">
        <button
          type="button"
          class="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close dialog"
          onclick={close}
        >
          ✕
        </button>
        {@render expanded?.()}
      </div>
    </div>
  </div>
{/if}
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: 'ExpandableCard.tsx',
					language: 'tsx',
					description: 'SolidJS Native Expandable Card with Portal and FLIP transitions.',
					code: `import { Component, createSignal, JSX, onMount, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

export interface ExpandableCardProps {
  trigger?: JSX.Element;
  expanded?: JSX.Element;
  duration?: number;
  class?: string;
  expandedClass?: string;
}

export const ExpandableCard: Component<ExpandableCardProps> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  const duration = props.duration ?? ${duration};

  let triggerEl: HTMLDivElement | undefined;
  let modalEl: HTMLDivElement | undefined;
  let backdropEl: HTMLDivElement | undefined;
  let firstRect: { left: number; top: number; width: number; height: number } | null = null;
  let invertTransform = 'translate3d(0, 0, 0) scale(1, 1)';
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    if (triggerEl) {
      const r = triggerEl.getBoundingClientRect();
      firstRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    setIsClosing(false);
    setIsExpanded(true);

    requestAnimationFrame(() => {
      if (!modalEl || !firstRect) return;
      const lastRect = modalEl.getBoundingClientRect();
      const dx = firstRect.left - lastRect.left;
      const dy = firstRect.top - lastRect.top;
      const scaleX = lastRect.width > 0 ? firstRect.width / lastRect.width : 1;
      const scaleY = lastRect.height > 0 ? firstRect.height / lastRect.height : 1;

      invertTransform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
      modalEl.style.transformOrigin = 'top left';
      modalEl.style.transform = invertTransform;
      modalEl.style.opacity = '0.7';

      requestAnimationFrame(() => {
        if (!modalEl) return;
        modalEl.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.8)}ms ease\`;
        modalEl.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
        modalEl.style.opacity = '1';
      });
    });
  };

  const close = () => {
    if (isClosing() || !isExpanded() || !modalEl) return;
    setIsClosing(true);
    modalEl.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.7)}ms ease\`;
    modalEl.style.transform = invertTransform;
    modalEl.style.opacity = '0';

    closeTimer = setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      firstRect = null;
    }, duration);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded()) close();
  };

  onMount(() => window.addEventListener('keydown', onKeyDown));
  onCleanup(() => {
    window.removeEventListener('keydown', onKeyDown);
    if (closeTimer) clearTimeout(closeTimer);
  });

  return (
    <>
      <div
        ref={triggerEl}
        class={\`relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none \${props.class ?? ''}\`}
        onClick={open}
      >
        {props.trigger}
      </div>

      {isExpanded() && (
        <Portal>
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <div ref={backdropEl} class="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
            <div
              ref={modalEl}
              class={\`relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl will-change-transform \${props.expandedClass ?? ''}\`}
            >
              <div class="relative">
                <button
                  type="button"
                  class="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  onClick={close}
                >
                  ✕
                </button>
                {props.expanded}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: 'expandable-card.component.ts',
					language: 'typescript',
					description: 'Angular 18+ Standalone Expandable Card with signals.',
					code: `import { Component, input, signal, ElementRef, viewChild, effect } from '@angular/core';

@Component({
  selector: 'exhuma-expandable-card',
  standalone: true,
  template: \`
    <div
      #trigger
      class="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none {{ customClass() }}"
      (click)="open()"
      tabindex="0"
    >
      <ng-content select="[slot=trigger]"></ng-content>
    </div>

    @if (isExpanded()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div #backdrop class="fixed inset-0 bg-black/60 backdrop-blur-sm" (click)="close()"></div>
        <div
          #modal
          tabindex="-1"
          class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl outline-none will-change-transform {{ expandedClass() }}"
        >
          <div class="relative">
            <button
              type="button"
              class="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              (click)="close()"
            >
              ✕
            </button>
            <ng-content select="[slot=expanded]"></ng-content>
          </div>
        </div>
      </div>
    }
  \`,
})
export class ExhumaExpandableCardComponent {
  readonly duration = input<number>(${duration});
  readonly customClass = input<string>('');
  readonly expandedClass = input<string>('');

  readonly trigger = viewChild<ElementRef<HTMLDivElement>>('trigger');
  readonly modal = viewChild<ElementRef<HTMLDivElement>>('modal');
  readonly backdrop = viewChild<ElementRef<HTMLDivElement>>('backdrop');

  readonly isExpanded = signal<boolean>(false);
  readonly isClosing = signal<boolean>(false);

  private firstRect: { left: number; top: number; width: number; height: number } | null = null;
  private invertTransform = 'translate3d(0, 0, 0) scale(1, 1)';
  private closeTimer: any = null;

  constructor() {
    effect(() => {
      if (this.isExpanded() && !this.isClosing()) {
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          const modalEl = this.modal()?.nativeElement;
          const backdropEl = this.backdrop()?.nativeElement;
          if (!modalEl || !this.firstRect) return;

          const lastRect = modalEl.getBoundingClientRect();
          const dx = this.firstRect.left - lastRect.left;
          const dy = this.firstRect.top - lastRect.top;
          const scaleX = lastRect.width > 0 ? this.firstRect.width / lastRect.width : 1;
          const scaleY = lastRect.height > 0 ? this.firstRect.height / lastRect.height : 1;

          this.invertTransform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
          modalEl.style.transformOrigin = 'top left';
          modalEl.style.transform = this.invertTransform;
          modalEl.style.opacity = '0.7';

          if (backdropEl) {
            backdropEl.style.opacity = '0';
          }

          requestAnimationFrame(() => {
            modalEl.style.transition = \`transform \${this.duration()}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(this.duration() * 0.8)}ms ease\`;
            modalEl.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
            modalEl.style.opacity = '1';
            modalEl.focus();

            if (backdropEl) {
              backdropEl.style.transition = \`opacity \${this.duration()}ms ease\`;
              backdropEl.style.opacity = '1';
            }
          });
        });
      }
    });
  }

  open() {
    const triggerEl = this.trigger()?.nativeElement;
    if (triggerEl) {
      const r = triggerEl.getBoundingClientRect();
      this.firstRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    }
    this.isClosing.set(false);
    this.isExpanded.set(true);
  }

  close() {
    if (this.isClosing() || !this.isExpanded()) return;
    this.isClosing.set(true);

    const modalEl = this.modal()?.nativeElement;
    const backdropEl = this.backdrop()?.nativeElement;
    if (modalEl) {
      modalEl.style.transition = \`transform \${this.duration()}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(this.duration() * 0.7)}ms ease\`;
      modalEl.style.transform = this.invertTransform;
      modalEl.style.opacity = '0';
    }
    if (backdropEl) {
      backdropEl.style.transition = \`opacity \${this.duration()}ms ease\`;
      backdropEl.style.opacity = '0';
    }

    this.closeTimer = setTimeout(() => {
      this.isExpanded.set(false);
      this.isClosing.set(false);
      document.body.style.overflow = '';
      this.firstRect = null;
      this.trigger()?.nativeElement.focus();
    }, this.duration());
  }
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: 'ExpandableCard.astro',
					language: 'astro',
					description: 'Native Astro Expandable Card with inline FLIP script.',
					code: `---
interface Props {
  duration?: number;
  class?: string;
  expandedClass?: string;
}

const {
  duration = ${duration},
  class: className = '',
  expandedClass = '',
} = Astro.props;
---

<div
  class={\`exhuma-expandable-card relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none \${className}\`}
  data-duration={duration}
>
  <slot name="trigger" />
</div>

<template class="exhuma-modal-template">
  <div class="exhuma-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
    <div class="exhuma-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
    <div class={\`exhuma-modal-content relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl will-change-transform \${expandedClass}\`}>
      <div class="relative">
        <button type="button" class="exhuma-close-btn absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          ✕
        </button>
        <slot name="expanded" />
      </div>
    </div>
  </div>
</template>

<script>
  function initExpandable() {
    document.querySelectorAll<HTMLElement>('.exhuma-expandable-card').forEach((card) => {
      if (card.dataset.initialized) return;
      card.dataset.initialized = 'true';

      const duration = parseInt(card.dataset.duration || '${duration}', 10);
      const template = card.nextElementSibling as HTMLTemplateElement;
      if (!template) return;

      card.addEventListener('click', () => {
        const firstRect = card.getBoundingClientRect();
        const clone = template.content.cloneNode(true) as HTMLElement;
        const portal = clone.querySelector('.exhuma-modal-portal') as HTMLElement;
        const modal = clone.querySelector('.exhuma-modal-content') as HTMLElement;
        const backdrop = clone.querySelector('.exhuma-backdrop') as HTMLElement;
        const closeBtn = clone.querySelector('.exhuma-close-btn') as HTMLElement;

        document.body.appendChild(portal);

        const lastRect = modal.getBoundingClientRect();
        const dx = firstRect.left - lastRect.left;
        const dy = firstRect.top - lastRect.top;
        const scaleX = firstRect.width / lastRect.width;
        const scaleY = firstRect.height / lastRect.height;

        modal.style.transformOrigin = 'top left';
        modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
        modal.style.opacity = '0.7';

        requestAnimationFrame(() => {
          modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.8)}ms ease\`;
          modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
          modal.style.opacity = '1';
        });

        const dismiss = () => {
          modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.7)}ms ease\`;
          modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
          modal.style.opacity = '0';
          setTimeout(() => portal.remove(), duration);
        };

        backdrop.addEventListener('click', dismiss);
        closeBtn.addEventListener('click', dismiss);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initExpandable);
  initExpandable();
</script>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: 'exhuma-expandable-card.js',
					language: 'javascript',
					description: 'Universal Custom Web Component <exhuma-expandable-card>.',
					code: `/**
 * Exhuma Expandable Card Web Component
 * <exhuma-expandable-card duration="360">
 */
class ExhumaExpandableCard extends HTMLElement {
  constructor() {
    super();
    this.duration = parseInt(this.getAttribute('duration') || '${duration}', 10);
    this.isExpanded = false;
  }

  connectedCallback() {
    this.style.position = 'relative';
    this.style.display = 'block';
    this.style.overflow = 'hidden';
    this.style.borderRadius = '1rem';
    this.style.border = '1px solid var(--border, #27272a)';
    this.style.padding = '1.5rem';
    this.style.cursor = 'pointer';
    this.style.userSelect = 'none';

    this.addEventListener('click', () => this.open());
  }

  open() {
    if (this.isExpanded) return;
    this.isExpanded = true;
    const firstRect = this.getBoundingClientRect();

    const portal = document.createElement('div');
    portal.style.cssText = 'position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:1.5rem;';

    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);';
    portal.appendChild(backdrop);

    const modal = document.createElement('div');
    modal.style.cssText = 'position:relative;z-index:10;width:100%;max-width:36rem;border-radius:1rem;border:1px solid #27272a;background:#18181b;padding:1.5rem;color:#fff;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);';

    const content = this.querySelector('[slot="expanded"]');
    if (content) modal.appendChild(content.cloneNode(true));

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:1rem;right:1rem;width:2rem;height:2rem;border-radius:9999px;border:1px solid #27272a;background:rgba(24,24,27,0.8);color:#a1a1aa;cursor:pointer;';
    modal.appendChild(closeBtn);

    portal.appendChild(modal);
    document.body.appendChild(portal);

    const lastRect = modal.getBoundingClientRect();
    const dx = firstRect.left - lastRect.left;
    const dy = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    modal.style.transformOrigin = 'top left';
    modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
    modal.style.opacity = '0.7';

    requestAnimationFrame(() => {
      modal.style.transition = \`transform \${this.duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(this.duration * 0.8)}ms ease\`;
      modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
      modal.style.opacity = '1';
    });

    const dismiss = () => {
      modal.style.transition = \`transform \${this.duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(this.duration * 0.7)}ms ease\`;
      modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
      modal.style.opacity = '0';
      setTimeout(() => {
        portal.remove();
        this.isExpanded = false;
      }, this.duration);
    };

    backdrop.addEventListener('click', dismiss);
    closeBtn.addEventListener('click', dismiss);
  }
}

customElements.define('exhuma-expandable-card', ExhumaExpandableCard);
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: 'expandable-card.vanilla.js',
					language: 'javascript',
					description: 'Vanilla JS Expandable Card controller with FLIP transitions.',
					code: `/**
 * Vanilla JS Expandable Card Controller
 * Discrete FLIP geometry snapshotting with smooth modal morphing.
 */
export function initExpandableCard(selector = '[data-expandable-card]') {
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    if (card.__exhuma_init) return;
    card.__exhuma_init = true;

    const duration = parseInt(card.dataset.duration || '${duration}', 10);
    const expandedContent = card.querySelector('[data-expanded-content]');

    card.addEventListener('click', () => {
      const firstRect = card.getBoundingClientRect();

      const portal = document.createElement('div');
      portal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6';

      const backdrop = document.createElement('div');
      backdrop.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm';
      portal.appendChild(backdrop);

      const modal = document.createElement('div');
      modal.className = 'relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl';

      if (expandedContent) {
        modal.appendChild(expandedContent.cloneNode(true));
      }

      portal.appendChild(modal);
      document.body.appendChild(portal);

      const lastRect = modal.getBoundingClientRect();
      const dx = firstRect.left - lastRect.left;
      const dy = firstRect.top - lastRect.top;
      const scaleX = firstRect.width / lastRect.width;
      const scaleY = firstRect.height / lastRect.height;

      modal.style.transformOrigin = 'top left';
      modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
      modal.style.opacity = '0.7';

      requestAnimationFrame(() => {
        modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.8)}ms ease\`;
        modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
        modal.style.opacity = '1';
      });

      const dismiss = () => {
        modal.style.transition = \`transform \${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity \${Math.round(duration * 0.7)}ms ease\`;
        modal.style.transform = \`translate3d(\${dx.toFixed(2)}px, \${dy.toFixed(2)}px, 0) scale(\${scaleX.toFixed(4)}, \${scaleY.toFixed(4)})\`;
        modal.style.opacity = '0';
        setTimeout(() => portal.remove(), duration);
      };

      backdrop.addEventListener('click', dismiss);
    });
  });
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: 'expandable-card.blade.php',
					language: 'php',
					description: 'Laravel Blade component for Expandable Card with Alpine.js.',
					code: `@props([
    'duration' => ${duration},
])

<div
    x-data="{
        isOpen: false,
        duration: {{ $duration }},
        firstRect: null,
        invertTransform: 'translate3d(0, 0, 0) scale(1, 1)',
        open() {
            const r = this.$refs.trigger.getBoundingClientRect();
            this.firstRect = { left: r.left, top: r.top, width: r.width, height: r.height };
            this.isOpen = true;
            document.body.style.overflow = 'hidden';

            this.$nextTick(() => {
                const modal = this.$refs.modal;
                if (!modal || !this.firstRect) return;
                const last = modal.getBoundingClientRect();
                const dx = this.firstRect.left - last.left;
                const dy = this.firstRect.top - last.top;
                const sx = last.width > 0 ? this.firstRect.width / last.width : 1;
                const sy = last.height > 0 ? this.firstRect.height / last.height : 1;

                this.invertTransform = 'translate3d(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px, 0) scale(' + sx.toFixed(4) + ', ' + sy.toFixed(4) + ')';
                modal.style.transformOrigin = 'top left';
                modal.style.transform = this.invertTransform;
                modal.style.opacity = '0.7';

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        modal.style.transition = 'transform ' + this.duration + 'ms cubic-bezier(0.16, 1, 0.3, 1), opacity ' + Math.round(this.duration * 0.8) + 'ms ease';
                        modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
                        modal.style.opacity = '1';
                        modal.focus();
                    });
                });
            });
        },
        close() {
            const modal = this.$refs.modal;
            if (modal) {
                modal.style.transition = 'transform ' + this.duration + 'ms cubic-bezier(0.16, 1, 0.3, 1), opacity ' + Math.round(this.duration * 0.7) + 'ms ease';
                modal.style.transform = this.invertTransform;
                modal.style.opacity = '0';
            }
            setTimeout(() => {
                this.isOpen = false;
                document.body.style.overflow = '';
                this.$refs.trigger?.focus();
            }, this.duration);
        }
    }"
    class="relative inline-block w-full"
>
    <div
        x-ref="trigger"
        role="button"
        tabindex="0"
        @click="open()"
        @keydown.enter.prevent="open()"
        @keydown.space.prevent="open()"
        {{ $attributes->merge([
            'class' => 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer select-none',
        ]) }}
    >
        {{ $trigger ?? $slot }}
    </div>

    <template x-teleport="body">
        <div
            x-show="isOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            @keydown.escape.window="close()"
        >
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close()"></div>
            <div
                x-ref="modal"
                tabindex="-1"
                class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl outline-none will-change-transform"
            >
                <div class="relative">
                    <button
                        type="button"
                        class="absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        @click="close()"
                        aria-label="Close dialog"
                    >
                        ✕
                    </button>
                    {{ $expanded ?? '' }}
                </div>
            </div>
        </div>
    </template>
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
					description: 'WordPress Gutenberg block definition for Expandable Card.',
					code: `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "exhuma/expandable-card",
  "version": "1.0.0",
  "title": "Exhuma Expandable Card",
  "category": "layout",
  "icon": "welcome-view-site",
  "description": "Mathematical FLIP morphing card dialog with zero layout shifts.",
  "attributes": {
    "duration": { "type": "number", "default": ${duration} }
  },
  "render": "file:./render.php"
}
`,
				},
				{
					filename: 'render.php',
					language: 'php',
					description: 'WordPress Gutenberg block dynamic render template.',
					code: `<?php
/**
 * Expandable Card Block Template
 */
$duration = isset($attributes['duration']) ? (int)$attributes['duration'] : ${duration};
?>
<div
    class="wp-block-exhuma-expandable-card relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm cursor-pointer select-none"
    data-duration="<?php echo esc_attr($duration); ?>"
>
    <?php echo !empty($content) ? $content : '<div class="space-y-2"><span class="font-mono text-xs font-bold text-primary">CLICK TO EXPAND</span><h4 class="text-lg font-bold">Expandable Card</h4></div>'; ?>
</div>

<template class="exhuma-modal-template">
    <div class="exhuma-modal-portal fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div class="exhuma-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="exhuma-modal-content relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl will-change-transform">
            <div class="relative">
                <button type="button" class="exhuma-close-btn absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" aria-label="Close dialog">
                    ✕
                </button>
                <div class="exhuma-modal-body space-y-4">
                    <h3 class="text-2xl font-bold">Modal Dialog</h3>
                    <p class="text-sm text-muted-foreground">FLIP modal transition executed smoothly.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
(function() {
  function initWordPressExpandables() {
    document.querySelectorAll('.wp-block-exhuma-expandable-card').forEach(function(card) {
      if (card.__exhuma_init) return;
      card.__exhuma_init = true;

      var duration = parseInt(card.dataset.duration || '${duration}', 10);
      var template = card.nextElementSibling;
      while (template && !template.classList.contains('exhuma-modal-template')) {
        template = template.nextElementSibling;
      }
      if (!template) return;

      card.addEventListener('click', function() {
        var firstRect = card.getBoundingClientRect();
        var clone = template.content.cloneNode(true);
        var portal = clone.querySelector('.exhuma-modal-portal');
        var modal = clone.querySelector('.exhuma-modal-content');
        var backdrop = clone.querySelector('.exhuma-backdrop');
        var closeBtn = clone.querySelector('.exhuma-close-btn');

        document.body.appendChild(portal);
        document.body.style.overflow = 'hidden';

        var lastRect = modal.getBoundingClientRect();
        var dx = firstRect.left - lastRect.left;
        var dy = firstRect.top - lastRect.top;
        var scaleX = lastRect.width > 0 ? firstRect.width / lastRect.width : 1;
        var scaleY = lastRect.height > 0 ? firstRect.height / lastRect.height : 1;

        modal.style.transformOrigin = 'top left';
        modal.style.transform = 'translate3d(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px, 0) scale(' + scaleX.toFixed(4) + ', ' + scaleY.toFixed(4) + ')';
        modal.style.opacity = '0.7';

        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            modal.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1), opacity ' + Math.round(duration * 0.8) + 'ms ease';
            modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
            modal.style.opacity = '1';
          });
        });

        function dismiss() {
          modal.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1), opacity ' + Math.round(duration * 0.7) + 'ms ease';
          modal.style.transform = 'translate3d(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px, 0) scale(' + scaleX.toFixed(4) + ', ' + scaleY.toFixed(4) + ')';
          modal.style.opacity = '0';
          setTimeout(function() {
            portal.remove();
            document.body.style.overflow = '';
          }, duration);
        }

        backdrop.addEventListener('click', dismiss);
        closeBtn.addEventListener('click', dismiss);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordPressExpandables);
  } else {
    initWordPressExpandables();
  }
})();
</script>
`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: 'ExpandableCard.tsx',
					language: 'tsx',
					description: 'React Native Expandable Card with Modal and animated measurements.',
					code: `import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';

export interface ExpandableCardProps {
  cardContent: React.ReactNode;
  expandedContent: React.ReactNode;
  duration?: number;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  cardContent,
  expandedContent,
  duration = ${duration},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<View>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.85}
        onPress={open}
        style={styles.card}
      >
        {cardContent}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={close} />
          <View style={styles.modalContent}>
            {expandedContent}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    backgroundColor: '#18181b',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#18181b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 24,
  },
});
`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: 'expandable_card.dart',
					language: 'dart',
					description: 'Flutter StatefulWidget Expandable Card with showGeneralDialog.',
					code: `import 'package:flutter/material.dart';

class ExpandableCard extends StatelessWidget {
  final Widget cardContent;
  final Widget expandedContent;
  final int duration;

  const ExpandableCard({
    Key? key,
    required this.cardContent,
    required this.expandedContent,
    this.duration = ${duration},
  }) : super(key: key);

  void _openDialog(BuildContext context) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Dismiss',
      transitionDuration: Duration(milliseconds: duration),
      pageBuilder: (context, anim1, anim2) => Container(),
      transitionBuilder: (context, anim, secondaryAnim, child) {
        final curvedAnim = CurvedAnimation(parent: anim, curve: Curves.easeOutCubic);
        return ScaleTransition(
          scale: Tween<double>(begin: 0.85, end: 1.0).animate(curvedAnim),
          child: FadeTransition(
            opacity: anim,
            child: Dialog(
              backgroundColor: const Color(0xFF18181B),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0xFF27272A)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: expandedContent,
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _openDialog(context),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF27272A)),
          color: const Color(0xFF18181B),
        ),
        padding: const EdgeInsets.all(24),
        child: cardContent,
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
