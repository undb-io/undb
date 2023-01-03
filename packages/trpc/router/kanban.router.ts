import { SetKanbanFieldCommand, setKanbanFieldCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const tags = ['kanban']

export const createKanbanRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.kanban.setField', tags } })
      .input(setKanbanFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetKanbanFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
