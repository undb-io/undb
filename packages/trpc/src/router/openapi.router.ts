import {
  CreateApiTokenCommand,
  DeleteApiTokenCommand,
  GetApiTokensQuery,
  createApiTokenCommandInput,
  deleteApiTokenCommandInput,
  getApiTokensQueryOutput,
  getApiTokensQuerySchema,
} from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

const createApiTokenRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    list: procedure
      .use(authz('openapi:list_api_token'))
      .input(getApiTokensQuerySchema)
      .output(getApiTokensQueryOutput)
      .query(({ input }) => {
        const query = new GetApiTokensQuery()
        return queryBus.execute(query)
      }),
    create: procedure
      .use(authz('openapi:create_api_token'))
      .input(createApiTokenCommandInput)
      .output(z.any())
      .mutation(({ input }) => {
        const cmd = new CreateApiTokenCommand({})
        return commandBus.execute(cmd)
      }),
    delete: procedure
      .use(authz('openapi:delete_api_token'))
      .input(deleteApiTokenCommandInput)
      .output(z.any())
      .mutation(({ input }) => {
        const cmd = new DeleteApiTokenCommand(input)
        return commandBus.execute(cmd)
      }),
  })

export const createOpenApiRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      apiToken: createApiTokenRouter(procedure)(commandBus, queryBus),
    })
