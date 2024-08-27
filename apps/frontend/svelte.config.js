import adapter from "@sveltejs/adapter-static"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: "dist",
      fallback: "index.html",
    }),
    env: {
      publicPrefix: "UNDB_PUBLIC_",
    },
    alias: {
      $houdini: "./$houdini",
    },
  },
}

export default config
