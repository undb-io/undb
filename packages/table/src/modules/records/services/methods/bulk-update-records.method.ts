import type { Option } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { getSpec, replaceCondtionFieldNameWithFieldId } from "../../../schema/fields/condition"
import { RecordComositeSpecification, RecordDO, type IBulkUpdateRecordsDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkUpdateRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: IBulkUpdateRecordsDTO,
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  let filter = dto.filter
  if (dto.isOpenapi) {
    filter = replaceCondtionFieldNameWithFieldId(filter, table.schema)
  }

  const spec = getSpec(table.schema, filter) as Option<RecordComositeSpecification>

  if (spec.isNone()) {
    throw new Error("Invalid fjjilter")
  }

  const records = await this.repo.find(table, spec.unwrap())
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
