import { type PaginatedDTO, Some } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { IGetRecordsDTO } from "../../dto"
import { type IRecordDTO, buildQuery } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function getRecords(this: RecordsQueryService, dto: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")

  const table = (await this.tableRepository.findOne(Some(spec))).expect(
    `Table not found with unique table specification ${JSON.stringify(dto)}`,
  )
  const view = table.views.getViewByNameOrId(dto.viewName, dto.viewId)

  const query = buildQuery(table, dto)

  const records = await this.repo.find(table, view, query)
  return {
    ...records,
    values: await this.populateAttachments(dto, table, records.values),
  }
}
