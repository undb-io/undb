import type { Option } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { getSpec } from "../../../schema/fields/condition"
import { RecordComositeSpecification, RecordDO, type IBulkUpdateRecordsDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkUpdateRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: IBulkUpdateRecordsDTO,
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  const spec = getSpec(table.schema.fieldMapById, dto.filter) as Option<RecordComositeSpecification>

  if (spec.isNone()) {
    throw new Error("Invalid filter")
  }

  const records = await this.repo.find(table, spec.unwrap())
  if (records.length === 0) {
    return []
  }

  const updates = records.map((record) => record.update(table, dto.values)).map((spec) => spec.unwrap())
  const update = updates[0]

  await this.repo.bulkUpdate(table, spec.unwrap(), update)

  return records
}
