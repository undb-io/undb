import {
  CreateRecordCommand,
  createRecordCommandInput,
  createRecordCommandOutput,
  GetRecordsQuery,
  getRecordsQueryInput,
  getRecordsQueryOutput,
} from '@egodb/core'
import type { ICommandBus, IQueryBus } from '@egodb/domain'
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
      list: procedure
        .meta({ openapi: { method: 'GET', path: '/record.list', tags } })
        .input(getRecordsQueryInput)
        .output(getRecordsQueryOutput)
        .query(({ input }) => {
          const query = new GetRecordsQuery(input)
          return queryBus.execute(query)
        }),
    })
