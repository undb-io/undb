import { createClient } from "@libsql/client"
import { inject } from "@undb/di"
import Database from "bun:sqlite"

export const SQLITE_CLIENT = Symbol.for("SQLITE_CLIENT")

export const injectSqliteClient = () => inject(SQLITE_CLIENT)

export const createTursoClient = (url: string, authToken?: string) => {
  return createClient({ url, authToken })
}

export const createSqliteClient = (fileName: string): Database => {
  return new Database(fileName)
}
