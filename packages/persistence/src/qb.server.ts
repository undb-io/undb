import type { Client } from "@libsql/client"
import { LibsqlDialect } from "@libsql/kysely-libsql"
import { Database as SqliteDatabase } from "bun:sqlite"
import { Kysely, sql, type RawBuilder } from "kysely"
import { BunSqliteDialect } from "kysely-bun-sqlite"
import { createQueryBuilderWithDialect } from "./qb.util"

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

export function json<T>(value: T): RawBuilder<T> {
  return sql`${JSON.stringify(value)}`
}
