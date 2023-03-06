import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import baseConfig from '../vite.config'

// extract everything but test to avoid conflicts with exercises
const {
  // @ts-ignore:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test,
  ...viteConfig
} = baseConfig

export default mergeConfig(
  viteConfig,

  defineConfig({
    // clearScreen: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },

    test: {
      reporters: ['dot'],
      include: ['src/exercises/*/.internal/**/*.spec.ts'],
      environment: 'happy-dom',
      testTimeout: 5000,
      setupFiles: ['tests/envSetup.ts'],
      open: false,
      api: {
        // default port
        port: 51204,
        strictPort: true,
      },
    },
  }),
)
