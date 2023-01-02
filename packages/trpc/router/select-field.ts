import {
  CreateOptionCommand,
  createOptionCommandInput,
  ReorderOptionsCommand,
  reorderOptionsCommandInput,
} from '@egodb/core'
import type { ICommandBus } from '@egodb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc'
import { router } from '../trpc'

const TAG_TABLE = 'table'
const tags = [TAG_TABLE]

export const createSelectFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    reorderOptions: procedure
      .meta({ openapi: { method: 'POST', path: '/table.field.select.reorderOptions', tags } })
      .input(reorderOptionsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new ReorderOptionsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    createOption: procedure
      .meta({ openapi: { method: 'POST', path: '/table.field.select.createOption', tags } })
      .input(createOptionCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new CreateOptionCommand(input)
        return commandBus.execute<void>(cmd)
      }),
  })
