import { GetParentAvailableRecordsQuery, getParentAvailableRecordsQueryInput } from '@egodb/cqrs'
import type { IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createParentFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    available: procedure
      .input(getParentAvailableRecordsQueryInput)
      .output(z.any())
      .query(({ input }) => {
        const query = new GetParentAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
