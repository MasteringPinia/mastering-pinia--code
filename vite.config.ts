// /// <reference types="vitest" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-vue-markdown'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      pathParser: {
        // waiting for https://github.com/vitejs/vite/pull/2634
        dotNesting: true,
      },
      logs: false,
      extensions: ['.vue', '.md'],
      routesFolder: [
        {
          src: './src/exercises',
          filePatterns: '*/index',
          exclude: ['*/_start'],
        },
        {
          src: './src/views',
        },
      ],

      extendRoute(route) {
        if (route.isPassThrough) return
        // extend exercises routes with exerciseData
        const filepath = route.components.get('default')
        if (filepath?.includes('exercises/')) {
          route.addToMeta({
            exerciseData: {
              filepath,
              dirname: filepath.replace(/^.*\/(.*?)\/index\.vue$/, '$1'),
              instructions: filepath.replace('index.vue', 'instructions.md'),
            },
          })
        }
      },
    }),
    Components({
      types: [
        {
          from: 'vue-router/auto',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      globs: ['src/exercises/*/.internal/**/*.vue'],
    }),
    Vue({ include: [/\.vue$/, /\.md$/] }),
    // could be used to display instructions within the page
    Markdown({
      markdownItOptions: {
        typographer: false,
      },
    }),
  ],

  define: {
    // pass false to disable the use of vue options api (negligible smaller bundle size)
    __VUE_OPTIONS_API__: JSON.stringify(true),
    // pass true to enable devtools in production build
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  },

  resolve: {
    alias: {
      // allows import ... from '@/components/...'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ex': fileURLToPath(new URL('./src/exercises', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },

  optimizeDeps: {
    exclude: [
      // needed when we use vue-demi based libraries
      // 'vue-demi',
      // '@vueuse/shared',
      // '@vueuse/core',
      // 'pinia',
    ],
  },

  // config for vitest
  // test: {
  //   // enable it, describe, and other globals so we don't need to import them from vitest
  //   environment: 'happy-dom',
  //   coverage: {
  //     exclude: ['**/*.{spec,test}.*'],
  //   },
  //   globals: true,
  //   include: ['./src/exercises/00-testing-*/*.{spec,test}.{js,ts}'],
  // },
})
