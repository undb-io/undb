import { SetFormFieldVisibilityCommand, setFormFieldVisibilityCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createFormFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setVisibility: procedure
      .input(setFormFieldVisibilityCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFormFieldVisibilityCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
