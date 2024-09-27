import { and, Option } from "@undb/domain"
import type { TableDo } from "../../../../table.do"
import { ReferenceEqual, ReferenceFieldValue } from "../../../schema"
import type { RecordComositeSpecification, RecordDO } from "../../record"
import type { RecordsService } from "../records.service"

export async function createTablesRecordsMethod(
  this: RecordsService,
  input: { table: TableDo; records: RecordDO[] }[],
): Promise<void> {
  for (const { table, records } of input) {
    await this.repo.bulkInsert(table, records)
  }

  for (const { table, records } of input) {
    const referenceFields = table.schema.getReferenceFields()
    for (const record of records) {
      let specs: RecordComositeSpecification[] = []
      for (const field of referenceFields) {
        const value = record.getValue(field.id)
        if (value.isNone()) {
          continue
        }
        const referecneValue = value.unwrap() as ReferenceFieldValue
        if (referecneValue.value?.length) {
          const spec = new ReferenceEqual(value.unwrap() as ReferenceFieldValue, field.id)
          specs.push(spec)
        }
      }

      if (specs.length) {
        const spec = and(...specs) as Option<RecordComositeSpecification>
        await this.repo.updateOneById(table, record, spec)
      }
    }
  }
}
