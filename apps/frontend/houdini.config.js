/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    url: "http://localhost:4728/graphql",
  },
  plugins: {
    "houdini-svelte": {
      static: true,
    },
  },
  scalars: {
    JSON: {
      type: "object",
    },
    File: {
      type: "object",
    },
  },
}

export default config
