import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  splitting: true,
  sourcemap: true,
  dts: 'src/index.ts',
  treeshake: true,
  format: 'esm',
  minify: true,
})
