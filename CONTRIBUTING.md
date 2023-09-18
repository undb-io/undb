undb is built with nodejs for backend and sveltekit for frontend, it only requires `nodejs` to be installed on your local machine,
it's very easy to start with development.

## Prerequisite

- [Node.js](https://nodejs.org/en), required version >= 20.6.1
- [pnpm](https://pnpm.io/), package management for undb, required version >= 8.0.0

## Setup steps

### Clone repo

```bash
git clone git@github.com:undb-xyz/undb.git
```

### Setup environment (Optional)

undb suggest using [fnm](https://github.com/Schniz/fnm) to setup proper node version

```bash
fnm use
```

you can also use some other node version manager like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) or [volta](https://volta.sh/)

### Bootstrap (Optional)

If you are first time to run undb, you should run bootstrap script.

```bash
pnpm run bootstrap
```

> note that if you are using some other node package manager like npm or yarn, it will throw an exception

### Run dev script

```bash
pnpm run dev
```
