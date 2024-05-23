import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, RecordIdVO, type IUpdateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function updateRecordMethod(
  this: RecordsService,
  tableId: string,
  dto: IUpdateRecordDTO,
): Promise<RecordDO> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).unwrap()

  const spec = record.update(table, dto.values)
  await this.repo.updateOneById(table, record, spec)

  return record
}
