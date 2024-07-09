import { None, Some } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { ViewIdVo } from "../../../views"
import type { ICountRecordsDTO } from "../../dto"
import { buildCountQuery } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function countRecords(this: RecordsQueryService, dto: ICountRecordsDTO): Promise<number> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildCountQuery(table, dto)

  return this.repo.count(table, viewId, query)
}
