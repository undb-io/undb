import { CreateTableCommand, createTableCommandSchema, ITableCommandBus } from '@egodb/core/dist'
import { publicProcedure, router } from '../trpc'

export const createTableRouter = (commandBus: ITableCommandBus) =>
  router({
    create: publicProcedure.input(createTableCommandSchema).mutation(({ input }) => {
      const cmd = new CreateTableCommand({ name: input.name })
      return commandBus.execute(cmd)
    }),
  })
