#!/usr/bin/env zx
import 'zx/globals'

process.env.HUSKY = '0'

await $`rm -rf apps/desktop/out`

await $`pnpx turbo prune --scope=@undb/backend --scope=@undb/frontend --out-dir apps/desktop/out`

await within(async () => {
  await cd('apps/desktop/out')
  await $`pnpm install`
  await $`pnpm run build`
})
