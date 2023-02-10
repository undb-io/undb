import { SetTreeViewFieldCommand, setTreeViewFieldCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

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
