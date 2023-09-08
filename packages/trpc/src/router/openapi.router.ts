import { CreateApiTokenCommand, createApiTokenCommandInput } from '@undb/cqrs'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { z } from 'zod'
import type { publicProcedure } from '../trpc.js'
import { router } from '../trpc.js'
import { authz } from './authz.middleware.js'

const createApiTokenRouter = (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
  router({
    create: procedure
      .use(authz('openapi:create_api_token'))
      .input(createApiTokenCommandInput)
      .output(z.any())
      .mutation(({ input }) => {
        const cmd = new CreateApiTokenCommand({})
        return commandBus.execute(cmd)
      }),
  })

export const createOpenApiRouter =
  (procedure: typeof publicProcedure) => (commandBus: ICommandBus, queryBus: IQueryBus) =>
    router({
      apiToken: createApiTokenRouter(procedure)(commandBus, queryBus),
    })
