import type { Client } from "@libsql/client"
import { LibsqlDialect } from "@libsql/kysely-libsql"
import { Database as SqliteDatabase } from "bun:sqlite"
import { PostgresDialect } from "kysely"
import { BunSqliteDialect } from "kysely-bun-sqlite"
import pg from "pg"
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

export function createPostgresQueryBuilder(pg: pg.Pool) {
  return createQueryBuilderWithDialect(
    new PostgresDialect({
      pool: pg,
    }),
  )
}
