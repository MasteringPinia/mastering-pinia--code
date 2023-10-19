import { useRoute } from 'vue-router/auto'
import { openFile } from '../utils/files'

/**
 * Returns a function to be used to open a file in the editor. Can only be called within an exercise component. The
 * `relativePath` is relative to the exercise directory **not the current file**.
 */
export function useOpenFile() {
  const route = useRoute()

  return async function open(relativePath: string, line?: number, column?: number) {
    const filePath = route.meta.exerciseData?.filepath
    if (!filePath) {
      console.log('Cannot open file', relativePath, 'with base path', filePath)
      return
    }

    const basePath = filePath.slice(
      0,
      filePath.indexOf(route.meta.exerciseData!.dirname) + route.meta.exerciseData!.dirname.length,
    )

    // remove the ./ from the beginning to join with +
    if (relativePath.startsWith('./')) {
      relativePath = relativePath.slice(2)
    }

    return openFile(basePath + '/' + relativePath, line, column)
  }
}
