import {
  CreateViewCommand,
  createViewCommandInput,
  DeleteViewCommand,
  deleteViewCommandInput,
  DuplicateViewCommand,
  duplicateViewCommandInput,
  MoveViewCommand,
  moveViewCommandInput,
  SetRowHeightCommand,
  setRowHeightCommandInput,
  SetShowSystemFieldsCommand,
  setShowSystemFieldssCommandInput,
  SwitchDisplayTypeCommand,
  switchDisplayTypeCommandInput,
  UpdateViewNameCommand,
  updateViewNameCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'
import { createCalendarRouter } from './calendar.router.js'
import { createDashboardRouter } from './dashboard.router.js'
import { createFilterRouter } from './filter.router.js'
import { createGalleryRouter } from './gallery.router.js'
import { createGanttRouter } from './gantt.router.js'
import { createKanbanRouter } from './kanban.router.js'
import { createSortRouter } from './sort.router.js'
import { createTreeViewRouter } from './tree-view.router.js'
import { createViewFieldRouter } from './view-field.router.js'

export const createViewRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .use(authz('table:create_view'))
      .input(createViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateViewCommand(input)
        return commandBus.execute(cmd)
      }),
    duplicate: procedure
      .use(authz('table:duplicate_view'))
      .input(duplicateViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DuplicateViewCommand(input)
        return commandBus.execute(cmd)
      }),
    updateName: procedure
      .use(authz('table:update_view_name'))
      .input(updateViewNameCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateViewNameCommand(input)
        return commandBus.execute(cmd)
      }),
    move: procedure
      .use(authz('table:move_view'))
      .input(moveViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveViewCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .use(authz('table:delete_view'))
      .input(deleteViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteViewCommand(input)
        return commandBus.execute(cmd)
      }),
    switchDisplayType: procedure
      .use(authz('table:switch_view_display_type'))
      .input(switchDisplayTypeCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SwitchDisplayTypeCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setShowSystemFields: procedure
      .use(authz('table:toggle_field_visibility'))
      .input(setShowSystemFieldssCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetShowSystemFieldsCommand(input)
        return commandBus.execute(cmd)
      }),
    setRowHeight: procedure
      .use(authz('table:set_row_height'))
      .input(setRowHeightCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetRowHeightCommand(input)
        return commandBus.execute(cmd)
      }),
    field: createViewFieldRouter(procedure)(commandBus),
    filter: createFilterRouter(procedure)(commandBus),
    sort: createSortRouter(procedure)(commandBus),
    kanban: createKanbanRouter(procedure)(commandBus),
    gantt: createGanttRouter(procedure)(commandBus),
    gallery: createGalleryRouter(procedure)(commandBus),
    calendar: createCalendarRouter(procedure)(commandBus),
    dashboard: createDashboardRouter(procedure)(commandBus),
    tree: createTreeViewRouter(procedure)(commandBus),
  })
