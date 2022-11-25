import { router } from '../trpc'

import type { ITableCommandBus, ITableQueryBus } from '@egodb/core'
import { createTableRouter } from './table'

export const createRouter = (commandBus: ITableCommandBus, queryBus: ITableQueryBus) => {
  const appRouter = router({
    table: createTableRouter(commandBus, queryBus),
  })
  return appRouter
}

export type AppRouter = ReturnType<typeof createRouter>
