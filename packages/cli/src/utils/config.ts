import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EcosystemFlavor, DEFAULT_PATHS } from '../constants';

export interface ExhumaConfig {
	$schema?: string;
	flavor: EcosystemFlavor;
	path: string;
	typescript?: boolean;
	tailwind?: boolean;
}

export const CONFIG_FILE = 'exhuma.json';

export function detectEcosystem(cwd: string = process.cwd()): EcosystemFlavor {
	const pkgPath = resolve(cwd, 'package.json');
	if (existsSync(pkgPath)) {
		try {
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
			const deps = { ...pkg.dependencies, ...pkg.devDependencies };

			if (deps['next']) return 'nextjs';
			if (deps['react-native'] || deps['expo']) return 'react-native';
			if (deps['@angular/core']) return 'angular';
			if (deps['svelte'] || deps['@sveltejs/kit']) return 'svelte';
			if (deps['vue'] || deps['nuxt']) return 'vue';
			if (deps['solid-js']) return 'solid';
			if (deps['astro']) return 'astro';
			if (deps['react']) return 'react';
		} catch {
			// ignore
		}
	}

	// Detect Laravel Blade
	if (existsSync(resolve(cwd, 'artisan')) && existsSync(resolve(cwd, 'resources/views'))) {
		return 'blade';
	}

	// Detect Flutter
	if (existsSync(resolve(cwd, 'pubspec.yaml'))) {
		return 'flutter';
	}

	// Detect WordPress
	if (existsSync(resolve(cwd, 'wp-content')) || existsSync(resolve(cwd, 'block.json'))) {
		return 'wordpress';
	}

	return 'react';
}

export function getConfig(cwd: string = process.cwd()): ExhumaConfig | null {
	const path = resolve(cwd, CONFIG_FILE);
	if (!existsSync(path)) return null;

	try {
		const raw = readFileSync(path, 'utf8');
		return JSON.parse(raw) as ExhumaConfig;
	} catch {
		return null;
	}
}

export function writeConfig(config: ExhumaConfig, cwd: string = process.cwd()): void {
	const path = resolve(cwd, CONFIG_FILE);
	writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}
