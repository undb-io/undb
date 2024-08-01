import { Some } from "@undb/domain"
import { WithForeignRollupFieldSpec } from "../../specifications"
import type { TableQueryService } from "../table.query-service"

export async function getRollupForeignTablesMethod(this: TableQueryService, tableId: string, fieldId: string) {
  const spec = new WithForeignRollupFieldSpec(fieldId)
  return this.repo.find(Some(spec))
}
