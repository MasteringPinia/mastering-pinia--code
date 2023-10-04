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
  if (!import.meta.env.VITE_IMGFLIP_USERNAME || !import.meta.env.VITE_IMGFLIP_PASSWORD) {
    console.error('Set the VITE_IMGFLIP_USERNAME and VITE_IMGFLIP_PASSWORD in your .env file in order to use this API.')
  }

  formData.append('username', import.meta.env.VITE_IMGFLIP_USERNAME)
  formData.append('password', import.meta.env.VITE_IMGFLIP_PASSWORD)
  // formData.append('text0', texts[0])
  // formData.append('text1', texts[1])
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
