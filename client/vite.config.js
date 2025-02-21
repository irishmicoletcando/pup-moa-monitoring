import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  build: {
    rollupOptions: {
      external: [
        'axios', 
        'jszip',
        'file-saver',
        '@azure/storage-blob',
        'jwt-decode',
        'react-pdf',
        'xlsx'
      ],
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})