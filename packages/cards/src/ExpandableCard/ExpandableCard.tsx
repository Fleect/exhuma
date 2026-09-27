'use client';

import React, { useRef, useState, useCallback, useEffect, useLayoutEffect, createContext, useContext, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { calculateFLIPDelta, generateInvertTransform, type DOMRectSnapshot } from './flip-math';

interface ExpandableContextValue {
	isExpanded: boolean;
	isClosing: boolean;
	duration: number;
	open: () => void;
	close: () => void;
	triggerRef: React.RefObject<HTMLDivElement | null>;
	firstRectRef: React.MutableRefObject<DOMRectSnapshot | null>;
	portalContainer?: HTMLElement | null;
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

export interface ExpandableCardProps {
	children?: ReactNode;
	cardContent?: ReactNode;
	expandedContent?: ReactNode;
	duration?: number;
	className?: string;
	expandedClassName?: string;
	onOpenChange?: (open: boolean) => void;
	portalContainer?: HTMLElement | null;
}

/**
 * ExpandableCard — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Mathematical bidirectional FLIP morphing algorithm (ZERO Framer Motion).
 * - Single layout snapshot: zero layout thrashing during transition.
 * - Hardware-accelerated GPU translate3d and scale morphing with reverse collapse.
 * - Accessible modal dialog with Escape dismissal, focus management, and WAI-ARIA semantics.
 */
export const ExpandableCard: React.FC<ExpandableCardProps> & {
	Root: typeof ExpandableRoot;
	Trigger: typeof ExpandableTrigger;
	Content: typeof ExpandableContent;
	Close: typeof ExpandableClose;
} = ({ children, cardContent, expandedContent, duration = 360, className = '', expandedClassName = '', onOpenChange, portalContainer }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const firstRectRef = useRef<DOMRectSnapshot | null>(null);
	const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

	const open = useCallback(() => {
		if (closeTimerRef.current) {
			clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			firstRectRef.current = {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
			};
		}
		setIsClosing(false);
		setIsExpanded(true);
		onOpenChange?.(true);
	}, [onOpenChange]);

	const close = useCallback(() => {
		if (isClosing) return;
		setIsClosing(true);
		// Allow exit animation to run for `duration` ms before unmounting
		closeTimerRef.current = setTimeout(() => {
			setIsExpanded(false);
			setIsClosing(false);
			onOpenChange?.(false);
			closeTimerRef.current = null;
			// Return focus to trigger element for accessibility
			triggerRef.current?.focus();
		}, duration);
	}, [duration, isClosing, onOpenChange]);

	useEffect(() => {
		return () => {
			if (closeTimerRef.current) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	// If using shorthand props
	if (cardContent && expandedContent) {
		return (
			<ExpandableRoot isExpanded={isExpanded} isClosing={isClosing} duration={duration} open={open} close={close} triggerRef={triggerRef} firstRectRef={firstRectRef} portalContainer={portalContainer}>
				<ExpandableTrigger className={className}>{cardContent}</ExpandableTrigger>
				<ExpandableContent className={expandedClassName}>
					<div className='relative'>
						<ExpandableClose className='absolute top-4 right-4 z-10' />
						{expandedContent}
					</div>
				</ExpandableContent>
			</ExpandableRoot>
		);
	}

	return (
		<ExpandableRoot isExpanded={isExpanded} isClosing={isClosing} duration={duration} open={open} close={close} triggerRef={triggerRef} firstRectRef={firstRectRef} portalContainer={portalContainer}>
			{children}
		</ExpandableRoot>
	);
};

export function ExpandableRoot({
	children,
	isExpanded,
	isClosing,
	duration,
	open,
	close,
	triggerRef,
	firstRectRef,
	portalContainer,
}: {
	children: ReactNode;
	isExpanded: boolean;
	isClosing: boolean;
	duration: number;
	open: () => void;
	close: () => void;
	triggerRef: React.RefObject<HTMLDivElement | null>;
	firstRectRef: React.MutableRefObject<DOMRectSnapshot | null>;
	portalContainer?: HTMLElement | null;
}) {
	return <ExpandableContext.Provider value={{ isExpanded, isClosing, duration, open, close, triggerRef, firstRectRef, portalContainer }}>{children}</ExpandableContext.Provider>;
}

export const ExpandableTrigger = memo<React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', onClick, ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableTrigger must be used within ExpandableCard');

	return (
		<div
			ref={ctx.triggerRef}
			role='button'
			tabIndex={0}
			aria-haspopup='dialog'
			aria-expanded={ctx.isExpanded}
			onClick={(e) => {
				ctx.open();
				onClick?.(e);
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					ctx.open();
				}
			}}
			className={`focus-visible:ring-primary cursor-pointer select-none focus:outline-none focus-visible:ring-2 ${className}`}
			{...props}
		>
			{children}
		</div>
	);
});
ExpandableTrigger.displayName = 'ExpandableTrigger';

export const ExpandableContent = memo<React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableContent must be used within ExpandableCard');

	const modalRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	const invertTransformRef = useRef<string>('translate3d(0, 0, 0) scale(1, 1)');

	useEffect(() => {
		setMounted(true);
	}, []);

	// Keyboard Escape handler
	const { isExpanded, isClosing, duration, close } = ctx;
	useEffect(() => {
		if (!isExpanded) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isExpanded, close]);

	// Lock body scroll with scrollbar compensation to eliminate layout jumps
	useLayoutEffect(() => {
		if (!isExpanded) return;

		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

		if (scrollbarWidth > 0) {
			const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
			document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
		}
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		};
	}, [isExpanded]);

	// FLIP animation execution on open
	useLayoutEffect(() => {
		if (!ctx.isExpanded || isClosing || !modalRef.current || !ctx.firstRectRef.current) return;

		const modal = modalRef.current;
		const backdrop = backdropRef.current;
		const lastRect = modal.getBoundingClientRect();

		// Re-measure trigger dynamically after scroll lock to ensure 100% geometry coherence
		const currentTrigger = ctx.triggerRef.current?.getBoundingClientRect();
		const firstRect = currentTrigger && currentTrigger.width > 0 ? {
			left: currentTrigger.left,
			top: currentTrigger.top,
			width: currentTrigger.width,
			height: currentTrigger.height,
		} : ctx.firstRectRef.current;

		const delta = calculateFLIPDelta(firstRect, lastRect);
		const invertTransform = generateInvertTransform(delta);
		invertTransformRef.current = invertTransform;

		// INVERT: apply instantaneous transform before paint
		modal.style.transformOrigin = 'top left';
		modal.style.transform = invertTransform;
		modal.style.opacity = '0.7';
		modal.style.transition = 'none';

		if (backdrop) {
			backdrop.style.opacity = '0';
			backdrop.style.transition = 'none';
		}

		// PLAY: animate to final centered state
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				modal.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(duration * 0.8)}ms ease`;
				modal.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
				modal.style.opacity = '1';
				modal.focus();

				if (backdrop) {
					backdrop.style.transition = `opacity ${duration}ms ease`;
					backdrop.style.opacity = '1';
				}
			});
		});
	}, [ctx.isExpanded, isClosing, duration, ctx.firstRectRef, ctx.triggerRef]);

	// Reverse FLIP animation on close
	useEffect(() => {
		if (!isClosing || !modalRef.current) return;

		const modal = modalRef.current;
		const backdrop = backdropRef.current;

		modal.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(duration * 0.7)}ms ease`;
		modal.style.transform = invertTransformRef.current;
		modal.style.opacity = '0';

		if (backdrop) {
			backdrop.style.transition = `opacity ${duration}ms ease`;
			backdrop.style.opacity = '0';
		}
	}, [isClosing, duration]);

	if (!mounted || !ctx.isExpanded) return null;

	return createPortal(
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6' role='dialog' aria-modal='true'>
			{/* Backdrop */}
			<div ref={backdropRef} className='fixed inset-0 bg-black/60 backdrop-blur-sm' onClick={ctx.close} />

			{/* Modal Container */}
			<div
				ref={modalRef}
				tabIndex={-1}
				className={`border-border bg-card relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border p-6 shadow-2xl outline-none will-change-transform ${className}`}
				{...props}
			>
				{children}
			</div>
		</div>,
		ctx.portalContainer || document.body
	);
});
ExpandableContent.displayName = 'ExpandableContent';

export const ExpandableClose = memo<React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className = '', onClick, children, ...props }) => {
	const ctx = useContext(ExpandableContext);
	if (!ctx) throw new Error('ExpandableClose must be used within ExpandableCard');

	return (
		<button
			type='button'
			aria-label='Close dialog'
			onClick={(e) => {
				ctx.close();
				onClick?.(e);
			}}
			className={`border-border bg-card/80 text-muted-foreground hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors ${className}`}
			{...props}
		>
			{children || (
				<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
					<path d='M18 6 6 18' />
					<path d='m6 6 12 12' />
				</svg>
			)}
		</button>
	);
});
ExpandableClose.displayName = 'ExpandableClose';

ExpandableCard.Root = ExpandableRoot;
ExpandableCard.Trigger = ExpandableTrigger;
ExpandableCard.Content = ExpandableContent;
ExpandableCard.Close = ExpandableClose;
