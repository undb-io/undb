import { CreateTableCommand, createTableCommandOutput, createTableCommandSchema, ITableCommandBus } from '@egodb/core'
import { publicProcedure, router } from '../trpc'

export const createTableRouter = (commandBus: ITableCommandBus) =>
  router({
    create: publicProcedure
      .meta({ openapi: { method: 'POST', path: '/table.create' } })
      .input(createTableCommandSchema)
      .output(createTableCommandOutput)
      .mutation(({ input }) => {
        const cmd = new CreateTableCommand({ name: input.name })
        return commandBus.execute(cmd)
      }),
  })
