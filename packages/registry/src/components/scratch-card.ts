import { UniversalComponent, ComponentFilePayload, EcosystemFlavor } from '../schema';
import { generateOuterLayerFiles } from '../templates/outer-layer';
import { CORE_COMPONENT_DEPENDENCIES } from '../templates/common-deps';

export const scratchCardComponent: UniversalComponent = {
  id: 'scratch-card',
  name: 'Scratch Card',
  slug: 'scratch-card',
  category: 'cards',
  description: 'Canvas bitmask scratch card with O(1) completion threshold.',
  version: '1.0.0',
  props: [
    {
      name: 'width',
      label: 'Width',
      type: 'number',
      defaultValue: 300,
      min: 100,
      max: 800,
      step: 10,
      description: 'Width of the scratch card in pixels.',
    },
    {
      name: 'height',
      label: 'Height',
      type: 'number',
      defaultValue: 200,
      min: 100,
      max: 600,
      step: 10,
      description: 'Height of the scratch card in pixels.',
    },
    {
      name: 'coverColor',
      label: 'Cover Color',
      type: 'color',
      defaultValue: '#c0c0c0',
      description: 'Color of the foil cover.',
    },
    {
      name: 'brushSize',
      label: 'Brush Size',
      type: 'number',
      defaultValue: 20,
      min: 10,
      max: 60,
      step: 5,
      description: 'Radius of the scratch brush.',
    },
    {
      name: 'threshold',
      label: 'Threshold',
      type: 'number',
      defaultValue: 0.65,
      min: 0.3,
      max: 0.9,
      step: 0.05,
      description: 'Completion ratio to trigger auto-reveal.',
    },
  ],
  defaultProps: {
    width: 300,
    height: 200,
    coverColor: '#c0c0c0',
    brushSize: 20,
    threshold: 0.65,
  },
  dependencies: CORE_COMPONENT_DEPENDENCIES,
  generateCode: (flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] => {
    return generateOuterLayerFiles(
      {
        id: 'scratch-card',
        name: 'Scratch Card',
        slug: 'scratch-card',
        category: 'cards',
        pascalName: 'ScratchCard',
        snakeName: 'scratch_card',
        description: 'Canvas bitmask scratch card with O(1) completion threshold.',
        defaultTailwindClass: 'relative inline-block rounded-2xl overflow-hidden',
      },
      flavor,
      props,
      options
    );
  },
};
