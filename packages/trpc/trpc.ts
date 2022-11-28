import { initTRPC } from '@trpc/server'
import type { OpenApiMeta } from 'trpc-openapi'

const t = initTRPC.meta<OpenApiMeta>().create()

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
