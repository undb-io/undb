import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  outDir: 'dist',
  splitting: true,
  sourcemap: true,
  dts: true,
  target: ['es2022'],
  format: 'esm',
})
