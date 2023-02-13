import { SetTreeViewFieldCommand, setTreeViewFieldCommandInput } from '@egodb/cqrs'
import type { ICommandBus } from '@egodb/domain'
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
