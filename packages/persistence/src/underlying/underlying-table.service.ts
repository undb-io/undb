import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { TableComositeSpecification, TableDo } from "@undb/table"
import type { CompiledQuery } from "kysely"
import { all } from "radash"
import { getCurrentTransaction } from "../ctx"
import { UnderlyingTable } from "./underlying-table"
import { UnderlyingTableFieldVisitor } from "./underlying-table-field.visitor"
import { UnderlyingTableSpecVisitor } from "./underlying-table-spec.visitor"

@singleton()
export class UnderlyingTableService {
  readonly logger = createLogger(UnderlyingTableService.name)

  async create(table: TableDo) {
    const t = new UnderlyingTable(table)
    const trx = getCurrentTransaction()
    const sql: CompiledQuery[] = []
    await trx.schema
      .createTable(t.name)
      .$call((tb) => {
        const visitor = new UnderlyingTableFieldVisitor(trx, t, tb)
        for (const field of table.schema) {
          field.accept(visitor)
        }
        sql.push(...visitor.sql)
        return visitor.tb
      })
      .execute()

    await all(sql.map((query) => trx.executeQuery(query)))
  }

  async update(table: TableDo, spec: TableComositeSpecification) {
    const t = new UnderlyingTable(table)
    const trx = getCurrentTransaction()

    const visitor = new UnderlyingTableSpecVisitor(t, trx)
    spec.accept(visitor)

    await visitor.execute()
  }
}
