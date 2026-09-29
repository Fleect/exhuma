import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const hulyEffectComponent: UniversalComponent = {
  id: 'huly-effect',
  name: 'Huly Effect',
  slug: 'huly-effect',
  category: 'interactive',
  description:
    'Cursor-following ambient radial glow that tracks pointer position in real time. Inspired by the Huly.io landing page hover luminance — wraps any element and paints a soft light source that smoothly trails the cursor via exponential smoothing at 120 Hz.',
  version: '1.0.0',
  props: [
    {
      name: 'glowColor',
      label: 'Glow Color',
      type: 'color',
      defaultValue: '#6366f1',
      description: 'Color of the ambient radial glow.',
    },
    {
      name: 'ambientRadius',
      label: 'Ambient Radius (%)',
      type: 'number',
      defaultValue: 40,
      min: 15,
      max: 100,
      step: 5,
      description: 'Radial gradient spread as a percentage of the element width.',
    },
    {
      name: 'intensity',
      label: 'Intensity',
      type: 'number',
      defaultValue: 0.8,
      min: 0,
      max: 1,
      step: 0.05,
      description: 'Opacity multiplier for the glow overlay.',
    },
    {
      name: 'smoothing',
      label: 'Smoothing',
      type: 'number',
      defaultValue: 0.12,
      min: 0.02,
      max: 0.5,
      step: 0.02,
      description: 'Exponential smoothing factor — lower = more lag/dreamier, higher = snappier.',
    },
    {
      name: 'borderGlow',
      label: 'Border Glow',
      type: 'boolean',
      defaultValue: true,
      description: 'Emit a matching box-shadow glow on the element border.',
    },
  ],
  defaultProps: {
    glowColor: '#6366f1',
    ambientRadius: 40,
    intensity: 0.8,
    smoothing: 0.12,
    borderGlow: true,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'huly-effect',
        name: 'Huly Effect',
        slug: 'huly-effect',
        category: 'interactive',
        pascalName: 'HulyEffect',
        snakeName: 'huly_effect',
        description: 'Cursor-following ambient radial glow — inspired by huly.io.',
        defaultTailwindClass: 'relative overflow-hidden rounded-2xl',
      },
      flavor,
      props,
      options
    );
  },
};
