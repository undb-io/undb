import { GetUsersQuery, getUsersQueryOutput, getUsersQuerySchema } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createUserRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    users: procedure
      .input(getUsersQuerySchema)
      .output(getUsersQueryOutput)
      .query(({ input }) => {
        const query = new GetUsersQuery(input)
        return queryBus.execute(query)
      }),
  })
