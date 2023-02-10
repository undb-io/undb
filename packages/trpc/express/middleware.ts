import * as trpcExpress from '@trpc/server/adapters/express'

import { type Handler } from 'express'
import type { AppRouter } from '../router/router'

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({}) // no context

export const createExpressMiddleware = (appRouter: AppRouter): Handler => {
  return trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
}
