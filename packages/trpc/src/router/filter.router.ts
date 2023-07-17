import { setFiltersCommandInput, SetFiltersCommand } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createFilterRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    set: procedure
      .input(setFiltersCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFiltersCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
