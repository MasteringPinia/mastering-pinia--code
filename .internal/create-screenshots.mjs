import puppeteer from 'puppeteer'
import path from 'node:path'
;(async () => {
  // Start local server
  console.log('Starting local server...')
  // Add the command to start the local server here

  // Wait for server to start
  // await new Promise(resolve => setTimeout(resolve, 3000))

  // Retrieve the folders from command line arguments
  const folders = process.argv.slice(2)

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
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
      const url = `http://localhost:5173/${transformedFolder}?hideTests`
      await page.goto(url)

      // Wait for the content to load
      await page.waitForSelector('#app')

      // Set the viewport size
      await page.setViewport({ width: 1200, height: 1000 })

      // Capture the screenshot
      console.log(`Capturing light mode screenshot...`)
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
      await page.screenshot({ path: path.join(folderPath, '.internal/screenshot-light.png') })

      console.log(`Capturing dark mode screenshot...`)
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }])
      await page.screenshot({ path: path.join(folderPath, '.internal/screenshot-dark.png') })

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
  // Add the command to stop the local server here

  console.log('Done ✅')
})()
