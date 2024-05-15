import { Database } from "bun:sqlite"
import { singleton } from "@undb/di"
import type { TableDo } from "@undb/table"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"
import { injectSqlite } from "../db.provider"

@singleton()
export class UnderlyingTableService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectSqlite()
    private readonly sqlite: Database,
  ) {}

  async create(table: TableDo) {
    const t = new UnderlyingTable(table)
    const queies: string[] = []
    await this.qb.schema
      .createTable(t.name)
      .$call((tb) => {
        const visitor = new UnderlyingTableFieldVisitor(t, tb)
        for (const field of table.schema) {
          field.accept(visitor)
        }
        queies.push(...visitor.rawSQL)
        return visitor.tb
      })
      .execute()

    for (const query of queies) {
      this.sqlite.query(query).run()
    }
  }
}
