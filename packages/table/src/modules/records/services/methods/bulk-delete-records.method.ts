import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { getSpec, replaceCondtionFieldNameWithFieldId } from "../../../schema/fields/condition"
import type { IBulkDeleteRecordsDTO, RecordComositeSpecification, RecordDO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkdeleteRecordsMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: IBulkDeleteRecordsDTO,
): Promise<RecordDO[]> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")

  let filter = dto.filter
  if (dto.isOpenapi) {
    filter = replaceCondtionFieldNameWithFieldId(filter, table.schema)
  }

  const spec = getSpec(table.schema, filter).expect("Invalid filter") as RecordComositeSpecification

  const records = await this.repo.find(table, Some(spec))

  for (const record of records) {
    record.delete(table)
  }

  await this.repo.deleteByIds(table, records)

  return records
}
