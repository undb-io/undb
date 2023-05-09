import { AggregateNumberQuery, aggregateNumberQueryOutput, aggregateNumberQuerySchema } from '@undb/cqrs'
import type { IQueryBus } from '@undb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createAggregateRouter = (procedure: typeof publicProcedure) => (queryBus: IQueryBus) =>
  router({
    aggregateNumber: procedure
      .input(aggregateNumberQuerySchema)
      .output(aggregateNumberQueryOutput)
      .query(({ input }) => {
        const cmd = new AggregateNumberQuery(input)
        return queryBus.execute(cmd)
      }),
  })
