import { None, Some, type PaginatedDTO } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { TableDo } from "../../../../table.do"
import { ViewIdVo } from "../../../views"
import type { IGetRecordsDTO } from "../../dto"
import { buildQuery, type IRecordDTO } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

async function populateAttachment(
  this: RecordsQueryService,
  dto: IGetRecordsDTO,
  table: TableDo,
  records: IRecordDTO[],
): Promise<IRecordDTO[]> {
  return Promise.all(
    records.map(async (record) => {
      const values = await this.populateAttachment(dto, table, record.values)
      return {
        ...record,
        values,
      }
    }),
  )
}

export async function getRecords(this: RecordsQueryService, dto: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")

  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  const query = buildQuery(table, dto)

  const records = await this.repo.find(table, viewId, query)
  return {
    ...records,
    values: await populateAttachment.call(this, dto, table, records.values),
  }
}
