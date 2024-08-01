import { inject } from "@undb/di"

export const LOGGER = Symbol.for("logger")
export const injectLogger = () => inject(LOGGER)
