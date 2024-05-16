import { mande } from 'mande'
import type { LocationQueryValueRaw } from 'vue-router/auto'

const artworks = mande('https://api.artic.edu/api/v1/artworks')

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface Config {
  iiif_url: string
  website_url: string
}

export interface LicenseInfo {
  license_text: string
  license_links: string[]
  version: string
}

export interface APIResponse<Data> {
  data: Data
  info: LicenseInfo
  config: Config
}

export interface Pagination {
  total: number
  limit: number
  offset: number
  total_pages: number
  current_page: number
  next_url: string
}

export interface APIResponsePaginated<Data> extends APIResponse<Data> {
  pagination: Pagination
}

export interface ArtworkThumbnail {
  lqip: string
  width: number
  height: number
  alt_text: string
}

export interface ArtworkColor {
  h: number
  l: number
  s: number
  percentage: number
  population: number
}

// list of fields to fetch from the API
const FIELDS =
  'id,title,artist_display,thumbnail,image_id,date_display,description,place_of_origin,dimensions,short_description,color,term_titles'

export interface Artwork {
  id: number
  title: string
  image_id: string | null
  image_url?: string | null
  thumbnail?: ArtworkThumbnail
  date_display: string
  artist_display: string
  place_of_origin: string
  description: string
  short_description: string | null
  dimensions: string
  color: ArtworkColor | null
  term_titles: string[]
}

export interface ArtworkSearchThumbnail {
  alt_text: string
  width: number
  lqip: string
  height: number
}

const SEARCH_FIELDS = 'id,title,thumbnail,image_id'
export interface ArtworkSearchResult extends Pick<Artwork, 'id' | 'thumbnail' | 'image_id' | 'image_url' | 'title'> {
  _score: number
}

export function getArtworksList({ page = 1, limit = 25 }: PaginationParams = {}) {
  return artworks
    .get<APIResponsePaginated<Artwork[]>>('/', {
      query: {
        page,
        limit,
        fields: FIELDS,
      },
    })
    .then(response => ({
      ...response,
      data: response.data.map(artwork => ({
        ...artwork,
        image_url: artwork.image_id && generateImageURL(response.config.iiif_url, artwork.image_id),
      })),
    }))
}

export function getArtwork(id: number | string) {
  return artworks
    .get<APIResponse<Artwork>>(id, {
      query: { fields: FIELDS },
    })
    .then(({ data: artwork, config }) => ({
      ...artwork,
      image_url: artwork.image_id && generateImageURL(config.iiif_url, artwork.image_id),
    }))
}

export function searchArtworks(query: string | LocationQueryValueRaw, { page = 1, limit = 5 }: PaginationParams = {}) {
  // NOTE: the API seems to work without a query
  // if (typeof query !== 'string' || !query) return Promise.resolve({ data: [] })
  return artworks
    .get<APIResponsePaginated<ArtworkSearchResult[]>>('/search', {
      query: { q: query, page, limit, fields: SEARCH_FIELDS },
    })
    .then(response => ({
      ...response,
      data: response.data.map(artwork => ({
        ...artwork,
        image_url: artwork.image_id && generateImageURL(response.config.iiif_url, artwork.image_id),
      })),
    }))
}

function generateImageURL(iiifUrl: string, imageId: string) {
  return `${iiifUrl}/${imageId}/full/843,/0/default.jpg`
}
