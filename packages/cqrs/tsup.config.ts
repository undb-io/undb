import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.d.{ts,tsx}'],
  outDir: 'dist',
  splitting: true,
  sourcemap: true,
  dts: 'src/index.ts',
  format: 'esm',
  bundle: false,
})
