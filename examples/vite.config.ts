import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
    open: true
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
      '@safe-global/safe-apps-provider': path.resolve(__dirname, 'node_modules/@safe-global/safe-apps-provider')
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
    exclude: ['@safe-global/safe-apps-provider'],
  },
  build: {
    rollupOptions: {
      external: ['@safe-global/safe-apps-provider'],
      output: {
        globals: {
          '@safe-global/safe-apps-provider': 'SafeAppsProvider'
        }
      }
    }
  }
}) 