import {
  MoveFieldCommand,
  moveFieldCommandInput,
  SetFieldVisibilityCommand,
  setFieldVisibilityCommandInput,
  SetFieldWidthCommand,
  setFieldWidthCommandInput,
} from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const TAG_TABLE = 'table'
const tags = [TAG_TABLE]

export const createViewFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setWidth: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.field.setWidth', tags } })
      .input(setFieldWidthCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldWidthCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setVisibility: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.field.setVisibility', tags } })
      .input(setFieldVisibilityCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFieldVisibilityCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    move: procedure
      .meta({ openapi: { method: 'POST', path: '/table.view.field.move', tags } })
      .input(moveFieldCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new MoveFieldCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
