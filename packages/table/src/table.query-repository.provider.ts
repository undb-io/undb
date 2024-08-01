import { inject } from "@undb/di"

export const TABLE_QUERY_REPOSITORY = Symbol("TABLE_QUERY_REPOSITORY")
export const injectTableQueryRepository = () => inject(TABLE_QUERY_REPOSITORY)
