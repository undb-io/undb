import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { RecordDO, RecordIdVO, type IDeleteRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function deleteRecordMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: IDeleteRecordDTO,
): Promise<RecordDO> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id))).unwrap()
  record.delete(table)

  await this.repo.deleteOneById(table, record)

  return record
}
