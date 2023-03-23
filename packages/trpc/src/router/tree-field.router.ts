import {
  GetRecordsTreeQuery,
  getRecordsTreeQueryInput,
  GetTreeAvailableRecordsQuery,
  getTreeAvailableRecordsQueryInput,
  getTreeAvailableRecordsQueryOutput,
} from '@egodb/cqrs'
import type { IQueryBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createTreeFieldRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getRecordsTreeQueryInput)
      .output(z.any())
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
