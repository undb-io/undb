import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, RecordIdVO, type IDuplicateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function duplicateRecordMethod(
  this: RecordsService,
  tableId: string,
  dto: IDuplicateRecordDTO,
): Promise<RecordDO> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")
  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).unwrap()

  const duplicated = record.duplicate(table)
  await this.repo.insert(table, duplicated)

  return record
}
