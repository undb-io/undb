import type { ICommandBus, IQueryBus } from '@undb/domain'
import { middleware, publicProcedure, router } from '../trpc.js'
import type { ILogger } from '../type.js'
import { createRecordRouter } from './record.router.js'
import { createTableRouter } from './table.router.js'

export const createRouter = (commandBus: ICommandBus, queryBus: IQueryBus, logger: ILogger) => {
  const procedure = publicProcedure.use(
    middleware(async ({ path, type, next, rawInput }) => {
      const start = Date.now()
      const result = await next()
      const durationMs = Date.now() - start
      result.ok
        ? logger.log('OK request', { path, type, durationMs, rawInput })
        : logger.error('Non-OK request', {
            path,
            type,
            durationMs,
            rawInput,
            error: result.error,
            msg: result.error.message,
            stack: result.error.stack,
          })
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
