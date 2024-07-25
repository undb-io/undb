import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { RecordDO, RecordIdVO, type IUpdateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function updateRecordMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: IUpdateRecordDTO,
): Promise<RecordDO> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).expect("Record not found: " + dto.id)

  const spec = record.update(table, dto.values)
  await this.repo.updateOneById(table, record, spec)

  return record
}
