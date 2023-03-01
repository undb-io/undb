#!/usr/bin/env zx
import 'zx/globals'

await $`docker buildx bake ${process.argv[3]}`
