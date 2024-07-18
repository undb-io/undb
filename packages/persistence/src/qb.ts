import { LibsqlDialect } from "@libsql/kysely-libsql"
import { createLogger } from "@undb/logger"
import { Kysely, ParseJSONResultsPlugin, sql, type RawBuilder } from "kysely"
import { sqlite } from "./client"
import { type Database2 } from "./db"

export function createQueryBuilder(): Kysely<Database2> {
  const logger = createLogger("qb")

  return new Kysely<Database2>({
    dialect: new LibsqlDialect({
      client: sqlite,
    }),
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

export type IQueryBuilder = ReturnType<typeof createQueryBuilder>
export type IRecordQueryBuilder = Kysely<any>

export function json<T>(value: T): RawBuilder<T> {
  return sql`${JSON.stringify(value)}`
}
