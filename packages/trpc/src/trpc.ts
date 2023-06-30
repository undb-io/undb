import { initTRPC } from '@trpc/server'
import type { IClsService } from '@undb/core'

const t = initTRPC.context<IClsService>().create({})

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
