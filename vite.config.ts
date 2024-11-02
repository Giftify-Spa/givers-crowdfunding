import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.fintoc.com/v1', // URL base de la API de Fintoc
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Opcional, elimina el prefijo '/api'
        secure: true, // Activa solo si la API usa HTTPS
      },
    },
  },
});
