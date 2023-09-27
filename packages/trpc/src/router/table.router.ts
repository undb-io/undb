import type { IGetTableOutput, IGetTablesOutput } from '@undb/cqrs'
import {
  CreateTableCommand,
  DeleteTableCommand,
  GetTableQuery,
  GetTablesQuery,
  UpdateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  deleteTableCommandInput,
  getTableQuerySchema,
  getTablesQuerySchema,
  updateTableCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createAggregateRouter } from './aggregate.router.js'
import { authz } from './authz.middleware.js'
import { createFieldRouter } from './field.router.js'
import { createFormRouter } from './form.router.js'
import { createViewRouter } from './view.router.js'
import { createVisualizationRouter } from './visualization.router.js'

export const createTableRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      get: procedure
        .input(getTableQuerySchema)
        .output(z.any())
        .query<IGetTableOutput>(({ input }) => {
          const query = new GetTableQuery({ id: input.id })
          return queryBus.execute(query)
        }),
      list: procedure
        .input(getTablesQuerySchema)
        .output(z.any())
        .query<IGetTablesOutput>(({ input }) => {
          const query = new GetTablesQuery(input)
          return queryBus.execute(query)
        }),
      create: procedure
        .use(authz('table:create'))
        .input(createTableCommandInput)
        .output(createTableCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateTableCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .use(authz('table:update'))
        .input(updateTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateTableCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .use(authz('table:delete'))
        .input(deleteTableCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteTableCommand(input)
          return commandBus.execute(cmd)
        }),
      field: createFieldRouter(procedure)(commandBus),
      view: createViewRouter(procedure)(commandBus),
      form: createFormRouter(procedure)(commandBus),
      aggregate: createAggregateRouter(procedure)(queryBus),
      visualization: createVisualizationRouter(procedure)(commandBus),
    })
