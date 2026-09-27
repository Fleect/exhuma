import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CLI_BIN = resolve(__dirname, '../../packages/cli/dist/index.js');
const CREATE_BIN = resolve(__dirname, '../../packages/create-exhuma/dist/index.js');
const TEST_DIR = resolve(__dirname, '../../scratch/cli-vitest');

describe('Exhuma CLI Suite — Automated End-to-End Test Gate', () => {
  beforeAll(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('outputs help information and valid command list', () => {
    const stdout = execSync(`node "${CLI_BIN}" --help`).toString();
    expect(stdout).toContain('exhuma [options] [command]');
    expect(stdout).toContain('init');
    expect(stdout).toContain('add');
    expect(stdout).toContain('list');
    expect(stdout).toContain('build');
  });

  it('outputs version number matching 0.1.1', () => {
    const stdout = execSync(`node "${CLI_BIN}" --version`).toString();
    expect(stdout.trim()).toBe('0.1.1');
  });

  it('lists all canonical components and all 13 ecosystems', () => {
    const stdout = execSync(`node "${CLI_BIN}" list`).toString();
    expect(stdout).toContain('stacking-cards');
    expect(stdout).toContain('horizontal-scroller');
    expect(stdout).toContain('css-masonry');
    expect(stdout).toContain('auto-grid');
    expect(stdout).toContain('tilt-card');
    expect(stdout).toContain('spotlight-card');
    expect(stdout).toContain('comparison-slider');
    expect(stdout).toContain('expandable-card');
    expect(stdout).toContain('react • nextjs • vue • svelte • angular • solid • astro • blade • vanilla • wordpress • webcomponent • react-native • flutter');
  });

  it('executes exhuma init and creates valid exhuma.json', () => {
    execSync(`node "${CLI_BIN}" init --yes --flavor=svelte`, { cwd: TEST_DIR });
    const configPath = resolve(TEST_DIR, 'exhuma.json');
    expect(existsSync(configPath)).toBe(true);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(config.flavor).toBe('svelte');
    expect(config.path).toBe('src/lib/components');
  });

  it('installs real production Svelte 5 component with Runes via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add stacking-cards --flavor=svelte --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/StackingCards.svelte');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('$props()');
    expect(code).toContain('onMount');
    expect(code).toContain('reverseScale');
  });

  it('installs real React component via exhuma add with custom path', () => {
    execSync(`node "${CLI_BIN}" add auto-grid --flavor=react --path=custom/ui --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'custom/ui/AutoGrid.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('AutoGrid');
    expect(code).toContain('@exhuma/core');
    expect(code).toContain('AutoGridPrimitive');
  });

  it('installs real Spotlight Card component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add spotlight-card --flavor=svelte --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/SpotlightCard.svelte');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('exhuma-spotlight-card');
    expect(code).toContain('updateFrame');
  });

  it('installs real Border Beam component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add border-beam --flavor=svelte --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/BorderBeam.svelte');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('exhuma-border-beam');
    expect(code).toContain('doubleBeam');
    expect(code).toContain('endOpacity');
  });

  it('installs real Card Swipe Stack component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add card-swipe-stack --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/CardSwipeStack.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('CardSwipeStack');
    expect(code).toContain('min-h-[14.5rem]');
  });

  it('installs real Comparison Slider component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add comparison-slider --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/ComparisonSlider.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('ComparisonSlider');
    expect(code).toContain('ComparisonSliderPrimitive');
  });

  it('installs real Expandable Card component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add expandable-card --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/ExpandableCard.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('ExpandableCard');
    expect(code).toContain('ExpandableTrigger');
  });

  it('installs real Expandable Card component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add expandable-card --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/ExpandableCard.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('ExpandableCard');
    expect(code).toContain('translate3d');
    expect(code).toContain('createPortal');
  });

  it('installs real Diamond Grid component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add diamond-grid --flavor=react --eject --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/DiamondGrid.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('DiamondGrid');
    expect(code).toContain('DiamondColumn');
    expect(code).toContain('DiamondItem');
    expect(code).toContain('getDiamondLayoutConfig');
    expect(code).toContain('partitionDiamondItems');
  });

  it('installs real Morphing Tabs component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add morphing-tabs --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/MorphingTabs.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('MorphingTabs');
    expect(code).toContain('TabsRoot');
    expect(code).toContain('TabsList');
    expect(code).toContain('TabsIndicator');
    expect(code).toContain('TabsTrigger');
    expect(code).toContain('TabsContent');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Morphing Tabs component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add morphing-tabs --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/MorphingTabs.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('MorphingTabs');
    expect(code).toContain('solveCriticallyDampedSpring');
    expect(code).toContain('translate3d');
    expect(code).toContain('TabsRoot');
  });

  it('installs real Stacking Cards component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add stacking-cards --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/StackingCards.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('StackingCards');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Stacking Cards component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add stacking-cards --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/StackingCards.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('StackingCards');
    expect(code).toContain('smoothstep');
    expect(code).toContain('getReverseScale');
    expect(code).toContain('Float64Array');
  });

  it('installs real Spotlight Card component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add spotlight-card --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/SpotlightCard.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('SpotlightCard');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Spotlight Card component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add spotlight-card --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/SpotlightCard.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('SpotlightCard');
    expect(code).toContain('--exhuma-spotlight-x');
    expect(code).toContain('handlePointerMove');
  });

  it('installs real Border Beam component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add border-beam --flavor=react --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/BorderBeam.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('BorderBeam');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Border Beam component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add border-beam --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/BorderBeam.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('BorderBeam');
    expect(code).toContain('offsetPath');
    expect(code).toContain('doubleBeam');
  });

  it('installs real Accordion component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add accordion --flavor=react --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/Accordion.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('Accordion');
    expect(code).toContain('AccordionRoot');
    expect(code).toContain('AccordionTrigger');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Accordion component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add accordion --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/Accordion.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('Accordion');
    expect(code).toContain('grid-rows-[1fr]');
    expect(code).toContain('grid-rows-[0fr]');
    expect(code).toContain('rotate-0');
    expect(code).toContain('-rotate-180');
    expect(code).toContain('-rotate-90');
    expect(code).toContain('focus-visible:ring-primary');
  });

  it('installs real Number Ticker component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add number-ticker --flavor=react --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/NumberTicker.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('NumberTicker');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Number Ticker component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add number-ticker --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/NumberTicker.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('NumberTicker');
    expect(code).toContain('easeOutExpo');
    expect(code).toContain('IntersectionObserver');
    expect(code).toContain('textContent');
  });

  it('installs real Magnetic Button component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add magnetic-button --flavor=react --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/MagneticButton.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('MagneticButton');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Magnetic Button component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add magnetic-button --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/MagneticButton.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('MagneticButton');
    expect(code).toContain('calculateMagneticPull');
    expect(code).toContain('translate3d');
    expect(code).toContain('maxDisplacement');
  });

  it('installs real Floating Dock component via exhuma add (clean mode)', () => {
    execSync(`node "${CLI_BIN}" add floating-dock --flavor=react --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/FloatingDock.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('FloatingDock');
    expect(code).toContain('@exhuma/core');
  });

  it('installs real Floating Dock component via exhuma add with ejected mode', () => {
    execSync(`node "${CLI_BIN}" add floating-dock --flavor=react --eject --yes --overwrite`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/FloatingDock.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('FloatingDock');
    expect(code).toContain('calculateCosineBellScale');
    expect(code).toContain('calculateDockItemSize');
    expect(code).toContain('requestAnimationFrame');
  });

  it('executes exhuma build to generate static registry JSON', () => {
    const buildOut = resolve(TEST_DIR, 'dist-registry');
    execSync(`node "${CLI_BIN}" build --output="${buildOut}"`, { cwd: TEST_DIR });

    expect(existsSync(resolve(buildOut, 'index.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'stacking-cards.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'tilt-card.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'spotlight-card.json'))).toBe(true);

    const indexJson = JSON.parse(readFileSync(resolve(buildOut, 'index.json'), 'utf8'));
    expect(indexJson.components.length).toBeGreaterThanOrEqual(5);
  });

  it('verifies create-exhuma binary help output', () => {
    const stdout = execSync(`node "${CREATE_BIN}" --help`).toString();
    expect(stdout).toBeDefined();
  });
});
