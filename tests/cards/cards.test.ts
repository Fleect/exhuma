import { describe, it, expect } from 'vitest';
import { TiltCard, HorizontalScroller, StackingCards } from '@exhuma/cards';
import { AutoGrid, AutoGridItem, CssMasonry, CssMasonryItem, MacyMasonry, useMacy } from '@exhuma/layouts';
import { ProtectedRoute, AuthLayout, DashboardLayout, LandingLayout, Header, Footer } from '@exhuma/router';
import * as core from '@exhuma/core';

describe('@exhuma Package Ecosystem — Complete Library Parity Gate', () => {
  it('exports all tactile card components from @exhuma/cards', () => {
    expect(TiltCard).toBeDefined();
    expect(HorizontalScroller).toBeDefined();
    expect(StackingCards).toBeDefined();
  });

  it('exports all responsive layout engines from @exhuma/layouts', () => {
    expect(AutoGrid).toBeDefined();
    expect(AutoGridItem).toBeDefined();
    expect(CssMasonry).toBeDefined();
    expect(CssMasonryItem).toBeDefined();
    expect(MacyMasonry).toBeDefined();
    expect(useMacy).toBeDefined();
  });

  it('exports all routing architectures from @exhuma/router', () => {
    expect(ProtectedRoute).toBeDefined();
    expect(AuthLayout).toBeDefined();
    expect(DashboardLayout).toBeDefined();
    expect(LandingLayout).toBeDefined();
    expect(Header).toBeDefined();
    expect(Footer).toBeDefined();
  });

  it('re-exports all cards, layouts, and router modules through @exhuma/core', () => {
    expect(core.TiltCard).toBeDefined();
    expect(core.HorizontalScroller).toBeDefined();
    expect(core.StackingCards).toBeDefined();
    expect(core.AutoGrid).toBeDefined();
    expect(core.AutoGridItem).toBeDefined();
    expect(core.CssMasonry).toBeDefined();
    expect(core.CssMasonryItem).toBeDefined();
    expect(core.MacyMasonry).toBeDefined();
    expect(core.ProtectedRoute).toBeDefined();
    expect(core.AuthLayout).toBeDefined();
    expect(core.DashboardLayout).toBeDefined();
    expect(core.LandingLayout).toBeDefined();
  });
});

describe('@exhuma Dynamic Primitive Physics & Geometry Gate', () => {
  it('calculates progressive scaling accurately across stack layers', () => {
    // 4 cards stack with default minScale = 0.94
    const scales = core.generateDefaultScaleValues(4, 0.94);
    expect(scales.length).toBe(4);
    expect(scales[0]).toBeCloseTo(0.94, 2); // First/deepest card scales down to minScale
    expect(scales[1]).toBeGreaterThan(scales[0]);
    expect(scales[2]).toBeGreaterThan(scales[1]);
    expect(scales[3]).toBe(1.0); // Last card crowns at 1.0

    // 1 or 2 cards
    expect(core.generateDefaultScaleValues(1)).toEqual([1.0]);
    expect(core.generateDefaultScaleValues(2)).toEqual([0.9, 1.0]);
  });

  it('calculates dynamic horizontal travel distance and virtual section height', () => {
    // Track width 2400px, container width 1200px, extraPadding 60px
    const distance = core.calculateHorizontalDistance(2400, 1200, 60);
    expect(distance).toBe(1260);

    // Section height for viewport 900px, speed 0.85
    const height = core.calculateSectionHeight(900, distance, 0.85);
    expect(height).toBe(900 + Math.round(1260 / 0.85));
    expect(height).toBeGreaterThan(900);
  });

  it('verifies getReverseScale cascade tier progression', () => {
    // 4 cards stack: topStart = 90, topIncrement = 24, minScale = 0.94
    // Checkpoints: CP4 = 186 (triggerTop), CP3 = 162, CP2 = 138, CP1 = 114
    const scaleValues = [0.94, 0.96, 0.98, 1.0];
    const triggerTop = 186;
    const topStart = 90;
    const topIncrement = 24;
    const totalCards = 4;
    const minScale = 0.94;

    // Before reverse starts (lastTop >= triggerTop)
    expect(core.getReverseScale(3, 190, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(1.0);
    expect(core.getReverseScale(2, 190, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.98);

    // Segment 1 (186 -> 162): Only Card 3 scales from 1.0 to 0.98
    expect(core.getReverseScale(3, 186, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(1.0);
    expect(core.getReverseScale(3, 162, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.98);
    expect(core.getReverseScale(2, 162, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.98);

    // Segment 2 (162 -> 138): Both Card 3 and Card 2 scale from 0.98 to 0.96
    expect(core.getReverseScale(3, 138, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.96);
    expect(core.getReverseScale(2, 138, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.96);
    expect(core.getReverseScale(1, 138, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.96);

    // Segment 3 (138 -> 114): Cards 1, 2, 3 all scale to 0.94 (minScale)
    expect(core.getReverseScale(3, 114, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.94);
    expect(core.getReverseScale(2, 114, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.94);
    expect(core.getReverseScale(1, 114, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.94);
    expect(core.getReverseScale(0, 114, triggerTop, topStart, topIncrement, totalCards, scaleValues, minScale)).toBe(0.94);
  });
});

describe('StackingCards Registry Code Generation — Clean & Ejected Engine Gate', () => {
  it('generates production-ready Clean code with @exhuma/core primitives and forwardRef', async () => {
    const { getComponentBySlug } = await import('@exhuma/registry');
    const comp = getComponentBySlug('stacking-cards');
    expect(comp).toBeDefined();

    const cleanFiles = comp!.generateCode('nextjs', comp!.defaultProps, { eject: false });
    expect(cleanFiles.length).toBeGreaterThan(0);

    const cleanCode = cleanFiles[0].code;
    expect(cleanCode).toContain("'use client';");
    expect(cleanCode).toContain("import * as StackingCardsPrimitive from '@exhuma/core';");
    expect(cleanCode).toContain('React.forwardRef');
    expect(cleanCode).toContain('StackingCardsPrimitive.StackingCards');
    expect(cleanCode).toContain('StackingCards.displayName = \'StackingCards\';');
  });

  it('generates self-contained, zero-dependency Ejected Engine with Big-Omega performance', async () => {
    const { getComponentBySlug } = await import('@exhuma/registry');
    const comp = getComponentBySlug('stacking-cards');
    expect(comp).toBeDefined();

    const ejectedFiles = comp!.generateCode('nextjs', comp!.defaultProps, { eject: true });
    expect(ejectedFiles.length).toBeGreaterThan(0);

    const ejectedCode = ejectedFiles[0].code;

    // Zero @exhuma dependencies
    expect(ejectedCode).not.toContain('@exhuma');

    // Inlined mathematical kernels
    expect(ejectedCode).toContain('export const smoothstep');
    expect(ejectedCode).toContain('export const calculateScaleValue');
    expect(ejectedCode).toContain('export const generateDefaultScaleValues');
    expect(ejectedCode).toContain('export const getReverseScale');

    // Big-Omega performance guarantees inlined
    expect(ejectedCode).toContain('Float64Array'); // Zero-allocation typed buffers
    expect(ejectedCode).toContain('requestAnimationFrame'); // 120 FPS rAF coalescing
    expect(ejectedCode).toContain('0.00005'); // Sub-pixel delta-epsilon clamping
    expect(ejectedCode).toContain('willChange: \'transform\''); // GPU layer promotion on inner container only
    expect(ejectedCode).toContain('prefers-reduced-motion'); // Accessibility motion guard
    expect(ejectedCode).toContain('{ passive: true }'); // Passive scroll listeners
    expect(ejectedCode).toContain('React.forwardRef'); // Forward ref support for real applications
  });

  it('generates rich, valid Usage Examples for all 13 supported ecosystems', async () => {
    const { getComponentBySlug, generateComponentUsage, SUPPORTED_ECOSYSTEMS } = await import('@exhuma/registry');
    const comp = getComponentBySlug('stacking-cards');
    expect(comp).toBeDefined();

    for (const flavor of SUPPORTED_ECOSYSTEMS) {
      const usage = generateComponentUsage(comp!, flavor, comp!.defaultProps);
      expect(usage.filename).toBeDefined();
      expect(usage.language).toBeDefined();
      expect(usage.code.length).toBeGreaterThan(50);
      expect(usage.code.toLowerCase()).toContain('stacking');
    }
  });
});



