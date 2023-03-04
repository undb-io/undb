import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.stories.{ts,tsx}', '!src/**/*.d.{ts,tsx}'],
  outDir: 'dist',
  splitting: true,
  sourcemap: 'inline',
  dts: 'src/index.ts',
  format: 'esm',
  treeshake: true,
  bundle: false,
})
