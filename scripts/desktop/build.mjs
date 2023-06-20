#!/usr/bin/env zx
import 'zx/globals'

process.env.HUSKY = '0'

const out = 'apps/desktop/out'

await $`rm -rf ${out}`

await $`pnpx turbo prune --scope=@undb/backend --scope=@undb/frontend --out-dir ${out}`

await within(async () => {
  await cd(out)
  await $`pnpm install --shamefully-hoist`
  await $`pnpm run build`

  await $`rm -rf node_modules`
  await $`rm -rf apps/backend/node_modules`
  await $`rm -rf apps/frontend/node_modules`

  await $`pnpm install --prod --shamefully-hoist`

  await $`rm -rf apps/backend/src`
  await $`rm -rf apps/frontend/src`
})

await within(async () => {
  await cd('apps/desktop')
  await $`pnpm run rebuild`
})
