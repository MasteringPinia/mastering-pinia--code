import { $settings } from './settings'

export enum LogMessageType {
  tip = 'tip',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export type LogeMessageTypes = LogMessageType | keyof typeof LogMessageType

const LOG_MESSAGES_COLOR: Record<LogeMessageTypes, string> = {
  [LogMessageType.tip]: 'background: #8b5cf6; color: #0f0f0f',
  [LogMessageType.info]: 'background: #bfdbfe; color: #1e1e1e',
  [LogMessageType.warn]: 'background: #f97316; color: #0b0b0b',
  [LogMessageType.error]: 'background: #ff5e56; color: #2e2e2e',
}

const LABELS_FOR_TYPE: Record<LogeMessageTypes, string> = {
  [LogMessageType.tip]: '👉 Tip',
  [LogMessageType.info]: 'ℹ️',
  // [LogMessageType.warn]: '⚠️', // NOTE: doesn't show well in Chromium browsers
  [LogMessageType.warn]: '🚧',
  [LogMessageType.error]: '⛔️',
}

const TITLES_FOR_TYPE: Record<LogeMessageTypes, string> = {
  [LogMessageType.tip]: 'Unfold this if you are blocked',
  [LogMessageType.info]: 'info',
  [LogMessageType.warn]: 'warning',
  [LogMessageType.error]: 'error',
}

export function showMessage<M extends LogMessageType>(
  type: M | keyof typeof LogMessageType,
  {
    label = LABELS_FOR_TYPE[type],
    title = TITLES_FOR_TYPE[type],
    color = '#e2e8f0',
    bgColor = '#171717',
    titleFontSize = '1em',
    labelStyle = LOG_MESSAGES_COLOR[type],
    extraStyle = '',
    collapsed = type === LogMessageType.tip || type === LogMessageType.error,
    endGroup = true,
  }: {
    label?: string
    title?: string
    color?: string
    bgColor?: string
    labelStyle?: string
    extraStyle?: string
    titleFontSize?: string
    collapsed?: boolean
    endGroup?: boolean
  },
  ...messages: any[]
) {
  if (!$settings.showTips && type === LogMessageType.tip) return
  // only keep errors and warns in tests
  if (process.env.NODE_ENV !== 'development' && type !== 'error' && type !== 'warn') return

  const isGroup = messages.length > 0

  const method = isGroup ? (collapsed ? 'groupCollapsed' : 'group') : 'log'
  // const logMethod = type === LogMessageType.error ? 'error' : type === LogMessageType.warn ? 'warn' : 'log'

  console[method](
    `%c ${label} %c ${title} %c `,
    `${labelStyle}; padding: 1px; border-radius: 0.3em 0 0 0.3em; font-size: ${titleFontSize}; ${extraStyle}`,
    `background:${bgColor}; color: ${color}; padding: 1px; border-radius: 0 0.3em 0.3em 0; font-size: ${titleFontSize}; ${extraStyle}`,
    'background:transparent',
  )

  let activeStyle = ''

  messages.forEach(m => {
    let tempStyle = ''
    if (m instanceof Error) {
      console.error(m)
    } else if (m !== undefined) {
      if (m.startsWith('```')) {
        activeStyle = `font-family: monospace;`
        tempStyle += `color: gray; padding: 1px; border-radius: ${m === '```' ? '0 0 3px 3px' : '3px 3px 0 0'};`
      }

      if (activeStyle || tempStyle) {
        console.log(`%c${m}`, activeStyle + tempStyle)
      } else {
        console.log(m)
      }
      if (m === '```') {
        activeStyle = ''
      } else if (m.startsWith('```')) {
        activeStyle += 'background-color: black; color: palegreen; padding: 0.5em; width: 100%;'
      }
    }
  })

  if (isGroup && endGroup) console.groupEnd()
}
