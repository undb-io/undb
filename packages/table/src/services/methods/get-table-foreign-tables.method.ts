import { Some } from "@undb/domain"
import { WithTableForeignTablesSpec } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableQueryService } from "../table.query-service"

export async function getTableForeignTablesMethod(this: TableQueryService, tableId: string) {
  const spec = new WithTableForeignTablesSpec(new TableIdVo(tableId))
  return this.repo.find(Some(spec))
}
