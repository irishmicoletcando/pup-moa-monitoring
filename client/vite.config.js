import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './',
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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
    }
  }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
