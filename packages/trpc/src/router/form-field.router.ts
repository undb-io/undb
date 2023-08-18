import {
  SetFormFieldFilterCommand,
  SetFormFieldRequirementsCommand,
  SetFormFieldVisibilityCommand,
  SetFormFieldsOrderCommand,
  setFormFieldFilterCommandInput,
  setFormFieldRequirementsCommandInput,
  setFormFieldVisibilityCommandInput,
  setFormFieldsOrderCommandInput,
} from '@undb/cqrs'
import type { ICommandBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createFormFieldRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus) =>
  router({
    setVisibility: procedure
      .input(setFormFieldVisibilityCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFormFieldVisibilityCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setRequirements: procedure
      .input(setFormFieldRequirementsCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFormFieldRequirementsCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setFilter: procedure
      .input(setFormFieldFilterCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFormFieldFilterCommand(input)
        return commandBus.execute<void>(cmd)
      }),
    setOrder: procedure
      .input(setFormFieldsOrderCommandInput)
      .output(z.void())
      .mutation(({ input }) => {
        const cmd = new SetFormFieldsOrderCommand(input)
        return commandBus.execute(cmd)
      }),
  })
