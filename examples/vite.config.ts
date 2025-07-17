import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files (for local development)
  const env = loadEnv(mode, process.cwd(), '')
  
  // Helper function to get env var from either .env files or system env (for fly.io)
  const getEnvVar = (name: string): string => {
    return env[name] || process.env[name] || '';
  }
  
  return {
    plugins: [react()],
    server: {
      port: 3005,
      open: true
    },
    define: {
      global: 'globalThis',
      // Explicitly define environment variables - check both .env files and system env
      'process.env.REACT_APP_SENDER_ADDRESS': JSON.stringify(getEnvVar('REACT_APP_SENDER_ADDRESS')),
      'process.env.REACT_APP_SENDER_PRIVATE_KEY': JSON.stringify(getEnvVar('REACT_APP_SENDER_PRIVATE_KEY')),
      'process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS': JSON.stringify(getEnvVar('REACT_APP_TOKEN_CONTRACT_ADDRESS')),
      'process.env.REACT_APP_NETWORK': JSON.stringify(getEnvVar('REACT_APP_NETWORK')),
      'process.env.REACT_APP_RPC_URL': JSON.stringify(getEnvVar('REACT_APP_RPC_URL')),
      'process.env.REACT_APP_REOWN_PROJECT_ID': JSON.stringify(getEnvVar('REACT_APP_REOWN_PROJECT_ID')),
    },
    resolve: {
      alias: {
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util'
      },
    },
    optimizeDeps: {
      include: ['buffer', 'process', 'util', 'ethers'],
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
  }
}) 