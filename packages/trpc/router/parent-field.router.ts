import {
  GetParentAvailableRecordsQuery,
  getParentAvailableRecordsQueryInput,
  getParentAvailableRecordsQueryOutput,
} from '@egodb/core'
import type { IQueryBus } from '@egodb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

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
