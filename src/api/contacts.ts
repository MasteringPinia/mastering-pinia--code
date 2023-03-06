import { mande } from 'mande'

export const contacts = mande('http://localhost:7777/contacts', {})

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  job: string
  pronouns: string | null
  bio: string
  avatar: string
  registeredAt: string
  isFavorite: boolean
}

/**
 * Retrieve all the contact list.
 */
export function getAllContacts() {
  return contacts.get<Contact[]>('/')
}

/**
 * Get the information of a contact by using its id.
 * @param id id of the contact
 */
export function getContactById(id: string | number) {
  return contacts.get<Contact>(id)
}

/**
 * Search the contacts database.
 *
 * @param options search, page, number per page, and other filtering options
 * @returns an object with the total of results and an array with at most `perPage` (defaults to 10) elements in it
 */
export function searchContacts(
  searchText: string,
  page?: number,
  {
    perPage,
    ...filterInfo
  }: {
    perPage?: number | string
  } & Partial<Contact> = {},
): Promise<{ total: number; results: Contact[] }> {
  const query: Record<string, string | null | undefined | number | boolean> = filterInfo as Record<
    string,
    string | boolean | number | null
  >
  if (searchText) query.q = searchText
  if (page) query._page = page
  if (perPage) query._limit = perPage

  return contacts.get('/', { query, responseAs: 'response' }).then(async res => ({
    total: Number(res.headers.get('x-total-count')) || 0,
    results: (await res.json()) as Contact[],
  }))
}
