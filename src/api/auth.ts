import { mande } from 'mande'

export const users = mande('http://localhost:7777/users', {})

export interface User {
  email: string
  displayName: string
  photoURL: string
}
interface UserAuth {
  email: string
  password: string
}

export interface UserRegister extends Pick<User, 'email' | 'displayName'>, UserAuth {
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
    throw new Error('User already exists')
  }

  return users.post<User>('/', {
    photoURL: `https://i.pravatar.cc/150?u=${user.email}`,
    ...user,
  })
}

export async function login(user: UserAuth) {
  const userList = await users.get<User[]>('/', {
    query: {
      email: user.email,
      password: user.password,
    },
  })

  if (!userList.length) {
    throw new Error('Invalid credentials')
  }

  return userList[0]
}
