import { $settings } from './settings'

export enum LogMessageTypeEnum {
  tip = 'tip',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export type LogeMessageType = LogMessageTypeEnum | keyof typeof LogMessageTypeEnum

const LOG_MESSAGES_COLOR: Record<LogeMessageType, string> = {
  [LogMessageTypeEnum.tip]: 'background: #8b5cf6; color: #0f0f0f',
  [LogMessageTypeEnum.info]: 'background: #bfdbfe; color: #1e1e1e',
  [LogMessageTypeEnum.warn]: 'background: #f97316; color: #0b0b0b',
  [LogMessageTypeEnum.error]: 'background: #ff5e56; color: #2e2e2e',
}

const LABELS_FOR_TYPE: Record<LogeMessageType, string> = {
  [LogMessageTypeEnum.tip]: '👉 Tip',
  [LogMessageTypeEnum.info]: 'ℹ️',
  // [LogMessageType.warn]: '⚠️', // NOTE: doesn't show well in Chromium browsers
  [LogMessageTypeEnum.warn]: '🚧',
  [LogMessageTypeEnum.error]: '⛔️',
}

const TITLES_FOR_TYPE: Record<LogeMessageType, string> = {
  [LogMessageTypeEnum.tip]: 'Unfold this if you are blocked',
  [LogMessageTypeEnum.info]: 'info',
  [LogMessageTypeEnum.warn]: 'warning',
  [LogMessageTypeEnum.error]: 'error',
}

const MD_BOLD_RE = /\*\*(.*?)\*\*/g
// Underscores appear to often to deal with them with just a regexp
// const MD_ITALIC_RE = /_(.*?)_/g
const MD_CODE_RE = /`(.*?)`/g

/**
 * Applies italic and bold style to markdown text.
 * @param text - The text to apply styles to
 */
function applyTextStyles(text: string) {
  const styles: Array<{ pos: number; style: [string, string] }> = []

  const newText = text
    .replace(MD_BOLD_RE, (_m, text, pos) => {
      styles.push({
        pos,
        style: ['font-weight: bold;', 'font-weight: normal;'],
      })
      return `%c${text}%c`
    })
    // .replace(MD_ITALIC_RE, (_m, text, pos) => {
    //   styles.push({
    //     pos,
    //     style: ['font-style: italic;', 'font-style: normal;'],
    //   })
    //   return `%c${text}%c`
    // })
    .replace(MD_CODE_RE, (_m, text, pos) => {
      styles.push({
        pos,
        style: ['font-family: monospace;', 'font-family: inherit;'],
      })
      return `%c\`${text}\`%c`
    })
  return [newText, ...styles.sort((a, b) => a.pos - b.pos).flatMap(s => s.style)]
}

export function showMessage<M extends LogMessageTypeEnum>(
  type: M | keyof typeof LogMessageTypeEnum,
  {
    label = LABELS_FOR_TYPE[type],
    title = TITLES_FOR_TYPE[type],
    subtitle,
    color = '#e2e8f0',
    bgColor = '#171717',
    titleFontSize = '1em',
    labelStyle = LOG_MESSAGES_COLOR[type],
    extraStyle = '',
    collapsed = type === LogMessageTypeEnum.tip || type === LogMessageTypeEnum.error,
    endGroup = true,
  }: {
    label?: string
    title?: string
    subtitle?: string
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
  if (!$settings?.showTips && type === LogMessageTypeEnum.tip) return
  // only keep errors and warns in tests
  if (process.env.NODE_ENV !== 'development' && type !== 'error' && type !== 'warn') return

  const isGroup = messages.length > 0

  const method = isGroup ? (collapsed ? 'groupCollapsed' : 'group') : 'log'
  // const logMethod = type === LogMessageType.error ? 'error' : type === LogMessageType.warn ? 'warn' : 'log'

  console[method](
    `%c ${label} %c ${title} %c ${subtitle ? '\n' + subtitle : ''}`,
    `${labelStyle}; padding: 1px; border-radius: 0.3em 0 0 0.3em; font-size: ${titleFontSize}; ${extraStyle}`,
    `background:${bgColor}; color: ${color}; padding: 1px; border-radius: 0 0.3em 0.3em 0; font-size: ${titleFontSize}; ${extraStyle}`,
    // reset styles
    'background: transparent; color: inherit; font-weight: normal; font-size: 1em;',
  )

  let activeStyle = ''

  messages.forEach(m => {
    let tempStyle = ''
    let mdStyles: string[] = []
    if (m instanceof Error) {
      console.error(m)
    } else if (m !== undefined) {
      if (m.startsWith('```')) {
        activeStyle = `font-family: monospace;`
        tempStyle += `color: gray; padding: 1px; border-radius: ${m === '```' ? '0 0 3px 3px' : '3px 3px 0 0'};`
      } else if (typeof m === 'string' && !m.includes('http')) {
        ;[m, ...mdStyles] = applyTextStyles(m)
      }

      if (activeStyle || tempStyle) {
        console.log(`%c${m}`, activeStyle + tempStyle, ...mdStyles)
      } else {
        console.log(m, ...mdStyles)
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
