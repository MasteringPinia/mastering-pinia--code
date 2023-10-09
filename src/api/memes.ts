import { showMessage } from '@/.internal/utils/logging'
import { mande } from 'mande'

export const imgflip = mande('https://api.imgflip.com', {
  headers: {
    'Content-Type': null,
  },
})

export interface Meme {
  id: string
  name: string
  url: string

  width: number
  height: number

  box_count: number
}

/**
 * Get a list of memes.
 */
export function getMemes() {
  return imgflip
    .get<{
      data: { memes: Meme[] }
    }>('/get_memes')
    .then(({ data }) => data.memes)
}

/**
 * Generate a meme on imgflip.
 */
export function captionImage({
  id,
  texts,
  font,
  maxFontSize,
}: {
  /**
   * Template id of the meme
   */
  id: string

  /**
   * Text to put on the top of the meme
   */
  texts: string[]

  font?: string

  maxFontSize?: number
}) {
  const formData = new FormData()
  formData.append('template_id', id)
  if (!import.meta.env.VITE_IMGFLIP_USER || !import.meta.env.VITE_IMGFLIP_PASSWORD) {
    showMessage(
      'warn',
      { title: 'imgflip credentials' },
      'You should set the "VITE_IMGFLIP_USER" and "VITE_IMGFLIP_PASSWORD" in your `.env` file in order to use this API with less limitations.',
    )
  }

  formData.append('username', import.meta.env.VITE_IMGFLIP_USER)
  formData.append('password', import.meta.env.VITE_IMGFLIP_PASSWORD)
  if (font) {
    formData.append('font', font)
  }
  if (maxFontSize) {
    formData.append('max_font_size', maxFontSize.toString())
  }
  texts.forEach((text, i) => {
    formData.set(`boxes[${i}][text]`, text)
  })

  return imgflip
    .post<
      | {
          success: true
          data: {
            url: string
            page_url: string
          }
        }
      | {
          success: false
          error_message: string
        }
    >('/caption_image', formData, {
      // body: formData,
    })
    .then(res => {
      if (res.success) {
        return res.data
      } else {
        throw new Error(res.error_message)
      }
    })
}
