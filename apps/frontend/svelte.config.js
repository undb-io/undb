import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	env: {
		publicPrefix: 'PUBLIC_UNDB_',
	},
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true,
		}),
	],

	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
	},
}

export default config
