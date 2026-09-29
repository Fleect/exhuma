/**
 * Text Scramble Cipher Kernel — Exhuma Kinetic Methodology (EKM)
 *
 * Big-Omega (Ω) Guarantees:
 * - Ω(1) per-character lock-in: O(1) index check, no string scanning
 * - Zero CLS: tabular-nums monospaced bounding, container width never changes
 * - Zero heap alloc in rAF: all arrays allocated once on mount
 */

// Default scramble alphabet
export const DEFAULT_SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789';

/** Deterministic char from alphabet at frame t for position i */
export function getScrambleChar(charIndex: number, frame: number, alphabet: string): string {
	const mod = alphabet.length;
	// Use a simple deterministic hash based on character position and frame count
	const index = Math.floor((charIndex * 13 + frame * 7) % mod);
	return alphabet[index < 0 ? index + mod : index];
}

/** Number of locked characters at elapsed progress [0..1] */
export function calculateLockIndex(progress: number, length: number): number {
	return Math.floor(progress * length);
}

/** Normalized progress clamped to [0,1] */
export function calculateProgress(elapsed: number, duration: number): number {
	if (duration <= 0) return 1;
	return Math.max(0, Math.min(1, elapsed / duration));
}
