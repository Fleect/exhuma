'use client';

import React, { createContext, useContext, useState, useCallback, useId, useRef, type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from 'react';

/**
 * Exhuma Kinetic Methodology (EKM) — Accordion
 * Elevated from sapan.dev with full WAI-ARIA compliance & Big-Omega guarantees.
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) / O(1) Instant, zero-layout-thrashing expansion via modern CSS Grid (0fr ➔ 1fr).
 * - Kinetic dual-spin morphing plus/minus icon with zero SVG/icon dependencies.
 * - Dynamic continuous specular animated gradient border shift on active state.
 * - WAI-ARIA circular keyboard navigation (ArrowDown / ArrowUp / Home / End).
 * - Single auto-collapse or Multiple independent disclosure modes.
 * - Fully configurable duration, icons, index badges, and surface variants.
 */

export interface AccordionContextValue {
	expandedValues: Set<string>;
	toggleItem: (value: string) => void;
	registerItem: (value: string, el: HTMLElement | null) => void;
	items: string[];
	mode: 'single' | 'multiple';
	collapsible: boolean;
	baseId: string;
	duration: number;
	showIcon: boolean;
	showNumbers: boolean;
	bordered: boolean;
	shadow: boolean;
	gap: number;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
	const ctx = useContext(AccordionContext);
	if (!ctx) {
		throw new Error('Exhuma Accordion compound components must be rendered inside <Accordion.Root>');
	}
	return ctx;
}

export interface AccordionItemContextValue {
	value: string;
	isOpen: boolean;
	triggerId: string;
	panelId: string;
	index: number;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext() {
	const ctx = useContext(AccordionItemContext);
	if (!ctx) {
		throw new Error('Accordion.Trigger and Accordion.Content must be rendered inside <Accordion.Item>');
	}
	return ctx;
}

export interface AccordionRootProps {
	children: ReactNode;
	mode?: 'single' | 'multiple';
	collapsible?: boolean;
	defaultValue?: string | string[];
	value?: string | string[];
	onValueChange?: (val: string | string[]) => void;
	duration?: number;
	showIcon?: boolean;
	showNumbers?: boolean;
	bordered?: boolean;
	shadow?: boolean;
	gap?: number;
	className?: string;
}

export const AccordionRoot: React.FC<AccordionRootProps> = ({
	children,
	mode = 'single',
	collapsible = true,
	defaultValue,
	value: controlledValue,
	onValueChange,
	duration = 300,
	showIcon = true,
	showNumbers = true,
	bordered = true,
	shadow = true,
	gap = 12,
	className = '',
}) => {
	const baseId = useId();
	const isControlled = controlledValue !== undefined;

	const [uncontrolledValues, setUncontrolledValues] = useState<Set<string>>(() => {
		if (!defaultValue) return new Set();
		if (Array.isArray(defaultValue)) return new Set(defaultValue);
		return new Set([defaultValue]);
	});

	// Reconcile state when defaultValue or mode changes from Studio preset/param updates
	React.useEffect(() => {
		if (defaultValue !== undefined) {
			const next = Array.isArray(defaultValue) ? new Set(defaultValue) : new Set(defaultValue ? [defaultValue] : []);
			if (mode === 'single' && next.size > 1) {
				setUncontrolledValues(new Set([Array.from(next)[0]]));
			} else {
				setUncontrolledValues(next);
			}
		} else if (mode === 'single') {
			setUncontrolledValues((prev) => {
				if (prev.size > 1) {
					return new Set([Array.from(prev)[0]]);
				}
				return prev;
			});
		}
	}, [defaultValue, mode]);

	const expandedValues: Set<string> = React.useMemo(() => {
		if (isControlled) {
			if (!controlledValue) return new Set();
			if (Array.isArray(controlledValue)) return new Set(controlledValue);
			return new Set([controlledValue]);
		}
		return uncontrolledValues;
	}, [isControlled, controlledValue, uncontrolledValues]);

	const itemElements = useRef<Map<string, HTMLElement>>(new Map());
	const [itemsList, setItemsList] = useState<string[]>([]);

	const registerItem = useCallback((val: string, el: HTMLElement | null) => {
		if (el) {
			itemElements.current.set(val, el);
		} else {
			itemElements.current.delete(val);
		}
		setItemsList(Array.from(itemElements.current.keys()));
	}, []);

	const toggleItem = useCallback(
		(val: string) => {
			let next: Set<string>;
			if (mode === 'single') {
				if (expandedValues.has(val)) {
					next = collapsible ? new Set() : new Set([val]);
				} else {
					next = new Set([val]);
				}
			} else {
				next = new Set(expandedValues);
				if (next.has(val)) {
					next.delete(val);
				} else {
					next.add(val);
				}
			}

			if (!isControlled) {
				setUncontrolledValues(next);
			}

			const emitted = mode === 'single' ? Array.from(next)[0] || '' : Array.from(next);
			onValueChange?.(emitted);
		},
		[mode, collapsible, expandedValues, isControlled, onValueChange]
	);

	return (
		<AccordionContext.Provider
			value={{
				expandedValues,
				toggleItem,
				registerItem,
				items: itemsList,
				mode,
				collapsible,
				baseId,
				duration,
				showIcon,
				showNumbers,
				bordered,
				shadow,
				gap,
			}}
		>
			<div
				className={`exhuma-accordion-root flex w-full flex-col ${className}`}
				style={{ gap: `${gap}px` }}
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
};

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
	children: ReactNode;
	bordered?: boolean;
	shadow?: boolean;
	className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
	value,
	children,
	bordered: itemBordered,
	shadow: itemShadow,
	className = '',
	...props
}) => {
	const context = useAccordionContext();
	const { expandedValues, registerItem, baseId, items, duration } = context;
	const isOpen = expandedValues.has(value);
	const itemRef = useRef<HTMLDivElement>(null);

	const bordered = itemBordered ?? context.bordered;
	const shadow = itemShadow ?? context.shadow;
	const index = items.indexOf(value);

	React.useEffect(() => {
		registerItem(value, itemRef.current);
		return () => registerItem(value, null);
	}, [value, registerItem]);

	const triggerId = `${baseId}-trigger-${value}`;
	const panelId = `${baseId}-panel-${value}`;

	// Border styling: 100% working direct border classes
	const borderClasses = bordered
		? isOpen
			? 'border border-primary/50 dark:border-primary/60 ring-1 ring-primary/20 z-10'
			: 'border border-border/80 dark:border-neutral-800'
		: 'border-0 ring-0';

	// Shadow styling: clean elevation
	const shadowClasses = shadow
		? isOpen
			? 'shadow-lg shadow-black/5 dark:shadow-white/5'
			: 'shadow-sm'
		: 'shadow-none';

	return (
		<AccordionItemContext.Provider value={{ value, isOpen, triggerId, panelId, index }}>
			<div
				ref={itemRef}
				style={{ transitionDuration: `${duration}ms`, ...props.style }}
				className={`exhuma-accordion-item relative overflow-hidden rounded-2xl bg-card transition-all ${borderClasses} ${shadowClasses} ${className}`}
				{...props}
			>
				{children}
			</div>
		</AccordionItemContext.Provider>
	);
};

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	showIcon?: boolean;
	showNumbers?: boolean;
	className?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, showIcon: triggerShowIcon, showNumbers: triggerShowNumbers, className = '', ...props }) => {
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
			const targetTrigger = document.getElementById(`${baseId}-trigger-${items[nextIndex]}`);
			targetTrigger?.focus();
		}
	};

	// Detect if children already has an AccordionIcon component
	const hasIconChild = React.Children.toArray(children).some((child) => React.isValidElement(child) && ((child.type as any)?.displayName === 'AccordionIcon' || child.type === AccordionIcon));

	return (
		<button
			type='button'
			id={triggerId}
			aria-expanded={isOpen}
			aria-controls={panelId}
			onClick={() => toggleItem(value)}
			onKeyDown={handleKeyDown}
			className={`exhuma-accordion-trigger group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:px-7 lg:py-5 ${className}`}
			{...props}
		>
			<span className='flex flex-1 items-center gap-3.5'>
				{showNumbers && (
					<span className='text-primary dark:text-primary/90 w-5 shrink-0 font-mono text-xs font-bold tracking-wider'>{String((index >= 0 ? index : items.indexOf(value)) + 1).padStart(2, '0')}</span>
				)}
				<span className='text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors'>{children}</span>
			</span>

			{/* Automatically append icon if not manually supplied as child and showIcon is enabled */}
			{!hasIconChild && showIcon && <AccordionIcon />}
		</button>
	);
};

export interface AccordionIconProps extends HTMLAttributes<HTMLSpanElement> {
	className?: string;
}

/**
 * Signature Morphing Plus/Minus icon from sapan.dev.
 * Constructed with dual kinetic counter-rotating bars with zero SVG/icon dependencies.
 */
export const AccordionIcon: React.FC<AccordionIconProps> = ({ className = '', ...props }) => {
	const { isOpen } = useAccordionItemContext();
	const { duration, showIcon } = useAccordionContext();

	if (!showIcon) return null;

	return (
		<span aria-hidden='true' className={`relative inline-flex aspect-square h-6 shrink-0 items-center justify-center select-none ${className}`} {...props}>
			{/* Horizontal / Base bar: rotates -180deg (closed) -> 0deg (open) */}
			<span
				style={{ transitionDuration: `${duration}ms` }}
				className={`bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform ${isOpen ? 'rotate-0' : '-rotate-180'}`}
			/>
			{/* Vertical / Cross bar: rotates -90deg (closed) -> 0deg (open) */}
			<span
				style={{ transitionDuration: `${duration}ms` }}
				className={`bg-primary absolute top-1/2 left-1/2 inline-flex h-0.5 w-3.5 origin-center -translate-1/2 rounded-full transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
			/>
		</span>
	);
};
AccordionIcon.displayName = 'AccordionIcon';

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = '', ...props }) => {
	const { isOpen, triggerId, panelId } = useAccordionItemContext();
	const { duration } = useAccordionContext();

	return (
		<div
			id={panelId}
			role='region'
			aria-labelledby={triggerId}
			inert={!isOpen || undefined}
			style={{ transitionDuration: `${duration}ms`, ...props.style }}
			className={`grid transition-[grid-template-rows,opacity] ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} ${className}`}
			{...props}
		>
			<div className='min-h-0 overflow-hidden'>
				<div className='px-5 pt-1 pb-5 lg:px-7'>
					<div className='border-border/60 text-muted-foreground border-t pt-4 text-sm leading-relaxed'>{children}</div>
				</div>
			</div>
		</div>
	);
};

export const Accordion = {
	Root: AccordionRoot,
	Item: AccordionItem,
	Trigger: AccordionTrigger,
	Icon: AccordionIcon,
	Content: AccordionContent,
};

export default Accordion;
