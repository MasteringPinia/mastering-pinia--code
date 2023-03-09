import { HOST } from './testing'
import { mande } from 'mande'

const openInEditor = mande(`${location.protocol}//${HOST}/__open-in-editor`)

export function openFile(path: string, line?: number, column?: number) {
  return openInEditor.get<void>('', {
    query: {
      file: path,
      line,
      column,
    },
  })
}
