import { SetTreeViewFieldCommand, setTreeViewFieldCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createTreeViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .use(authz('table:set_view_field'))
      .input(setTreeViewFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetTreeViewFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
