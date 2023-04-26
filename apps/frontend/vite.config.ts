import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 3000,
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
	ssr: {
		external: ['@undb/core', '@revolist/revogrid'],
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
})
