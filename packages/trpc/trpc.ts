import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import type { OpenApiMeta } from 'trpc-openapi'

const t = initTRPC.meta<OpenApiMeta>().create({
  transformer: superjson,
})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
