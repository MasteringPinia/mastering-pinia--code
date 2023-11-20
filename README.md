# Mastering Pinia Exercises

![Hero Image](./public/hero-image.svg)

## Requirements

- Recent Node version. Recommended the latest LTS version (>=18)
- pnpm >=8.6 **required** to install the dependencies in this project
- git > 2.13 **required** to run the installation script

## Setup

Welcome to **Mastering Pinia**! To get started, run the following command:

```bash
npx zx@7.2 https://gist.githubusercontent.com/posva/d19708c1da18d41d66ac7cec1a1e5557/raw/bootstrap.mjs
```

This will create a `mastering-pinia-exercises` folder with all the exercises in your Home folder. You can pass a
different path as `--dir` or as the last argument to the command to change the location of the folder.

```bash
npx zx@7.2 https://gist.githubusercontent.com/posva/d19708c1da18d41d66ac7cec1a1e5557/raw/bootstrap.mjs --dir my-folder
```

> **Note**
>
> This also allows to update the exercises to the latest version by running the same command!

## Troubleshooting

- Sometimes you might get stuck on the `$ fetch` step:

  ![Stuck on fetch](https://github.com/MasteringPinia/mastering-pinia--code/assets/664177/d6399ed2-fe7a-4650-ae46-7bf7ec031491)

  In that case, press <kbd>Enter</kbd> to continue.
- Run with the `-v` flag to get more information about what is happening
- If you get a _Did you accept the Github invitation?_ message, try to manually clone the repository:

  ```bash
  git clone https://github.com/MasteringPinia/mastering-pinia--code.git temporary-folder
  ```

  Once you can clone it, you should be able **to delete that `temporary-folder` and run the script again**.
  - If this didn't work for you, maybe because you use different credentials on the same computer (work + personal), you can [use the credential options](https://stackoverflow.com/questions/13198143/how-do-i-disable-gits-credential-helper-for-a-single-repository/13203623#13203623)
  - You can also [manually pass the URL **with your login information**](https://stackoverflow.com/questions/10054318/how-do-i-provide-a-username-and-password-when-running-git-clone-gitremote-git)

### Windows

- Prefer using Git Bash to run the commands
- You can skip the version checks by passing `--skipChecks` to the script:

  ```bash
  npx zx@7.2 https://gist.githubusercontent.com/posva/d19708c1da18d41d66ac7cec1a1e5557/raw/bootstrap.mjs --skipChecks
  ```

- [install script cant find node, pnpm, npx zx](https://github.com/MasteringPinia/mastering-pinia--code/issues/14)
