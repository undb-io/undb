import { inject } from "@undb/di"

export const QUERY_BUILDER = Symbol("queryBuilder")

export const injectQueryBuilder = () => inject(QUERY_BUILDER)
