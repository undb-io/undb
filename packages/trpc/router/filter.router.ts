import { setFiltersCommandInput, SetFitlersCommand } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const TAG_FILTER = 'filter'
const tags = [TAG_FILTER]

export const createFilterRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    set: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.filter.set', tags } })
      .input(setFiltersCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFitlersCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
