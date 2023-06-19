#!/usr/bin/env zx
import 'zx/globals'

process.env.HUSKY = '0'

const out = 'apps/desktop/dist-electron/out'

// await $`rm -rf ${out}`

await $`pnpx turbo prune --scope=@undb/backend --scope=@undb/frontend --out-dir ${out}`

await within(async () => {
  await cd(out)
  await $`pnpm install`
  await $`pnpm run build`
})

await within(async () => {
  await cd('apps/desktop')
  await $`pnpm run rebuild`
})
