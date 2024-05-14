import { inject } from "@undb/di"

export const TABLE_REPOSITORY = Symbol("TABLE_REPOSITORY")
export const injectTableRepository = () => inject(TABLE_REPOSITORY)
