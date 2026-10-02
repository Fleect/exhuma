import { builtinModules } from 'node:module';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ArchitectureIssue {
  readonly file: string;
  readonly line: number;
  readonly message: string;
}

const nodeModules = new Set(builtinModules.map((name) => name.replace(/^node:/u, '')));
const normalized = (path: string): string => path.split(sep).join('/');

function sourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    if (entry.isSymbolicLink()) return [];
    if (entry.isDirectory()) {
      return ['node_modules', 'dist', '.next'].includes(entry.name) ? [] : sourceFiles(child);
    }
    return /\.[cm]?[jt]sx?$/u.test(entry.name) && !/\.(test|spec)\./u.test(entry.name)
      ? [child]
      : [];
  });
}

function workspace(file: string): string | undefined {
  return file.match(/^(apps|packages)\/[^/]+/u)?.[0];
}

export function validateImport(file: string, specifier: string): string | undefined {
  const target = specifier.startsWith('.')
    ? normalized(relative('/', resolve('/', file, '..', specifier)))
    : specifier;

  // Rule: Core headless math must never import UI or framework dependencies
  if (file.startsWith('packages/core/src/math/') || file.startsWith('packages/core/src/observers/')) {
    if (
      specifier.startsWith('@fleect/exhuma-cards') ||
      specifier.startsWith('@fleect/exhuma-layouts') ||
      specifier.startsWith('@fleect/exhuma-router')
    ) {
      return 'Core headless math modules must never import from UI packages.';
    }
    if (specifier === 'react' || specifier.startsWith('next/')) {
      return 'Core headless modules must remain runtime-neutral and decoupled from React/Next.';
    }
  }

  // Rule: Workspace packages must not reach into internals of sibling packages
  if (workspace(target) && workspace(file) !== workspace(target)) {
    return 'Cross-workspace imports must use the package public entry point, not internal files.';
  }

  return undefined;
}

export function checkArchitecture(root: string): ArchitectureIssue[] {
  const issues: ArchitectureIssue[] = [];
  const files = [
    ...sourceFiles(resolve(root, 'packages')),
    ...sourceFiles(resolve(root, 'apps/showcase/src')),
  ];

  for (const absolute of files) {
    const relativeFile = normalized(relative(root, absolute));
    const content = readFileSync(absolute, 'utf8');
    const lines = content.split(/\r?\n/u);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/(?:from|import)\s+['"]([^'"]+)['"]/u);
      if (match) {
        const specifier = match[1];
        const error = validateImport(relativeFile, specifier);
        if (error) {
          issues.push({ file: relativeFile, line: i + 1, message: error });
        }
      }
    }
  }

  return issues;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const issues = checkArchitecture(process.cwd());
  for (const issue of issues) {
    console.error(`${issue.file}:${issue.line}: ${issue.message}`);
  }
  if (issues.length) {
    process.exitCode = 1;
  } else {
    console.log('Monorepo architectural boundaries and imports verified clean.');
  }
}
