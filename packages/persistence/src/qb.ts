import type { Client } from "@libsql/client"
import { LibsqlDialect } from "@libsql/kysely-libsql"
import { createLogger } from "@undb/logger"
import { Database as SqliteDatabase } from "bun:sqlite"
import { Kysely, ParseJSONResultsPlugin, sql, Transaction, type Dialect, type RawBuilder } from "kysely"
import { BunSqliteDialect } from "kysely-bun-sqlite"
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

export function createTursoQueryBuilder(client: Client) {
  return createQueryBuilderWithDialect(
    new LibsqlDialect({
      client,
    }),
  )
}

export function createSqliteQueryBuilder(sqlite: SqliteDatabase) {
  return createQueryBuilderWithDialect(
    new BunSqliteDialect({
      database: sqlite,
    }),
  )
}

export type IQueryBuilder = ReturnType<typeof createQueryBuilderWithDialect>
export type IRecordQueryBuilder = Kysely<any>

export type Tx = Transaction<Database>
export type AnonymousTx = Transaction<any>

export function json<T>(value: T): RawBuilder<T> {
  return sql`${JSON.stringify(value)}`
}
