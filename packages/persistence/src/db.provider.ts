import { inject, singleton } from "@undb/di"

export const DB_PROVIDER = Symbol.for("DB_PROVIDER")

export const injectDbProvider = () => inject(DB_PROVIDER)

export interface IDbProvider {
  getDbProvider(): string

  get not(): this

  isPostgres(): boolean
  isMysql(): boolean
  isSqlite(): boolean
}

@singleton()
export class DbProviderService implements IDbProvider {
  constructor(@inject(DB_PROVIDER) private readonly dbProvider: string) {}

  #isNot: boolean = false

  get not(): this {
    this.#isNot = true
    return this
  }

  getDbProvider(): string {
    return this.dbProvider
  }
  #is(dbProvider: string) {
    return this.#isNot ? this.dbProvider !== dbProvider : this.dbProvider === dbProvider
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
