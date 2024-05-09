import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		visualizer({
			emitFile: true,
			filename: 'stats.html',
			gzipSize: true
		})
	],

	server: {
		host: '0.0.0.0',
		port: 3000,
		proxy: {
			'/trpc': {
				target: 'http://0.0.0.0:4000',
				changeOrigin: true
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
