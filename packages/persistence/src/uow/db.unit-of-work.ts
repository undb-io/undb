import { singleton } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import type { Database } from "bun:sqlite"
import { injectSqlite } from "../db.provider"

@singleton()
export class DatabaseUnitOfWork implements IUnitOfWork<Database> {
  constructor(
    @injectSqlite()
    private readonly sqlite: Database,
  ) {}
  async begin(): Promise<void> {
    this.sqlite.query("BEGIN").run()
  }
  async commit(): Promise<void> {
    this.sqlite.query("COMMIT").run()
  }
  async rollback(): Promise<void> {
    this.sqlite.query("ROLLBACK").run()
  }
  conn() {
    return this.sqlite
  }
  async close(): Promise<void> {
    this.sqlite.close()
  }
}
