import { inject } from "@undb/di"

export const DB_UNIT_OF_WORK_PROVIDER = Symbol.for("DB_UNIT_OF_WORK_PROVIDER")

export const injectDbUnitOfWorkProvider = () => inject(DB_UNIT_OF_WORK_PROVIDER)
