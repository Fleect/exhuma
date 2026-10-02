const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		'@fleect/exhuma',
		'@fleect/exhuma-cards',
		'@fleect/exhuma-layouts',
		'@fleect/exhuma-router',
		'@fleect/exhuma-registry',
	],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@fleect/exhuma-registry/schema': path.resolve(__dirname, '../../packages/registry/src/schema.ts'),
			'@fleect/exhuma-registry': path.resolve(__dirname, '../../packages/registry/src/index.ts'),
			'@fleect/exhuma-cards': path.resolve(__dirname, '../../packages/cards/src/index.ts'),
			'@fleect/exhuma': path.resolve(__dirname, '../../packages/core/src/index.ts'),
			'@fleect/exhuma-layouts': path.resolve(__dirname, '../../packages/layouts/src/index.ts'),
			'@fleect/exhuma-router': path.resolve(__dirname, '../../packages/router/src/index.ts'),
		};
		return config;
	},
};

module.exports = nextConfig;
