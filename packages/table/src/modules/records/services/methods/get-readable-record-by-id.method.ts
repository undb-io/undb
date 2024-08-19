import { None, Option, Some } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { IGetRecordByIdDTO } from "../../dto"
import { RecordIdVO, type IRecordReadableValueDTO } from "../../record"
import { recordToReadable } from "../../record.util"
import type { RecordsQueryService } from "../records.query-service"

export async function getReadableRecordById(
  this: RecordsQueryService,
  dto: IGetRecordByIdDTO,
): Promise<Option<IRecordReadableValueDTO>> {
  const spec = withUniqueTable(dto).unwrap()
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.id), None)).into(undefined)
  if (!record) {
    return None
  }
  const values = await this.populateAttachment(dto, table, record.values)

  return Some(recordToReadable(table, { ...record, values }))
}
