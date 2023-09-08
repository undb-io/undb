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
		alias: {
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components',
		},
	},
	shadcn: {
		componentePath: './src/lib/components/ui',
	},
}

export default config
