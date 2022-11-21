import { CreateTableCommand, ITableCommandBus } from '@egodb/core/dist'
import { z } from 'zod'
import { publicProcedure, router } from './trpc'

export const createTableRouter = (commandBus: ITableCommandBus) =>
  router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
        }),
      )
      .mutation(({ input }) => {
        const cmd = new CreateTableCommand({ name: input.name })
        return commandBus.execute(cmd)
      }),
    get: publicProcedure
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .query(({ input }) => {
        const cmd = new CreateTableCommand({ name: input.id })
        return commandBus.execute(cmd)
      }),
  })
