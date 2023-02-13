import {
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  DeleteTableCommand,
  deleteTableCommandInput,
  EditTableCommand,
  editTableCommandInput,
  GetTableQuery,
  getTableQueryOutput,
  getTableQuerySchema,
  GetTablesQuery,
  getTablesQueryOutput,
  getTablesQuerySchema,
} from '@egodb/cqrs'
import type { ICommandBus, IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createFieldRouter } from './field.router.js'
import { createViewRouter } from './view.router.js'

export const createTableRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      get: procedure
        .input(getTableQuerySchema)
        .output(getTableQueryOutput)
        .query(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getTablesQuerySchema)
        .output(getTablesQueryOutput)
        .query(() => {
          const query = new GetTablesQuery()
          return queryBus.execute(query)
        }),
      create: procedure
        .input(createTableCommandInput)
        .output(createTableCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateTableCommand({ name: input.name, schema: input.schema })
          return commandBus.execute(cmd)
        }),
      edit: procedure
        .input(editTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new EditTableCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .input(deleteTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteTableCommand(input)
          return commandBus.execute(cmd)
        }),
      field: createFieldRouter(procedure)(commandBus),
      view: createViewRouter(procedure)(commandBus),
    })
