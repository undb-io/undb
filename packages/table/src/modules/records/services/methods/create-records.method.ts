import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { RecordDO, type ICreateRecordDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function createRecordsMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: ICreateRecordDTO[],
): Promise<RecordDO[]> {
  const spec = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")

  const records = dto.map((record) => RecordDO.create(table, record))
  await this.repo.bulkInsert(table, records)

  return records
}
