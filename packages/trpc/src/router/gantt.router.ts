import { SetGanttFieldCommand, setGanttFieldCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createGanttRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .input(setGanttFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetGanttFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
