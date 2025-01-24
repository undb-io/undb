import { createClient } from "@libsql/client"
import { inject } from "@undb/di"
import Database from "bun:sqlite"
import mysql from "mysql2/promise"
import postgres from "postgres"

export const DATABASE_CLIENT = Symbol.for("DATABASE_CLIENT")

export const injectDatabaseClient = () => inject(DATABASE_CLIENT)

export const createTursoClient = (url: string, authToken?: string) => {
  return createClient({ url, authToken })
}

export const createSqliteClient = (fileName: string): Database => {
  return new Database(fileName)
}

export const createPostgresClient = (connectionString: string) => {
  return postgres(connectionString)
}

export const createMysqlClient = (connectionString: string): mysql.Pool => {
  return mysql.createPool(connectionString)
}
