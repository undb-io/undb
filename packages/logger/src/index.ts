import { env } from "@undb/env"
import pino, { type LoggerOptions } from "pino"

export * from "./logger.provider"

export const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL ?? "info",
  transport:
    import.meta.env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
        },
}

export const logger = pino(loggerOptions)

export const createLogger = (module: string) => logger.child({ module })

export type ILogger = typeof logger
