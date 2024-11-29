import { None, Some, type Option } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { getSpec, replaceCondtionFieldNameWithFieldId } from "../../../schema/fields/condition"
import { RecordComositeSpecification, RecordDO, type IBulkUpdateRecordsDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkUpdateRecordsMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: IBulkUpdateRecordsDTO,
): Promise<RecordDO[]> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")

  let filter = dto.filter
  if (dto.isOpenapi && filter) {
    filter = replaceCondtionFieldNameWithFieldId(filter, table.schema)
  }

  const spec = (filter ? getSpec(table.schema, filter) : None) as Option<RecordComositeSpecification>

  const records = await this.repo.find(table, spec)
  if (records.length === 0) {
    return []
  }

  const updates = records
    .map((record) => record.update(table, dto.values))
    .map((spec) => spec.into(undefined))
    .filter((s) => !!s)
  if (!updates.length) {
    return []
  }

  const update = updates[0]

  await this.repo.bulkUpdate(table, spec, update, records)

  return records
}
