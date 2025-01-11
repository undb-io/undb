import { createClient } from "@libsql/client"
import { inject } from "@undb/di"
import Database from "bun:sqlite"

export const DATABASE_CLIENT = Symbol.for("DATABASE_CLIENT")

export const injectDatabaseClient = () => inject(DATABASE_CLIENT)

export const createTursoClient = (url: string, authToken?: string) => {
  return createClient({ url, authToken })
}

export const createSqliteClient = (fileName: string): Database => {
  return new Database(fileName)
}
