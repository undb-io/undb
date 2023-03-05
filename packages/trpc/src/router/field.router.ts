import {
  CreateFieldCommand,
  createFieldCommandInput,
  DeleteFieldCommand,
  deleteFieldCommandInput,
  UpdateFieldCommand,
  updateFieldCommandInput,
} from '@egodb/cqrs'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createSelectFieldRouter } from './select-field.router.js'

export const createFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .input(createFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    update: procedure
      .input(updateFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .input(deleteFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    select: createSelectFieldRouter(procedure)(commandBus),
  })
