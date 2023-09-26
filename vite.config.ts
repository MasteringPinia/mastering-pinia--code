// /// <reference types="vitest" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'

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
          src: './src/exercises',
          filePatterns: ['*/pages/**', '*/.internal/pages/**'],
          path: file => {
            const prefix = 'src/exercises/'
            return file
              .slice(file.lastIndexOf(prefix) + prefix.length)
              .replace('/.internal', '')
              .replace('/pages', '')
          },
        },
        {
          src: './src/views',
        },
      ],

      extendRoute(route) {
        if (route.isPassThrough) return
        // extend exercises routes with exerciseData
        const filepath = route.components.get('default')
        // if (filepath && /exercises\/[^/]+\/index\.vue$/i.test(filepath)) {
        if (filepath?.includes('/exercises/')) {
          // this allows us to link subpages to the exercise
          const isIndex = /\/exercises\/([^/]+?)\/index\.vue$/i.test(filepath)
          const index = filepath.replace(/\/exercises\/([^/]+?)\/.*$/i, '/exercises/$1/index.vue')
          route.addToMeta({
            exerciseData: {
              filepath,
              dirname: index.replace(/^.*\/(.*?)\/index\.vue$/, '$1'),
              instructions: index.replace('index.vue', 'instructions.md'),
              index: isIndex
                ? null
                : index
                    .slice(index.lastIndexOf('/exercises') + '/exercises'.length)
                    // remove the index.vue from the end
                    .slice(0, -'index.vue'.length),
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
      globs: ['src/exercises/*/.internal/components/*.vue'],
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
  //   environment: 'happy-dom',
  //   coverage: {
  //     exclude: ['**/*.{spec,test}.*'],
  //   },
  //   // when set to true, it globally enables `describe`, `it`, and other globals
  //   globals: false,
  //   include: ['./src/exercises/*-testing-*/*.{spec,test}.{js,ts}'],
  // },
})
