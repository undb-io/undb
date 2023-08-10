import {
  CreateWebhookCommand,
  DeleteWebhookCommand,
  GetWebhooksQuery,
  UpdateWebhookCommand,
  createWebhookCommandInput,
  deleteWebhookCommandInput,
  getWebhooksQueryInput,
  getWebhooksQueryOutput,
  updateWebhookCommandInput,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

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
        .use(authz('webhook:create'))
        .input(createWebhookCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new CreateWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
      update: procedure
        .use(authz('webhook:update'))
        .input(updateWebhookCommandInput)
        .output(z.any())
        .mutation(({ input }) => {
          const cmd = new UpdateWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
      delete: procedure
        .use(authz('webhook:delete'))
        .input(deleteWebhookCommandInput)
        .output(z.void())
        .mutation(({ input }) => {
          const cmd = new DeleteWebhookCommand(input)
          return commandBus.execute(cmd)
        }),
    })
