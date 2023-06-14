import { CreateWebhookCommand, createWebhookCommandInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createWebhookRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      create: procedure
        .input(createWebhookCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new CreateWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
    })
