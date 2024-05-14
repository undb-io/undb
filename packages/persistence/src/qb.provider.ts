import { container, inject, instanceCachingFactory } from "@undb/di"
import type Database from "bun:sqlite"
import { SQLITE_DATABSE } from "./db.provider"
import { createQueryBuilder } from "./qb"

const QUERY_BUILDER = Symbol("queryBuilder")

container.register(QUERY_BUILDER, {
  useFactory: instanceCachingFactory((c) => {
    const db = c.resolve(SQLITE_DATABSE) as Database
    return createQueryBuilder(db)
  }),
})

export const injectQueryBuilder = () => inject(QUERY_BUILDER)
