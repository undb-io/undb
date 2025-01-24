import { inject, injectable } from "@undb/di"

export const DB_PROVIDER = Symbol.for("DB_PROVIDER")

export const injectDbProvider = () => inject(DB_PROVIDER)

export interface IDbProvider {
  getDbProvider(): string

  isPostgres(): boolean
  isMysql(): boolean
  isSqlite(): boolean
}

@injectable()
export class DbProviderService implements IDbProvider {
  constructor(@inject(DB_PROVIDER) private readonly dbProvider: string) {}

  getDbProvider(): string {
    return this.dbProvider
  }
  #is(dbProvider: string) {
    return this.dbProvider === dbProvider
  }
  isPostgres(): boolean {
    return this.#is("postgres")
  }
  isSqlite(): boolean {
    return this.#is("sqlite") || this.#is("turso") || !this.dbProvider
  }
  isMysql(): boolean {
    return this.#is("mysql")
  }
}
