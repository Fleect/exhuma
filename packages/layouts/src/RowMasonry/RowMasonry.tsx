import * as React from 'react';
import { sanitizeDomProps } from '../utils/sanitize-dom-props';
import {
  computeMasonryLayout,
  computeResponsiveColumns,
  MasonryItem
} from './row-masonry-math';

export interface RowMasonryProps {
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  animateTransitions?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RowMasonry = React.forwardRef<HTMLDivElement, RowMasonryProps>(
  (
    {
      columns = 3,
      gap = 16,
      animateTransitions = true,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef<Map<number, HTMLElement>>(new Map());
    const [layout, setLayout] = React.useState<{ items: MasonryItem[]; totalHeight: number }>({ items: [], totalHeight: 0 });
    
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);
    
    const recompute = React.useCallback(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      if (containerWidth === 0) return;
      
      const cols = computeResponsiveColumns(containerWidth, columns);
      
      const childrenArray = React.Children.toArray(children);
      const heights = childrenArray.map((_, i) => {
        const el = itemRefs.current.get(i);
        return el ? el.getBoundingClientRect().height : 0;
      });
      
      // Need to run computeMasonryLayout, but the containerWidth might have changed.
      // Wait, getting height using getBoundingClientRect isn't good if it causes reflow.
      // However, we just measure heights. 
      // Actually, ResizeObserver is better for item heights as well.
      const newLayout = computeMasonryLayout(heights, containerWidth, cols, gap);
      
      // Apply GPU positioning
      newLayout.items.forEach((item) => {
        const el = itemRefs.current.get(item.index);
        if (el) {
          el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
          el.style.width = `${item.width}px`;
        }
      });
      
      setLayout(newLayout);
    }, [children, columns, gap]);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const ro = new ResizeObserver(() => {
        recompute();
      });
      
      ro.observe(container);
      
      // Also observe children
      itemRefs.current.forEach(el => ro.observe(el));
      
      return () => {
        ro.disconnect();
      };
    }, [recompute]);
    
    // Recompute when children change
    React.useEffect(() => {
      recompute();
    }, [recompute, children]);
    
    const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    const shouldAnimate = animateTransitions && !prefersReducedMotion;
    
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          ...style,
          position: 'relative',
          height: layout.totalHeight,
        }}
        {...sanitizeDomProps(props as Record<string, unknown>)}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) itemRefs.current.set(index, el);
                else itemRefs.current.delete(index);
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transition: shouldAnimate ? 'transform 0.3s ease, width 0.3s ease' : 'none',
                willChange: 'transform, width',
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
);
RowMasonry.displayName = 'RowMasonry';
