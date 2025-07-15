import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    open: true
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util'
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'util'],
    exclude: ['stream']
  },
  build: {
    rollupOptions: {
      external: [
        '@safe-globalThis/safe-apps-sdk',
        '@safe-global/safe-apps-sdk',
        '@safe-globalThis/safe-apps-provider',
        '@safe-global/safe-apps-provider',
        /^@safe-global\/.*/,
        /^@safe-globalThis\/.*/
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@tanstack/react-query']
        }
      }
    }
  }
}) 