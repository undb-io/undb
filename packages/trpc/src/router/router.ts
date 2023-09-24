import { TRPCError } from '@trpc/server'
import type { ICommandBus, IQueryBus } from '@undb/domain'
import { middleware, publicProcedure, router } from '../trpc.js'
import type { ILogger } from '../type.js'
import { createAuthzRouter } from './authz.router.js'
import { createBaseRouter } from './base.router.js'
import { createInvitationRouter } from './invitation.router.js'
import { createOpenApiRouter } from './openapi.router.js'
import { createRecordRouter } from './record.router.js'
import { createShareRouter } from './share.router.js'
import { createTableRouter } from './table.router.js'
import { createTemplateRouter } from './template.router.js'
import { createUserRouter } from './user.router.js'
import { createWebhookRouter } from './webhook.router.js'

const loggerMiddleware = (logger: ILogger) =>
  middleware(async ({ path, type, next, rawInput }) => {
    const start = Date.now()
    const result = await next()
    const durationMs = Date.now() - start
    result.ok
      ? logger.log('OK request', { path, type, durationMs, rawInput })
      : logger.error('Non-OK request', {
          path,
          type,
          durationMs,
          rawInput,
          error: result.error,
          msg: result.error.message,
          stack: result.error.stack,
        })
    return result
  })

const authMiddleware = middleware(({ ctx, next }) => {
  const user = ctx.get('user')
  if (!user.userId || user.isAnonymous) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next()
})

export const createRouter = (commandBus: ICommandBus, queryBus: IQueryBus, logger: ILogger) => {
  const procedure = publicProcedure.use(loggerMiddleware(logger))
  const authedProceducr = procedure.use(authMiddleware)

  const appRouter = router({
    authz: createAuthzRouter(authedProceducr)(commandBus, queryBus),
    base: createBaseRouter(authedProceducr)(commandBus, queryBus),
    table: createTableRouter(authedProceducr)(commandBus, queryBus),
    record: createRecordRouter(authedProceducr)(commandBus, queryBus),
    user: createUserRouter(authedProceducr)(commandBus, queryBus),
    webhook: createWebhookRouter(authedProceducr)(commandBus, queryBus),
    share: createShareRouter(procedure)(commandBus, queryBus),
    invitation: createInvitationRouter(authedProceducr, publicProcedure)(commandBus, queryBus),
    openapi: createOpenApiRouter(authedProceducr)(commandBus, queryBus),
    template: createTemplateRouter(authedProceducr)(commandBus, queryBus),
  })
  return appRouter
}

export type AppRouter = ReturnType<typeof createRouter>
