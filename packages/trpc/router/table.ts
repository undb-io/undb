import {
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  getTableQueryOutput,
  getTableQuerySchema,
  ITableCommandBus,
} from '@egodb/core'
import { publicProcedure, router } from '../trpc'

export const createTableRouter = (commandBus: ITableCommandBus) =>
  router({
    get: publicProcedure
      .meta({ openapi: { method: 'GET', path: '/table.get' } })
      .input(getTableQuerySchema)
      .output(getTableQueryOutput)
      .query(({ input }) => {
        return { id: input.id }
      }),
    create: publicProcedure
      .meta({ openapi: { method: 'POST', path: '/table.create' } })
      .input(createTableCommandInput)
      .output(createTableCommandOutput)
      .mutation(({ input }) => {
        const cmd = new CreateTableCommand({ name: input.name })
        return commandBus.execute(cmd)
      }),
  })
