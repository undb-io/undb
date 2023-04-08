import { SetCalendarFieldCommand, setCalendarFieldCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createCalendarRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .input(setCalendarFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetCalendarFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
