import { Record as CoreRecord, Table } from '@undb/core'

export class SearchTableRecord {
  public readonly value: Record<string, string>
  constructor(table: Table, record: CoreRecord) {
    const searchableFields = table.schema.searchableFields
    const result: Record<string, string> = {}

    for (const field of searchableFields) {
      const value = record.values.getUnpackedValue(field.id.value).into(null)
      if (value) {
        result[field.id.value] = value.toString()
      }
    }

    this.value = result
  }
}
