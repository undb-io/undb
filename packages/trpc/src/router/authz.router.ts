import type { IGetTableRLSSOutput } from '@undb/cqrs'
import { CreateRLSCommand, GetTableRLSSQuery, createRLSCommandInput, getTableRLSSQueryInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createRLSRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    list: procedure
      .input(getTableRLSSQueryInput)
      .output(z.any())
      .query<IGetTableRLSSOutput>(({ input }) => {
        const query = new GetTableRLSSQuery(input)
        return queryBus.execute(query)
      }),
    create: procedure
      .input(createRLSCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateRLSCommand(input)
        return commandBus.execute(cmd)
      }),
  })

export const createAuthzRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      rls: createRLSRouter(procedure)(commandBus, queryBus),
    })
