import type { ITableCommandBus, ITableQueryBus } from '@egodb/core'
import {
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  GetTableQuery,
  getTableQueryOutput,
  getTableQuerySchema,
  GetTablesQuery,
  getTablesQueryOutput,
  getTablesQuerySchema,
} from '@egodb/core'
import { publicProcedure, router } from '../trpc'

export const createTableRouter = (commandBus: ITableCommandBus, queryBus: ITableQueryBus) =>
  router({
    get: publicProcedure
      .meta({ openapi: { method: 'GET', path: '/table.get' } })
      .input(getTableQuerySchema)
      .output(getTableQueryOutput)
      .query(({ input }) => {
        const query = new GetTableQuery({ id: input.id })
        return queryBus.execute(query)
      }),
    list: publicProcedure
      .meta({ openapi: { method: 'GET', path: '/table.list' } })
      .input(getTablesQuerySchema)
      .output(getTablesQueryOutput)
      .query(() => {
        const query = new GetTablesQuery()
        return queryBus.execute(query)
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
