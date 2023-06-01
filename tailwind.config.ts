export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // .internal files are not included by default
    './src/**/.internal/**/*.{vue,js,ts,jsx,tsx}',
  ],
}
