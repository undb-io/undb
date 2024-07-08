import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, RecordIdVO, type IBulkDuplicateRecordsDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkduplicateRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: IBulkDuplicateRecordsDTO,
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const recordIds = dto.ids.map((id) => new RecordIdVO(id))
  const records = await this.repo.findByIds(table, recordIds)

  for (const record of records) {
    record.duplicate(table)
  }

  const duplicated = records.map((r) => r.duplicate(table))
  await this.repo.bulkInsert(table, duplicated)

  return duplicated
}
