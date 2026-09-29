import React, { useRef, useEffect, useState, useCallback } from 'react';
import { estimateScratchRatio, scaledBrushRadius, isScratchComplete } from './scratch-math';

export interface ScratchCardProps {
  width: number;
  height: number;
  coverColor?: string;
  brushSize?: number;
  threshold?: number;
  onComplete?: () => void;
  revealContent: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScratchCard = React.forwardRef<HTMLDivElement, ScratchCardProps>(
  (
    {
      width,
      height,
      coverColor = '#c0c0c0',
      brushSize = 20,
      threshold = 0.65,
      onComplete,
      revealContent,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isComplete, setIsComplete] = useState(false);
    const isDrawing = useRef(false);
    const eventsCount = useRef(0);
    const isReducedMotion = useRef(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mediaQuery.matches;
      if (mediaQuery.matches) {
        setIsComplete(true);
        onComplete?.();
      }
      const handler = (e: MediaQueryListEvent) => {
        isReducedMotion.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, [onComplete]);

    useEffect(() => {
      if (isComplete || isReducedMotion.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, width, height);
    }, [width, height, coverColor, isComplete]);

    const triggerComplete = useCallback(() => {
      if (isComplete) return;
      setIsComplete(true);
      onComplete?.();
    }, [isComplete, onComplete]);

    const scratch = useCallback(
      (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        const dpr = window.devicePixelRatio || 1;
        ctx.arc(x, y, scaledBrushRadius(brushSize, 1), 0, Math.PI * 2);
        ctx.fill();

        eventsCount.current++;
        if (eventsCount.current % 10 === 0) {
          const ratio = estimateScratchRatio(ctx, canvas.width, canvas.height);
          if (isScratchComplete(ratio, threshold)) {
            triggerComplete();
          }
        }
      },
      [brushSize, threshold, triggerComplete]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isComplete || isReducedMotion.current) return;
      isDrawing.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      scratch(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || isComplete || isReducedMotion.current) return;
      scratch(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawing.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerComplete();
      }
    };

    return (
      <div
        ref={ref || containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{ width, height, ...style }}
        {...props}
      >
        <div className="absolute inset-0 z-0">
          {revealContent}
        </div>
        
        {!isComplete && (
          <button
            className="absolute inset-0 z-10 w-full h-full cursor-crosshair opacity-0 focus:opacity-100 focus:ring-2 focus:ring-blue-500 rounded-[inherit]"
            aria-label="Scratch to reveal"
            onKeyDown={handleKeyDown}
          />
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-20 cursor-crosshair touch-none transition-opacity duration-500 rounded-[inherit]"
          style={{ opacity: isComplete ? 0 : 1, width, height, pointerEvents: isComplete ? 'none' : 'auto' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-hidden="true"
        />
      </div>
    );
  }
);
ScratchCard.displayName = 'ScratchCard';
