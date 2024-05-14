import { singleton } from "@undb/di"
import type { TableDo } from "@undb/table"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"

@singleton()
export class UnderlyingTableService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async create(table: TableDo) {
    const t = new UnderlyingTable(table)
    return this.qb.schema
      .createTable(t.name)
      .addColumn("auto_increament", "integer", (b) => b.autoIncrement().primaryKey())
      .addColumn("id", "varchar(50)", (b) => b.notNull().unique())
      .$call((tb) => {
        const visitor = new UnderlyingTableFieldVisitor(tb)
        for (const field of table.schema) {
          field.accept(visitor)
        }
        return visitor.tb
      })
      .execute()
  }
}
