import { None, Some } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { ViewIdVo } from "../../../views"
import type { IGetRecordsDTO, IRecordsDTO } from "../../dto"
import type { Query } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function getRecords(
  this: RecordsQueryService,
  dto: IGetRecordsDTO,
): Promise<{ total: number; records: IRecordsDTO }> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildQuery(dto)
  return this.repo.find(table, viewId, query)
}

function buildQuery(dto: IGetRecordsDTO) {
  const query: Query = {
    filter: None,
    select: None,
    pagination: None,
  }

  if (dto.pagination) {
    query.pagination = Some(dto.pagination)
  }
  return Some(query)
}
