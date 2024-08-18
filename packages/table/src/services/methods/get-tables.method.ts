import { None, Option, Some } from "@undb/domain"
import { TableBaseIdSpecification, type TableComositeSpecification } from "../../specifications"
import type { TableQueryService } from "../table.query-service"

export async function getTablesMethod(this: TableQueryService, baseId?: string) {
  let spec: Option<TableComositeSpecification> = None

  if (baseId) {
    spec = Some(new TableBaseIdSpecification(baseId))
  }

  return this.repo.find(spec)
}
