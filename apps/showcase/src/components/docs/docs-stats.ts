import { ALL_COMPONENTS, ECOSYSTEM_LABELS, type EcosystemFlavor } from '@/registry';

/** Live counts, so docs copy stays correct when ecosystems or components are added or removed. */
export const ECOSYSTEM_COUNT = Object.keys(ECOSYSTEM_LABELS).length;
export const COMPONENT_COUNT = ALL_COMPONENTS.length;

/** Registry labels read like "Vue 3 / Nuxt (.vue)"; split them into a display name and file extension. */
export function getEcosystemTargets(): { flavor: EcosystemFlavor; name: string; ext: string | null }[] {
	return (Object.entries(ECOSYSTEM_LABELS) as [EcosystemFlavor, string][]).map(([flavor, label]) => {
		const match = label.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
		return { flavor, name: match?.[1] ?? label, ext: match?.[2] ?? null };
	});
}
