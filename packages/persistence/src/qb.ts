import { LibsqlDialect } from "@libsql/kysely-libsql"
import { createLogger } from "@undb/logger"
import { Kysely } from "kysely"

export function createQueryBuilder(): Kysely<unknown> {
  const logger = createLogger("qb")

  return new Kysely({
    dialect: new LibsqlDialect({
      url: "http://localhost:8080",
    }),

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

export type IQueryBuilder = Kysely<any>
