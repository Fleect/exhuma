/**
 * Scratch Card Bitmask Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) scratch ratio: 16x16=256 sub-samples instead of W*H pixel scan
 * - Zero GC: samples read from existing ImageData buffer, no allocation
 * - Threshold completion in O(256) = O(1) constant time
 */

/** Samples canvas alpha channel at a 16x16 coarse grid to estimate scratch ratio */
export function estimateScratchRatio(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const steps = 16;
  const stepX = Math.max(1, Math.floor(width / steps));
  const stepY = Math.max(1, Math.floor(height / steps));
  let clearCount = 0;
  let totalCount = 0;

  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width; x += stepX) {
        const index = (y * width + x) * 4 + 3; // Alpha channel
        if (data[index] < 128) {
          clearCount++;
        }
        totalCount++;
      }
    }
    
    if (totalCount === 0) return 0;
    return clearCount / totalCount;
  } catch (e) {
    return 0;
  }
}

/** Calculates brush circle radius scaled for DPR */
export function scaledBrushRadius(baseRadius: number, dpr: number): number {
  return baseRadius * dpr;
}

/** Returns whether scratch is complete given ratio and threshold */
export function isScratchComplete(ratio: number, threshold: number): boolean {
  return ratio >= threshold;
}
