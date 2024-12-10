import { sveltekit } from "@sveltejs/kit/vite"
import houdini from "houdini/vite"
import { visualizer } from "rollup-plugin-visualizer"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    houdini(),
    sveltekit(),
    nodePolyfills({
      include: ["assert"],
      globals: {
        process: true,
      },
    }),
    visualizer({
      emitFile: true,
      filename: "stats.html",
      gzipSize: true,
    }),
  ],

  ssr: {
    external: ["reflect-metadata"],
  },

  server: {
    host: "0.0.0.0",
    port: 3721,
    proxy: {
      "/api": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/public": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/assets": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/openapi": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/trpc": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/login/github": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/login/google": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/graphql": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
      "/invitation": {
        target: "http://0.0.0.0:4728",
        changeOrigin: true,
      },
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
  build: {
    target: "es2022",
  },
  clearScreen: false,
  esbuild: {
    target: "es2022",
  },
})
