import {
  CreateWidgetCommand,
  DeleteWidgetCommand,
  RelayoutWidgetsCommand,
  createWidgetCommandInput,
  deleteWidgetCommandInput,
  relayoutWidgetsCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createDashboardRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    createWidget: procedure
      .input(createWidgetCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateWidgetCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    deleteWidget: procedure
      .input(deleteWidgetCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteWidgetCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    relayoutWidgets: procedure
      .input(relayoutWidgetsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new RelayoutWidgetsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
