import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		open: true,
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://0.0.0.0:4000',
				changeOrigin: true,
			},
			'/public': {
				target: 'http://0.0.0.0:4000',
				changeOrigin: true,
			},
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
