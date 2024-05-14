import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, type ICreateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function createRecordMethod(
  this: RecordsService,
  tableId: string,
  dto: ICreateRecordDTO,
): Promise<RecordDO> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const record = RecordDO.create(table, dto)
  await this.repo.insert(table, record)

  return record
}
