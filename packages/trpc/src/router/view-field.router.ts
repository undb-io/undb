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

export const createViewFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setWidth: procedure
      .input(setFieldWidthCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldWidthCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setVisibility: procedure
      .input(setFieldVisibilityCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldVisibilityCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    move: procedure
      .input(moveFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setPinned: procedure
      .input(setPinnedFieldsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetPinnedFieldsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
