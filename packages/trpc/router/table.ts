import type { IQueryTable } from '@egodb/core'
import {
  CreateFieldCommand,
  CreateTableCommand,
  createTableCommandInput,
  createTableCommandOutput,
  creawteFieldCommandInput,
  EditTableCommand,
  editTableCommandInput,
  GetTableQuery,
  getTableQueryOutput,
  getTableQuerySchema,
  GetTablesQuery,
  getTablesQueryOutput,
  getTablesQuerySchema,
  MoveFieldCommand,
  moveFieldCommandInput,
  ReorderOptionsCommand,
  reorderOptionsCommandInput,
  SetFieldVisibilityCommand,
  setFieldVisibilityCommandInput,
  SetFieldWidthCommand,
  setFieldWidthCommandInput,
  setFiltersCommandInput,
  SetFitlersCommand,
  SetKanbanFieldCommand,
  setKanbanFieldCommandInput,
  SwitchDisplayTypeCommand,
  switchDisplayTypeCommandInput,
} from '@egodb/core'
import type { ICommandBus, IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

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
      createField: procedure
        .meta({ openapi: { method: 'POST', path: '/table.createField', tags } })
        .input(creawteFieldCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new CreateFieldCommand(input)
          return commandBus.execute(cmd)
        }),
      setFilter: procedure
        .meta({ openapi: { method: 'POST', path: '/table.setFitlers', tags } })
        .input(setFiltersCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new SetFitlersCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      setFieldWidth: procedure
        .meta({ openapi: { method: 'POST', path: '/table.setFieldWidth', tags } })
        .input(setFieldWidthCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new SetFieldWidthCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      setFieldVisibility: procedure
        .meta({ openapi: { method: 'POST', path: '/table.setFieldVisibility', tags } })
        .input(setFieldVisibilityCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new SetFieldVisibilityCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      moveField: procedure
        .meta({ openapi: { method: 'POST', path: '/table.moveField', tags } })
        .input(moveFieldCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new MoveFieldCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      setKanbanField: procedure
        .meta({ openapi: { method: 'POST', path: '/table.setKanbanField', tags } })
        .input(setKanbanFieldCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new SetKanbanFieldCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      switchDisplayType: procedure
        .meta({ openapi: { method: 'POST', path: '/table.switchDisplayType', tags } })
        .input(switchDisplayTypeCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new SwitchDisplayTypeCommand(input)
          return commandBus.execute<void>(cmd)
        }),
      reorderOptions: procedure
        .meta({ openapi: { method: 'POST', path: '/table.reorderOptions', tags } })
        .input(reorderOptionsCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new ReorderOptionsCommand(input)
          return commandBus.execute<void>(cmd)
        }),
    })
