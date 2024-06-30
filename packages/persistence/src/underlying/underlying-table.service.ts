import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { TableComositeSpecification, TableDo } from "@undb/table"
import type { CompiledQuery } from "kysely"
import { all } from "radash"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"
import { UnderlyingTableSpecVisitor } from "./underlying-table-spec.visitor"

@singleton()
export class UnderlyingTableService {
  readonly logger = createLogger(UnderlyingTableService.name)

  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async create(table: TableDo) {
    const t = new UnderlyingTable(table)
    const sql: CompiledQuery[] = []
    await this.qb.schema
      .createTable(t.name)
      .$call((tb) => {
        const visitor = new UnderlyingTableFieldVisitor(this.qb, t, tb)
        for (const field of table.schema) {
          field.accept(visitor)
        }
        sql.push(...visitor.sql)
        return visitor.tb
      })
      .execute()

    await all(sql.map((query) => this.qb.executeQuery(query)))
  }

  async update(table: TableDo, spec: TableComositeSpecification) {
    const t = new UnderlyingTable(table)

    const visitor = new UnderlyingTableSpecVisitor(t, this.qb)
    spec.accept(visitor)

    await visitor.execute()
  }
}
