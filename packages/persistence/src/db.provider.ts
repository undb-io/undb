import { container, inject } from "@undb/di"
import { db } from "./db"

export const DB = Symbol.for("db")
export const injectDb = () => inject(DB)
container.register(DB, { useValue: db })
