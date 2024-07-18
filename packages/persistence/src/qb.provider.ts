import { container, inject, instanceCachingFactory } from "@undb/di"
import { createQueryBuilder } from "./qb"

export const QUERY_BUILDER = Symbol("queryBuilder")

container.register(QUERY_BUILDER, {
  useFactory: instanceCachingFactory((c) => {
    return createQueryBuilder()
  }),
})

export const injectQueryBuilder = () => inject(QUERY_BUILDER)
