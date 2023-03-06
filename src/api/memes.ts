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

export function getMemes() {
  return imgflip
    .get<{
      data: { memes: Meme[] }
    }>('/get_memes')
    .then(({ data }) => data.memes)
}
