import {
  CreateRecordCommand,
  createRecordCommandInput,
  createRecordCommandOutput,
  DeleteRecordCommand,
  deleteRecordCommandInput,
  GetRecordQuery,
  getRecordQueryInput,
  getRecordQueryOutput,
  GetRecordsQuery,
  getRecordsQueryInput,
  getRecordsQueryOutput,
  UpdateRecordCommand,
  updateRecordCommandInput,
} from '@egodb/core'
import type { ICommandBus, IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const RECORD_TAG = 'record'
const tags = [RECORD_TAG]

export const createRecordRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      create: procedure
        .meta({ openapi: { method: 'POST', path: '/record.create', tags } })
        .input(createRecordCommandInput)
        .output(createRecordCommandOutput)
        .mutation(({ input }) => {
          const cmd = new CreateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .meta({ openapi: { method: 'POST', path: '/record.update', tags } })
        .input(updateRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new UpdateRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .meta({ openapi: { method: 'POST', path: '/record.get', tags } })
        .input(deleteRecordCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteRecordCommand(input)
          return commandBus.execute(cmd)
        }),
      get: procedure
        .meta({ openapi: { method: 'GET', path: '/record.get', tags } })
        .input(getRecordQueryInput)
        .output(getRecordQueryOutput)
        .query(({ input }) => {
          const query = new GetRecordQuery(input)
          return queryBus.execute(query)
        }),
      list: procedure
        .meta({ openapi: { method: 'GET', path: '/record.list', tags } })
        .input(getRecordsQueryInput)
        .output(getRecordsQueryOutput)
        .query(({ input }) => {
          const query = new GetRecordsQuery(input)
          return queryBus.execute(query)
        }),
    })
