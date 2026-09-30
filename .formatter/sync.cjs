#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Optimized Formatter Sync System
 * Reads from FORMATTER_CONFIG.md and generates config files with pnpm integration
 * Consolidates ESLint with Next.js built-in capabilities
 */

// Required dependencies for the formatting system
const requiredDeps = {
	prettier: ['prettier'],
	'prettier-plugin-tailwindcss': ['prettier-plugin-tailwindcss'],
	eslint: ['eslint'],
	'@typescript-eslint/parser': ['@typescript-eslint/parser'],
	'@typescript-eslint/eslint-plugin': ['@typescript-eslint/eslint-plugin'],
	'eslint-plugin-react': ['eslint-plugin-react'],
	'eslint-config-prettier': ['eslint-config-prettier'],
	'eslint-plugin-prettier': ['eslint-plugin-prettier'],
	'eslint-config-next': ['eslint-config-next'],
	'eslint-plugin-better-tailwindcss': ['eslint-plugin-better-tailwindcss'],
	typescript: ['typescript'],
	'@types/node': ['@types/node'],
	'@types/react': ['@types/react'],
	'@types/react-dom': ['@types/react-dom'],
};

// Enhanced dependency checking with optional deps
const checkDependencies = () => {
	if (!fs.existsSync('package.json')) {
		console.log('❌ package.json not found');
		return false;
	}

	try {
		const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
		const allDeps = {
			...(packageJson.dependencies || {}),
			...(packageJson.devDependencies || {}),
		};

		// Required dependencies
		const missingRequired = Object.entries(requiredDeps)
			.filter(([name, alternatives]) => !alternatives.some((dep) => allDeps[dep]))
			.map(([name]) => name);

		// Optional but recommended dependencies
		const optionalDeps = {
			typescript: ['typescript'],
			'@types/node': ['@types/node'],
			'@types/react': ['@types/react'],
			'@types/react-dom': ['@types/react-dom'],
		};

		const missingOptional = Object.entries(optionalDeps)
			.filter(([name, alternatives]) => !alternatives.some((dep) => allDeps[dep]))
			.map(([name]) => name);

		if (missingRequired.length > 0) {
			console.log('❌ Missing required dependencies:', missingRequired.join(', '));
			console.log('   Run: pnpm install to install missing packages');
			return false;
		}

		if (missingOptional.length > 0) {
			console.log('⚠️  Missing optional dependencies:', missingOptional.join(', '));
			console.log('   Consider: pnpm add -D', missingOptional.join(' '));
		}

		return true;
	} catch (error) {
		console.error('❌ Error reading package.json:', error.message);
		return false;
	}
};

// Validate safety settings
const validateSafety = (config) => {
	const safetyIssues = [];

	if (config.SAFE_MODE !== 'true') {
		safetyIssues.push('SAFE_MODE should be true');
	}
	if (config.NO_FILE_DELETION !== 'true') {
		safetyIssues.push('NO_FILE_DELETION should be true');
	}
	if (config.SRC_ONLY !== 'true') {
		safetyIssues.push('SRC_ONLY should be true');
	}

	if (safetyIssues.length > 0) {
		console.log('⚠️  Safety issues:', safetyIssues.join(', '));
		return false;
	}

	return true;
};

// Read config from FORMATTER_CONFIG.md with error handling
const readConfig = () => {
	try {
		if (!fs.existsSync('.formatter/FORMATTER_CONFIG.md')) {
			console.error('❌ .formatter/FORMATTER_CONFIG.md not found');
			process.exit(1);
		}

		const file = fs.readFileSync('.formatter/FORMATTER_CONFIG.md', 'utf8');
		const match = file.match(/```config\n([\s\S]*?)\n```/);

		if (!match) {
			console.error('❌ No config block found in FORMATTER_CONFIG.md');
			console.error('   Expected format: ```config\\n...\\n```');
			process.exit(1);
		}

		// Parse configuration from FORMATTER_CONFIG.md - no hardcoded defaults
		const config = {};
		const configLines = match[1].split('\n');

		configLines.forEach((line, index) => {
			line = line.trim();

			// Skip empty lines and comments
			if (!line || line.startsWith('#')) {
				return;
			}

			// Parse key=value pairs
			if (line.includes('=')) {
				const [key, ...valueParts] = line.split('=');
				const value = valueParts.join('=').trim(); // Handle values that contain '='
				const cleanKey = key.trim();

				if (cleanKey && value) {
					config[cleanKey] = value;
				} else {
					console.warn(`⚠️  Skipping invalid config line ${index + 1}: "${line}"`);
				}
			} else {
				console.warn(`⚠️  Skipping malformed config line ${index + 1}: "${line}"`);
			}
		});

		// Validate that we have at least some configuration
		if (Object.keys(config).length === 0) {
			console.error('❌ No valid configuration found in FORMATTER_CONFIG.md');
			process.exit(1);
		}

		console.log(`📖 Loaded ${Object.keys(config).length} configuration settings from FORMATTER_CONFIG.md`);
		return config;
	} catch (error) {
		console.error('❌ Error reading FORMATTER_CONFIG.md:', error.message);
		process.exit(1);
	}
};

// Improve file operations with error handling
const safeWriteFile = (filePath, content) => {
	try {
		const dir = path.dirname(filePath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}



		fs.writeFileSync(filePath, content);
		return true;
	} catch (error) {
		console.error(`❌ Failed to write ${filePath}:`, error.message);
		return false;
	}
};

// Generate Prettier config (compatible with wp-prettier)
const generatePrettierConfig = (config) => {
	// Helper function to get config value with fallback
	const getConfigValue = (key, fallback) => config[key] !== undefined ? config[key] : fallback;

	const useTabs = getConfigValue('INDENT_STYLE', 'space') === 'tab';
	const tabWidth = parseInt(getConfigValue('INDENT_SIZE', '2')) || 2;
	const printWidth = parseInt(getConfigValue('PRINT_WIDTH', '80')) || 80;
	const singleQuote = getConfigValue('USE_SINGLE_QUOTES', 'true') === 'true';
	const semi = getConfigValue('USE_SEMICOLONS', 'true') === 'true';
	const bracketSpacing = getConfigValue('BRACKET_SPACING', 'true') === 'true';
	const bracketSameLine = getConfigValue('BRACKET_SAME_LINE', 'false') === 'true';
	const jsxSingleQuote = getConfigValue('JSX_SINGLE_QUOTE', 'true') === 'true';
	const singleAttributePerLine = getConfigValue('SINGLE_ATTRIBUTE_PER_LINE', 'false') === 'true';
	const arrowParens = getConfigValue('ARROW_PARENS', 'avoid');
	const endOfLine = getConfigValue('END_OF_LINE', 'lf');
	const proseWrap = getConfigValue('PROSE_WRAP', 'preserve');
	const trailingComma = getConfigValue('TRAILING_COMMA', 'es5');
	const tailwindClassSorting = getConfigValue('TAILWIND_CLASS_SORTING', 'true') === 'true';

	// Build plugins array based on configuration
	const plugins = [];
	if (tailwindClassSorting) {
		plugins.push('prettier-plugin-tailwindcss');
	}
	const pluginsString = plugins.length > 0 ? `['${plugins.join("', '")}']` : '[]';

	const prettierConfigContent = `module.exports = {
	// Basic formatting
	semi: ${semi},
	singleQuote: ${singleQuote},
	trailingComma: '${trailingComma}',
	useTabs: ${useTabs},
	tabWidth: ${tabWidth},
	printWidth: ${printWidth},

	// Advanced formatting
	bracketSpacing: ${bracketSpacing},
	bracketSameLine: ${bracketSameLine},
	arrowParens: '${arrowParens}',
	endOfLine: '${endOfLine}',
	proseWrap: '${proseWrap}',

	// JSX formatting
	jsxSingleQuote: ${jsxSingleQuote},
	singleAttributePerLine: ${singleAttributePerLine},

	// Plugins for modern development
	plugins: ${pluginsString},

	// File-specific overrides
	overrides: [
		{
			files: '*.{ts,tsx}',
			options: {
				parser: 'typescript',
			}
		},
		{
			files: '*.{css,scss,less}',
			options: {
				singleQuote: ${getConfigValue('CSS_SINGLE_QUOTES', 'true') === 'true'},
				useTabs: ${useTabs},
				tabWidth: ${tabWidth}
			}
		},
		{
			files: '*.{json,jsonc}',
			options: {
				trailingComma: '${getConfigValue('JSON_TRAILING_COMMA', 'none')}',
				useTabs: ${useTabs},
				tabWidth: ${tabWidth}
			}
		},
		{
			files: '*.{md,mdx}',
			options: {
				useTabs: false,
				tabWidth: 2,
				proseWrap: '${getConfigValue('MARKDOWN_PROSE_WRAP', 'always')}'
			}
		},
		{
			files: '*.{yml,yaml}',
			options: {
				useTabs: ${getConfigValue('YAML_INDENT_STYLE', 'space') === 'tab'},
				tabWidth: ${parseInt(getConfigValue('YAML_INDENT_SIZE', '2')) || 2}
			}
		},
	],
};`;

	return prettierConfigContent;
};

// Generate .prettierignore at project root
const generatePrettierIgnore = () => {
	return `# Generated from FORMATTER_CONFIG.md
# Monorepo layout: source lives under apps/*/src and packages/*/src,
# not a single root-level src/ — so this excludes generated/vendor
# output instead of whitelisting one src folder (which would silently
# blackhole every workspace package).

node_modules/
vendor/
build/
dist/
*.min.js
*.min.css
*.log
coverage/
.cache/
.next/
package-lock.json
yarn.lock
pnpm-lock.yaml
composer.lock
.DS_Store
Thumbs.db
*.tmp
*.temp

# Auterix workflow context, managed adapters & task specs (protects regex parsers and SHA256 lockfile integrity)
.ai/
.agents/
.cursor/
.augment/
CLAUDE.md
AGENTS.md
.github/copilot-instructions.md`;
};

// Generate ESLint flat config (eslint.config.cjs) for ESLint 9+ / Next.js 16+
const generateESLintConfig = (config) => {
	// Helper function to get config value with fallback
	const getConfigValue = (key, fallback) => config[key] !== undefined ? config[key] : fallback;

	const maxLineLength = parseInt(getConfigValue('MAX_LINE_LENGTH', '80')) || 80;
	const noConsole = getConfigValue('NO_CONSOLE', 'warn');
	const noDebugger = getConfigValue('NO_DEBUGGER', 'error');
	const preferConst = getConfigValue('PREFER_CONST', 'error');
	const noVar = getConfigValue('NO_VAR', 'error');
	const eqeqeq = getConfigValue('EQEQEQ', 'error');
	const reactHooksExhaustiveDeps = getConfigValue('REACT_HOOKS_EXHAUSTIVE_DEPS', 'warn');
	const reactJsxNoTargetBlank = getConfigValue('REACT_JSX_NO_TARGET_BLANK', 'error');
	const reactNoUnescapedEntities = getConfigValue('REACT_NO_UNESCAPED_ENTITIES', 'off');

	return `const nextConfig = require('eslint-config-next/core-web-vitals');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const typescriptParser = require('@typescript-eslint/parser');
const unicornPlugin = require('eslint-plugin-unicorn').default ?? require('eslint-plugin-unicorn');

// Prettier options from .formatter/.prettierrc.cjs (strip Prettier-only keys not valid in ESLint rule)
const { plugins: _p, overrides: _o, ...prettierOptions } = require('./.formatter/.prettierrc.cjs');

// Tailwind class options for eslint-plugin-better-tailwindcss — mirror VS Code's tailwindCSS.classFunctions
// and tailwindCSS.experimental.configFile, so CLI lint surfaces the exact diagnostics the IDE shows.
// entryPoint and cwd must both be absolute: pnpm's strict node_modules only links \`tailwindcss\`
// inside apps/showcase (not hoisted to the repo root), so the plugin's own \`tailwindcss/package.json\`
// resolution silently fails and disables every rule unless \`cwd\` points there explicitly — this bit
// both the IDE's ESLint extension and any root-level \`eslint <path>\` invocation.
const path = require('path');
const showcaseDir = path.join(__dirname, 'apps/showcase');
const tailwindClassOptions = {
	callees: ['cn', 'cva', 'tv', 'clsx'],
	attributes: ['className', 'class'],
	entryPoint: path.join(showcaseDir, 'src/styles/global.scss'),
	cwd: showcaseDir,
};

// Async IIFE: eslint-plugin-better-tailwindcss ships ESM-only, and Node 20 cannot \`require()\` ESM.
module.exports = (async () => {
	const betterTailwindcss = (await import('eslint-plugin-better-tailwindcss')).default;

	return [
		// Next.js core-web-vitals flat config (includes React, React Hooks, import, a11y, @next rules)
		...Object.values(nextConfig),

		// TypeScript + Prettier layer
		{
			files: ['**/*.ts', '**/*.tsx'],
			plugins: {
				prettier: prettierPlugin,
				unicorn: unicornPlugin,
				'better-tailwindcss': betterTailwindcss,
			},
			// @next/next rules (e.g. no-html-link-for-pages) default to context.cwd for locating the
			// Next.js app; that's the repo root here, not apps/showcase, so they warn "Pages directory
			// cannot be found" and skip their check when linting runs (or the IDE extension resolves
			// this config) from the root instead of from inside apps/showcase.
			settings: {
				next: { rootDir: showcaseDir },
			},
			languageOptions: {
				parser: typescriptParser,
				parserOptions: {
					ecmaFeatures: { jsx: true },
					ecmaVersion: 2022,
					sourceType: 'module',
					// projectService auto-discovers the nearest tsconfig.json per file instead of
					// hardcoding one path — required because this repo has multiple tsconfigs
					// (root ./tsconfig.json covers packages/*, apps/showcase has its own) and a
					// single fixed \`project\` path leaves every other project's files unparseable
					// with type info ("TSConfig does not include this file").
					projectService: true,
					tsconfigRootDir: __dirname,
				},
			},
			rules: {
				// Prettier — reads options from .formatter/.prettierrc.cjs
				'prettier/prettier': ['error', prettierOptions],

				// Code quality
				'max-len': [
					'error',
					{
						code: ${maxLineLength},
						ignoreUrls: true,
						ignoreStrings: true,
						ignoreTemplateLiterals: true,
						ignoreComments: true,
					},
				],
				'no-console': '${noConsole}',
				'no-debugger': '${noDebugger}',
				'prefer-const': '${preferConst}',
				'no-var': '${noVar}',
				eqeqeq: ['${eqeqeq}', 'always'],
				curly: ['error', 'all'],

				// React
				'react/jsx-uses-react': 'off',
				'react/react-in-jsx-scope': 'off',
				'react/prop-types': 'off',
				'react/jsx-key': 'error',
				'react/jsx-no-duplicate-props': 'error',
				'react/jsx-no-undef': 'error',
				'react/jsx-no-target-blank': '${reactJsxNoTargetBlank}',
				'react/no-unused-state': 'warn',
				'react/self-closing-comp': 'error',
				'react/no-unescaped-entities': '${reactNoUnescapedEntities}',

				// React Hooks
				'react-hooks/rules-of-hooks': 'error',
				'react-hooks/exhaustive-deps': '${reactHooksExhaustiveDeps}',

				// React Compiler rules (react-hooks v7) — project does not use React Compiler
				'react-hooks/immutability': 'off',
				'react-hooks/set-state-in-effect': 'off',
				'react-hooks/refs': 'off',
				'react-hooks/preserve-manual-memoization': 'off',

				// Import
				'no-duplicate-imports': 'error',
				'import/no-unresolved': 'off',

				// Next.js
				'@next/next/no-html-link-for-pages': 'error',
				'@next/next/no-img-element': 'warn',

				// Best practices
				'no-eval': 'error',
				'no-implied-eval': 'error',
				'no-new-func': 'error',
				'no-script-url': 'error',
				'no-alert': 'warn',
				'object-shorthand': 'error',
				'prefer-template': 'error',

				// Filename casing (sapan H2-B convention): kebab-case for utility/helper files,
				// but also allow PascalCase (component files matching their component name,
				// e.g. StackingCards/StackingCards.tsx) and camelCase (hook files, e.g. useMacy.ts)
				// — both are standard React conventions already used consistently across this codebase.
				'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true, camelCase: true } }],

				// Tailwind diagnostics — parity with bradlc.vscode-tailwindcss IDE flags
				// suggestCanonicalClasses (autofixable): three sub-cases
				//   1a — !utility → utility! position fix
				'better-tailwindcss/enforce-consistent-important-position': ['error', tailwindClassOptions],
				//   1b — v3 aliases (flex-shrink, bg-gradient-to-*, *-opacity-N, etc.)
				'better-tailwindcss/no-deprecated-classes': ['error', tailwindClassOptions],
				//   1c — arbitrary-property hints + shorthand merges (h-full w-full → size-full, bg-[size:..] → bg-size-[..], etc.)
				'better-tailwindcss/enforce-canonical-classes': ['error', tailwindClassOptions],
				// cssConflict (report-only — intent inference required): duplicate-property utilities in one className
				'better-tailwindcss/no-conflicting-classes': ['warn', tailwindClassOptions],

				// Disable conflicting prettier rules
				...prettierConfig.rules,
			},
		},

		// CLI binaries and build tooling — console output is required for terminal user interfaces
		{
			files: [
				'packages/cli/**/*.ts',
				'packages/create-exhuma/**/*.ts',
				'tooling/**/*.ts',
			],
			rules: {
				'no-console': 'off',
			},
		},

		// JS files — no typed linting
		{
			files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
			plugins: { prettier: prettierPlugin },
			rules: {
				'prettier/prettier': ['error'],
				'no-console': '${noConsole}',
				'prefer-const': '${preferConst}',
				'no-var': '${noVar}',
			},
		},

		{
			files: ['e2e/**/*.ts', 'playwright.config.ts'],
			languageOptions: {
				parser: typescriptParser,
				parserOptions: {
					ecmaVersion: 2022,
					sourceType: 'module',
					project: './tsconfig.e2e.json',
				},
				globals: {
					console: 'readonly',
					process: 'readonly',
				},
			},
			rules: {
				'no-console': 'off',
				'react/jsx-uses-react': 'off',
				'react/react-in-jsx-scope': 'off',
				'react-hooks/rules-of-hooks': 'off',
				'@next/next/no-html-link-for-pages': 'off',
			},
		},

		// Ignores
		{
			ignores: [
				'node_modules/**',
				'.next/**',
				'out/**',
				'build/**',
				'dist/**',
				'**/*.min.js',
				'**/*.min.css',
				'coverage/**',
				'.cache/**',
				'public/**',
				'src/types/graphql/**',
			],
		},
	];
})();`;
};

// Generate EditorConfig
const generateEditorConfig = (config) => {
	// Helper function to get config value with fallback
	const getConfigValue = (key, fallback) => config[key] !== undefined ? config[key] : fallback;

	const indentStyle = getConfigValue('INDENT_STYLE', 'space');
	const indentSize = getConfigValue('INDENT_SIZE', '2');
	const printWidth = getConfigValue('PRINT_WIDTH', '80');

	return `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
indent_style = ${indentStyle}
indent_size = ${indentSize}
max_line_length = ${printWidth}

[*.{css,scss,less,json,jsonc}]
indent_style = ${indentStyle}
indent_size = ${indentSize}

[*.{yml,yaml,md,mdx}]
indent_style = space
indent_size = 2

[package.json]
indent_style = space
indent_size = 2`;
};

// Generate VS Code settings
const generateVSCodeSettings = (config) => {
	// Helper function to get config value with fallback
	const getConfigValue = (key, fallback) => config[key] !== undefined ? config[key] : fallback;

	const useTabs = getConfigValue('INDENT_STYLE', 'space') === 'tab';
	const tabWidth = parseInt(getConfigValue('INDENT_SIZE', '2')) || 2;
	const printWidth = parseInt(getConfigValue('PRINT_WIDTH', '80')) || 80;
	const wordWrapColumn = parseInt(getConfigValue('WORD_WRAP_COLUMN', printWidth.toString())) || printWidth;

	const formatOnSave = getConfigValue('FORMAT_ON_SAVE', 'false') === 'true';
	const formatOnPaste = getConfigValue('FORMAT_ON_PASTE', 'false') === 'true';
	const eslintAutoFix = getConfigValue('ESLINT_AUTO_FIX', 'true') === 'true';
	const insertFinalNewline = getConfigValue('INSERT_FINAL_NEWLINE', 'true') === 'true';
	const trimTrailingWhitespace = getConfigValue('TRIM_TRAILING_WHITESPACE', 'true') === 'true';
	const wordWrap = getConfigValue('WORD_WRAP', 'off');

	// Import organization settings
	const organizeImportsOnSave = getConfigValue('ORGANIZE_IMPORTS_ON_SAVE', 'false') === 'true';
	const removeUnusedImportsOnFormat = getConfigValue('REMOVE_UNUSED_IMPORTS_ON_FORMAT', 'true') === 'true';

	const settings = {
		// Workbench
		'workbench.activityBar.orientation': 'vertical',
		'workbench.editor.enablePreview': false,

		// Editor behavior
		'editor.insertSpaces': !useTabs,
		'editor.tabSize': tabWidth,
		'editor.detectIndentation': false,
		'editor.wordWrap': wordWrap,
		'editor.wordWrapColumn': wordWrapColumn,
		'editor.rulers': [printWidth],
		'editor.formatOnSave': formatOnSave,
		'editor.formatOnPaste': formatOnPaste,
		'editor.trimAutoWhitespace': true,
		'editor.renderWhitespace': 'boundary',
		'editor.minimap.maxColumn': wordWrapColumn,

		// Code actions
		'editor.codeActionsOnSave': {
			'source.fixAll.eslint': eslintAutoFix ? 'explicit' : 'never',
			'source.organizeImports': organizeImportsOnSave ? 'explicit' : 'never',
		},

		// Files
		'files.eol': '\n',
		'files.insertFinalNewline': insertFinalNewline,
		'files.trimTrailingWhitespace': trimTrailingWhitespace,
		'files.trimFinalNewlines': true,
		'files.autoSave': 'onFocusChange',

		// Prettier
		'prettier.requireConfig': true,
		'prettier.useEditorConfig': false,

		// ESLint
		'eslint.enable': true,
		'eslint.run': 'onSave',
		'eslint.format.enable': true,

		// TypeScript import organization
		'typescript.preferences.organizeImports': {
			'removeUnusedImports': removeUnusedImportsOnFormat,
		},
		'typescript.suggest.autoImports': 'on',
		'typescript.updateImportsOnFileMove.enabled': 'always',

		// Command palette actions for manual formatting with unused import removal
		'typescript.preferences.includePackageJsonAutoImports': 'auto',

		// Enable format and organize imports together
		'editor.formatOnSaveMode': 'file',

		// Language-specific formatters
		'[javascript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[javascriptreact]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[typescript]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[typescriptreact]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[css]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[scss]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[json]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[markdown]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },
		'[yaml]': { 'editor.defaultFormatter': 'esbenp.prettier-vscode' },

		// Search exclusions
		'search.exclude': {
			'**/node_modules': true,
			'**/build': true,
			'**/dist': true,
			'**/*.min.js': true,
			'**/vendor': true,
			'**/wp-content/uploads': true,
		},

		// File associations
		'files.associations': {
			'*.jsx': 'javascriptreact',
			'*.tsx': 'typescriptreact',
		},

		// Git
		'git.enableSmartCommit': true,
		'git.confirmSync': false,

		// Emmet
		'emmet.includeLanguages': {
			javascript: 'javascriptreact',
			typescript: 'typescriptreact',
		},

		// Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
		'tailwindCSS.experimental.configFile': 'src/styles/global.scss',
		'tailwindCSS.includeLanguages': {
			scss: 'css',
		},
		'tailwindCSS.classFunctions': ['cn', 'cva', 'tv', 'clsx'],
		'tailwindCSS.classAttributes': ['class', 'className', 'ngClass', 'class:list'],

		// Silence the built-in CSS/SCSS linter on Tailwind v4 directives (@theme, @apply, @source, @variant, @reference, @utility, etc.) — the Tailwind IntelliSense extension validates them with full v4 awareness.
		'css.lint.unknownAtRules': 'ignore',
		'scss.lint.unknownAtRules': 'ignore',
	};

	return JSON.stringify(settings, null, '\t');
};

// Generate VSCode tasks for integrated formatting
const generateVSCodeTasks = () => {
	const tasks = {
		"version": "2.0.0",
		"tasks": [
			{
				"label": "Format and Organize",
				"type": "shell",
				"command": "node",
				"args": ["-e", `
					const { execSync } = require('child_process');
					const fs = require('fs');
					const path = require('path');
					const ts = require('typescript');

					const filePath = process.argv[1];
					if (!filePath || !fs.existsSync(filePath)) process.exit(0);

					// Step 1: Organize imports for TS/JS files FIRST
					if (/\\.(ts|tsx|js|jsx)$/.test(filePath)) {
						const sourceText = fs.readFileSync(filePath, 'utf8');
						const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
						const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
						const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));

						const host = {
							getScriptFileNames: () => [filePath],
							getScriptVersion: () => '1',
							getScriptSnapshot: (fileName) => fileName === filePath ? ts.ScriptSnapshot.fromString(sourceText) : undefined,
							getCurrentDirectory: () => process.cwd(),
							getCompilationSettings: () => compilerOptions.options,
							getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
							fileExists: ts.sys.fileExists,
							readFile: ts.sys.readFile,
							readDirectory: ts.sys.readDirectory,
							getDirectories: ts.sys.getDirectories,
						};

						const service = ts.createLanguageService(host);
						const changes = service.organizeImports({ type: 'file', fileName: filePath }, { removeUnusedImports: true, coalesceImports: true }, {});

						if (changes && changes.length > 0) {
							let newText = sourceText;
							for (let i = changes.length - 1; i >= 0; i--) {
								const change = changes[i];
								for (let j = change.textChanges.length - 1; j >= 0; j--) {
									const textChange = change.textChanges[j];
									newText = newText.substring(0, textChange.span.start) + textChange.newText + newText.substring(textChange.span.start + textChange.span.length);
								}
							}
							if (newText !== sourceText) fs.writeFileSync(filePath, newText);
						}
					}

					// Step 2: Format with Prettier AFTER import organization
					execSync(\`npx prettier --config .formatter/.prettierrc.cjs --write "\${filePath}"\`, { stdio: 'pipe' });
				`, "${file}"],
				"group": "build",
				"presentation": {
					"echo": false,
					"reveal": "never",
					"focus": false,
					"panel": "shared",
					"showReuseMessage": false,
					"clear": false
				},
				"problemMatcher": []
			}
		]
	};

	return JSON.stringify(tasks, null, '\t');
};

// Generate VSCode keybindings that use the built-in format command
const generateVSCodeKeybindings = () => {
	const keybindings = [
		{
			"key": "shift+alt+f",
			"command": "editor.action.formatDocument",
			"when": "editorTextFocus && !editorReadonly"
		}
	];

	return JSON.stringify(keybindings, null, '\t');
};




// Generate .gitattributes for consistent line endings
const generateGitAttributes = () => {
	return `# Generated from FORMATTER_CONFIG.md
# Ensure consistent line endings

# Text files
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary`;
};

// Main sync function
const sync = () => {
	console.log('🚀 Syncing from FORMATTER_CONFIG.md...');

	// Check dependencies first
	if (!checkDependencies()) {
		console.log('❌ Dependency check failed. Please install missing packages.');
		process.exit(1);
	}

	const config = readConfig();

	// Validate safety settings
	if (!validateSafety(config)) {
		console.log('❌ Safety validation failed. Please check FORMATTER_CONFIG.md');
		process.exit(1);
	}

	// Generate config files
	const prettierConfig = generatePrettierConfig(config);
	const eslintConfig = generateESLintConfig(config);
	const editorConfig = generateEditorConfig(config);
	const prettierIgnore = generatePrettierIgnore();
	const gitAttributes = generateGitAttributes();
	const vscodeSettings = generateVSCodeSettings(config);
	const vscodeTasks = generateVSCodeTasks();
	const vscodeKeybindings = generateVSCodeKeybindings();

	// Write all files with error handling
	const files = [
		{ path: '.formatter/.prettierrc.cjs', content: prettierConfig },
		{ path: 'eslint.config.cjs', content: eslintConfig },
		{ path: '.formatter/.editorconfig', content: editorConfig },
		{ path: '.prettierrc.cjs', content: `// Prettier configuration that extends .formatter/.prettierrc.cjs\n// This allows Prettier to work from the project root while keeping\n// the actual configuration in .formatter/ directory\n\nmodule.exports = require('./.formatter/.prettierrc.cjs');\n` },
		{ path: '.prettierignore', content: prettierIgnore },
		{ path: '.gitattributes', content: gitAttributes },
		{ path: '.vscode/settings.json', content: vscodeSettings },
		{ path: '.vscode/tasks.json', content: vscodeTasks },
		{ path: '.vscode/keybindings.json', content: vscodeKeybindings },
	];

	let successCount = 0;
	files.forEach(({ path, content }) => {
		if (safeWriteFile(path, content)) {
			successCount++;
		}
	});

	if (successCount === files.length) {
		console.log(`📋 Settings: ${config.PRINT_WIDTH} width, ${config.INDENT_STYLE}(${config.INDENT_SIZE}), ${config.USE_SINGLE_QUOTES === 'true' ? 'single' : 'double'} quotes`);
		console.log('✅ Updated: .formatter/.prettierrc.cjs, eslint.config.cjs (flat config), IDE settings');
		console.log('🎯 Target: src folder only');
		console.log('🛡️ File Safety: Enabled - No files will be deleted');
		console.log('💡 Commands: pnpm run format | pnpm run lint:fix | pnpm run format:all');
		console.log('📁 Architecture: Simplified single-location (.formatter/ only) with integrated validation');
	} else {
		console.log(`⚠️  Warning: ${files.length - successCount} files failed to write`);
		process.exit(1);
	}
};

// Organize imports functionality
const organizeImports = () => {
	console.log('🔄 Organizing imports and removing unused ones...');

	const srcDir = path.join(process.cwd(), 'src');
	if (!fs.existsSync(srcDir)) {
		console.error('❌ src directory not found');
		process.exit(1);
	}

	// Find all TypeScript files in src
	const findTsFiles = (dir) => {
		const files = [];
		const items = fs.readdirSync(dir);
		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				files.push(...findTsFiles(fullPath));
			} else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
				files.push(fullPath);
			}
		}
		return files;
	};

	const files = findTsFiles(srcDir);
	console.log(`📄 Processing ${files.length} TypeScript files...`);

	let processedCount = 0;

	// Process each file
	for (const filePath of files) {
		try {
			const ts = require('typescript');
			const sourceText = fs.readFileSync(filePath, 'utf8');

			// Read tsconfig.json
			const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
			const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
			const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));

			// Create language service host
			const host = {
				getScriptFileNames: () => [filePath],
				getScriptVersion: () => '1',
				getScriptSnapshot: (fileName) => {
					if (fileName === filePath) {
						return ts.ScriptSnapshot.fromString(sourceText);
					}
					return undefined;
				},
				getCurrentDirectory: () => process.cwd(),
				getCompilationSettings: () => compilerOptions.options,
				getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
				fileExists: ts.sys.fileExists,
				readFile: ts.sys.readFile,
				readDirectory: ts.sys.readDirectory,
				getDirectories: ts.sys.getDirectories,
			};

			// Create language service
			const service = ts.createLanguageService(host);

			// Organize imports
			const changes = service.organizeImports(
				{ type: 'file', fileName: filePath },
				{ removeUnusedImports: true, coalesceImports: true },
				{}
			);

			if (changes && changes.length > 0) {
				let newText = sourceText;
				// Apply changes in reverse order to maintain positions
				for (let i = changes.length - 1; i >= 0; i--) {
					const change = changes[i];
					for (let j = change.textChanges.length - 1; j >= 0; j--) {
						const textChange = change.textChanges[j];
						newText = newText.substring(0, textChange.span.start) +
								 textChange.newText +
								 newText.substring(textChange.span.start + textChange.span.length);
					}
				}

				if (newText !== sourceText) {
					fs.writeFileSync(filePath, newText);
					console.log(`✅ ${filePath}`);
					processedCount++;
				}
			}
		} catch (error) {
			console.warn(`⚠️  ${filePath}: ${error.message}`);
		}
	}

	console.log(`🎯 Organized imports in ${processedCount} files`);
};

// Handle command line arguments
if (require.main === module) {
	const args = process.argv.slice(2);
	if (args.includes('--organize-imports')) {
		organizeImports();
	} else {
		sync();
	}
}

module.exports = { sync, organizeImports };
