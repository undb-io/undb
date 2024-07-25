import { None, Some, type PaginatedDTO } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications/table-name.specification"
import { ViewIdVo } from "../../../views"
import type { IGetRecordsDTO } from "../../dto"
import { buildQuery, type IRecordReadableValueDTO } from "../../record"
import { recordsToReadable } from "../../record.util"
import type { RecordsQueryService } from "../records.query-service"

export async function getReadableRecords(
  this: RecordsQueryService,
  dto: IGetRecordsDTO,
): Promise<PaginatedDTO<IRecordReadableValueDTO>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildQuery(table, dto)
  const data = await this.repo.find(table, viewId, query)
  const readable = recordsToReadable(table, data.values)
  return {
    total: data.total,
    values: readable,
  }
}
