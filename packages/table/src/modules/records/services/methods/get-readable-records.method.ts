import { None, Some, type PaginatedDTO } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { ViewIdVo } from "../../../views"
import type { IGetRecordsDTO } from "../../dto"
import { buildQuery, type IRecordReadableDTO } from "../../record"
import { recordsToReadable } from "../../record.util"
import type { RecordsQueryService } from "../records.query-service"

export async function getReadableRecords(
  this: RecordsQueryService,
  dto: IGetRecordsDTO,
): Promise<PaginatedDTO<IRecordReadableDTO>> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildQuery(dto)
  const data = await this.repo.find(table, viewId, query)
  return {
    total: data.total,
    values: recordsToReadable(table, data.values),
  }
}
