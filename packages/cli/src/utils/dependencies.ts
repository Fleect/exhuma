import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import pc from 'picocolors';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
	if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
	if (existsSync(resolve(cwd, 'bun.lockb')) || existsSync(resolve(cwd, 'bun.lock'))) return 'bun';
	return 'npm';
}

export function ensureUtilsHelper(cwd: string = process.cwd()): boolean {
	const possiblePaths = [resolve(cwd, 'src/lib/utils.ts'), resolve(cwd, 'lib/utils.ts'), resolve(cwd, 'src/lib/utils.js'), resolve(cwd, 'lib/utils.js')];

	for (const p of possiblePaths) {
		if (existsSync(p)) return true;
	}

	// Target directory: prefer src/lib if src exists, otherwise lib
	const targetDir = existsSync(resolve(cwd, 'src')) ? resolve(cwd, 'src/lib') : resolve(cwd, 'lib');

	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	const utilsCode = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

	const targetFile = resolve(targetDir, 'utils.ts');
	try {
		writeFileSync(targetFile, utilsCode, 'utf8');
		console.log(pc.green('  ✔ Created ') + pc.bold(targetFile.replace(`${cwd}/`, '')) + pc.dim(' (cn helper)'));
		return true;
	} catch {
		return false;
	}
}

export function ensureCoreDependency(cwd: string = process.cwd()): boolean {
	const pkgJsonPath = resolve(cwd, 'package.json');
	if (!existsSync(pkgJsonPath)) return false;

	try {
		const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
		const allDeps = {
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
		};

		const missing: string[] = [];
		if (!allDeps['@exhuma/core']) missing.push('@exhuma/core');
		if (!allDeps['clsx']) missing.push('clsx');

		if (missing.length === 0) {
			return true;
		}

		const pm = detectPackageManager(cwd);
		const installCmd = pm === 'npm' ? `npm install ${missing.join(' ')}` : `${pm} add ${missing.join(' ')}`;

		console.log(pc.cyan(`  ▲ Installing required packages: ${pc.bold(missing.join(', '))} (${pm})...`));
		execSync(installCmd, { cwd, stdio: 'inherit' });
		return true;
	} catch (err: any) {
		console.log(pc.yellow(`  ⚠ Note: Could not auto-install dependencies: ${err.message}`));
		return false;
	}
}
