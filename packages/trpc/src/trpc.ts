import { tracing } from "@baselime/trpc-opentelemetry-middleware"

import { initTRPC, TRPCError } from "@trpc/server"
import { executionContext, getCurrentUserId } from "@undb/context/server"
import { container } from "@undb/di"
import { createLogger } from "@undb/logger"
import { QUERY_BUILDER, TX_CTX, type IQueryBuilder, type ITxContext } from "@undb/persistence/server"
import { ZodError } from "@undb/zod"
import { fromZodError } from "zod-validation-error"
import pkg from "../package.json"

const log = createLogger(pkg.name)

export const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts
    const message = error.cause instanceof ZodError ? fromZodError(error.cause).toString() : error.message

    return {
      ...shape,
      message,
    }
  },
})

export const p = t.procedure
  .use(async ({ type, input, path, next, rawInput }) => {
    const requestId = executionContext.getStore()?.requestId
    const startTime = performance.now()

    const result = await next()

    const responseTime = performance.now() - startTime

    const meta = {
      requestId,
      responseTime,
      type,
      // input,
      // rawInput,
      path,
    }
    if (result.ok) {
      log.info(meta, `trpc.${type}: ${path}`)
    } else {
      log.error({ ...meta, error: result.error }, `trpc.error: ${result.error.message}`)
    }

    return result
  })
  .use(async (ctx) => {
    if (ctx.type === "mutation") {
      const qb = container.resolve<IQueryBuilder>(QUERY_BUILDER)
      const txContext = container.resolve<ITxContext>(TX_CTX)
      return await qb
        .transaction()
        .setIsolationLevel("read committed")
        .execute(async (tx) => {
          txContext.startTransaction(tx)
          const result = await ctx.next()

          return result
        })
    } else {
      return await ctx.next()
    }
  })
  .use(tracing({ collectInput: true }))

export const privateProcedure = p.use(async (ctx) => {
  const user = getCurrentUserId()

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return ctx.next()
})

export const publicProcedure = p

export const middleware = t.middleware
