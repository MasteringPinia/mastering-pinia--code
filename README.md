# Mastering Pinia Exercise Platform

## Prerequisites

- Experience using HTML, CSS, and JavaScript
- Experience using in Vue 3 building applications
- Some Experience with TypeScript

## System Requirements

- Node 14 or greater. Recommended the latest LTS version
- npm 6 or greater. Recommended the version installed with node
- pnpm (needed to install the dependencies in this project)
- (Recommended) `ni`/`nr` from [@antfu/ni](https://github.com/antfu/ni) to easily add packages and run commands
- If you are using VSCode, make sure to **disable Vetur and install all recommended extensions** with
  `Shift + cmd + P` + `show recommended extensions`.

## Setup

Install any dependencies on the project using [`pnpm`](https://pnpm.io/) (can be installed with `npm i -g pnpm`):

```bash
pnpm i
```

## Working on the Exercises

Start the project with `nr dev` or `pnpm run dev` and visit <http://localhost:5173>. Note 3 servers will be running in
parallel and require ports 5173, 7777, and 5555. Make sure to not have any application running on those ports.

### Structure

- All exercises can be found within the `src/exercises` folders. You **won't need to change files outside of that
  folder**.
- Some exercises run some automated tests to help you with the exercises, keep an eye on the console as some tests give
  you customized tips.

### Verifying your solution

If you have failing tests, you can visit [http://localhost:51205/\_\_vitest\_\_/](http://localhost:51205/__vitest__/) to
get more information about the failing tests.
