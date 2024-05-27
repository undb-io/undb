import { TableIdVo } from "../../../../table-id.vo"
import { RecordDO, RecordIdVO, type IDeleteRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function deleteRecordMethod(
  this: RecordsService,
  tableId: string,
  dto: IDeleteRecordDTO,
): Promise<RecordDO> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).unwrap()
  record.delete(table)

  await this.repo.deleteOneById(table, record)

  return record
}
