import { mande } from 'mande'
import Cookie from 'js-cookie'
import { useLocalStorage } from '@vueuse/core'

export const users = mande('http://localhost:7777/users', {})

export interface User {
  id: string
  /**
   * The email of the user. It is unique
   */
  email: string

  /**
   * The name of the user
   */
  displayName: string

  /**
   * The photo of the user
   */
  photoURL: string

  /**
   * The password of the user because we don't have a real db.
   */
  password: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegister extends Pick<User, 'email' | 'displayName'>, UserCredentials {
  photoURL?: string
}

export async function registerUser(user: UserRegister) {
  if (
    (
      await users.get<User[]>('/', {
        query: {
          email: user.email,
        },
      })
    ).length > 0
  ) {
    throw new Error(`User "${user.email}" already exists`)
  }

  return users.post<User>('/', {
    photoURL: `https://i.pravatar.cc/150?u=${user.email}`,
    ...user,
  })
}

export const USER_KEY = 'mp_user'

export async function login({ email, password }: UserCredentials) {
  const matchedUsers = await users.get<User[]>('/', {
    query: {
      email,
      // Don't do this in production
      password,
    },
  })

  if (!matchedUsers.length) {
    throw new Error('Invalid Credentials')
  }

  const user = matchedUsers.at(0)!

  Cookie.set(USER_KEY, user.email)
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }),
  )

  return user
}

export async function autoLogin() {
  if (!Cookie.get(USER_KEY)) {
    return null
  }

  // fake login, 100% unsafe
  return users
    .get<User[]>('/', {
      query: {
        email: Cookie.get(USER_KEY),
      },
    })
    .then(users => users.at(0) || null)
}

export function logout() {
  Cookie.remove(USER_KEY)
  window.localStorage.removeItem(USER_KEY)
}

/**
 * Reactive current user.
 *
 * @returns the current user or null if there is no user
 */
export const useCurrentUser = () =>
  useLocalStorage<Pick<User, 'displayName' | 'email' | 'id' | 'photoURL'>>(USER_KEY, null, {
    initOnMounted: true,
    serializer: {
      read: v => {
        try {
          return JSON.parse(v)
        } catch (_err) {
          return null
        }
      },
      write: v => {
        try {
          return JSON.stringify(v)
        } catch (_err) {
          return 'null'
        }
      },
    },
  })
