import {
  CreateViewCommand,
  createViewCommandInput,
  SwitchDisplayTypeCommand,
  switchDisplayTypeCommandInput,
} from '@egodb/cqrs'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createCalendarRouter } from './calendar.router.js'
import { createFilterRouter } from './filter.router.js'
import { createKanbanRouter } from './kanban.router.js'
import { createSortRouter } from './sort.router.js'
import { createTreeViewRouter } from './tree-view.router.js'
import { createViewFieldRouter } from './view-field.router.js'

export const createViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .input(createViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateViewCommand(input)
        return commandBus.execute(cmd)
      }),
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
