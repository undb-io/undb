import { initTRPC } from '@trpc/server'
const t = initTRPC.create()

export const middleware = t.middleware
export const router = t.router
export const publicProcedure = t.procedure
