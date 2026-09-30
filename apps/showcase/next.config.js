const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@exhuma/cards', '@exhuma/layouts', '@exhuma/router', '@exhuma/core', '@exhuma/registry'],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@exhuma/registry/schema': path.resolve(__dirname, '../../packages/registry/src/schema.ts'),
			'@exhuma/registry': path.resolve(__dirname, '../../packages/registry/src/index.ts'),
			'@exhuma/cards': path.resolve(__dirname, '../../packages/cards/src/index.ts'),
			'@exhuma/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
			'@exhuma/layouts': path.resolve(__dirname, '../../packages/layouts/src/index.ts'),
			'@exhuma/router': path.resolve(__dirname, '../../packages/router/src/index.ts'),
		};
		return config;
	},
};

module.exports = nextConfig;
