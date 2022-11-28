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
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

export const createTableRouter =
  (procedure: typeof publicProcedure) => (commandBus: ITableCommandBus, queryBus: ITableQueryBus) =>
    router({
      get: procedure
        .meta({ openapi: { method: 'GET', path: '/table.get' } })
        .input(getTableQuerySchema)
        .output(getTableQueryOutput)
        .query(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute(query)
        }),
      list: procedure
        .meta({ openapi: { method: 'GET', path: '/table.list' } })
        .input(getTablesQuerySchema)
        .output(getTablesQueryOutput)
        .query(() => {
          const query = new GetTablesQuery()
          return queryBus.execute(query)
        }),
      create: procedure
        .meta({ openapi: { method: 'POST', path: '/table.create' } })
        .input(createTableCommandInput)
        .output(createTableCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateTableCommand({ name: input.name, schema: input.schema })
          return commandBus.execute(cmd)
        }),
    })
