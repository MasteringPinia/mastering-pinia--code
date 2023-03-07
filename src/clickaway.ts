import type { DirectiveHook, ObjectDirective } from 'vue'
const CLICK_AWAY_KEY = Symbol('click-away')

interface HTMLElementClickAway extends HTMLElement {
  [CLICK_AWAY_KEY]?: (e: MouseEvent) => void
}

const created: DirectiveHook<HTMLElementClickAway, null, () => unknown> = (el, binding) => {
  const callback = binding.value

  const handler = (e: MouseEvent) => {
    const path = e.composedPath()
    if (path.indexOf(el) < 0) {
      callback()
    }
  }

  document.documentElement.addEventListener('click', handler)
  el[CLICK_AWAY_KEY] = handler
}

function unmounted(el: HTMLElementClickAway) {
  if (!el[CLICK_AWAY_KEY]) return

  el.removeEventListener('click', el[CLICK_AWAY_KEY])
  delete el[CLICK_AWAY_KEY]
}

export const ClickAway: ObjectDirective<HTMLElementClickAway, () => unknown> = {
  created,
  updated(el, binding, vnode) {
    if (binding.value !== binding.oldValue) {
      created(el, binding, vnode, null)
    }
  },
  unmounted,
}
