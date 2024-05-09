import { createLogger } from '@undb/logger'
import type Database from 'bun:sqlite'
import { Kysely } from 'kysely'
import { BunSqliteDialect } from 'kysely-bun-sqlite'

export function createQueryBuilder(db: Database): Kysely<unknown> {
  const logger = createLogger('qb')

  return new Kysely({
    dialect: new BunSqliteDialect({
      database: db,
    }),
    log: (event) => {
      if (event.level == 'query') {
        logger.debug({
          query: event.query.sql,
          params: event.query.parameters,
          duration: event.queryDurationMillis,
        })
      } else if (event.level == 'error') {
        logger.error({
          error: event.error,
          query: event.query.sql,
          params: event.query.parameters,
          duration: event.queryDurationMillis,
        })
      }
    },
  })
}

export type IQueryBuilder = Kysely<any>
