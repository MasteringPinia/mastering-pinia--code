import { mande } from 'mande'
import { HOST } from './testing'

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
