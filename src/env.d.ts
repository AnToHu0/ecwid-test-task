/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_ID: string
  readonly VITE_API_TOKEN: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly url: string
} 