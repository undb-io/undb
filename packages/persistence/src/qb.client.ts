import { drizzle } from "drizzle-orm/sql-js"
import { DummyDriver, type Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely"
import { SqlJsDialect } from "kysely-wasm"
import InitSqlJs from "sql.js"
import { migrate } from "./migrate.client"
import type { IQueryBuilder } from "./qb.type"
import { createQueryBuilderWithDialect } from "./qb.util"

export const createSqljsDatabase = async () => {
  const SQL = await InitSqlJs({
    locateFile: (file) => `/${file}`,
  })
  return new SQL.Database()
}

export const createDrizzleDatabase = async (db: InitSqlJs.Database) => {
  return drizzle(db)
}

export const createSqljsQueryBuilder = async (db?: InitSqlJs.Database): Promise<IQueryBuilder> => {
  if (!db) {
    db = await createSqljsDatabase()
  }

  const dialect = new SqlJsDialect({
    async database() {
      return db
    },
    onWrite: {
      func: (buffer) => {},
      isThrottle: true,
    },
  })

  const drizzleDB = await createDrizzleDatabase(db)

  migrate(drizzleDB)

  return createQueryBuilderWithDialect(dialect)
}

export const createDummyQueryBuilder = (): IQueryBuilder => {
  return createQueryBuilderWithDialect({
    createAdapter() {
      return new SqliteAdapter()
    },
    createDriver() {
      return new DummyDriver()
    },
    createIntrospector(db: Kysely<unknown>) {
      return new SqliteIntrospector(db)
    },
    createQueryCompiler() {
      return new SqliteQueryCompiler()
    },
  })
}
