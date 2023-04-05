import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:4000',
        changeOrigin: true,
      },
      '/public': {
        target: 'http://0.0.0.0:4000',
        changeOrigin: true,
      },
    },
  },
})
