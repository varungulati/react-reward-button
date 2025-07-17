/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENDER_ADDRESS: string
  readonly VITE_SENDER_PRIVATE_KEY: string
  readonly VITE_TOKEN_CONTRACT_ADDRESS: string
  readonly VITE_NETWORK: string
  readonly VITE_RPC_URL: string
  readonly VITE_REOWN_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 