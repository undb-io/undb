import { LibsqlDialect } from "@libsql/kysely-libsql"
import { env } from "@undb/env"
import { createLogger } from "@undb/logger"
import { Kysely, ParseJSONResultsPlugin, sql, Transaction, type RawBuilder } from "kysely"
import { type Database } from "./db"

export function createQueryBuilder(): Kysely<Database> {
  const logger = createLogger("qb")

  return new Kysely<Database>({
    dialect: new LibsqlDialect({
      url: env.UNDB_DB_TURSO_URL!,
      authToken: env.UNDB_DB_TURSO_AUTH_TOKEN,
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

export type Tx = Transaction<Database>
export type AnonymousTx = Transaction<any>

export function json<T>(value: T): RawBuilder<T> {
  return sql`${JSON.stringify(value)}`
}
