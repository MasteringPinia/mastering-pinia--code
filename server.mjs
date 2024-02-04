// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import open from 'open'

const isTest = process.env.VITEST

const PORT = process.env.PORT || 5173

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort = undefined,
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = p => path.resolve(__dirname, p)

  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''

  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {}

  const app = express()

  /**
   * @type {import('vite').ViteDevServer | null}
   */
  let vite = null
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      // base: '/',
      root,
      clearScreen: false,
      logLevel: isTest ? 'error' : 'info',
      server: {
        open: true,
        middlewareMode: true,
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      '/',
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      }),
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      // vite is always there in dev
      if (!isProd && vite) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
      } else {
        template = indexProd
        // @ts-ignore
        render = (await import('./dist/server/entry-server.mjs')).render
      }

      if ('no-ssr' in req.query) {
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      }

      const [appHtml, preloadLinks, state] = await render(url, manifest)

      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
        .replace(
          `<!--pinia-state-->`,
          `<script>` +
            // add pinia state
            `window.__PINIA_STATE__ = ${JSON.stringify(state)}` +
            `</script>`,
        )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      const debugURL = new URL(req.originalUrl, `http://localhost:${PORT}`)
      debugURL.searchParams.set('no-ssr', '')
      res
        .status(500)
        .end(
          `<!DOCTYPE html><p><a href="${debugURL.href}">Reload without SSR</a> to debug locally.</p><br><pre>` +
            e.stack +
            `</pre>`,
        )
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`)
      if (process.argv.includes('--open')) {
        open(`http://localhost:${PORT}`)
      }
    }),
  )
}
