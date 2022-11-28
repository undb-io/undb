import { middleware, publicProcedure, router } from '../trpc'

import type { ITableCommandBus, ITableQueryBus } from '@egodb/core'
import type { ILogger } from '../type'
import { createTableRouter } from './table'

export const createRouter = (commandBus: ITableCommandBus, queryBus: ITableQueryBus, logger: ILogger) => {
  const procedure = publicProcedure.use(
    middleware(async ({ path, type, next }) => {
      const start = Date.now()
      const result = await next()
      const durationMs = Date.now() - start
      result.ok
        ? logger.log('OK request', { path, type, durationMs })
        : logger.error('Non-OK request', { path, type, durationMs })
      return result
    }),
  )
  const appRouter = router({
    table: createTableRouter(procedure)(commandBus, queryBus),
  })
  return appRouter
}

export type AppRouter = ReturnType<typeof createRouter>
