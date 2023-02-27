#!/usr/bin/env zx
import 'zx/globals'

process.env.FORCE_COLOR = 1
process.env.NODE_OPTIONS = '--loader ts-node/esm'

await $`rm -rf ./.ego/data`
await $`turbo run db:schema:fresh`
await cd('packages/database/sqlite')
await $`rm -rf ./migrations`
await $`pnpm run db:migration:create`
await cd('../../..')
await $`turbo run db:migration:up`
