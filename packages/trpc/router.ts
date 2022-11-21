import { router } from './trpc'

import { ITableCommandBus } from '@egodb/core/dist'
import { createTableRouter } from './table'

export const createRouter = (commandBus: ITableCommandBus) => {
  const appRouter = router({
    table: createTableRouter(commandBus),
  })
  return appRouter
}

export type AppRouter = ReturnType<typeof createRouter>
