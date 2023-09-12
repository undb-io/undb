import {
  CreateFieldCommand,
  DeleteFieldCommand,
  DuplicateFieldCommand,
  SetFieldDisplayCommand,
  UpdateFieldCommand,
  createFieldCommandInput,
  deleteFieldCommandInput,
  duplicateFieldCommandInput,
  setFieldDisplaysCommandInput,
  updateFieldCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'
import { createSelectFieldRouter } from './select-field.router.js'

export const createFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .use(authz('table:create_field'))
      .input(createFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    update: procedure
      .use(authz('table:update_field'))
      .input(updateFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    duplicate: procedure
      .use(authz('table:duplicate_field'))
      .input(duplicateFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DuplicateFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .use(authz('table:delete_field'))
      .input(deleteFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteFieldCommand(input)
        return commandBus.execute(cmd)
      }),
    setDisplay: procedure
      .use(authz('table:update_field'))
      .input(setFieldDisplaysCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldDisplayCommand(input)
        return commandBus.execute(cmd)
      }),
    select: createSelectFieldRouter(procedure)(commandBus),
  })
