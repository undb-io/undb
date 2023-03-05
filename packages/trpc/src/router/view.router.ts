import {
  CreateViewCommand,
  createViewCommandInput,
  DeleteViewCommand,
  deleteViewCommandInput,
  DuplicateViewCommand,
  duplicateViewCommandInput,
  MoveViewCommand,
  moveViewCommandInput,
  SetShowSystemFieldsCommand,
  setShowSystemFieldssCommandInput,
  SwitchDisplayTypeCommand,
  switchDisplayTypeCommandInput,
  UpdateViewNameCommand,
  updateViewNameCommandInput,
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
    duplicate: procedure
      .input(duplicateViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DuplicateViewCommand(input)
        return commandBus.execute(cmd)
      }),
    updateName: procedure
      .input(updateViewNameCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateViewNameCommand(input)
        return commandBus.execute(cmd)
      }),
    move: procedure
      .input(moveViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveViewCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .input(deleteViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteViewCommand(input)
        return commandBus.execute(cmd)
      }),
    switchDisplayType: procedure
      .input(switchDisplayTypeCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SwitchDisplayTypeCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setShowSystemFields: procedure
      .input(setShowSystemFieldssCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetShowSystemFieldsCommand(input)
        return commandBus.execute(cmd)
      }),
    field: createViewFieldRouter(procedure)(commandBus),
    filter: createFilterRouter(procedure)(commandBus),
    sort: createSortRouter(procedure)(commandBus),
    kanban: createKanbanRouter(procedure)(commandBus),
    calendar: createCalendarRouter(procedure)(commandBus),
    tree: createTreeViewRouter(procedure)(commandBus),
  })
