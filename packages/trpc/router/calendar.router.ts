import { SetCalendarFieldCommand, setCalendarFieldCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const tags = ['kanban']

export const createCalendarRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setField: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.calendar.setField', tags } })
      .input(setCalendarFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetCalendarFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
