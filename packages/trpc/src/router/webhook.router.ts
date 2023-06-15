import {
  CreateWebhookCommand,
  DeleteWebhookCommand,
  GetWebhooksQuery,
  createWebhookCommandInput,
  deleteWebhookCommandInput,
  getWebhooksQueryInput,
  getWebhooksQueryOutput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'

export const createWebhookRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      list: procedure
        .input(getWebhooksQueryInput)
        .output(getWebhooksQueryOutput)
        .query(({ input }) => {
          const query = new GetWebhooksQuery(input)
          return queryBus.execute(query)
        }),
      create: procedure
        .input(createWebhookCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new CreateWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .input(deleteWebhookCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
    })
