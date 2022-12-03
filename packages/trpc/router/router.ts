import { middleware, publicProcedure, router } from '../trpc'

import type { ICommandBus, IQueryBus } from '@egodb/domain/dist'
import type { ILogger } from '../type'
import { createRecordRouter } from './record'
import { createTableRouter } from './table'

export const createRouter = (commandBus: ICommandBus, queryBus: IQueryBus, logger: ILogger) => {
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
    record: createRecordRouter(procedure)(commandBus, queryBus),
  })
  return appRouter
}

export type AppRouter = ReturnType<typeof createRouter>
