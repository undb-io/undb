import { SwitchDisplayTypeCommand, switchDisplayTypeCommandInput } from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'
import { createCalendarRouter } from './calendar.router'
import { createFilterRouter } from './filter.router'
import { createKanbanRouter } from './kanban.router'
import { createSortRouter } from './sort.router'
import { createTreeViewRouter } from './tree-view.router'
import { createViewFieldRouter } from './view-field.router'

export const createViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    switchDisplayType: procedure
      .input(switchDisplayTypeCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SwitchDisplayTypeCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    field: createViewFieldRouter(procedure)(commandBus),
    filter: createFilterRouter(procedure)(commandBus),
    sort: createSortRouter(procedure)(commandBus),
    kanban: createKanbanRouter(procedure)(commandBus),
    calendar: createCalendarRouter(procedure)(commandBus),
    tree: createTreeViewRouter(procedure)(commandBus),
  })
