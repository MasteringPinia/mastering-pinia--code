import { readonly, reactive } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export enum SettingInputType {
  invalid = 0,
  select,
}

export type SettingInputTypeDefinitionSelect = readonly string[]
export type SettingInputTypeDefinition =
  | readonly string[]
  | {
      type: SettingInputType
    }

export function createSettingsManager<
  S extends Record<string, any>,
  I extends Partial<Record<keyof S, SettingInputTypeDefinition>>,
>(
  initialSettings: S,
  inputTypes: I,
  prefix = 'posva:mastering-pinia-course',
): S & {
  readonly $initial: Readonly<S>
  $reset(): void
} {
  const getKey = (key: string) => `${prefix}:${key}`

  const settings = reactive(
    Object.keys(initialSettings).reduce((settings, key) => {
      settings[key as keyof S] = useLocalStorage(getKey(key), initialSettings[key])
      return settings
    }, {} as any),
  )

  Object.defineProperty(settings, '$initial', {
    value: readonly(initialSettings),
  })

  Object.defineProperty(settings, '$reset', {
    value: () => Object.assign(settings, initialSettings),
  })

  return settings
}

export const $settings =
  // only create the settings manager in the browser to avoid leaks
  typeof window !== 'undefined'
    ? createSettingsManager(
        {
          showTips: true,
          clearOnTestRun: false,
          hideWelcomeMessage: false,
          testRunnerPosition: 'bottom-left' as `${'bottom' | 'top'}-${'right' | 'left'}`,
        },
        {
          testRunnerPosition: ['bottom-left', 'bottom-right', 'top-left', 'top-right'] as const,
        },
      )
    : null

declare global {
  export interface Window {
    $settings: typeof $settings
    hardMode(): void
  }
}

/**
 * Returns a Capitalized string split in words.
 *
 * @example
 * ```js
 * convertToTitle('showTips') // 'Show Tips'
 * ```
 *
 * @param str camelCase string
 * @returns a Capitalized string with spaces
 */
export function convertToTitle(str: string): string {
  const split = str.replace(/([a-z])([A-Z])/g, '$1 $2')
  return split.slice(0, 1).toUpperCase() + split.slice(1)
}

export function inferInputType(definition: SettingInputTypeDefinition): SettingInputType {
  if (Array.isArray(definition)) {
    return SettingInputType.select
  }

  return SettingInputType.invalid
}
