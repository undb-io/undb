import {
  GetTreeAvailableRecordsQuery,
  getTreeAvailableRecordsQueryInput,
  getTreeAvailableRecordsQueryOutput,
} from '@egodb/core'
import type { IQueryBus } from '@egodb/domain'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

export const createTreeQueryRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    available: procedure
      .input(getTreeAvailableRecordsQueryInput)
      .output(getTreeAvailableRecordsQueryOutput)
      .query(({ input }) => {
        const query = new GetTreeAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
