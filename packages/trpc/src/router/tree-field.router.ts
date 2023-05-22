import type { IGetRecordsTreeOutput, IGetTreeAvailableRecordsOutput } from '@undb/cqrs'
import {
  GetRecordsTreeQuery,
  GetTreeAvailableRecordsQuery,
  getRecordsTreeQueryInput,
  getTreeAvailableRecordsQueryInput,
} from '@undb/cqrs'
import type { IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createTreeFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getRecordsTreeQueryInput)
      .output(z.any())
      .query<IGetRecordsTreeOutput>(({ input }) => {
        const query = new GetRecordsTreeQuery(input)
        return queryBus.execute(query)
      }),
    available: procedure
      .input(getTreeAvailableRecordsQueryInput)
      .output(z.any())
      .query<IGetTreeAvailableRecordsOutput>(({ input }) => {
        const query = new GetTreeAvailableRecordsQuery(input)
        return queryBus.execute(query)
      }),
  })
