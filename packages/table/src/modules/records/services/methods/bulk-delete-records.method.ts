import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, RecordIdVO, type IBulkDeleteRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkdeleteRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: IBulkDeleteRecordDTO,
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const recordIds = dto.ids.map((id) => new RecordIdVO(id))
  const records = await this.repo.findByIds(table, recordIds)

  for (const record of records) {
    record.delete(table)
  }

  await this.repo.deleteByIds(table, records)

  return records
}
