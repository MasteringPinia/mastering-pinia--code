import { InjectionKey } from 'vue'

type TODO = any

export const registerTabKey: InjectionKey<TODO> = Symbol('tabs')
