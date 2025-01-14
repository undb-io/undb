import { inject } from "@undb/di"

export const DB_PROVIDER = Symbol.for("DB_PROVIDER")

export const injectDbProvider = () => inject(DB_PROVIDER)
