import { SwitchDisplayTypeCommand, switchDisplayTypeCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'
import { createFilterRouter } from './filter'
import { createKanbanRouter } from './kanban'
import { createViewFieldRouter } from './viewField'

const tags = ['view']

export const createViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    switchDisplayType: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.switchDisplayType', tags } })
      .input(switchDisplayTypeCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SwitchDisplayTypeCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    field: createViewFieldRouter(procedure)(commandBus),
    filter: createFilterRouter(procedure)(commandBus),
    kanban: createKanbanRouter(procedure)(commandBus),
  })
