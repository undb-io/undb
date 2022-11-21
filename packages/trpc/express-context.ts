import { inferAsyncReturnType } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { type Handler } from 'express'
import { AppRouter } from './router'

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = inferAsyncReturnType<typeof createContext>

export const createExpressMiddleware = (appRouter: AppRouter): Handler => {
  return trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
}
