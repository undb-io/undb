import { singleton } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import { sql } from "kysely"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class DatabaseUnitOfWork implements IUnitOfWork<IQueryBuilder> {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async begin(): Promise<void> {
    await sql<any>`BEGIN;`.execute(this.qb)
  }
  async commit(): Promise<void> {
    await sql<any>`COMMIT;`.execute(this.qb)
  }
  async rollback(): Promise<void> {
    await sql<any>`ROLLBACK;`.execute(this.qb)
  }
  conn() {
    return this.qb
  }
}
