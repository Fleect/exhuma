import { describe, it, expect } from 'vitest';
import { CssMasonry, CssMasonryItem, AutoGrid, AutoGridItem, BentoGrid, BentoCard, BentoHeader, BentoContent, BentoVisual, DiamondGrid, DiamondColumn, DiamondItem } from '../../packages/layouts/src';
import { cssMasonryComponent } from '../../packages/registry/src/components/css-masonry';
import { autoGridComponent } from '../../packages/registry/src/components/auto-grid';
import { bentoGridComponent } from '../../packages/registry/src/components/bento-grid';
import { diamondGridComponent } from '../../packages/registry/src/components/diamond-grid';

describe('Exhuma Layouts — CssMasonry Architecture & Registry', () => {
	it('exports CssMasonry and CssMasonryItem components', () => {
		expect(CssMasonry).toBeDefined();
		expect(typeof CssMasonry).toBe('function');
		expect(CssMasonryItem).toBeDefined();
		expect(typeof CssMasonryItem).toBe('function');
	});

	it('validates css-masonry registry schema with complete responsive parameters', () => {
		expect(cssMasonryComponent.id).toBe('css-masonry');
		expect(cssMasonryComponent.defaultProps.columns).toBe(1);
		expect(cssMasonryComponent.defaultProps.columnsSm).toBe(2);
		expect(cssMasonryComponent.defaultProps.columnsMd).toBe(2);
		expect(cssMasonryComponent.defaultProps.columnsLg).toBe(3);
		expect(cssMasonryComponent.defaultProps.columnsXl).toBe(4);
		expect(cssMasonryComponent.defaultProps.gap).toBe(16);
		expect(cssMasonryComponent.defaultProps.columnFill).toBe('balance');

		const columnsProp = cssMasonryComponent.props.find((p) => p.name === 'columns');
		const columnsSmProp = cssMasonryComponent.props.find((p) => p.name === 'columnsSm');
		const columnsMdProp = cssMasonryComponent.props.find((p) => p.name === 'columnsMd');
		const columnsLgProp = cssMasonryComponent.props.find((p) => p.name === 'columnsLg');
		const columnsXlProp = cssMasonryComponent.props.find((p) => p.name === 'columnsXl');
		const gapProp = cssMasonryComponent.props.find((p) => p.name === 'gap');
		const columnFillProp = cssMasonryComponent.props.find((p) => p.name === 'columnFill');

		expect(columnsProp?.type).toBe('number');
		expect(columnsProp?.defaultValue).toBe(1);
		expect(columnsProp?.min).toBe(1);
		expect(columnsProp?.max).toBe(8);

		expect(columnsSmProp?.type).toBe('number');
		expect(columnsSmProp?.defaultValue).toBe(2);

		expect(columnsMdProp?.type).toBe('number');
		expect(columnsMdProp?.defaultValue).toBe(2);

		expect(columnsLgProp?.type).toBe('number');
		expect(columnsLgProp?.defaultValue).toBe(3);

		expect(columnsXlProp?.type).toBe('number');
		expect(columnsXlProp?.defaultValue).toBe(4);

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.min).toBe(4);
		expect(gapProp?.max).toBe(64);

		expect(columnFillProp?.type).toBe('select');
		expect(columnFillProp?.options?.length).toBe(2);
	});

	it('generates outer-layer payload without errors', () => {
		const payload = cssMasonryComponent.generateCode('react', {
			columns: 4,
			gap: 20,
			columnFill: 'balance',
		});
		expect(payload).toBeDefined();
		expect(payload.length).toBeGreaterThan(0);
	});
});

describe('Exhuma Layouts — AutoGrid Architecture & Registry', () => {
	it('exports AutoGrid and AutoGridItem components', () => {
		expect(AutoGrid).toBeDefined();
		expect(typeof AutoGrid).toBe('function');
		expect(AutoGridItem).toBeDefined();
		expect(typeof AutoGridItem).toBe('function');
	});

	it('validates auto-grid registry schema with responsive parameters and track modes', () => {
		expect(autoGridComponent.id).toBe('auto-grid');
		expect(autoGridComponent.defaultProps.minItemWidth).toBe(280);
		expect(autoGridComponent.defaultProps.gap).toBe(24);
		expect(autoGridComponent.defaultProps.mode).toBe('auto-fit');
		expect(autoGridComponent.defaultProps.maxColumns).toBe(4);
		expect(autoGridComponent.defaultProps.alignItems).toBe('stretch');

		const minItemWidthProp = autoGridComponent.props.find((p) => p.name === 'minItemWidth');
		const gapProp = autoGridComponent.props.find((p) => p.name === 'gap');
		const modeProp = autoGridComponent.props.find((p) => p.name === 'mode');
		const maxColumnsProp = autoGridComponent.props.find((p) => p.name === 'maxColumns');
		const alignItemsProp = autoGridComponent.props.find((p) => p.name === 'alignItems');

		expect(minItemWidthProp?.type).toBe('number');
		expect(minItemWidthProp?.min).toBe(120);
		expect(minItemWidthProp?.max).toBe(480);

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.min).toBe(4);
		expect(gapProp?.max).toBe(64);

		expect(modeProp?.type).toBe('select');
		expect(modeProp?.options?.map((o) => o.value)).toContain('auto-fit');
		expect(modeProp?.options?.map((o) => o.value)).toContain('auto-fill');

		expect(maxColumnsProp?.type).toBe('number');
		expect(maxColumnsProp?.defaultValue).toBe(4);

		expect(alignItemsProp?.type).toBe('select');
		expect(alignItemsProp?.options?.map((o) => o.value)).toContain('stretch');
		expect(alignItemsProp?.options?.map((o) => o.value)).toContain('start');
	});

	it('generates outer-layer payload without errors', () => {
		const payload = autoGridComponent.generateCode('react', {
			minItemWidth: 320,
			gap: 24,
			mode: 'auto-fill',
		});
		expect(payload).toBeDefined();
		expect(payload.length).toBeGreaterThan(0);
	});
});

describe('Exhuma Layouts — Universal 13-Ecosystem Parity & Big-Ω Gates', () => {
	const ECOSYSTEMS = ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'wordpress', 'webcomponent', 'react-native', 'flutter'] as const;

	for (const ecosystem of ECOSYSTEMS) {
		it(`generates non-empty component source for Auto Grid on ${ecosystem}`, () => {
			const files = autoGridComponent.generateCode(ecosystem, autoGridComponent.defaultProps);
			expect(files.length).toBeGreaterThan(0);
			expect(files[0].code.length).toBeGreaterThan(50);
		});

		it(`generates non-empty component source for CSS Masonry on ${ecosystem}`, () => {
			const files = cssMasonryComponent.generateCode(ecosystem, cssMasonryComponent.defaultProps);
			expect(files.length).toBeGreaterThan(0);
			expect(files[0].code.length).toBeGreaterThan(50);
		});
	}

	it('generates zero-dependency standalone ejected engine for Auto Grid', () => {
		const ejectedFiles = autoGridComponent.generateCode('react', autoGridComponent.defaultProps, { eject: true });
		expect(ejectedFiles.length).toBeGreaterThan(0);
		const code = ejectedFiles[0].code;
		expect(code).not.toContain('@fleect/exhuma');
		expect(code).toContain('AutoGrid');
		expect(code).toContain('AutoGridItem');
		expect(code).toContain('gridTemplateColumns');
	});

	it('generates zero-dependency standalone ejected engine for CSS Masonry', () => {
		const ejectedFiles = cssMasonryComponent.generateCode('react', cssMasonryComponent.defaultProps, { eject: true });
		expect(ejectedFiles.length).toBeGreaterThan(0);
		const code = ejectedFiles[0].code;
		expect(code).not.toContain('@fleect/exhuma');
		expect(code).toContain('CssMasonry');
		expect(code).toContain('CssMasonryItem');
		expect(code).toContain('columnCount');
	});
});

describe('Exhuma Layouts — BentoGrid Architecture & Registry', () => {
	it('exports BentoGrid, BentoCard, BentoHeader, BentoContent, and BentoVisual components', () => {
		expect(BentoGrid).toBeDefined();
		expect(['function', 'object']).toContain(typeof BentoGrid);
		expect(BentoCard).toBeDefined();
		expect(['function', 'object']).toContain(typeof BentoCard);
		expect(BentoHeader).toBeDefined();
		expect(['function', 'object']).toContain(typeof BentoHeader);
		expect(BentoContent).toBeDefined();
		expect(['function', 'object']).toContain(typeof BentoContent);
		expect(BentoVisual).toBeDefined();
		expect(['function', 'object']).toContain(typeof BentoVisual);
		expect(BentoGrid.Card).toBe(BentoCard);
		expect(BentoGrid.Header).toBe(BentoHeader);
		expect(BentoGrid.Content).toBe(BentoContent);
		expect(BentoGrid.Visual).toBe(BentoVisual);
	});

	it('validates bento-grid registry schema with numeric gap, rowHeight, and compoundParts', () => {
		expect(bentoGridComponent.id).toBe('bento-grid');
		expect(bentoGridComponent.defaultProps.cols).toBe(3);
		expect(bentoGridComponent.defaultProps.gap).toBe(20);
		expect(bentoGridComponent.defaultProps.rowHeight).toBe(180);

		const colsProp = bentoGridComponent.props.find((p) => p.name === 'cols');
		const gapProp = bentoGridComponent.props.find((p) => p.name === 'gap');
		const rowHeightProp = bentoGridComponent.props.find((p) => p.name === 'rowHeight');

		expect(colsProp?.type).toBe('number');
		expect(colsProp?.defaultValue).toBe(3);
		expect(colsProp?.min).toBe(1);
		expect(colsProp?.max).toBe(6);

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.defaultValue).toBe(20);
		expect(gapProp?.min).toBe(8);
		expect(gapProp?.max).toBe(64);

		expect(rowHeightProp?.type).toBe('number');
		expect(rowHeightProp?.defaultValue).toBe(180);
		expect(rowHeightProp?.min).toBe(100);
		expect(rowHeightProp?.max).toBe(320);
	});

	it('generates outer-layer clean wrappers with compound parts', () => {
		const files = bentoGridComponent.generateCode('react', bentoGridComponent.defaultProps);
		expect(files.length).toBeGreaterThan(0);
		const code = files[0].code;
		expect(code).toContain('BentoGrid');
		expect(code).toContain('BentoCard');
		expect(code).toContain('BentoHeader');
		expect(code).toContain('BentoContent');
		expect(code).toContain('BentoVisual');
	});

	it('generates zero-dependency standalone ejected engine for Bento Grid', () => {
		const ejectedFiles = bentoGridComponent.generateCode('react', bentoGridComponent.defaultProps, { eject: true });
		expect(ejectedFiles.length).toBeGreaterThan(0);
		const code = ejectedFiles[0].code;
		expect(code).not.toContain('@fleect/exhuma');
		expect(code).toContain('BentoGrid');
		expect(code).toContain('BentoCard');
		expect(code).toContain('BentoHeader');
		expect(code).toContain('BentoContent');
		expect(code).toContain('BentoVisual');
		expect(code).toContain('--bento-x');
		expect(code).toContain('--bento-y');
		expect(code).toContain('gridAutoRows');
	});
});

describe('Exhuma Layouts — DiamondGrid Architecture & Registry', () => {
	it('exports DiamondGrid, DiamondColumn, and DiamondItem components', () => {
		expect(DiamondGrid).toBeDefined();
		expect(['function', 'object']).toContain(typeof DiamondGrid);
		expect(DiamondColumn).toBeDefined();
		expect(['function', 'object']).toContain(typeof DiamondColumn);
		expect(DiamondItem).toBeDefined();
		expect(['function', 'object']).toContain(typeof DiamondItem);
		expect(DiamondGrid.Column).toBe(DiamondColumn);
		expect(DiamondGrid.Item).toBe(DiamondItem);
	});

	it('validates diamond-grid registry schema with numeric gap, layout variant, mode, and compoundParts', () => {
		expect(diamondGridComponent.id).toBe('diamond-grid');
		expect(diamondGridComponent.defaultProps.gap).toBe(16);
		expect(diamondGridComponent.defaultProps.layout).toBe('auto');
		expect(diamondGridComponent.defaultProps.mode).toBe('rhombic');
		expect(diamondGridComponent.defaultProps.responsive).toBe(false);

		const modeProp = diamondGridComponent.props.find((p) => p.name === 'mode');
		const gapProp = diamondGridComponent.props.find((p) => p.name === 'gap');
		const layoutProp = diamondGridComponent.props.find((p) => p.name === 'layout');
		const responsiveProp = diamondGridComponent.props.find((p) => p.name === 'responsive');

		expect(modeProp?.type).toBe('select');
		expect(modeProp?.defaultValue).toBe('rhombic');

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.defaultValue).toBe(16);
		expect(gapProp?.min).toBe(4);
		expect(gapProp?.max).toBe(48);

		expect(layoutProp?.type).toBe('select');
		expect(layoutProp?.defaultValue).toBe('auto');

		expect(responsiveProp?.type).toBe('boolean');
		expect(responsiveProp?.defaultValue).toBe(false);
	});

	it('generates outer-layer clean wrappers with compound parts', () => {
		const files = diamondGridComponent.generateCode('react', diamondGridComponent.defaultProps);
		expect(files.length).toBeGreaterThan(0);
		const code = files[0].code;
		expect(code).toContain('DiamondGrid');
		expect(code).toContain('DiamondColumn');
		expect(code).toContain('DiamondItem');
	});

	it('generates zero-dependency standalone ejected engine for Diamond Grid with mode support', () => {
		const ejectedFiles = diamondGridComponent.generateCode('react', diamondGridComponent.defaultProps, { eject: true });
		expect(ejectedFiles.length).toBeGreaterThan(0);
		const code = ejectedFiles[0].code;
		expect(code).not.toContain('@fleect/exhuma');
		expect(code).toContain('DiamondGrid');
		expect(code).toContain('DiamondColumn');
		expect(code).toContain('DiamondItem');
		expect(code).toContain('DiamondGridMode');
		expect(code).toContain('getDiamondLayoutConfig');
		expect(code).toContain('partitionDiamondItems');
		expect(code).toContain('container-type');
	});

	const ecosystems = ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'astro', 'blade', 'vanilla', 'wordpress', 'webcomponent', 'react-native', 'flutter'] as const;

	for (const flavor of ecosystems) {
		it(`generates non-empty component source for Diamond Grid on ${flavor}`, () => {
			const files = diamondGridComponent.generateCode(flavor, diamondGridComponent.defaultProps);
			expect(files.length).toBeGreaterThan(0);
			expect(files[0].code.length).toBeGreaterThan(50);
		});
	}
});

describe('Exhuma Layouts — RowMasonry Studio Audit: Params, Presets & Canvas Physics', () => {
	it('exports RowMasonry and RowMasonryItem components', async () => {
		const { RowMasonry, RowMasonryItem } = await import('../../packages/layouts/src');
		expect(RowMasonry).toBeDefined();
		expect(typeof RowMasonry).toBe('object'); // React.forwardRef object
		expect(RowMasonryItem).toBeDefined();
		expect(typeof RowMasonryItem).toBe('function');
	});

	it('validates row-masonry registry schema with complete responsive parameters matching CSS Masonry', async () => {
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');
		expect(rowMasonryComponent.id).toBe('row-masonry');
		expect(rowMasonryComponent.defaultProps.columns).toBe(1);
		expect(rowMasonryComponent.defaultProps.columnsSm).toBe(2);
		expect(rowMasonryComponent.defaultProps.columnsMd).toBe(2);
		expect(rowMasonryComponent.defaultProps.columnsLg).toBe(3);
		expect(rowMasonryComponent.defaultProps.columnsXl).toBe(4);
		expect(rowMasonryComponent.defaultProps.gap).toBe(16);

		const columnsProp = rowMasonryComponent.props.find((p) => p.name === 'columns');
		const columnsSmProp = rowMasonryComponent.props.find((p) => p.name === 'columnsSm');
		const columnsMdProp = rowMasonryComponent.props.find((p) => p.name === 'columnsMd');
		const columnsLgProp = rowMasonryComponent.props.find((p) => p.name === 'columnsLg');
		const columnsXlProp = rowMasonryComponent.props.find((p) => p.name === 'columnsXl');
		const gapProp = rowMasonryComponent.props.find((p) => p.name === 'gap');

		expect(columnsProp?.type).toBe('number');
		expect(columnsProp?.defaultValue).toBe(1);
		expect(columnsSmProp?.defaultValue).toBe(2);
		expect(columnsMdProp?.defaultValue).toBe(2);
		expect(columnsLgProp?.defaultValue).toBe(3);
		expect(columnsXlProp?.defaultValue).toBe(4);
		expect(gapProp?.defaultValue).toBe(16);
	});

	it('validates all 6 Studio presets for row-masonry with zero missing keys', async () => {
		const { COMPONENT_PRESETS } = await import('../../apps/showcase/src/components/studio/StudioPresets');
		const presets = COMPONENT_PRESETS['row-masonry'];
		expect(presets).toBeDefined();
		expect(Object.keys(presets).length).toBe(6);

		const expectedPresets = ['Default', 'Dense Gallery', 'Spacious Editorial', 'High Velocity Flow', 'Compact Dual', 'Wide Portfolio'];

		for (const name of expectedPresets) {
			const preset = presets[name];
			expect(preset).toBeDefined();
			expect(typeof preset.columns).toBe('number');
			expect(typeof preset.columnsSm).toBe('number');
			expect(typeof preset.columnsMd).toBe('number');
			expect(typeof preset.columnsLg).toBe('number');
			expect(typeof preset.columnsXl).toBe('number');
			expect(typeof preset.gap).toBe('number');
		}
	});

	it('audits canvas physics: greedy placement preserves bounds and zero overlap', async () => {
		const { computeMasonryLayout, computeResponsiveColumns } = await import('../../packages/layouts/src/RowMasonry/row-masonry-math');

		const containerWidth = 1200;
		const heights = [130, 210, 145, 255, 145, 180, 130, 220, 135];
		const gap = 16;
		const cols = computeResponsiveColumns(containerWidth, { columnsLg: 3 });
		expect(cols).toBe(3);

		const { items, totalHeight } = computeMasonryLayout(heights, containerWidth, cols, gap);
		expect(items).toHaveLength(heights.length);

		// 1. Zero horizontal overflow
		for (const item of items) {
			expect(item.x + item.width).toBeLessThanOrEqual(containerWidth + 0.001);
			expect(item.x).toBeGreaterThanOrEqual(0);
			expect(item.y).toBeGreaterThanOrEqual(0);
		}

		// 2. Shortest column greedy assignment verification:
		// Every item after the first K items must be placed on top of the shortest column
		const colTrackers = new Array(cols).fill(0);
		const colWidth = (containerWidth - gap * (cols - 1)) / cols;

		for (let i = 0; i < heights.length; i++) {
			const minColHeight = Math.min(...colTrackers);
			const item = items[i];
			expect(item.y).toBe(minColHeight);
			expect(item.width).toBeCloseTo(colWidth, 2);

			const colIndex = Math.round(item.x / (colWidth + gap));
			colTrackers[colIndex] += heights[i] + gap;
		}

		// 3. Total height strictly matches the tallest column minus trailing gap
		const maxTracker = Math.max(...colTrackers) - gap;
		expect(totalHeight).toBe(maxTracker);
	});

	it('generates outer-layer payload across all 13 ecosystems for RowMasonry (standard and ejected)', async () => {
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');
		const { SUPPORTED_ECOSYSTEMS } = await import('@fleect/exhuma-registry');

		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			const standard = rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps);
			expect(standard.length).toBeGreaterThan(0);
			expect(standard[0].code.length).toBeGreaterThan(50);

			const ejected = rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps, { eject: true });
			expect(ejected.length).toBeGreaterThan(0);
			expect(ejected[0].code.length).toBeGreaterThan(100);
		}
	});

	it('keeps published row-masonry registry artifact synchronized with source generation across all 13 ecosystems', async () => {
		const { readFileSync } = await import('node:fs');
		const { resolve } = await import('node:path');
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');
		const { SUPPORTED_ECOSYSTEMS } = await import('@fleect/exhuma-registry');

		const artifactPath = resolve(process.cwd(), 'apps/showcase/public/registry/row-masonry.json');
		const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

		expect(artifact.slug).toBe('row-masonry');
		expect(artifact.category).toBe('layouts');
		expect(artifact.props).toHaveLength(6);

		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(artifact.flavors[flavor]).toEqual(rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps));
			expect(artifact.ejected[flavor]).toEqual(rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps, { eject: true }));
		}
	});

	it('keeps embedded CLI canonical registry synchronized for row-masonry', async () => {
		const { readFileSync } = await import('node:fs');
		const { resolve } = await import('node:path');
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');
		const { SUPPORTED_ECOSYSTEMS } = await import('@fleect/exhuma-registry');

		const cliPath = resolve(process.cwd(), 'packages/cli/src/registry/canonical.json');
		const canonical = JSON.parse(readFileSync(cliPath, 'utf8'));

		expect(canonical['row-masonry']).toBeDefined();
		expect(canonical['row-masonry:ejected']).toBeDefined();

		for (const flavor of SUPPORTED_ECOSYSTEMS) {
			expect(canonical['row-masonry'][flavor]).toEqual(rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps));
			expect(canonical['row-masonry:ejected'][flavor]).toEqual(rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps, { eject: true }));
		}
	});

	it('verifies non-React framework implementations of RowMasonry are independent of @fleect/exhuma', async () => {
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');
		const { SUPPORTED_ECOSYSTEMS } = await import('@fleect/exhuma-registry');

		for (const flavor of SUPPORTED_ECOSYSTEMS.filter((f) => f !== 'react' && f !== 'nextjs')) {
			const files = rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps);
			for (const file of files) {
				expect(file.code).not.toContain('@fleect/exhuma');
			}
			expect(rowMasonryComponent.dependencies?.[flavor] ?? []).not.toContain('@fleect/exhuma');
		}
	});

	it('guarantees rAF coalescing and lifecycle safety for browser engines of RowMasonry', async () => {
		const { rowMasonryComponent } = await import('../../packages/registry/src/components/row-masonry');

		for (const flavor of ['react', 'nextjs', 'vue', 'svelte', 'angular', 'solid', 'vanilla', 'webcomponent'] as const) {
			const files = rowMasonryComponent.generateCode(flavor, rowMasonryComponent.defaultProps, { eject: true });
			const code = files[0]?.code ?? '';
			expect(code).toMatch(/requestAnimationFrame/);
			expect(code).toMatch(/cancelAnimationFrame/);
			expect(code).toMatch(/translate3d/);
		}
	});
});
