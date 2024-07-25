import { None, Some, type PaginatedDTO } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import { ViewIdVo } from "../../../views"
import type { IGetRecordsDTO } from "../../dto"
import { buildQuery, type IRecordDTO } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function getRecords(this: RecordsQueryService, dto: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")

  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildQuery(table, dto)

  return this.repo.find(table, viewId, query)
}
