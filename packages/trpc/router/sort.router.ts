import { SetSortsCommand, setSortsCommandInput } from '@egodb/cqrs'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

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
