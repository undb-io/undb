import {
  AggregateNumberQuery,
  GetChartDataQuery,
  aggregateNumberQueryOutput,
  aggregateNumberQuerySchema,
  getChartDataQueryOutput,
  getChartDataQuerySchema,
} from '@undb/cqrs'
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
    chart: procedure
      .input(getChartDataQuerySchema)
      .output(getChartDataQueryOutput)
      .query(({ input }) => {
        const cmd = new GetChartDataQuery(input)
        return queryBus.execute(cmd)
      }),
  })
