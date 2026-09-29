import * as React from 'react';
import {
	applyRubberBand,
	projectFinalPosition,
	findNearestSnapPoint,
	calculateBackdropOpacity,
} from './drawer-math';

export type DrawerSnapPoint = number;

export interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	snapPoints?: DrawerSnapPoint[];
	dismissThreshold?: number;
	backdropOpacity?: number;
	backdropBlur?: boolean;
	className?: string;
	overlayClassName?: string;
}

type DrawerState = 'CLOSED' | 'OPEN' | 'DRAGGING' | 'SNAPPING' | 'DISMISSED';

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
	(
		{
			isOpen,
			onClose,
			children,
			snapPoints = [1],
			dismissThreshold = 400,
			backdropOpacity = 0.5,
			backdropBlur = false,
			className = '',
			overlayClassName = '',
		},
		ref
	) => {
		const sheetRef = React.useRef<HTMLDivElement>(null);
		const backdropRef = React.useRef<HTMLDivElement>(null);
		const containerRef = React.useRef<HTMLDivElement>(null);
		const [isMounted, setIsMounted] = React.useState(isOpen);

		const dragStartY = React.useRef(0);
		const dragStartX = React.useRef(0);
		const lastDragY = React.useRef(0);
		const lastDragTime = React.useRef(0);
		const velocity = React.useRef(0);
		const currentY = React.useRef(0);
		const activeSnapPoint = React.useRef(snapPoints[snapPoints.length - 1] || 1);
		const fsmState = React.useRef<DrawerState>(isOpen ? 'OPEN' : 'CLOSED');

		React.useEffect(() => {
			if (isOpen && !isMounted) setIsMounted(true);
		}, [isOpen, isMounted]);

		React.useEffect(() => {
			const sheet = sheetRef.current;
			const backdrop = backdropRef.current;
			if (!sheet || !backdrop) return;

			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const duration = prefersReducedMotion ? '0ms' : '400ms';
			const ease = 'cubic-bezier(0.32, 0.72, 0, 1)';

			if (isOpen && fsmState.current !== 'DRAGGING') {
				fsmState.current = 'OPEN';
				sheet.style.transition = `transform ${duration} ${ease}`;
				backdrop.style.transition = `opacity ${duration} ${ease}`;

				const h = sheet.getBoundingClientRect().height;
				const targetY = h * (1 - activeSnapPoint.current);
				currentY.current = targetY;

				sheet.style.transform = `translateY(${targetY}px)`;
				backdrop.style.opacity = `${backdropOpacity}`;
				backdrop.style.pointerEvents = 'auto';

				document.body.style.overflow = 'hidden';
			} else if (!isOpen && fsmState.current !== 'DRAGGING') {
				fsmState.current = 'CLOSED';
				sheet.style.transition = `transform ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;
				backdrop.style.transition = `opacity ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;

				sheet.style.transform = 'translateY(100%)';
				backdrop.style.opacity = '0';
				backdrop.style.pointerEvents = 'none';

				document.body.style.overflow = '';

				const timer = setTimeout(() => {
					setIsMounted(false);
				}, prefersReducedMotion ? 0 : 400);
				return () => clearTimeout(timer);
			}
		}, [isOpen, backdropOpacity, activeSnapPoint]);

		React.useEffect(() => {
			if (!isOpen) return;
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') onClose();
			};
			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		}, [isOpen, onClose]);

		const handlePointerDown = (e: React.PointerEvent) => {
			if (!isOpen) return;
			e.currentTarget.setPointerCapture(e.pointerId);
			dragStartY.current = e.clientY;
			dragStartX.current = e.clientX;
			lastDragY.current = e.clientY;
			lastDragTime.current = performance.now();
			fsmState.current = 'DRAGGING';

			if (sheetRef.current) {
				sheetRef.current.style.transition = 'none';
			}
			if (backdropRef.current) {
				backdropRef.current.style.transition = 'none';
			}
		};

		const handlePointerMove = (e: React.PointerEvent) => {
			if (fsmState.current !== 'DRAGGING') return;
			const sheet = sheetRef.current;
			if (!sheet) return;

			const dy = e.clientY - dragStartY.current;
			const dx = e.clientX - dragStartX.current;

			if (Math.abs(dy) < 8 && Math.abs(dx) > Math.abs(dy)) return;

			const now = performance.now();
			const dt = now - lastDragTime.current;
			if (dt > 0) {
				velocity.current = ((e.clientY - lastDragY.current) / dt) * 1000;
			}
			lastDragY.current = e.clientY;
			lastDragTime.current = now;

			const h = sheet.getBoundingClientRect().height;
			const baseTop = h * (1 - activeSnapPoint.current);
			let newY = baseTop + dy;

			if (newY < 0) {
				newY = applyRubberBand(newY, 0, 15);
			}

			currentY.current = newY;
			sheet.style.transform = `translateY(${newY}px)`;

			if (backdropRef.current) {
				const openness = 1 - (newY / h);
				backdropRef.current.style.opacity = `${calculateBackdropOpacity(openness, backdropOpacity)}`;
			}
		};

		const handlePointerUp = (e: React.PointerEvent) => {
			if (fsmState.current !== 'DRAGGING') return;
			fsmState.current = 'SNAPPING';
			const sheet = sheetRef.current;
			if (!sheet) return;

			const h = sheet.getBoundingClientRect().height;
			const projectedY = projectFinalPosition(currentY.current, velocity.current, 10);

			if (velocity.current > dismissThreshold || projectedY > h * 0.7) {
				fsmState.current = 'DISMISSED';
				onClose();
				return;
			}

			const nearestPoint = findNearestSnapPoint(projectedY, snapPoints, h);
			activeSnapPoint.current = nearestPoint;

			const targetY = h * (1 - nearestPoint);
			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const duration = prefersReducedMotion ? '0ms' : '400ms';

			sheet.style.transition = `transform ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;
			sheet.style.transform = `translateY(${targetY}px)`;
			currentY.current = targetY;

			if (backdropRef.current) {
				backdropRef.current.style.transition = `opacity ${duration} cubic-bezier(0.32, 0.72, 0, 1)`;
				backdropRef.current.style.opacity = `${calculateBackdropOpacity(nearestPoint, backdropOpacity)}`;
			}

			setTimeout(() => {
				if (fsmState.current === 'SNAPPING') fsmState.current = 'OPEN';
			}, prefersReducedMotion ? 0 : 400);
		};

		React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

		if (!isMounted) return null;

		return (
			<div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none">
				<div
					ref={backdropRef}
					aria-hidden="true"
					onClick={onClose}
					className={`absolute inset-0 bg-black pointer-events-auto ${backdropBlur ? 'backdrop-blur-sm' : ''} ${overlayClassName}`}
					style={{ opacity: 0 }}
				/>
				<div
					ref={sheetRef}
					role="dialog"
					aria-modal="true"
					className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl pointer-events-auto flex flex-col ${className}`}
					style={{ transform: 'translateY(100%)', touchAction: 'none', willChange: 'transform' }}
				>
					<div
						className="w-full flex justify-center p-4 cursor-grab active:cursor-grabbing"
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerCancel={handlePointerUp}
					>
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="overflow-y-auto px-4 pb-8 flex-1">
						{children}
					</div>
				</div>
			</div>
		);
	}
);

Drawer.displayName = 'Drawer';
