import { rest } from 'msw'

export const handlers = [
  // search
  rest.get('http://localhost:7777/contacts', async (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const page = req.url.searchParams.get('_page')
    // const limit = req.url.searchParams.get('_limit')

    let data: any

    switch (`${q} ${page}`) {
      case 'sales 1':
        data = await import(`../fixtures/localhost.contacts.q=sales.p=1.json`)
        break
      case 'sales 2':
        data = await import(`../fixtures/localhost.contacts.q=sales.p=2.json`)
        break

      default:
        data = await import('../fixtures/localhost.contacts.q.fallback.json')
    }

    // This doesn't work for some reason...
    // console.log(`mocking q=${q} p=${page}`)
    // try {
    //   data = await import(`../fixtures/localhost.contacts.q=${q}.p=${page}.json`)
    // } catch (error) {
    //   console.log('falling back', error)
    //   data = await import('../fixtures/localhost.contacts.q.fallback.json')
    // }

    const total = q === 'sales' ? 52 : 1

    return res(ctx.set('X-Total-Count', String(total)), ctx.json(data.default))
  }),

  // memes api
  rest.get('https://api.imgflip.com/get_memes', async (req, res, ctx) => {
    return res(ctx.json((await import('../fixtures/api.imgflip-getMemes.json')).default))
  }),
]
