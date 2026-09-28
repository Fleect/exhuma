import { ComponentFilePayload, EcosystemFlavor } from '../schema';
import type { ComponentOuterSpec } from './outer-layer';

export function getGenericOuterFiles(spec: ComponentOuterSpec, flavor: EcosystemFlavor, props: Record<string, unknown>, options?: { eject?: boolean }): ComponentFilePayload[] {
	const { name, slug, pascalName, snakeName, description, defaultTailwindClass = 'relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md' } = spec;

	const isEjected = options?.eject === true;

	switch (flavor) {
		case 'react':
		case 'nextjs': {
			const isNext = flavor === 'nextjs';
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `${name} — Standalone Ejected Engine (Zero Dependencies). All raw math and physics inlined.`,
					code: getEjectedReactCode(slug, pascalName, defaultTailwindClass, props, isNext),
				},
			];
		}

		case 'vue': {
			return [
				{
					filename: `${pascalName}.vue`,
					language: 'vue',
					description: `Vue 3 Native ${name} component.`,
					code: `<script setup lang="ts">
import { clsx } from 'clsx';

interface Props {
  class?: string;
  [key: string]: unknown;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <div
    :class="clsx('${defaultTailwindClass}', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
`,
				},
			];
		}

		case 'svelte': {
			return [
				{
					filename: `${pascalName}.svelte`,
					language: 'svelte',
					description: `Svelte 5 Native ${name} component using runes.`,
					code: `<script lang="ts">
  import { clsx } from 'clsx';

  let {
    class: className = '',
    children,
    ...restProps
  }: {
    class?: string;
    children?: import('svelte').Snippet;
    [key: string]: unknown;
  } = $props();
</script>

<div
  class={clsx('${defaultTailwindClass}', className)}
  {...restProps}
>
  {@render children?.()}
</div>
`,
				},
			];
		}

		case 'solid': {
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `SolidJS Native ${name} component.`,
					code: `import { Component, JSX, splitProps } from 'solid-js';

export interface ${pascalName}Props extends JSX.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}

export const ${pascalName}: Component<${pascalName}Props> = (props) => {
  const [local, others] = splitProps(props, ['class', 'children']);
  return (
    <div
      class={\`${defaultTailwindClass} \${local.class ?? ''}\`}
      {...others}
    >
      {local.children}
    </div>
  );
};
`,
				},
			];
		}

		case 'angular': {
			return [
				{
					filename: `${slug}.component.ts`,
					language: 'typescript',
					description: `Angular 18+ Standalone ${name} component.`,
					code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'exhuma-${slug}',
  standalone: true,
  template: \`
    <div
      class="${defaultTailwindClass} {{ customClass() }}"
    >
      <ng-content></ng-content>
    </div>
  \`,
})
export class Exhuma${pascalName}Component {
  readonly customClass = input<string>('');
}
`,
				},
			];
		}

		case 'astro': {
			return [
				{
					filename: `${pascalName}.astro`,
					language: 'astro',
					description: `Pure Native Astro ${name} component.`,
					code: `---
interface Props {
  class?: string;
  [key: string]: unknown;
}

const { class: className = '', ...props } = Astro.props;
---

<div
  class={\`${defaultTailwindClass} \${className}\`}
  {...props}
>
  <slot />
</div>
`,
				},
			];
		}

		case 'webcomponent': {
			return [
				{
					filename: `exhuma-${slug}.js`,
					language: 'javascript',
					description: `Universal Web Component wrapper for <exhuma-${slug}>.`,
					code: `class Exhuma${pascalName}Element extends HTMLElement {
  connectedCallback() {
    this.classList.add('exhuma-${slug}');
    this.style.display = 'block';
  }
}

if (!customElements.get('exhuma-${slug}')) {
  customElements.define('exhuma-${slug}', Exhuma${pascalName}Element);
}
`,
				},
			];
		}

		case 'vanilla': {
			return [
				{
					filename: `${slug}.vanilla.js`,
					language: 'javascript',
					description: `Autonomous Vanilla JS ${name} initialization module.`,
					code: `export function init${pascalName}(selector = '[data-exhuma-${slug}]', options = {}) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}
`,
				},
			];
		}

		case 'blade': {
			return [
				{
					filename: `${slug}.blade.php`,
					language: 'php',
					description: `Laravel Blade component for ${name}.`,
					code: `@props([])

<div
    {{ $attributes->merge([
        'class' => '${defaultTailwindClass} block',
    ]) }}
>
    {{ $slot }}
</div>
`,
				},
			];
		}

		case 'wordpress': {
			return [
				{
					filename: 'block.json',
					language: 'json',
					description: `WordPress Block API v3 definition for ${name}.`,
					code: JSON.stringify(
						{
							$schema: 'https://schemas.wp.org/trunk/block.json',
							apiVersion: 3,
							name: `exhuma/${slug}`,
							version: '1.0.0',
							title: `Exhuma ${name}`,
							category: 'widgets',
							description,
							attributes: {},
							render: 'file:./render.php',
						},
						null,
						2
					),
				},
				{
					filename: 'render.php',
					language: 'php',
					description: `WordPress render template for ${name}.`,
					code: `<?php\n/**\n * ${name} Block Render Template\n */\n$wrapper_attributes = get_block_wrapper_attributes(['class' => '${defaultTailwindClass}']);\n?>\n<div <?php echo $wrapper_attributes; ?>>\n  <?php echo $content; ?>\n</div>\n`,
				},
			];
		}

		case 'react-native': {
			return [
				{
					filename: `${pascalName}.tsx`,
					language: 'tsx',
					description: `React Native ${name} component.`,
					code: `import React from 'react';\nimport { View, StyleSheet, type ViewProps } from 'react-native';\n\nexport const ${pascalName}: React.FC<ViewProps> = ({ style, children, ...props }) => (\n  <View style={[styles.container, style]} {...props}>\n    {children}\n  </View>\n);\n\nconst styles = StyleSheet.create({\n  container: {\n    overflow: 'hidden',\n    borderRadius: 16,\n  },\n});\n`,
				},
			];
		}

		case 'flutter': {
			return [
				{
					filename: `${snakeName}.dart`,
					language: 'dart',
					description: `Flutter ${name} widget.`,
					code: `import 'package:flutter/material.dart';\n\nclass Exhuma${pascalName} extends StatelessWidget {\n  final Widget child;\n  const Exhuma${pascalName}({super.key, required this.child});\n\n  @override\n  Widget build(BuildContext context) {\n    return Container(child: child);\n  }\n}\n`,
				},
			];
		}
	}
}

function getEjectedReactCode(slug: string, pascalName: string, defaultClass: string, props: Record<string, unknown>, isNext: boolean): string {
	const header = `${isNext ? "'use client';\n\n" : ''}import * as React from 'react';\nimport { clsx } from 'clsx';\n\n`;

	return `${header}export interface ${pascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  [key: string]: unknown;
}

export const ${pascalName} = React.forwardRef<HTMLDivElement, ${pascalName}Props>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        '${defaultClass}',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
${pascalName}.displayName = '${pascalName}';
`;
}
