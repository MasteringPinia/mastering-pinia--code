import { mount } from '@vue/test-utils'
import TestComponent from '../pages/index/todo-list-3.vue'
import { describe, it, expect, vi, beforeEach, afterEach, SpyInstance } from 'vitest'
import { isRef, toRef, toRefs, toRaw, watch, isReactive } from 'vue'
import { isComputed, showMessage, tipOnFail } from '@tests/utils'
import { useTimeAgo } from '@vueuse/core'

vi.mock('vue', async importOriginal => {
  const original = (await importOriginal()) as typeof import('vue')
  return {
    ...original,
    // @ts-ignore: ???
    toRef: vi.fn(original.toRef),
    toRefs: vi.fn(original.toRefs),
    watch: vi.fn(original.watch),
  }
})

vi.mock('@vueuse/core', async importOriginal => {
  const original = (await importOriginal()) as typeof import('@vueuse/core')

  return {
    ...original,
    useTimeAgo: vi.fn(original.useTimeAgo),
  }
})

describe('broken stores', () => {
  describe('Performance', () => {
    beforeEach(() => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('do we really need computed here?', async () => {
      mount(TestComponent)

      tipOnFail(() => {
        expect(useTimeAgo).toHaveBeenCalled()
      }, 'Did you just remove the `useTimeAgo()` 🙃?')

      tipOnFail(() => {
        expect(isComputed((useTimeAgo as unknown as SpyInstance).mock.lastCall!.at(0))).toBe(false)
        expect(useTimeAgo).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({}))
      }, 'You can avoid passing a `computed()` to `useTimeAgo()` by passing a simple getter function.')

      tipOnFail(() => {
        expect(toRef).not.toHaveBeenCalled()
        expect(toRef).not.toHaveBeenCalledWith(expect.anything(), 'mostRecent')
        expect(toRefs).not.toHaveBeenCalled()
      }, "`useTimeAgo()` doesn't need to use `toRef()` or `toRefs()`, it can also be passed a simple getter function.")
    })

    it('watching the whole store seems a bit too much', async () => {
      const wrapper = mount(TestComponent)
      // @ts-expect-error: internal
      const internalInstance: any = toRaw(wrapper.vm.$.devtoolsRawSetupState)

      if (!('todos' in internalInstance)) {
        showMessage(
          'warn',
          'The `todos` store variable is missing from the component. Please do not remove it or rename it 🙏. I need it to test your solution 🤓.',
        )
        throw new Error('Missing `todos` store variable')
      }

      expect(watch).toHaveBeenCalled()

      tipOnFail(() => {
        const watched = (watch as unknown as SpyInstance).mock.lastCall!.at(0)
        expect(watched).toBeDefined()
        expect(isRef(watched)).toBe(false)
      }, 'You seem to be passing `list` directly to `watch()`. This version only works if you add `{ deep: true }` to the watcher options. For the test to pass, use the function version.')

      tipOnFail(() => {
        expect(watch).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          expect.objectContaining({ deep: expect.any(Boolean) }),
        )
      }, 'You can pass a function to `watch()` instead of watching the whole store.')

      tipOnFail(() => {
        const watched = (watch as unknown as SpyInstance).mock.lastCall!.at(0)()
        expect(isReactive(watched)).toBe(true)
        expect(watched).toBeInstanceOf(Array)
      }, 'You only need to watch the array of todos.')

      tipOnFail(() => {
        expect(watch).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          expect.objectContaining({ deep: true }),
        )
      }, "You need to set `deep: true` in the watcher options or it won't work.")
    })
  })
})
