import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { type IDuplicateRecordDTO, type RecordDO, RecordIdVO } from "../../record"
import type { RecordsService } from "../records.service"

export async function duplicateRecordMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: IDuplicateRecordDTO,
): Promise<RecordDO> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")
  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).unwrap()

  const duplicated = record.duplicate(table)
  await this.repo.insert(table, duplicated)

  return duplicated
}
