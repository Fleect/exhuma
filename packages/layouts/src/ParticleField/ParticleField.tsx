import * as React from 'react';
import { sanitizeDomProps } from '../utils/sanitize-dom-props';
import {
  initParticleBuffer,
  stepParticleBuffer,
  PARTICLE_STRIDE
} from './particle-math';

export interface ParticleFieldProps {
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  repulsionRadius?: number;
  speed?: number;
  connectParticles?: boolean;
  connectionDistance?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ParticleField = React.forwardRef<HTMLDivElement, ParticleFieldProps>(
  (
    {
      particleCount = 60,
      particleColor = '#6366f1',
      particleSize = 2,
      repulsionRadius = 80,
      speed = 1.0,
      connectParticles = false,
      connectionDistance = 100,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rafRef = React.useRef<number>(0);
    const bufferRef = React.useRef<Float32Array | null>(null);
    const pointerRef = React.useRef({ x: -1, y: -1 });
    
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
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const actualCount = prefersReducedMotion ? Math.min(10, particleCount) : particleCount;
      const actualRepulsion = prefersReducedMotion ? 0 : repulsionRadius;
      
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          sizeRef.current = { w: width, h: height, dpr };
          
          if (!bufferRef.current || bufferRef.current.length !== actualCount * PARTICLE_STRIDE) {
            bufferRef.current = initParticleBuffer(actualCount, width, height);
          }
        }
      });
      ro.observe(container);
      
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isVisibleRef.current = entry.isIntersecting;
        }
      }, { threshold: 0.01 });
      io.observe(container);
      
      let lastTime = performance.now();
      
      const loop = (time: number) => {
        if (!isVisibleRef.current) {
          lastTime = time;
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        
        const { w, h, dpr } = sizeRef.current;
        if (w === 0 || h === 0 || !bufferRef.current) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        
        const dt = Math.min((time - lastTime) / 16.66, 2.0); // Normalize to ~60fps step
        lastTime = time;
        
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        
        stepParticleBuffer(
          bufferRef.current,
          dt,
          w,
          h,
          pointerRef.current.x,
          pointerRef.current.y,
          actualRepulsion,
          0.5, // repulsionStrength
          0.001, // returnStrength
          speed
        );
        
        const buf = bufferRef.current;
        const count = buf.length / PARTICLE_STRIDE;
        
        ctx.fillStyle = particleColor;
        ctx.strokeStyle = particleColor;
        
        if (connectParticles && !prefersReducedMotion) {
          ctx.lineWidth = 1;
          for (let i = 0; i < count; i++) {
            const x1 = buf[i * PARTICLE_STRIDE + 0];
            const y1 = buf[i * PARTICLE_STRIDE + 1];
            
            for (let j = i + 1; j < count; j++) {
              const x2 = buf[j * PARTICLE_STRIDE + 0];
              const y2 = buf[j * PARTICLE_STRIDE + 1];
              
              const dx = x1 - x2;
              const dy = y1 - y2;
              const distSq = dx * dx + dy * dy;
              
              if (distSq < connectionDistance * connectionDistance) {
                const dist = Math.sqrt(distSq);
                const alpha = 1 - (dist / connectionDistance);
                ctx.save();
                ctx.globalAlpha = alpha * 0.5;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();
              }
            }
          }
        }
        
        for (let i = 0; i < count; i++) {
          const x = buf[i * PARTICLE_STRIDE + 0];
          const y = buf[i * PARTICLE_STRIDE + 1];
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, particleSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
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
      
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
      
      return () => {
        ro.disconnect();
        io.disconnect();
        cancelAnimationFrame(rafRef.current);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      };
    }, [particleCount, particleColor, particleSize, repulsionRadius, speed, connectParticles, connectionDistance]);
    
    return (
      <div
        ref={containerRef}
        className={className}
        style={{ ...style, position: 'relative' }}
        {...sanitizeDomProps(props as Record<string, unknown>)}
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
ParticleField.displayName = 'ParticleField';
