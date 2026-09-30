/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'../../packages/*/src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				exhuma: {
					50: '#f4f4f5',
					100: '#e4e4e7',
					200: '#d4d4d8',
					300: '#a1a1aa',
					400: '#71717a',
					500: '#52525b',
					600: '#3f3f46',
					700: '#27272a',
					800: '#18181b',
					900: '#09090b',
					950: '#040405',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
};
