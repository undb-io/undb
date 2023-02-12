import {
  GetRecordsTreeQuery,
  getRecordsTreeQueryInput,
  getRecordsTreeQueryOutput,
  GetTreeAvailableRecordsQuery,
  getTreeAvailableRecordsQueryInput,
  getTreeAvailableRecordsQueryOutput,
} from '@egodb/core'
import type { IQueryBus } from '@egodb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createTreeFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getRecordsTreeQueryInput)
      .output(getRecordsTreeQueryOutput)
      .query(({ input }) => {
        const query = new GetRecordsTreeQuery(input)
        return queryBus.execute(query)
      }),
    available: procedure
      .input(getTreeAvailableRecordsQueryInput)
      .output(getTreeAvailableRecordsQueryOutput)
      .query(({ input }) => {
        const query = new GetTreeAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
