import { createLogger } from "@undb/logger"
import { Kysely, ParseJSONResultsPlugin, sql, type Dialect, type RawBuilder } from "kysely"
import { type Database } from "./db"

export function createQueryBuilderWithDialect(dialect: Dialect) {
  const logger = createLogger("qb")

  return new Kysely<Database>({
    dialect,
    plugins: [new ParseJSONResultsPlugin()],
    log: (event) => {
      if (event.level == "query") {
        logger.debug(
          {
            query: event.query.sql,
            params: event.query.parameters,
            duration: event.queryDurationMillis,
          },
          "kysely.query",
        )
      } else if (event.level == "error") {
        logger.error(
          {
            error: event.error,
            query: event.query.sql,
            params: event.query.parameters,
            duration: event.queryDurationMillis,
          },
          "kysely.error",
        )
      }
    },
  })
}

export function json<T>(value: T): RawBuilder<T> {
  return sql`${JSON.stringify(value)}`
}
