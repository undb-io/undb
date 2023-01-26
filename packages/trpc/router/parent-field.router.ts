import {
  GetParentAvailableRecordsQuery,
  getParentAvailableRecordsQueryInput,
  getParentAvailableRecordsQueryOutput,
} from '@egodb/core'
import type { IQueryBus } from '@egodb/domain'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

export const createParentFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    available: procedure
      .input(getParentAvailableRecordsQueryInput)
      .output(getParentAvailableRecordsQueryOutput)
      .query(({ input }) => {
        const query = new GetParentAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
