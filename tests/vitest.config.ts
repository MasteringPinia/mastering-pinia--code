import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../vite.config'

// extract everything but test to avoid conflicts with exercises
const {
  // the test is used for some exercises
  test: __test,
  // the ssr option creates injection issues in tests
  ssr: __ssr,
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
        port: 51205,
        strictPort: true,
      },
    },
  }),
)
