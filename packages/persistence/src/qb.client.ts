import { SqlJsDialect } from "kysely-wasm"
import InitSqlJs from "sql.js"
import { createQueryBuilderWithDialect } from "./qb.util"

export const createSqljsQueryBuilder = async () => {
  const SQL = await InitSqlJs({
    locateFile: (file) => `/${file}`,
  })
  const db = new SQL.Database()
  const dialect = new SqlJsDialect({
    async database() {
      return db
    },
    onWrite: {
      func(buffer) {
        console.log(`size: ${buffer.length}`)
      },
      isThrottle: true,
    },
  })

  return createQueryBuilderWithDialect(dialect)
}
