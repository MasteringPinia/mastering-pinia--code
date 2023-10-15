import puppeteer from 'puppeteer'
import path from 'node:path'
import minimist from 'minimist'
import { spawn, spawnSync } from 'node:child_process'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
//
;(async () => {
  const argv = minimist(process.argv.slice(2), {})

  const waitTime = Number(argv.wait || argv.w) || 100
  const headless = (argv.headless ?? argv.h ?? true) !== 'false'

  // Retrieve the folders from command line arguments
  const folders = argv._

  if (!folders.length) {
    console.error('No folders specified')
    process.exit(1)
  }

  // Start local server
  console.log('Starting local server...')
  const PORT = 5173
  const server = spawn('pnpm', ['exec', 'vite', '--port', PORT], {
    cwd: path.join(path.dirname(new URL(import.meta.url).pathname), '..'),
  })

  // let the server start
  await sleep(1000)

  server.on('error', error => {
    console.error('Error starting local server')
    console.error(error)
    process.exit(1)
  })

  /** @type {string[]} */
  const screenshots = []

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: headless || 'new',
  })
  const page = await browser.newPage()

  // Process folders in parallel
  for (const folder of folders) {
    // Transform folder path
    const folderPath = path.normalize(folder)
    const transformedPath = path.basename(folderPath, '/')
    const transformedFolder = transformedPath.replace(/\./g, '/')

    if (transformedFolder.startsWith('_template')) {
      continue
    }

    console.log(`Processing URL: ${transformedFolder}`)

    try {
      // Navigate to the URL
      const url = `http://localhost:${PORT}/${transformedFolder}?hideTests`
      await page.goto(url)

      // Wait for the content to load
      await page.waitForSelector('#app')

      // Set the viewport size
      await page.setViewport({ width: 1200, height: 1000 })

      // Capture the screenshot
      console.log(`Capturing light mode screenshot...`)
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
      await sleep(waitTime)
      const screenshotLight = path.join(folderPath, '.internal/screenshot-light.png')
      await page.screenshot({ path: screenshotLight })

      console.log(`Capturing dark mode screenshot...`)
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
      await sleep(waitTime)
      const screenshotDark = path.join(folderPath, '.internal/screenshot-dark.png')
      await page.screenshot({ path: screenshotDark })

      screenshots.push(screenshotLight, screenshotDark)

      console.log(`Screenshot captured for folder: ${transformedFolder}`)
    } catch (error) {
      console.error(`Error capturing screenshot for folder: ${transformedFolder}`)
      console.error(error)
    }
  }

  // Close the browser
  await browser.close()

  // Stop local server
  console.log('Stopping local server...')
  server.kill('SIGINT')

  if (screenshots.length < 4) {
    console.log('Optimizing screenshots...')

    spawnSync('open', ['-a', 'ImageOptim', ...screenshots], {
      cwd: path.join(path.dirname(new URL(import.meta.url).pathname), '.'),
    })
  }

  console.log('Done ✅')
})()
