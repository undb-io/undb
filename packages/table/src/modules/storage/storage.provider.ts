import { inject } from "@undb/di"

export const OBJECT_STORAGE = Symbol("OBJECT_STORAGE")

export const injectObjectStorage = () => inject(OBJECT_STORAGE)
