import type { IGetParentAvailableRecordsOutput } from '@undb/cqrs'
import { GetParentAvailableRecordsQuery, getParentAvailableRecordsQueryInput } from '@undb/cqrs'
import type { IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createParentFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    available: procedure
      .input(getParentAvailableRecordsQueryInput)
      .output(z.any())
      .query<IGetParentAvailableRecordsOutput>(({ input }) => {
        const query = new GetParentAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
