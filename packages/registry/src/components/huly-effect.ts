import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const hulyEffectComponent: UniversalComponent = {
  id: 'huly-effect',
  name: 'Huly Effect',
  slug: 'huly-effect',
  category: 'cards',
  description: 'Ambient luminance kernel for kinetic hover glow effects with exponential smoothing.',
  version: '1.0.0',
  props: [
    {
      name: 'glowColor',
      label: 'Glow Color',
      type: 'color',
      defaultValue: '#6366f1',
      description: 'Color of the ambient glow.',
    },
    {
      name: 'ambientRadius',
      label: 'Ambient Radius',
      type: 'number',
      defaultValue: 40,
      min: 20,
      max: 80,
      step: 5,
      description: 'Gradient radius percentage.',
    },
    {
      name: 'intensity',
      label: 'Intensity',
      type: 'number',
      defaultValue: 0.8,
      min: 0,
      max: 1,
      step: 0.1,
      description: 'Opacity multiplier for the glow.',
    },
    {
      name: 'borderGlow',
      label: 'Border Glow',
      type: 'boolean',
      defaultValue: true,
      description: 'Whether to glow the border.',
    },
  ],
  defaultProps: {
    glowColor: '#6366f1',
    ambientRadius: 40,
    intensity: 0.8,
    borderGlow: true,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'huly-effect',
        name: 'Huly Effect',
        slug: 'huly-effect',
        category: 'cards',
        pascalName: 'HulyEffect',
        snakeName: 'huly_effect',
        description: 'Ambient luminance kernel for kinetic hover glow effects.',
        defaultTailwindClass: 'relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
      },
      flavor,
      props,
      options
    );
  },
};
