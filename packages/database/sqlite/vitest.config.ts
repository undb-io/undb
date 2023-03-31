import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    format: 'esm',
  },
  test: {
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    hookTimeout: 30000,
  },
})
