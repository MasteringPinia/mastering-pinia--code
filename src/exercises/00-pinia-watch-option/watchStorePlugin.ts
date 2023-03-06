import { defineStore, PiniaPlugin, StoreGetters, StoreActions } from 'pinia'
import { watch, WatchOptions } from 'vue'
import { Contact, getContactById } from '~/api/contacts'

export const watchOptionPlugin: PiniaPlugin = ({ store, options }) => {
  if (options.watch) {
    Object.keys(options.watch).forEach(key => {
      const optionValue = options.watch![key]
      // just for type safety really
      if (!optionValue) return

      const { action, ...watchOptions } = typeof optionValue === 'string' ? { action: optionValue } : optionValue

      watch(
        () => store[key],
        () => {
          store[action]()
        },
        watchOptions,
      )
    })
  }
}

declare module 'pinia' {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  export interface DefineStoreOptions<Id, S, G, A> {
    /**
     * Watch a state or getter property and call an action when it changes.
     */
    watch?: Partial<
      Record<
        Extract<keyof S | keyof G, string>,
        ({ action: Extract<keyof A, string> } & WatchOptions) | Extract<keyof A, string>
      >
    >
  }

  // this works on all stores
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Watch a state or getter property and call an action when it changes.
     */
    watchAll?: Partial<
      Record<
        Extract<keyof S | keyof StoreGetters<Store>, string>,
        | ({ action: Extract<keyof StoreActions<Store>, string> } & WatchOptions)
        | Extract<keyof StoreActions<Store>, string>
      >
    >
  }
  /* eslint-enable */
}

// example to test

export const useCurrentContact = defineStore('currentContact', {
  state: () => ({
    id: 0,
    current: null as Contact | null,
  }),

  getters: {
    forDemo: state => state.id,
  },

  actions: {
    async refreshContact() {
      this.current = await getContactById(this.id)
    },
  },

  watch: {
    // forDemo: 'refreshContact',
    // this will error if we activate https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes
    // current: undefined,
    // id: 'refreshContact',
    id: { action: 'refreshContact', immediate: true },
  },

  // watchAll: {
  //   id: { action: 'refreshContact' },
  // },
})

// to add defaults options create a factory

export function PiniaWatchOption(watchOptions: WatchOptions = {}): PiniaPlugin {
  return ({ store, options }) => {
    if (options.watch) {
      Object.keys(options.watch).forEach(key => {
        const optionValue = options.watch![key]
        // just for type safety really
        if (!optionValue) return

        const { action, ...localWatchOptions } = typeof optionValue === 'string' ? { action: optionValue } : optionValue

        watch(
          () => store[key],
          () => {
            store[action]()
          },
          { ...watchOptions, ...localWatchOptions },
        )
      })
    }
  }
}
