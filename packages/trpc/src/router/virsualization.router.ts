import { UpdateVirsualizationCommand, updateVirsualizationCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createVirsualizationRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    update: procedure
      .input(updateVirsualizationCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateVirsualizationCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
