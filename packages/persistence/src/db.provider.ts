import { inject, singleton } from "@undb/di"

export const DB_PROVIDER = Symbol.for("DB_PROVIDER")

export const injectDbProvider = () => inject(DB_PROVIDER)

export interface IDbProvider {
  getDbProvider(): string

  isPostgres(): boolean
  isSqlite(): boolean
}

@singleton()
export class DbProviderService implements IDbProvider {
  constructor(@inject(DB_PROVIDER) private readonly dbProvider: string) {}
  getDbProvider(): string {
    return this.dbProvider
  }
  isPostgres(): boolean {
    return this.dbProvider === "postgres"
  }
  isSqlite(): boolean {
    return this.dbProvider === "sqlite" || this.dbProvider === "turso" || !this.dbProvider
  }
}
