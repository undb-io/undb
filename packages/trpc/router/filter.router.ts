import { setFiltersCommandInput, SetFitlersCommand } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createFilterRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    set: procedure
      .input(setFiltersCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFitlersCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
