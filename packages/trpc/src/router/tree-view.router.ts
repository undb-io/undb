import { SetTreeViewFieldCommand, setTreeViewFieldCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createTreeViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .input(setTreeViewFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetTreeViewFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
