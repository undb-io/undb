import { TableIdVo } from "../../table-id.vo"
import type { TableQueryService } from "../table.query-service"

export async function getTableMethod(this: TableQueryService, id: string) {
  const tableId = new TableIdVo(id)
  return (await this.repo.findOneById(tableId)).expect("not found table")
}
