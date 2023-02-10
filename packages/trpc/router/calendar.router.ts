import { SetCalendarFieldCommand, setCalendarFieldCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

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
