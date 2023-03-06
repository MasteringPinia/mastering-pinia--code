// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

/// <reference types="unplugin-vue-router/client" />

import type {
  // type safe route locations
  RouteLocationTypedList,
  RouteLocationResolvedTypedList,
  RouteLocationNormalizedTypedList,
  RouteLocationNormalizedLoadedTypedList,
  RouteLocationAsString,
  RouteLocationAsRelativeTypedList,
  RouteLocationAsPathTypedList,

  // helper types
  // route definitions
  RouteRecordInfo,
  ParamValue,
  ParamValueOneOrMore,
  ParamValueZeroOrMore,
  ParamValueZeroOrOne,

  // vue-router extensions
  _RouterTyped,
  RouterLinkTyped,
  NavigationGuard,
  UseLinkFnTyped,

  // data fetching
  _DataLoader,
  _DefineLoaderOptions,
} from 'unplugin-vue-router'

declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/_internal-test/': RouteRecordInfo<'/_internal-test/', '/_internal-test', Record<never, never>, Record<never, never>>,
    '/_template/': RouteRecordInfo<'/_template/', '/_template', Record<never, never>, Record<never, never>>,
    '/[...pathMatch]': RouteRecordInfo<'/[...pathMatch]', '/:pathMatch(.*)', { pathMatch: ParamValue<true> }, { pathMatch: ParamValue<false> }>,
    '/00-components-pagination/': RouteRecordInfo<'/00-components-pagination/', '/00-components-pagination', Record<never, never>, Record<never, never>>,
    '/00-composable-async-data/': RouteRecordInfo<'/00-composable-async-data/', '/00-composable-async-data', Record<never, never>, Record<never, never>>,
    '/00-composable-getSelection/': RouteRecordInfo<'/00-composable-getSelection/', '/00-composable-getSelection', Record<never, never>, Record<never, never>>,
    '/00-composables-local-storage/': RouteRecordInfo<'/00-composables-local-storage/', '/00-composables-local-storage', Record<never, never>, Record<never, never>>,
    '/00-custom-ref/': RouteRecordInfo<'/00-custom-ref/', '/00-custom-ref', Record<never, never>, Record<never, never>>,
    '/00-implementing-our-own-defineStore/': RouteRecordInfo<'/00-implementing-our-own-defineStore/', '/00-implementing-our-own-defineStore', Record<never, never>, Record<never, never>>,
    '/00-perf-shallow-ref/': RouteRecordInfo<'/00-perf-shallow-ref/', '/00-perf-shallow-ref', Record<never, never>, Record<never, never>>,
    '/00-pinia-error-handling/': RouteRecordInfo<'/00-pinia-error-handling/', '/00-pinia-error-handling', Record<never, never>, Record<never, never>>,
    '/00-pinia-getting-started/': RouteRecordInfo<'/00-pinia-getting-started/', '/00-pinia-getting-started', Record<never, never>, Record<never, never>>,
    '/00-pinia-plugin-persist-plugin/': RouteRecordInfo<'/00-pinia-plugin-persist-plugin/', '/00-pinia-plugin-persist-plugin', Record<never, never>, Record<never, never>>,
    '/00-pinia-setup-store/': RouteRecordInfo<'/00-pinia-setup-store/', '/00-pinia-setup-store', Record<never, never>, Record<never, never>>,
    '/00-pinia-using-composables/': RouteRecordInfo<'/00-pinia-using-composables/', '/00-pinia-using-composables', Record<never, never>, Record<never, never>>,
    '/00-pinia-watch-option/': RouteRecordInfo<'/00-pinia-watch-option/', '/00-pinia-watch-option', Record<never, never>, Record<never, never>>,
    '/00-provide-inject-tab-system/': RouteRecordInfo<'/00-provide-inject-tab-system/', '/00-provide-inject-tab-system', Record<never, never>, Record<never, never>>,
    '/00-routing-meta-title/': RouteRecordInfo<'/00-routing-meta-title/', '/00-routing-meta-title', Record<never, never>, Record<never, never>>,
    '/00-search-component/': RouteRecordInfo<'/00-search-component/', '/00-search-component', Record<never, never>, Record<never, never>>,
    '/00-settings/': RouteRecordInfo<'/00-settings/', '/00-settings', Record<never, never>, Record<never, never>>,
    '/00-testing-components/': RouteRecordInfo<'/00-testing-components/', '/00-testing-components', Record<never, never>, Record<never, never>>,
    '/00-todo-list/': RouteRecordInfo<'/00-todo-list/', '/00-todo-list', Record<never, never>, Record<never, never>>,
    '/0x-routing-meta-data-fetching/': RouteRecordInfo<'/0x-routing-meta-data-fetching/', '/0x-routing-meta-data-fetching', Record<never, never>, Record<never, never>>,
  }
}

declare module 'vue-router/auto' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export type RouterTyped = _RouterTyped<RouteNamedMap>

  /**
   * Type safe version of `RouteLocationNormalized` (the type of `to` and `from` in navigation guards).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalized<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationNormalizedLoaded` (the return type of `useRoute()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalizedLoaded<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationResolved` (the returned route of `router.resolve()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationResolved<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationResolvedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocation` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocation<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationRaw` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationRaw<Name extends keyof RouteNamedMap = keyof RouteNamedMap> =
    | RouteLocationAsString<RouteNamedMap>
    | RouteLocationAsRelativeTypedList<RouteNamedMap>[Name]
    | RouteLocationAsPathTypedList<RouteNamedMap>[Name]

  /**
   * Generate a type safe params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParams<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['params']
  /**
   * Generate a type safe raw params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParamsRaw<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['paramsRaw']

  export function useRouter(): RouterTyped
  export function useRoute<Name extends keyof RouteNamedMap = keyof RouteNamedMap>(name?: Name): RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  export const useLink: UseLinkFnTyped<RouteNamedMap>

  export function onBeforeRouteLeave(guard: NavigationGuard<RouteNamedMap>): void
  export function onBeforeRouteUpdate(guard: NavigationGuard<RouteNamedMap>): void

  export const RouterLink: RouterLinkTyped<RouteNamedMap>
  
  // Experimental Data Fetching

  export function defineLoader<
    P extends Promise<any>,
    Name extends keyof RouteNamedMap = keyof RouteNamedMap,
    isLazy extends boolean = false,
  >(
    name: Name,
    loader: (route: RouteLocationNormalizedLoaded<Name>) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>
  export function defineLoader<
    P extends Promise<any>,
    isLazy extends boolean = false,
  >(
    loader: (route: RouteLocationNormalizedLoaded) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>

  export {
    _definePage as definePage,
    _HasDataLoaderMeta as HasDataLoaderMeta,
    _setupDataFetchingGuard as setupDataFetchingGuard,
    _stopDataFetchingScope as stopDataFetchingScope,
  } from 'unplugin-vue-router/runtime'
}

declare module 'vue-router' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export interface TypesConfig {
    beforeRouteUpdate: NavigationGuard<RouteNamedMap>
    beforeRouteLeave: NavigationGuard<RouteNamedMap>

    $route: RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[keyof RouteNamedMap]
    $router: _RouterTyped<RouteNamedMap>

    RouterLink: RouterLinkTyped<RouteNamedMap>
  }
}
