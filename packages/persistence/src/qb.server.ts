import type { Client } from "@libsql/client"
import { LibsqlDialect } from "@libsql/kysely-libsql"
import { Database as SqliteDatabase } from "bun:sqlite"
import { MysqlDialect } from "kysely"
import { BunSqliteDialect } from "kysely-bun-sqlite"
import { PostgresJSDialect } from "kysely-postgres-js"
import mysql from "mysql2/promise"
import postgres from "postgres"
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

export function createPostgresQueryBuilder(pg: postgres.Sql) {
  return createQueryBuilderWithDialect(
    new PostgresJSDialect({
      postgres: pg,
    }),
  )
}

export function createMysqlQueryBuilder(mysql: mysql.Pool) {
  return createQueryBuilderWithDialect(
    new MysqlDialect({
      pool: mysql,
    }),
  )
}
