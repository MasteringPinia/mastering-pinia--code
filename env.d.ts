/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMGFLIP_USER: string
  readonly VITE_IMGFLIP_PASSWORD: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_REVIEW_MODE_WARNING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
