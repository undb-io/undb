import { container, inject } from "@undb/di"
import { db, sqlite } from "./db"

export const DB = Symbol.for("db")

export const injectDb = () => inject(DB)
container.register(DB, {
  useValue: db,
})

export const SQLITE_DATABSE = Symbol.for("SQLITE_DATABASE")
container.register(SQLITE_DATABSE, { useValue: sqlite })
