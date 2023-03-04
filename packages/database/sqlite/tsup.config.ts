import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.stories.{ts,tsx}', '!src/**/*.d.{ts,tsx}'],
  bundle: false,
  outDir: 'dist',
  splitting: true,
  sourcemap: true,
  dts: true,
  target: ['es2022'],
  format: 'esm',
})
