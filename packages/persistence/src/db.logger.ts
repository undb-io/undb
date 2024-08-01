import { createLogger } from "@undb/logger"
import type { Logger } from "drizzle-orm"

const drizzleLogger = createLogger("db")

export class DrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    drizzleLogger.debug({ query, params }, "drizzle.query")
  }
}
