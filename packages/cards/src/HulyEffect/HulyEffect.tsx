import React, { useRef, useEffect, useCallback } from 'react';
import { exponentialSmooth, toRelativePercent, buildHulyGradient } from './huly-math';

export interface HulyEffectProps {
  children?: React.ReactNode;
  glowColor?: string;
  ambientRadius?: number;
  intensity?: number;
  smoothing?: number;
  borderGlow?: boolean;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const HulyEffect = React.forwardRef<HTMLDivElement, HulyEffectProps>(
  (
    {
      children,
      glowColor = '#6366f1',
      ambientRadius = 40,
      intensity = 0.8,
      smoothing = 0.12,
      borderGlow = true,
      borderColor,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (ref as React.MutableRefObject<HTMLDivElement>) || internalRef;
    
    const rafIdRef = useRef<number | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    
    const targetX = useRef(50);
    const targetY = useRef(50);
    const currentX = useRef(50);
    const currentY = useRef(50);
    
    const isHovered = useRef(false);
    const isReducedMotion = useRef(false);
    
    const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

    const measureRect = useCallback(() => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      }
    }, [containerRef]);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mediaQuery.matches;
      const handler = (e: MediaQueryListEvent) => {
        isReducedMotion.current = e.matches;
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      resizeObserverRef.current = new ResizeObserver(() => {
        measureRect();
      });
      resizeObserverRef.current.observe(el);

      const handleScroll = () => {
        if (isHovered.current) measureRect();
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        resizeObserverRef.current?.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    }, [containerRef, measureRect]);

    const updateFrame = useCallback(() => {
      const el = containerRef.current;
      if (!el) return;

      if (isReducedMotion.current) {
        el.style.setProperty('--huly-x', '50%');
        el.style.setProperty('--huly-y', '50%');
        rafIdRef.current = null;
        return;
      }

      currentX.current = exponentialSmooth(currentX.current, targetX.current, smoothing);
      currentY.current = exponentialSmooth(currentY.current, targetY.current, smoothing);

      el.style.setProperty('--huly-x', `${currentX.current.toFixed(2)}%`);
      el.style.setProperty('--huly-y', `${currentY.current.toFixed(2)}%`);

      const diffX = Math.abs(targetX.current - currentX.current);
      const diffY = Math.abs(targetY.current - currentY.current);

      if (diffX > 0.05 || diffY > 0.05 || isHovered.current) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      } else {
        rafIdRef.current = null;
      }
    }, [smoothing, containerRef]);

    const scheduleUpdate = useCallback(() => {
      if (rafIdRef.current === null && !isReducedMotion.current) {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }
    }, [updateFrame]);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      isHovered.current = true;
      const { left, top, width, height } = rectRef.current;
      targetX.current = toRelativePercent(e.clientX, left, width);
      targetY.current = toRelativePercent(e.clientY, top, height);
      scheduleUpdate();
    };

    const handlePointerLeave = () => {
      isHovered.current = false;
      targetX.current = 50;
      targetY.current = 50;
      scheduleUpdate();
    };
    
    const hulyGradient = buildHulyGradient(50, 50, glowColor, ambientRadius, intensity);
    const borderGlowColor = borderColor || glowColor;
    
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          ['--huly-gradient' as any]: hulyGradient,
          ['--huly-shadow' as any]: borderGlow ? `0 0 20px 2px color-mix(in srgb, ${borderGlowColor} ${Math.round(intensity * 100)}%, transparent)` : 'none',
          ...style
        }}
        {...props}
      >
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: 'var(--huly-gradient)',
            boxShadow: 'var(--huly-shadow)',
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
HulyEffect.displayName = 'HulyEffect';
