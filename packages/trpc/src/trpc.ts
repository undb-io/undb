import { initTRPC } from "@trpc/server"
import { executionContext } from "@undb/context/server"
import { ZodError } from "@undb/zod"
import { fromError } from "zod-validation-error"
import pkg from "../package.json"
import { createLogger } from "@undb/logger"

const log = createLogger(pkg.name)

export const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      message: error.cause instanceof ZodError ? fromError(error.cause).toString() : error.message,
    }
  },
})

export const p = t.procedure.use(async ({ type, input, path, next, rawInput }) => {
  const requestId = executionContext.getStore()?.requestId
  const startTime = performance.now()

  const result = await next()

  const responseTime = performance.now() - startTime

  const meta = {
    requestId,
    responseTime,
    type,
    input,
    rawInput,
    path,
  }
  if (result.ok) {
    log.info(meta, `trpc.${type}: ${path}`)
  } else {
    log.error({ ...meta, error: result.error }, `trpc.error: ${result.error.message}`)
  }

  return result
})

export const middleware = t.middleware
