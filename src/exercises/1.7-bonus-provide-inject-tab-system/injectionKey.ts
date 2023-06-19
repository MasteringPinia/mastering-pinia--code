import { InjectionKey, Ref } from 'vue'

export const useTabKey: InjectionKey<
  (title: Ref<string>) => {
    isVisible: Ref<boolean>
  }
> = Symbol('useTab')
