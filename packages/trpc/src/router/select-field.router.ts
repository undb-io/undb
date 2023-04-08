import {
  CreateOptionCommand,
  createOptionCommandInput,
  DeleteOptionCommand,
  deleteOptionCommandInput,
  ReorderOptionsCommand,
  reorderOptionsCommandInput,
  UpdateOptionCommand,
  updateOptionCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createSelectFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    reorderOptions: procedure
      .input(reorderOptionsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new ReorderOptionsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    createOption: procedure
      .input(createOptionCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateOptionCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    updateOption: procedure
      .input(updateOptionCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateOptionCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    deleteOption: procedure
      .input(deleteOptionCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteOptionCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
