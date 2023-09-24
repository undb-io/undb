import { GetBasesQuery, getBasesQueryInput, getBasesQueryOutput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createBaseRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getBasesQueryInput)
      .output(getBasesQueryOutput)
      .query(({ input }) => {
        const query = new GetBasesQuery(input)
        return queryBus.execute(query)
      }),
  })
