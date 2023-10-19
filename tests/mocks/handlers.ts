import { rest } from 'msw'

export const handlers = [
  // memes api
  rest.get('https://api.imgflip.com/get_memes', async (req, res, ctx) => {
    return res(ctx.json((await import('../fixtures/api.imgflip-getMemes.json')).default))
  }),

  rest.get('http://localhost:7777/users', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          email: 'email',
          displayName: 'displayName',
          password: 'password',
          photoURL: 'photoURL',
        },
      ]),
    )
  }),
]
