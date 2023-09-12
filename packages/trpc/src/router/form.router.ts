import {
  CreateFormCommand,
  CreateFormFromViewCommand,
  DeleteFormCommand,
  UpdateFormCommand,
  createFormCommandInput,
  createFormFromViewCommandInput,
  deleteFormCommandInput,
  updateFormCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'
import { createFormFieldRouter } from './form-field.router.js'

export const createFormRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    create: procedure
      .use(authz('table:create_form'))
      .input(createFormCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateFormCommand(input)
        return commandBus.execute(cmd)
      }),
    createFromView: procedure
      .use(authz('table:create_form'))
      .input(createFormFromViewCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateFormFromViewCommand(input)
        return commandBus.execute(cmd)
      }),
    update: procedure
      .use(authz('table:update_form'))
      .input(updateFormCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new UpdateFormCommand(input)
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .use(authz('table:delete_form'))
      .input(deleteFormCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new DeleteFormCommand(input)
        return commandBus.execute(cmd)
      }),
    field: createFormFieldRouter(procedure.use(authz('table:update_form')))(commandBus),
  })
