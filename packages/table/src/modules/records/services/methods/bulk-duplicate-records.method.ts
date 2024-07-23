import { TableIdVo } from "../../../../table-id.vo"
import { getSpec, replaceCondtionFieldNameWithFieldId } from "../../../schema/fields/condition/condition.util"
import { RecordComositeSpecification, RecordDO, type IBulkDuplicateRecordsDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function bulkduplicateRecordsMethod(
  this: RecordsService,
  tableId: string,
  dto: IBulkDuplicateRecordsDTO,
): Promise<RecordDO[]> {
  const id = new TableIdVo(tableId)
  const table = (await this.tableRepository.findOneById(id)).expect("Table not found")

  let filter = dto.filter
  if (dto.isOpenapi) {
    filter = replaceCondtionFieldNameWithFieldId(filter, table.schema)
  }

  const spec = getSpec(table.schema, filter).expect("Invalid filter") as RecordComositeSpecification
  const records = await this.repo.find(table, spec)

  const duplicated = records.map((r) => r.duplicate(table))
  await this.repo.bulkInsert(table, duplicated)

  return duplicated
}
