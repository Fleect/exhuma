# Exhuma CLI

Universal Component CLI — Add tactile, headless components to any project across **13 frontend ecosystems**.

```bash
npx exhuma init
npx exhuma add stacking-cards --flavor=svelte
```

## Supported Ecosystems

- React (`.tsx`)
- Next.js 15 (`.tsx`)
- Vue.js 3 / Nuxt (`.vue`)
- Svelte 5 / SvelteKit (`.svelte`)
- Angular 18+ (`.ts`)
- SolidJS (`.tsx`)
- Astro (`.astro`)
- Laravel Blade (`.blade.php`)
- Vanilla JS & Scoped CSS (`.js` + `.css`)
- WordPress Gutenberg (`block.json`, `edit.tsx`, `save.tsx`, `.php`)
- Universal Web Component (`<exhuma-*>`)
- React Native / Expo (`.tsx`)
- Flutter (`.dart`)

## Commands

### `init`

Initializes `exhuma.json` configuration in your project:

```bash
npx exhuma init
```

### `add <components...>`

Adds one or more components directly into your codebase:

```bash
npx exhuma add stacking-cards
npx exhuma add horizontal-scroller tilt-card --flavor=svelte
npx exhuma add --all
```

### `list`

Lists all available canonical components and categories:

```bash
npx exhuma list
```

## License

MIT
