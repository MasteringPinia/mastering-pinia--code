/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly VITE_IMGFLIP_USER: string
  readonly VITE_IMGFLIP_PASSWORD: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GIT_CLONE_WARNING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
