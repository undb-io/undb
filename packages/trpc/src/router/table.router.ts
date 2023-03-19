import {
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  DeleteTableCommand,
  deleteTableCommandInput,
  GetTableQuery,
  getTableQuerySchema,
  GetTablesQuery,
  getTablesQuerySchema,
  UpdateTableCommand,
  updateTableCommandInput,
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
        .output(z.any())
        .query(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getTablesQuerySchema)
        .output(z.any())
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
      update: procedure
        .input(updateTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateTableCommand(input)
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
