import * as React from 'react';
import {
  calculateCellIllumination,
  calculateWaveDisplacement,
  gridCellCenter,
  euclideanDistance
} from './kinetic-grid-math';

export interface KineticGridProps {
  columns?: number;
  rows?: number;
  cellSize?: number;
  gap?: number;
  glowColor?: string;
  backgroundColor?: string;
  waveOnClick?: boolean;
  waveSpeed?: number;
  proximityGlow?: boolean;
  glowRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface WaveState {
  x: number;
  y: number;
  startTime: number;
}

export const KineticGrid = React.forwardRef<HTMLDivElement, KineticGridProps>(
  (
    {
      columns = 20,
      rows = 12,
      cellSize = 40,
      gap = 2,
      glowColor = '#6366f1',
      backgroundColor = 'transparent',
      waveOnClick = true,
      waveSpeed = 3.0,
      proximityGlow = true,
      glowRadius = 3,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rafRef = React.useRef<number>(0);
    const pointerRef = React.useRef({ x: -1, y: -1 });
    const wavesRef = React.useRef<WaveState[]>([]);
    
    // Canvas sizing cached
    const sizeRef = React.useRef({ w: 0, h: 0, dpr: 1 });
    const isVisibleRef = React.useRef(true);
    
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);
    
    React.useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          sizeRef.current = { w: width, h: height, dpr };
        }
      });
      ro.observe(container);
      
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
        }
      });
      io.observe(container);
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      const loop = (time: number) => {
        if (!isVisibleRef.current) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        
        const { w, h, dpr } = sizeRef.current;
        if (w === 0 || h === 0) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        
        const now = performance.now();
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;
        
        // Clean up old waves
        wavesRef.current = wavesRef.current.filter((w) => now - w.startTime < 1500);
        
        const cellGlowRadiusPx = glowRadius * (cellSize + gap);
        
        ctx.fillStyle = glowColor;
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
            const { x: cx, y: cy } = gridCellCenter(c, r, cellSize, gap);
            
            let intensity = 0;
            
            // Pointer proximity glow
            if (proximityGlow && px >= 0 && py >= 0) {
              intensity = Math.max(intensity, calculateCellIllumination(cx, cy, px, py, cellGlowRadiusPx) * 0.4);
            }
            
            // Waves
            if (!prefersReducedMotion) {
              for (const wave of wavesRef.current) {
                const dist = euclideanDistance(cx, cy, wave.x, wave.y);
                const t = (now - wave.startTime) / 1000;
                // Normalize distance by cell size
                const normalizedDist = dist / (cellSize + gap);
                const disp = calculateWaveDisplacement(normalizedDist, t, 1.0, waveSpeed * 10, 2.0);
                if (disp > 0) {
                  intensity = Math.max(intensity, disp);
                }
              }
            }
            
            if (intensity > 0) {
              ctx.save();
              ctx.globalAlpha = Math.min(1, intensity);
              // Draw cell
              ctx.fillRect(
                cx - cellSize / 2,
                cy - cellSize / 2,
                cellSize,
                cellSize
              );
              ctx.restore();
            }
          }
        }
        
        rafRef.current = requestAnimationFrame(loop);
      };
      
      rafRef.current = requestAnimationFrame(loop);
      
      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };
      
      const onPointerLeave = () => {
        pointerRef.current = { x: -1, y: -1 };
      };
      
      const onClick = (e: MouseEvent) => {
        if (!waveOnClick || prefersReducedMotion) return;
        const rect = container.getBoundingClientRect();
        wavesRef.current.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          startTime: performance.now(),
        });
      };
      
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
      container.addEventListener('click', onClick);
      
      return () => {
        ro.disconnect();
        io.disconnect();
        cancelAnimationFrame(rafRef.current);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('click', onClick);
      };
    }, [columns, rows, cellSize, gap, glowColor, waveOnClick, waveSpeed, proximityGlow, glowRadius]);
    
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          ...style,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor,
          width: columns * (cellSize + gap) - gap,
          height: rows * (cellSize + gap) - gap,
        }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      </div>
    );
  }
);
KineticGrid.displayName = 'KineticGrid';
