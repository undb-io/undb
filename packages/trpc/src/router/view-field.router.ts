import {
  MoveFieldCommand,
  moveFieldCommandInput,
  SetFieldVisibilityCommand,
  setFieldVisibilityCommandInput,
  SetFieldWidthCommand,
  setFieldWidthCommandInput,
  SetPinnedFieldsCommand,
  setPinnedFieldsCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

export const createViewFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setWidth: procedure
      .use(authz('table:set_field_width'))
      .input(setFieldWidthCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldWidthCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setVisibility: procedure
      .use(authz('table:toggle_field_visibility'))
      .input(setFieldVisibilityCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldVisibilityCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    move: procedure
      .use(authz('table:move_field'))
      .input(moveFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setPinned: procedure
      .use(authz('table:pin_field'))
      .input(setPinnedFieldsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetPinnedFieldsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
