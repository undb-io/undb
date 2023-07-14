import { CreateFormCommand, createFormCommandInput } from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { createFormFieldRouter } from './form-field.router.js'

export const createFormRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .input(createFormCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateFormCommand(input)
        return commandBus.execute(cmd)
      }),
    field: createFormFieldRouter(procedure)(commandBus),
  })
