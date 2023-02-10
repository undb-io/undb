import { SetSortsCommand, setSortsCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

export const createSortRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    set: procedure
      .input(setSortsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetSortsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
