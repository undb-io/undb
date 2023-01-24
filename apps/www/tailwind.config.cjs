/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {},
    extend: {
      height: {
        72: '72px',
      },
    },
  },
  plugins: [],
}
