import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, type ICreateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function createRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: ICreateRecordDTO[],
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const records = dto.map((record) => RecordDO.create(table, record))
  await this.repo.bulkInsert(table, records)

  return records
}
