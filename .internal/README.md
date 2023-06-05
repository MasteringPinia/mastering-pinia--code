# Internal instructions for reviewing

## Structure

- `.internal` folders are hidden from students
- `src/exercises` contains the exercises
- There are some helpful vscode settings in `.vscode`

## Testing as a student

Students are expected to fetch the code with this script:

```sh
npx zx@7.2 https://esm.is/mastering-state-management
```

It does this verifications:

- Checks Node, pnpm and zx (runs the script)
- Removes the solutions
- Resets the git history
- Moves starting files up one level

It clones the repository on a folder at the Home of the user with the current date. You can specific a `--dir` option to
change it:

```sh
npx zx@7.2 https://esm.is/mastering-state-management --dir test-folder
```

### Testing a specific branch

Use the `-b` or `--branch` argument to test a specific branch:

```sh
# Test https://github.com/posva/mastering-state-management--code/pull/7
npx zx@7.2 https://esm.is/mastering-state-management -b ex/2.7-gradient-builder
```

### Debugging

Use the `--debug` (`-d`) and `--verbose` (`-v`) flags to see what's going on.
