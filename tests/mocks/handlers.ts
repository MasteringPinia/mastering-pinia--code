import { rest } from 'msw'

export const handlers = [
  // memes api
  rest.get('https://api.imgflip.com/get_memes', async (req, res, ctx) => {
    return res(ctx.json((await import('../fixtures/api.imgflip-getMemes.json')).default))
  }),

  // contacts api
  rest.get('http://localhost:7777/contacts/', async (req, res, ctx) => {
    return res(ctx.json((await import('../fixtures/api.contacts.json')).default))
  }),
  rest.get('http://localhost:7777/contacts/*', async (req, res, ctx) => {
    const contactList = (await import('../fixtures/api.contacts.json')).default
    // TODO: some basic filter
    console.log('got all with filter')
    return res(
      ctx.json({
        total: contactList.length,
        results: contactList,
      }),
    )
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
