import { SetKanbanFieldCommand, setKanbanFieldCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createKanbanRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .use(authz('table:set_view_field'))
      .input(setKanbanFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetKanbanFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
