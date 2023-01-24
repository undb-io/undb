import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  server: {
    port: 8080,
    host: true
  }
});