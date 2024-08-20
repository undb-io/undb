import { Some, type PaginatedDTO } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications/table-name.specification"
import type { IGetRecordsDTO } from "../../dto"
import { buildQuery, type IReadableRecordDTO } from "../../record"
import { recordsToReadable } from "../../record.util"
import type { RecordsQueryService } from "../records.query-service"

export async function getReadableRecords(
  this: RecordsQueryService,
  dto: IGetRecordsDTO,
): Promise<PaginatedDTO<IReadableRecordDTO>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const view = table.views.getViewByNameOrId(dto.viewName, dto.viewId)

  const query = buildQuery(table, dto)
  const data = await this.repo.find(table, view, query)
  const values = await this.populateAttachments({}, table, data.values)
  const readable = recordsToReadable(table, values)
  return {
    total: data.total,
    values: readable,
  }
}
