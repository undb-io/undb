import type { IQueryTable } from '@egodb/core'
import {
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  EditTableCommand,
  editTableCommandInput,
  GetTableQuery,
  getTableQueryOutput,
  getTableQuerySchema,
  GetTablesQuery,
  getTablesQueryOutput,
  getTablesQuerySchema,
} from '@egodb/core'
import type { ICommandBus, IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'
import { createFieldRouter } from './field.router'
import { createViewRouter } from './view.router'

const TAG_TABLE = 'table'
const tags = [TAG_TABLE]

export const createTableRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      get: procedure
        .meta({ openapi: { method: 'GET', path: '/table.get', tags } })
        .input(getTableQuerySchema)
        .output(getTableQueryOutput)
        .query(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute<IQueryTable>(query)
        }),
      list: procedure
        .meta({ openapi: { method: 'GET', path: '/table.list', tags } })
        .input(getTablesQuerySchema)
        .output(getTablesQueryOutput)
        .query(() => {
          const query = new GetTablesQuery()
          return queryBus.execute<IQueryTable[]>(query)
        }),
      create: procedure
        .meta({ openapi: { method: 'POST', path: '/table.create', tags } })
        .input(createTableCommandInput)
        .output(createTableCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateTableCommand({ name: input.name, schema: input.schema })
          return commandBus.execute(cmd)
        }),
      edit: procedure
        .meta({ openapi: { method: 'POST', path: '/table.edit', tags } })
        .input(editTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new EditTableCommand(input)
          return commandBus.execute(cmd)
        }),
      field: createFieldRouter(procedure)(commandBus),
      view: createViewRouter(procedure)(commandBus),
    })
